import React from 'react';
import { Award, ArrowRight, CheckCircle2, ChevronRight, Shield, Zap } from 'lucide-react';
import { AiProtocolGuide } from '../common/AiProtocolGuide';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

interface StarterHeroProps {
  onOpenLiveDashboard?: () => void;
}

export const StarterHero: React.FC<StarterHeroProps> = ({ onOpenLiveDashboard }) => {
  return (
    <div className="space-y-6">
      {/* Primary Hero Card */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-b from-[#141004]/95 via-[#0b0a03]/90 to-[#050401]/95 border border-amber-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        {/* Ambient background corner glow */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl bg-amber-500/15" 
        />
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl bg-emerald-500/10" 
        />
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" 
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-5">
            {/* Status & Plan Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                </span>
                <span>WEEKLY REWARD STARTER PLAN</span>
              </span>

              <span className="text-xs font-mono px-3 py-1 rounded-full bg-black/60 border border-zinc-800 text-zinc-400">
                S4 Senior Node ($25)
              </span>

              <span className="text-xs font-mono text-emerald-400/90 font-medium">
                7-Day Settlement Cycle
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-mono">
                WEEKLY REWARD <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200">STARTER</span>
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans max-w-xl">
                Build your direct team, earn shares, and participate in the weekly reward pool.
              </p>
            </div>

            {/* Hero Detailed Explanation */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                The Weekly Reward Starter Plan is a weekly share-based reward pool designed for users who build their direct team through S4 Senior Node activations.
              </p>
            </div>

            {/* Step Pipeline Graphic: DIRECT TEAM ↓ SHARES ↓ WEEKLY POOL ↓ PROPORTIONAL DISTRIBUTION ↓ USDT REWARD */}
            <div className="pt-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-semibold">
                Reward Architecture Pipeline
              </span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] font-mono font-bold">
                <span className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-300">
                  DIRECT TEAM
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <span className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-300">
                  SHARES
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <span className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-cyan-500/30 text-cyan-300">
                  WEEKLY POOL
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <span className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-emerald-500/30 text-emerald-300">
                  PROPORTIONAL DISTRIBUTION
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                <span className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                  USDT REWARD
                </span>
              </div>
            </div>

            {/* Quick CTAs */}
            {onOpenLiveDashboard && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenLiveDashboard}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-mono font-extrabold text-xs tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Award className="w-4 h-4 text-black" />
                  <span>Open Live Starter Claim Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: AI MDeFi Protocol Guide (Desktop side, Mobile stacked) */}
          <div className="lg:col-span-5">
            <AiProtocolGuide
              variant="hero"
              themeColor="amber"
              tipTitle="HOW IT WORKS"
              tipMessage="The Starter pool requires 2 direct S4 Senior Node activations to qualify. Every additional direct activation adds an extra share, proportionally increasing your distribution weight."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
