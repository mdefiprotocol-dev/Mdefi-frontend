import React from 'react';
import { 
  Clock, 
  Wallet, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  Crown, 
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const WeeklySalaryHero: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#061e1b]/95 via-[#031413]/90 to-zinc-950 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.12)] backdrop-blur-xl">
      {/* Background Ambience & Orbital Animation */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      
      {/* Decorative subtle orbital ring */}
      <div className="absolute top-1/2 right-12 -translate-y-1/2 w-64 h-64 rounded-full border border-emerald-500/10 hidden lg:block pointer-events-none animate-[spin_60s_linear_infinite] motion-reduce:animate-none">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        <span className="absolute bottom-4 right-10 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)]" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Badges Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-semibold shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
            LAUNCHING SOON
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-mono text-zinc-300 bg-zinc-900/90 border border-zinc-700/60 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            Contract-Based Reward Mechanism
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            7-Day (168h) Epoch
          </span>
        </div>

        {/* Titles & Hero Identity */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-emerald-400 font-semibold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>MDeFi Ecosystem Hub • Card 06</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight flex flex-wrap items-center gap-3">
            <span>WEEKLY SALARY</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              PASSIVE INCOME
            </span>
          </h1>

          <p className="text-sm sm:text-base font-medium text-emerald-300/90 tracking-wide">
            Build Your Direct Team. Unlock Weekly Salary. Progress Through Every Rank.
          </p>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
            A structured royalty-style reward system where qualifying Nexus Prime direct activations contribute toward rank qualification and weekly salary rewards. Built on algorithmic smart-contract transparency with continuous progression and cumulative direct-team retention.
          </p>
        </div>

        {/* Micro Telemetry / Disclaimers Pill */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-emerald-500/20 max-w-2xl flex items-start gap-3 text-xs text-zinc-400 font-mono">
          <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong className="text-zinc-200">Protocol Specification:</strong> Actual eligibility and payout depend on contract state, qualifying activations and available funded balance. Figures presented demonstrate the configured illustrative reward schedule.
          </p>
        </div>
      </div>
    </div>
  );
};
