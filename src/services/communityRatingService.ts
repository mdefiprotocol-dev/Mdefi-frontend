/**
 * Community Rating Service
 * Manages MDeFi ecosystem community ratings.
 * 
 * Rules:
 * - When in DEMO mode: provides representative simulated rating data clearly labeled DEMO.
 * - When user submits a rating: computes average dynamically using:
 *     Average Rating = Total Star Points ÷ Total Number of Ratings
 * - Dispatches events to the existing notification infrastructure.
 * - In LIVE mode: uses real verified data only without fabrication.
 */

import { mbttcMarketService } from './mbttcMarketService';
import { centralEventSyncService } from './centralEventSyncService';
import { formatCompactAddress } from '../utils/formatAddress';

export interface RatingDistributionItem {
  stars: number;
  count: number;
  percentage: number;
}

export interface CommunityReviewItem {
  id: string;
  rating: number;
  feedbackText: string;
  displayUser: string;
  timestamp: number;
  dateStr: string;
  status: 'approved';
}

export interface CommunityRatingStats {
  isLive: boolean;
  averageRating: number; // e.g. 4.8
  totalRatings: number;  // e.g. 1284 or real count
  distribution: RatingDistributionItem[];
  userRating: number | null; // 1-5 or null
  userSubmitted: boolean;
  hasDailyData: boolean;
  todayNewRatings?: number; // only shown if real data exists
  latestReview?: CommunityReviewItem | null;
}

type RatingListener = (stats: CommunityRatingStats) => void;

class CommunityRatingService {
  private listeners: Set<RatingListener> = new Set();
  
  // Base representative demo counts (strictly labeled SIMULATED / DEMO in demo mode)
  private baseCounts: Record<number, number> = {
    5: 1060,
    4: 176,
    3: 40,
    2: 6,
    1: 2,
  };
  private userSubmittedRating: number | null = null;
  private hasSubmitted: boolean = false;
  private latestReview: CommunityReviewItem | null = null;

  constructor() {
    this.loadPersistedUserRating();
  }

  private loadPersistedUserRating() {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('mdefi_user_community_rating');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.rating && typeof parsed.rating === 'number') {
            this.userSubmittedRating = parsed.rating;
            this.hasSubmitted = true;
          }
        }

        const savedReview = localStorage.getItem('mdefi_community_latest_review');
        if (savedReview) {
          this.latestReview = JSON.parse(savedReview);
        }
      }
    } catch {}
  }

  public getStats(): CommunityRatingStats {
    const isLive = mbttcMarketService.getMode() === 'live';
    
    if (isLive) {
      // In LIVE mode: calculate strictly from authentic live user submissions
      const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let totalCount = 0;
      let totalPoints = 0;

      if (this.hasSubmitted && this.userSubmittedRating) {
        counts[this.userSubmittedRating] = 1;
        totalCount = 1;
        totalPoints = this.userSubmittedRating;
      }

      const rawAverage = totalCount > 0 ? totalPoints / totalCount : 0;
      const averageRating = Math.round(rawAverage * 10) / 10;

      const distribution: RatingDistributionItem[] = [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        count: counts[stars] || 0,
        percentage: totalCount > 0 ? Math.round(((counts[stars] || 0) / totalCount) * 100) : 0,
      }));

      return {
        isLive: true,
        averageRating,
        totalRatings: totalCount,
        distribution,
        userRating: this.userSubmittedRating,
        userSubmitted: this.hasSubmitted,
        hasDailyData: false,
        latestReview: this.latestReview,
      };
    }

    // In DEMO mode: calculate with base sample + user submitted rating if any
    const counts: Record<number, number> = { ...this.baseCounts };
    if (this.userSubmittedRating && this.hasSubmitted && counts[this.userSubmittedRating] !== undefined) {
      counts[this.userSubmittedRating] += 1;
    }

    let totalPoints = 0;
    let totalCount = 0;
    for (let s = 1; s <= 5; s++) {
      const c = counts[s] || 0;
      totalCount += c;
      totalPoints += s * c;
    }

    const rawAverage = totalCount > 0 ? totalPoints / totalCount : 0;
    // Format to 1 decimal place (e.g. 4.8)
    const averageRating = Math.round(rawAverage * 10) / 10;

    const distribution: RatingDistributionItem[] = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: counts[stars] || 0,
      percentage: totalCount > 0 ? Math.round(((counts[stars] || 0) / totalCount) * 100) : 0,
    }));

    return {
      isLive: false,
      averageRating,
      totalRatings: totalCount,
      distribution,
      userRating: this.userSubmittedRating,
      userSubmitted: this.hasSubmitted,
      hasDailyData: false,
      latestReview: this.latestReview,
    };
  }

  /**
   * Submit an authentic user rating (1-5 stars) and optional feedback note.
   * Dispatches updates to Central Event Sync and all listeners in real-time.
   */
  public submitRating(
    stars: number,
    userWallet?: string,
    feedbackNote?: string
  ): CommunityRatingStats {
    if (stars < 1 || stars > 5) {
      throw new Error('Rating must be between 1 and 5 stars');
    }

    this.userSubmittedRating = stars;
    this.hasSubmitted = true;

    try {
      if (typeof window !== 'undefined') {
        const wallet = userWallet || 'anonymous';
        const now = Date.now();

        // 1. Persist user's rating in local storage
        localStorage.setItem(
          'mdefi_user_community_rating',
          JSON.stringify({
            rating: stars,
            timestamp: now,
            wallet: wallet,
          })
        );

        // 2. If feedback note provided, persist privacy-safe approved review
        if (feedbackNote && feedbackNote.trim()) {
          const cleanNote = feedbackNote.trim().slice(0, 280);
          const maskedUser = wallet !== 'anonymous'
            ? `MDeFi Member (${formatCompactAddress(wallet)})`
            : 'MDeFi Member';

          const reviewItem: CommunityReviewItem = {
            id: `rev_${now}_${wallet.slice(-4)}`,
            rating: stars,
            feedbackText: cleanNote,
            displayUser: maskedUser,
            timestamp: now,
            dateStr: 'Just now',
            status: 'approved',
          };
          this.latestReview = reviewItem;

          try {
            localStorage.setItem('mdefi_community_latest_review', JSON.stringify(reviewItem));
          } catch {}
        }

        // 3. Propagate to Central Event Sync
        centralEventSyncService.dispatchAction({
          actionType: 'RATING_SUBMISSION',
          txHash: `rate_${now}`,
          walletAddress: wallet,
          title: `${stars} ★ Rating`,
          details: feedbackNote ? `Feedback: "${feedbackNote.trim().slice(0, 100)}"` : 'Experience Rating Submitted',
        });

        // 4. Dispatch standard custom event for external listeners
        const event = new CustomEvent('mdefi:rating_submitted', {
          detail: {
            rating: stars,
            wallet: wallet,
            timestamp: now,
            newAverage: this.getStats().averageRating,
            totalRatings: this.getStats().totalRatings,
          },
        });
        window.dispatchEvent(event);
      }
    } catch (err) {
      console.error('[CommunityRatingService] Submission error:', err);
    }

    const updated = this.getStats();
    this.notifyListeners(updated);
    return updated;
  }

  public subscribe(listener: RatingListener): () => void {
    this.listeners.add(listener);
    listener(this.getStats());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(stats: CommunityRatingStats) {
    this.listeners.forEach((l) => {
      try {
        l(stats);
      } catch (err) {
        console.error('[CommunityRatingService] Listener error:', err);
      }
    });
  }
}

export const communityRatingService = new CommunityRatingService();
