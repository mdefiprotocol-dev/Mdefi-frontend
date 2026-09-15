export type ModuleStatus = 'LIVE NOW' | 'LAUNCHING SOON';

export type ModuleIconType = 
  | 'airdrop'
  | 's4-nodes'
  | 'quantum-nexus'
  | 'weekly-starter'
  | 'weekly-premium'
  | 'weekly-salary'
  | 'token-launch'
  | 'stacking-nodes'
  | 'roi-nodes'
  | 'team-community'
  | 'transaction-ledger';

export interface ModuleAccentTheme {
  name: string;
  // Border illumination classes
  borderBase: string;
  borderHover: string;
  // Background gradient mesh
  cardBg: string;
  // Radial glow / halo
  glowBg: string;
  // Status pill theme
  statusBadge: string;
  statusDot: string;
  // Text accents
  accentText: string;
  // Arrow & action cue
  actionColor: string;
  // Icon container theme
  iconContainer: string;
  iconGlow: string;
  iconRing: string;
}

export interface HubModule {
  id: string; // Exact unique ID required
  cardIndex: string; // e.g. "01", "02", ... "11"
  title: string;
  subtitle: string;
  status: ModuleStatus;
  category: string;
  metadata: string;
  actionLabel: string;
  iconType: ModuleIconType;
  accentFamily: string;
  theme: ModuleAccentTheme;
  // Operational linkage (only for live modules or target pages when unlocked)
  isLive: boolean;
}

/**
 * EXACT 11 MODULES WITH PRECISE ACCENT FAMILIES & STATUS RULES
 * CARD 01 (MBTTC AIRDROP) is LIVE NOW.
 * CARDS 02 through 11 are LAUNCHING SOON.
 */
