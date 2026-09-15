import React from 'react';
import { 
  ArrowRight, 
  ArrowDown, 
  ShieldCheck, 
  Coins, 
  Zap, 
  Clock, 
  Award, 
  Users, 
  Sparkles,
  Layers,
  CheckCircle2,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { SALARY_WORKFLOW_NODES } from '../../../data/weeklySalaryData';

export const SalaryFlow: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* ── SECTION 4: HOW WEEKLY SALARY WORKS (8-STAGE WEB3 PIPELINE) ── */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
              Execution Architecture
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>HOW WEEKLY SALARY WORKS</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
            8-Stage On-Chain Cycle
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
          The Weekly Salary protocol operates continuously on-chain. Qualifying direct activations increment your direct partner metric, qualifying your account for weekly salary disbursements calculated in 7-day (168-hour) epochs.
        </p>

        {/* 8-Stage Flow Visualization Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SALARY_WORKFLOW_NODES.map((node, index) => (
            <div
              key={node.id}
              className="relative p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-emerald-500/40 transition-all duration-300 space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  STAGE 0{node.id}
                </span>
                {index < SALARY_WORKFLOW_NODES.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all hidden lg:block" />
                )}
              </div>

              <div className="text-xs font-mono font-bold text-white group-hover:text-emerald-300 transition-colors">
                {node.label}
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {node.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Linear Path Flow Chart for Mobile & Desktop */}
        <div className="p-4 rounded-2xl bg-zinc-950/90 border border-emerald-500/20 overflow-x-auto">
          <div className="flex items-center min-w-max gap-2 text-xs font-mono text-center justify-between">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold">
              NEXUS PRIME $120
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 font-semibold">
              DIRECT ACTIVATION
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="px-3 py-1.5 rounded-lg bg-teal-950/60 border border-teal-500/30 text-teal-300 font-bold">
              DIRECT COUNT +1
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 font-semibold">
              RANK QUALIFIED
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold">
              7-DAY CYCLE
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold">
              ELIGIBLE SALARY
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 font-semibold">
              CLAIM REWARD
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-400/40 text-emerald-200 font-bold">
              NEXT RANK PROGRESS
            </span>
          </div>
        </div>
      </div>

      {/* ── SECTION 11 & 12: $30 SALARY POOL CONTRIBUTION & CONTRACT-BASED REWARD FLOW ── */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-teal-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-semibold block">
              Funding Architecture
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Coins className="w-5 h-5 text-teal-400" />
              <span>SALARY POOL CONTRIBUTION &amp; REWARD FLOW</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-teal-300 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30 font-bold">
            $30 / $120 (25.00% Allocation)
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
          For each qualifying <strong className="text-emerald-400">$120 Nexus Prime</strong> activation, the configured protocol allocation automatically routes <strong className="text-teal-300">$30.00 USDT (25%)</strong> into the dedicated Weekly Salary liquidity vault.
        </p>

        {/* Money Flow Visual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-emerald-500/30 space-y-2 text-center flex flex-col justify-between">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Package Activation</span>
            <div className="text-2xl font-black text-white">$120.00</div>
            <span className="text-emerald-400 font-semibold text-xs">Nexus Prime Activation</span>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-[11px] font-mono text-teal-300 font-semibold mb-1">
              Automated Protocol Split (25%)
            </span>
            <div className="w-full flex items-center justify-center gap-2">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
              <ArrowRight className="w-4 h-4 text-teal-400" />
              <div className="h-0.5 flex-1 bg-gradient-to-r from-teal-400 to-cyan-500" />
            </div>
            <span className="text-[10px] text-zinc-500 mt-1">Smart Contract Enforced</span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-teal-500/30 space-y-2 text-center flex flex-col justify-between">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Weekly Salary Pool</span>
            <div className="text-2xl font-black text-teal-300">$30.00</div>
            <span className="text-teal-400 font-semibold text-xs">Direct Allocation Inflow</span>
          </div>
        </div>

        {/* Contract-Based Reward Flow Pipeline */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-4">
          <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider font-bold block">
            End-to-End Reward Disbursement Pipeline
          </span>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono text-center">
            <span className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-semibold">
              QUALIFYING ACTIVATION
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="px-3 py-2 rounded-xl bg-teal-950/80 border border-teal-500/30 text-teal-300 font-semibold">
              SALARY ALLOCATION ($30)
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 font-semibold">
              RANK ELIGIBILITY
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="px-3 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-semibold">
              7-DAY CYCLE
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-semibold">
              CLAIM ELIGIBILITY
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="px-3 py-2 rounded-xl bg-emerald-900 border border-emerald-400 text-white font-bold">
              USDT PAYOUT
            </span>
          </div>
        </div>

        {/* Security & Eligibility Notice */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong className="text-zinc-200">Contract Invariant:</strong> Actual reward eligibility and payout depend on contract state, qualifying activity and available funded balance. The contract strictly executes algorithmic allocations without custodial discretion.
          </p>
        </div>
      </div>
    </div>
  );
};
