import { ethers } from 'ethers';
import { smartRpcSwitch, DedicatedServiceNode } from '../services/smartRpcEngine';

/**
 * ============================================================================
 * CENTRAL BLOCKCHAIN & RPC CONFIGURATION HUB
 * Mainnet par switch karne ke liye sirf ACTIVE_CHAIN_ID ko 56 karna hoga!
 * ============================================================================
 */
export const ACTIVE_CHAIN_ID: 97 | 56 = 97; // 97: BSC Testnet | 56: BSC Mainnet

export interface ChainConfig {
  chainId: number;
  name: string;
  displayName: string;
  rpcUrls: string[];
  symbol: string;
  explorer: string;
}

// स्विच से 3 मुख्य डेडिकेटेड सर्विसेज (Alchemy, QuickNode, Reown) लोड की गईं
const dedicatedNodes: string[] = smartRpcSwitch
  .getDedicatedNodes(ACTIVE_CHAIN_ID)
  .map((node: DedicatedServiceNode) => node.url);

export const NETWORK_CONFIG: Record<97 | 56, ChainConfig> = {
  97: {
    chainId: 97,
    name: 'bnbt',
    displayName: 'BNB Smart Chain Testnet',
    rpcUrls: [
      ...dedicatedNodes, // Priority 1: Dedicated Private Nodes
      'https://data-seed-prebsc-1-s1.binance.org:8545/',
      'https://bsc-testnet-rpc.publicnode.com',
      'https://data-seed-prebsc-2-s1.binance.org:8545/'
    ],
    symbol: 'tBNB',
    explorer: 'https://testnet.bscscan.com'
  },
  56: {
    chainId: 56,
    name: 'bnb',
    displayName: 'BNB Smart Chain Mainnet',
    rpcUrls: [
      ...dedicatedNodes, // Priority 1: Dedicated Private Nodes
      'https://bsc-dataseed.binance.org/',
      'https://bsc-dataseed1.defibit.io/',
      'https://bsc-dataseed1.ninicoin.io/'
    ],
    symbol: 'BNB',
    explorer: 'https://bscscan.com'
  }
};

// Single shared provider reference poore project ke liye
let sharedProviderInstance: ethers.JsonRpcProvider | null = null;
let currentRpcIndex = 0;

/**
 * Auto-Failover Intercepting Provider
 * Driver level par -32005, 429 aur timeouts ko pakad kar turant switch karta hai
 */
class ResilientJsonRpcProvider extends ethers.JsonRpcProvider {
  override async _send(payload: ethers.JsonRpcPayload | ethers.JsonRpcPayload[]): Promise<any> {
    try {
      return await super._send(payload);
    } catch (error: any) {
      if (smartRpcSwitch.isQuotaOrRateLimitError(error)) {
        console.warn('[rpcConfig] Driver caught rate limit / timeout, auto-switching...', error?.message || error);
        rotateToNextRpcUrl();
        const nextProvider = getSharedRpcProvider();
        return await nextProvider._send(payload);
      }
      throw error;
    }
  }
}

/**
 * Universal Shared RPC Provider (Anti-Loop, Anti-Freeze Singleton)
 * 1. staticNetwork: true ke zariye Ethers ka background detectNetwork loop 100% band rehta hai.
 * 2. Ek single connection banata hai, duplicate calls 0 karta hai.
 * 3. Mobile CPU aur battery choke hone se bachata hai.
 */
export function getSharedRpcProvider(): ethers.JsonRpcProvider {
  if (sharedProviderInstance) {
    return sharedProviderInstance;
  }

  const config = NETWORK_CONFIG[ACTIVE_CHAIN_ID];
  const targetUrl = config.rpcUrls[currentRpcIndex] || config.rpcUrls[0];

  const networkDefinition = {
    chainId: config.chainId,
    name: config.name
  };

  try {
    // Ethers v6 standard initialization with static network lock
    if ((ethers as any).FetchRequest) {
      const fetchReq = new (ethers as any).FetchRequest(targetUrl);
      fetchReq.timeout = 4000; // 4 second safe timeout for mobile

    const staticNetwork = (ethers as any).Network
      ? (ethers as any).Network.from({ chainId: BigInt(config.chainId), name: config.name })
      : networkDefinition;

    sharedProviderInstance = new ResilientJsonRpcProvider(
      fetchReq,
      staticNetwork,
      { staticNetwork: true }
    );
    } 
    // Ethers v5 compatibility fallback
    else if ((ethers as any).providers && (ethers as any).providers.JsonRpcProvider) {
      sharedProviderInstance = new (ethers as any).providers.JsonRpcProvider(
        {
          url: targetUrl,
          timeout: 10000
        },
        networkDefinition
      ) as any;
    } 
    // Universal Safe Fallback
    else {
      sharedProviderInstance = new (ethers as any).JsonRpcProvider(
        targetUrl,
        networkDefinition,
        { staticNetwork: true }
      );
    }

    // Mobile thread protection: Background polling ko 12s par lock rakhte hain
    if (sharedProviderInstance && typeof (sharedProviderInstance as any).pollingInterval === 'number') {
      (sharedProviderInstance as any).pollingInterval = 12000;
    }

  } catch (error) {
    console.warn('[rpcConfig] Primary init failed, using strict static fallback:', error);
    try {
      sharedProviderInstance = new (ethers as any).JsonRpcProvider(
        targetUrl,
        networkDefinition,
        { staticNetwork: true }
      ) as any;
    } catch (criticalErr) {
      console.error('[rpcConfig] Critical RPC init failure:', criticalErr);
    }
  }

  // Guaranteed Singleton Fallback (Har haal mein staticNetwork locked rahega)
  if (!sharedProviderInstance) {
    sharedProviderInstance = new (ethers as any).JsonRpcProvider(
      targetUrl,
      networkDefinition,
      { staticNetwork: true }
    ) as ethers.JsonRpcProvider;
  }

  return sharedProviderInstance;
}

/**
 * Active Primary RPC URL fetcher
 */
export function getActiveRpcUrl(): string {
  const config = NETWORK_CONFIG[ACTIVE_CHAIN_ID];
  return config.rpcUrls[currentRpcIndex] || config.rpcUrls[0];
}

/**
 * Switch to next fallback RPC if primary faces issues
 */
export function rotateToNextRpcUrl(): string {
  const config = NETWORK_CONFIG[ACTIVE_CHAIN_ID];
  const result = smartRpcSwitch.selectHealthyUrl(config.rpcUrls, currentRpcIndex);
  currentRpcIndex = result.newIndex;

  console.log(`[rpcConfig] Switched active RPC to: [${currentRpcIndex}] ${result.url}`);
  resetSharedRpcProvider();
  return getActiveRpcUrl();
}

/**
 * Provider resetter (used when rotating RPC or switching chains)
 */
export function resetSharedRpcProvider(): void {
  sharedProviderInstance = null;
}