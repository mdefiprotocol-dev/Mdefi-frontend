import React from 'react';
import { 
  Zap, 
  Coins, 
  Clock, 
  Crown, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { SALARY_OVERVIEW_CARDS } from '../../../data/weeklySalaryData';

export const WeeklySalaryOverview: React.FC = () => {
  const getCardIcon = (id: string) => {
    switch (id) {
      case 'nexus-prime':
        return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'salary-fund':
        return <Coins className="w-5 h-5 text-teal-300" />;
      case 'claim-cycle':
        return <Clock className="w-5 h-5 text-cyan-400" />;
      case 'max-rank':
        return <Crown className="w-5 h-5 text-emerald-300" />;
      default:
        return <Coins className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Core Protocol Pillars</span>
        </span>
        <span className="text-[11px] font-mono text-zinc-500">
          Nexus Prime System v2.0
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SALARY_OVERVIEW_CARDS.map((card) => (
          <div
            key={card.id}
            className={`group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${card.bgGlow} border ${card.borderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-950/40 backdrop-blur-md flex flex-col justify-between`}
          >
            {/* Ambient light streak */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/5 rounded-full blur-2xl group-hover:bg-emerald-400/10 transition-colors pointer-events-none" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                  {getCardIcon(card.id)}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-950/60 text-zinc-400 border border-zinc-800">
                  {card.title}
                </span>
              </div>

              <div>
                <div className="text-2xl font-black font-mono tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  {card.value}
                </div>
                <div className={`text-xs font-mono font-medium ${card.accent} mt-0.5`}>
                  {card.subtitle}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed mt-4 pt-3 border-t border-zinc-800/60 font-sans">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
