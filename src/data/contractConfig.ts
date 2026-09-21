/**
 * MDeFi Protocol & MBTTC Token Configuration
 * BNB Smart Chain (BEP-20) Specifications & Minting Phase Economics
 */

import { CONTRACT_ADDRESSES } from '../config/contractConfig';

export const MBTTC_TOKEN_ADDRESS = CONTRACT_ADDRESSES.mbttcToken;
export const MDEFI_HUB_ADDRESS = CONTRACT_ADDRESSES.mdefiHub;
export const USDT_TOKEN_ADDRESS = '';
export const BURN_DEAD_ADDRESS = CONTRACT_ADDRESSES.burnDead;

export interface PhaseRewardConfig {
  phase: number;
  name: string;
  status: 'ACTIVE NOW' | 'UPCOMING' | 'PLANNED';
  isCurrent: boolean;
  registrationReward: number; // in MBTTC
  referralReward: number;     // in MBTTC
  quantumS4Reward: number;    // in MBTTC
  maxUsers: number;
  userTierDescription: string;
}

export const MINTING_PHASES_CONFIG: PhaseRewardConfig[] = [
  {
    phase: 1,
    name: 'PHASE 1',
    status: 'ACTIVE NOW',
    isCurrent: true,
    registrationReward: 30,
    referralReward: 20,
    quantumS4Reward: 50,
    maxUsers: 10000,
    userTierDescription: 'Active while ecosystem is in early user tier (0 – 10,000 users)',
  },
  {
    phase: 2,
    name: 'PHASE 2',
    status: 'UPCOMING',
    isCurrent: false,
    registrationReward: 25,
    referralReward: 15,
    quantumS4Reward: 45,
    maxUsers: 50000,
    userTierDescription: 'Scaling tier (10,001 – 50,000 users)',
  },
  {
    phase: 3,
    name: 'PHASE 3',
    status: 'PLANNED',
    isCurrent: false,
    registrationReward: 20,
    referralReward: 10,
    quantumS4Reward: 40,
    maxUsers: 200000,
    userTierDescription: 'Final distribution tier up to 2,000,000 MBTTC mint cap',
  },
];

export const ECOSYSTEM_TELEMETRY = {
  currentUsers: 8742,
  nextPhaseThreshold: 10000,
  hardCap: '2,000,000 MBTTC',
  activePhase: 1,
};

export function getActivePhaseConfig(userCount: number = ECOSYSTEM_TELEMETRY.currentUsers): PhaseRewardConfig {
  if (userCount <= 10000) return MINTING_PHASES_CONFIG[0];
  if (userCount <= 50000) return MINTING_PHASES_CONFIG[1];
  return MINTING_PHASES_CONFIG[2];
}
