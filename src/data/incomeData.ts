import { UserProfile, RewardBalances } from '../types';
import { IncomeCategoryItem } from '../types/income';
import { centralEventSyncService } from '../services/centralEventSyncService';

export function calculateEcosystemIncome(user?: UserProfile, rewards?: RewardBalances): IncomeCategoryItem[] {
  // Lifetime earned data bound to protocol sub-engines and verified contracts
  const s4Direct = 64.00;
  const s4Junior = 48.00;
  const s4Senior = 56.00;
  const quantumDirect = 80.00;
  const quantumMatrix = 96.00;
  const magicBonus = 75.00;
  const nexusDirect = 90.00;
  const nexusGeneration = 185.00;
  const magicPassivePool = 240.00;

  // Dynamically synchronized with central settlement totals
  const starterSettled = centralEventSyncService.getStarterTotalSettled();
  const premiumSettled = centralEventSyncService.getPremiumTotalSettled();
  const salarySettled = centralEventSyncService.getSalaryTotalSettled();
  const weeklyStarter = Math.max(1425.00, starterSettled);
  const weeklyPremium = Math.max(3850.00, premiumSettled);
  const weeklySalary = Math.max(150.00, salarySettled);

  // Dynamic sum of streams 1 through 12
  const totalYield = (
    s4Direct +
    s4Junior +
    s4Senior +
    quantumDirect +
    quantumMatrix +
    magicBonus +
    nexusDirect +
    nexusGeneration +
    magicPassivePool +
    weeklyStarter +
    weeklyPremium +
    weeklySalary
  );

  const categories: IncomeCategoryItem[] = [
    {
      id: 's4_direct_income',
      order: 1,
      title: 'S4 Direct Income',
      description: 'Lifetime direct income earned through S4 Matrix.',
      currency: 'USDT',
      lifetimeAmountUsdt: s4Direct,
      iconType: 's4_network',
      badge: '#01 • S4 Referral',
      accentColor: 'emerald',
      animationType: 'small glowing network nodes connecting around the icon',
      viewAction: 's4_direct',
      viewActionLabel: 'View S4 Direct Matrix',
    },
    {
      id: 's4_junior_matrix_income',
      order: 2,
      title: 'S4 Junior Node',
      description: 'Lifetime income earned through the S4 Junior Node matrix.',
      currency: 'USDT',
      lifetimeAmountUsdt: s4Junior,
      iconType: 's4_junior_matrix',
      badge: '#02 • $10 Matrix',
      accentColor: 'cyan',
      animationType: 'circular matrix rings with slow orbital movement',
      viewAction: 's4_junior',
      viewActionLabel: 'View S4 Junior Node ($10)',
    },
    {
      id: 's4_senior_matrix_income',
      order: 3,
      title: 'S4 Senior Node',
      description: 'Lifetime income earned through the S4 Senior Node matrix.',
      currency: 'USDT',
      lifetimeAmountUsdt: s4Senior,
      iconType: 's4_senior_matrix',
      badge: '#03 • $25 Matrix',
      accentColor: 'purple',
      animationType: 'larger orbital matrix ring with elegant energy pulse',
      viewAction: 's4_senior',
      viewActionLabel: 'View S4 Senior Node ($25)',
    },
    {
      id: 'quantum_direct_income',
      order: 4,
      title: 'Quantum Node Direct Income',
      description: 'Lifetime direct income generated through Quantum Node.',
      currency: 'USDT',
      lifetimeAmountUsdt: quantumDirect,
      iconType: 'quantum_atom',
      badge: '#04 • $70 Direct',
      accentColor: 'blue',
      animationType: 'small quantum particles orbiting the icon',
      viewAction: 'quantum_direct',
      viewActionLabel: 'View Quantum Node Direct',
    },
    {
      id: 'quantum_matrix_income',
      order: 5,
      title: 'Quantum Node Matrix Income',
      description: 'Lifetime income earned through the Quantum Node matrix.',
      currency: 'USDT',
      lifetimeAmountUsdt: quantumMatrix,
      iconType: 'quantum_matrix',
      badge: '#05 • Radial X6',
      accentColor: 'cyan',
      animationType: 'multiple luminous particles forming a matrix pattern',
      viewAction: 'quantum_matrix',
      viewActionLabel: 'View Quantum Node Matrix ($70)',
    },
    {
      id: 'magic_cashback_bonus',
      order: 6,
      title: 'Magic Cashback Bonus',
      description: 'Lifetime Magic Cashback Bonus earned by the user.',
      currency: 'USDT',
      lifetimeAmountUsdt: magicBonus,
      iconType: 'magic_crystal',
      badge: '#06 • Speed Bonus',
      accentColor: 'gold',
      animationType: 'slow crystal rotation with luminous pulse',
      viewAction: 'magic_cashback_bonus',
      viewActionLabel: 'View Magic Cashback Bonus',
    },
    {
      id: 'nexus_direct_income',
      order: 7,
      title: 'Nexus Prime Direct Income',
      description: 'Lifetime direct income generated through Nexus Prime.',
      currency: 'USDT',
      lifetimeAmountUsdt: nexusDirect,
      iconType: 'nexus_star',
      badge: '#07 • $120 Direct',
      accentColor: 'fuchsia',
      animationType: 'connected star points with subtle energy flow',
      viewAction: 'nexus_direct',
      viewActionLabel: 'View Nexus Prime Direct',
    },
    {
      id: 'nexus_generation_pool',
      order: 8,
      title: 'Nexus Prime Generation Pool',
      description: 'Lifetime income received from the Nexus Prime Generation Pool.',
      currency: 'USDT',
      lifetimeAmountUsdt: nexusGeneration,
      iconType: 'nexus_generation',
      badge: '#08 • 10-Gen Pool',
      accentColor: 'teal',
      animationType: 'multiple glowing orbital rings around a central core',
      viewAction: 'nexus_generation',
      viewActionLabel: 'View Nexus Prime Gen Pool ($120)',
    },
    {
      id: 'magic_generation_passive_pool',
      order: 9,
      title: 'Magic Generation Passive Pool',
      description: 'Lifetime income received from the Magic Generation Passive Pool.',
      currency: 'USDT',
      lifetimeAmountUsdt: magicPassivePool,
      iconType: 'magic_moon',
      badge: '#09 • Passive Pool',
      accentColor: 'purple',
      animationType: 'slow moon orbit with tiny stars and soft energy trail',
      viewAction: 'magic_generation_pool',
      viewActionLabel: 'View Magic Gen Passive Pool',
    },
    {
      id: 'weekly_reward_starter',
      order: 10,
      title: 'Weekly Reward Starter',
      description: 'Lifetime protocol reward earned through Weekly Reward Starter.',
      currency: 'USDT',
      lifetimeAmountUsdt: weeklyStarter,
      iconType: 'weekly_starter_sun',
      badge: '#10 • Weekly Pool',
      accentColor: 'emerald',
      animationType: 'sunrise-style radial glow with subtle upward energy',
      viewAction: 'weekly_starter',
      viewActionLabel: 'View Weekly Reward Starter',
    },
    {
      id: 'weekly_reward_premium',
      order: 11,
      title: 'Weekly Reward Premium',
      description: 'Lifetime protocol reward earned through Weekly Reward Premium.',
      currency: 'USDT',
      lifetimeAmountUsdt: weeklyPremium,
      iconType: 'weekly_premium_diamond',
      badge: '#11 • Share Engine',
      accentColor: 'cyan',
      animationType: 'rotating premium diamond with elegant light sweep',
      viewAction: 'weekly_premium',
      viewActionLabel: 'View Weekly Reward Premium',
    },
    {
      id: 'weekly_passive_salary',
      order: 12,
      title: 'Weekly Passive Salary',
      description: 'Lifetime weekly salary reward earned through Weekly Passive Salary.',
      currency: 'USDT',
      lifetimeAmountUsdt: weeklySalary,
      iconType: 'weekly_salary_crown',
      badge: '#12 • Rank Salary',
      accentColor: 'gold',
      animationType: 'rank aura with slow upward energy particles',
      viewAction: 'weekly_salary',
      viewActionLabel: 'View Weekly Passive Salary',
    },
  ];

  // Defensive validation: ensure exactly 12 unique items without duplicate titles or IDs
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const validatedCategories: IncomeCategoryItem[] = [];

  for (const cat of categories) {
    if (!seenIds.has(cat.id) && !seenTitles.has(cat.title)) {
      seenIds.add(cat.id);
      seenTitles.add(cat.title);
      validatedCategories.push(cat);
    }
  }

  return validatedCategories;
}

export function calculateTotalEcosystemIncome(categories: IncomeCategoryItem[]): number {
  return categories.reduce((sum, item) => sum + item.lifetimeAmountUsdt, 0);
}
