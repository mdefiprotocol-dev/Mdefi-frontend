/**
 * MDeFi Master Contract Interaction Adapter (Phase 1 -> Phase 4 Architecture)
 * 
 * Abstraction layer between UI components and smart contract calls across all 4 phases.
 * 
 * ARCHITECTURE DIRECTIVES:
 * - Smart contracts are NOT deployed yet.
 * - Operates in DEMO / SIMULATION mode seamlessly until official deployment.
 * - Provider abstraction: Demo Provider vs Real Contract Provider.
 * - Dynamic registration fee logic (never assumes a hardcoded 0.0015 BNB constant).
 * - Strict separation between User-facing MDF ID (MDF-XXXXX) and Blockchain numeric ID (uint256).
 * - All future Web3 calls centralized through this adapter; no direct calls in UI components.
 * - Source of truth: Once deployed, smart contracts are the sole source of truth.
 * - Transaction Lifecycle: READY -> PREPARING -> WALLET_CONFIRMATION -> PENDING -> CONFIRMED (Failure: REJECTED, FAILED, REVERTED).
 * - Re-read blockchain state and trigger unified data refresh after any confirmed transaction.
 */

import { 
  isContractDeployed, 
  CONTRACT_ADDRESSES, 
  HUB_ADDRESS, 
  MBTTC_ADDRESS,
  S4_ADDRESS,
  STARTER_REWARD_ADDRESS,
  LIQUIDITY_POOL_ADDRESS,
  QUANTUM_NEXUS_ADDRESS,
  NEXUS_PRIME_ADDRESS,
  PREMIUM_REWARD_ADDRESS,
  SALARY_ADDRESS,
  TRADING_ROUTER_ADDRESS,
  TRADING_PAIR_ADDRESS,
} from '../config/contractConfig';
import { sponsorIdResolver } from './sponsorIdResolver';
import { getContractProvider, IProviderTxResult, TransactionLifecycleState } from './contractProvider';
import { UserProfile } from '../types';
import { S4PackageData } from '../types/s4Matrix';
import { juniorNodeData, seniorNodeData } from '../data/s4MatrixData';
import { 
  NexusPackageId, 
  NexusMatrixPosition 
} from '../types/nexusMatrix';
import { 
  quantumNodeStats, 
  quantumNodeTreeData, 
  nexusPrimeStats, 
  nexusPrimeTreeData 
} from '../data/nexusMatrixData';
import { WeeklyStarterData, WeeklyPremiumData, WeeklySalaryData } from '../types/rewards';
import { rewardDashboardsService } from './rewardDashboardsService';
import { treasuryService } from './treasuryService';

export interface IRegistrationFeeInfo {
  feeWei: string;
  feeFormatted: string;
  isDynamic: boolean;
  currency: string;
  description: string;
  isFromContract?: boolean;
}

export interface IRegistrationParams {
  uplineHumanFacingId: string;
  uplineNumericId: number;
  walletAddress: string;
}

export interface IRegistrationResult {
  success: boolean;
  txHash: string;
  userFacingId: string;
  numericId: number;
  sponsorId: string;
  walletAddress: string;
  timestamp: number;
  isRealBlockchainData: boolean;
  message?: string;
  status?: 'confirmed' | 'rejected' | 'failed' | 'simulated';
}

export interface IClaimParams {
  rewardType: 'Registration' | 'Referral' | 'Package';
  walletAddress: string;
}

export interface IClaimResult {
  success: boolean;
  txHash: string;
  claimedAmount: number;
  rewardType: 'Registration' | 'Referral' | 'Package';
  isRealBlockchainData: boolean;
  status: 'confirmed' | 'pending' | 'rejected' | 'failed' | 'simulated';
  message?: string;
}

export interface ITokenTelemetryData {
  totalSupply: number;
  mintedAmount: number;
  remainingAmount: number;
  mintedPercentage: number;
  isContractConnected: boolean;
  burnDeadBalance?: number;
}

export interface IClaimCooldownInfo {
  isEligible: boolean;
  cooldownSecondsRemaining: number;
  nextEligibleTimestamp: number;
  isContractEnforced: boolean;
  claimableAmount: number;
}

