import React from 'react';
import { ArrowLeft, ArrowRight, Diamond } from 'lucide-react';
import { NavPage } from '../../../types';
import { PremiumHero } from './PremiumHero';
import { PremiumPoolFunding } from './PremiumPoolFunding';
import { PremiumQualificationRule } from './PremiumQualificationRule';
import { PremiumShareComparison } from './PremiumShareComparison';
import { PremiumCycleTimeline } from './PremiumCycleTimeline';
import { PremiumRewardCalculation } from './PremiumRewardCalculation';
import { PremiumWeeklyContinuation } from './PremiumWeeklyContinuation';
import { PremiumClaimFeeFlow } from './PremiumClaimFeeFlow';
import { PremiumCompleteFlow } from './PremiumCompleteFlow';
import { PremiumIllustrativeExample } from './PremiumIllustrativeExample';
import { PremiumLiveStats } from './PremiumLiveStats';
import { WeeklyComparisonSection } from '../common/WeeklyComparisonSection';
import { ProtocolDisclaimer } from '../common/ProtocolDisclaimer';

interface WeeklyRewardPremiumDetailProps {
  onBack: () => void;
  onNavigate?: (page: NavPage) => void;
  onNavigateStarter?: () => void;
}

export const WeeklyRewardPremiumDetail: React.FC<WeeklyRewardPremiumDetailProps> = ({
  onBack,
  onNavigate,
  onNavigateStarter,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300 pb-16">
      {/* ── TOP ACTION BAR: [← Back to MDeFi Hub] + [Open Live Premium Claim Dashboard] ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 hover:border-purple-500/40 text-xs font-mono font-medium transition-all shadow-md group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-purple-400" />
          <span>Back to MDeFi Hub</span>
        </button>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('weekly_reward_premium')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 via-fuchsia-500/15 to-transparent hover:bg-purple-950/60 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-all shadow-sm group cursor-pointer"
          >
            <Diamond className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span>Open Live Premium Dashboard</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>
        )}
      </div>

      {/* ── 1. HERO SECTION (Title, Subtitle, Badges, Visual Flow & AI Guide) ── */}
      <PremiumHero onOpenLiveDashboard={onNavigate ? () => onNavigate('weekly_reward_premium') : undefined} />

      {/* ── 2. WHAT IS WEEKLY REWARD PREMIUM? ── */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/80">
          <Diamond className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white font-mono">What Is Weekly Reward Premium?</h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
          <p>
            The Weekly Reward Premium Plan is an elite incentive pool designed for active Quantum Node leaders in the MDeFi Ecosystem. Every $70 Quantum Package activation injects an automated $8 USDT contribution directly into the premium pool vault.
          </p>
          <p>
            To participate in the weekly distribution, leaders must generate a minimum of 3 direct Quantum activations within the 7-day cycle. Every additional direct Quantum partner adds one additional share, scaling their proportion of the weekly pool.
          </p>
        </div>
      </div>

      {/* ── 3. HOW THE PREMIUM POOL IS FUNDED ── */}
      <PremiumPoolFunding />

      {/* ── 4. THE 3-DIRECT QUALIFICATION RULE ── */}
      <PremiumQualificationRule />

      {/* ── 5. MORE SHARES, LARGER POOL ALLOCATION ── */}
      <PremiumShareComparison />

      {/* ── 6. THE 7-DAY PREMIUM CYCLE ── */}
      <PremiumCycleTimeline />

      {/* ── 7. HOW YOUR PREMIUM REWARD IS CALCULATED ── */}
      <PremiumRewardCalculation />

      {/* ── 8. A NEW WEEK. A NEW QUALIFICATION CYCLE. ── */}
      <PremiumWeeklyContinuation />

      {/* ── 9. REWARD CLAIM & MBTTC ECOSYSTEM ── */}
      <PremiumClaimFeeFlow />

      {/* ── 10. COMPLETE WORKING FLOW (INFOGRAPHIC) ── */}
      <PremiumCompleteFlow />

      {/* ── 11. ILLUSTRATIVE EXAMPLE ── */}
      <PremiumIllustrativeExample />

      {/* ── 12. CONTRACT / LIVE DATA TELEMETRY ── */}
      <PremiumLiveStats onOpenLiveDashboard={onNavigate ? () => onNavigate('weekly_reward_premium') : undefined} />

      {/* ── 13. WEEKLY REWARD SYSTEMS COMPARISON ── */}
      <WeeklyComparisonSection 
        currentModule="premium" 
        onNavigateToOther={onNavigateStarter}
      />

      {/* ── 14. CONTRACT-BASED DISCLAIMER ── */}
      <ProtocolDisclaimer moduleName="Weekly Reward Premium Plan" theme="purple" />
    </div>
  );
};
