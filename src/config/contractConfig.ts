/**
 * MDeFi Protocol & Blockchain Contract Configuration
 * Pre-Mainnet / Contract-Ready Centralized Registry
 * 
 * DIRECTIVES:
 * - Smart contracts are NOT deployed yet.
 * - Current mode is DEMO / SIMULATED mode.
 * - No fake or invented contract addresses on Mainnet.
 * - Once deployed, addresses are configured here as the single source of truth.
 */

export interface ContractDeploymentConfig {
  isDeployed: boolean;
  networkName: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
}

export const NETWORK_CONFIG: ContractDeploymentConfig = {
  isDeployed: false, // Pre-deployment: set to true ONLY when smart contracts are deployed
  networkName: 'BNB Smart Chain (BEP-20)',
  chainId: 56, // BSC Mainnet
  rpcUrl: 'https://bsc-dataseed1.binance.org/',
  explorerUrl: 'https://bscscan.com',
};

// Contract addresses - Left empty until official BSC Testnet / Mainnet contract deployment
// DIRECTIVE: Smart contracts are NOT deployed yet. Do NOT invent fake addresses.
export const CONTRACT_ADDRESSES = {
  // Phase 1: Core Protocol & Native Token
  mdefiHub: '',
  mbttcToken: '',
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
  // Real external standard BEP-20 USDT on BNB Smart Chain
  usdtBsc: '0x55d398326f99059fF775485246999027B3197955',
};

/**
 * Explicit Named Address Constants Across All 4 Phases
 * Ready to receive official addresses upon deployment.
 * Do NOT invent fake addresses before official deployment.
 */
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

/**
 * Phase 1 -> Phase 4 Contract Verified ABIs
 * Empty readonly arrays until official deployment & verification.
 * Prevents guessing function signatures before deployment.
 */
export const HUB_ABI: readonly any[] = [];
export const MBTTC_ABI: readonly any[] = [];
export const S4_ABI: readonly any[] = [];
export const STARTER_REWARD_ABI: readonly any[] = [];
export const LIQUIDITY_POOL_ABI: readonly any[] = [];
export const QUANTUM_NEXUS_ABI: readonly any[] = [];
export const NEXUS_PRIME_ABI: readonly any[] = [];
export const PREMIUM_REWARD_ABI: readonly any[] = [];
export const SALARY_ABI: readonly any[] = [];
export const TRADING_ROUTER_ABI: readonly any[] = [];
export const TRADING_PAIR_ABI: readonly any[] = [];

/**
 * Contract Status Model Across Ecosystem
 * Distinguishes deployment, configuration, verification, and launch states.
 */
export type ContractStatusState =
  | 'NOT_DEPLOYED'
  | 'DEPLOYED'
  | 'CONFIGURED'
  | 'VERIFIED'
  | 'ENABLED'
  | 'LIVE'
  | 'COMING_SOON'
  | 'LOCKED';

export interface ContractRegistryEntry {
  key: keyof typeof CONTRACT_ADDRESSES;
  name: string;
  role: string;
  phase: 1 | 2 | 3 | 4;
  address: string;
  abi: readonly any[];
  status: ContractStatusState;
  statusBadge: {
    label: string;
    iconColor: string;
    badgeBg: string;
    badgeBorder: string;
    symbol: '🟢' | '🟡' | '🔒';
  };
  description: string;
  isRealBlockchainVerified: boolean;
  explorerUrl: string | null;
}

/**
 * Enabled flags per contract module.
 * CRITICAL ARCHITECTURAL DISTINCTION:
 * isDeployed !== isLaunched
 * A contract may be deployed on-chain for auditing/testing, but remains locked in frontend
 * until its corresponding launch phase is officially activated.
 */
