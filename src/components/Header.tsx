import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bell, 
  Wallet, 
  ShieldCheck, 
  ExternalLink, 
  Check, 
  ChevronDown,
  Sparkles,
  Copy,
  LogOut,
  Radio,
  Clock,
  Layers,
  Users,
  Globe,
  Zap,
  Coins,
  CheckCircle2,
  AlertCircle,
  ArrowLeftRight,
  Star,
  MessageSquare,
  X
} from 'lucide-react';
import { NavPage, UserProfile, RewardBalances, ActivityItem } from '../types';
import { MbttcCoin3D } from './MbttcCoin3D';
import { LanguageSelector } from './common/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { 
  normalizeAndDeduplicateActivities,
  filter24HourNotifications,
  getCleanupCycleId,
  loadGreetingFeedbackState,
  saveGreetingFeedbackState,
  shouldShow24HourGreeting,
  GreetingFeedbackState
} from '../utils/notificationDeduplication';
import { communityRatingService } from '../services/communityRatingService';
import { formatCompactAddress, copyFullAddress } from '../utils/formatAddress';

interface HeaderProps {
  currentPage?: NavPage;
  user: UserProfile;
  rewards?: RewardBalances;
  activities?: ActivityItem[];
  onNavigate: (page: NavPage) => void;
  onOpenWalletModal: () => void;
  onOpenClaimModal?: () => void;
  onTriggerRewardPopup?: (amount: number, type: string) => void;
  onReturnToLanding?: () => void;
  onMarkAllAsRead?: () => void;
  onMarkAsRead?: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage = 'overview',
  user,
  rewards,
  activities = [],
  onNavigate,
  onOpenWalletModal,
  onReturnToLanding,
  onMarkAllAsRead,
  onMarkAsRead,
}) => {
  const { t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isConnectedState, setIsConnectedState] = useState(true);

  const mbttcBalance = rewards?.mbttcBalance ?? 0;

  const walletRef = useRef<HTMLDivElement>(null);
  const mobileWalletRef = useRef<HTMLDivElement>(null);
  const walletDropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInsideWallet = 
        (walletRef.current && walletRef.current.contains(target)) ||
        (mobileWalletRef.current && mobileWalletRef.current.contains(target)) ||
        (walletDropdownRef.current && walletDropdownRef.current.contains(target));

      if (!isInsideWallet) {
        setShowWalletDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (page?: string) => {
    switch (page) {
      case 'overview': return t('dash_page_overview', 'Hub Overview Dashboard');
      case 'hub': return t('dash_page_hub', 'MDefi Hub Infrastructure');
      case 'mbttc': return t('dash_page_mbttc', 'MBTTC — Magnet Bitcoin Token');
      case 'quantum-nexus': return t('dash_page_quantum', 'Quantum Node ($70) — X6 Matrix');
      case 'nexus-prime': return t('dash_page_nexus', 'Nexus Prime Node ($120) — X6 Matrix');
      case 's4-matrix': return t('dash_page_s4', 'S4 Matrix Modules');
      case 'team': return t('dash_page_team', 'My Team & Referral Network');
      case 'packages': return t('dash_page_packages', 'Active & Available Packages');
      case 'income': return t('dash_page_income', 'Income & Rewards Analytics');
      case 'transactions': return t('dash_page_transactions', 'Transaction Ledger');
      case 'profile': return t('dash_page_profile', 'Account Health & Profile');
      default: return t('dash_overview', 'Overview');
    }
  };

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyFullAddress(user.walletAddress);
    if (ok) {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const handleToggleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConnectedState(!isConnectedState);
  };

  // Deduplicate activities strictly for the currently connected user's wallet
  const allUserActivities = useMemo(() => {
    return normalizeAndDeduplicateActivities(activities || [], user.walletAddress);
  }, [activities, user.walletAddress]);

  // 24-HOUR RETENTION POLICY: Keep notification panel lean without touching underlying ledger records
  const userActivities = useMemo(() => {
    return filter24HourNotifications(allUserActivities);
  }, [allUserActivities]);

  // Per-user 24-hour greeting & voluntary experience feedback state
  const [greetingState, setGreetingState] = useState<GreetingFeedbackState | null>(() => {
    return loadGreetingFeedbackState(user.walletAddress);
  });
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [showFeedbackInput, setShowFeedbackInput] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');

  // Synchronize greeting state whenever wallet changes
  useEffect(() => {
    const loaded = loadGreetingFeedbackState(user.walletAddress);
    setGreetingState(loaded);
    setSelectedRating(loaded?.rating || 0);
  }, [user.walletAddress]);

  // Deterministic 24-hour cleanup cycle ID
  const currentCycleId = useMemo(() => {
    return getCleanupCycleId(allUserActivities, user.walletAddress);
  }, [allUserActivities, user.walletAddress]);

  // Determines whether the greeting card is active for the current 24-hour cleanup cycle
  const showGreetingCard = useMemo(() => {
    return shouldShow24HourGreeting(userActivities.length, currentCycleId, user.walletAddress);
  }, [userActivities.length, currentCycleId, user.walletAddress, greetingState]);

  // Mark cycle as seen when opened so refreshing doesn't cause duplicate popups
  useEffect(() => {
    if (showNotifications && showGreetingCard && currentCycleId) {
      saveGreetingFeedbackState(user.walletAddress, {
        cycleId: currentCycleId,
        seen: true,
      });
    }
  }, [showNotifications, showGreetingCard, currentCycleId, user.walletAddress]);

  // Unread count strictly counts unread active notifications - NOT the greeting
  const unreadCount = useMemo(() => {
    return userActivities.filter((act) => !act.read).length;
  }, [userActivities]);

  const handleRateExperience = (stars: number) => {
    setSelectedRating(stars);
    const updated = saveGreetingFeedbackState(user.walletAddress, {
      cycleId: currentCycleId,
      lastGreetingAt: Date.now(),
      rating: stars,
      dismissed: false,
      seen: true,
    });
    setGreetingState(updated);
    communityRatingService.submitRating(stars, user.walletAddress);
  };

  const handleSubmitFeedbackNote = () => {
    if (!feedbackText.trim() && selectedRating === 0) return;
    const finalRating = selectedRating > 0 ? selectedRating : 5;
    if (selectedRating === 0) {
      setSelectedRating(5);
    }
    const updated = saveGreetingFeedbackState(user.walletAddress, {
      cycleId: currentCycleId,
      lastGreetingAt: Date.now(),
      rating: finalRating,
      feedbackNote: feedbackText.trim() || undefined,
      dismissed: true,
      seen: true,
    });
    setGreetingState(updated);
    setShowFeedbackInput(false);

    communityRatingService.submitRating(
      finalRating,
      user.walletAddress,
      feedbackText.trim() || undefined
    );
  };

  const handleDismissGreeting = () => {
    const updated = saveGreetingFeedbackState(user.walletAddress, {
      cycleId: currentCycleId,
      lastGreetingAt: Date.now(),
      dismissed: true,
      seen: true,
    });
    setGreetingState(updated);
  };

  const shortenAddress = (addr?: string) => {
    return formatCompactAddress(addr);
  };

  const shortenHash = (hash?: string) => {
    return formatCompactAddress(hash);
  };

  const getNotificationVisual = (notif: ActivityItem) => {
    const typeLower = (notif.type || '').toLowerCase();
    const detailsLower = (notif.details || '').toLowerCase();
    const titleLower = (notif.title || '').toLowerCase();

    if (
      typeLower.includes('team') ||
      typeLower.includes('matrix') ||
      typeLower.includes('referral') ||
      detailsLower.includes('partner commission') ||
      titleLower.includes('referral')
    ) {
      return {
        icon: Users,
        border: 'border-purple-500/30 hover:border-purple-400/50',
        bg: 'bg-gradient-to-br from-purple-950/30 via-zinc-950/90 to-zinc-950',
        iconWrap: 'bg-purple-500/15 text-purple-300 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
        badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-500/30',
        amountColor: 'text-purple-300 font-bold',
        defaultTitle: 'Team Referral Income',
      };
    }

    if (
      typeLower.includes('package') ||
      typeLower.includes('quantum') ||
      typeLower.includes('nexus') ||
      titleLower.includes('node') ||
      titleLower.includes('package')
    ) {
      return {
        icon: Zap,
        border: 'border-cyan-500/30 hover:border-cyan-400/50',
        bg: 'bg-gradient-to-br from-cyan-950/30 via-zinc-950/90 to-zinc-950',
        iconWrap: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]',
        badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30',
        amountColor: 'text-cyan-300 font-bold',
        defaultTitle: 'Package Node Activity',
      };
    }

    if (typeLower.includes('claim')) {
      return {
        icon: Coins,
        border: 'border-amber-500/30 hover:border-amber-400/50',
        bg: 'bg-gradient-to-br from-amber-950/30 via-zinc-950/90 to-zinc-950',
        iconWrap: 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
        badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500/30',
        amountColor: 'text-amber-300 font-bold',
        defaultTitle: 'Token Claim Confirmed',
      };
    }

    if (typeLower.includes('swap')) {
      return {
        icon: ArrowLeftRight,
        border: 'border-teal-500/30 hover:border-teal-400/50',
        bg: 'bg-gradient-to-br from-teal-950/30 via-zinc-950/90 to-zinc-950',
        iconWrap: 'bg-teal-500/15 text-teal-300 border-teal-500/30 shadow-[0_0_12px_rgba(20,184,166,0.2)]',
        badgeColor: 'bg-teal-950/80 text-teal-300 border-teal-500/30',
        amountColor: 'text-teal-300 font-bold',
        defaultTitle: 'Token Swap Executed',
      };
    }

    return {
      icon: ShieldCheck,
      border: 'border-emerald-500/30 hover:border-emerald-400/50',
      bg: 'bg-gradient-to-br from-emerald-950/30 via-zinc-950/90 to-zinc-950',
      iconWrap: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30',
      amountColor: 'text-emerald-300 font-bold',
      defaultTitle: notif.type || 'Protocol Activity',
    };
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-500/15 bg-[#070b08]/95 app-header-bar backdrop-blur-md px-2.5 sm:px-4 lg:px-8 py-2 sm:py-3 transition-all">
      {/* Primary Top Bar */}
      <div className="w-full flex items-center justify-between gap-2 max-w-[1600px] mx-auto">
        {/* Left: Brand & Page Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div 
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0"
            title="Return to Overview"
          >
            <div className="relative shrink-0 flex items-center justify-center">
              <MbttcCoin3D size="sm" interactive={false} autoRotate={true} glow={false} />
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-white group-hover:text-emerald-300 transition-colors shrink-0">
                MDeFi
              </span>
              <span className="inline-flex items-center text-[9px] sm:text-[10px] font-mono uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-semibold tracking-wider shrink-0 select-none whitespace-nowrap shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                {t('brand_protocol', 'Protocol')}
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-zinc-800 hidden md:block mx-1" />

          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-300">
              {getPageTitle(currentPage)}
            </span>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <LanguageSelector align="right" />

          {/* Real On-Chain Network Indicator - Desktop */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/80 border border-emerald-500/30 text-xs text-zinc-300 shadow-[0_0_12px_rgba(16,185,129,0.1)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="font-medium text-zinc-200">BSC Testnet</span>
            <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/30 font-bold">
              Chain 97
            </span>
          </div>

          {/* Notification Button */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowWalletDropdown(false);
              }}
              aria-label={`Notifications (${unreadCount} unread)`}
              className="p-1.5 sm:p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/30 text-zinc-300 hover:text-white transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] sm:min-w-[18px] h-[16px] sm:h-[18px] px-1 rounded-full bg-emerald-500 text-black text-[9px] sm:text-[10px] font-bold font-mono flex items-center justify-center ring-2 ring-[#070b08] shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs sm:hidden z-40"
                  onClick={() => setShowNotifications(false)}
                />

                <div 
                  className="fixed left-3 right-3 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-[390px] max-w-[calc(100vw-24px)] rounded-3xl bg-zinc-950/98 border border-emerald-500/30 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 flex flex-col max-h-[min(80vh,560px)] overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)] shrink-0">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white uppercase tracking-wider block truncate">
                          {t('notif_title', 'Notifications')}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 block truncate" title={user.walletAddress}>
                          {shortenAddress(user.walletAddress)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {unreadCount > 0 && (
                        <span className="text-[10px] text-emerald-400 font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                          {unreadCount} {t('notif_new', 'New')}
                        </span>
                      )}
                      {userActivities.length > 0 && unreadCount > 0 && (
                        <button
                          onClick={() => onMarkAllAsRead?.()}
                          className="text-[10px] text-zinc-400 hover:text-emerald-300 font-medium transition-colors hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2.5 my-2.5 pr-1 overscroll-contain">
                    {userActivities.length === 0 && showGreetingCard && (
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-zinc-900/95 to-zinc-950 border border-emerald-500/35 shadow-[0_0_25px_rgba(16,185,129,0.15)] relative group overflow-hidden transition-all duration-200">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="p-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)] shrink-0">
                              <Sparkles className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 truncate">
                                You&apos;re all caught up! 🎉
                              </span>
                              <span className="text-[10px] text-emerald-400/90 font-mono block truncate">
                                Thank you for being part of the MDeFi ecosystem.
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={handleDismissGreeting}
                            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                            title="Dismiss greeting for this cycle"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed mb-3 font-medium">
                          How was your experience?
                        </p>

                        <div className="py-2.5 px-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex flex-col items-center justify-center gap-1.5 shadow-inner">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
                            {selectedRating > 0 
                              ? `Selected: ${selectedRating} of 5 Stars` 
                              : 'Rate your MDeFi experience'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const isFilled = (hoveredRating || selectedRating) >= star;
                              return (
                                <button
                                  key={star}
                                  type="button"
                                  onMouseEnter={() => setHoveredRating(star)}
                                  onMouseLeave={() => setHoveredRating(0)}
                                  onClick={() => handleRateExperience(star)}
                                  className="p-1 rounded-lg hover:scale-115 active:scale-95 transition-all cursor-pointer text-amber-400 focus:outline-none"
                                  aria-label={`Rate ${star} out of 5 stars`}
                                >
                                  <Star
                                    className={`w-5 h-5 transition-all duration-150 ${
                                      isFilled 
                                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.65)]' 
                                        : 'text-zinc-600 hover:text-zinc-400'
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {showFeedbackInput ? (
                          <div className="mt-2.5 space-y-2 animate-in fade-in duration-150">
                            <textarea
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                              placeholder="Optional: share your feedback with the community..."
                              rows={2}
                              className="w-full text-xs rounded-xl bg-zinc-900 border border-zinc-700/80 p-2 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none resize-none font-sans"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setShowFeedbackInput(false)}
                                className="px-2.5 py-1 text-[11px] rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSubmitFeedbackNote}
                                className="px-3 py-1 text-[11px] font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black transition-colors cursor-pointer"
                              >
                                Submit Feedback
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-zinc-800/60">
                            <button
                              onClick={() => setShowFeedbackInput(true)}
                              className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Share your feedback</span>
                            </button>
                            {selectedRating > 0 && (
                              <span className="text-[10px] font-mono text-emerald-400/90 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                Feedback Recorded
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {userActivities.length === 0 && !showGreetingCard ? (
                      <div className="py-10 px-4 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white">All caught up</p>
                          <p className="text-xs text-zinc-400 max-w-[220px] mx-auto leading-relaxed">
                            No recent activity in the last 24 hours for your wallet.
                          </p>
                        </div>
                        <div className="pt-1">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400/80 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            {shortenAddress(user.walletAddress)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      userActivities.map((notif) => {
                        const visual = getNotificationVisual(notif);
                        const VisualIcon = visual.icon;

                        return (
                          <div
                            key={notif.id}
                            onClick={() => onMarkAsRead?.(notif.id)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer relative group overflow-hidden ${
                              notif.read
                                ? 'bg-zinc-900/40 border-zinc-800/70 opacity-80 hover:opacity-100 hover:border-zinc-700'
                                : `${visual.bg}${visual.border} shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.12)]`
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className={`p-2 rounded-xl shrink-0 border ${visual.iconWrap}`}>
                                <VisualIcon className="w-4 h-4" />
                              </div>

                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between gap-1.5">
                                  <span className={`text-xs font-bold truncate ${notif.read ? 'text-zinc-300' : 'text-white'}`}>
                                    {notif.title || visual.defaultTitle}
                                  </span>
                                  {!notif.read && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_#34d399]" />
                                  )}
                                </div>

                                <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-2">
                                  {notif.details || `${notif.type} confirmed on-chain.`}
                                </p>

                                <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5 text-[10px] font-mono">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    {notif.amount && (
                                      <span className={`font-semibold shrink-0 ${visual.amountColor}`}>
                                        {notif.amount}
                                      </span>
                                    )}
                                    {notif.txHash && notif.txHash !== '0x0' && (
                                      <span className="text-zinc-400 truncate max-w-[110px] sm:max-w-[140px]" title={notif.txHash}>
                                        {shortenHash(notif.txHash)}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${
                                      notif.status === 'Confirmed'
                                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/25'
                                        : notif.status === 'Pending'
                                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/25'
                                        : 'bg-rose-950/60 text-rose-300 border-rose-500/25'
                                    }`}>
                                      {notif.status === 'Confirmed' ? (
                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                      ) : notif.status === 'Pending' ? (
                                        <Clock className="w-2.5 h-2.5 animate-spin" />
                                      ) : (
                                        <AlertCircle className="w-2.5 h-2.5" />
                                      )}
                                      {notif.status}
                                    </span>
                                    <span className="text-zinc-400 text-[9px]">{notif.date}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400/80">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      On-Chain Sync Active
                    </span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors text-[11px] cursor-pointer"
                    >
                      {t('btn_dismiss', 'Dismiss')}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Desktop Wallet Dropdown */}
          <div className="hidden sm:block relative" ref={walletRef}>
            <button
              onClick={() => {
                setShowWalletDropdown(!showWalletDropdown);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-zinc-950/90 border border-emerald-500/30 hover:border-emerald-400/60 text-xs font-mono text-zinc-200 hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.08)] group cursor-pointer"
              title="Wallet Session"
            >
              <span className={`w-2 h-2 rounded-full ${isConnectedState ? 'bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse' : 'bg-zinc-500'}`} />
              <span className="font-semibold text-emerald-300 tracking-tight text-[11px] sm:text-xs">
                {isConnectedState ? (
                  formatCompactAddress(user.walletAddress)
                ) : (
                  t('disconnected', 'Disconnected')
                )}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 transition-transform shrink-0" />
            </button>

            {showWalletDropdown && (
              <div 
                ref={walletDropdownRef}
                className="hidden sm:block absolute right-0 top-full mt-2 w-80 rounded-3xl bg-zinc-950/98 border border-emerald-500/25 p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 space-y-4"
              >
                {/* Header info: Verified Active State */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{t('wallet_session', 'Wallet Session')}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold">
                    {isConnectedState ? 'Connected (Verified)' : t('disconnected', 'Disconnected')}
                  </span>
                </div>

                {/* Address detail */}
                <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">{t('wallet_address', 'Wallet Address')}</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-white font-semibold truncate" title={user.walletAddress}>
                      {formatCompactAddress(user.walletAddress)}
                    </span>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors shrink-0 cursor-pointer"
                      title={t('copy_address', 'Copy Address')}
                    >
                      {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Real Network detail */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-400">{t('network', 'Network')}</span>
                    <span className="font-medium text-emerald-400 font-mono">BNB Smart Chain Testnet</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-400">{t('status', 'Status')}</span>
                    <span className="font-medium text-white flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isConnectedState ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                      {isConnectedState ? 'Active (BSC Node)' : t('disconnected', 'Disconnected')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-400">{t('chain_id', 'Chain ID')}</span>
                    <span className="font-mono text-emerald-300 font-semibold">97 (0x61 - BSC Testnet)</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={handleCopyAddress}
                    className="py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{copiedAddress ? t('copied', 'Copied!') : t('copy_address', 'Copy Address')}</span>
                  </button>
                  <button
                    onClick={handleToggleConnect}
                    className="py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/30 text-xs font-semibold text-zinc-300 hover:text-red-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isConnectedState ? t('disconnect', 'Disconnect') : t('reconnect', 'Reconnect')}</span>
                  </button>
                </div>

                {/* Phase 2 wallet modal trigger */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                  <button
                    onClick={() => {
                      setShowWalletDropdown(false);
                      onOpenWalletModal();
                    }}
                    className="w-full text-[11px] text-zinc-400 hover:text-emerald-400 transition-colors block text-center cursor-pointer"
                  >
                    {t('wallet_switch_provider', 'Switch Wallet Provider (MetaMask / WalletConnect)')}
                  </button>

                  {onReturnToLanding && (
                    <button
                      onClick={() => {
                        setShowWalletDropdown(false);
                        onReturnToLanding();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 hover:border-emerald-400 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{t('dash_public_site', 'Public Front Website')}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Button */}
          <button
            onClick={() => onNavigate('profile')}
            className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${
              currentPage === 'profile'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
            }`}
            title="Account Profile"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-700 flex items-center justify-center text-[9px] font-bold text-black font-mono">
              M
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Bar (< 640px): Real On-Chain Network Tag */}
      <div className="sm:hidden w-full pt-2 mt-1.5 border-t border-emerald-500/10 flex items-center justify-between gap-2 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399] shrink-0" />
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider truncate font-semibold">
            BSC Testnet • Chain 97
          </span>
        </div>

        {/* Mobile Wallet Button */}
        <div className="relative" ref={mobileWalletRef}>
          <button
            onClick={() => {
              setShowWalletDropdown(!showWalletDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/90 border border-emerald-500/30 text-xs font-mono text-zinc-200 hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.08)] shrink-0 active:scale-95 cursor-pointer"
            title="Wallet Session"
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isConnectedState ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
            <span className="font-semibold text-emerald-300 tracking-tight text-[11px]">
              {isConnectedState ? (
                formatCompactAddress(user.walletAddress)
              ) : (
                t('disconnected', 'Disconnected')
              )}
            </span>
            <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
          </button>
        </div>
      </div>

      {/* Mobile Wallet Session Dropdown (< sm) */}
      {showWalletDropdown && (
        <div 
          ref={walletDropdownRef}
          className="sm:hidden fixed left-3 right-3 top-[88px] max-w-[calc(100vw-24px)] mx-auto rounded-3xl bg-zinc-950/98 border border-emerald-500/30 p-4 shadow-[0_12px_45px_rgba(0,0,0,0.95)] backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 space-y-4"
        >
          {/* Header info */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{t('wallet_session', 'Wallet Session')}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold">
              {isConnectedState ? 'Connected (Verified)' : t('disconnected', 'Disconnected')}
            </span>
          </div>

          {/* Address detail */}
          <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">{t('wallet_address', 'Wallet Address')}</span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-white font-semibold truncate" title={user.walletAddress}>
                {formatCompactAddress(user.walletAddress)}
              </span>
              <button
                onClick={handleCopyAddress}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors shrink-0 cursor-pointer"
                title={t('copy_address', 'Copy Address')}
              >
                {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Real Network detail */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
              <span className="text-zinc-400">{t('network', 'Network')}</span>
              <span className="font-medium text-emerald-400 font-mono">BNB Smart Chain Testnet</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
              <span className="text-zinc-400">{t('status', 'Status')}</span>
              <span className="font-medium text-white flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isConnectedState ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                {isConnectedState ? 'Active (BSC Node)' : t('disconnected', 'Disconnected')}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-400">{t('chain_id', 'Chain ID')}</span>
              <span className="font-mono text-emerald-300 font-semibold">97 (0x61 - BSC Testnet)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleCopyAddress}
              className="py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-400" />
              <span>{copiedAddress ? t('copied', 'Copied!') : t('copy_address', 'Copy Address')}</span>
            </button>
            <button
              onClick={handleToggleConnect}
              className="py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-500/30 text-xs font-semibold text-zinc-300 hover:text-red-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isConnectedState ? t('disconnect', 'Disconnect') : t('reconnect', 'Reconnect')}</span>
            </button>
          </div>

          {/* Phase 2 wallet modal trigger */}
          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
            <button
              onClick={() => {
                setShowWalletDropdown(false);
                onOpenWalletModal();
              }}
              className="w-full text-[11px] text-zinc-400 hover:text-emerald-400 transition-colors block text-center cursor-pointer py-1"
            >
              {t('wallet_switch_provider', 'Switch Wallet Provider (MetaMask / WalletConnect)')}
            </button>

            {onReturnToLanding && (
              <button
                onClick={() => {
                  setShowWalletDropdown(false);
                  onReturnToLanding();
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 hover:border-emerald-400 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{t('dash_public_site', 'Public Front Website')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};