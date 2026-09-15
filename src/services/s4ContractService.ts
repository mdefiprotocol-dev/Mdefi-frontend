import { S4PackageData, S4MatrixPosition, S4TransactionRecord } from '../types/s4Matrix';
import { contractAdapter } from './contractAdapter';

/**
 * Service interface for S4 Matrix Contract Data
 * Provides decoupled, contract-ready querying for Junior ($10) and Senior ($25) nodes.
 * Architecture: UI -> s4ContractService -> contractAdapter -> contractProvider -> verified smart contract
 */
export interface IS4ContractService {
  getPackageData(packageKey: 'junior' | 'senior'): Promise<S4PackageData>;
  getPositions(packageKey: 'junior' | 'senior'): Promise<S4MatrixPosition[]>;
  getTransactions(packageKey: 'junior' | 'senior'): Promise<S4TransactionRecord[]>;
}

class S4ContractService implements IS4ContractService {
  /**
   * Reads the current S4 package data via centralized contractAdapter:
   * Direct Yield: 20% of package price per direct sponsor
   * Matrix Yield: 20% of package price per matrix slot
   * Recycle Returns: Automated re-entry cycle basis
   */
  async getPackageData(packageKey: 'junior' | 'senior'): Promise<S4PackageData> {
    return await contractAdapter.getS4MatrixData(packageKey);
  }

  async getPositions(packageKey: 'junior' | 'senior'): Promise<S4MatrixPosition[]> {
    const pkg = await contractAdapter.getS4MatrixData(packageKey);
    return pkg.positions;
  }

  async getTransactions(packageKey: 'junior' | 'senior'): Promise<S4TransactionRecord[]> {
    const pkg = await contractAdapter.getS4MatrixData(packageKey);
    return pkg.transactions;
  }
}

export const s4ContractService = new S4ContractService();