export const CONTRACT_ENABLED_FLAGS: Record<keyof typeof CONTRACT_ADDRESSES, boolean> = {
  mdefiHub: false,
  mbttcToken: false,
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

/**
 * Master Phase 1 Status
 */
export interface PhaseStatusInfo {
  phase: number;
  isPhaseGatedLive: boolean;
  isFullyLiveOnChain: boolean;
  mode: 'demo' | 'live';
  network: ContractDeploymentConfig;
}

export function getPhase1Status(): PhaseStatusInfo {
  const isHubDeployed = isContractDeployed('mdefiHub');
  const isMbttcDeployed = isContractDeployed('mbttcToken');
  const isFullyLiveOnChain = NETWORK_CONFIG.isDeployed && isHubDeployed && isMbttcDeployed;

  return {
    phase: 1,
    isPhaseGatedLive: true,
    isFullyLiveOnChain,
    mode: isFullyLiveOnChain ? 'live' : 'demo',
    network: NETWORK_CONFIG,
  };
}

export function getPhaseStatus(phase: 1 | 2 | 3 | 4): PhaseStatusInfo {
  const activeLaunchPhase = 1; // Synchronized with ACTIVE_LAUNCH_PHASE
  const isGatedLive = phase <= activeLaunchPhase;
  let isFullyLive = false;

  if (phase === 1) {
    isFullyLive = NETWORK_CONFIG.isDeployed && isContractDeployed('mdefiHub') && isContractDeployed('mbttcToken');
  } else if (phase === 2) {
    isFullyLive = NETWORK_CONFIG.isDeployed && isContractDeployed('s4Matrix') && isContractDeployed('starterReward');
  } else if (phase === 3) {
    isFullyLive = NETWORK_CONFIG.isDeployed && isContractDeployed('quantumNexus') && isContractDeployed('salaryContract');
  } else if (phase === 4) {
    isFullyLive = NETWORK_CONFIG.isDeployed && isContractDeployed('tradingRouter');
  }

  return {
    phase,
    isPhaseGatedLive: isGatedLive,
    isFullyLiveOnChain: isFullyLive,
    mode: isFullyLive ? 'live' : 'demo',
    network: NETWORK_CONFIG,
  };
}

/**
 * Determine dynamic status of a contract in the registry
 */
export function getContractStatus(contractKey: keyof typeof CONTRACT_ADDRESSES): ContractStatusState {
  // Auxiliary constants
  if (contractKey === 'burnDead' || contractKey === 'usdtBsc') {
    return 'VERIFIED';
  }

  const phaseMap: Record<keyof typeof CONTRACT_ADDRESSES, 1 | 2 | 3 | 4> = {
    mdefiHub: 1,
    mbttcToken: 1,
    s4Matrix: 2,
    starterReward: 2,
    liquidityPool: 2,
    quantumNexus: 3,
    nexusPrime: 3,
    premiumReward: 3,
    salaryContract: 3,
    tradingRouter: 4,
    tradingPair: 4,
    treasuryIpo: 2,
    burnDead: 1,
    usdtBsc: 1,
  };

  const targetPhase = phaseMap[contractKey] || 1;
  const activeLaunchPhase = 1; // Default to Phase 1 Launch

  // If the contract belongs to a future unlaunched phase
  if (targetPhase > activeLaunchPhase) {
    return 'COMING_SOON';
  }

  // Phase is currently active
  const address = CONTRACT_ADDRESSES[contractKey];
  const hasValidAddress = Boolean(address && address.startsWith('0x') && address.length === 42 && address !== CONTRACT_ADDRESSES.burnDead);

  if (!hasValidAddress) {
    return 'NOT_DEPLOYED';
  }

  const isEnabled = Boolean(CONTRACT_ENABLED_FLAGS[contractKey]);
  if (!isEnabled) {
    return 'DEPLOYED';
  }

  return 'LIVE';
}

/**
 * Comprehensive Smart Contract Registry List for Profile & Governance Transparency
 */
export function getContractRegistryList(): ContractRegistryEntry[] {
  const definitions: Array<{
    key: keyof typeof CONTRACT_ADDRESSES;
    name: string;
    role: string;
    phase: 1 | 2 | 3 | 4;
    abi: readonly any[];
    description: string;
  }> = [
    // Phase 1 Contracts
    {
      key: 'mdefiHub',
      name: 'MDeFi Core Hub',
      role: 'Master Protocol Router & On-Chain Lineage',
      phase: 1,
      abi: HUB_ABI,
      description: 'Decentralized member registration, dynamic network fee routing, and immutable sponsor linkage.',
    },
    {
      key: 'mbttcToken',
      name: 'MBTTC Token Contract',
      role: 'BEP-20 Native Community Token',
      phase: 1,
      abi: MBTTC_ABI,
      description: 'Fixed 2,000,000 MBTTC supply token contract governing airdrop minting, 4-hour claims, and burn cycles.',
    },
    // Phase 2 Contracts
    {
      key: 's4Matrix',
      name: 'S4 Matrix Contract',
      role: '2x2 Follow-Me Matrix Engine',
      phase: 2,
      abi: S4_ABI,
      description: 'Handles Junior ($10) & Senior ($25) nodes with 20% direct yield, 20% slot yield, and automated re-entry.',
    },
    {
      key: 'starterReward',
      name: 'Weekly Starter Reward Vault',
      role: 'Weekly Community Performance Pool',
      phase: 2,
      abi: STARTER_REWARD_ABI,
      description: 'Automated on-chain weekly reward distribution for qualified Senior Node partners.',
    },
    {
      key: 'liquidityPool',
      name: 'Protocol Liquidity Vault',
      role: 'Decentralized Liquidity Management',
      phase: 2,
      abi: LIQUIDITY_POOL_ABI,
      description: 'Treasury IPO liquidity reserves, USDT backing, and dynamic valuation bridge.',
    },
    // Phase 3 Contracts
    {
      key: 'quantumNexus',
      name: 'Quantum Node Matrix',
      role: '30-Position Ring Matrix ($70)',
      phase: 3,
      abi: QUANTUM_NEXUS_ABI,
      description: 'Deep 4-ring matrix with algorithmic spillover, team recycling, and generation yields.',
    },
    {
      key: 'nexusPrime',
      name: 'Nexus Prime Matrix',
      role: 'Elite Multi-Tier Matrix ($120)',
      phase: 3,
      abi: NEXUS_PRIME_ABI,
      description: 'High-performance matrix node unlocking 7-generation overrides and advanced protocol yields.',
    },
    {
      key: 'premiumReward',
      name: 'Weekly Premium Reward Vault',
      role: 'Leadership Community Performance Pool',
      phase: 3,
      abi: PREMIUM_REWARD_ABI,
      description: 'High-tier weekly reward distributions for qualified Quantum and Prime node holders.',
    },
    {
      key: 'salaryContract',
      name: 'Weekly Passive Salary Vault',
      role: 'Rank-Based Milestone Salary Engine',
      phase: 3,
      abi: SALARY_ABI,
      description: 'Direct smart contract payroll releasing verified weekly USDT salary disbursements.',
    },
    // Phase 4 Contracts
    {
      key: 'tradingRouter',
      name: 'PancakeSwap Trading Router',
      role: 'DEX Automated Market Maker',
      phase: 4,
      abi: TRADING_ROUTER_ABI,
      description: 'Decentralized BEP-20 swapping engine for instant MBTTC/USDT and MBTTC/BNB transactions.',
    },
    {
      key: 'tradingPair',
      name: 'MBTTC/USDT Liquidity Pair',
      role: 'Automated Liquidity Pool Pair',
      phase: 4,
      abi: TRADING_PAIR_ABI,
      description: 'Decentralized liquidity pool contract on BNB Smart Chain recording real-time market pricing.',
    },
  ];

  return definitions.map((item) => {
    const status = getContractStatus(item.key);
    const address = CONTRACT_ADDRESSES[item.key];
    const hasAddress = Boolean(address && address.startsWith('0x') && address.length === 42 && address !== CONTRACT_ADDRESSES.burnDead);

    let statusBadge: ContractRegistryEntry['statusBadge'];

    if (status === 'LIVE') {
      statusBadge = {
        label: 'VERIFIED ON-CHAIN',
        symbol: '🟢',
        iconColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-950/70 text-emerald-300',
        badgeBorder: 'border-emerald-500/40',
      };
    } else if (status === 'DEPLOYED' || status === 'CONFIGURED') {
      statusBadge = {
        label: 'PENDING AUDIT & VERIFICATION',
        symbol: '🟡',
        iconColor: 'text-amber-400',
        badgeBg: 'bg-amber-950/70 text-amber-300',
        badgeBorder: 'border-amber-500/40',
      };
    } else if (status === 'COMING_SOON') {
      statusBadge = {
        label: `COMING SOON • PHASE ${item.phase}`,
        symbol: '🔒',
        iconColor: 'text-zinc-500',
        badgeBg: 'bg-zinc-900 text-zinc-400',
        badgeBorder: 'border-zinc-800',
      };
    } else {
      statusBadge = {
        label: 'NOT DEPLOYED • PENDING MAINNET',
        symbol: '🔒',
        iconColor: 'text-zinc-400',
        badgeBg: 'bg-zinc-900 text-zinc-300',
        badgeBorder: 'border-zinc-800',
      };
    }

    return {
      key: item.key,
      name: item.name,
      role: item.role,
      phase: item.phase,
      address: hasAddress ? address : '',
      abi: item.abi,
      status,
      statusBadge,
      description: item.description,
      isRealBlockchainVerified: status === 'LIVE',
      explorerUrl: hasAddress ? getExplorerAddressUrl(address) : null,
    };
  });
}

/**
 * Check whether the given contract key is deployed
 */
export function isContractDeployed(contractKey?: keyof typeof CONTRACT_ADDRESSES): boolean {
  if (!NETWORK_CONFIG.isDeployed) return false;
  if (!contractKey) return false;
  const addr = CONTRACT_ADDRESSES[contractKey];
  return Boolean(addr && addr.startsWith('0x') && addr.length === 42 && addr !== CONTRACT_ADDRESSES.burnDead);
}

/**
 * Check whether the given contract is both deployed and enabled
 */
export function isContractActive(contractKey?: keyof typeof CONTRACT_ADDRESSES): boolean {
  if (!isContractDeployed(contractKey)) return false;
  if (!contractKey) return false;
  return Boolean(CONTRACT_ENABLED_FLAGS[contractKey]);
}

/**
 * Returns the explorer link for an address, or null if address is undeployed / empty
 */
export function getExplorerAddressUrl(address?: string): string | null {
  if (!address || address.trim() === '' || !address.startsWith('0x')) {
    return null;
  }
  return `${NETWORK_CONFIG.explorerUrl}/address/${address}`;
}

/**
 * Returns the explorer link for a tx hash, or null if empty
 */
export function getExplorerTxUrl(txHash?: string): string | null {
  if (!txHash || txHash.trim() === '' || !txHash.startsWith('0x')) {
    return null;
  }
  return `${NETWORK_CONFIG.explorerUrl}/tx/${txHash}`;
}
