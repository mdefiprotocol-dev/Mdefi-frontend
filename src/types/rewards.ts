export interface SmartContractTimerInfo {
  contractAddress: string;
  contractName: string;
  network: string;
  epochCycleSeconds: number;
  remainingSeconds: number;
  isClaimWindowOpen: boolean;
  demoTestingMode: boolean;
}

export interface WeeklyStarterData {
  currentWeek: number;
  status: 'Active' | 'Closed';
  remainingSeconds: number;
  directPartners: number;
  requiredDirectPartners: number; // Exactly 2
  isQualified: boolean;
  allocatedShares: number; // 1 share per direct partner! (e.g. 12 directs = 12 shares)
  qualificationProgressPercent: number; // e.g. min(100, (12/2)*100) = 100%
  totalWeeklyShares: number;
  currentPoolUsdt: number;
  weeklyDepositsUsdt: number;
  poolStatus: string;
  estimatedRewardUsdt: number;
  claimableRewardUsdt: number;
  totalRewardEarnedUsdt: number;
  totalRewardClaimedUsdt: number;
  claimFeeMbttc: number;
  lastClaimWeek: number;
  lastClaimDate: string;
  contractAddress?: string;
  contractName?: string;
  isClaimAvailable?: boolean;
}

export interface WeeklyStarterClaimRecord {
  id: string;
  week: number;
  directPartners: number;
  shares: number;
  rewardUsdt: number;
  claimFeeMbttc: number;
  status: 'Confirmed' | 'Pending';
  claimDate: string;
  txHash: string;
}

export interface WeeklyPremiumData {
  currentWeek: number;
  status: 'Active' | 'Closed';
  remainingSeconds: number;
  directPartners: number;
  requiredDirectPartners: number; // Exactly 3
  isQualified: boolean;
  allocatedShares: number; // 1 share per direct partner! (e.g. 12 directs = 12 shares)
  qualificationProgressPercent: number; // e.g. min(100, (12/3)*100) = 100%
  totalWeeklyShares: number;
  userSharePercentage: number;
  currentPoolUsdt: number;
  weeklyDepositsUsdt: number;
  poolStatus: string;
  estimatedRewardUsdt: number;
  claimableRewardUsdt: number;
  totalRewardEarnedUsdt: number;
  totalRewardClaimedUsdt: number;
  totalClaimsCount: number;
  claimFeeMbttc: number;
  lastClaimDate: string;
  contractAddress?: string;
  contractName?: string;
  isClaimAvailable?: boolean;
}

export interface WeeklyPremiumClaimRecord {
  id: string;
  week: number;
  directPartners: number;
  shares: number;
  rewardUsdt: number;
  claimFeeMbttc: number;
  status: 'Confirmed' | 'Pending';
  claimDate: string;
  txHash: string;
}

export type PassiveSalaryRankName = 
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Blue Diamond'
  | 'Crown Diamond';

export interface WeeklySalaryRankItem {
  rankLevel: number;
  rankName: PassiveSalaryRankName;
  requiredDirects: number;
  additionalDirects?: number;
  weeklySalaryUsdt: number;
  maxWeeks: number;
  totalPotentialUsdt: number;
  status: 'completed' | 'current' | 'next' | 'locked';
  iconStyle: string;
  animation: string;
  colorScheme: {
    badgeBg: string;
    border: string;
    text: string;
    glow: string;
    accent: string;
  };
}

export interface WeeklySalaryData {
  currentRankLevel: number;
  currentRankName: PassiveSalaryRankName;
  directPartners: number;
  requiredDirectPartnersForCurrent: number;
  weeklySalaryUsdt: number;
  pendingSalaryUsdt: number;
  pendingWeeks: number;
  claimableSalaryUsdt: number;
  remainingClaimableWeeks: number;
  nextRankLevel: number;
  nextRankName: PassiveSalaryRankName;
  nextRankRequiredDirects: number;
  nextRankProgressPercent: number;
  remainingDirectsForNext: number;
  totalSalaryEarnedUsdt: number;
  totalSalaryClaimedUsdt: number;
  totalClaimsCount: number;
  lifetimeSalaryEarnedUsdt: number;
  lifetimeSalaryClaimedUsdt: number;
  highestRank: PassiveSalaryRankName;
  claimFeeMbttc: number;
  nextClaimRemainingSeconds: number;
  nextClaimDateFormatted: string;
  contractAddress?: string;
  contractName?: string;
  isClaimAvailable?: boolean;
}

export interface WeeklySalaryClaimRecord {
  id: string;
  claimDate: string;
  weeksClaimed: number;
  weekNumbers: string;
  salaryAmountUsdt: number;
  claimFeeMbttc: number;
  status: 'Confirmed' | 'Pending';
  txHash: string;
}

export interface RankHistoryRecord {
  id: string;
  rank: PassiveSalaryRankName;
  date: string;
  week: number;
  status: 'Verified' | 'Active';
}

export interface ClaimChartPoint {
  id: string;
  date: string;
  weekLabel: string;
  amount: number;
  cumulative: number;
  timestamp: number;
}
