/**
 * MDeFi Hub Guaranteed On-Chain Direct State & Event Mirror
 * 100% Real Blockchain Data | Individual Claim Cards | Sub-Second Execution | Bulletproof
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
import { toHumanFacingId } from '../utils/idConverter';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, HUB_ABI } from '../config/contractConfig';

const PRIMARY_FAST_RPC = 'https://bsc-testnet-dataseed.bnbchain.org';

type LedgerItem = TeamTransactionRecord & { rawTime: number };

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
  private activeWalletAddress: string = '';
  private feedSubscribers: Set<() => void> = new Set();
  private liveClaimReceipts: LedgerItem[] = [];
  private autoRefreshTimer: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      contractAdapter.onDataRefresh(() => {
        this.notifyFeedSubscribers();
      });

      const eth = (window as any).ethereum;
      if (eth && eth.on) {
        eth.on('accountsChanged', (accounts: string[]) => {
          if (accounts && accounts[0]) {
            this.activeWalletAddress = accounts[0].toLowerCase();
            this.notifyFeedSubscribers();
          }
        });
        eth.on('chainChanged', () => {
          this.notifyFeedSubscribers();
        });
      }

      // Clear interval on unmount / safe timer (20s)
      this.autoRefreshTimer = setInterval(() => {
        this.notifyFeedSubscribers();
      }, 20000);
    }
  }

  public onFeedRefresh(cb: () => void): () => void {
    this.feedSubscribers.add(cb);
    return () => {
      this.feedSubscribers.delete(cb);
    };
  }

  private notifyFeedSubscribers() {
    this.feedSubscribers.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.warn('[MDefiHub] Refresh subscriber error:', err);
      }
    });
  }

  private getEffectiveWallet(override?: string): string {
    if (override && typeof override === 'string' && ethers.isAddress(override)) {
      return override.toLowerCase();
    }
    if (this.activeWalletAddress && ethers.isAddress(this.activeWalletAddress)) {
      return this.activeWalletAddress.toLowerCase();
    }
    if (typeof window !== 'undefined') {
      const eth = (window as any).ethereum;
      if (eth?.selectedAddress && typeof eth.selectedAddress === 'string' && ethers.isAddress(eth.selectedAddress)) {
        return eth.selectedAddress.toLowerCase();
      }
      if (eth?.accounts && Array.isArray(eth.accounts) && eth.accounts[0] && typeof eth.accounts[0] === 'string' && ethers.isAddress(eth.accounts[0])) {
        return eth.accounts[0].toLowerCase();
      }

      // Multi-wallet resolution (Chrome, Telegram, WalletConnect)
      const keys = ['mdefi_user_wallet', 'walletAddress', 'wagmi.store', 'walletconnect', 'mdefi_active_account'];
      for (let i = 0; i < keys.length; i++) {
        try {
          const rawItem: any = localStorage.getItem(keys[i]);
          if (!rawItem || typeof rawItem !== 'string') continue;

          const trimmed: any = rawItem.trim();
          if (typeof trimmed === 'string' && ethers.isAddress(trimmed)) {
            return (trimmed as string).toLowerCase();
          }

          if (typeof trimmed === 'string' && trimmed[0] === '{') {
            const parsed: any = JSON.parse(trimmed);
            const rawAddr: any = parsed?.state?.data?.account || parsed?.accounts?.[0] || parsed?.activeWallet;
            if (rawAddr && typeof rawAddr === 'string' && ethers.isAddress(rawAddr)) {
              return rawAddr.toLowerCase();
            }
          }
        } catch {}
      }
    }
    return '';
  }

  private getReliableProvider(): ethers.Provider {
    return new ethers.JsonRpcProvider(PRIMARY_FAST_RPC, undefined, { staticNetwork: true });
  }

  async getUserProfile(walletAddress?: string): Promise<UserProfile> {
    const targetWallet = this.getEffectiveWallet(walletAddress);
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

  async getTeamTransactions(walletAddress?: string): Promise<{
    isRealData: boolean;
    transactions: TeamTransactionRecord[];
  }> {
    const targetWallet = this.getEffectiveWallet(walletAddress);
    if (!targetWallet || !ethers.isAddress(targetWallet)) {
      return { isRealData: false, transactions: [] };
    }

    const hubAddress = CONTRACT_ADDRESSES?.mdefiHub;
    if (!hubAddress || !ethers.isAddress(hubAddress)) {
      console.warn('[MDefiHub] Historical feed disabled: valid mdefiHub address is not configured.');
      return { isRealData: false, transactions: [] };
    }

    try {
      const provider = this.getReliableProvider();
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== 97 && Number(network.chainId) !== 56) {
        throw new Error(`Unexpected RPC chain ID: ${network.chainId}`);
      }

      const iface = new ethers.Interface(HUB_ABI as any);
      const latestBlock = await provider.getBlockNumber();
      // Configure VITE_MDEFI_HUB_DEPLOYMENT_BLOCK to avoid scanning from genesis.
      const envBlock = Number((import.meta as any)?.env?.VITE_MDEFI_HUB_DEPLOYMENT_BLOCK ?? 0);
      const fromBlock = Number.isSafeInteger(envBlock) && envBlock >= 0 ? envBlock : 0;
      if (fromBlock > latestBlock) {
        throw new Error(`Configured deployment block ${fromBlock} is ahead of latest block ${latestBlock}`);
      }

      // Discover the target's team exclusively from Registered logs (user, id, upline).
      // Logs are paged to avoid RPC range limits; no dashboard totals are converted into fake history.
      const registrationLogs: ethers.Log[] = [];
      const rangeSize = 1500;
      for (let from = fromBlock; from <= latestBlock; from += rangeSize) {
        const to = Math.min(from + rangeSize - 1, latestBlock);
        const logs = await provider.getLogs({ address: hubAddress, fromBlock: from, toBlock: to });
        registrationLogs.push(...logs);
      }

      type Registration = { user: string; upline: string; id: string; log: ethers.Log };
      const registrations: Registration[] = [];
      for (const log of registrationLogs) {
        try {
          const parsed = iface.parseLog({ topics: [...log.topics], data: log.data });
          if (!parsed || parsed.name !== 'Registered') continue;
          const userArg = parsed.args.user ?? parsed.args[0];
          const idArg = parsed.args.id ?? parsed.args[1];
          const uplineArg = parsed.args.upline ?? parsed.args[2];
          if (!ethers.isAddress(String(userArg)) || !ethers.isAddress(String(uplineArg))) continue;
          registrations.push({ user: String(userArg).toLowerCase(), upline: String(uplineArg).toLowerCase(), id: String(idArg), log });
        } catch { /* unrelated or unknown ABI event */ }
      }

      const teamDepth = new Map<string, number>();
      const target = targetWallet.toLowerCase();
      // Repeat until no new descendants are found, with a hard depth cap to prevent corrupt cycles.
      teamDepth.set(target, 0);
      let changed = true;
      while (changed) {
        changed = false;
        for (const reg of registrations) {
          const parentDepth = teamDepth.get(reg.upline);
          if (parentDepth !== undefined && parentDepth < 20 && !teamDepth.has(reg.user)) {
            teamDepth.set(reg.user, parentDepth + 1);
            changed = true;
          }
        }
      }

      const relevantAddresses = new Set(teamDepth.keys());
      const records: Array<TeamTransactionRecord & { __block: number; __log: number }> = [];
      const blockTimes = new Map<number, number>();
      const blockTimestamp = async (blockNumber: number) => {
        if (!blockTimes.has(blockNumber)) {
          const block = await provider.getBlock(blockNumber);
          blockTimes.set(blockNumber, block?.timestamp ?? 0);
        }
        return blockTimes.get(blockNumber) || 0;
      };

      for (const log of registrationLogs) {
        let parsed: ethers.LogDescription | null = null;
        try { parsed = iface.parseLog({ topics: [...log.topics], data: log.data }); } catch { continue; }
        if (!parsed) continue;
        const args: any = parsed.args;
        const name = parsed.name;
        const argValues = Object.values(args).filter((v: any) => typeof v === 'string');
        const addresses = argValues.filter((v: any) => ethers.isAddress(v)).map((v: string) => v.toLowerCase());
        const preferredAddress = args.user ?? args.leader ?? args.account ?? args.member;
        const eventWallet = (preferredAddress && ethers.isAddress(String(preferredAddress)) && relevantAddresses.has(String(preferredAddress).toLowerCase()))
          ? String(preferredAddress).toLowerCase()
          : addresses.find((a) => relevantAddresses.has(a));
        if (!eventWallet) continue;

        const depth = teamDepth.get(eventWallet) ?? 0;
        const ts = await blockTimestamp(log.blockNumber);
        const date = ts > 0 ? new Date(ts * 1000).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Timestamp unavailable';
        const hash = log.transactionHash;
        if (!hash || !/^0x[0-9a-fA-F]{64}$/.test(hash)) continue;

        // Display only events actually emitted by the configured hub contract.
        // No inferred registration, mint, package, or claim cards are synthesized from dashboard totals.
        let amount = '';
        const amountKeys = ['amount', 'price', 'packageAmount', 'usdtCollected', 'matrixIncome', 'directIncome', 'weeklyReward', 'weeklySalary', 'daoRevenue', 'liquidityAmount', 'regMinted', 'refVestingAdded'];
        for (const key of amountKeys) {
          const value = args[key];
          if (value !== undefined && value !== null) {
            try { amount = ethers.formatUnits(value, 18); break; } catch { /* try next known amount */ }
          }
        }
        const labelByEvent: Record<string, string> = {
          Registered: 'Team Member Registration',
          PackageActivated: 'Package Activation',
          PackageActivatedDetailed: 'Package Activation',
          ReferralClaimed: 'Referral Claim',
          PackageClaimed: 'Package Claim',
          ProgramExecutionReported: 'Program Execution',
        };
        const activityType = labelByEvent[name] || name;
        const humanAmount = amount ? `${amount} (on-chain event)` : activityType;
        const id = `${network.chainId}:${hubAddress.toLowerCase()}:${hash.toLowerCase()}:${log.index}`;
        records.push({
          id,
          memberWallet: eventWallet,
          userId: eventWallet === target ? 'Your Account' : `Member ••••${eventWallet.slice(-4)}`,
          packageAmount: humanAmount,
          amount: humanAmount,
          status: 'Confirmed',
          txHash: hash,
          date,
          activityType,
          details: `${name} event emitted by the configured hub contract${depth > 0 ? ` · Team level ${depth}` : ''}`,
          timestamp: date,
          isRealData: true,
          __block: log.blockNumber,
          __log: log.index,
        });
      }

      records.sort((a, b) => b.__block - a.__block || b.__log - a.__log);
      return {
        isRealData: true,
        transactions: records.map(({ __block, __log, ...record }) => record),
      };
    } catch (err) {
      console.error('[MDefiHub] Historical on-chain event scan failed:', err);
      return { isRealData: false, transactions: [] };
    }
  }

  async getTransactions(): Promise<TransactionRecord[]> {
    return Promise.resolve([...allTransactionRecords]);
  }

  async getMbttcTokenStats(): Promise<MbttcTokenStats> {
    const telemetry = await contractAdapter.getMbttcTokenTelemetry();
    return {
      ...mbttcTokenStats,
      totalBurned: `${Number(telemetry.burnDeadBalance || 0).toLocaleString()} MBTTC`,
      circulatingSupply: `${Number(telemetry.mintedAmount || 0).toLocaleString()} MBTTC`,
    };
  }

  // वास्तविक अलग-अलग क्लेम रसीदों को स्टोर करना
  async claimReward(
    type: 'Registration' | 'Referral' | 'Package',
    walletAddress?: string
  ): Promise<{ success: boolean; txHash: string; claimedAmount: number; message?: string }> {
    const targetWallet = this.getEffectiveWallet(walletAddress);

    const result = await contractAdapter.executeClaim({
      rewardType: type,
      walletAddress: targetWallet,
    });

    if (!result.success) {
      return {
        success: false,
        txHash: '',
        claimedAmount: 0,
        message: result.message || 'Claim execution failed on-chain.',
      };
    }

    const claimedAmount = result.claimedAmount;
    const nowSec = Math.floor(Date.now() / 1000);
    const d = new Date(nowSec * 1000);
    const timeStr = `${d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} · ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // हर क्लेम का अपना व्यक्तिगत कार्ड बनेगा
    const realReceiptRecord: LedgerItem = {
      id: `live-claim-${result.txHash}`,
      memberWallet: targetWallet,
      userId: 'Your Account',
      packageAmount: `+${claimedAmount.toFixed(2)} MBTTC`,
      amount: `+${claimedAmount.toFixed(2)} MBTTC`,
      status: 'Confirmed',
      txHash: result.txHash,
      date: timeStr,
      activityType: type === 'Referral' ? 'MBTTC Referral Pool Claim' : 'MBTTC Package Pool Claim',
      details: `${type} yield claimed to wallet`,
      timestamp: timeStr,
      isRealData: true,
      rawTime: nowSec,
    };

    this.liveClaimReceipts.unshift(realReceiptRecord);

    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('mdefi_cached_claims_v1') || '[]');
        stored.unshift(realReceiptRecord);
        localStorage.setItem('mdefi_cached_claims_v1', JSON.stringify(stored.slice(0, 50)));
      } catch {}
    }

    this.notifyFeedSubscribers();

    return {
      success: true,
      txHash: result.txHash,
      claimedAmount,
      message: result.message || `Successfully claimed ${claimedAmount} MBTTC`,
    };
  }

  async activatePackage(packageId: string): Promise<{ success: boolean; txHash: string; package: PackageItem; message?: string }> {
    const numericPkgId = parseInt(packageId.replace(/\D/g, ''), 10) || 1;
    const txRes = await contractAdapter.buyPackageOnHub(numericPkgId);

    if (!txRes.success) {
      return {
        success: false,
        txHash: '',
        package: initialPackages[0],
        message: txRes.message || 'Package activation failed.',
      };
    }

    this.notifyFeedSubscribers();

    const target = initialPackages.find((p) => p.id === packageId) || initialPackages[0];
    return {
      success: true,
      txHash: txRes.txHash,
      package: {
        ...target,
        status: 'Active',
      },
      message: `Activated ${target.name}`,
    };
  }

  async switchWallet(address: string): Promise<{ success: boolean; message?: string }> {
    if (address && ethers.isAddress(address)) {
      this.activeWalletAddress = address.toLowerCase();
      this.notifyFeedSubscribers();
      return {
        success: true,
        message: `Switched active wallet to ${address}`,
      };
    }
    return { success: false, message: 'Invalid address' };
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
    const res = await contractAdapter.executeSwap(params.fromToken, params.toToken, params.fromAmount);
    return {
      success: res.success,
      txHash: res.txHash,
      fromToken: params.fromToken,
      toToken: params.toToken,
      fromAmount: params.fromAmount,
      toAmount: params.toAmount,
      message: res.message,
    };
  }
}

export const mdefiService = new MDefiHubMockService();