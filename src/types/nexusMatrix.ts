export type NexusPackageId = 1 | 2;

export type NexusPositionType = 'self' | 'direct' | 'spill' | 'recycle' | 'empty';

export type NexusTransactionCategory =
  | 'Package Activation'
  | 'Matrix Placement'
  | 'Direct Placement'
  | 'Spillover'
  | 'Recycle'
  | 'Re-entry'
  | 'Matrix Income'
  | 'Cycle Reward';

export interface NexusMatrixPosition {
  positionNumber: number; // 1 to 30
  level: 1 | 2 | 3 | 4; // L1: 2, L2: 4, L3: 8, L4: 16
  ringIndex: 1 | 2 | 3 | 4;
  slotInRing: number; // 1-based index within its ring
  type: NexusPositionType;
  status: 'Filled' | 'Available';
  userId?: string;
  walletAddress?: string;
  matrixNumber: number;
  recycleNumber: number;
  activationDate?: string;
  parentPositionNumber?: number;
  directSponsorId?: string;
  isDirect: boolean;
  isSpillover: boolean;
  isRecycle: boolean;
  incomeGeneratedUSD?: number;
  note?: string;
}

export interface NexusPackageStats {
  packageId: NexusPackageId;
  name: string;
  priceUSD: number;
  status: 'Active' | 'Inactive';
  activationDate: string;
  currentMatrixNumber: number;
  recycleCount: number;
  lastRecycleDate?: string;
  totalPositions: 30;
  filledPositions: number;
  availablePositions: number;
  openPositions?: number;
  directMembersCount: number;
  directPlacements?: number;
  spilloverMembersCount: number;
  spilloverCount?: number;
  recyclePositionsCount: number;
  completionPercentage: number;
  directIncomeSupported: string;
  matrixIncomeSupported: string;
  matrixIncomeUSD?: number;
  recycleIncomeSupported: string;
  totalCycleEstimateSupported: string;
}

export interface NexusTransactionRecord {
  id: string;
  packageId: NexusPackageId;
  dateTime: string;
  type: NexusTransactionCategory;
  package: string;
  position: string;
  member: string;
  memberWallet?: string;
  amount: string;
  status: 'Confirmed' | 'Pending';
  txHash: string;
  contractEvent?: string;
}

export interface NexusTreeData {
  packageId: NexusPackageId;
  packageName: string;
  priceUSD: number;
  currentMatrixNumber: number;
  recycleCount: number;
  rootUser: {
    userId: string;
    walletAddress: string;
    matrixNumber: number;
    recycleCount: number;
  };
  positions: NexusMatrixPosition[];
}
