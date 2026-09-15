import React from 'react';
import { Diamond, ArrowRight, CheckCircle2, ChevronRight, Zap, Shield, Sparkles } from 'lucide-react';
import { AiProtocolGuide } from '../common/AiProtocolGuide';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

interface PremiumHeroProps {
  onOpenLiveDashboard?: () => void;
}

export const PremiumHero: React.FC<PremiumHeroProps> = ({ onOpenLiveDashboard }) => {
  return (
    <div className="space-y-6">
      {/* Primary Hero Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-b from-[#160a22]/95 via-[#0e0517]/90 to-[#06020c]/95 border border-purple-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        {/* Ambient background corner glow */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl bg-purple-500/15" 
        />
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl bg-cyan-500/10" 
        />
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" 
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-5">
            {/* Status & Plan Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400" />
                </span>
                <span>PREMIUM WEEKLY REWARD</span>
              </span>

              <span className="text-xs font-mono px-3 py-1 rounded-full bg-black/60 border border-zinc-800 text-zinc-400">
                Quantum Package ($70)
              </span>

              <span className="text-xs font-mono text-cyan-400/90 font-medium">
                $8 USDT Pool Contribution
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-mono">
                WEEKLY REWARD <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-300">PREMIUM</span>
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans max-w-xl">
                An advanced weekly share-based reward system for active Quantum Node leaders.
              </p>
            </div>

            {/* Hero Detailed Explanation */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Whenever a leader activates the $70 Quantum Package, the configured $8 USDT contribution is routed directly to the Weekly Reward Premium pool for proportional weekly share distribution.
              </p>
            </div>

            {/* Step Pipeline Graphic: QUANTUM NODE $70 ↓ $8 USDT POOL CONTRIBUTION ↓ WEEKLY REWARD POOL ↓ QUALIFIED LEADERS ↓ SHARE-BASED DISTRIBUTION */}
            <div className="pt-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-semibold">
                Quantum Liquidity Routing Pipeline
              </span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] font-mono font-bold">
                <span className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-purple-500/30 text-purple-300">
                  QUANTUM NODE $70
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <span className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-cyan-500/30 text-cyan-300">
                  $8 USDT POOL CONTRIBUTION
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <span className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-purple-500/30 text-purple-300">
                  WEEKLY REWARD POOL
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <span className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-emerald-500/30 text-emerald-300">
                  QUALIFIED LEADERS
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <span className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  SHARE-BASED DISTRIBUTION
                </span>
              </div>
            </div>

            {/* Quick CTAs */}
            {onOpenLiveDashboard && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenLiveDashboard}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-500 hover:from-purple-400 hover:to-fuchsia-300 text-black font-mono font-extrabold text-xs tracking-wide shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Diamond className="w-4 h-4 text-black" />
                  <span>Open Live Premium Claim Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: AI MDeFi Protocol Guide */}
          <div className="lg:col-span-5">
            <AiProtocolGuide
              variant="hero"
              themeColor="purple"
              tipTitle="LEADER TIER DYNAMICS"
              tipMessage="The Premium pool is funded exclusively by $8 USDT contributions from every $70 Quantum Node activation. Qualification requires 3 direct Quantum partner activations within the 7-day cycle."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
