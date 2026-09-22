/**
 * MDeFi Contract Provider Architecture (Phase 1 -> Phase 4 Ready)
 * 
 * Clean abstraction separating:
 * - Demo Provider (current mock/demo benchmark functionality)
 * - Real Contract Provider (future deployed smart contracts)
 * 
 * ARCHITECTURAL RULES:
 * - Smart contracts are deployed on BSC Testnet (Chain ID: 97).
 * - Multi-provider detection (MetaMask, TrustWallet, Binance Web3, WalletConnect / AppKit).
 * - Zero design/style alterations.
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
 * Real Contract Provider: Complete Mobile & WalletConnect Compatible EIP-1193 Engine
 */
export class RealContractProvider implements IContractProvider {
  private readonly BSC_TESTNET_CHAIN_ID = 97n;

  public isLive(): boolean {
    return true;
  }

  /**
   * Helper: Resolves active Ethereum/EIP-1193 provider across desktop extensions, 
   * mobile in-app browsers, and WalletConnect sessions.
   */
 private getActiveEip1193Provider(): any {
    if (typeof window === 'undefined') return null;
    const w = window as any;

    // 1. Standard window.ethereum (Desktop extension ya Mobile DApp browser)
    if (w.ethereum) {
      if (Array.isArray(w.ethereum.providers) && w.ethereum.providers.length > 0) {
        return w.ethereum.providers.find((p: any) => p.isMetaMask || p.isTrust) || w.ethereum.providers[0];
      }
      return w.ethereum;
    }

    // 2. Mobile Specific Wallet injections
    if (w.trustwallet?.ethereum) return w.trustwallet.ethereum;
    if (w.BinanceChain) return w.BinanceChain;
    if (w.bitkeep?.ethereum) return w.bitkeep.ethereum;
    if (w.okxwallet) return w.okxwallet;

    // 3. WalletConnect / AppKit session connectors
    if (w.walletConnectProvider) return w.walletConnectProvider;
    if (w.appKit?.getWalletProvider) return w.appKit.getWalletProvider();
    if (w._eip1193Provider) return w._eip1193Provider;

    // 4. Global scanner (Android Chrome me koi bhi active Web3 provider ho to pakad lega)
    for (const key of Object.keys(w)) {
      if ((key.toLowerCase().includes('provider') || key.toLowerCase().includes('ethereum')) && w[key]?.request) {
        return w[key];
      }
    }

    return null;
  }

  private async ensureBscTestnet(provider: ethers.BrowserProvider, rawProvider: any): Promise<void> {
    const network = await provider.getNetwork();
    if (network.chainId !== this.BSC_TESTNET_CHAIN_ID) {
      if (rawProvider?.request) {
        try {
          await rawProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x61' }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await rawProvider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x61',
                  chainName: 'BNB Smart Chain Testnet',
                  nativeCurrency: {
                    name: 'tBNB',
                    symbol: 'tBNB',
                    decimals: 18,
                  },
                  rpcUrls: [
                    'https://data-seed-prebsc-1-s1.binance.org:8545/',
                    'https://bsc-testnet.publicnode.com',
                  ],
                  blockExplorerUrls: ['https://testnet.bscscan.com'],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      } else {
        throw new Error('Please connect to BNB Smart Chain Testnet (Chain ID: 97).');
      }
    }
  }

  public async read<T = any>(
    contractKey: keyof typeof CONTRACT_ADDRESSES,
    methodName: string,
    args?: any[]
  ): Promise<T> {
    const isDeployed = isContractDeployed(contractKey);
    const contractAddress = CONTRACT_ADDRESSES[contractKey];

    if (!isDeployed || !contractAddress) {
      throw new Error(
        `[RealContractProvider] Contract "${contractKey}" is not deployed yet.`
      );
    }

    let abi: readonly any[];
    if (contractKey === 'mdefiHub') {
      abi = HUB_ABI;
    } else if (contractKey === 'mbttcToken') {
      abi = MBTTC_ABI;
    } else {
      throw new Error(
        `[RealContractProvider] Verified ABI is not configured for "${contractKey}".`
      );
    }

    try {
      const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
      const contract = new ethers.Contract(
        contractAddress,
        abi,
        provider
      );

      if (typeof contract[methodName] !== 'function') {
        throw new Error(
          `Method "${methodName}" was not found in the verified ABI for "${contractKey}".`
        );
      }

      const result = await contract[methodName](...(args || []));
      return result as T;
    } catch (err: any) {
      throw new Error(
        err?.message ||
          `[RealContractProvider] READ call failed for "${methodName}" on "${contractKey}".`
      );
    }
  }

  public async write(
    contractKey: keyof typeof CONTRACT_ADDRESSES,
    methodName: string,
    args?: any[],
    valueWei?: string
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

    const rawProvider = this.getActiveEip1193Provider();
    if (!rawProvider) {
      return {
        success: false,
        txHash: '',
        status: 'FAILED',
        isRealBlockchainData: true,
        message: 'No active Web3 wallet session found. Please reconnect your BEP-20 wallet.',
      };
    }

    let abi: readonly any[];
    if (contractKey === 'mdefiHub') {
      abi = HUB_ABI;
    } else if (contractKey === 'mbttcToken') {
      abi = MBTTC_ABI;
    } else {
      return {
        success: false,
        txHash: '',
        status: 'FAILED',
        isRealBlockchainData: true,
        message: `[RealContractProvider] Verified ABI is not configured for "${contractKey}".`,
      };
    }

    try {
      const browserProvider = new ethers.BrowserProvider(rawProvider);
      await this.ensureBscTestnet(browserProvider, rawProvider);

      const signer = await browserProvider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        abi,
        signer
      );

      if (typeof contract[methodName] !== 'function') {
        return {
          success: false,
          txHash: '',
          status: 'FAILED',
          isRealBlockchainData: true,
          message: `Method "${methodName}" was not found in the verified ABI for "${contractKey}".`,
        };
      }

      const overrides =
        valueWei !== undefined && valueWei !== ''
          ? { value: valueWei }
          : {};

      const tx = await contract[methodName](
        ...(args || []),
        overrides
      );

      return {
        success: true,
        txHash: tx.hash,
        status: 'PENDING',
        isRealBlockchainData: true,
        message: 'Transaction submitted successfully and is pending confirmation.',
      };
    } catch (err: any) {
      if (
        err?.code === 4001 ||
        err?.code === 'ACTION_REJECTED' ||
        err?.message?.includes('rejected') ||
        err?.message?.includes('denied')
      ) {
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
        message:
          err?.shortMessage ||
          err?.reason ||
          err?.message ||
          'Transaction execution failed on-chain.',
      };
    }
  }

  public async waitForConfirmation(txHash: string): Promise<boolean> {
    if (!txHash || !txHash.startsWith('0x')) {
      return false;
    }

    try {
      const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
      const receipt = await provider.waitForTransaction(txHash, 1);
      return receipt?.status === 1;
    } catch (err: any) {
      console.error(
        '[RealContractProvider] Transaction confirmation check failed:',
        err
      );
      return false;
    }
  }
}

// Singletons
export const demoContractProvider = new DemoContractProvider();
export const realContractProvider = new RealContractProvider();

export function getContractProvider(isLive: boolean): IContractProvider {
  return isLive ? realContractProvider : demoContractProvider;
}