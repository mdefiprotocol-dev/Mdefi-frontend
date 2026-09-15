/**
 * MDeFi Protocol — Central Ecosystem Launch Phase Configuration
 * Single Source of Truth for Launch Phasing, Route Guards & Module Availability
 * 
 * PHASING SPECIFICATION:
 * 
 * PHASE 1:
 * - HUB 🟢 LIVE
 * - REGISTRATION 🟢 LIVE
 * - CLAIM / MINTING 🟢 LIVE
 * - MBTTC TOKEN TRADING 🔒 PHASE 4
 * - S4 MATRIX 🔒 PHASE 2
 * - STARTER REWARD 🔒 PHASE 2
 * - QUANTUM NODE 🔒 PHASE 3
 * - NEXUS PRIME 🔒 PHASE 3
 * - PREMIUM REWARD 🔒 PHASE 3
 * - WEEKLY PASSIVE SALARY 🔒 PHASE 3
 * 
 * PHASE 2:
 * - HUB 🟢 LIVE
 * - REGISTRATION 🟢 LIVE
 * - CLAIM / MINTING 🟢 LIVE
 * - S4 MATRIX 🟢 LIVE
 * - STARTER REWARD 🟢 LIVE
 * - MBTTC LIVE RATE 🟢 LIVE (Treasury IPO ecosystem connection)
 * - MBTTC TRADING 🔒 PHASE 4
 * - QUANTUM NODE 🔒 PHASE 3
 * - NEXUS PRIME 🔒 PHASE 3
 * - PREMIUM REWARD 🔒 PHASE 3
 * - WEEKLY PASSIVE SALARY 🔒 PHASE 3
 * 
 * PHASE 3:
 * - All Phase 2 LIVE modules
 * - QUANTUM NODE 🟢 LIVE
 * - NEXUS PRIME 🟢 LIVE
 * - PREMIUM REWARD 🟢 LIVE
 * - WEEKLY PASSIVE SALARY 🟢 LIVE
 * - MBTTC TRADING 🔒 PHASE 4
 * 
 * PHASE 4:
 * - All previously launched modules remain LIVE
 * - MBTTC TOKEN TRADING 🟢 LIVE
 * 
 * IMPORTANT:
 * Changing ACTIVE_LAUNCH_PHASE automatically updates all relevant module availability states
 * across all navigation guards, views, package buttons, and telemetry.
 */

export type LaunchPhase = 1 | 2 | 3 | 4;

/**
 * MASTER LAUNCH PHASE TOGGLE
 * Set to 1 for Pre-Mainnet / Phase 1 Launch.
 * Change to 2, 3, or 4 to automatically unlock corresponding modules.
 */
export const ACTIVE_LAUNCH_PHASE: LaunchPhase = 1;

export type LaunchModuleKey =
  | 'hub'
  | 'registration'
  | 'claim_minting'
  | 's4'
  | 'starter_reward'
  | 'mbttc_live_rate'
  | 'quantum_nexus'
  | 'nexus_prime'
  | 'premium_reward'
  | 'salary'
  | 'mbttc_trading';

export interface ModuleLaunchDefinition {
  key: LaunchModuleKey;
  name: string;
  minPhase: LaunchPhase;
  routeId: string;
  description: string;
  unlockNote: string;
}

