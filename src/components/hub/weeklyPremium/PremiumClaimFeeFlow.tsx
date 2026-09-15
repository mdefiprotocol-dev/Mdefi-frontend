import React from 'react';
import { Flame, Layers, Wallet, ChevronRight, ArrowDown } from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';
import { MBTTC_TOKEN_INFO } from '../../../data/mbttcTokenInfo';

export const PremiumClaimFeeFlow: React.FC = () => {
  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="fee-burn" theme="purple" size="md" />
        <div>
          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
            Section 07 • Claim &amp; Ecosystem Impact
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            REWARD CLAIM &amp; MBTTC ECOSYSTEM
          </h2>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
        Once the weekly reward becomes claimable, the user can claim the eligible USDT reward through the existing dashboard claim flow.
      </p>

      {/* Claim Pipeline: WEEKLY CYCLE CLOSED ↓ REWARD AVAILABLE ↓ CLAIM ↓ MBTTC FEE ↓ USDT ↓ USER WALLET */}
      <div className="p-5 rounded-2xl bg-[#090510] border border-purple-500/30 space-y-3">
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold text-center sm:text-left">
          Premium Claim Flow
        </span>

        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-center">
          <span className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300">
            WEEKLY CYCLE CLOSED
          </span>
          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="px-3 py-2 rounded-xl bg-cyan-950 border border-cyan-400/40 text-cyan-300 font-bold">
            REWARD AVAILABLE
          </span>
          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="px-3 py-2 rounded-xl bg-purple-950 border border-purple-400/40 text-purple-300 font-bold">
            CLAIM
          </span>
          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="px-3 py-2 rounded-xl bg-amber-950 border border-amber-400/40 text-amber-300 font-bold">
            MBTTC FEE
          </span>
          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-400/60 text-emerald-300 font-bold">
            USDT REWARD
          </span>
          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="px-3 py-2 rounded-xl bg-purple-900/90 border border-purple-300 text-white font-black shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            USER WALLET
          </span>
        </div>
      </div>

      {/* Two-Way Animated Fee Split */}
      <div className="rounded-2xl p-6 bg-gradient-to-b from-zinc-900/90 to-black border border-orange-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              MBTTC Fee Allocation (50% Burn / 50% Staking Hub)
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">On-Chain Protocol Logic</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 50% Burn */}
          <div className="p-4 rounded-xl bg-black/60 border border-orange-500/40 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-orange-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                50% OF MBTTC FEE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950 border border-orange-500/40 text-orange-300">
                BURN
              </span>
            </div>
            <h4 className="text-sm font-mono font-bold text-white">
              Permanent Burn Address
            </h4>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Permanently incinerated at the dead address, locking out circulating supply.
            </p>
            <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-500 break-all">
              Burn: <span className="text-zinc-400">{MBTTC_TOKEN_INFO.burnAddress}</span>
            </div>
          </div>

          {/* 50% Staking Hub */}
          <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/40 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                50% OF MBTTC FEE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                COMMUNITY YIELD
              </span>
            </div>
            <h4 className="text-sm font-mono font-bold text-white">
              Staking Hub Allocation
            </h4>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Directly supplies staking reserves to maintain continuous reward yields.
            </p>
            <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-500 break-all">
              Hub: <span className="text-zinc-400">{MBTTC_TOKEN_INFO.hubAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
