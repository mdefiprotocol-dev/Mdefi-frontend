import React from 'react';
import { ArrowLeft, ArrowRight, Award, Crown, ShieldCheck } from 'lucide-react';
import { NavPage } from '../../../types';
import { StarterHero } from './StarterHero';
import { StarterPoolFunding } from './StarterPoolFunding';
import { StarterQualificationShares } from './StarterQualificationShares';
import { StarterMoreDirectsShares } from './StarterMoreDirectsShares';
import { StarterCycleTimeline } from './StarterCycleTimeline';
import { StarterPoolDistribution } from './StarterPoolDistribution';
import { StarterCarryForward } from './StarterCarryForward';
import { StarterClaimFeeFlow } from './StarterClaimFeeFlow';
import { StarterCompleteFlow } from './StarterCompleteFlow';
import { StarterSimpleExample } from './StarterSimpleExample';
import { StarterLiveStats } from './StarterLiveStats';
import { WeeklyComparisonSection } from '../common/WeeklyComparisonSection';
import { ProtocolDisclaimer } from '../common/ProtocolDisclaimer';

interface WeeklyRewardStarterDetailProps {
  onBack: () => void;
  onNavigate?: (page: NavPage) => void;
  onNavigatePremium?: () => void;
}

export const WeeklyRewardStarterDetail: React.FC<WeeklyRewardStarterDetailProps> = ({
  onBack,
  onNavigate,
  onNavigatePremium,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300 pb-16">
      {/* ── TOP ACTION BAR: [← Back to MDeFi Hub] + [Open Live Starter Claim Dashboard] ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 hover:border-amber-500/40 text-xs font-mono font-medium transition-all shadow-md group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-amber-400" />
          <span>Back to MDeFi Hub</span>
        </button>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('weekly_reward_starter')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-transparent hover:bg-amber-950/60 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all shadow-sm group cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Open Live Starter Dashboard</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>
        )}
      </div>

      {/* ── 1. HERO SECTION (Title, Subtitle, Badges, Visual Flow & AI Guide) ── */}
      <StarterHero onOpenLiveDashboard={onNavigate ? () => onNavigate('weekly_reward_starter') : undefined} />

      {/* ── 2. WHAT IS WEEKLY REWARD STARTER? ── */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950/80 border border-zinc-800/90 space-y-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800/80">
          <Award className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white font-mono">What Is Weekly Reward Starter?</h2>
        </div>
        <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
          <p>
            The Weekly Reward Starter Plan is an automated, decentralized incentive pool built natively into the MDeFi Ecosystem Hub. Designed specifically for community builders activating direct partners in the $25 S4 Senior Node package, it pools network contributions and distributes USDT rewards weekly on a share-weighted basis.
          </p>
          <p>
            Unlike static schemes or fixed-return promises, the Starter Plan operates transparently on-chain. Each participant earns shares based on their actual weekly direct partner performance, ensuring that community expansion and reward distribution are linked directly to protocol activity.
          </p>
        </div>
      </div>

      {/* ── 3. HOW THE REWARD POOL IS FUNDED ── */}
      <StarterPoolFunding />

      {/* ── 4. QUALIFICATION REQUIREMENT & SHARE SYSTEM ── */}
      <StarterQualificationShares />

      {/* ── 5. MORE DIRECTS = MORE SHARES ── */}
      <StarterMoreDirectsShares />

      {/* ── 6. 7-DAY REWARD CYCLE ── */}
      <StarterCycleTimeline />

      {/* ── 7. WEEKLY POOL DISTRIBUTION FORMULA ── */}
      <StarterPoolDistribution />

      {/* ── 8. REWARD POOL CARRY-FORWARD ── */}
      <StarterCarryForward />

      {/* ── 9. REWARD CLAIM & MBTTC FEE FLOW ── */}
      <StarterClaimFeeFlow />

      {/* ── 10. COMPLETE WORKING FLOW (INFOGRAPHIC) ── */}
      <StarterCompleteFlow />

      {/* ── 11. SIMPLE EXAMPLE (USER A VS USER B) ── */}
      <StarterSimpleExample />

      {/* ── 12. CONTRACT / LIVE DATA TELEMETRY ── */}
      <StarterLiveStats onOpenLiveDashboard={onNavigate ? () => onNavigate('weekly_reward_starter') : undefined} />

      {/* ── 13. WEEKLY REWARD SYSTEMS COMPARISON ── */}
      <WeeklyComparisonSection 
        currentModule="starter" 
        onNavigateToOther={onNavigatePremium}
      />

      {/* ── 14. CONTRACT-BASED DISCLAIMER ── */}
      <ProtocolDisclaimer moduleName="Weekly Reward Starter Plan" theme="amber" />
    </div>
  );
};
