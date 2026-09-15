import { ActivityItem, EcosystemActivity, PackageItem, TeamMember, TeamTransactionRecord, UserProfile } from '../types';
import { S4TransactionRecord } from '../types/s4Matrix';
import { NexusTransactionRecord } from '../types/nexusMatrix';
import { 
  getNotificationDeduplicationKey, 
  normalizeAndDeduplicateActivities 
} from '../utils/notificationDeduplication';
import { initialTeamMembers } from '../data/mockData';

/**
 * MDeFi Contract Ecosystem Architecture Identifiers
 *
 * 1. Main Hub Contract (Central linking / coordination layer for ecosystem plugins)
 * 2. MBTTC Token Contract (BEP-20 ecosystem token, welcome bonus, fees, transfers)
 * 3. S4 Matrix Contract (Concentric 2-ring matrix, liquidity feeding Starter pool)
 * 4. Weekly Reward Starter Contract (10% community pool from S4 liquidity)
 * 5. Treasury IPO Contract (Protocol liquidity & treasury management)
 * 6. Quantum Nexus Contract (Concentric 4-ring matrix, liquidity feeding Premium & Salary)
 * 7. Weekly Reward Premium Contract (10% share pool from Quantum Nexus liquidity)
 * 8. Weekly Passive Salary Contract (Rank-based weekly leadership salary pool)
 */
export type ContractIdentifier =
  | 'MAIN_HUB'
  | 'MBTTC_TOKEN'
  | 'S4_MATRIX'
  | 'WEEKLY_STARTER'
  | 'TREASURY_IPO'
  | 'QUANTUM_NEXUS'
  | 'WEEKLY_PREMIUM'
  | 'WEEKLY_SALARY';

export interface EcosystemContractMetadata {
  id: ContractIdentifier;
  name: string;
  role: string;
  liquiditySource?: string;
  liquidityDestination?: string;
  address?: string; // To be populated when real contracts are deployed
  abi?: any[];      // To be populated when real contracts are deployed
  chainId: number;  // Default BSC: 56
}

export const ECOSYSTEM_CONTRACTS: Record<ContractIdentifier, EcosystemContractMetadata> = {
  MAIN_HUB: {
    id: 'MAIN_HUB',
    name: 'Main Hub Contract',
    role: 'Central Coordination Layer & Plugin Orchestrator',
    chainId: 56,
  },
  MBTTC_TOKEN: {
    id: 'MBTTC_TOKEN',
    name: 'MBTTC Token Contract',
    role: 'BEP-20 Ecosystem Token, Welcome Bonus, Gas & Fees',
    chainId: 56,
  },
  S4_MATRIX: {
    id: 'S4_MATRIX',
    name: 'S4 Matrix Contract',
    role: 'Concentric 2-Ring Matrix ($10 & $25)',
    liquidityDestination: 'WEEKLY_STARTER',
    chainId: 56,
  },
  WEEKLY_STARTER: {
    id: 'WEEKLY_STARTER',
    name: 'Weekly Reward Starter Contract',
    role: '10% Community Pool from S4 Liquidity',
    liquiditySource: 'S4_MATRIX',
    chainId: 56,
  },
  TREASURY_IPO: {
    id: 'TREASURY_IPO',
    name: 'Treasury IPO Contract',
    role: 'Protocol Treasury & Exchange Launch Liquidity',
    chainId: 56,
  },
  QUANTUM_NEXUS: {
    id: 'QUANTUM_NEXUS',
    name: 'Quantum Nexus Contract',
    role: 'Concentric 4-Ring Matrix ($70 & $120)',
    liquidityDestination: 'WEEKLY_PREMIUM, WEEKLY_SALARY',
    chainId: 56,
  },
  WEEKLY_PREMIUM: {
    id: 'WEEKLY_PREMIUM',
    name: 'Weekly Reward Premium Contract',
    role: '10% Share Pool from Quantum Nexus Liquidity',
    liquiditySource: 'QUANTUM_NEXUS',
    chainId: 56,
  },
  WEEKLY_SALARY: {
    id: 'WEEKLY_SALARY',
    name: 'Weekly Passive Salary Contract',
    role: 'Rank-Based Leadership Salary from Quantum Nexus',
    liquiditySource: 'QUANTUM_NEXUS',
    chainId: 56,
  },
};

