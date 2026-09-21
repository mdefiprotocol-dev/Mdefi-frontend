/**
 * MDeFi Protocol & Blockchain Contract Configuration
 * Operating Network: BNB Smart Chain Testnet (Chain ID: 97)
 * Centralized Enterprise Registry with Dedicated ABI Folder
 */

import hubAbiJson from '../abis/hubAbi.json';
import mbttcAbiJson from '../abis/mbttcAbi.json';
import s4AbiJson from '../abis/s4Abi.json';
import starterRewardAbiJson from '../abis/starterRewardAbi.json';
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
  // Phase 2: S4 Matrix, Starter Pool & Treasury IPO Bond
  s4Matrix: '',
  starterReward: '',
  treasuryIpo: '',
  // Phase 3: Quantum Nexus Matrix, Premium Reward & Weekly Salary
  quantumNexus: '',
  premiumReward: '',
  salaryContract: '',
  // Phase 4: PancakeSwap DEX Router & Liquidity Pair + Burn
  tradingRouter: '',
  tradingPair: '',
  burnDead: '0x000000000000000000000000000000000000dEaD',
};

export const HUB_ADDRESS: string = CONTRACT_ADDRESSES.mdefiHub;
export const MBTTC_ADDRESS: string = CONTRACT_ADDRESSES.mbttcToken;
export const S4_ADDRESS: string = CONTRACT_ADDRESSES.s4Matrix;
export const STARTER_REWARD_ADDRESS: string = CONTRACT_ADDRESSES.starterReward;
export const TREASURY_IPO_ADDRESS: string = CONTRACT_ADDRESSES.treasuryIpo;
export const QUANTUM_NEXUS_ADDRESS: string = CONTRACT_ADDRESSES.quantumNexus;
export const PREMIUM_REWARD_ADDRESS: string = CONTRACT_ADDRESSES.premiumReward;
export const SALARY_ADDRESS: string = CONTRACT_ADDRESSES.salaryContract;
export const TRADING_ROUTER_ADDRESS: string = CONTRACT_ADDRESSES.tradingRouter;
export const TRADING_PAIR_ADDRESS: string = CONTRACT_ADDRESSES.tradingPair;

// ABIs mapped directly to dedicated JSON sources
export const HUB_ABI: readonly any[] = hubAbiJson as unknown as readonly any[];
export const MBTTC_ABI: readonly any[] = mbttcAbiJson as unknown as readonly any[];
export const S4_ABI: readonly any[] = s4AbiJson as unknown as readonly any[];
export const STARTER_REWARD_ABI: readonly any[] = starterRewardAbiJson as unknown as readonly any[];
export const QUANTUM_NEXUS_ABI: readonly any[] = quantumNexusAbiJson as unknown as readonly any[];
export const PREMIUM_REWARD_ABI: readonly any[] = premiumRewardAbiJson as unknown as readonly any[];
export const SALARY_ABI: readonly any[] = salaryAbiJson as unknown as readonly any[];
export const TRADING_ROUTER_ABI: readonly any[] = tradingRouterAbiJson as unknown as readonly any[];
export const TRADING_PAIR_ABI: readonly any[] = tradingPairAbiJson as unknown as readonly any[];