export const HUB_MODULES: HubModule[] = [
  // CARD 01: MBTTC AIRDROP
  {
    id: 'mbttc-airdrop',
    cardIndex: '01',
    title: 'MBTTC AIRDROP',
    subtitle: 'MBTTC community distribution & participation',
    status: 'LIVE NOW',
    category: 'Distribution & Community',
    metadata: 'Ecosystem Distribution',
    actionLabel: 'Explore Module',
    iconType: 'airdrop',
    accentFamily: 'Emerald / Cyan / Aqua / Gold',
    isLive: true,
    theme: {
      name: 'Emerald-Cyan-Aqua-Gold',
      borderBase: 'border-emerald-500/30',
      borderHover: 'group-hover:border-emerald-400/80',
      cardBg: 'from-[#071912]/95 via-[#04110c]/90 to-[#020a06]/95',
      glowBg: 'bg-emerald-500/15',
      statusBadge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.35)]',
      statusDot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
      accentText: 'text-emerald-300',
      actionColor: 'text-emerald-400 group-hover:text-emerald-300',
      iconContainer: 'bg-gradient-to-br from-emerald-950/90 via-[#062016] to-[#02100a] border-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,0.3)]',
      iconGlow: 'bg-emerald-400/25',
      iconRing: 'border-emerald-400/30',
    },
  },

  // CARD 02: S4 NODES
  {
    id: 's4-nodes',
    cardIndex: '02',
    title: 'S4 NODES',
    subtitle: 'Smart 2×2 Matrix Infrastructure',
    status: 'LAUNCHING SOON',
    category: 'Matrix Protocol',
    metadata: 'S4 Node Architecture',
    actionLabel: 'Explore Module',
    iconType: 's4-nodes',
    accentFamily: 'Green / Teal / Cyan',
    isLive: false,
    theme: {
      name: 'Green-Teal-Cyan',
      borderBase: 'border-teal-500/25',
      borderHover: 'group-hover:border-teal-400/70',
      cardBg: 'from-[#051717]/95 via-[#031112]/90 to-[#020a0a]/95',
      glowBg: 'bg-teal-500/12',
      statusBadge: 'bg-teal-950/60 text-teal-400/80 border-teal-500/30',
      statusDot: 'bg-teal-400/70',
      accentText: 'text-teal-300',
      actionColor: 'text-teal-400 group-hover:text-teal-300',
      iconContainer: 'bg-gradient-to-br from-teal-950/90 via-[#051f20] to-[#020e0e] border-teal-500/40 shadow-[0_0_22px_rgba(20,184,166,0.25)]',
      iconGlow: 'bg-teal-400/20',
      iconRing: 'border-teal-400/30',
    },
  },

  // CARD 03: QUANTUM & NEXUS NODES
  {
    id: 'quantum-nexus',
    cardIndex: '03',
    title: 'QUANTUM & NEXUS NODES',
    subtitle: 'Quantum Matrix and Nexus Prime ecosystem',
    status: 'LAUNCHING SOON',
    category: 'High-Tier Matrix',
    metadata: 'Quantum & Nexus Architecture',
    actionLabel: 'Explore Module',
    iconType: 'quantum-nexus',
    accentFamily: 'Violet / Blue / Electric Cyan',
    isLive: false,
    theme: {
      name: 'Violet-Blue-Cyan',
      borderBase: 'border-indigo-500/25',
      borderHover: 'group-hover:border-indigo-400/70',
      cardBg: 'from-[#0d1024]/95 via-[#080a18]/90 to-[#03040c]/95',
      glowBg: 'bg-indigo-500/12',
      statusBadge: 'bg-indigo-950/60 text-indigo-400/80 border-indigo-500/30',
      statusDot: 'bg-indigo-400/70',
      accentText: 'text-indigo-300',
      actionColor: 'text-indigo-400 group-hover:text-indigo-300',
      iconContainer: 'bg-gradient-to-br from-indigo-950/90 via-[#101533] to-[#050718] border-indigo-500/40 shadow-[0_0_22px_rgba(99,102,241,0.25)]',
      iconGlow: 'bg-indigo-400/20',
      iconRing: 'border-indigo-400/30',
    },
  },

  // CARD 04: WEEKLY REWARD STARTER
  {
    id: 'weekly-reward-starter',
    cardIndex: '04',
    title: 'WEEKLY REWARD STARTER',
    subtitle: 'Starter-level weekly reward system',
    status: 'LAUNCHING SOON',
    category: 'Yield System',
    metadata: 'Weekly Starter Stream',
    actionLabel: 'Explore Module',
    iconType: 'weekly-starter',
    accentFamily: 'Gold / Amber / Orange',
    isLive: false,
    theme: {
      name: 'Gold-Amber-Orange',
      borderBase: 'border-amber-500/25',
      borderHover: 'group-hover:border-amber-400/70',
      cardBg: 'from-[#1a1405]/95 via-[#120e03]/90 to-[#0a0701]/95',
      glowBg: 'bg-amber-500/12',
      statusBadge: 'bg-amber-950/60 text-amber-400/80 border-amber-500/30',
      statusDot: 'bg-amber-400/70',
      accentText: 'text-amber-300',
      actionColor: 'text-amber-400 group-hover:text-amber-300',
      iconContainer: 'bg-gradient-to-br from-amber-950/90 via-[#261d06] to-[#120e02] border-amber-500/40 shadow-[0_0_22px_rgba(245,158,11,0.25)]',
      iconGlow: 'bg-amber-400/20',
      iconRing: 'border-amber-400/30',
    },
  },

  // CARD 05: WEEKLY REWARD PREMIUM
  {
    id: 'weekly-reward-premium',
    cardIndex: '05',
    title: 'WEEKLY REWARD PREMIUM',
    subtitle: 'Premium weekly reward system',
    status: 'LAUNCHING SOON',
    category: 'Yield System',
    metadata: 'Enhanced Yield Multipliers',
    actionLabel: 'Explore Module',
    iconType: 'weekly-premium',
    accentFamily: 'Purple / Magenta / Gold',
    isLive: false,
    theme: {
      name: 'Purple-Magenta-Gold',
      borderBase: 'border-purple-500/25',
      borderHover: 'group-hover:border-purple-400/70',
      cardBg: 'from-[#190a21]/95 via-[#110617]/90 to-[#08020d]/95',
      glowBg: 'bg-purple-500/12',
      statusBadge: 'bg-purple-950/60 text-purple-400/80 border-purple-500/30',
      statusDot: 'bg-purple-400/70',
      accentText: 'text-purple-300',
      actionColor: 'text-purple-400 group-hover:text-purple-300',
      iconContainer: 'bg-gradient-to-br from-purple-950/90 via-[#250d32] to-[#100317] border-purple-500/40 shadow-[0_0_22px_rgba(168,85,247,0.25)]',
      iconGlow: 'bg-purple-400/20',
      iconRing: 'border-purple-400/30',
    },
  },

  // CARD 06: WEEKLY SALARY PASSIVE INCOME
  {
    id: 'weekly-salary',
    cardIndex: '06',
    title: 'WEEKLY SALARY PASSIVE INCOME',
    subtitle: 'Weekly salary and passive-income ecosystem',
    status: 'LAUNCHING SOON',
    category: 'Passive Income',
    metadata: 'Rank & Performance Salary',
    actionLabel: 'Explore Module',
    iconType: 'weekly-salary',
    accentFamily: 'Emerald / Teal / Blue',
    isLive: false,
    theme: {
      name: 'Emerald-Teal-Blue',
      borderBase: 'border-emerald-500/25',
      borderHover: 'group-hover:border-emerald-400/70',
      cardBg: 'from-[#061817]/95 via-[#031112]/90 to-[#020b0b]/95',
      glowBg: 'bg-emerald-500/12',
      statusBadge: 'bg-emerald-950/60 text-emerald-400/80 border-emerald-500/30',
      statusDot: 'bg-emerald-400/70',
      accentText: 'text-emerald-300',
      actionColor: 'text-emerald-400 group-hover:text-emerald-300',
      iconContainer: 'bg-gradient-to-br from-emerald-950/90 via-[#062420] to-[#02100e] border-emerald-500/40 shadow-[0_0_22px_rgba(16,185,129,0.25)]',
      iconGlow: 'bg-emerald-400/20',
      iconRing: 'border-emerald-400/30',
    },
  },

  // CARD 07: MBTTC TOKEN LAUNCH
  {
    id: 'mbttc-token-launch',
    cardIndex: '07',
    title: 'MBTTC TOKEN LAUNCH',
    subtitle: 'MBTTC token launch and ecosystem rollout',
    status: 'LAUNCHING SOON',
    category: 'Token Rollout',
    metadata: 'BEP-20 / Native Rollout',
    actionLabel: 'Explore Module',
    iconType: 'token-launch',
    accentFamily: 'Blue / Cyan / Violet',
    isLive: false,
    theme: {
      name: 'Blue-Cyan-Violet',
      borderBase: 'border-sky-500/25',
      borderHover: 'group-hover:border-sky-400/70',
      cardBg: 'from-[#061421]/95 via-[#030d17]/90 to-[#02070d]/95',
      glowBg: 'bg-sky-500/12',
      statusBadge: 'bg-sky-950/60 text-sky-400/80 border-sky-500/30',
      statusDot: 'bg-sky-400/70',
      accentText: 'text-sky-300',
      actionColor: 'text-sky-400 group-hover:text-sky-300',
      iconContainer: 'bg-gradient-to-br from-sky-950/90 via-[#071c31] to-[#030d17] border-sky-500/40 shadow-[0_0_22px_rgba(14,165,233,0.25)]',
      iconGlow: 'bg-sky-400/20',
      iconRing: 'border-sky-400/30',
    },
  },

  // CARD 08: MDEFI STACKING NODES
  {
    id: 'mdefi-stacking',
    cardIndex: '08',
    title: 'MDEFI STACKING NODES',
    subtitle: 'MDeFi staking node ecosystem',
    status: 'LAUNCHING SOON',
    category: 'Staking Pools',
    metadata: 'Staking Node Architecture',
    actionLabel: 'Explore Module',
    iconType: 'stacking-nodes',
    accentFamily: 'Emerald / Lime / Cyan',
    isLive: false,
    theme: {
      name: 'Emerald-Lime-Cyan',
      borderBase: 'border-lime-500/25',
      borderHover: 'group-hover:border-lime-400/70',
      cardBg: 'from-[#0d1c07]/95 via-[#081304]/90 to-[#030901]/95',
      glowBg: 'bg-lime-500/12',
      statusBadge: 'bg-lime-950/60 text-lime-400/80 border-lime-500/30',
      statusDot: 'bg-lime-400/70',
      accentText: 'text-lime-300',
      actionColor: 'text-lime-400 group-hover:text-lime-300',
      iconContainer: 'bg-gradient-to-br from-lime-950/90 via-[#132b0a] to-[#071303] border-lime-500/40 shadow-[0_0_22px_rgba(132,204,22,0.25)]',
      iconGlow: 'bg-lime-400/20',
      iconRing: 'border-lime-400/30',
    },
  },

  // CARD 09: ROI PREMIUM NODES
  {
    id: 'roi-premium',
    cardIndex: '09',
    title: 'ROI PREMIUM NODES',
    subtitle: 'Premium ROI node ecosystem',
    status: 'LAUNCHING SOON',
    category: 'ROI Ecosystem',
    metadata: 'Yield Curve Architecture',
    actionLabel: 'Explore Module',
    iconType: 'roi-nodes',
    accentFamily: 'Violet / Blue / Magenta',
    isLive: false,
    theme: {
      name: 'Violet-Blue-Magenta',
      borderBase: 'border-fuchsia-500/25',
      borderHover: 'group-hover:border-fuchsia-400/70',
      cardBg: 'from-[#1c081e]/95 via-[#130415]/90 to-[#08020a]/95',
      glowBg: 'bg-fuchsia-500/12',
      statusBadge: 'bg-fuchsia-950/60 text-fuchsia-400/80 border-fuchsia-500/30',
      statusDot: 'bg-fuchsia-400/70',
      accentText: 'text-fuchsia-300',
      actionColor: 'text-fuchsia-400 group-hover:text-fuchsia-300',
      iconContainer: 'bg-gradient-to-br from-fuchsia-950/90 via-[#2b0c30] to-[#120315] border-fuchsia-500/40 shadow-[0_0_22px_rgba(217,70,239,0.25)]',
      iconGlow: 'bg-fuchsia-400/20',
      iconRing: 'border-fuchsia-400/30',
    },
  },

  // CARD 10: TEAM & COMMUNITY
  {
    id: 'team-community',
    cardIndex: '10',
    title: 'TEAM & COMMUNITY',
    subtitle: 'Community, team and network ecosystem',
    status: 'LAUNCHING SOON',
    category: 'Network Ecosystem',
    metadata: 'Network Topology',
    actionLabel: 'Explore Module',
    iconType: 'team-community',
    accentFamily: 'Cyan / Blue / Purple',
    isLive: false,
    theme: {
      name: 'Cyan-Blue-Purple',
      borderBase: 'border-cyan-500/25',
      borderHover: 'group-hover:border-cyan-400/70',
      cardBg: 'from-[#061721]/95 via-[#030f17]/90 to-[#01090f]/95',
      glowBg: 'bg-cyan-500/12',
      statusBadge: 'bg-cyan-950/60 text-cyan-400/80 border-cyan-500/30',
      statusDot: 'bg-cyan-400/70',
      accentText: 'text-cyan-300',
      actionColor: 'text-cyan-400 group-hover:text-cyan-300',
      iconContainer: 'bg-gradient-to-br from-cyan-950/90 via-[#072130] to-[#020e16] border-cyan-500/40 shadow-[0_0_22px_rgba(6,182,212,0.25)]',
      iconGlow: 'bg-cyan-400/20',
      iconRing: 'border-cyan-400/30',
    },
  },

  // CARD 11: TRANSACTION LEDGER
  {
    id: 'transaction-ledger',
    cardIndex: '11',
    title: 'TRANSACTION LEDGER',
    subtitle: 'Transparent transaction and activity records',
    status: 'LAUNCHING SOON',
    category: 'Audit & Records',
    metadata: 'Cryptographic Ledger Records',
    actionLabel: 'Explore Module',
    iconType: 'transaction-ledger',
    accentFamily: 'Teal / Emerald / Gold',
    isLive: false,
    theme: {
      name: 'Teal-Emerald-Gold',
      borderBase: 'border-teal-500/25',
      borderHover: 'group-hover:border-teal-400/70',
      cardBg: 'from-[#051813]/95 via-[#03110d]/90 to-[#020b08]/95',
      glowBg: 'bg-teal-500/12',
      statusBadge: 'bg-teal-950/60 text-teal-400/80 border-teal-500/30',
      statusDot: 'bg-teal-400/70',
      accentText: 'text-teal-300',
      actionColor: 'text-teal-400 group-hover:text-teal-300',
      iconContainer: 'bg-gradient-to-br from-teal-950/90 via-[#06241b] to-[#02100b] border-teal-500/40 shadow-[0_0_22px_rgba(20,184,166,0.25)]',
      iconGlow: 'bg-teal-400/20',
      iconRing: 'border-teal-400/30',
    },
  },
];
