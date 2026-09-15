import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Compass, 
  Award,
  Clock,
  Wallet,
  Users,
  Layers
} from 'lucide-react';
import { SALARY_USER_JOURNEY } from '../../../data/weeklySalaryData';

export const WeeklySalaryUserJourney: React.FC = () => {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 1:
        return <Users className="w-4 h-4 text-emerald-400" />;
      case 2:
        return <Award className="w-4 h-4 text-amber-400" />;
      case 3:
        return <Clock className="w-4 h-4 text-cyan-400" />;
      case 4:
        return <Wallet className="w-4 h-4 text-emerald-300" />;
      case 5:
        return <TrendingUp className="w-4 h-4 text-teal-400" />;
      case 6:
        return <Layers className="w-4 h-4 text-indigo-400" />;
      case 7:
        return <Award className="w-4 h-4 text-emerald-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
            End-To-End Experience
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <span>USER JOURNEY &amp; MILESTONES</span>
          </h2>
        </div>
        <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
          8 Sequential Steps
        </span>
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
        Follow the systematic path from your initial qualifying activation through direct team expansion, epoch countdowns, rewards claims, and apex rank achievement.
      </p>

      {/* 8-Step Interactive Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SALARY_USER_JOURNEY.map((item, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-emerald-500/40 transition-all duration-300 space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                {item.step}
              </span>
              <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-emerald-400 transition-colors">
                {getStepIcon(index)}
              </div>
            </div>

            <h4 className="text-xs font-mono font-bold text-white group-hover:text-emerald-300 transition-colors">
              {item.title}
            </h4>

            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
