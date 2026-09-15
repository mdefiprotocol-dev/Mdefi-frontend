import React from 'react';
import { 
  Sparkles, 
  Users, 
  Cpu, 
  Coins, 
  Clock, 
  AlertCircle, 
  ArrowDownLeft, 
  ArrowUpRight,
  Layers,
  CheckCircle2,
  ArrowLeftRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export type TransactionCategory = 
  | 'registration_reward'
  | 'referral_reward'
  | 'package_reward'
  | 'matrix_income'
  | 'salary_reward'
  | 'token_swap'
  | 'claim'
  | 'pending'
  | 'failed_or_negative';

export interface TransactionVisualConfig {
  category: TransactionCategory;
  label: string;
  dotClass: string;
  iconBgClass: string;
  iconTextClass: string;
  badgeClass: string;
  amountClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function getTransactionVisual(
  typeStr: string, 
  statusStr: string = 'Confirmed',
  amountStr: string = ''
): TransactionVisualConfig {
  const typeLower = (typeStr || '').toLowerCase();
  const statusLower = (statusStr || '').toLowerCase();

  // 1. Check Pending Status first
  if (statusLower === 'pending') {
    return {
      category: 'pending',
      label: 'Pending',
      dotClass: 'bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse',
      iconBgClass: 'bg-amber-500/15 border-amber-500/30',
      iconTextClass: 'text-amber-400',
      badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
      amountClass: 'text-amber-300',
      icon: Clock,
    };
  }

  // 2. Check Failed or Negative
  if (statusLower === 'failed' || statusLower === 'rejected' || amountStr.startsWith('-')) {
    return {
      category: 'failed_or_negative',
      label: 'Failed / Debit',
      dotClass: 'bg-rose-500 shadow-[0_0_8px_#f43f5e]',
      iconBgClass: 'bg-rose-500/15 border-rose-500/30',
      iconTextClass: 'text-rose-400',
      badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
      amountClass: 'text-rose-400',
      icon: AlertCircle,
    };
  }

  // 3. Registration Reward (Green)
  if (typeLower.includes('registration')) {
    return {
      category: 'registration_reward',
      label: 'Registration Reward',
      dotClass: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
      iconBgClass: 'bg-emerald-500/15 border-emerald-500/35',
      iconTextClass: 'text-emerald-400',
      badgeClass: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40',
      amountClass: 'text-emerald-400',
      icon: Sparkles,
    };
  }

  // 4. Referral Reward (Blue)
  if (typeLower.includes('referral')) {
    return {
      category: 'referral_reward',
      label: 'Referral Reward',
      dotClass: 'bg-blue-400 shadow-[0_0_8px_#60a5fa]',
      iconBgClass: 'bg-blue-500/15 border-blue-500/35',
      iconTextClass: 'text-blue-400',
      badgeClass: 'bg-blue-950/90 text-blue-300 border-blue-500/40',
      amountClass: 'text-blue-300',
      icon: Users,
    };
  }

  // 5. Package Reward / Node Staking (Purple)
  if (typeLower.includes('package') || typeLower.includes('activation')) {
    return {
      category: 'package_reward',
      label: 'Package Reward',
      dotClass: 'bg-purple-400 shadow-[0_0_8px_#c084fc]',
      iconBgClass: 'bg-purple-500/15 border-purple-500/35',
      iconTextClass: 'text-purple-400',
      badgeClass: 'bg-purple-950/90 text-purple-300 border-purple-500/40',
      amountClass: 'text-purple-300',
      icon: Cpu,
    };
  }

  // 6. Claim Transaction (Yellow / Gold)
  if (typeLower.includes('claim')) {
    return {
      category: 'claim',
      label: 'Claim Transaction',
      dotClass: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
      iconBgClass: 'bg-amber-500/15 border-amber-500/35',
      iconTextClass: 'text-amber-400',
      badgeClass: 'bg-amber-950/90 text-amber-300 border-amber-500/40',
      amountClass: 'text-amber-300',
      icon: ArrowDownLeft,
    };
  }

  // 7. Matrix Income / S4 / Quantum Node (Cyan)
  if (typeLower.includes('matrix') || typeLower.includes('quantum') || typeLower.includes('node') || typeLower.includes('s4')) {
    return {
      category: 'matrix_income',
      label: 'Matrix Income',
      dotClass: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
      iconBgClass: 'bg-cyan-500/15 border-cyan-500/35',
      iconTextClass: 'text-cyan-300',
      badgeClass: 'bg-cyan-950/90 text-cyan-300 border-cyan-500/40',
      amountClass: 'text-cyan-300 font-bold',
      icon: Layers,
    };
  }

  // 8. Weekly Passive Salary (Amber / Yellow)
  if (typeLower.includes('salary')) {
    return {
      category: 'salary_reward',
      label: 'Passive Salary',
      dotClass: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
      iconBgClass: 'bg-amber-500/15 border-amber-500/35',
      iconTextClass: 'text-amber-300',
      badgeClass: 'bg-amber-950/90 text-amber-300 border-amber-500/40',
      amountClass: 'text-amber-300 font-bold',
      icon: Zap,
    };
  }

  // 9. Token Swap / Liquidity (Teal)
  if (typeLower.includes('swap')) {
    return {
      category: 'token_swap',
      label: 'Token Swap',
      dotClass: 'bg-teal-400 shadow-[0_0_8px_#2dd4bf]',
      iconBgClass: 'bg-teal-500/15 border-teal-500/35',
      iconTextClass: 'text-teal-300',
      badgeClass: 'bg-teal-950/90 text-teal-300 border-teal-500/40',
      amountClass: 'text-teal-300 font-bold',
      icon: ArrowLeftRight,
    };
  }

  // 10. Weekly Community Pool Rewards (Emerald Shield)
  if (typeLower.includes('weekly')) {
    return {
      category: 'package_reward',
      label: 'Weekly Pool Reward',
      dotClass: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
      iconBgClass: 'bg-emerald-500/15 border-emerald-500/35',
      iconTextClass: 'text-emerald-300',
      badgeClass: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40',
      amountClass: 'text-emerald-300 font-bold',
      icon: ShieldCheck,
    };
  }

  // Default: Confirmed Green
  return {
    category: 'registration_reward',
    label: typeStr || 'Transaction',
    dotClass: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
    iconBgClass: 'bg-emerald-500/15 border-emerald-500/35',
    iconTextClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40',
    amountClass: 'text-emerald-400',
    icon: CheckCircle2,
  };
}
