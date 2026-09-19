/**
 * MDeFi Protocol & Blockchain Contract Configuration
 * Operating Network: BNB Smart Chain Testnet (Chain ID: 97)
 * Centralized Enterprise Registry with Dedicated ABI Folder
 */

import hubAbiJson from '../abis/hubAbi.json';
import mbttcAbiJson from '../abis/mbttcAbi.json';
import s4AbiJson from '../abis/s4Abi.json';
import starterRewardAbiJson from '../abis/starterRewardAbi.json';
import liquidityPoolAbiJson from '../abis/liquidityPoolAbi.json';
import quantumNexusAbiJson from '../abis/quantumNexusAbi.json';
import premiumRewardAbiJson from '../abis/premiumRewardAbi.json';
import salaryAbiJson from '../abis/salaryAbi.json';
import tradingRouterAbiJson from '../abis/tradingRouterAbi.json';
import tradingPairAbiJson from '../abis/tradingPairAbi.json';

export interface ContractDeploymentConfig {
  isDeployed: boolean;
  networkName: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
}

export const NETWORK_CONFIG: ContractDeploymentConfig = {
  isDeployed: true,
  networkName: 'BNB Smart Chain Testnet (BEP-20)',
  chainId: 97,
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  explorerUrl: 'https://testnet.bscscan.com',
};

export const CONTRACT_ADDRESSES = {
  // Phase 1: Core Protocol & Native Token (Deployed on BSC Testnet)
  mdefiHub: '0xdCE567cd83ED6A6bC4c4F411671Bc2fe20d49FE9',
  mbttcToken: '0x7116BAFaDCBEe81b562Db083d2b08b462B761186',
  // Phase 2: S4 Matrix, Starter Pool & Liquidity
  s4Matrix: '',
  starterReward: '',
  liquidityPool: '',
  // Phase 3: Quantum/Nexus Matrices, Premium Reward & Weekly Salary
  quantumNexus: '',
  nexusPrime: '',
  premiumReward: '',
  salaryContract: '',
  // Phase 4: PancakeSwap DEX Router & Liquidity Pair
  tradingRouter: '',
  tradingPair: '',
  // Auxiliary Ecosystem & Protocol References
  treasuryIpo: '',
  // Standard BEP-20 Dead Address
  burnDead: '0x000000000000000000000000000000000000dEaD',
  // Dynamic On-chain USDT: Fetched directly via Hub.usdtToken()
  usdtBsc: '',
};

export const HUB_ADDRESS: string = CONTRACT_ADDRESSES.mdefiHub;
export const MBTTC_ADDRESS: string = CONTRACT_ADDRESSES.mbttcToken;
export const S4_ADDRESS: string = CONTRACT_ADDRESSES.s4Matrix;
export const STARTER_REWARD_ADDRESS: string = CONTRACT_ADDRESSES.starterReward;
export const LIQUIDITY_POOL_ADDRESS: string = CONTRACT_ADDRESSES.liquidityPool;
export const QUANTUM_NEXUS_ADDRESS: string = CONTRACT_ADDRESSES.quantumNexus;
export const NEXUS_PRIME_ADDRESS: string = CONTRACT_ADDRESSES.nexusPrime;
export const PREMIUM_REWARD_ADDRESS: string = CONTRACT_ADDRESSES.premiumReward;
export const SALARY_ADDRESS: string = CONTRACT_ADDRESSES.salaryContract;
export const TRADING_ROUTER_ADDRESS: string = CONTRACT_ADDRESSES.tradingRouter;
export const TRADING_PAIR_ADDRESS: string = CONTRACT_ADDRESSES.tradingPair;
export const TREASURY_IPO_ADDRESS: string = CONTRACT_ADDRESSES.treasuryIpo;

// ABIs mapped directly to dedicated JSON sources
export const HUB_ABI: readonly any[] = hubAbiJson as unknown as readonly any[];
export const MBTTC_ABI: readonly any[] = mbttcAbiJson as unknown as readonly any[];
export const S4_ABI: readonly any[] = s4AbiJson as unknown as readonly any[];
export const STARTER_REWARD_ABI: readonly any[] = starterRewardAbiJson as unknown as readonly any[];
export const LIQUIDITY_POOL_ABI: readonly any[] = liquidityPoolAbiJson as unknown as readonly any[];
export const QUANTUM_NEXUS_ABI: readonly any[] = quantumNexusAbiJson as unknown as readonly any[];
export const NEXUS_PRIME_ABI: readonly any[] = quantumNexusAbiJson as unknown as readonly any[];
export const PREMIUM_REWARD_ABI: readonly any[] = premiumRewardAbiJson as unknown as readonly any[];
export const SALARY_ABI: readonly any[] = salaryAbiJson as unknown as readonly any[];
export const TRADING_ROUTER_ABI: readonly any[] = tradingRouterAbiJson as unknown as readonly any[];
export const TRADING_PAIR_ABI: readonly any[] = tradingPairAbiJson as unknown as readonly any[];

export const CONTRACT_ENABLED_FLAGS: Record<keyof typeof CONTRACT_ADDRESSES, boolean> = {
  mdefiHub: true,
  mbttcToken: true,
  s4Matrix: false,
  starterReward: false,
  liquidityPool: false,
  quantumNexus: false,
  nexusPrime: false,
  premiumReward: false,
  salaryContract: false,
  tradingRouter: false,
  tradingPair: false,
  treasuryIpo: false,
  burnDead: true,
  usdtBsc: true,
};

export function isContractDeployed(contractKey?: keyof typeof CONTRACT_ADDRESSES): boolean {
  if (!NETWORK_CONFIG.isDeployed) return false;
  if (!contractKey) return false;
  const addr = CONTRACT_ADDRESSES[contractKey];
  return Boolean(addr && addr.startsWith('0x') && addr.length === 42 && addr !== CONTRACT_ADDRESSES.burnDead);
}

export function isContractActive(contractKey?: keyof typeof CONTRACT_ADDRESSES): boolean {
  if (!isContractDeployed(contractKey)) return false;
  if (!contractKey) return false;
  return Boolean(CONTRACT_ENABLED_FLAGS[contractKey]);
}

export function getExplorerAddressUrl(address?: string): string | null {
  if (!address || address.trim() === '' || !address.startsWith('0x')) {
    return null;
  }
  return `${NETWORK_CONFIG.explorerUrl}/address/${address}`;
}

export function getExplorerTxUrl(txHash?: string): string | null {
  if (!txHash || txHash.trim() === '' || !txHash.startsWith('0x')) {
    return null;
  }
  return `${NETWORK_CONFIG.explorerUrl}/tx/${txHash}`;
}