import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Layers, 
  Coins, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  Network, 
  Award, 
  ArrowRight, 
  Copy, 
  Check, 
  Heart, 
  Share2 
} from 'lucide-react';
import { 
  UserProfile, 
  RewardBalances, 
  PackageItem, 
  ActivityItem, 
  NavPage 
} from '../types';
import { MbttcCoin3D } from '../components/MbttcCoin3D';
import { CommunityActivityFeed } from '../components/CommunityActivityFeed';
import { CommunityRatingSection } from '../components/CommunityRatingSection';
import { formatCompactAddress, copyFullAddress } from '../utils/formatAddress';
import { calculateEcosystemIncome, calculateTotalEcosystemIncome } from '../data/incomeData';
import { useLanguage } from '../context/LanguageContext';
import { contractAdapter } from '../services/contractAdapter';
import { getContractProvider } from '../services/contractProvider';
import { ethers } from 'ethers';

export interface TokenMintingTelemetry {
  totalSupply?: number;
  mintedAmount?: number;
  remainingAmount?: number;
  mintedPercentage?: number;
  isContractConnected?: boolean;
}

interface OverviewViewProps {
  user: UserProfile;
  rewards: RewardBalances;
  packages: PackageItem[];
  activities: ActivityItem[];
  mintingTelemetry?: TokenMintingTelemetry;
  onNavigate: (page: NavPage) => void;
  onOpenClaimModal: (type: 'Registration' | 'Referral' | 'Package') => void;
  onOpenMatrixModal: () => void;
  onTriggerRewardPopup?: (amount: number, type: string) => void;
}