/**
 * Raw On-Chain Event Structure (Ready for future real contract integration)
 */
export interface RawBlockchainEvent {
  chainId: number;
  contractAddress: string;
  contractId?: ContractIdentifier;
  transactionHash: string;
  blockNumber?: number;
  logIndex?: number;
  eventName: string;
  args: Record<string, any>;
}

/**
 * Pluggable Event Adapter Interface for Future Web3 Contract Integration
 */
export interface IContractEventAdapter {
  contractId: ContractIdentifier;
  adapt(rawEvent: RawBlockchainEvent): ProtocolActionPayload | null;
}

export type ProtocolActionType =
  | 'REGISTRATION'
  | 'REFERRAL_REWARD'
  | 'REGISTRATION_REWARD'
  | 'PACKAGE_REWARD'
  | 'S4_ACTIVATION'
  | 'QUANTUM_ACTIVATION'
  | 'NEXUS_PRIME_ACTIVATION'
  | 'STARTER_CLAIM'
  | 'PREMIUM_CLAIM'
  | 'SALARY_CLAIM'
  | 'MBTTC_APPROVAL'
  | 'MBTTC_TRANSFER'
  | 'MATRIX_INCOME'
  | 'GENERATION_INCOME'
  | 'TOKEN_SWAP'
  | 'TREASURY_IPO_EVENT'
  | 'RANK_UPGRADE'
  | 'RATING_SUBMISSION';

export interface ProtocolActionPayload {
  actionType: ProtocolActionType;
  txHash: string;
  chainId?: number;
  contractAddress?: string;
  contractId?: ContractIdentifier;
  logIndex?: number;
  walletAddress: string;
  userId?: string;
  sponsorId?: string;
  amountUsdt?: number;
  amountMbttc?: number;
  packageId?: string;
  packageName?: string;
  details?: string;
  title?: string;
  subEvents?: Array<{
    type: string;
    contract?: string;
    details?: string;
    txHash?: string;
  }>;
}

export interface SynchronizedEcosystemState {
  activities: ActivityItem[];
  publicEcosystemActivities: EcosystemActivity[];
  teamTransactions: TeamTransactionRecord[];
  teamMembers: TeamMember[];
  directTeamCount: number;
  totalTeamCount: number;
  activeTeamCount: number;
  inactiveTeamCount: number;
  starterTotalSettled: number;
  premiumTotalSettled: number;
  salaryTotalSettled: number;
  grandTotalSettled: number;
  lastSyncTimestamp: number;
}

const PROCESSED_EVENTS_KEY = 'mdefi_processed_events_ledger';

class CentralEventSyncService {
  private processedEventIds = new Set<string>();
  private listeners = new Set<(state: SynchronizedEcosystemState) => void>();
  private adapters = new Map<ContractIdentifier, IContractEventAdapter>();
  private state: SynchronizedEcosystemState;

  constructor() {
    this.loadProcessedEvents();
    this.state = this.loadInitialState();
  }

