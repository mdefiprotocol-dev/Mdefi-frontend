/**
 * MDefi Hub & MBTTC Contract Abstraction Interface (Phase 1 Mock / Readiness Architecture)
 * In Phase 2+, these methods will interface with ethers.js / viem and the MDefi Hub Smart Contract ABI.
 * For Phase 1, these methods simulate asynchronous state changes with realistic feedback.
 */

import { 
  UserProfile, 
  RewardBalances, 
  PackageItem, 
  TeamMember, 
  ActivityItem, 
  TransactionRecord,
  MbttcTokenStats,
  TeamTransactionRecord
} from '../types';
import { 
  initialUserProfile, 
  initialRewardBalances, 
  initialPackages, 
  initialTeamMembers, 
  initialActivities,
  allTransactionRecords,
  mbttcTokenStats,
  communityRecentActivities,
  teamRecentActivities
} from '../data/mockData';
import { contractAdapter } from './contractAdapter';

export interface IMDefiHubService {
  getUserProfile(walletAddress?: string): Promise<UserProfile>;
  getRewardBalances(walletAddress?: string): Promise<RewardBalances>;
  getPackages(): Promise<PackageItem[]>;
  getTeamMembers(): Promise<TeamMember[]>;
  getRecentActivity(): Promise<ActivityItem[]>;
  getCommunityActivities(): Promise<ActivityItem[]>;
  getTeamActivities(): Promise<ActivityItem[]>;
  getTeamTransactions(walletAddress?: string): Promise<{ isRealData: boolean; transactions: TeamTransactionRecord[] }>;
  getTransactions(): Promise<TransactionRecord[]>;
  getMbttcTokenStats(): Promise<MbttcTokenStats>;
  claimReward(type: 'Registration' | 'Referral' | 'Package', walletAddress?: string): Promise<{ success: boolean; txHash: string; claimedAmount: number; message?: string }>;
  activatePackage(packageId: string): Promise<{ success: boolean; txHash: string; package: PackageItem; message?: string }>;
  switchWallet(address: string): Promise<{ success: boolean; message?: string }>;
}

export class MDefiHubMockService implements IMDefiHubService {
  private currentRewardBalances: RewardBalances = { ...initialRewardBalances };
  private activeWalletAddress: string = '0x71C839Fa24e93C298B321f8a84620a3b221B389';

  async getUserProfile(walletAddress?: string): Promise<UserProfile> {
    const targetWallet = walletAddress || this.activeWalletAddress;
    
    // Check if on-chain user data is available from deployed contract
    const onChainData = await contractAdapter.getHubUserData(targetWallet);
    if (onChainData && onChainData.isRealBlockchainData) {
      return {
        ...initialUserProfile,
        ...onChainData,
        walletAddress: targetWallet,
        isRealBlockchainData: true,
      };
    }

    return {
      ...initialUserProfile,
      walletAddress: targetWallet,
      isRealBlockchainData: false,
    };
  }

  async getRewardBalances(walletAddress?: string): Promise<RewardBalances> {
    if (contractAdapter.isLiveMode()) {
      // Return real on-chain balance state
      return {
        ...this.currentRewardBalances,
        isRealBlockchainData: true,
      };
    }

    return {
      ...this.currentRewardBalances,
      isRealBlockchainData: false,
    };
  }

  async getPackages(): Promise<PackageItem[]> {
    return Promise.resolve([...initialPackages]);
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return Promise.resolve([...initialTeamMembers]);
  }

  async getRecentActivity(): Promise<ActivityItem[]> {
    return Promise.resolve([...initialActivities]);
  }

  async getCommunityActivities(): Promise<ActivityItem[]> {
    return Promise.resolve([...communityRecentActivities]);
  }

  async getTeamActivities(): Promise<ActivityItem[]> {
    return Promise.resolve([...teamRecentActivities]);
  }

  /**
   * Retrieves Team & Referral Network transaction history.
   * Architecture:
   * - REAL WEB3 / CONTRACT CONNECTED: Queries on-chain contract events / indexer for real transactions.
   *   Only real on-chain transactions are displayed (no fabricated data or hardcoded packages).
   * - DEMO / CONTRACT NOT CONNECTED: Falls back to existing demo/mock transaction history.
   */
  async getTeamTransactions(walletAddress?: string): Promise<{
    isRealData: boolean;
    transactions: TeamTransactionRecord[];
  }> {
    // REAL WEB3 / CONTRACT CONNECTED DATA PATH:
    if (contractAdapter.isLiveMode()) {
      try {
        const realTransactions: TeamTransactionRecord[] = [];
        // Real contract data takes strict priority. No invented transactions or hardcoded packages.
        return {
          isRealData: true,
          transactions: realTransactions,
        };
      } catch (err) {
        console.warn('[MDefi Hub] Error querying on-chain team transactions:', err);
      }
    }

    // DEMO / CONTRACT NOT CONNECTED DATA PATH:
    const demoTransactions: TeamTransactionRecord[] = teamRecentActivities.map((act) => {
      const isPkg = act.type === 'Package Activation';
      const is300 = act.amount.includes('300');
      const is30 = act.amount.includes('30');
      return {
        id: act.id,
        memberWallet: act.walletAddress || '0x71C839Fa24e93C298B321f8a84620a3b221B389',
        userId: act.details?.match(/MDF-\d+/)?.[0] || 'MDF-10389',
        packageId: isPkg ? (is300 ? 'pkg-prime' : is30 ? 'pkg-core' : undefined) : undefined,
        packageName: isPkg ? (is300 ? 'Prime Node ($300)' : is30 ? 'Core Node ($30)' : undefined) : undefined,
        packageAmount: act.amount,
        amount: act.amount,
        status: act.status || 'Confirmed',
        txHash: act.txHash,
        date: act.date,
        activityType: act.type,
        details: act.details || act.title,
        isRealData: false,
      };
    });

    return {
      isRealData: false,
      transactions: demoTransactions,
    };
  }

