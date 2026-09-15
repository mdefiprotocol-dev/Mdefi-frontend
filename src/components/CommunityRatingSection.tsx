import React, { useState, useEffect, useId } from 'react';
import { Star, CheckCircle2, Sparkles, MessageSquareHeart, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { communityRatingService, CommunityRatingStats } from '../services/communityRatingService';
import { useLanguage } from '../context/LanguageContext';

interface CommunityRatingSectionProps {
  userWallet?: string;
  onRatingSubmitted?: (rating: number) => void;
  variant?: 'dashboard' | 'public';
  onActionClick?: () => void;
}

export const CommunityRatingSection: React.FC<CommunityRatingSectionProps> = ({
  userWallet,
  onRatingSubmitted,
  variant = 'dashboard',
  onActionClick,
}) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<CommunityRatingStats>(() => communityRatingService.getStats());
  const [selectedStar, setSelectedStar] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasJustSubmitted, setHasJustSubmitted] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const starGroupTitleId = useId();

  // Motion preference detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Subscribe to community rating service changes
  useEffect(() => {
    const unsubscribe = communityRatingService.subscribe((newStats) => {
      setStats(newStats);
      if (newStats.userRating && !selectedStar) {
        setSelectedStar(newStats.userRating);
      }
    });
    return unsubscribe;
  }, [selectedStar]);

  const activeRating = hoveredStar > 0 ? hoveredStar : selectedStar;

  const handleSubmitRating = () => {
    if (selectedStar === 0) return;
    setIsSubmitting(true);

    try {
      const updated = communityRatingService.submitRating(selectedStar, userWallet);
      setStats(updated);
      setHasJustSubmitted(true);
      if (onRatingSubmitted) {
        onRatingSubmitted(selectedStar);
      }
    } catch (err) {
      console.error('[CommunityRatingSection] Submission error:', err);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setHasJustSubmitted(false);
      }, 3500);
    }
  };

  const isPublic = variant === 'public';

  return (
    <section 
      id="community-rating"
      aria-labelledby="community-rating-title"
      className={`relative rounded-3xl bg-gradient-to-b from-[#0a140e] via-[#07100b] to-[#050b07] border border-emerald-500/25 p-5 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.55)] overflow-hidden ${
        isPublic ? 'my-12 sm:my-16 max-w-6xl mx-auto z-10' : 'mt-8'
      }`}
    >
      {/* Background Ambience */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header & Live / Demo Status Badge */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{t('rating_index_label', 'COMMUNITY REPUTATION INDEX')}</span>
            </span>
          </div>
          <h2 id="community-rating-title" className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{t('rating_main_title', 'COMMUNITY RATING')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            {t('rating_main_desc', 'See how the MDeFi community rates its experience.')}
          </p>
        </div>

        {/* Demo vs Live Status Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          {stats.isLive ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <span className="relative flex h-2 w-2">
                {!prefersReducedMotion && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>{t('rating_live_badge', '● LIVE COMMUNITY RATING')}</span>
            </div>
          ) : (
            <div className="inline-flex flex-col items-end">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-xs font-mono font-bold text-amber-300">
                <span className={`w-2 h-2 rounded-full bg-amber-400 ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                <span>{t('rating_demo_badge', '● DEMO RATING')}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 mt-0.5">
                {t('rating_simulated_label', 'SIMULATED PREVIEW DATA')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Rating Cards Display */}
      {isPublic ? (
        /* PUBLIC VARIANT: Prominent Community Rating Display reflecting dashboard submissions */
        <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Card: 4.8 / 5.0 Hero Score Card */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden group">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              {t('rating_main_title', 'COMMUNITY RATING')}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tight">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '5.0'}
              </span>
              <span className="text-xl sm:text-2xl font-mono text-zinc-500 font-bold">
                / 5.0
              </span>
            </div>

            {/* 5-Star Render for Overall Score with subtle animated glow */}
            <div className="flex items-center gap-1.5 text-amber-400" aria-label={`Average rating: ${stats.averageRating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const isFull = stats.averageRating >= starIndex;
                const isHalf = !isFull && stats.averageRating >= starIndex - 0.5;
                return (
                  <Star
                    key={starIndex}
                    className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 ${
                      isFull || isHalf 
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] scale-105' 
                        : 'text-zinc-700'
                    }`}
                  />
                );
              })}
            </div>

            {/* Total Ratings Count */}
            <div className="text-xs font-mono text-zinc-400">
              <span className="text-white font-bold tracking-wider">
                {stats.totalRatings.toLocaleString()}
              </span>{' '}
              <span className="text-zinc-400">{t('rating_ratings_count_suffix', 'COMMUNITY RATINGS')}</span>
            </div>

            <div className="text-[11px] font-mono text-zinc-500 pt-1">
              {stats.isLive ? t('rating_verified_indexer', 'Verified on-chain indexer aggregation') : t('rating_demo_baseline', 'Demo reputation model baseline')}
            </div>
          </div>

          {/* Right Card: Distribution Breakdown & Dashboard Submission Link */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                {t('rating_distribution_label', 'Rating Distribution')}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('rating_aggregated_dashboard', 'Aggregated from Dashboard')}</span>
              </span>
            </div>

            {/* Star Distribution Progress Bars */}
            <div className="space-y-2 py-1">
              {stats.distribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-3 text-xs font-mono">
                  <div className="w-14 flex items-center gap-1 shrink-0 text-zinc-400">
                    <span className="font-bold text-white">{dist.stars}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </div>
                  
                  <div className="flex-1 h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>

                  <div className="w-16 text-right text-zinc-400 shrink-0 text-[11px]">
                    <span>{dist.percentage}%</span>
                    <span className="text-zinc-600 ml-1">({dist.count})</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Verified Member Voluntary Feedback Spotlight (Rendered only when submitted by user) */}
            {stats.latestReview && (
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-emerald-500/20 text-xs flex items-start gap-2.5">
                <div className="flex items-center gap-0.5 text-amber-400 shrink-0 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${
                        s <= stats.latestReview!.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-700'
                      }`}
                    />
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="italic text-zinc-200 text-xs leading-relaxed">
                    "{stats.latestReview.feedbackText}"
                  </p>
                  <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                    {stats.latestReview.displayUser} • {stats.latestReview.dateStr}
                  </span>
                </div>
              </div>
            )}

            {/* Bottom info & CTA */}
            <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <p className="text-xs text-zinc-400">
                {t('rating_dashboard_notice', 'Ratings are submitted directly by verified members in the user dashboard.')}
              </p>
              {onActionClick && (
                <button
                  type="button"
                  onClick={onActionClick}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                >
                  <span>{t('rating_submit_in_dashboard', 'Submit in Dashboard')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* DASHBOARD VARIANT: Interactive submission form for connected user */
        <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Card: Community Average Metric Card (4.8 / 5.0) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden group">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              {t('rating_main_title', 'Community Rating')}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                {stats.averageRating.toFixed(1)}
              </span>
              <span className="text-lg sm:text-xl font-mono text-zinc-500 font-bold">
                / 5.0
              </span>
            </div>

            {/* 5-Star Render for Overall Score */}
            <div className="flex items-center gap-1.5 text-amber-400" aria-label={`Average rating: ${stats.averageRating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const isFull = stats.averageRating >= starIndex;
                const isHalf = !isFull && stats.averageRating >= starIndex - 0.5;
                return (
                  <Star
                    key={starIndex}
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${
                      isFull || isHalf 
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]' 
                        : 'text-zinc-700'
                    }`}
                  />
                );
              })}
            </div>

            {/* Ratings Count */}
            <div className="text-xs font-mono text-zinc-400">
              <span className="text-white font-bold">{stats.totalRatings.toLocaleString()}</span>{' '}
              {stats.isLive ? t('ratings', 'ratings') : t('rating_demo_badge', 'DEMO RATINGS')}
            </div>

            {/* Daily statistic (rendered ONLY if real daily data exists, per strict spec) */}
            {stats.hasDailyData && stats.todayNewRatings !== undefined && (
              <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                {t('rating_today_new', `Today: +${stats.todayNewRatings} new ratings`, { count: stats.todayNewRatings })}
              </div>
            )}
          </div>

          {/* Right Card: Interactive User Rating Form */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-4">
            <div>
              <h3 id={starGroupTitleId} className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                <MessageSquareHeart className="w-4 h-4 text-emerald-400" />
                <span>{t('rating_user_prompt', 'How would you rate your MDeFi experience?')}</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {t('rating_user_subtext', 'Select 1 to 5 stars to submit your voluntary feedback to the ecosystem index.')}
              </p>
            </div>

            {/* 1–5 Interactive Star Bar */}
            <div 
              className="flex items-center gap-2 py-2"
              role="radiogroup"
              aria-labelledby={starGroupTitleId}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isIlluminated = star <= activeRating;
                return (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={selectedStar === star}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    onClick={() => setSelectedStar(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onFocus={() => setHoveredStar(star)}
                    onBlur={() => setHoveredStar(0)}
                    className="p-1 sm:p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-all duration-200 ${
                        isIlluminated
                          ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                          : 'text-zinc-600 hover:text-zinc-400 hover:scale-105'
                      } ${!prefersReducedMotion && isIlluminated ? 'animate-pulse' : ''}`}
                    />
                  </button>
                );
              })}

              {/* Active Star Label Feedback */}
              {selectedStar > 0 && (
                <span className="text-xs font-mono font-bold text-amber-300 ml-2 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30">
                  {selectedStar} of 5 Stars
                </span>
              )}
            </div>

            {/* Action Row: Submit Rating Button & Confirmation */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                disabled={selectedStar === 0 || isSubmitting}
                onClick={handleSubmitRating}
                className={`px-6 py-3 rounded-xl text-xs font-mono font-black tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  selectedStar > 0 && !isSubmitting
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                    : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <span>{t('rating_submitting_btn', 'SUBMITTING...')}</span>
                ) : (
                  <>
                    <span>{t('rating_submit_btn', 'SUBMIT VOLUNTARY RATING')}</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Live Feedback / Success Message */}
              {hasJustSubmitted && (
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('rating_submitted_success', 'Thank you! Your rating has been recorded.')}</span>
                </div>
              )}

              {!hasJustSubmitted && stats.userSubmitted && (
                <span className="text-[11px] font-mono text-zinc-500">
                  ✓ You previously submitted a {stats.userRating}-star rating
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