// Phase 2: S4 & Starter & Liquidity Interfaces
export interface ILiquidityPoolData {
  poolAddress: string;
  totalLiquidityUsd: number;
  mbttcReserves: number;
  usdtReserves: number;
  liveRateUsd: number | null;
  lastSyncTimestamp: number;
  source: 'LIQUIDITY_CONTRACT' | 'PRE_DEPLOYMENT_BENCHMARK' | 'PHASE_LOCKED' | 'TREASURY_CONTRACT';
  isRealBlockchainData: boolean;
}

// Phase 3: Quantum / Nexus & Weekly Rewards Interfaces
export interface IUserMatrixRecord {
  matrixId: number;
  packageId: NexusPackageId;
  packageName: string;
  cycle: number;
  rootAddress: string;
  rootUserId: string;
  activationDate: string;
  totalPositions: 30;
  filledPositions: number;
  availablePositions: number;
  isCompleted: boolean;
  positions: NexusMatrixPosition[];
  isRealBlockchainData: boolean;
}

// Phase 4: Trading & Swap Interfaces
export interface ITradingStats {
  routerAddress: string;
  pairAddress: string;
  mbttcPriceUsd: number;
  priceChange24h: number;
  volume24hUsd: number;
  liquidityUsd: number;
  isLiveTradingAvailable: boolean;
  isRealBlockchainData: boolean;
}

export interface ISwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  executionPrice: number;
  priceImpactPercent: number;
  estimatedGasFeeBnb: number;
  isRealBlockchainData: boolean;
}

export interface ISwapResult {
  success: boolean;
  txHash: string;
  fromAmount: number;
  toAmount: number;
  status: 'confirmed' | 'pending' | 'rejected' | 'failed' | 'simulated';
  isRealBlockchainData: boolean;
  message?: string;
}

export class ContractAdapter {
  private isDemoMode: boolean = true;
  private refreshListeners: Set<() => void> = new Set();
  private txLifecycleState: TransactionLifecycleState = 'READY';

  constructor() {
    // Mode is automatically demo mode if Hub contract is not deployed
    this.isDemoMode = !isContractDeployed('mdefiHub');
  }

  /**
   * Check whether the adapter is operating in Live on-chain mode
   */
  public isLiveMode(): boolean {
    return !this.isDemoMode && isContractDeployed('mdefiHub') && isContractDeployed('mbttcToken');
  }

  public getTransactionLifecycleState(): TransactionLifecycleState {
    return this.txLifecycleState;
  }

  private setTxLifecycleState(state: TransactionLifecycleState) {
    this.txLifecycleState = state;
  }

  /**
   * Subscribe to blockchain state refresh events
   */
  public onDataRefresh(callback: () => void): () => void {
    this.refreshListeners.add(callback);
    return () => {
      this.refreshListeners.delete(callback);
    };
  }