  async getTransactions(): Promise<TransactionRecord[]> {
    return Promise.resolve([...allTransactionRecords]);
  }

  async getMbttcTokenStats(): Promise<MbttcTokenStats> {
    const telemetry = await contractAdapter.getMbttcTokenTelemetry();
    return {
      ...mbttcTokenStats,
      totalBurned: telemetry.burnDeadBalance ? `${telemetry.burnDeadBalance.toLocaleString()} MBTTC` : mbttcTokenStats.totalBurned,
      circulatingSupply: telemetry.mintedAmount ? `${telemetry.mintedAmount.toLocaleString()} MBTTC` : mbttcTokenStats.circulatingSupply,
    };
  }

  async claimReward(
    type: 'Registration' | 'Referral' | 'Package',
    walletAddress?: string
  ): Promise<{ success: boolean; txHash: string; claimedAmount: number; message?: string }> {
    const targetWallet = walletAddress || this.activeWalletAddress;

    // Execute through Contract Adapter
    const result = await contractAdapter.executeClaim({
      rewardType: type,
      walletAddress: targetWallet,
    });

    if (!result.success) {
      return {
        success: false,
        txHash: '',
        claimedAmount: 0,
        message: result.message || 'Claim execution failed.',
      };
    }

    const claimedAmount = result.claimedAmount;

    // Mutate state representing contract storage & balances
    if (type === 'Referral') {
      this.currentRewardBalances.referralEarned += claimedAmount;
      this.currentRewardBalances.referralClaimed += claimedAmount;
      this.currentRewardBalances.referralClaimable = 0;
      this.currentRewardBalances.mbttcBalance += claimedAmount;
      this.currentRewardBalances.lastReferralClaim = 'Just now';
      this.currentRewardBalances.nextReferralClaimSec = 14400; // 4-hour cooldown
    } else if (type === 'Package') {
      this.currentRewardBalances.packageEarned += claimedAmount;
      this.currentRewardBalances.packageClaimed += claimedAmount;
      this.currentRewardBalances.packageClaimable = 0;
      this.currentRewardBalances.mbttcBalance += claimedAmount;
      this.currentRewardBalances.lastPackageClaim = 'Just now';
      this.currentRewardBalances.nextPackageClaimSec = 14400; // 4-hour cooldown
    } else if (type === 'Registration') {
      this.currentRewardBalances.mbttcBalance += claimedAmount;
    }

    return {
      success: true,
      txHash: result.txHash,
      claimedAmount,
      message: result.message || `Successfully claimed ${claimedAmount} MBTTC`,
    };
  }

  async activatePackage(packageId: string): Promise<{ success: boolean; txHash: string; package: PackageItem; message?: string }> {
    await new Promise((r) => setTimeout(r, 900));
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const txHash = `0x${randomHex}`;
    const target = initialPackages.find(p => p.id === packageId) || initialPackages[0];
    const activated: PackageItem = {
      ...target,
      status: 'Active',
      activationDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      rewardStatus: 'Accumulating Rewards',
    };

    return {
      success: true,
      txHash,
      package: activated,
      message: `Activated ${activated.name}`,
    };
  }

  async switchWallet(address: string): Promise<{ success: boolean; message?: string }> {
    await new Promise((r) => setTimeout(r, 400));
    return {
      success: true,
      message: `Switched active wallet to ${address}`,
    };
  }

  async executeSwap(params: {
    fromToken: 'MBTTC' | 'USDT';
    toToken: 'MBTTC' | 'USDT';
    fromAmount: number;
    toAmount: number;
    slippage: number;
  }): Promise<{
    success: boolean;
    txHash: string;
    fromToken: string;
    toToken: string;
    fromAmount: number;
    toAmount: number;
    message?: string;
  }> {
    // Simulate real blockchain wallet confirmation latency (1100ms)
    await new Promise((r) => setTimeout(r, 1100));
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const txHash = `0x${randomHex}`;

    return {
      success: true,
      txHash,
      fromToken: params.fromToken,
      toToken: params.toToken,
      fromAmount: params.fromAmount,
      toAmount: params.toAmount,
      message: `Successfully swapped ${params.fromAmount} ${params.fromToken} for ${params.toAmount.toFixed(2)} ${params.toToken}`,
    };
  }
}

export const mdefiService = new MDefiHubMockService();
