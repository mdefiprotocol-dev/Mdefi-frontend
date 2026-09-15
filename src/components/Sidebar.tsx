import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Coins, 
  Users, 
  Layers, 
  TrendingUp, 
  ArrowLeftRight, 
  UserCheck, 
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Network,
  Award,
  Diamond,
  Crown,
  Lock
} from 'lucide-react';
import { NavPage, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { programPhaseService } from '../services/programPhaseService';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onNavigateS4?: (pkg: 'junior' | 'senior') => void;
  user?: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onNavigateS4,
  user,
}) => {
  const { t } = useLanguage();

  const isS4Unlocked = programPhaseService.isModuleUnlocked('s4');
  const isStarterUnlocked = programPhaseService.isModuleUnlocked('starter_reward');
  const isQuantumUnlocked = programPhaseService.isModuleUnlocked('quantum_nexus');
  const isNexusUnlocked = programPhaseService.isModuleUnlocked('nexus_prime');
  const isPremiumUnlocked = programPhaseService.isModuleUnlocked('premium_reward');
  const isSalaryUnlocked = programPhaseService.isModuleUnlocked('salary');

  const navItems: { id: NavPage; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string; isLocked?: boolean }[] = [
    { id: 'overview', label: t('nav_overview', 'Overview'), icon: LayoutDashboard },
    { id: 'hub', label: t('nav_hub', 'MDeFi Hub'), icon: Layers, badge: '11' },
    { 
      id: 'quantum-nexus', 
      label: t('nav_quantum_nexus', 'Quantum Node'), 
      icon: Network, 
      badge: isQuantumUnlocked ? '$70' : '🔒 P3',
      isLocked: !isQuantumUnlocked
    },
    { 
      id: 'nexus-prime', 
      label: t('nav_nexus_prime', 'Nexus Prime'), 
      icon: Sparkles, 
      badge: isNexusUnlocked ? '$120' : '🔒 P3',
      isLocked: !isNexusUnlocked
    },
    { 
      id: 's4-matrix', 
      label: t('nav_s4_matrix', 'S4 Matrix'), 
      icon: Layers, 
      badge: isS4Unlocked ? 'S4' : '🔒 P2',
      isLocked: !isS4Unlocked
    },
    { 
      id: 'weekly_reward_starter', 
      label: t('nav_weekly_starter', 'Weekly Reward Starter'), 
      icon: Award, 
      badge: isStarterUnlocked ? 'Pool' : '🔒 P2',
      isLocked: !isStarterUnlocked
    },
    { 
      id: 'weekly_reward_premium', 
      label: t('nav_weekly_premium', 'Weekly Reward Premium'), 
      icon: Diamond, 
      badge: isPremiumUnlocked ? 'Share' : '🔒 P3',
      isLocked: !isPremiumUnlocked
    },
    { 
      id: 'weekly_passive_salary', 
      label: t('nav_weekly_salary', 'Weekly Passive Salary'), 
      icon: Crown, 
      badge: isSalaryUnlocked ? 'Rank' : '🔒 P3',
      isLocked: !isSalaryUnlocked
    },
    { id: 'mbttc', label: t('nav_mbttc', 'MBTTC'), icon: Coins, badge: 'Token' },
    { id: 'team', label: t('nav_team', 'My Team'), icon: Users },
    { id: 'packages', label: t('nav_packages', 'Packages'), icon: Layers },
    { id: 'income', label: t('nav_income', 'Income'), icon: TrendingUp },
    { id: 'transactions', label: t('nav_transactions', 'Transactions'), icon: ArrowLeftRight },
    { id: 'profile', label: t('nav_profile', 'Profile'), icon: UserCheck },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-emerald-500/10 bg-[#070b08]/95 app-sidebar-panel backdrop-blur-2xl p-4 shrink-0 justify-between min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase mb-2">
            {t('nav_navigation', 'Navigation')}
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        item.isLocked
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
                          : isActive 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>

                  {/* S4 Matrix Sub-package Direct Links */}
                  {item.id === 's4-matrix' && (
                    <div className="pl-9 pr-2 py-1 space-y-1">
                      <button
                        onClick={() => onNavigateS4 ? onNavigateS4('junior') : onNavigate('s4-matrix')}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-emerald-300 hover:bg-zinc-900/50 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isS4Unlocked ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          {t('node_junior', 'Junior Node')}
                        </span>
                        <span className="text-[10px] text-zinc-400">{isS4Unlocked ? '$10' : '🔒 P2'}</span>
                      </button>
                      <button
                        onClick={() => onNavigateS4 ? onNavigateS4('senior') : onNavigate('s4-matrix')}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-teal-300 hover:bg-zinc-900/50 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isS4Unlocked ? 'bg-teal-400' : 'bg-amber-400'}`} />
                          {t('node_senior', 'Senior Node')}
                        </span>
                        <span className="text-[10px] text-zinc-400">{isS4Unlocked ? '$25' : '🔒 P2'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Account Health Quick Pill */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-emerald-500/15 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold text-zinc-300">{t('account_health', 'Account Health')}</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {user?.registrationStatus || t('status_active', 'Active')}
            </span>
          </div>
          <div className="space-y-1 text-[11px] font-mono text-zinc-400">
            <div className="flex justify-between">
              <span>ID:</span>
              <span className="text-zinc-200 font-semibold">{user?.userId || 'MDF-772910'}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('direct_team', 'Direct Team:')}</span>
              <span className="text-emerald-400 font-semibold">{user?.directTeamCount ?? 12} {t('common_partners', 'partners')}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('reg_bonus', 'Reg. Bonus:')}</span>
              <span className="text-zinc-200">{user?.registrationReward ?? 30} MBTTC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer info */}
      <div className="pt-4 border-t border-zinc-900 space-y-3">
        <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
            <Sparkles className="w-3 h-3" />
            <span>{t('sidebar_phase1_prototype', 'Phase 1 Prototype')}</span>
          </div>
          <p className="text-zinc-400 leading-relaxed">
            {t('sidebar_prototype_desc', 'Realistic mock engine running. Smart contracts connect in Phase 2.')}
          </p>
        </div>
        <div className="text-[10px] text-zinc-400 text-center font-mono">
          MDefi Protocol — 2026
        </div>
      </div>
    </aside>
  );
};