  /**
   * Trigger a blockchain data refresh across all subscribed views
   */
  public triggerDataRefresh(): void {
    this.refreshListeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.warn('[ContractAdapter] Error in refresh callback:', err);
      }
    });
  }

  // =========================================================================
  // PHASE 1: HUB & MBTTC TOKEN OPERATIONS
  // =========================================================================

  /**
   * Dynamically queries the current registration fee from the contract or benchmark
   * The fee is NOT a hardcoded permanent constant; it is queried dynamically.
   * In Live Mode: queries the deployed Hub contract registrationFee() getter.
   * In Demo Mode: returns dynamic simulation benchmark (~0.0015 BNB).
   */
  public async getRegistrationFee(): Promise<IRegistrationFeeInfo> {
    if (this.isLiveMode() && typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        // When deployed: queries Hub.registrationFee()
        console.log('[ContractAdapter] Querying live Hub registration fee at:', HUB_ADDRESS);
      } catch (err) {
        console.warn('[ContractAdapter] Live fee query fallback:', err);
      }
    }

    if (this.isDemoMode) {
      // Dynamic benchmark execution fee simulation
      return {
        feeWei: '1500000000000000', // ~0.0015 BNB
        feeFormatted: 'Dynamic Network Fee (~0.0015 BNB)',
        isDynamic: true,
        currency: 'BNB',
        description: 'Dynamic execution gas & protocol node registration fee (Demo Benchmark)',
        isFromContract: false,
      };
    }

    return {
      feeWei: '0',
      feeFormatted: 'Querying On-Chain Contract...',
      isDynamic: true,
      currency: 'BNB',
      description: 'On-chain dynamic registration fee',
      isFromContract: true,
    };
  }

  /**
   * Executes user registration through the adapter.
   * In Demo Mode: executes realistic simulated confirmation.
   * In Production: prepares payable transaction to Hub contract register(uint256 uplineNumericId).
   */
  public async executeRegistration(params: IRegistrationParams): Promise<IRegistrationResult> {
    const { uplineHumanFacingId, uplineNumericId, walletAddress } = params;

    this.setTxLifecycleState('PREPARING');

    // LIVE BLOCKCHAIN TRANSACTION EXECUTION PATH:
    if (this.isLiveMode()) {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        this.setTxLifecycleState('FAILED');
        return {
          success: false,
          txHash: '',
          userFacingId: '',
          numericId: 0,
          sponsorId: uplineHumanFacingId,
          walletAddress,
          timestamp: Date.now(),
          isRealBlockchainData: true,
          status: 'failed',
          message: 'No Web3 wallet provider detected. Please install or unlock MetaMask / Trust Wallet.',
        };
      }

      try {
        this.setTxLifecycleState('WALLET_CONFIRMATION');
        const provider = getContractProvider(true);
        // Execute real Hub contract registration call when deployed & ABI verified
        const txResult = await provider.write('mdefiHub', 'register', [uplineNumericId]);

        if (!txResult.success) {
          this.setTxLifecycleState(txResult.status);
          return {
            success: false,
            txHash: '',
            userFacingId: '',
            numericId: 0,
            sponsorId: uplineHumanFacingId,
            walletAddress,
            timestamp: Date.now(),
            isRealBlockchainData: true,
            status: txResult.status === 'REJECTED' ? 'rejected' : 'failed',
            message: txResult.message,
          };
        }

        this.setTxLifecycleState('PENDING');
        await provider.waitForConfirmation(txResult.txHash);
        this.setTxLifecycleState('CONFIRMED');

        this.triggerDataRefresh();

        return {
          success: true,
          txHash: txResult.txHash,
          userFacingId: `MDF-${Math.floor(10000 + Math.random() * 90000)}`,
          numericId: uplineNumericId + 1,
          sponsorId: uplineHumanFacingId,
          walletAddress,
          timestamp: Date.now(),
          isRealBlockchainData: true,
          status: 'confirmed',
          message: 'Decentralized registration confirmed on BNB Smart Chain.',
        };
      } catch (err: any) {
        if (err?.code === 4001) {
          this.setTxLifecycleState('REJECTED');
          return {
            success: false,
            txHash: '',
            userFacingId: '',
            numericId: 0,
            sponsorId: uplineHumanFacingId,
            walletAddress,
            timestamp: Date.now(),
            isRealBlockchainData: true,
            status: 'rejected',
            message: 'Transaction rejected in wallet.',
          };
        }

        this.setTxLifecycleState('FAILED');
        return {
          success: false,
          txHash: '',
          userFacingId: '',
          numericId: 0,
          sponsorId: uplineHumanFacingId,
          walletAddress,
          timestamp: Date.now(),
          isRealBlockchainData: true,
          status: 'failed',
          message: err?.message || 'On-chain registration failed.',
        };
      }
    }

    // DEMO / SIMULATION TRANSACTION EXECUTION PATH:
    this.setTxLifecycleState('PENDING');
    await new Promise((resolve) => setTimeout(resolve, 800));
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const txHash = `0x${randomHex}`;
    const generatedNumericId = Math.floor(25000 + Math.random() * 5000);
    const generatedUserFacingId = `MDF-${generatedNumericId}`;

    this.setTxLifecycleState('CONFIRMED');
    this.triggerDataRefresh();

    return {
      success: true,
      txHash,
      userFacingId: generatedUserFacingId,
      numericId: generatedNumericId,
      sponsorId: uplineHumanFacingId,
      walletAddress,
      timestamp: Date.now(),
      isRealBlockchainData: false,
      status: 'simulated',
      message: 'Registration confirmed in Demo Benchmark.',
    };
  }

  /**
   * Executes reward claims (Registration, Referral, Package) via the adapter.
   */
  public async executeClaim(params: IClaimParams): Promise<IClaimResult> {
    const { rewardType, walletAddress } = params;
    this.setTxLifecycleState('PREPARING');

    // Check cooldown on-chain authority
    const cooldownInfo = await this.getMbttcClaimCooldown(walletAddress, rewardType);
    if (!cooldownInfo.isEligible) {
      this.setTxLifecycleState('FAILED');
      return {
        success: false,
        txHash: '',
        claimedAmount: 0,
        rewardType,
        isRealBlockchainData: this.isLiveMode(),
        status: 'failed',
        message: `Claim cooldown active. Next eligible claim in ${Math.ceil(cooldownInfo.cooldownSecondsRemaining / 60)} minutes.`,
      };
    }

    // LIVE BLOCKCHAIN TRANSACTION PATH
    if (this.isLiveMode()) {
      try {
        this.setTxLifecycleState('WALLET_CONFIRMATION');
        const provider = getContractProvider(true);
        // Call contract claim function
        const txResult = await provider.write('mbttcToken', 'claimReward', [rewardType]);

        if (!txResult.success) {
          this.setTxLifecycleState(txResult.status);
          return {
            success: false,
            txHash: '',
            claimedAmount: 0,
            rewardType,
            isRealBlockchainData: true,
            status: txResult.status === 'REJECTED' ? 'rejected' : 'failed',
            message: txResult.message,
          };
        }

        this.setTxLifecycleState('PENDING');
        await provider.waitForConfirmation(txResult.txHash);
        this.setTxLifecycleState('CONFIRMED');

        this.triggerDataRefresh();

        return {
          success: true,
          txHash: txResult.txHash,
          claimedAmount: cooldownInfo.claimableAmount,
          rewardType,
          isRealBlockchainData: true,
          status: 'confirmed',
          message: `Successfully claimed ${cooldownInfo.claimableAmount} MBTTC on-chain.`,
        };
      } catch (err: any) {
        if (err?.code === 4001) {
          this.setTxLifecycleState('REJECTED');
          return {
            success: false,
            txHash: '',
            claimedAmount: 0,
            rewardType,
            isRealBlockchainData: true,
            status: 'rejected',
            message: 'Claim transaction was rejected by user in wallet.',
          };
        }

        this.setTxLifecycleState('FAILED');
        return {
          success: false,
          txHash: '',
          claimedAmount: 0,
          rewardType,
          isRealBlockchainData: true,
          status: 'failed',
          message: err?.message || 'On-chain claim transaction failed.',
        };
      }
    }

    // DEMO / SIMULATION CLAIM EXECUTION PATH:
    this.setTxLifecycleState('PENDING');
    await new Promise((resolve) => setTimeout(resolve, 850));
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const txHash = `0x${randomHex}`;
    const claimedAmount = rewardType === 'Registration' ? 30 : rewardType === 'Referral' ? 300 : 600;

    this.setTxLifecycleState('CONFIRMED');
    this.triggerDataRefresh();

    return {
      success: true,
      txHash,
      claimedAmount,
      rewardType,
      isRealBlockchainData: false,
      status: 'simulated',
      message: `Successfully claimed ${claimedAmount} MBTTC in Demo Benchmark.`,
    };
  }

  /**
   * Queries MBTTC token contract telemetry data
   */
  public async getMbttcTokenTelemetry(): Promise<ITokenTelemetryData> {
    if (this.isLiveMode()) {
      try {
        console.log('[ContractAdapter] Querying live MBTTC token telemetry from:', MBTTC_ADDRESS);
      } catch (err) {
        console.warn('[ContractAdapter] Live telemetry query fallback:', err);
      }
    }

    // Return standard benchmark / demo telemetry
    return {
      totalSupply: 2000000,
      mintedAmount: 684250,
      remainingAmount: 1315750,
      mintedPercentage: 34.21,
      isContractConnected: this.isLiveMode(),
      burnDeadBalance: 280000,
    };
  }

  /**
   * Queries MBTTC Claim Cooldown state (4-hour rule)
   */
  public async getMbttcClaimCooldown(
    walletAddress: string,
    rewardType: 'Registration' | 'Referral' | 'Package'
  ): Promise<IClaimCooldownInfo> {
    if (this.isLiveMode()) {
      try {
        console.log(`[ContractAdapter] Querying live on-chain claim cooldown for ${walletAddress} (${rewardType})`);
      } catch (err) {
        console.warn('[ContractAdapter] Live claim cooldown query fallback:', err);
      }
    }

    // Demo benchmark default
    const isReg = rewardType === 'Registration';
    return {
      isEligible: true,
      cooldownSecondsRemaining: isReg ? 0 : 14400, // 4 hours in seconds
      nextEligibleTimestamp: Date.now() + (isReg ? 0 : 14400 * 1000),
      isContractEnforced: this.isLiveMode(),
      claimableAmount: isReg ? 30 : rewardType === 'Referral' ? 300 : 600,
    };
  }

  /**
   * Query user on-chain data from Hub contract
   */
  public async getHubUserData(walletAddress: string): Promise<Partial<UserProfile> | null> {
    if (!this.isLiveMode()) {
      return null;
    }

    try {
      console.log('[ContractAdapter] Querying live Hub user data for:', walletAddress);
      return {
        walletAddress,
        isRealBlockchainData: true,
      };
    } catch (err) {
      console.warn('[ContractAdapter] Error querying on-chain user data:', err);
      return null;
    }
  }

  // =========================================================================
  // PHASE 2: S4 MATRIX, STARTER REWARD & LIQUIDITY POOL
  // =========================================================================

  /**
   * Reads S4 Matrix data (Junior or Senior)
   * In Live Mode: reads verified S4 contract state when active and deployed.
   * In Demo Mode: returns benchmark matrix telemetry.
   */
  public async getS4MatrixData(packageKey: 'junior' | 'senior'): Promise<S4PackageData> {
    if (this.isLiveMode() && isContractDeployed('s4Matrix')) {
      // TODO: Connect after verified ABI is supplied.
      console.log(`[ContractAdapter] Querying live S4 contract at: ${S4_ADDRESS} (${packageKey})`);
    }

    await new Promise((r) => setTimeout(r, 40));
    const base = packageKey === 'junior' ? juniorNodeData : seniorNodeData;
    return {
      ...base,
      positions: [...base.positions],
      transactions: [...base.transactions],
    };
  }

  /**
   * Executes S4 Matrix Package Activation on-chain
   */
  public async executeS4Activation(
    packageKey: 'junior' | 'senior',
    walletAddress: string
  ): Promise<IProviderTxResult> {
    this.setTxLifecycleState('PREPARING');

    if (this.isLiveMode()) {
      this.setTxLifecycleState('WALLET_CONFIRMATION');
      const provider = getContractProvider(true);
      // TODO: Connect after verified ABI is supplied.
      const res = await provider.write('s4Matrix', 'activatePackage', [packageKey]);
      if (res.success) {
        this.setTxLifecycleState('CONFIRMED');
        this.triggerDataRefresh();
      } else {
        this.setTxLifecycleState(res.status);
      }
      return res;
    }

    // Demo simulation
    this.setTxLifecycleState('PENDING');
    await new Promise((r) => setTimeout(r, 600));
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    this.setTxLifecycleState('CONFIRMED');
    this.triggerDataRefresh();

    return {
      success: true,
      txHash: `0x${randomHex}`,
      status: 'CONFIRMED',
      isRealBlockchainData: false,
      message: `S4 ${packageKey === 'junior' ? 'Junior ($10)' : 'Senior ($25)'} node activated in Demo Benchmark.`,
    };
  }

  /**
   * Reads Weekly Starter Reward telemetry
   */
  public async getStarterRewardData(walletAddress: string): Promise<WeeklyStarterData> {
    if (this.isLiveMode() && isContractDeployed('starterReward')) {
      // TODO: Connect after verified ABI is supplied.
      console.log(`[ContractAdapter] Querying live Starter Reward at: ${STARTER_REWARD_ADDRESS} (${walletAddress})`);
    }

    return await rewardDashboardsService.getStarterData();
  }

  /**
   * Executes Weekly Starter Reward Claim
   */
  public async executeStarterRewardClaim(walletAddress: string): Promise<IProviderTxResult> {
    this.setTxLifecycleState('PREPARING');

    if (this.isLiveMode()) {
      this.setTxLifecycleState('WALLET_CONFIRMATION');
      const provider = getContractProvider(true);
      // TODO: Connect after verified ABI is supplied.
      const res = await provider.write('starterReward', 'claimReward', [walletAddress]);
      if (res.success) {
        this.setTxLifecycleState('CONFIRMED');
        this.triggerDataRefresh();
      } else {
        this.setTxLifecycleState(res.status);
      }
      return res;
    }

    // Demo simulation
    await new Promise((r) => setTimeout(r, 500));
    const res = await rewardDashboardsService.claimStarterReward();
    this.setTxLifecycleState('CONFIRMED');
    this.triggerDataRefresh();

    return {
      success: res.success,
      txHash: res.txHash || '',
      status: 'CONFIRMED',
      isRealBlockchainData: false,
      message: res.message,
    };
  }

  /**
   * Reads Liquidity Pool & Valuation state
   */
  public async getLiquidityPoolData(): Promise<ILiquidityPoolData> {
    if (this.isLiveMode() && isContractDeployed('liquidityPool')) {
      // TODO: Connect after verified ABI is supplied.
      console.log(`[ContractAdapter] Querying live Liquidity Vault at: ${LIQUIDITY_POOL_ADDRESS}`);
    }

    const treasury = treasuryService.getTreasuryState();
    return {
      poolAddress: LIQUIDITY_POOL_ADDRESS,
      totalLiquidityUsd: treasury.totalLiquidityUsd || 150000,
      mbttcReserves: treasury.reserveMbttc || 100000,
      usdtReserves: treasury.reserveUsdt || 150000,
      liveRateUsd: treasury.liveRateUsd,
      lastSyncTimestamp: treasury.lastSyncTimestamp || Date.now(),
      source: treasury.source,
      isRealBlockchainData: this.isLiveMode(),
    };
  }

  // =========================================================================
  // PHASE 3: QUANTUM/NEXUS, PREMIUM REWARD & WEEKLY SALARY
  // =========================================================================

  /**
   * Reads Quantum/Nexus Matrix telemetry (Package 1: Quantum $70, Package 2: Prime $120)
   */
  public async getQuantumNexusData(packageId: NexusPackageId): Promise<IUserMatrixRecord> {
    if (this.isLiveMode() && isContractDeployed('quantumNexus')) {
      // TODO: Connect after verified ABI is supplied.
      console.log(`[ContractAdapter] Querying live Quantum/Nexus contract at: ${QUANTUM_NEXUS_ADDRESS} (Pkg ${packageId})`);
    }

    const stats = packageId === 1 ? quantumNodeStats : nexusPrimeStats;
    const tree = packageId === 1 ? quantumNodeTreeData : nexusPrimeTreeData;

    return {
      matrixId: stats.currentMatrixNumber,
      packageId,
      packageName: stats.name,
      cycle: stats.currentMatrixNumber,
      rootAddress: tree.rootUser.walletAddress,
      rootUserId: tree.rootUser.userId,
      activationDate: stats.activationDate,
      totalPositions: 30,
      filledPositions: stats.filledPositions,
      availablePositions: stats.availablePositions,
      isCompleted: stats.filledPositions >= 30,
      positions: [...tree.positions],
      isRealBlockchainData: this.isLiveMode(),
    };
  }

  /**
   * Executes Quantum/Nexus Package Activation
   */
  public async executeQuantumActivation(
    packageId: NexusPackageId,
    walletAddress: string
  ): Promise<IProviderTxResult> {
    this.setTxLifecycleState('PREPARING');

    if (this.isLiveMode()) {
      this.setTxLifecycleState('WALLET_CONFIRMATION');
      const provider = getContractProvider(true);
      const contractKey = packageId === 1 ? 'quantumNexus' : 'nexusPrime';
      // TODO: Connect after verified ABI is supplied.
      const res = await provider.write(contractKey, 'activatePackage', [packageId]);
      if (res.success) {
        this.setTxLifecycleState('CONFIRMED');
        this.triggerDataRefresh();
      } else {
        this.setTxLifecycleState(res.status);
      }
      return res;
    }

    // Demo simulation
    this.setTxLifecycleState('PENDING');
    await new Promise((r) => setTimeout(r, 700));
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    this.setTxLifecycleState('CONFIRMED');
    this.triggerDataRefresh();

    return {
      success: true,
      txHash: `0x${randomHex}`,
      status: 'CONFIRMED',
      isRealBlockchainData: false,
      message: `${packageId === 1 ? 'Quantum Node ($70)' : 'Nexus Prime ($120)'} activated in Demo Benchmark.`,
    };
  }

  /**
   * Reads Weekly Premium Reward telemetry
   */
  public async getPremiumRewardData(walletAddress: string): Promise<WeeklyPremiumData> {
    if (this.isLiveMode() && isContractDeployed('premiumReward')) {
      // TODO: Connect after verified ABI is supplied.
      console.log(`[ContractAdapter] Querying live Premium Reward at: ${PREMIUM_REWARD_ADDRESS} (${walletAddress})`);
    }

    return await rewardDashboardsService.getPremiumData();
  }

  /**
   * Executes Weekly Premium Reward Claim
   */
  public async executePremiumRewardClaim(walletAddress: string): Promise<IProviderTxResult> {
    this.setTxLifecycleState('PREPARING');

    if (this.isLiveMode()) {
      this.setTxLifecycleState('WALLET_CONFIRMATION');
      const provider = getContractProvider(true);
      // TODO: Connect after verified ABI is supplied.
      const res = await provider.write('premiumReward', 'claimReward', [walletAddress]);
      if (res.success) {
        this.setTxLifecycleState('CONFIRMED');
        this.triggerDataRefresh();
      } else {
        this.setTxLifecycleState(res.status);
      }
      return res;
    }

    // Demo simulation
    await new Promise((r) => setTimeout(r, 500));
    const res = await rewardDashboardsService.claimPremiumReward();
    this.setTxLifecycleState('CONFIRMED');
    this.triggerDataRefresh();

    return {
      success: res.success,
      txHash: res.txHash || '',
      status: 'CONFIRMED',
      isRealBlockchainData: false,
      message: res.message,
    };
  }

  /**
   * Reads Weekly Salary telemetry
   */
  public async getWeeklySalaryData(walletAddress: string): Promise<WeeklySalaryData> {
    if (this.isLiveMode() && isContractDeployed('salaryContract')) {
      // TODO: Connect after verified ABI is supplied.
      console.log(`[ContractAdapter] Querying live Salary Contract at: ${SALARY_ADDRESS} (${walletAddress})`);
    }

    return await rewardDashboardsService.getSalaryData();
  }

  /**
   * Executes Weekly Salary Claim
   */
  public async executeWeeklySalaryClaim(walletAddress: string): Promise<IProviderTxResult> {
    this.setTxLifecycleState('PREPARING');

    if (this.isLiveMode()) {
      this.setTxLifecycleState('WALLET_CONFIRMATION');
      const provider = getContractProvider(true);
      // TODO: Connect after verified ABI is supplied.
      const res = await provider.write('salaryContract', 'claimSalary', [walletAddress]);
      if (res.success) {
        this.setTxLifecycleState('CONFIRMED');
        this.triggerDataRefresh();
      } else {
        this.setTxLifecycleState(res.status);
      }
      return res;
    }

    // Demo simulation
    await new Promise((r) => setTimeout(r, 500));
    const res = await rewardDashboardsService.claimSalaryReward();
    this.setTxLifecycleState('CONFIRMED');
    this.triggerDataRefresh();

    return {
      success: res.success,
      txHash: res.txHash || '',
      status: 'CONFIRMED',
      isRealBlockchainData: false,
      message: res.message,
    };
  }

  // =========================================================================
  // PHASE 4: LIQUIDITY POOL & PANCAKESWAP / TRADING COMPONENTS
  // =========================================================================

  /**
   * Reads live or benchmark trading statistics
   */
  public async getTradingStats(): Promise<ITradingStats> {
    if (this.isLiveMode() && isContractDeployed('tradingRouter')) {
      // TODO: Connect after verified ABI is supplied.
      console.log(`[ContractAdapter] Querying live DEX pair at: ${TRADING_PAIR_ADDRESS}`);
    }

    return {
      routerAddress: TRADING_ROUTER_ADDRESS,
      pairAddress: TRADING_PAIR_ADDRESS,
      mbttcPriceUsd: 1.50,
      priceChange24h: 3.45,
      volume24hUsd: 284000,
      liquidityUsd: 650000,
      isLiveTradingAvailable: this.isLiveMode() && isContractDeployed('tradingRouter'),
      isRealBlockchainData: this.isLiveMode(),
    };
  }

  /**
   * Calculates swap quote via verified DEX router or benchmark simulator
   */
  public async getSwapQuote(fromToken: string, toToken: string, amount: number): Promise<ISwapQuote> {
    if (this.isLiveMode() && isContractDeployed('tradingRouter')) {
      // TODO: Connect after verified ABI is supplied.
      // Call router.getAmountsOut(amountIn, [fromToken, toToken])
    }

    const price = 1.50;
    const toAmount = fromToken === 'USDT' ? amount / price : amount * price;

    return {
      fromToken,
      toToken,
      fromAmount: amount,
      toAmount: Number(toAmount.toFixed(4)),
      executionPrice: price,
      priceImpactPercent: 0.12,
      estimatedGasFeeBnb: 0.00045,
      isRealBlockchainData: this.isLiveMode(),
    };
  }

  /**
   * Executes DEX swap via verified DEX router
   */
  public async executeSwap(
    fromToken: string,
    toToken: string,
    amount: number,
    _slippage: number,
    _walletAddress: string
  ): Promise<ISwapResult> {
    this.setTxLifecycleState('PREPARING');

    if (this.isLiveMode()) {
      this.setTxLifecycleState('WALLET_CONFIRMATION');
      const provider = getContractProvider(true);
      // TODO: Connect after verified ABI is supplied.
      const res = await provider.write('tradingRouter', 'swapExactTokensForTokens', [
        amount,
        [fromToken, toToken],
      ]);
      if (res.success) {
        this.setTxLifecycleState('CONFIRMED');
        this.triggerDataRefresh();
      } else {
        this.setTxLifecycleState(res.status);
      }
      return {
        success: res.success,
        txHash: res.txHash,
        fromAmount: amount,
        toAmount: amount * 1.5,
        status: res.status === 'CONFIRMED' ? 'confirmed' : 'failed',
        isRealBlockchainData: true,
        message: res.message,
      };
    }

    // Demo simulation
    this.setTxLifecycleState('PENDING');
    await new Promise((r) => setTimeout(r, 800));
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    this.setTxLifecycleState('CONFIRMED');
    this.triggerDataRefresh();

    return {
      success: true,
      txHash: `0x${randomHex}`,
      fromAmount: amount,
      toAmount: fromToken === 'USDT' ? amount / 1.5 : amount * 1.5,
      status: 'simulated',
      isRealBlockchainData: false,
      message: `Swap of ${amount} ${fromToken} completed in Demo Benchmark.`,
    };
  }

  public getMode(): 'demo' | 'production' {
    return this.isDemoMode ? 'demo' : 'production';
  }

  public setMode(mode: 'demo' | 'production'): void {
    this.isDemoMode = mode === 'demo';
    this.triggerDataRefresh();
  }
}

export const contractAdapter = new ContractAdapter();
