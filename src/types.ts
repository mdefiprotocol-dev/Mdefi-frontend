export type NavPage = 
  | 'overview'
  | 'hub'
  | 'mbttc'
  | 's4-matrix'
  | 'quantum-nexus'
  | 'nexus-prime'
  | 'weekly_reward_starter'
  | 'weekly_reward_premium'
  | 'weekly_passive_salary'
  | 'team'
  | 'packages'
  | 'income'
  | 'transactions'
  | 'profile';

export interface UserProfile {
  userId: string; // Dynamic user facing ID (jaise: MDF-00002)
  blockchainNumericId?: number; // On-chain uint64 numeric ID
  numericId?: number;
  walletAddress: string;
  sponsorAddress?: string;
  sponsorId?: string; // On-chain upline sponsor ID
  sponsorNumericId?: number;
  memberSince: string;
  registrationTimestamp?: number; // Block timestamp
  registrationStatus?: 'Active' | 'Pending' | 'Inactive';
  registrationReward?: number; // On-chain phase reward (Phase 1 = 30 MBTTC)
  referralCode?: string;
  directTeamCount: number;
  totalTeamCount: number;
  displayName?: string;
  avatarUrl?: string;
  referralLink?: string;
  isRegistered?: boolean;
  isBlocked?: boolean;
  currentRank?: string;
  totalEarnedUsdt?: number;
  totalEarnedMbttc?: number;
  isRealBlockchainData?: boolean;
}
export interface RewardBalances {
  // Referral rewards
  referralEarned: number;
  referralClaimed: number;
  referralClaimable: number;
  lastReferralClaim: string;
  nextReferralClaimSec: number;

  // Package rewards
  packageEarned: number;
  packageClaimed: number;
  packageClaimable: number;
  lastPackageClaim: string;
  nextPackageClaimSec: number;

  // MBTTC general
  mbttcBalance: number;
  usdtBalance?: number;
  isRealBlockchainData?: boolean;
}

export interface PackageItem {
  id: string;
  numericId?: number;
  name: string;
  priceUSD: number;
  status: 'Active' | 'Available' | 'Pending';
  activationDate?: string;
  version?: string;
  rewardStatus?: string;
  dailyRewardEstimate?: string;
  maxReturn?: string;
  features?: string[];
  isPopular?: boolean;
}

export interface TeamMember {
  id: string;
  address: string;
  userId: string;
  package: string;
  status: 'Active' | 'Inactive';
  joinedDate: string;
  volumeUSD: number;
  isDirect: boolean;
  directPartners: number;
  name?: string;
  sponsor?: string;
  sponsorAddress?: string;
  level?: number;
  activePackages?: number;
}

export interface ActivityItem {
  id: string;
  type: 
    | 'Registration'
    | 'Registration Reward'
    | 'Referral Reward'
    | 'Package Reward'
    | 'Claim'
    | 'Package Activation'
    | 'Quantum Node'
    | 'Nexus Prime'
    | 'Token Swap'
    | 'Team Income'
    | 'Direct Referral'
    | 'Matrix Income'
    | 'Weekly Reward'
    | 'Weekly Salary'
    | 'S4 Matrix'
    | 'Hub Approval'
    | 'USDT Approval'
    | 'System Activation'
    | (string & {});
  amount: string;
  date: string;
  status: 'Confirmed' | 'Pending' | 'Failed';
  txHash: string;
  details?: string;
  title?: string;
  walletAddress?: string;
  read?: boolean;
  eventIndex?: number;
  logIndex?: number;
  timestamp?: number;
  createdAt?: number;
}

export interface MbttcTokenStats {
  registrationMinted: string;
  referralMinted: string;
  packageMinted: string;
  totalClaimed: string;
  totalBurned: string;
  pendingRewards: string;
  circulatingSupply: string;
  livePriceNote: string;
}

export interface IncomeBreakdown {
  totalIncomeUSD: number;
  totalMbttc: number;
  referralIncomeUSD: number;
  packageIncomeUSD: number;
  matrixIncomeUSD: number;
  otherIncomeUSD: number;
}

export interface TransactionRecord {
  id: string;
  date: string;
  type: 'Registration' | 'Referral' | 'Package' | 'Claim';
  amount: string;
  status: 'Confirmed' | 'Pending';
  txHash: string;
  gasFeeBnb?: string;
}

export type EcosystemActivityType = 
  | 'REGISTRATION'
  | 'PACKAGE'
  | 'MBTTC_CREDIT'
  | 'MBTTC_CLAIM'
  | 'DIRECT_INCOME'
  | 'MATRIX_INCOME'
  | 'WEEKLY_REWARD'
  | 'WEEKLY_SALARY'
  | 'CLAIM';

export interface EcosystemActivity {
  id: string;
  type: EcosystemActivityType;
  title: string;
  description: string;
  amount: string;
  asset?: string;
  member: string;
  timestamp: string;
  source?: 'contract';
  status: 'Confirmed' | 'Pending';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description: string;
}

export interface TeamTransactionRecord {
  id: string;
  memberWallet: string;
  userId?: string;
  packageId?: string;
  packageName?: string;
  packageAmount?: string;
  packageDetails?: string;
  amount: string;
  status: 'Confirmed' | 'Pending' | 'Failed';
  txHash?: string;
  date: string;
  timestamp?: string;
  activityType: string;
  details?: string;
  isRealData?: boolean;
}