import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export const WeeklySalaryDisclaimer: React.FC = () => {
  return (
    <div className="rounded-2xl p-5 bg-zinc-950/80 border border-zinc-800 text-zinc-400 text-xs space-y-3 font-mono">
      <div className="flex items-center gap-2 text-zinc-300 font-bold uppercase text-[11px] tracking-wider">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Protocol Terms &amp; Regulatory Disclosure</span>
      </div>

      <p className="text-[11px] leading-relaxed text-zinc-400">
        Illustrative information is based on the configured Weekly Salary schedule. Actual eligibility, timing and payout depend on qualifying activity, smart-contract state and available funded balance. This information does not constitute a guarantee of profit or financial advice.
      </p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/80">
        <span>• Contract-Based Reward Mechanism</span>
        <span>• 7-Day / 168-Hour Claim Cadence</span>
        <span>• Non-Custodial USDT Protocol Inflow</span>
        <span>• Multi-Tier Rank Qualification</span>
      </div>
    </div>
  );
};
