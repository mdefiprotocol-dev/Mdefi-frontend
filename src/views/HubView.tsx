import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { NavPage, UserProfile, RewardBalances } from '../types';
import { MbttcCoin3D } from '../components/MbttcCoin3D';
import { HUB_MODULES, HubModule } from '../data/hubModulesData';
import { HubModuleGrid } from '../components/hub/HubModuleGrid';
import { HubModuleDetail } from '../components/hub/HubModuleDetail';
import { useLanguage } from '../context/LanguageContext';

interface HubViewProps {
  user: UserProfile;
  rewards: RewardBalances;
  onNavigate: (page: NavPage) => void;
  onNavigateS4?: (pkg?: 'junior' | 'senior') => void;
  onNavigateQuantum?: () => void;
  onNavigateNexusPrime?: () => void;
}

export const HubView: React.FC<HubViewProps> = ({
  user,
  rewards,
  onNavigate,
  onNavigateS4,
  onNavigateQuantum,
  onNavigateNexusPrime,
}) => {
  const { t } = useLanguage();
  const [selectedModule, setSelectedModule] = useState<HubModule | null>(null);

  // If a module is selected, transition smoothly into its dedicated detail view
  if (selectedModule) {
    return (
      <div className="pb-28 lg:pb-12 animate-in fade-in duration-300">
        <HubModuleDetail
          module={selectedModule}
          onBack={() => {
            setSelectedModule(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigate={onNavigate}
          onNavigateS4={onNavigateS4}
          onSelectModule={(mod) => {
            setSelectedModule(mod);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-28 lg:pb-12 max-w-7xl mx-auto">
      {/* Return to Overview link */}
      <div>
        <button
          type="button"
          onClick={() => onNavigate('overview')}
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors py-1.5 px-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-500/30 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('back_to_overview', 'Back to Overview')}</span>
        </button>
      </div>

      {/* ── MDeFi ECOSYSTEM HUB HERO SECTION ── */}
      <div className="relative rounded-3xl p-7 sm:p-10 lg:p-12 bg-gradient-to-br from-[#061e14] via-[#04140e] to-[#020b08] border border-emerald-500/35 overflow-hidden backdrop-blur-2xl shadow-[0_0_60px_rgba(16,185,129,0.12)]">
        {/* Subtle mesh & aurora gradients */}
        <div 
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 w-[420px] h-[420px] bg-emerald-500/12 rounded-full blur-[100px]" 
        />
        <div 
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-16 w-80 h-80 bg-teal-500/8 rounded-full blur-[90px]" 
        />
        <div 
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" 
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            {/* Visual Hierarchy Step 1: SMALL LABEL */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)] motion-reduce:animate-none" />
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-emerald-300 uppercase">
                {t('hub_hero_badge', 'MDEFI ECOSYSTEM HUB')}
              </span>
            </div>

            {/* Visual Hierarchy Step 2: MAIN PREMIUM HEADLINE */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-mono leading-[1.15]">
              {t('hub_hero_title', 'Decentralized Smart Wealth, Powered by the MDeFi Ecosystem')}
            </h1>

            {/* Visual Hierarchy Step 3: DESCRIPTION */}
            <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed max-w-2xl">
              {t('hub_hero_desc', 'Explore MBTTC, smart-node infrastructure, community systems, rewards, and the next generation of decentralized financial technology.')}
            </p>

            {/* Protocol Meta Pill */}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-lg bg-zinc-950/70 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('hub_core_modules', '11 Core Modules')}</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-zinc-950/70 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('hub_bep20_arch', 'BEP-20 / Native Architecture')}</span>
              </span>
            </div>
          </div>

          {/* 3D Visual Accent */}
          <div className="hidden lg:flex items-center justify-center shrink-0 pr-4">
            <div className="relative p-2">
              <div 
                aria-hidden="true" 
                className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" 
              />
              <MbttcCoin3D size="xl" interactive={true} autoRotate={true} glow={true} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 11 PREMIUM WEB3 ECOSYSTEM CARDS GRID ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-300 font-mono">
              {t('hub_modules_directory', 'Ecosystem Modules Directory')}
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {t('hub_select_module', 'Select a module to explore')}
          </span>
        </div>

        {/* Responsive Grid: 3 columns desktop, 2 columns tablet, 1 column mobile */}
        <HubModuleGrid
          modules={HUB_MODULES}
          onSelectModule={(mod) => {
            setSelectedModule(mod);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    </div>
  );
};
