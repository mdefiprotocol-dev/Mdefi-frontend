import { 
  NexusPackageId, 
  NexusPackageStats, 
  NexusTreeData, 
  NexusTransactionRecord, 
  NexusMatrixPosition 
} from '../types/nexusMatrix';
import { 
  quantumNodeStats, 
  quantumNodeTreeData, 
  quantumNodeTransactions,
  nexusPrimeStats, 
  nexusPrimeTreeData, 
  nexusPrimeTransactions 
} from '../data/nexusMatrixData';
import { contractAdapter } from './contractAdapter';

export interface UserMatrixRecord {
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
}

export interface INexusContractService {
  getUserStatistics(packageId: NexusPackageId): Promise<NexusPackageStats>;
  getMatrixStatistics(packageId: NexusPackageId): Promise<{
    packageId: NexusPackageId;
    totalPositions: 30;
    filledPositions: number;
    availablePositions: number;
    level1Count: number;
    level2Count: number;
    level3Count: number;
    level4Count: number;
    completionPercentage: number;
    recycleCount: number;
    activeCyclesCount: number;
  }>;
  getMatrixTree(packageId: NexusPackageId): Promise<NexusTreeData>;
  getUserMatrix(packageId: NexusPackageId): Promise<UserMatrixRecord>;
  getPackageTransactions(packageId: NexusPackageId): Promise<NexusTransactionRecord[]>;
  activatePackage(packageId: NexusPackageId): Promise<{ success: boolean; txHash: string; message: string }>;
}

class NexusContractMockService implements INexusContractService {
  private quantumStats: NexusPackageStats = { ...quantumNodeStats };
  private quantumTree: NexusTreeData = { ...quantumNodeTreeData };
  private quantumTx: NexusTransactionRecord[] = [...quantumNodeTransactions];

  private primeStats: NexusPackageStats = { ...nexusPrimeStats };
  private primeTree: NexusTreeData = { ...nexusPrimeTreeData };
  private primeTx: NexusTransactionRecord[] = [...nexusPrimeTransactions];

  /**
   * Contract Read: getUserStatistics(packageId)
   * Fetches the user-level matrix performance and recycle metrics
   */
  async getUserStatistics(packageId: NexusPackageId): Promise<NexusPackageStats> {
    await new Promise((r) => setTimeout(r, 60)); // Fast responsive resolution
    if (packageId === 1) {
      return { ...this.quantumStats };
    }
    return { ...this.primeStats };
  }

  /**
   * Contract Read: getMatrixStatistics(packageId)
   * Fetches the structural distribution of positions across L1, L2, L3, L4 rings
   */
  async getMatrixStatistics(packageId: NexusPackageId) {
    await new Promise((r) => setTimeout(r, 60));
    const tree = packageId === 1 ? this.quantumTree : this.primeTree;
    const stats = packageId === 1 ? this.quantumStats : this.primeStats;

    const l1Filled = tree.positions.filter((p) => p.level === 1 && p.status === 'Filled').length;
    const l2Filled = tree.positions.filter((p) => p.level === 2 && p.status === 'Filled').length;
    const l3Filled = tree.positions.filter((p) => p.level === 3 && p.status === 'Filled').length;
    const l4Filled = tree.positions.filter((p) => p.level === 4 && p.status === 'Filled').length;

    return {
      packageId,
      totalPositions: 30 as const,
      filledPositions: stats.filledPositions,
      availablePositions: stats.availablePositions,
      level1Count: l1Filled,
      level2Count: l2Filled,
      level3Count: l3Filled,
      level4Count: l4Filled,
      completionPercentage: stats.completionPercentage,
      recycleCount: stats.recycleCount,
      activeCyclesCount: stats.currentMatrixNumber,
    };
  }

  /**
   * Contract Read: getMatrixTree(packageId)
   * Fetches the full radial 30-position tree for the package
   */
  async getMatrixTree(packageId: NexusPackageId): Promise<NexusTreeData> {
    await new Promise((r) => setTimeout(r, 80));
    if (packageId === 1) {
      return {
        ...this.quantumTree,
        positions: [...this.quantumTree.positions],
      };
    }
    return {
      ...this.primeTree,
      positions: [...this.primeTree.positions],
    };
  }

  /**
   * Contract Read: getUserMatrix(packageId)
   * Fetches the active matrix lifecycle metadata
   */
  async getUserMatrix(packageId: NexusPackageId): Promise<UserMatrixRecord> {
    await new Promise((r) => setTimeout(r, 60));
    const stats = packageId === 1 ? this.quantumStats : this.primeStats;
    const tree = packageId === 1 ? this.quantumTree : this.primeTree;

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
    };
  }

  /**
   * Contract Read: Transactions specific to this package only
   */
  async getPackageTransactions(packageId: NexusPackageId): Promise<NexusTransactionRecord[]> {
    await new Promise((r) => setTimeout(r, 60));
    if (packageId === 1) {
      return [...this.quantumTx];
    }
    return [...this.primeTx];
  }

  /**
   * Contract Write: activatePackage(packageId)
   * Centralized through contractAdapter across Demo and Live modes
   */
  async activatePackage(packageId: NexusPackageId, walletAddress: string = ''): Promise<{ success: boolean; txHash: string; message: string }> {
    const res = await contractAdapter.executeQuantumActivation(packageId, walletAddress);

    if (res.success) {
      if (packageId === 1) {
        this.quantumStats.status = 'Active';
      } else {
        this.primeStats.status = 'Active';
      }
    }

    return {
      success: res.success,
      txHash: res.txHash,
      message: res.message || (packageId === 1 ? 'Quantum Node ($70) activated' : 'Nexus Prime Node ($120) activated'),
    };
  }
}

export const nexusContractService = new NexusContractMockService();
