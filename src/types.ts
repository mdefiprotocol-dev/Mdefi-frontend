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
  userId: string; // User-facing identifier (e.g. "MDF-25861")
  blockchainNumericId?: number; // Official on-chain uint256 / uint64 numeric ID
  walletAddress: string;
  sponsorAddress: string;
  sponsorId?: string; // User-facing sponsor identifier (e.g. "MDF-00109")
  sponsorNumericId?: number; // Official on-chain uint256 / uint64 numeric sponsor ID
  memberSince: string;
  registrationTimestamp?: number; // On-chain block timestamp
  registrationStatus: 'Active' | 'Pending' | 'Inactive';
  registrationReward: number; // Phase 1 MBTTC Welcome Bonus
  referralCode: string;
  directTeamCount: number;
  totalTeamCount: number;
  displayName?: string;
  avatarUrl?: string;
  referralLink?: string;
  isRealBlockchainData?: boolean; // Distinguishes real on-chain user from demo simulation
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
  demoUsdRate: number; // For demo USD approximations
  isRealBlockchainData?: boolean; // Distinguishes real on-chain balance from demo
}

export interface PackageItem {
  id: string;
  name: string;
  priceUSD: number;
  status: 'Active' | 'Available' | 'Pending';
  activationDate: string;
  version: string;
  rewardStatus: string;
  dailyRewardEstimate: string;
  maxReturn: string;
  features: string[];
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
  status: 'Confirmed' | 'Pending' | 'Failed' | 'Simulated';
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
  feeDemo: string;
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
  source?: 'contract' | 'simulated';
  status: 'Simulated' | 'Confirmed';
  isDemo: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
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
  status: 'Confirmed' | 'Pending' | 'Failed' | 'Simulated';
  txHash?: string;
  date: string;
  timestamp?: string;
  activityType: string;
  details?: string;
  isRealData?: boolean;
}
