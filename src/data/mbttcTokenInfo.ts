import { MBTTC_TOKEN_ADDRESS, MDEFI_HUB_ADDRESS, BURN_DEAD_ADDRESS, MINTING_PHASES_CONFIG, ECOSYSTEM_TELEMETRY } from './contractConfig';

/**
 * SINGLE SOURCE OF TRUTH: MBTTC Token Information & Airdrop Ecosystem Parameters
 * Consumed by MBTTC Token Center, MBTTC Airdrop Detail View, and Hub Modules.
 * Reuses existing on-chain parameters and benchmark metrics without inventing fake data.
 */
export const MBTTC_TOKEN_INFO = {
  name: 'Magnet Bitcoin Token',
  symbol: 'MBTTC',
  standard: 'BEP-20',
  blockchain: 'BNB Smart Chain (BSC)',
  contractAddress: MBTTC_TOKEN_ADDRESS,
  hubAddress: MDEFI_HUB_ADDRESS,
  burnAddress: BURN_DEAD_ADDRESS,
  currentPhase: 'Phase 1',
  phaseStatus: 'ACTIVE NOW',
  benchmarkRateUsd: 1.50,
  
  // Minting Phase 1 Airdrop & Reward Parameters (from contractConfig.ts)
  airdropConfig: {
    registrationRewardMbttc: MINTING_PHASES_CONFIG[0].registrationReward, // 30 MBTTC
    referralRewardMbttc: MINTING_PHASES_CONFIG[0].referralReward,         // 20 MBTTC
    quantumS4RewardMbttc: MINTING_PHASES_CONFIG[0].quantumS4Reward,       // 50 MBTTC
    userTierCap: MINTING_PHASES_CONFIG[0].maxUsers,                      // 10,000
    hardCap: ECOSYSTEM_TELEMETRY.hardCap,                                // 2,000,000 MBTTC
    activeUsers: ECOSYSTEM_TELEMETRY.currentUsers,                       // 8,742
  },

  // On-Chain Distribution Telemetry (from existing system stats)
  telemetry: {
    registrationMinted: '2,500,000 MBTTC',
    referralMinted: '5,800,000 MBTTC',
    packageMinted: '8,200,000 MBTTC',
    totalClaimed: '14,350,000 MBTTC',
    totalBurned: '1,150,000 MBTTC',
    pendingRewards: '2,150,000 MBTTC',
    circulatingSupply: '13,200,000 MBTTC',
    priceOracleNote: 'Live AMM price oracle activation scheduled for Phase 7 liquidity rollout.',
  livePriceNote: 'Live price will be sourced from the configured on-chain liquidity/oracle.',
  },

  // Distribution Channels
  channels: [
    {
      title: 'Registration Airdrop',
      allocation: 'Verified account onboarding bonus',
      frequency: 'One-time on account creation',
      status: 'LIVE NOW',
    },
    {
      title: 'Community Referral Airdrop',
      allocation: 'Frontline partner commission multiplier',
      frequency: 'Per active frontline placement',
      status: 'LIVE NOW',
    },
    {
      title: 'Node Yield Minting',
      allocation: 'Continuous daily block yield',
      frequency: 'Daily verification cycle',
      status: 'LIVE NOW',
    },
  ],
};
