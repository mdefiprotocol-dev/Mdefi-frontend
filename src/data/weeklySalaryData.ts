export interface WeeklySalaryRankDef {
  id: string;
  name: string;
  level: number;
  requiredDirects: number;
  additionalDirects: number;
  weeklyRewardUsdt: number;
  maxWeeks: number;
  totalPotentialUsdt: number;
  iconType: 'shield' | 'medal' | 'crown' | 'diamond' | 'premium_diamond' | 'blue_crystal' | 'royal_crown';
  badgeColor: string;
  borderHover: string;
  accentText: string;
  description: string;
}

export const WEEKLY_SALARY_RANKS: WeeklySalaryRankDef[] = [
  {
    id: 'bronze',
    name: 'BRONZE',
    level: 1,
    requiredDirects: 10,
    additionalDirects: 10,
    weeklyRewardUsdt: 15,
    maxWeeks: 10,
    totalPotentialUsdt: 150,
    iconType: 'shield',
    badgeColor: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    borderHover: 'hover:border-amber-400/60',
    accentText: 'text-amber-400',
    description: 'Entry rank unlocked upon reaching 10 qualified Nexus Prime direct activations.',
  },
  {
    id: 'silver',
    name: 'SILVER',
    level: 2,
    requiredDirects: 25,
    additionalDirects: 15,
    weeklyRewardUsdt: 30,
    maxWeeks: 11,
    totalPotentialUsdt: 330,
    iconType: 'medal',
    badgeColor: 'bg-slate-800 text-slate-200 border-slate-500/40',
    borderHover: 'hover:border-slate-300/60',
    accentText: 'text-slate-300',
    description: 'Requires 15 additional directs over Bronze (25 cumulative total).',
  },
  {
    id: 'gold',
    name: 'GOLD',
    level: 3,
    requiredDirects: 50,
    additionalDirects: 25,
    weeklyRewardUsdt: 50,
    maxWeeks: 12,
    totalPotentialUsdt: 600,
    iconType: 'crown',
    badgeColor: 'bg-yellow-950/60 text-yellow-300 border-yellow-500/40',
    borderHover: 'hover:border-yellow-400/60',
    accentText: 'text-yellow-400',
    description: 'Requires 25 additional directs over Silver (50 cumulative total).',
  },
  {
    id: 'platinum',
    name: 'PLATINUM',
    level: 4,
    requiredDirects: 100,
    additionalDirects: 50,
    weeklyRewardUsdt: 100,
    maxWeeks: 12,
    totalPotentialUsdt: 1200,
    iconType: 'diamond',
    badgeColor: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
    borderHover: 'hover:border-cyan-400/60',
    accentText: 'text-cyan-400',
    description: 'Requires 50 additional directs over Gold (100 cumulative total).',
  },
  {
    id: 'diamond',
    name: 'DIAMOND',
    level: 5,
    requiredDirects: 250,
    additionalDirects: 150,
    weeklyRewardUsdt: 250,
    maxWeeks: 13,
    totalPotentialUsdt: 3250,
    iconType: 'premium_diamond',
    badgeColor: 'bg-blue-950/60 text-blue-300 border-blue-500/40',
    borderHover: 'hover:border-blue-400/60',
    accentText: 'text-blue-400',
    description: 'Executive leadership tier requiring 150 additional directs (250 cumulative total).',
  },
  {
    id: 'blue-diamond',
    name: 'BLUE DIAMOND',
    level: 6,
    requiredDirects: 500,
    additionalDirects: 250,
    weeklyRewardUsdt: 500,
    maxWeeks: 12,
    totalPotentialUsdt: 6000,
    iconType: 'blue_crystal',
    badgeColor: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40',
    borderHover: 'hover:border-indigo-400/60',
    accentText: 'text-indigo-400',
    description: 'Elite network rank requiring 250 additional directs (500 cumulative total).',
  },
  {
    id: 'crown-diamond',
    name: 'CROWN DIAMOND',
    level: 7,
    requiredDirects: 1000,
    additionalDirects: 500,
    weeklyRewardUsdt: 1000,
    maxWeeks: 12,
    totalPotentialUsdt: 12000,
    iconType: 'royal_crown',
    badgeColor: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    borderHover: 'hover:border-emerald-400/60',
    accentText: 'text-emerald-400',
    description: 'Apex ranking unlocked at 1,000 cumulative qualified direct activations.',
  },
];