  private loadProcessedEvents() {
    try {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem(PROCESSED_EVENTS_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          arr.forEach((id: string) => this.processedEventIds.add(id));
        }
      }
    } catch (e) {
      console.warn('[CentralEventSync] Failed to read processed events from storage:', e);
    }
  }

  private persistProcessedEvents() {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(PROCESSED_EVENTS_KEY, JSON.stringify(Array.from(this.processedEventIds)));
    } catch (e) {
      console.warn('[CentralEventSync] Failed to persist processed events:', e);
    }
  }

  private loadInitialState(): SynchronizedEcosystemState {
    const starterSettled = this.getNumberStorage('mdefi_starter_total_settled', 1240.00);
    const premiumSettled = this.getNumberStorage('mdefi_premium_total_settled', 3510.00);
    const salarySettled = this.getNumberStorage('mdefi_salary_total_settled', 150.00);

    // Initial base team members from verified dataset
    const baseMembers: TeamMember[] = initialTeamMembers.map((m) => ({ ...m }));
    const directCount = baseMembers.filter((m) => m.isDirect || m.level === 1).length;
    const totalCount = baseMembers.length;
    const activeCount = baseMembers.filter((m) => m.status === 'Active').length;
    const inactiveCount = baseMembers.filter((m) => m.status === 'Inactive').length;

    return {
      activities: [],
      publicEcosystemActivities: [],
      teamTransactions: [],
      teamMembers: baseMembers,
      directTeamCount: directCount,
      totalTeamCount: totalCount,
      activeTeamCount: activeCount,
      inactiveTeamCount: inactiveCount,
      starterTotalSettled: starterSettled,
      premiumTotalSettled: premiumSettled,
      salaryTotalSettled: salarySettled,
      grandTotalSettled: starterSettled + premiumSettled + salarySettled,
      lastSyncTimestamp: Date.now(),
    };
  }

  private getNumberStorage(key: string, fallback: number): number {
    try {
      if (typeof window === 'undefined') return fallback;
      const val = localStorage.getItem(key);
      if (!val) return fallback;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? fallback : parsed;
    } catch {
      return fallback;
    }
  }

  /**
   * Register a contract event adapter for future deployed Web3 contracts
   */
  public registerContractAdapter(adapter: IContractEventAdapter): void {
    this.adapters.set(adapter.contractId, adapter);
  }

  /**
   * Handle raw on-chain event from Web3/Ethers/Viem listener
   * Automatically normalizes, correlates, and feeds into the central pipeline
   */
  public handleRawContractEvent(rawEvent: RawBlockchainEvent): boolean {
    if (!rawEvent || !rawEvent.contractId) return false;
    const adapter = this.adapters.get(rawEvent.contractId);
    if (!adapter) {
      console.warn(`[CentralEventSync] No adapter registered for contract: ${rawEvent.contractId}`);
      return false;
    }
    const normalizedPayload = adapter.adapt(rawEvent);
    if (!normalizedPayload) return false;
    const res = this.dispatchAction(normalizedPayload);
    return res.success && !res.isDuplicate;
  }

  /**
   * Deterministic unique event identity:
   * chainId + contractAddress + transactionHash + logIndex
   * or demo deterministic key
   */
  public generateEventKey(payload: ProtocolActionPayload): string {
    const chain = payload.chainId || 56;
    const contract = (payload.contractAddress || payload.contractId || 'hub').trim().toLowerCase();
    const tx = (payload.txHash || '').trim().toLowerCase();
    const log = payload.logIndex !== undefined ? payload.logIndex : 0;
    const action = payload.actionType.toLowerCase();

    if (tx && tx !== '0x0' && tx.length >= 10) {
      return `chain:${chain}:contract:${contract}:tx:${tx}:log:${log}:${action}`;
    }

    // Demo deterministic fallback
    const wallet = (payload.walletAddress || 'demo').trim().toLowerCase();
    const pkg = (payload.packageId || '').toLowerCase();
    return `demo:${action}:${wallet}:${pkg}:${tx || 'tx0'}`;
  }

  /**
   * Format masked wallet address for public activity (e.g., "••••4821")
   */
  public formatMaskedMember(address?: string): string {
    if (!address) return '••••4821';
    const clean = address.trim();
    if (clean.includes('••••')) return clean;
    if (clean.length > 4) {
      return `••••${clean.slice(-4)}`;
    }
    return '••••4821';
  }

  /**
   * Core Single-Source Event Synchronization Pipeline:
   * SMART CONTRACT / CONFIRMED EVENT
   *         ↓
   *   EVENT ADAPTER
   *         ↓
   * CENTRAL EVENT SYNC
   *         ↓
   *     NORMALIZE
   *         ↓
   *     CORRELATE
   *         ↓
   *    DEDUPLICATE
   *         ↓
   * CENTRAL APPLICATION STATE
   *         ↓
   * ALL AFFECTED UI SECTIONS
   */
  public dispatchAction(payload: ProtocolActionPayload): { success: boolean; isDuplicate: boolean } {
    const eventKey = this.generateEventKey(payload);

    // Strict deduplication: never process the exact same event twice
    if (this.processedEventIds.has(eventKey)) {
      return { success: true, isDuplicate: true };
    }

    this.processedEventIds.add(eventKey);
    this.persistProcessedEvents();

    const timestamp = Date.now();
    const dateStr = 'Just now';
    const tx = payload.txHash || '0x0';
    const wallet = payload.walletAddress;

    // 1. EVENT NORMALIZER & CORRELATION
    let userActivityItem: ActivityItem | null = null;
    let publicActivityItem: EcosystemActivity | null = null;
    let teamTxRecord: TeamTransactionRecord | null = null;

    switch (payload.actionType) {
      case 'REGISTRATION': {
        const uId = payload.userId || 'MDF-User';
        const sId = payload.sponsorId || 'MDF-10389';
        
        // Correlated user notification: registration + node placement + welcome bonus
        userActivityItem = {
          id: `reg-${tx}`,
          type: 'Registration',
          title: 'Registration Completed',
          amount: '+30.00 MBTTC',
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: `Account ${uId} registered under sponsor ${sId}. Node placement confirmed on BSC. Welcome bonus of 30.00 MBTTC credited to vault.`,
          walletAddress: wallet,
          read: false,
        };

        // Correlated public ecosystem activity (clean, non-sensitive, unpaginated)
        publicActivityItem = {
          id: `eco-reg-${tx}`,
          type: 'REGISTRATION',
          title: 'New Member Registration',
          description: `New member ${uId} joined MDeFi ecosystem`,
          amount: 'New Member',
          member: this.formatMaskedMember(wallet),
          timestamp: 'Just now',
          status: 'Confirmed',
          isDemo: false,
        };

        // Team activity record
        teamTxRecord = {
          id: `team-reg-${tx}`,
          activityType: 'Team Registration',
          memberWallet: wallet,
          userId: uId,
          packageName: 'Ecosystem Placement',
          amount: 'New Member',
          status: 'Confirmed',
          date: 'Just now',
          timestamp: 'Just now',
          details: `Frontline direct partner joined under sponsor ${sId}`,
          txHash: tx,
        };

        // Synchronize Team Directory
        const newMember: TeamMember = {
          id: `tm-${uId}`,
          address: wallet,
          userId: uId,
          package: 'Tier 1 Node',
          status: 'Active',
          joinedDate: new Date().toISOString().split('T')[0],
          volumeUSD: 10,
          isDirect: true,
          directPartners: 0,
          sponsor: sId,
          level: 1,
          activePackages: 1,
        };

        this.state.teamMembers = [newMember, ...this.state.teamMembers];
        this.state.directTeamCount += 1;
        this.state.totalTeamCount += 1;
        this.state.activeTeamCount += 1;
        break;
      }

      case 'REFERRAL_REWARD': {
        const bonus = payload.amountMbttc || 50;
        userActivityItem = {
          id: `ref-reward-${tx}`,
          type: 'Team Income',
          title: 'Referral Reward',
          amount: `+${bonus.toFixed(2)} MBTTC`,
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: payload.details || `Direct sponsor referral reward of ${bonus.toFixed(2)} MBTTC credited on BSC`,
          walletAddress: wallet,
          read: false,
        };

        publicActivityItem = {
          id: `eco-ref-${tx}`,
          type: 'DIRECT_INCOME',
          title: 'Direct Referral Commission',
          description: 'Referral bonus distributed on-chain',
          amount: `+${bonus.toFixed(2)} MBTTC`,
          member: this.formatMaskedMember(wallet),
          timestamp: 'Just now',
          status: 'Confirmed',
          isDemo: false,
        };

        teamTxRecord = {
          id: `team-ref-${tx}`,
          activityType: 'Direct Referral',
          memberWallet: wallet,
          userId: payload.userId || 'MDF-User',
          packageName: 'Referral Commission',
          amount: `+${bonus.toFixed(2)} MBTTC`,
          status: 'Confirmed',
          date: 'Just now',
          timestamp: 'Just now',
          details: 'Direct partner referral bonus confirmed on-chain',
          txHash: tx,
        };
        break;
      }

      case 'REGISTRATION_REWARD': {
        const amount = payload.amountMbttc || 30;
        userActivityItem = {
          id: `reg-claim-${tx}`,
          type: 'Claim',
          title: 'Registration Reward Claimed',
          amount: `+${amount.toFixed(2)} MBTTC`,
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: `Welcome registration reward of ${amount.toFixed(2)} MBTTC claimed to wallet on BSC`,
          walletAddress: wallet,
          read: false,
        };

        publicActivityItem = {
          id: `eco-reg-claim-${tx}`,
          type: 'MBTTC_CLAIM',
          title: 'Registration Reward Claim',
          description: 'Welcome bonus claimed to wallet',
          amount: `+${amount.toFixed(2)} MBTTC`,
          member: this.formatMaskedMember(wallet),
          timestamp: 'Just now',
          status: 'Confirmed',
          isDemo: false,
        };
        break;
      }

      case 'PACKAGE_REWARD': {
        const amount = payload.amountMbttc || 25;
        userActivityItem = {
          id: `pkg-reward-${tx}`,
          type: 'Claim',
          title: 'Package Reward Claimed',
          amount: `+${amount.toFixed(2)} MBTTC`,
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: `Package reward distribution of ${amount.toFixed(2)} MBTTC collected to wallet`,
          walletAddress: wallet,
          read: false,
        };

        publicActivityItem = {
          id: `eco-pkg-reward-${tx}`,
          type: 'MBTTC_CLAIM',
          title: 'Package Yield Claim',
          description: 'Package reward credited on-chain',
          amount: `+${amount.toFixed(2)} MBTTC`,
          member: this.formatMaskedMember(wallet),
          timestamp: 'Just now',
          status: 'Confirmed',
          isDemo: false,
        };
        break;
      }

      case 'S4_ACTIVATION': {
        const pkgName = payload.packageName || 'S4 Node';
        const price = payload.amountUsdt || 10;
        
        userActivityItem = {
          id: `s4-${tx}`,
          type: 'Package Activation',
          title: `S4 Node Activated — ${pkgName} ($${price} USD)`,
          amount: `-$${price} USD`,
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: `S4 Radial Matrix node placement activated for ${pkgName} ($${price} USDT) on BSC`,
          walletAddress: wallet,
          read: false,
        };

        publicActivityItem = {
          id: `eco-s4-${tx}`,
          type: 'PACKAGE',
          title: `${pkgName} Activation`,
          description: `S4 Matrix package activated on-chain`,
          amount: `$${price} USDT`,
          member: this.formatMaskedMember(wallet),
          timestamp: 'Just now',
          status: 'Confirmed',
          isDemo: false,
        };

        teamTxRecord = {
          id: `team-s4-${tx}`,
          activityType: 'Package Activation',
          memberWallet: wallet,
          userId: payload.userId || 'MDF-User',
          packageName: pkgName,
          amount: `$${price} USDT`,
          status: 'Confirmed',
          date: 'Just now',
          timestamp: 'Just now',
          details: `S4 matrix package position activated on-chain`,
          txHash: tx,
        };
        break;
      }

      case 'QUANTUM_ACTIVATION': {
        const price = 70;
        userActivityItem = {
          id: `quantum-${tx}`,
          type: 'Quantum Node',
          title: 'Quantum Node ($70) Activated',
          amount: `-$${price} USD`,
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: 'Quantum Node 30-position concentric radial matrix activated on BSC',
          walletAddress: wallet,
          read: false,
        };

        publicActivityItem = {
          id: `eco-quantum-${tx}`,
          type: 'PACKAGE',
          title: 'Quantum Node Activation',
          description: 'Quantum Node radial matrix package activated',
          amount: `$${price} USDT`,
          member: this.formatMaskedMember(wallet),
          timestamp: 'Just now',
          status: 'Confirmed',
          isDemo: false,
        };

        teamTxRecord = {
          id: `team-quantum-${tx}`,
          activityType: 'Package Activation',
          memberWallet: wallet,
          userId: payload.userId || 'MDF-User',
          packageName: 'Quantum Node ($70)',
          amount: '$70 USDT',
          status: 'Confirmed',
          date: 'Just now',
          timestamp: 'Just now',
          details: 'Quantum matrix position active on-chain',
          txHash: tx,
        };
        break;
      }

      case 'NEXUS_PRIME_ACTIVATION': {
        const price = 120;
        userActivityItem = {
          id: `prime-${tx}`,
          type: 'Nexus Prime',
          title: 'Nexus Prime ($120) Activated',
          amount: `-$${price} USD`,
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: 'Nexus Prime 4-ring concentric matrix activated on BSC',
          walletAddress: wallet,
          read: false,
        };

        publicActivityItem = {
          id: `eco-prime-${tx}`,
          type: 'PACKAGE',
          title: 'Nexus Prime Activation',
          description: 'Nexus Prime concentric priority package activated',
          amount: `$${price} USDT`,
          member: this.formatMaskedMember(wallet),
          timestamp: 'Just now',
          status: 'Confirmed',
          isDemo: false,
        };

        teamTxRecord = {
          id: `team-prime-${tx}`,
          activityType: 'Package Activation',
          memberWallet: wallet,
          userId: payload.userId || 'MDF-User',
          packageName: 'Nexus Prime ($120)',
          amount: '$120 USDT',
          status: 'Confirmed',
          date: 'Just now',
          timestamp: 'Just now',
          details: 'Nexus Prime package active on-chain',
          txHash: tx,
        };
        break;
      }

      case 'STARTER_CLAIM': {
        const claimed = payload.amountUsdt || 185.00;
        const prevTotal = this.state.starterTotalSettled;
        const newTotal = prevTotal + claimed;
        this.state.starterTotalSettled = newTotal;
        this.state.grandTotalSettled = newTotal + this.state.premiumTotalSettled + this.state.salaryTotalSettled;

        try {
          localStorage.setItem('mdefi_starter_total_settled', newTotal.toString());
        } catch {}

        // Standardized title matching user requirements
        userActivityItem = {
          id: `claim-starter-${tx}`,
          type: 'Claim',
          title: `Weekly Reward Starter — $${claimed.toFixed(2)} USDT successfully claimed`,
          amount: `+${claimed.toFixed(2)} USDT`,
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: `Weekly Reward Starter of +$${claimed.toFixed(2)} USDT collected to wallet on BSC. Total Settled: $${newTotal.toFixed(2)} USDT.`,
          walletAddress: wallet,
          read: false,
        };

        publicActivityItem = {
          id: `eco-starter-${tx}`,
          type: 'WEEKLY_REWARD',
          title: 'Weekly Starter Reward',
          description: 'Weekly Starter community pool distribution credited',
          amount: `+${claimed.toFixed(2)} USDT`,
          member: this.formatMaskedMember(wallet),
          timestamp: 'Just now',
          status: 'Confirmed',
          isDemo: false,
        };

        teamTxRecord = {
          id: `team-starter-${tx}`,
          activityType: 'Weekly Reward',
          memberWallet: wallet,
          userId: payload.userId || 'MDF-User',
          packageName: 'Starter Pool',
          amount: `+${claimed.toFixed(2)} USDT`,
          status: 'Confirmed',
          date: 'Just now',
          timestamp: 'Just now',
          details: `Weekly Starter pool reward claimed. Total Settled: $${newTotal.toFixed(2)}`,
          txHash: tx,
        };
        break;
      }

      case 'PREMIUM_CLAIM': {
        const claimed = payload.amountUsdt || 340.00;
        const prevTotal = this.state.premiumTotalSettled;
        const newTotal = prevTotal + claimed;
        this.state.premiumTotalSettled = newTotal;
        this.state.grandTotalSettled = this.state.starterTotalSettled + newTotal + this.state.salaryTotalSettled;

        try {
          localStorage.setItem('mdefi_premium_total_settled', newTotal.toString());
        } catch {}

        // Standardized title matching user requirements
        userActivityItem = {
          id: `claim-premium-${tx}`,
          type: 'Claim',
          title: `Weekly Reward Premium — $${claimed.toFixed(2)} USDT successfully claimed`,
          amount: `+${claimed.toFixed(2)} USDT`,
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: `Weekly Reward Premium of +$${claimed.toFixed(2)} USDT collected to wallet on BSC. Total Settled: $${newTotal.toFixed(2)} USDT.`,
          walletAddress: wallet,
          read: false,
        };

        publicActivityItem = {
          id: `eco-premium-${tx}`,
          type: 'WEEKLY_REWARD',
          title: 'Weekly Premium Reward',
          description: 'Weekly Premium share distribution credited',
          amount: `+${claimed.toFixed(2)} USDT`,
          member: this.formatMaskedMember(wallet),
          timestamp: 'Just now',
          status: 'Confirmed',
          isDemo: false,
        };

        teamTxRecord = {
          id: `team-premium-${tx}`,
          activityType: 'Weekly Reward',
          memberWallet: wallet,
          userId: payload.userId || 'MDF-User',
          packageName: 'Premium Pool',
          amount: `+${claimed.toFixed(2)} USDT`,
          status: 'Confirmed',
          date: 'Just now',
          timestamp: 'Just now',
          details: `Weekly Premium pool reward claimed. Total Settled: $${newTotal.toFixed(2)}`,
          txHash: tx,
        };
        break;
      }

      case 'SALARY_CLAIM': {
        const claimed = payload.amountUsdt || 30.00;
        const prevTotal = this.state.salaryTotalSettled;
        const newTotal = prevTotal + claimed;
        this.state.salaryTotalSettled = newTotal;
        this.state.grandTotalSettled = this.state.starterTotalSettled + this.state.premiumTotalSettled + newTotal;

        try {
          localStorage.setItem('mdefi_salary_total_settled', newTotal.toString());
        } catch {}

        // Standardized title matching user requirements
        userActivityItem = {
          id: `claim-salary-${tx}`,
          type: 'Claim',
          title: `Weekly Passive Salary — $${claimed.toFixed(2)} USDT successfully claimed`,
          amount: `+${claimed.toFixed(2)} USDT`,
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: `Weekly Passive Salary of +$${claimed.toFixed(2)} USDT collected to wallet on BSC. Total Settled: $${newTotal.toFixed(2)} USDT.`,
          walletAddress: wallet,
          read: false,
        };

        publicActivityItem = {
          id: `eco-salary-${tx}`,
          type: 'WEEKLY_SALARY',
          title: 'Weekly Salary Payout',
          description: 'Rank-based leadership salary credited to wallet',
          amount: `+${claimed.toFixed(2)} USDT`,
          member: this.formatMaskedMember(wallet),
          timestamp: 'Just now',
          status: 'Confirmed',
          isDemo: false,
        };

        teamTxRecord = {
          id: `team-salary-${tx}`,
          activityType: 'Weekly Salary',
          memberWallet: wallet,
          userId: payload.userId || 'MDF-User',
          packageName: 'Salary Pool',
          amount: `+${claimed.toFixed(2)} USDT`,
          status: 'Confirmed',
          date: 'Just now',
          timestamp: 'Just now',
          details: `Weekly Passive Salary payout confirmed. Total Settled: $${newTotal.toFixed(2)}`,
          txHash: tx,
        };
        break;
      }

      case 'MBTTC_APPROVAL': {
        const fee = payload.amountMbttc || 5;
        userActivityItem = {
          id: `appr-${tx}`,
          type: 'Claim',
          title: 'MBTTC Fee Approved',
          amount: `${fee} MBTTC`,
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: payload.details || `On-chain MBTTC allowance approval confirmed on BSC for smart contract interaction`,
          walletAddress: wallet,
          read: true,
        };
        break;
      }

      case 'MBTTC_TRANSFER': {
        const amount = payload.amountMbttc || 0;
        userActivityItem = {
          id: `mbttc-tx-${tx}`,
          type: 'Income',
          title: 'MBTTC Token Transfer',
          amount: `${amount > 0 ? '+' : ''}${amount.toFixed(2)} MBTTC`,
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: payload.details || `MBTTC token transaction executed on BSC`,
          walletAddress: wallet,
          read: false,
        };
        break;
      }

      case 'MATRIX_INCOME': {
        const amount = payload.amountUsdt || 4.00;
        userActivityItem = {
          id: `matrix-inc-${tx}`,
          type: 'Income',
          title: 'Matrix Yield Credited',
          amount: `+${amount.toFixed(2)} USDT`,
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: payload.details || `Matrix cycle re-entry reward credited from placement`,
          walletAddress: wallet,
          read: false,
        };

        publicActivityItem = {
          id: `eco-matrix-inc-${tx}`,
          type: 'MATRIX_INCOME',
          title: 'Matrix Spillover Income',
          description: 'Matrix placement commission credited',
          amount: `+${amount.toFixed(2)} USDT`,
          member: this.formatMaskedMember(wallet),
          timestamp: 'Just now',
          status: 'Confirmed',
          isDemo: false,
        };

        teamTxRecord = {
          id: `team-matrix-inc-${tx}`,
          activityType: 'Matrix Income',
          memberWallet: wallet,
          userId: payload.userId || 'MDF-User',
          packageName: payload.packageName || 'Matrix System',
          amount: `+$${amount.toFixed(2)} USDT`,
          status: 'Confirmed',
          date: 'Just now',
          timestamp: 'Just now',
          details: payload.details || 'Matrix slot re-entry commission generated',
          txHash: tx,
        };
        break;
      }

      case 'TOKEN_SWAP': {
        userActivityItem = {
          id: `swap-${tx}`,
          type: 'Token Swap',
          title: 'Token Swap Executed',
          amount: payload.title || 'DEX Swap',
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: payload.details || 'Decentralized liquidity token swap executed on-chain',
          walletAddress: wallet,
          read: false,
        };

        publicActivityItem = {
          id: `eco-swap-${tx}`,
          type: 'CLAIM',
          title: 'DEX Token Swap',
          description: 'Decentralized token exchange completed',
          amount: payload.title || 'Swap',
          member: this.formatMaskedMember(wallet),
          timestamp: 'Just now',
          status: 'Confirmed',
          isDemo: false,
        };
        break;
      }

      case 'RATING_SUBMISSION': {
        // Strict specification: Greeting/Rating has its own domain and must NOT create a notification item
        // or trigger unread badges, blockchain transactions, or ecosystem activities.
        userActivityItem = null;
        publicActivityItem = null;
        teamTxRecord = null;
        break;
      }

      case 'TREASURY_IPO_EVENT': {
        userActivityItem = {
          id: `ipo-${tx}`,
          type: 'Package Reward',
          title: 'Treasury IPO Event Confirmed',
          amount: payload.title || 'IPO Action',
          date: dateStr,
          status: 'Confirmed',
          txHash: tx,
          details: payload.details || 'Treasury IPO smart contract action confirmed on BSC',
          walletAddress: wallet,
          read: false,
        };

        publicActivityItem = {
          id: `eco-ipo-${tx}`,
          type: 'PACKAGE',
          title: 'Treasury IPO Event',
          description: 'Treasury protocol liquidity event executed',
          amount: payload.title || 'IPO Action',
          member: this.formatMaskedMember(wallet),
          timestamp: 'Just now',
          status: 'Confirmed',
          isDemo: false,
        };
        break;
      }

      default:
        break;
    }

    // Update central activities & deduplicate
    if (userActivityItem) {
      this.state.activities = normalizeAndDeduplicateActivities([userActivityItem, ...this.state.activities], wallet);
    }

    if (publicActivityItem) {
      this.state.publicEcosystemActivities = [publicActivityItem, ...this.state.publicEcosystemActivities];
    }

    if (teamTxRecord) {
      this.state.teamTransactions = [teamTxRecord, ...this.state.teamTransactions];
    }

    this.state.lastSyncTimestamp = timestamp;

    // Notify all subscribers reactively
    this.notifySubscribers();

    return { success: true, isDuplicate: false };
  }

  public subscribe(listener: (state: SynchronizedEcosystemState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifySubscribers() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (err) {
        console.error('[CentralEventSync] Listener error:', err);
      }
    });
  }

  public getState(): SynchronizedEcosystemState {
    return {
      ...this.state,
      teamMembers: [...this.state.teamMembers],
      activities: [...this.state.activities],
      publicEcosystemActivities: [...this.state.publicEcosystemActivities],
      teamTransactions: [...this.state.teamTransactions],
    };
  }

  public getStarterTotalSettled(): number {
    return this.state.starterTotalSettled;
  }

  public getPremiumTotalSettled(): number {
    return this.state.premiumTotalSettled;
  }

  public getSalaryTotalSettled(): number {
    return this.state.salaryTotalSettled;
  }

  public getGrandTotalSettled(): number {
    return this.state.grandTotalSettled;
  }
}

export const centralEventSyncService = new CentralEventSyncService();
