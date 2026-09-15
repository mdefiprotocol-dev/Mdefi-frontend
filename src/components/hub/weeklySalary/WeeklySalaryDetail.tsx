import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Crown, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { NavPage } from '../../../types';
import { WeeklySalaryHero } from './WeeklySalaryHero';
import { WeeklySalaryOverview } from './WeeklySalaryOverview';
import { SalaryFlow } from './SalaryFlow';
import { DirectTeamProgress } from './DirectTeamProgress';
import { RankCards } from './RankCards';
import { HowTotalRewardCalculated } from './HowTotalRewardCalculated';
import { RankProgressionLogic } from './RankProgressionLogic';
import { WeeklyClaimCycle } from './WeeklyClaimCycle';
import { WeeklySalaryUserJourney } from './WeeklySalaryUserJourney';
import { UserSalaryStats } from './UserSalaryStats';
import { WeeklySalaryDisclaimer } from './WeeklySalaryDisclaimer';

interface WeeklySalaryDetailProps {
  onBack: () => void;
  onNavigate?: (page: NavPage) => void;
}

export const WeeklySalaryDetail: React.FC<WeeklySalaryDetailProps> = ({
  onBack,
  onNavigate,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300 pb-16">
      {/* ── 1. TOP ACTION BAR: [← Back to MDeFi Hub] ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 hover:border-emerald-500/40 text-xs font-mono font-medium transition-all shadow-md group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-emerald-400" />
          <span>Back to MDeFi Hub</span>
        </button>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('weekly_passive_salary')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all shadow-sm group cursor-pointer"
          >
            <Crown className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Open Weekly Passive Salary</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>
        )}
      </div>

      {/* ── 2. HERO SECTION (Title, Subtitle, Badges, Visual Identity) ── */}
      <WeeklySalaryHero />

      {/* ── 3. QUICK OVERVIEW (4 Cards: Nexus Prime $120, Salary Fund $30, Claim Cycle 7 Days, Max Rank 1000 Directs) ── */}
      <WeeklySalaryOverview />

      {/* ── 4. HOW WEEKLY SALARY WORKS & $30 FUNDING FLOW (Sections 4, 11, 12) ── */}
      <SalaryFlow />

      {/* ── 5. BUILD YOUR DIRECT TEAM (Section 5: 1 Direct = 1 Count, 10 to 1,000 path) ── */}
      <DirectTeamProgress />

      {/* ── 6. RANK PROGRESSION CARDS (Section 6 & 13: 7 Ranks Bronze to Crown Diamond) ── */}
      <RankCards onNavigateToSalary={onNavigate ? () => onNavigate('weekly_passive_salary') : undefined} />

      {/* ── 6B. HOW TOTAL REWARD IS CALCULATED (Weekly Salary × Maximum Weeks = Total Potential Earnings) ── */}
      <HowTotalRewardCalculated />

      {/* ── 7. RANK PROGRESSION LOGIC (Section 7 & 10: Your Team Keeps Growing, Keep Your Progress) ── */}
      <RankProgressionLogic />

      {/* ── 8. 7-DAY WEEKLY CLAIM CYCLE & SALARY ACCUMULATION (Section 8 & 9) ── */}
      <WeeklyClaimCycle />

      {/* ── 9. USER JOURNEY (Section 14: 8 Interactive Milestone Nodes) ── */}
      <WeeklySalaryUserJourney />

      {/* ── 10. LIVE USER INFORMATION / CONTRACT TELEMETRY (Section 15) ── */}
      <UserSalaryStats onNavigate={onNavigate} />

      {/* ── 11. PROFESSIONAL DISCLAIMER & REGULATORY DISCLOSURE (Section 21 & 22) ── */}
      <WeeklySalaryDisclaimer />

      {/* ── 12. BOTTOM FOOTER NAVIGATION ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-800 text-xs font-mono text-zinc-400">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>MDeFi Ecosystem Hub • Card 06: Weekly Salary Passive Income</span>
        </span>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Hub Grid</span>
        </button>
      </div>
    </div>
  );
};
