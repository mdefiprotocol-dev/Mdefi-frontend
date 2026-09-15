import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, ArrowRight, Share2, Sparkles, ChevronRight, Play, RotateCcw } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const StarterQualificationShares: React.FC = () => {
  const [directsCount, setDirectsCount] = useState(2);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Animated counter progression: 00 -> 01 -> 02 -> 03 -> 04 -> 05...
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setDirectsCount((prev) => (prev >= 6 ? 0 : prev + 1));
    }, 2400);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const sharesCount = directsCount >= 2 ? directsCount : 0;
  const isQualified = directsCount >= 2;

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="team" theme="amber" size="md" />
        <div>
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest">
            Section 02 • Share Logic
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            QUALIFICATION &amp; SHARE SYSTEM
          </h2>
        </div>
      </div>

      {/* Large Visual Pipeline: 2 DIRECT ACTIVATIONS ↓ 2 SHARES ↓ QUALIFIED */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 via-zinc-900/60 to-emerald-950/30 border border-amber-500/30 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 font-mono font-black">
          <div className="px-4 py-2.5 rounded-xl bg-black/60 border border-amber-400/40 text-amber-300 text-sm sm:text-base shadow-sm">
            2 DIRECT ACTIVATIONS
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-500 hidden sm:block" />
          <div className="w-5 h-5 text-zinc-500 sm:hidden">↓</div>
          <div className="px-4 py-2.5 rounded-xl bg-black/60 border border-cyan-400/40 text-cyan-300 text-sm sm:text-base shadow-sm">
            2 SHARES
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-500 hidden sm:block" />
          <div className="w-5 h-5 text-zinc-500 sm:hidden">↓</div>
          <div className="px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-400/60 text-emerald-300 text-sm sm:text-base shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>QUALIFIED</span>
          </div>
        </div>
      </div>

      {/* Core Rules Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
          <span className="text-amber-400 font-mono font-bold text-xs block">
            Minimum Qualification Threshold
          </span>
          <p>
            To participate in the Weekly Reward Starter distribution, a user must generate at least 2 new eligible direct partner activations during the current 7-day cycle.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
          <span className="text-cyan-400 font-mono font-bold text-xs block">
            Share Parity Mechanism
          </span>
          <p>
            Each eligible direct activation represents one share. After the minimum 2-direct qualification is reached, every additional eligible direct activation adds one additional share.
          </p>
        </div>
      </div>

      {/* Animated Counter Simulator: DIRECTS 00 -> 01 -> 02 -> 03 -> 04 -> 05... */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#080e0a] border border-emerald-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Live Share Accumulation Simulator
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Play className={`w-3 h-3 ${isAutoPlaying ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <span>{isAutoPlaying ? 'Auto Cycling' : 'Paused'}</span>
            </button>
            <button
              type="button"
              onClick={() => { setDirectsCount(0); setIsAutoPlaying(false); }}
              className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Counter Display Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="p-4 rounded-xl bg-black/70 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                Direct Activations
              </span>
              <span className="text-3xl sm:text-4xl font-black font-mono text-amber-300">
                {directsCount.toString().padStart(2, '0')}
              </span>
            </div>
            <Users className="w-8 h-8 text-amber-500/40" />
          </div>

          <div className="p-4 rounded-xl bg-black/70 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                Earned Shares
              </span>
              <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-300">
                {sharesCount.toString().padStart(2, '0')}
              </span>
            </div>
            <Share2 className="w-8 h-8 text-cyan-500/40" />
          </div>
        </div>

        {/* Status Indicator banner */}
        <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
          isQualified
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
        }`}>
          <div className="flex items-center gap-2">
            {isQualified ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-dashed border-zinc-500" />
            )}
            <span>
              {isQualified
                ? `Qualification Met! You hold ${sharesCount} share${sharesCount > 1 ? 's' : ''} for the active cycle.`
                : `Needs ${2 - directsCount} more direct activation${2 - directsCount > 1 ? 's' : ''} to qualify.`}
            </span>
          </div>
          <span className="font-bold text-[10px] uppercase tracking-wider">
            {isQualified ? 'ELIGIBLE FOR PAYOUT' : 'NOT QUALIFIED'}
          </span>
        </div>
      </div>

      {/* Share Schedule Grid (2 Directs to 6 Directs) */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
          Qualification &amp; Share Progression Schedule
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center font-mono">
          {[
            { directs: 2, shares: 2, label: 'Minimum' },
            { directs: 3, shares: 3, label: '+1 Share' },
            { directs: 4, shares: 4, label: '+2 Shares' },
            { directs: 5, shares: 5, label: '+3 Shares' },
            { directs: 6, shares: 6, label: '+4 Shares' },
          ].map((item) => (
            <div
              key={item.directs}
              onClick={() => { setDirectsCount(item.directs); setIsAutoPlaying(false); }}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                directsCount === item.directs
                  ? 'bg-amber-950/60 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/40'
                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <span className="text-[10px] text-zinc-400 block">{item.label}</span>
              <span className="text-xs font-bold text-white block mt-0.5">
                {item.directs} Directs
              </span>
              <span className="text-xs font-black text-cyan-300 block mt-1">
                = {item.shares} Shares
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
