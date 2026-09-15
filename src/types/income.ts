export type IncomeViewAction = 
  | 's4_direct'
  | 's4_junior'
  | 's4_senior'
  | 'quantum_direct'
  | 'quantum_matrix'
  | 'magic_cashback_bonus'
  | 'nexus_direct'
  | 'nexus_generation'
  | 'magic_generation_pool'
  | 'weekly_starter'
  | 'weekly_premium'
  | 'weekly_salary';

export interface IncomeCategoryItem {
  id: string;
  order: number;
  title: string;
  description: string;
  currency: 'USDT';
  lifetimeAmountUsdt: number;
  iconType: 
    | 's4_network'
    | 's4_junior_matrix'
    | 's4_senior_matrix'
    | 'quantum_atom'
    | 'quantum_matrix'
    | 'magic_star'
    | 'magic_crystal'
    | 'nexus_star'
    | 'nexus_generation'
    | 'magic_moon'
    | 'weekly_starter_sun'
    | 'weekly_premium_diamond'
    | 'weekly_salary_crown';
  badge: string;
  accentColor: 'emerald' | 'cyan' | 'purple' | 'blue' | 'amber' | 'gold' | 'teal' | 'fuchsia' | 'rose';
  animationType: string;
  viewAction: IncomeViewAction;
  viewActionLabel?: string;
  highlight?: boolean;
}
