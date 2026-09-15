export type S4PlacementType = 'direct' | 'spillover' | 'recycle' | 'self' | 'empty';

export type S4TransactionType = 
  | 'Package Activation'
  | 'Direct Income'
  | 'Matrix Income'
  | 'Spillover'
  | 'Recycle'
  | 'Re-entry'
  | 'Claim'
  | 'Reward';

export interface S4MatrixPosition {
  id: string;
  slot: number; // 1 to 6 (Level 1: 1, 2; Level 2: 3, 4, 5, 6)
  level: 1 | 2;
  userId: string;
  walletAddress: string;
  placementType: S4PlacementType;
  status: 'Filled' | 'Available';
  matrixNumber: number;
  recycleNumber: number;
  activationDate?: string;
  parentId?: string;
  actualParentId?: string;
  sponsorId?: string;
  leftChildId?: string;
  rightChildId?: string;
  incomeGeneratedUSD?: number;
}

export interface S4PackageData {
  id: 1 | 2;
  packageKey: 'junior' | 'senior';
  name: string;
  priceUSD: number;
  priceDisplay: string;
  description: string;
  status: 'Active' | 'Inactive' | 'Available';
  activationDate: string;
  currentMatrixNumber: number;
  recycleCount: number;
  lastRecycleDate: string;
  nextMatrixStatus: string;
  directIncome: string;
  matrixIncome: string;
  recycleIncome: string;
  recycleIncomeNote: string;
  totalIncomePerCompleteMatrix: string;
  filledPositions: number;
  totalPositions: number;
  totalMatrixCompletions: number;
  rootUser: {
    userId: string;
    walletAddress: string;
    matrixNumber: number;
    recycleCount: number;
  };
  positions: S4MatrixPosition[];
  transactions: S4TransactionRecord[];
}

export interface S4TransactionRecord {
  id: string;
  dateTime: string;
  type: S4TransactionType;
  amount: string;
  matrix: string;
  level: string;
  position: string;
  placementType: S4PlacementType;
  status: 'Confirmed' | 'Pending';
  txHash: string;
  feeDemo: string;
  details?: string;
}
