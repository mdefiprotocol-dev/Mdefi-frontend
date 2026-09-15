import React from 'react';
import { 
  Award, 
  Diamond, 
  Users, 
  Clock, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  Layers,
  Sparkles
} from 'lucide-react';

interface WeeklyComparisonSectionProps {
  currentModule?: 'starter' | 'premium';
  onNavigateToOther?: () => void;
}

export const WeeklyComparisonSection: React.FC<WeeklyComparisonSectionProps> = ({
  currentModule = 'starter',
  onNavigateToOther,
}) => {
  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#060e0a] to-[#020504] border border-emerald-500/25 shadow-2xl relative overflow-hidden space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
              Protocol Comparison
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
            Weekly Reward Systems Comparison
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Understand the architectural differences between the Starter and Premium weekly pools.
          </p>
        </div>

        {onNavigateToOther && (
          <button
            type="button"
            onClick={onNavigateToOther}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-xs font-mono font-bold text-emerald-300 border border-emerald-500/30 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
          >
            <span>View {currentModule === 'starter' ? 'Weekly Premium' : 'Weekly Starter'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        )}
      </div>

      {/* Comparison Grid Cards (Starter vs Premium) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* STARTER SYSTEM */}
        <div className={`relative rounded-2xl p-5 sm:p-6 border transition-all ${
          currentModule === 'starter'
            ? 'bg-gradient-to-br from-amber-950/40 via-yellow-950/20 to-black border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/30'
            : 'bg-zinc-950/80 border-zinc-800/90 opacity-90 hover:opacity-100'
        }`}>
          {currentModule === 'starter' && (
            <span className="absolute top-4 right-4 text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-black shadow-sm">
              CURRENTLY VIEWING
            </span>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Tier 01 Pool</span>
              <h4 className="text-base font-bold text-white font-mono">Weekly Reward Starter</h4>
            </div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
              <span className="text-zinc-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Target Package
              </span>
              <span className="text-white font-bold">S4 Senior Node ($25)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
              <span className="text-zinc-400 flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Minimum Directs
              </span>
              <span className="text-amber-300 font-bold">2 Direct Activations</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
              <span className="text-zinc-400 flex items-center gap-2">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Minimum Shares
              </span>
              <span className="text-white font-bold">2 Shares</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
              <span className="text-zinc-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Additional Scaling
              </span>
              <span className="text-emerald-300 font-bold">+1 Share / Extra Direct</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
              <span className="text-zinc-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Cycle Period
              </span>
              <span className="text-white font-bold">7-Day Settlement</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
              <span className="text-zinc-400 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                Distribution Model
              </span>
              <span className="text-cyan-300 font-bold">Share-Based Pool</span>
            </div>
          </div>
        </div>

        {/* PREMIUM SYSTEM */}
        <div className={`relative rounded-2xl p-5 sm:p-6 border transition-all ${
          currentModule === 'premium'
            ? 'bg-gradient-to-br from-purple-950/40 via-fuchsia-950/20 to-black border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.15)] ring-1 ring-purple-400/30'
            : 'bg-zinc-950/80 border-zinc-800/90 opacity-90 hover:opacity-100'
        }`}>
          {currentModule === 'premium' && (
            <span className="absolute top-4 right-4 text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-400 text-black shadow-sm">
              CURRENTLY VIEWING
            </span>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md">
              <Diamond className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Leader Tier Pool</span>
              <h4 className="text-base font-bold text-white font-mono">Weekly Reward Premium</h4>
            </div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
              <span className="text-zinc-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                Target Package
              </span>
              <span className="text-white font-bold">Quantum Package ($70)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
              <span className="text-zinc-400 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                Fixed Contribution
              </span>
              <span className="text-cyan-300 font-bold">$8 USDT / Activation</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
              <span className="text-zinc-400 flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                Minimum Directs
              </span>
              <span className="text-purple-300 font-bold">3 Direct Activations</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
              <span className="text-zinc-400 flex items-center gap-2">
                <Coins className="w-3.5 h-3.5 text-purple-400" />
                Minimum Shares
              </span>
              <span className="text-white font-bold">3 Shares</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
              <span className="text-zinc-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Additional Scaling
              </span>
              <span className="text-emerald-300 font-bold">+1 Share / Extra Direct</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-white/5">
              <span className="text-zinc-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Cycle Period
              </span>
              <span className="text-white font-bold">7-Day Settlement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