export const SALARY_OVERVIEW_CARDS = [
  {
    id: 'nexus-prime',
    title: 'NEXUS PRIME',
    value: '$120',
    subtitle: 'Qualifying Activation',
    description: 'Nexus Prime package purchase that unlocks weekly salary qualification.',
    accent: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    bgGlow: 'from-emerald-950/40 via-zinc-900/60 to-zinc-950',
  },
  {
    id: 'salary-fund',
    title: 'SALARY FUND',
    value: '$30',
    subtitle: 'Per Qualifying Activation',
    description: 'Automated 25% protocol allocation directed into the weekly salary pool.',
    accent: 'text-teal-300',
    borderColor: 'border-teal-500/30',
    bgGlow: 'from-teal-950/40 via-zinc-900/60 to-zinc-950',
  },
  {
    id: 'claim-cycle',
    title: 'CLAIM CYCLE',
    value: '7 DAYS',
    subtitle: '168-Hour Window',
    description: 'Structured recurring epoch for on-chain eligible reward claims.',
    accent: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    bgGlow: 'from-cyan-950/40 via-zinc-900/60 to-zinc-950',
  },
  {
    id: 'max-rank',
    title: 'MAX RANK',
    value: 'CROWN DIAMOND',
    subtitle: '1000 Directs',
    description: 'Top protocol rank distributing $1,000/week across up to 12 weekly cycles.',
    accent: 'text-emerald-300',
    borderColor: 'border-emerald-400/40',
    bgGlow: 'from-emerald-900/40 via-zinc-900/60 to-zinc-950',
  },
];

export const SALARY_WORKFLOW_NODES = [
  { id: '1', label: 'NEXUS PRIME $120', desc: 'New referral package activation' },
  { id: '2', label: 'QUALIFYING DIRECT ACTIVATION', desc: 'On-chain referral verification' },
  { id: '3', label: 'DIRECT COUNT +1', desc: 'Cumulative score increments' },
  { id: '4', label: 'RANK QUALIFICATION', desc: 'Threshold evaluated (10–1000)' },
  { id: '5', label: '7-DAY CYCLE', desc: '168-hour epoch in progress' },
  { id: '6', label: 'ELIGIBLE SALARY', desc: 'Contract reward credit released' },
  { id: '7', label: 'CLAIM', desc: 'USDT withdrawal or accumulation' },
  { id: '8', label: 'NEXT RANK PROGRESS', desc: 'Retains all past team members' },
];

export const SALARY_USER_JOURNEY = [
  {
    step: 'STEP 01',
    title: 'QUALIFYING NEXUS PRIME ACTIVATION',
    desc: 'Participant activates the $120 Nexus Prime node via your personal referral link.',
  },
  {
    step: 'STEP 02',
    title: 'BUILD DIRECT TEAM',
    desc: 'Each qualified direct activation automatically increments your on-chain direct count by one.',
  },
  {
    step: 'STEP 03',
    title: 'REACH BRONZE (10 DIRECTS)',
    desc: 'Unlocks Bronze rank entitlement with $15 / week for up to 10 consecutive weekly cycles.',
  },
  {
    step: 'STEP 04',
    title: 'COMPLETE WEEKLY CYCLE (7 DAYS / 168 HOURS)',
    desc: 'The smart contract tallies the weekly epoch countdown before claim verification opens.',
  },
  {
    step: 'STEP 05',
    title: 'CLAIM ELIGIBLE REWARD',
    desc: 'Initiate the contract-based payout in USDT to your connected non-custodial wallet.',
  },
  {
    step: 'STEP 06',
    title: 'CONTINUE BUILDING TEAM',
    desc: 'Every new qualifying referral is added on top of your existing 10 Bronze directs.',
  },
  {
    step: 'STEP 07',
    title: 'REACH NEXT RANK',
    desc: 'Attain Silver at 25 directs (+15 additional), Gold at 50 (+25), and upward.',
  },
  {
    step: 'STEP 08',
    title: 'PROGRESS TOWARD HIGHER WEEKLY REWARD',
    desc: 'Advance through Platinum, Diamond, Blue Diamond, and Crown Diamond ($1,000/week).',
  },
];
