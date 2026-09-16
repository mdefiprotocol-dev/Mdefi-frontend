/**
 * MDeFi Contract Provider Architecture (Phase 1 -> Phase 4 Ready)
 * 
 * Clean abstraction separating:
 * - Demo Provider (current mock/demo benchmark functionality)
 * - Real Contract Provider (future deployed smart contracts)
 * 
 * ARCHITECTURAL RULES:
 * - Smart contracts are NOT deployed yet.
 * - Demo data must NEVER accidentally appear as LIVE blockchain data.
 * - In Live Mode, the blockchain is the sole source of truth.
 * - In Live Mode, no fake transaction hashes or guessed function calls.
 * - Where ABI/function is unknown: leave clear TODO integration placeholder.
 */

import {
  CONTRACT_ADDRESSES,
  isContractDeployed,
  HUB_ABI,
  MBTTC_ABI,
} from '../config/contractConfig';
import { ethers } from 'ethers';
export type TransactionLifecycleState =
  | 'READY'
  | 'PREPARING'
  | 'WALLET_CONFIRMATION'
  | 'PENDING'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'FAILED'
  | 'REVERTED';

export interface IProviderTxResult {
  success: boolean;
  txHash: string;
  status: TransactionLifecycleState;
  isRealBlockchainData: boolean;
  message?: string;
  receipt?: any;
}

export interface IContractProvider {
  isLive(): boolean;
  read<T = any>(contractKey: keyof typeof CONTRACT_ADDRESSES, methodName: string, args?: any[]): Promise<T>;
  write(
    contractKey: keyof typeof CONTRACT_ADDRESSES,
    methodName: string,
    args?: any[],
    valueWei?: string
  ): Promise<IProviderTxResult>;
  waitForConfirmation(txHash: string): Promise<boolean>;
}

/**
 * Demo Provider: Implements benchmark simulated responses for developer & preview testing
 * Guaranteed to flag isRealBlockchainData: false so demo values are never confused with live state.
 */
export class DemoContractProvider implements IContractProvider {
  public isLive(): boolean {
    return false;
  }

  public async read<T = any>(_contractKey: keyof typeof CONTRACT_ADDRESSES, _methodName: string, _args?: any[]): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return null as unknown as T;
  }

  public async write(
    _contractKey: keyof typeof CONTRACT_ADDRESSES,
    _methodName: string,
    _args?: any[],
    _valueWei?: string
  ): Promise<IProviderTxResult> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return {
      success: true,
      txHash: `0x${randomHex}`,
      status: 'CONFIRMED',
      isRealBlockchainData: false,
      message: 'Simulated demo transaction executed successfully.',
    };
  }

  public async waitForConfirmation(_txHash: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true;
  }
}

/**
 * Real Contract Provider: Future on-chain integration harness for deployed smart contracts
 * Connects via EIP-1193 window.ethereum provider.
 * Follows strict safety: Does NOT fake calls or invent ABIs.
 */
export class RealContractProvider implements IContractProvider {
  public isLive(): boolean {
    return true;
  }

  public async read<T = any>(contractKey: keyof typeof CONTRACT_ADDRESSES, methodName: string, _args?: any[]): Promise<T> {
    const isDeployed = isContractDeployed(contractKey);
    const contractAddress = CONTRACT_ADDRESSES[contractKey];

    if (!isDeployed || !contractAddress) {
      throw new Error(`[RealContractProvider] Contract "${contractKey}" is not deployed yet.`);
    }

    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('[RealContractProvider] No Web3 provider detected in environment.');
    }

    // TODO: Connect after verified ABI is supplied.
    // Example:
    // const provider = new ethers.BrowserProvider((window as any).ethereum);
    // const contract = new ethers.Contract(contractAddress, VERIFIED_ABI, provider);
    // return await contract[methodName](...(args || []));

    console.warn(
      `[RealContractProvider] READ call to "${methodName}" on "${contractKey}" pending verified ABI deployment.`
    );
    throw new Error(`Method "${methodName}" on contract "${contractKey}" is pending verified ABI deployment.`);
  }

  public async write(
    contractKey: keyof typeof CONTRACT_ADDRESSES,
    methodName: string,
    _args?: any[],
    _valueWei?: string
  ): Promise<IProviderTxResult> {
    const isDeployed = isContractDeployed(contractKey);
    const contractAddress = CONTRACT_ADDRESSES[contractKey];

    if (!isDeployed || !contractAddress) {
      return {
        success: false,
        txHash: '',
        status: 'FAILED',
        isRealBlockchainData: true,
        message: `Contract "${contractKey}" is not deployed on-chain yet.`,
      };
    }

    if (typeof window === 'undefined' || !(window as any).ethereum) {
      return {
        success: false,
        txHash: '',
        status: 'FAILED',
        isRealBlockchainData: true,
        message: 'No Web3 wallet provider detected. Please connect a compatible BEP-20 wallet.',
      };
    }

    try {
      // TODO: Connect after verified ABI is supplied.
      // Example:
      // const provider = new ethers.BrowserProvider((window as any).ethereum);
      // const signer = await provider.getSigner();
      // const contract = new ethers.Contract(contractAddress, VERIFIED_ABI, signer);
      // const tx = await contract[methodName](...(args || []), { value: valueWei || 0 });
      // const receipt = await tx.wait();
      // return { success: true, txHash: receipt.hash, status: 'CONFIRMED', isRealBlockchainData: true, receipt };

      console.warn(
        `[RealContractProvider] WRITE call to "${methodName}" on "${contractKey}" pending verified ABI deployment.`
      );
      return {
        success: false,
        txHash: '',
        status: 'FAILED',
        isRealBlockchainData: true,
        message: `Write method "${methodName}" on contract "${contractKey}" is pending verified ABI deployment.`,
      };
    } catch (err: any) {
      if (err?.code === 4001) {
        return {
          success: false,
          txHash: '',
          status: 'REJECTED',
          isRealBlockchainData: true,
          message: 'Transaction rejected by user in wallet.',
        };
      }
      return {
        success: false,
        txHash: '',
        status: 'FAILED',
        isRealBlockchainData: true,
        message: err?.message || 'Transaction execution failed on-chain.',
      };
    }
  }

  public async waitForConfirmation(txHash: string): Promise<boolean> {
    if (!txHash || !txHash.startsWith('0x')) return false;
    // TODO: Connect after verified ABI is supplied.
    return true;
  }
}

// Singletons
export const demoContractProvider = new DemoContractProvider();
export const realContractProvider = new RealContractProvider();

export function getContractProvider(isLive: boolean): IContractProvider {
  return isLive ? realContractProvider : demoContractProvider;
}