export const MODULE_LAUNCH_DEFINITIONS: Record<LaunchModuleKey, ModuleLaunchDefinition> = {
  hub: {
    key: 'hub',
    name: 'MDeFi Core Hub',
    minPhase: 1,
    routeId: 'hub',
    description: 'Master gateway and community telemetry.',
    unlockNote: 'Active in Phase 1',
  },
  registration: {
    key: 'registration',
    name: 'Web3 Registration',
    minPhase: 1,
    routeId: 'register',
    description: 'Decentralized wallet onboarding and referral anchoring.',
    unlockNote: 'Active in Phase 1',
  },
  claim_minting: {
    key: 'claim_minting',
    name: 'Claim & Minting Telemetry',
    minPhase: 1,
    routeId: 'claim',
    description: 'Registration rewards, initial minting, and airdrop telemetry.',
    unlockNote: 'Active in Phase 1',
  },
  s4: {
    key: 's4',
    name: 'S4 Matrix ($10 Junior & $25 Senior)',
    minPhase: 2,
    routeId: 's4-matrix',
    description: 'Concentric 2-ring circular matrix and continuous auto-recycle.',
    unlockNote: 'Unlocks in Phase 2',
  },
  starter_reward: {
    key: 'starter_reward',
    name: 'Weekly Starter Reward',
    minPhase: 2,
    routeId: 'weekly_reward_starter',
    description: 'Weekly community performance distribution for Senior node holders.',
    unlockNote: 'Unlocks in Phase 2',
  },
  mbttc_live_rate: {
    key: 'mbttc_live_rate',
    name: 'MBTTC Live Rate (Treasury IPO)',
    minPhase: 2,
    routeId: 'mbttc-rate',
    description: 'Algorithmic rate calculation derived from Treasury IPO liquidity.',
    unlockNote: 'Available in Phase 2 via Treasury IPO',
  },
  quantum_nexus: {
    key: 'quantum_nexus',
    name: 'Quantum Node ($70)',
    minPhase: 3,
    routeId: 'quantum-nexus',
    description: 'Concentric 4-ring matrix, magic cashback, and 10 generation levels.',
    unlockNote: 'Unlocks in Phase 3',
  },
  nexus_prime: {
    key: 'nexus_prime',
    name: 'Nexus Prime Node ($120)',
    minPhase: 3,
    routeId: 'nexus-prime',
    description: 'High-capacity 4-ring matrix and weekly passive salary eligibility.',
    unlockNote: 'Unlocks in Phase 3',
  },
  premium_reward: {
    key: 'premium_reward',
    name: 'Weekly Premium Reward',
    minPhase: 3,
    routeId: 'weekly_reward_premium',
    description: 'Exclusive weekly reward pool for Quantum node participants.',
    unlockNote: 'Unlocks in Phase 3',
  },
  salary: {
    key: 'salary',
    name: 'Weekly Passive Salary',
    minPhase: 3,
    routeId: 'weekly_passive_salary',
    description: 'Rank-based recurring weekly salary for Nexus Prime holders.',
    unlockNote: 'Unlocks in Phase 3',
  },
  mbttc_trading: {
    key: 'mbttc_trading',
    name: 'MBTTC Token Trading / DEX Swap',
    minPhase: 4,
    routeId: 'mbttc-trading',
    description: 'Decentralized liquidity pair trading and peer-to-peer swap.',
    unlockNote: 'MBTTC Trading launches in Phase 4',
  },
};

/**
 * Check if a given minimum phase is currently live
 */
export function isPhaseActive(minPhase: LaunchPhase, currentPhase: LaunchPhase = ACTIVE_LAUNCH_PHASE): boolean {
  return currentPhase >= minPhase;
}

/**
 * Check if a module is active in the current launch phase
 */
export function isModuleActive(moduleKey: LaunchModuleKey, currentPhase: LaunchPhase = ACTIVE_LAUNCH_PHASE): boolean {
  const def = MODULE_LAUNCH_DEFINITIONS[moduleKey];
  if (!def) return false;
  return currentPhase >= def.minPhase;
}

/**
 * Get human-readable badge text for module phase state
 */
export function getModulePhaseBadge(moduleKey: LaunchModuleKey, currentPhase: LaunchPhase = ACTIVE_LAUNCH_PHASE): string {
  const def = MODULE_LAUNCH_DEFINITIONS[moduleKey];
  if (!def) return 'LOCKED';
  if (currentPhase >= def.minPhase) {
    return '🟢 LIVE';
  }
  return `🔒 PHASE ${def.minPhase}`;
}

/**
 * Get message for locked state
 */
export function getModuleLockMessage(moduleKey: LaunchModuleKey): string {
  const def = MODULE_LAUNCH_DEFINITIONS[moduleKey];
  if (!def) return 'Feature Locked';
  if (def.minPhase === 4) {
    return 'MBTTC Trading launches in Phase 4.';
  }
  return `This feature will unlock after the Phase ${def.minPhase} community launch.`;
}