interface IOnChainPhaseRewards {
  regReward: string;
  refReward: string;
  user25PkgReward: string;
  sponsor25Reward: string;
  sponsor10Reward: string;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  user,
  rewards,
  packages,
  activities,
  mintingTelemetry,
  onNavigate,
  onOpenClaimModal,
  onOpenMatrixModal,
}) => {
  const { t } = useLanguage();
  const [chartTimeframe, setChartTimeframe] = useState<'7D' | '30D' | 'ALL'>('30D');
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; date: string; value: string } | null>(null);
  const [copiedRefLink, setCopiedRefLink] = useState<boolean>(false);

  // Live On-Chain Phase Rewards
  const [phaseRewards, setPhaseRewards] = useState<IOnChainPhaseRewards>({
    regReward: '30',
    refReward: '20',
    user25PkgReward: '50',
    sponsor25Reward: '30',
    sponsor10Reward: '25',
  });

  // On-Chain 4-Hour Cooldown States
  const [refCooldown, setRefCooldown] = useState<{ remaining: number; hasClaimedBefore: boolean }>({
    remaining: 0,
    hasClaimedBefore: false,
  });
  const [pkgCooldown, setPkgCooldown] = useState<{ remaining: number; hasClaimedBefore: boolean }>({
    remaining: 0,
    hasClaimedBefore: false,
  });

  // Sync Live On-Chain Data (Phase rewards + Cooldowns)
  const syncOnChainData = async () => {
    try {
      const provider = getContractProvider(true);
      const res = await provider.read<any>('mdefiHub', 'getPhaseRewards', []);
      if (res) {
        setPhaseRewards({
          regReward: ethers.formatUnits(res[0]?.toString() || '0', 18),
          refReward: ethers.formatUnits(res[1]?.toString() || '0', 18),
          user25PkgReward: ethers.formatUnits(res[2]?.toString() || '0', 18),
          sponsor25Reward: ethers.formatUnits(res[3]?.toString() || '0', 18),
          sponsor10Reward: ethers.formatUnits(res[4]?.toString() || '0', 18),
        });
      }
    } catch (e) {
      console.warn('[OverviewView] getPhaseRewards read failed:', e);
    }

    if (!user.walletAddress) return;

    try {
      const [refInfo, pkgInfo] = await Promise.all([
        contractAdapter.getHubClaimCooldown(user.walletAddress, 'Referral'),
        contractAdapter.getHubClaimCooldown(user.walletAddress, 'Package'),
      ]);

      setRefCooldown({
        remaining: refInfo.cooldownSecondsRemaining,
        hasClaimedBefore: refInfo.lastClaimTimestamp > 0,
      });

      setPkgCooldown({
        remaining: pkgInfo.cooldownSecondsRemaining,
        hasClaimedBefore: pkgInfo.lastClaimTimestamp > 0,
      });
    } catch (e) {
      console.error('[OverviewView] Error syncing cooldowns:', e);
    }
  };

  useEffect(() => {
    syncOnChainData();
    const refreshSub = contractAdapter.onDataRefresh(() => {
      syncOnChainData();
    });
    return () => {
      refreshSub();
    };
  }, [user.walletAddress]);

  // Exact 1-second countdown tick
  useEffect(() => {
    const timer = setInterval(() => {
      setRefCooldown((prev) => ({
        ...prev,
        remaining: prev.remaining > 0 ? prev.remaining - 1 : 0,
      }));
      setPkgCooldown((prev) => ({
        ...prev,
        remaining: prev.remaining > 0 ? prev.remaining - 1 : 0,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const referralLink = useMemo(() => {
    const refCode = user.userId || user.walletAddress;
    return `https://www.mdefipro.xyz/?ref=${refCode}`;
  }, [user.userId, user.walletAddress]);

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedRefLink(true);
      setTimeout(() => setCopiedRefLink(false), 2500);
    } catch {
      copyFullAddress(referralLink);
      setCopiedRefLink(true);
      setTimeout(() => setCopiedRefLink(false), 2500);
    }
  };

  const balanceCardRef = useRef<HTMLDivElement>(null);
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0 });

  const isNavigatingRef = useRef(false);
  const handleSafeNavigate = (page: NavPage) => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    onNavigate(page);
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 400);
  };

  const totalEcosystemYieldsUsdt = useMemo(() => {
    return calculateTotalEcosystemIncome(calculateEcosystemIncome(user, rewards));
  }, [user, rewards]);

  const totalEcosystemYieldsMbttc = useMemo(() => {
    const rate = rewards.demoUsdRate || 1.5;
    return (totalEcosystemYieldsUsdt / rate).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [totalEcosystemYieldsUsdt, rewards.demoUsdRate]);

  const monthlyTeamTarget = 250;
  const monthlyProgressPercent = useMemo(() => {
    return Math.min(100, Math.floor((user.totalTeamCount / monthlyTeamTarget) * 100));
  }, [user.totalTeamCount, monthlyTeamTarget]);

  const activePackageCards = useMemo(() => {
    const definitions = [
      {
        id: 's4-10',
        name: 'S4 Node',
        priceUSD: 10,
        priceFormatted: '$10',
        matchPredicate: (p: PackageItem) => p.id === 'pkg-junior' || p.priceUSD === 10 || p.name.toLowerCase().includes('junior'),
      },
      {
        id: 's4-25',
        name: 'S4 Node',
        priceUSD: 25,
        priceFormatted: '$25',
        matchPredicate: (p: PackageItem) => p.id === 'pkg-senior' || p.priceUSD === 25 || p.name.toLowerCase().includes('senior'),
      },
      {
        id: 'quantum-70',
        name: 'Quantum Matrix',
        priceUSD: 70,
        priceFormatted: '$70',
        matchPredicate: (p: PackageItem) => p.id === 'pkg-quantum' || p.priceUSD === 70 || p.name.toLowerCase().includes('quantum'),
      },
      {
        id: 'nexus-120',
        name: 'Nexus Prime',
        priceUSD: 120,
        priceFormatted: '$120',
        matchPredicate: (p: PackageItem) => p.id === 'pkg-nexus-prime' || p.priceUSD === 120 || p.name.toLowerCase().includes('prime'),
      },
    ];

    return definitions.map((def) => {
      const matchedPkg = packages.find(def.matchPredicate);
      const isActive = matchedPkg ? matchedPkg.status === 'Active' : false;
      return {
        ...def,
        isActive,
      };
    });
  }, [packages]);

  const activePackagesCount = useMemo(() => {
    return activePackageCards.filter((p) => p.isActive).length;
  }, [activePackageCards]);

  const TOTAL_MAX_SUPPLY = mintingTelemetry?.totalSupply ?? 2000000;
  const mintedAmount = mintingTelemetry?.mintedAmount ?? 0;
  const remainingAmount = mintingTelemetry?.remainingAmount ?? Math.max(0, TOTAL_MAX_SUPPLY - mintedAmount);
  const mintedPercent = mintingTelemetry?.mintedPercentage ?? (TOTAL_MAX_SUPPLY > 0 ? (mintedAmount / TOTAL_MAX_SUPPLY) * 100 : 0);

  const handleBalanceCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = balanceCardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    setCardTilt({ rx: ((y - cy) / cy) * -6, ry: ((x - cx) / cx) * 6 });
  };

  const chartDatasets = {
    '7D': [
      { x: 50, y: 95, date: 'Day 1', value: `${(rewards.mbttcBalance * 0.7).toFixed(2)} MBTTC` },
      { x: 170, y: 82, date: 'Day 2', value: `${(rewards.mbttcBalance * 0.75).toFixed(2)} MBTTC` },
      { x: 300, y: 70, date: 'Day 3', value: `${(rewards.mbttcBalance * 0.8).toFixed(2)} MBTTC` },
      { x: 440, y: 55, date: 'Day 4', value: `${(rewards.mbttcBalance * 0.85).toFixed(2)} MBTTC` },
      { x: 580, y: 38, date: 'Day 5', value: `${(rewards.mbttcBalance * 0.9).toFixed(2)} MBTTC` },
      { x: 720, y: 22, date: 'Day 6', value: `${(rewards.mbttcBalance * 0.95).toFixed(2)} MBTTC` },
      { x: 800, y: 15, date: 'Today', value: `${rewards.mbttcBalance.toFixed(2)} MBTTC` },
    ],
    '30D': [
      { x: 40, y: 112, date: 'Week 1', value: `${(rewards.mbttcBalance * 0.4).toFixed(2)} MBTTC` },
      { x: 160, y: 96, date: 'Week 2', value: `${(rewards.mbttcBalance * 0.6).toFixed(2)} MBTTC` },
      { x: 290, y: 80, date: 'Week 3', value: `${(rewards.mbttcBalance * 0.8).toFixed(2)} MBTTC` },
      { x: 430, y: 64, date: 'Week 4', value: `${(rewards.mbttcBalance * 0.9).toFixed(2)} MBTTC` },
      { x: 800, y: 15, date: 'Today', value: `${rewards.mbttcBalance.toFixed(2)} MBTTC` },
    ],
    'ALL': [
      { x: 30, y: 115, date: 'Genesis', value: '0.00 MBTTC' },
      { x: 300, y: 82, date: 'Growth', value: `${(rewards.mbttcBalance * 0.5).toFixed(2)} MBTTC` },
      { x: 800, y: 15, date: 'Current', value: `${rewards.mbttcBalance.toFixed(2)} MBTTC` },
    ],
  };

  const currentPoints = chartDatasets[chartTimeframe];

  return (
    <div className="space-y-7 animate-in fade-in duration-300 pb-28 lg:pb-12">
      {/* 1. TOP STATUS BANNER & MINI WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-8 p-4 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-zinc-300">
            <div className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>
              <strong className="text-white">MDeFi Master Hub:</strong> Connected to live on-chain protocol architecture.
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 shrink-0 bg-zinc-950/80 px-3 py-1 rounded-full border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
            <span>Network: BNB Smart Chain Testnet</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('mbttc')}
          className="lg:col-span-4 p-3.5 px-4 rounded-3xl bg-gradient-to-r from-zinc-900/60 to-[#0a140e] border border-emerald-500/25 hover:border-emerald-500/45 cursor-pointer transition-all flex items-center justify-between gap-3 group backdrop-blur-xl shadow-lg shadow-black/40"
        >
          <div className="flex items-center gap-3">
            <div className="shrink-0 group-hover:scale-105 transition-transform">
              <MbttcCoin3D size="sm" interactive={false} autoRotate={true} glow={true} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">MBTTC</span>
                <span className="text-[10px] text-zinc-400 font-mono">{t('overview_balance', 'Balance')}</span>
              </div>
              <div className="text-sm font-extrabold text-white font-mono leading-tight">
                {rewards.mbttcBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('mbttc');
            }}
            className="py-1.5 px-3 rounded-xl bg-emerald-950/70 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black text-emerald-300 text-xs font-bold font-mono transition-all flex items-center gap-1 shrink-0"
          >
            <span>{t('overview_view_token', 'View Token')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. REFERRAL LINK & INVITATION CARD */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#06180f] via-[#082015] to-[#05140d] border border-emerald-500/30 shadow-[0_0_35px_rgba(16,185,129,0.12)] backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-900/50 border border-emerald-500/40 text-emerald-300">
                <Share2 className="w-4 h-4" />
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
                Personal Referral Link
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                Live On-Chain
              </span>
            </div>
            <p className="text-xs text-zinc-300">
              Share your direct referral link to recruit frontline partners and earn multi-tier matrix rewards on BNB Smart Chain.
            </p>
          </div>

          <div className="w-full md:w-auto flex-1 max-w-md flex flex-col sm:flex-row items-center gap-2.5">
            <div className="w-full flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-emerald-500/30 font-mono text-xs text-emerald-300 truncate select-all shadow-inner">
              {referralLink}
            </div>

            <button
              onClick={handleCopyReferralLink}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer ${
                copiedRefLink
                  ? 'bg-emerald-500 text-black shadow-[0_0_16px_rgba(16,185,129,0.5)]'
                  : 'bg-emerald-950/80 hover:bg-emerald-500 hover:text-black border border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              }`}
            >
              {copiedRefLink ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. TOKEN MINTING OVERVIEW CARD */}
      <div
        ref={balanceCardRef}
        onMouseMove={handleBalanceCardMouseMove}
        onMouseLeave={() => setCardTilt({ rx: 0, ry: 0 })}
        className="relative rounded-3xl bg-gradient-to-br from-[#0a1812] via-[#07130e] to-[#050b08] border border-emerald-500/35 p-5 sm:p-8 lg:p-9 shadow-[0_0_55px_rgba(16,185,129,0.12)] overflow-hidden transition-transform duration-300 backdrop-blur-2xl"
        style={{
          perspective: 1000,
          transform: `rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg)`,
        }}
      >
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-ambient-pulse" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 lg:gap-12">
          <div className="space-y-4 flex-1 min-w-0 w-full">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  {t('overview_token_minting', 'TOKEN MINTING OVERVIEW')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-semibold">
                  Live Contract Sync
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Live Contract Telemetry
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1 border-b border-zinc-800/80 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                  TOTAL SUPPLY
                </span>
                <div className="flex items-baseline gap-2.5">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
                    {TOTAL_MAX_SUPPLY.toLocaleString('en-US')}
                  </h2>
                  <span className="text-xl sm:text-2xl lg:text-3xl text-emerald-400 font-mono font-extrabold">
                    MBTTC
                  </span>
                </div>
              </div>

              <div className="sm:text-right mt-2 sm:mt-0">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                  MINTED %
                </span>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-zinc-950 border border-emerald-500/40">
                  <span className="text-lg sm:text-xl font-black text-emerald-300 font-mono">
                    {mintedPercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-emerald-500/25">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block mb-1">
                  CIRCULATING MINTED
                </span>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  {mintedAmount.toLocaleString('en-US')}{' '}
                  <span className="text-xs text-emerald-400 font-bold">MBTTC</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block mb-1">
                  REMAINING CEILING
                </span>
                <div className="text-xl sm:text-2xl font-black text-zinc-200 font-mono">
                  {remainingAmount.toLocaleString('en-US')}{' '}
                  <span className="text-xs text-zinc-400 font-bold">MBTTC</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="w-full h-3 rounded-full bg-zinc-950/90 border border-emerald-500/30 p-0.5 relative overflow-hidden shadow-inner">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(0, mintedPercent))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono pt-0.5">
                <span>Phase 1 (0 – 10k Users)[cite: 7]</span>
                <span>Phase 2 (10k – 25k Users)[cite: 7]</span>
                <span>Phase 3 (25k+ Cap)[cite: 7]</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 shrink-0">
            <MbttcCoin3D size="hero" interactive={true} autoRotate={true} glow={true} />
            <button
              onClick={() => onNavigate('mbttc')}
              className="web3-btn-primary py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white font-extrabold text-xs tracking-wide transition-all border border-emerald-400/50 shadow-[0_0_24px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('overview_view_token', 'View MBTTC')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. TOTAL REWARDS PORTFOLIO */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0c1611] via-[#08120d] to-[#060a08] border border-emerald-500/25 p-4 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.08)] overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono block mb-2">
              TOTAL MDEFI REWARDS
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
              {rewards.mbttcBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-2xl sm:text-3xl text-emerald-400 font-bold">MBTTC</span>
            </h1>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-950/90 border border-zinc-800">
            {(['7D', '30D', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setChartTimeframe(tf)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  chartTimeframe === tf 
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-6 pt-4 border-t border-zinc-900/90">
          <div className="h-36 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 130" preserveAspectRatio="none">
              <path
                d={`M ${currentPoints[0].x},${currentPoints[0].y} ` + currentPoints.map((p) => `L ${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {currentPoints.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint?.index === idx ? 6 : 4}
                  fill={hoveredPoint?.index === idx ? '#34d399' : '#10b981'}
                  stroke="#070b08"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPoint({ index: idx, date: pt.date, value: pt.value })}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* 5. OPEN HUB BANNER */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#041a10] via-[#062416] to-[#04140d] border border-emerald-500/35 backdrop-blur-xl shadow-[0_0_35px_rgba(16,185,129,0.14)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="p-3 rounded-2xl bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-bold text-white tracking-wide font-mono block">
              MDeFi Ecosystem Hub
            </span>
            <p className="text-xs text-zinc-300 mt-0.5">
              Access node staking packages, rewards matrix & tokenomics telemetry
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('hub')}
          className="web3-btn-primary w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#063a23] via-[#095232] to-[#0d6b41] hover:from-[#08472b] hover:via-[#0c613c] hover:to-[#107d4d] active:scale-[0.98] border border-emerald-400/60 text-white font-bold text-sm tracking-wide shadow-[0_0_24px_rgba(16,185,129,0.35)] flex items-center justify-center gap-3 cursor-pointer shrink-0"
        >
          <Layers className="w-4.5 h-4.5 text-emerald-300" />
          <span>Open MDeFi Hub</span>
          <ArrowRight className="w-4 h-4 text-emerald-300" />
        </button>
      </div>

      {/* 6. FOUR SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div onClick={() => onNavigate('team')} className="p-5 rounded-2xl bg-zinc-900/40 border border-emerald-500/15 hover:border-emerald-500/40 transition-all cursor-pointer">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono block mb-2">DIRECT TEAM</span>
          <span className="text-3xl font-extrabold text-white font-mono">{user.directTeamCount}</span>
        </div>

        <div onClick={() => onNavigate('team')} className="p-5 rounded-2xl bg-zinc-900/40 border border-emerald-500/15 hover:border-emerald-500/40 transition-all cursor-pointer">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono block mb-2">TOTAL TEAM</span>
          <span className="text-3xl font-extrabold text-white font-mono">{user.totalTeamCount}</span>
        </div>

        <div onClick={() => onNavigate('packages')} className="p-4 sm:p-5 rounded-2xl bg-zinc-900/40 border border-emerald-500/15 hover:border-emerald-500/40 transition-all cursor-pointer">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono block mb-2">ACTIVE PACKAGES</span>
          <span className="text-xs font-mono font-bold text-emerald-400">{activePackagesCount}/4 Active</span>
        </div>

        <div onClick={() => onNavigate('mbttc')} className="p-5 rounded-2xl bg-zinc-900/40 border border-emerald-500/15 hover:border-emerald-500/40 transition-all cursor-pointer">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono block mb-2">TOTAL REWARDS</span>
          <span className="text-2xl font-extrabold text-white font-mono">{rewards.mbttcBalance.toFixed(2)} MBTTC</span>
        </div>
      </div>

      {/* 7. ACCOUNT HEALTH CARD */}
      <div className="p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Account Health</h2>
              <span className="text-xs text-zinc-400 font-mono">Verified Node Status — BNB Smart Chain</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/70 border border-red-500/35">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/40 animate-pulse" />
              <span className="text-[10px] text-red-300 font-mono font-bold uppercase">72 BPM</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-500/30 px-3 py-1 rounded-full">
              Registration ACTIVE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5">
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Registration</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">ACTIVE</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">User ID</span>
            <span className="text-sm font-bold text-white font-mono">{user.userId}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Sponsor</span>
            <span className="text-sm font-bold text-emerald-300 font-mono truncate block">
              {user.sponsorId ? formatCompactAddress(user.sponsorId) : 'None (Genesis)'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-emerald-500/20">
            <span className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Registration Reward</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {phaseRewards.regReward} MBTTC (Auto-Minted)
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 col-span-2 md:col-span-1">
            <span className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">Member Since</span>
            <span className="text-sm font-medium text-zinc-200">{user.memberSince || 'Active'}</span>
          </div>
        </div>
      </div>

      {/* 8. REWARD CENTER (REAL ON-CHAIN 4-HOUR COUNTDOWN ENGINE) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
              REWARD CENTER
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Vesting Pull-Payment Dispatcher
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: REGISTRATION REWARD */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">REGISTRATION REWARD</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {phaseRewards.regReward} MBTTC
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-4 leading-relaxed">
                Registration rewards are minted directly into your wallet by the Hub contract upon verified account creation[cite: 7].
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-800">
              <button
                disabled={true}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-emerald-400/80 text-xs font-bold font-mono opacity-80 cursor-not-allowed text-center"
              >
                MINTED ON-CHAIN AT REGISTRATION
              </button>
            </div>
          </div>

          {/* Card 2: REFERRAL REWARD */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/25 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">REFERRAL REWARD</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  2% Vesting (200 BPS)[cite: 7]
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">Total Claimed</span>
                  <span className="font-mono font-bold text-zinc-300">{rewards.referralClaimed} MBTTC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-400 block mb-0.5 font-bold">Claimable</span>
                  <span className="font-mono font-bold text-emerald-300 text-sm">{rewards.referralClaimable} MBTTC</span>
                </div>
              </div>

              {/* Countdown status */}
              <div className="mt-4 flex justify-between items-center text-xs font-mono">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> Cooldown:
                </span>
                {!refCooldown.hasClaimedBefore ? (
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    Ready to Claim
                  </span>
                ) : refCooldown.remaining > 0 ? (
                  <span className="text-amber-400 font-bold bg-zinc-950 px-2 py-0.5 rounded border border-amber-500/30">
                    {formatCountdown(refCooldown.remaining)}
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    Ready to Claim
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-800">
              <button
                onClick={() => onOpenClaimModal('Referral')}
                disabled={rewards.referralClaimable <= 0 || (refCooldown.hasClaimedBefore && refCooldown.remaining > 0)}
                className="web3-btn-primary w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-extrabold text-xs transition-all shadow-[0_0_18px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>CLAIM ({rewards.referralClaimable} MBTTC)</span>
              </button>
            </div>
          </div>

          {/* Card 3: PACKAGE REWARD */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/25 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">PACKAGE REWARD</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  3% Vesting (300 BPS)[cite: 7]
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">Total Claimed</span>
                  <span className="font-mono font-bold text-zinc-300">{rewards.packageClaimed} MBTTC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-400 block mb-0.5 font-bold">Claimable</span>
                  <span className="font-mono font-bold text-emerald-300 text-sm">{rewards.packageClaimable} MBTTC</span>
                </div>
              </div>

              {/* Countdown status */}
              <div className="mt-4 flex justify-between items-center text-xs font-mono">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> Cooldown:
                </span>
                {!pkgCooldown.hasClaimedBefore ? (
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    Ready to Claim
                  </span>
                ) : pkgCooldown.remaining > 0 ? (
                  <span className="text-amber-400 font-bold bg-zinc-950 px-2 py-0.5 rounded border border-amber-500/30">
                    {formatCountdown(pkgCooldown.remaining)}
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    Ready to Claim
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-800">
              <button
                onClick={() => onOpenClaimModal('Package')}
                disabled={rewards.packageClaimable <= 0 || (pkgCooldown.hasClaimedBefore && pkgCooldown.remaining > 0)}
                className="web3-btn-primary w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-extrabold text-xs transition-all shadow-[0_0_18px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>CLAIM ({rewards.packageClaimable} MBTTC)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 9. COMMUNITY FEEDS & REPUTATION */}
      <CommunityActivityFeed onNavigate={onNavigate} userActivities={activities} />
      <CommunityRatingSection userWallet={user.walletAddress} />
    </div>
  );
};