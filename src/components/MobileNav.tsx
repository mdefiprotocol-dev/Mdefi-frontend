import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Coins, 
  Users, 
  MoreHorizontal, 
  Layers, 
  TrendingUp, 
  ArrowLeftRight, 
  UserCheck, 
  X,
  Network,
  Sparkles,
  Award,
  Diamond,
  Crown,
  Package,
  ChevronRight,
  Lock
} from 'lucide-react';
import { NavPage, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { programPhaseService } from '../services/programPhaseService';

interface MobileNavProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  user?: UserProfile;
  onOpenClaimModal?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  onNavigate,
  user,
}) => {
  const { t } = useLanguage();
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  const mainItems: { id: NavPage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: t('nav_overview', 'Overview'), icon: LayoutDashboard },
    { id: 'mbttc', label: t('nav_mbttc', 'MBTTC'), icon: Coins },
    { id: 'team', label: t('nav_team', 'Team'), icon: Users },
  ];

  // Exact 10-item MDefi Menu sequence per protocol specification
  const moreItems: { 
    id: NavPage; 
    label: string; 
    desc: string; 
    icon: React.ComponentType<{ className?: string }>;
    accentClass: string;
    iconColor: string;
  }[] = [
    { 
      id: 'hub', 
      label: t('nav_hub', 'MDeFi Hub'), 
      desc: t('nav_hub_desc', '11 Core Ecosystem Modules'), 
      icon: Layers,
      accentClass: 'bg-emerald-500/15 border-emerald-500/40 shadow-[0_0_16px_rgba(16,185,129,0.25)]',
      iconColor: 'text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]',
    },
    { 
      id: 's4-matrix', 
      label: t('nav_s4_matrix', 'S4 Matrix'), 
      desc: t('nav_s4_desc', 'Junior & Senior circular radial matrix'), 
      icon: Layers,
      accentClass: 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_14px_rgba(16,185,129,0.2)]',
      iconColor: 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]',
    },
    { 
      id: 'quantum-nexus', 
      label: t('nav_quantum_nexus', 'Quantum Node'), 
      desc: t('nav_quantum_desc', 'X6 Matrix — $70 Package'), 
      icon: Network,
      accentClass: 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_14px_rgba(6,182,212,0.2)]',
      iconColor: 'text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]',
    },
    { 
      id: 'nexus-prime', 
      label: t('nav_nexus_prime', 'Nexus Prime'), 
      desc: t('nav_nexus_desc', 'X6 Matrix — $120 Package'), 
      icon: Sparkles,
      accentClass: 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_14px_rgba(168,85,247,0.2)]',
      iconColor: 'text-purple-400 drop-shadow-[0_0_6px_rgba(192,132,252,0.5)]',
    },
    { 
      id: 'weekly_reward_starter', 
      label: t('nav_weekly_starter', 'Weekly Reward Starter'), 
      desc: t('nav_starter_desc', 'Weekly Community Reward'), 
      icon: Award,
      accentClass: 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_14px_rgba(16,185,129,0.2)]',
      iconColor: 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]',
    },
    { 
      id: 'weekly_reward_premium', 
      label: t('nav_weekly_premium', 'Weekly Reward Premium'), 
      desc: t('nav_premium_desc', 'Premium Weekly Share Reward'), 
      icon: Diamond,
      accentClass: 'bg-cyan-500/10 border-cyan-500/35 shadow-[0_0_14px_rgba(34,211,238,0.25)]',
      iconColor: 'text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]',
    },
    { 
      id: 'weekly_passive_salary', 
      label: t('nav_weekly_salary', 'Weekly Passive Salary'), 
      desc: t('nav_salary_desc', 'Rank-based progressive weekly salary'), 
      icon: Crown,
      accentClass: 'bg-amber-500/10 border-amber-500/35 shadow-[0_0_14px_rgba(245,158,11,0.25)]',
      iconColor: 'text-amber-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]',
    },
    { 
      id: 'packages', 
      label: t('nav_packages', 'Packages'), 
      desc: t('nav_packages_desc', 'Available package management'), 
      icon: Package,
      accentClass: 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_14px_rgba(16,185,129,0.2)]',
      iconColor: 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]',
    },
    { 
      id: 'income', 
      label: t('nav_income', 'Income'), 
      desc: t('nav_income_desc', 'Earnings breakdown and analytics'), 
      icon: TrendingUp,
      accentClass: 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_14px_rgba(16,185,129,0.2)]',
      iconColor: 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]',
    },
    { 
      id: 'transactions', 
      label: t('nav_transactions', 'Transactions'), 
      desc: t('nav_transactions_desc', 'Transaction history and verified activity'), 
      icon: ArrowLeftRight,
      accentClass: 'bg-teal-500/10 border-teal-500/30 shadow-[0_0_14px_rgba(20,184,166,0.2)]',
      iconColor: 'text-teal-400 drop-shadow-[0_0_6px_rgba(45,212,191,0.5)]',
    },
    { 
      id: 'profile', 
      label: t('nav_profile', 'Profile'), 
      desc: t('nav_profile_desc', 'Account, wallet and preferences'), 
      icon: UserCheck,
      accentClass: 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_14px_rgba(16,185,129,0.2)]',
      iconColor: 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]',
    },
  ];

  const handleSelectPage = (page: NavPage) => {
    onNavigate(page);
    setShowMoreDrawer(false);
  };

  const isMoreActive = [
    's4-matrix',
    'quantum-nexus', 
    'nexus-prime', 
    'weekly_reward_starter',
    'weekly_reward_premium',
    'weekly_passive_salary',
    'packages', 
    'income', 
    'transactions', 
    'profile'
  ].includes(currentPage);

  return (
    <>
      {/* Fixed Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        {/* Very subtle green ambient light behind the navigation */}
        <div className="absolute -top-6 inset-x-6 h-10 bg-emerald-500/15 blur-2xl pointer-events-none rounded-full" />
        <nav className="relative bg-[#060a08]/95 backdrop-blur-2xl border-t border-emerald-500/30 px-3 py-2 flex items-center justify-around shadow-[0_-8px_32px_rgba(0,0,0,0.8),0_-2px_14px_rgba(16,185,129,0.18)] pb-[max(0.6rem,env(safe-area-inset-bottom))]">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectPage(item.id)}
                className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-200 ${
                  isActive ? 'text-emerald-300' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div
                  className={`relative p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-b from-emerald-900/80 to-emerald-950/95 border border-emerald-400/50 shadow-[0_0_16px_rgba(52,211,153,0.35)] animate-nav-pulse'
                      : 'bg-transparent border border-transparent'
                  }`}
                >
                  <Icon
                    className={`transition-transform duration-200 ${
                      isActive ? 'w-5 h-5 text-emerald-300 scale-110 drop-shadow-[0_0_8px_#34d399]' : 'w-5 h-5 text-zinc-400'
                    }`}
                  />
                </div>
                <span
                  className={`text-[11px] mt-0.5 tracking-tight font-medium transition-all ${
                    isActive
                      ? 'font-bold text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]'
                      : 'text-zinc-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setShowMoreDrawer(!showMoreDrawer)}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-200 ${
              isMoreActive || showMoreDrawer ? 'text-emerald-300' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div
              className={`relative p-2 rounded-xl transition-all duration-200 ${
                isMoreActive || showMoreDrawer
                  ? 'bg-gradient-to-b from-emerald-900/80 to-emerald-950/95 border border-emerald-400/50 shadow-[0_0_16px_rgba(52,211,153,0.35)] animate-nav-pulse'
                  : 'bg-transparent border border-transparent'
              }`}
            >
              <MoreHorizontal
                className={`transition-transform duration-200 ${
                  isMoreActive || showMoreDrawer
                    ? 'w-5 h-5 text-emerald-300 scale-110 drop-shadow-[0_0_8px_#34d399]'
                    : 'w-5 h-5 text-zinc-400'
                }`}
              />
            </div>
            <span
              className={`text-[11px] mt-0.5 tracking-tight font-medium transition-all ${
                isMoreActive || showMoreDrawer
                  ? 'font-bold text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]'
                  : 'text-zinc-400'
              }`}
            >
              {t('nav_more', 'More')}
            </span>
          </button>
        </nav>
      </div>

      {/* Slide-up "More" drawer */}
      {showMoreDrawer && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200">
          <div 
            className="absolute inset-0"
            onClick={() => setShowMoreDrawer(false)}
          />
          <div className="relative bg-[#080d0a] border-t border-emerald-500/30 rounded-t-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto z-10">
            <div className="w-12 h-1 bg-zinc-700/80 rounded-full mx-auto mb-4" />
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">{t('mdefi_menu', 'MDefi Menu')}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  {user?.userId || 'MDF-772910'}
                </span>
              </div>
              <button 
                onClick={() => setShowMoreDrawer(false)}
                className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 my-4">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                const routeCheck = programPhaseService.canAccessRoute(item.id);
                const isLocked = !routeCheck.allowed;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPage(item.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 group active:scale-[0.98] touch-manipulation ${
                      isActive 
                        ? 'bg-emerald-950/70 border-emerald-400/60 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] ring-1 ring-emerald-400/30' 
                        : isLocked
                        ? 'bg-zinc-950/70 border-zinc-850 text-zinc-400 hover:border-amber-500/30'
                        : 'bg-zinc-900/60 hover:bg-zinc-900/90 border-zinc-800/80 hover:border-emerald-500/40 text-zinc-300 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(16,185,129,0.12)]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border transition-all duration-200 shrink-0 ${
                        isActive 
                          ? 'bg-emerald-500/25 border-emerald-400/60 text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.4)]' 
                          : isLocked
                          ? 'bg-amber-950/20 border-amber-500/20 text-amber-400'
                          : `${item.accentClass} ${item.iconColor} group-hover:scale-105`
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-sm truncate transition-colors ${
                            isActive ? 'text-emerald-200 font-bold' : 'text-zinc-100 group-hover:text-white'
                          }`}>
                            {item.label}
                          </span>
                          {isLocked && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950/80 border border-amber-500/40 text-amber-400">
                              🔒 P{routeCheck.phaseRequired}
                            </span>
                          )}
                        </div>
                        <div className={`text-xs truncate transition-colors ${
                          isActive ? 'text-emerald-400/80' : 'text-zinc-400 group-hover:text-zinc-300'
                        }`}>
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 transition-all duration-200 shrink-0 ${
                      isActive 
                        ? 'text-emerald-400 translate-x-0.5' 
                        : isLocked
                        ? 'text-zinc-600'
                        : 'text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-0.5'
                    }`} />
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-center text-xs text-zinc-400 font-mono">
              {t('mdefi_protocol_web3_engines', 'MDefi Protocol — Verified Web3 Engines')}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
