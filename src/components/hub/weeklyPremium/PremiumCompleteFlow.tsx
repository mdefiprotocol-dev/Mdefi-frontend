import React from 'react';
import { 
  Diamond, 
  Coins, 
  Users, 
  Share2, 
  Clock, 
  PieChart, 
  DollarSign, 
  Wallet,
  ArrowRight
} from 'lucide-react';
import { WeeklyRewardAnimatedIcon } from '../common/WeeklyRewardAnimatedIcon';

export const PremiumCompleteFlow: React.FC = () => {
  const steps = [
    { num: '01', title: 'Quantum Node', sub: '$70 Package Activated', icon: Diamond, color: 'border-purple-500/40 text-purple-300' },
    { num: '02', title: '$8 Contribution', sub: 'Routed to Premium Pool', icon: Coins, color: 'border-cyan-500/40 text-cyan-300' },
    { num: '03', title: 'Premium Pool', sub: 'Decentralized Vault', icon: Coins, color: 'border-cyan-500/40 text-cyan-300' },
    { num: '04', title: '3 Directs Rule', sub: 'Qualification Benchmark', icon: Users, color: 'border-purple-500/40 text-purple-300' },
    { num: '05', title: 'Shares Allocated', sub: '3+ Shares Calculated', icon: Share2, color: 'border-purple-500/40 text-purple-300' },
    { num: '06', title: '7-Day Close', sub: 'Snapshot Epoch', icon: Clock, color: 'border-purple-500/40 text-purple-300' },
    { num: '07', title: 'Share Payout', sub: 'Proportional Model', icon: PieChart, color: 'border-emerald-500/40 text-emerald-300' },
    { num: '08', title: 'USDT Reward', sub: 'Leader Distribution', icon: DollarSign, color: 'border-emerald-500/40 text-emerald-300' },
    { num: '09', title: 'Claim Flow', sub: 'With MBTTC Fee', icon: Coins, color: 'border-emerald-400/60 text-emerald-300' },
    { num: '10', title: 'User Wallet', sub: 'Settled to Web3 Address', icon: Wallet, color: 'border-purple-300 text-white font-black' },
  ];

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80">
        <WeeklyRewardAnimatedIcon type="distribution" theme="purple" size="md" />
        <div>
          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
            Section 08 • Complete Working Flow
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            QUANTUM REWARD PIPELINE
          </h2>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
        Follow the complete protocol journey from Quantum package activation to final on-chain wallet settlement.
      </p>

      {/* Grid of Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className={`p-4 rounded-2xl bg-[#07040e] border ${s.color} shadow-md flex flex-col justify-between relative group hover:scale-[1.03] transition-transform`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-zinc-400">
                  STEP {s.num}
                </span>
                <Icon className="w-4 h-4 opacity-80" />
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold text-white tracking-tight">
                  {s.title}
                </h4>
                <p className="text-[10px] text-zinc-400 font-sans mt-0.5">
                  {s.sub}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-20">
                  <span className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[8px] text-zinc-500">
                    →
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