export const CONTRACT_ENABLED_FLAGS: Record<keyof typeof CONTRACT_ADDRESSES, boolean> = {
  mdefiHub: true,
  mbttcToken: true,
  s4Matrix: false,
  starterReward: false,
  treasuryIpo: false,
  quantumNexus: false,
  premiumReward: false,
  salaryContract: false,
  tradingRouter: false,
  tradingPair: false,
  burnDead: true,
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

export interface ContractRegistryItem {
  key: string;
  name: string;
  phase: number;
  role: string;
  address: string;
  isDeployed: boolean;
  explorerUrl: string | null;
  statusBadge: {
    badgeBg: string;
    badgeBorder: string;
    symbol: string;
    label: string;
  };
  description: string;
}

export function getContractRegistryList(): ContractRegistryItem[] {
  const isDeployedCheck = (key: keyof typeof CONTRACT_ADDRESSES) => isContractDeployed(key);

  const getBadge = (deployed: boolean) => {
    if (deployed) {
      return {
        badgeBg: 'bg-emerald-950/90 text-emerald-400',
        badgeBorder: 'border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
        symbol: '●',
        label: 'Verified & Active',
      };
    }
    return {
      badgeBg: 'bg-zinc-900/80 text-zinc-500',
      badgeBorder: 'border-zinc-800',
      symbol: '○',
      label: 'Scheduled',
    };
  };

  return [
    // PHASE 1: Registration, Airdrop, Commodity Building
    {
      key: 'mdefiHub',
      name: 'MDeFi Hub Core',
      phase: 1,
      role: 'Registration, Node & Airdrop Vault',
      address: CONTRACT_ADDRESSES.mdefiHub || '',
      isDeployed: isDeployedCheck('mdefiHub'),
      explorerUrl: CONTRACT_ADDRESSES.mdefiHub ? `${NETWORK_CONFIG.explorerUrl}/address/${CONTRACT_ADDRESSES.mdefiHub}` : null,
      statusBadge: getBadge(isDeployedCheck('mdefiHub')),
      description: 'Core decentralized registry managing user node lineages, referral structures, and visiting vaults.',
    },
    {
      key: 'mbttcToken',
      name: 'MBTTC Token Vault',
      phase: 1,
      role: 'Native Ecosystem Utility Token',
      address: CONTRACT_ADDRESSES.mbttcToken || '',
      isDeployed: isDeployedCheck('mbttcToken'),
      explorerUrl: CONTRACT_ADDRESSES.mbttcToken ? `${NETWORK_CONFIG.explorerUrl}/address/${CONTRACT_ADDRESSES.mbttcToken}` : null,
      statusBadge: getBadge(isDeployedCheck('mbttcToken')),
      description: 'BEP-20 verified utility token engine governing reward distribution, staking commodity, and minting logic.',
    },

    // PHASE 2: S4 Matrix, Weekly Starter Reward & Treasury Bond
    {
      key: 's4Matrix',
      name: 'S4 Matrix Core',
      phase: 2,
      role: 'Cyclic Matrix Distribution Engine',
      address: CONTRACT_ADDRESSES.s4Matrix || '',
      isDeployed: isDeployedCheck('s4Matrix'),
      explorerUrl: CONTRACT_ADDRESSES.s4Matrix ? `${NETWORK_CONFIG.explorerUrl}/address/${CONTRACT_ADDRESSES.s4Matrix}` : null,
      statusBadge: getBadge(isDeployedCheck('s4Matrix')),
      description: 'Algorithmic 2x2 community matrix routing instant spillover rewards through automated cycle queues.',
    },
    {
      key: 'starterReward',
      name: 'Weekly Starter Reward',
      phase: 2,
      role: 'Community Growth Incentives',
      address: CONTRACT_ADDRESSES.starterReward || '',
      isDeployed: isDeployedCheck('starterReward'),
      explorerUrl: CONTRACT_ADDRESSES.starterReward ? `${NETWORK_CONFIG.explorerUrl}/address/${CONTRACT_ADDRESSES.starterReward}` : null,
      statusBadge: getBadge(isDeployedCheck('starterReward')),
      description: 'Weekly automated performance reward distributor designed for early network onboarding leaders.',
    },
    {
      key: 'treasuryIpo',
      name: 'Treasury IPO & Bond',
      phase: 2,
      role: 'Protocol Reserve & Liquidity Asset',
      address: CONTRACT_ADDRESSES.treasuryIpo || '',
      isDeployed: isDeployedCheck('treasuryIpo'),
      explorerUrl: CONTRACT_ADDRESSES.treasuryIpo ? `${NETWORK_CONFIG.explorerUrl}/address/${CONTRACT_ADDRESSES.treasuryIpo}` : null,
      statusBadge: getBadge(isDeployedCheck('treasuryIpo')),
      description: 'Reserve asset bonding pool locking long-term value backing for decentralized treasury sustainability.',
    },

    // PHASE 3: Quantum Nexus, Premium Reward, Weekly Salary
    {
      key: 'quantumNexus',
      name: 'Quantum Nexus',
      phase: 3,
      role: 'Dual Package Matrix Engine (Core + Prime)',
      address: CONTRACT_ADDRESSES.quantumNexus || '',
      isDeployed: isDeployedCheck('quantumNexus'),
      explorerUrl: CONTRACT_ADDRESSES.quantumNexus ? `${NETWORK_CONFIG.explorerUrl}/address/${CONTRACT_ADDRESSES.quantumNexus}` : null,
      statusBadge: getBadge(isDeployedCheck('quantumNexus')),
      description: 'Multi-tiered decentralized engine executing Quantum and Prime package settlements in a single contract.',
    },
    {
      key: 'premiumReward',
      name: 'Premium Reward Pool',
      phase: 3,
      role: 'Executive Tier Reward Distributor',
      address: CONTRACT_ADDRESSES.premiumReward || '',
      isDeployed: isDeployedCheck('premiumReward'),
      explorerUrl: CONTRACT_ADDRESSES.premiumReward ? `${NETWORK_CONFIG.explorerUrl}/address/${CONTRACT_ADDRESSES.premiumReward}` : null,
      statusBadge: getBadge(isDeployedCheck('premiumReward')),
      description: 'High-yield reward pool allocating dedicated protocol volume portions to active qualifying partners.',
    },
    {
      key: 'salaryContract',
      name: 'Weekly Passive Salary',
      phase: 3,
      role: 'Tiered Progressive Salary Engine',
      address: CONTRACT_ADDRESSES.salaryContract || '',
      isDeployed: isDeployedCheck('salaryContract'),
      explorerUrl: CONTRACT_ADDRESSES.salaryContract ? `${NETWORK_CONFIG.explorerUrl}/address/${CONTRACT_ADDRESSES.salaryContract}` : null,
      statusBadge: getBadge(isDeployedCheck('salaryContract')),
      description: 'Continuous weekly reward dispatcher rewarding community leaders based on network rankings.',
    },

    // PHASE 4: PancakeSwap Trading Router & Pair + Burn
    {
      key: 'tradingRouter',
      name: 'PancakeSwap Router Bridge',
      phase: 4,
      role: 'DEX Automated Trading Gateway',
      address: CONTRACT_ADDRESSES.tradingRouter || '',
      isDeployed: isDeployedCheck('tradingRouter'),
      explorerUrl: CONTRACT_ADDRESSES.tradingRouter ? `${NETWORK_CONFIG.explorerUrl}/address/${CONTRACT_ADDRESSES.tradingRouter}` : null,
      statusBadge: getBadge(isDeployedCheck('tradingRouter')),
      description: 'Direct interface with PancakeSwap liquidity router enabling decentralized MBTTC buy/sell swaps.',
    },
    {
      key: 'tradingPair',
      name: 'MBTTC/USDT Liquidity Pair',
      phase: 4,
      role: 'Decentralized Market Pair',
      address: CONTRACT_ADDRESSES.tradingPair || '',
      isDeployed: isDeployedCheck('tradingPair'),
      explorerUrl: CONTRACT_ADDRESSES.tradingPair ? `${NETWORK_CONFIG.explorerUrl}/address/${CONTRACT_ADDRESSES.tradingPair}` : null,
      statusBadge: getBadge(isDeployedCheck('tradingPair')),
      description: 'On-chain Automated Market Maker (AMM) LP pool ensuring trading depth and automated price discovery.',
    },
    {
      key: 'burnDead',
      name: 'Deflationary Burn Vault',
      phase: 4,
      role: 'Permanent Dead Address (0x...dEaD)',
      address: CONTRACT_ADDRESSES.burnDead,
      isDeployed: true,
      explorerUrl: `${NETWORK_CONFIG.explorerUrl}/address/${CONTRACT_ADDRESSES.burnDead}`,
      statusBadge: getBadge(true),
      description: 'Verifiable burn mechanism removing tokens from circulation to enforce deflationary tokenomics.',
    },
  ];
}