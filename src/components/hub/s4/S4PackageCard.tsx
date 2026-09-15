import React from 'react';
import { ShieldCheck, Zap, Layers, Award, Coins, ArrowRight } from 'lucide-react';

interface S4PackageCardProps {
  packageId: 1 | 2;
  title: string;
  priceUSD: number;
  badge: string;
  directIncome: number;
  matrixIncome: number;
  mbttcLiquidity: number;
  adminFee: number;
  rewardFund?: number;
  requiresJunior?: boolean;
  onActivateOrView?: () => void;
}

export const S4PackageCard: React.FC<S4PackageCardProps> = ({
  packageId,
  title,
  priceUSD,
  badge,
  directIncome,
  matrixIncome,
  mbttcLiquidity,
  adminFee,
  rewardFund,
  requiresJunior = false,
  onActivateOrView,
}) => {
  const isJunior = packageId === 1;

  return (
    <div
      className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden
        bg-gradient-to-b ${isJunior ? 'from-[#051c19]/95 via-[#031311]/90 to-[#020b0a]/95' : 'from-[#051a26]/95 via-[#03111c]/90 to-[#020a12]/95'}
        border ${isJunior ? 'border-teal-500/35 hover:border-teal-400/60' : 'border-cyan-500/35 hover:border-cyan-400/60'}
        shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_44px_rgba(0,0,0,0.8)]
        transition-all duration-300 backdrop-blur-xl group
      `}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl ${
          isJunior ? 'bg-teal-500/15' : 'bg-cyan-500/15'
        } group-hover:scale-125 transition-transform duration-500`}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-inner ${
                isJunior
                  ? 'bg-teal-950/80 border-teal-500/50 text-teal-300'
                  : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
              }`}
            >
              {isJunior ? <Zap className="w-5 h-5" /> : <Award className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 block font-semibold">
                PACKAGE ID: {packageId}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white font-mono tracking-tight">
                {title}
              </h3>
            </div>
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border uppercase tracking-wider ${
              isJunior
                ? 'bg-teal-950 text-teal-300 border-teal-500/40'
                : 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
            }`}
          >
            {badge}
          </span>
        </div>

        {/* Price display */}
        <div className="mb-6 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 font-mono block">Package Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                ${priceUSD}
              </span>
              <span className="text-xs font-mono font-semibold text-zinc-400">USDT</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-500 block">Matrix Type</span>
            <span className="text-xs font-mono font-bold text-emerald-400">2×2 Matrix (6 Slots)</span>
          </div>
        </div>

        {/* Package Allocation Breakdown */}
        <div className="space-y-2 mb-6">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
            On-Chain Package Allocation:
          </span>

          <div className="space-y-2 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 p-3.5 text-xs font-mono">
            <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Direct Referral Income
              </span>
              <span className="font-bold text-emerald-400">${directIncome} USDT</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Matrix Income Allocation
              </span>
              <span className="font-bold text-cyan-400">${matrixIncome} USDT</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                MBTTC Token Liquidity
              </span>
              <span className="font-bold text-amber-300">${mbttcLiquidity} USDT</span>
            </div>

            {rewardFund !== undefined && (
              <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Weekly Reward Fund
                </span>
                <span className="font-bold text-purple-300">${rewardFund} USDT</span>
              </div>
            )}

            <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
              <span className="text-zinc-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                Platform / Admin Fee
              </span>
              <span className="font-bold text-zinc-300">${adminFee} USDT</span>
            </div>

            {/* Total formula verification */}
            <div className="flex items-center justify-between pt-1.5 text-[11px] font-bold text-white">
              <span className="text-zinc-400">Total Verification</span>
              <span className="font-mono text-emerald-300">
                {isJunior
                  ? `$${directIncome} + $${matrixIncome} + $${mbttcLiquidity} + $${adminFee} = $${priceUSD}`
                  : `$${directIncome} + $${matrixIncome} + $${mbttcLiquidity} + $${rewardFund} + $${adminFee} = $${priceUSD}`}
              </span>
            </div>
          </div>
        </div>

        {/* Condition note */}
        {requiresJunior && (
          <div className="mb-4 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Requires active S4 Junior Node ($10) activation as prerequisite.</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      {onActivateOrView && (
        <button
          type="button"
          onClick={onActivateOrView}
          className={`w-full py-3 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isJunior
              ? 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40'
              : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
          }`}
        >
          <span>View Matrix Tree &amp; Activation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
