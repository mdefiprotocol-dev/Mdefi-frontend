import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Layers, 
  Coins, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Info,
  Network,
  Award,
  Wallet,
  Zap,
  ArrowRight,
  Send,
  Eye,
  Activity,
  Copy,
  Check,
  Heart
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
import { getTransactionVisual } from '../utils/transactionVisuals';
import { formatCompactAddress, copyFullAddress } from '../utils/formatAddress';
import { calculateEcosystemIncome, calculateTotalEcosystemIncome } from '../data/incomeData';
import { useLanguage } from '../context/LanguageContext';

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

export const OverviewView: React.FC<OverviewViewProps> = ({
  user,
  rewards,
  packages,
  activities,
  mintingTelemetry,
  onNavigate,
  onOpenClaimModal,
  onOpenMatrixModal,
  onTriggerRewardPopup,
}) => {
  const { t } = useLanguage();
  // Live ticking countdown for next claims
  const [referralCountdown, setReferralCountdown] = useState(rewards.nextReferralClaimSec);
  const [packageCountdown, setPackageCountdown] = useState(rewards.nextPackageClaimSec);
  const [chartTimeframe, setChartTimeframe] = useState<'7D' | '30D' | 'ALL'>('30D');
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; date: string; value: string } | null>(null);
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  const handleCopyTx = async (hash: string, id: string) => {
    const ok = await copyFullAddress(hash);
    if (ok) {
      setCopiedTxId(id);
      setTimeout(() => setCopiedTxId(null), 2000);
    }
  };

  // 3D Coin balance card interactive tilt
  const balanceCardRef = useRef<HTMLDivElement>(null);
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0 });
  const [cardHover, setCardHover] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setReferralCountdown((prev) => (prev > 0 ? prev - 1 : 18000));
      setPackageCountdown((prev) => (prev > 0 ? prev - 1 : 12000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  // Safe debounce navigation lock to prevent duplicate route execution or UI hang
  const isNavigatingRef = useRef(false);
  const handleSafeNavigate = (page: NavPage) => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    onNavigate(page);
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 400);
  };

  // Total Ecosystem Yields connected to the existing Income Section calculations
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

  // Monthly team growth progress calculated from existing team-growth data source (250 Target)
  const monthlyTeamTarget = 250;
  const monthlyProgressPercent = useMemo(() => {
    return Math.min(100, Math.floor((user.totalTeamCount / monthlyTeamTarget) * 100));
  }, [user.totalTeamCount, monthlyTeamTarget]);

  // 4 Standard Protocol Packages with dynamic contract/demo status mapping
  const activePackageCards = useMemo(() => {
    const definitions = [
      {
        id: 's4-10',
        name: 'S4 Node',
        priceUSD: 10,
        priceFormatted: '$10',
        title: 'S4 Node — $10',
        matchPredicate: (p: PackageItem) => p.id === 'pkg-junior' || p.priceUSD === 10 || p.name.toLowerCase().includes('junior'),
      },
      {
        id: 's4-25',
        name: 'S4 Node',
        priceUSD: 25,
        priceFormatted: '$25',
        title: 'S4 Node — $25',
        matchPredicate: (p: PackageItem) => p.id === 'pkg-senior' || p.priceUSD === 25 || p.name.toLowerCase().includes('senior'),
      },
      {
        id: 'quantum-70',
        name: 'Quantum Matrix',
        priceUSD: 70,
        priceFormatted: '$70',
        title: 'Quantum Matrix — $70',
        matchPredicate: (p: PackageItem) => p.id === 'pkg-quantum' || p.priceUSD === 70 || p.name.toLowerCase().includes('quantum'),
      },
      {
        id: 'nexus-120',
        name: 'Nexus Prime',
        priceUSD: 120,
        priceFormatted: '$120',
        title: 'Nexus Prime — $120',
        matchPredicate: (p: PackageItem) => p.id === 'pkg-nexus-prime' || p.priceUSD === 120 || p.name.toLowerCase().includes('prime'),
      },
    ];

    return definitions.map((def) => {
      const matchedPkg = packages.find(def.matchPredicate);
      const isActive = matchedPkg ? matchedPkg.status === 'Active' : false;
      return {
        ...def,
        isActive,
        statusLabel: isActive ? 'ACTIVE' : 'INACTIVE',
      };
    });
  }, [packages]);

  const activePackagesCount = useMemo(() => {
    return activePackageCards.filter((p) => p.isActive).length;
  }, [activePackageCards]);

  const totalRewardsMbttc = '1,284.50';
  const totalRewardsUsd = '2,595.00';
  const demoBalanceUsd = (rewards.mbttcBalance * rewards.demoUsdRate).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Total maximum supply: 2,000,000 MBTTC
  const TOTAL_MAX_SUPPLY = mintingTelemetry?.totalSupply ?? 2000000;
  // Dynamic contract telemetry ready: when real MBTTC smart contract is connected,
  // it provides live on-chain token supply/mint data.
  // Until then, gracefully falls back to simulated protocol metrics (e.g. 684,250 MBTTC).
  const mintedAmount = mintingTelemetry?.mintedAmount ?? 684250;
  const remainingAmount = mintingTelemetry?.remainingAmount ?? Math.max(0, TOTAL_MAX_SUPPLY - mintedAmount);
  const mintedPercent = mintingTelemetry?.mintedPercentage ?? ((mintedAmount / TOTAL_MAX_SUPPLY) * 100);

  // Handle pointer tilt for Section 3 & 4 (Balance card 3D hover)
  const handleBalanceCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = balanceCardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -6;
    const ry = ((x - cx) / cx) * 6;
    setCardTilt({ rx, ry });
  };

  const handleBalanceCardLeave = () => {
    setCardHover(false);
    setCardTilt({ rx: 0, ry: 0 });
  };

  // Chart points for 7D / 30D / ALL
  const chartDatasets = {
    '7D': [
      { x: 50, y: 95, date: 'Aug 29', value: '1,120.00 MBTTC' },
      { x: 170, y: 82, date: 'Aug 30', value: '1,154.50 MBTTC' },
      { x: 300, y: 70, date: 'Aug 31', value: '1,192.00 MBTTC' },
      { x: 440, y: 55, date: 'Sep 01', value: '1,224.00 MBTTC' },
      { x: 580, y: 38, date: 'Sep 02', value: '1,250.00 MBTTC' },
      { x: 720, y: 22, date: 'Sep 03', value: '1,268.00 MBTTC' },
      { x: 800, y: 15, date: 'Today (Sep 04)', value: '1,284.50 MBTTC' },
    ],
    '30D': [
      { x: 40, y: 112, date: 'Aug 05', value: '820.00 MBTTC' },
      { x: 160, y: 96, date: 'Aug 12', value: '940.00 MBTTC' },
      { x: 290, y: 80, date: 'Aug 19', value: '1,050.00 MBTTC' },
      { x: 430, y: 64, date: 'Aug 26', value: '1,160.00 MBTTC' },
      { x: 570, y: 44, date: 'Sep 01', value: '1,230.00 MBTTC' },
      { x: 710, y: 26, date: 'Sep 03', value: '1,270.00 MBTTC' },
      { x: 800, y: 15, date: 'Today (Sep 04)', value: '1,284.50 MBTTC' },
    ],
    'ALL': [
      { x: 30, y: 115, date: 'May 18 (Genesis)', value: '100.00 MBTTC' },
      { x: 160, y: 98, date: 'Jun 15', value: '380.00 MBTTC' },
      { x: 300, y: 82, date: 'Jul 10', value: '650.00 MBTTC' },
      { x: 450, y: 60, date: 'Aug 05', value: '890.00 MBTTC' },
      { x: 600, y: 40, date: 'Aug 25', value: '1,140.00 MBTTC' },
      { x: 730, y: 24, date: 'Sep 01', value: '1,240.00 MBTTC' },
      { x: 800, y: 15, date: 'Today (Sep 04)', value: '1,284.50 MBTTC' },
    ],
  };

  const currentPoints = chartDatasets[chartTimeframe];

  return (
    <div className="space-y-7 animate-in fade-in duration-300 pb-28 lg:pb-12">
      {/* 12. MBTTC MINI WIDGET & TOP STATUS BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Top Sandbox Notice */}
        <div className="lg:col-span-8 p-4 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-zinc-300">
            <div className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>
              <strong className="text-white">{t('overview_prototype', 'MDeFi Hub Prototype:')}</strong> {t('overview_sandbox_notice', 'Operating in isolated sandbox mode with simulated blockchain ledger and mock telemetry.')}
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 shrink-0 bg-zinc-950/80 px-3 py-1 rounded-full border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
            <span>Network: Demo Network</span>
          </div>
        </div>

        {/* 12. MBTTC MINI WIDGET: MBTTC | 12,540.00 Balance | [View Token] + 3D Coin */}
        <div 
          onClick={() => onNavigate('mbttc')}
          className="lg:col-span-4 p-3.5 px-4 rounded-3xl bg-gradient-to-r from-zinc-900/60 to-[#0a140e] border border-emerald-500/25 hover:border-emerald-500/45 cursor-pointer transition-all flex items-center justify-between gap-3 group backdrop-blur-xl shadow-lg shadow-black/40"
          title="Open MBTTC Token Center"
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
                12,540.00
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

      {/* 4. MBTTC TOKEN MINTING OVERVIEW CARD WITH 3D COIN & DYNAMIC PROGRESS */}
      <div
        ref={balanceCardRef}
        onMouseMove={handleBalanceCardMouseMove}
        onMouseEnter={() => setCardHover(true)}
        onMouseLeave={handleBalanceCardLeave}
        className="relative rounded-3xl bg-gradient-to-br from-[#0a1812] via-[#07130e] to-[#050b08] border border-emerald-500/35 p-5 sm:p-8 lg:p-9 shadow-[0_0_55px_rgba(16,185,129,0.12)] overflow-hidden transition-transform duration-300 backdrop-blur-2xl"
        style={{
          perspective: 1000,
          transform: `rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg)`,
        }}
      >
        {/* Subtle animated floating particles & pulsating ambient green/cyan glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-ambient-pulse" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Ambient floating particle dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-emerald-400/30 blur-[0.5px] animate-pulse" />
          <span className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-emerald-300/25 blur-[1px] animate-pulse delay-700" />
          <span className="absolute bottom-1/4 left-1/5 w-1 h-1 rounded-full bg-cyan-400/30 animate-ping" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 lg:gap-12">
          {/* Left Column: Token Minting & Supply Telemetry */}
          <div className="space-y-4 flex-1 min-w-0 w-full">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  {t('overview_token_minting', 'TOKEN MINTING OVERVIEW')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-semibold shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                  {t('overview_phase_active', { phase: 1 })}
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {mintingTelemetry?.isContractConnected ? t('overview_telemetry_onchain', 'On-Chain Telemetry') : t('overview_telemetry_simulated', 'Simulated Telemetry')}
              </span>
            </div>

            {/* Main Total Supply Highlight */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1 border-b border-zinc-800/80 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                  {t('mbttc_supply', 'TOTAL SUPPLY')}
                </span>
                <div className="flex items-baseline gap-2.5">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                    {TOTAL_MAX_SUPPLY.toLocaleString('en-US')}
                  </h2>
                  <span className="text-xl sm:text-2xl lg:text-3xl text-emerald-400 font-mono font-extrabold drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                    MBTTC
                  </span>
                </div>
              </div>

              {/* Minted % Pill Badge */}
              <div className="sm:text-right mt-2 sm:mt-0">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                  {t('overview_minted_ratio', 'MINTED %')}
                </span>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-zinc-950 border border-emerald-500/40 shadow-[0_0_14px_rgba(16,185,129,0.2)]">
                  <span className="text-lg sm:text-xl font-black text-emerald-300 font-mono">
                    {mintedPercent.toFixed(2)}%
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">Minted</span>
                </div>
              </div>
            </div>

            {/* MINTED vs REMAINING Sub-Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-emerald-500/25">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">
                    {t('overview_circulating_supply', 'MINTED')}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Circulating Float
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  {mintedAmount.toLocaleString('en-US')}{' '}
                  <span className="text-xs text-emerald-400 font-bold">MBTTC</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">
                  Minted via Registration & Node Staking
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">
                    {t('overview_remaining_mintable', 'REMAINING')}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                    Remaining to Mint
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-zinc-200 font-mono">
                  {remainingAmount.toLocaleString('en-US')}{' '}
                  <span className="text-xs text-zinc-400 font-bold">MBTTC</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">
                  Strict 2,000,000 hard ceiling cap
                </span>
              </div>
            </div>

            {/* Premium Animated Progress Bar with Phases */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Minting Progress
                </span>
                <span className="text-emerald-300 font-bold">
                  {mintedAmount.toLocaleString('en-US')} / {TOTAL_MAX_SUPPLY.toLocaleString('en-US')} MBTTC
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-3 rounded-full bg-zinc-950/90 border border-emerald-500/30 p-0.5 relative overflow-hidden shadow-inner">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_16px_rgba(52,211,153,0.5)] transition-all duration-1000 relative"
                  style={{ width: `${Math.min(100, Math.max(1, mintedPercent))}%` }}
                >
                  {/* Subtle shine highlight */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-zinc-400 font-mono pt-0.5">
                <span>Phase 1 (0 – 500k)</span>
                <span>Phase 2 (500k – 1.2M)</span>
                <span>Phase 3 (1.2M – 2.0M Cap)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent HD 3D MBTTC Coin & Action Button */}
          <div className="flex flex-col sm:flex-row md:flex-col items-center gap-6 self-center md:self-auto shrink-0 justify-center">
            <div 
              className="transition-transform duration-300 cursor-pointer hover:scale-105"
              onClick={() => onNavigate('mbttc')}
              title="Click to view MBTTC Token details"
            >
              <div className="hidden sm:block">
                <MbttcCoin3D size="hero" interactive={true} autoRotate={true} glow={true} />
              </div>
              <div className="block sm:hidden">
                <MbttcCoin3D size="xl" interactive={true} autoRotate={true} glow={true} />
              </div>
            </div>

            <div className="flex flex-col gap-2.5 items-center sm:items-stretch">
              <button
                onClick={() => onNavigate('mbttc')}
                className="web3-btn-primary py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs tracking-wide transition-all border border-emerald-400/50 shadow-[0_0_24px_rgba(16,185,129,0.35)] hover:shadow-[0_0_36px_rgba(52,211,153,0.55)] active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{t('overview_view_token', 'View MBTTC')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-[11px] text-zinc-400 font-mono text-center">
                1 MBTTC ≈ $1.50 USD Benchmark
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. PORTFOLIO / TOTAL REWARDS CARD WITH ANIMATED REWARD CHART */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0c1611] via-[#08120d] to-[#060a08] border border-emerald-500/25 p-4 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.08)] overflow-hidden backdrop-blur-xl">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-4">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
                {t('overview_total_rewards', 'TOTAL MDEFI REWARDS')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/35 text-emerald-400 text-[10px] font-mono font-semibold">
                {t('overview_demo_value', 'DEMO VALUE')}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                {totalRewardsMbttc} <span className="text-2xl sm:text-3xl text-emerald-400 font-bold">MBTTC</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="text-base text-zinc-300 font-mono font-semibold">
                ≈ ${totalRewardsUsd} USD
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                <TrendingUp className="w-3 h-3" />
                +14.8% this cycle
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {t('overview_simulated_activity', 'SIMULATED REWARD ACTIVITY')}
              </span>
            </div>
          </div>

          {/* 7D / 30D / ALL selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-950/90 border border-zinc-800 self-start lg:self-auto">
            {(['7D', '30D', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  setChartTimeframe(tf);
                  setHoveredPoint(null);
                }}
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

        {/* Animated Reward Chart with Interactive Tooltip */}
        <div className="relative mt-6 pt-4 border-t border-zinc-900/90">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-2">
            <span className="text-zinc-300">{t('overview_simulated_activity', 'SIMULATED REWARD ACTIVITY')}</span>
            <span className="text-emerald-400 font-semibold">
              {hoveredPoint ? `${hoveredPoint.date}: ${hoveredPoint.value}` : 'Hover points to view cycle yields'}
            </span>
          </div>

          <div className="h-36 w-full relative">
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox="0 0 800 130" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.30" />
                  <stop offset="60%" stopColor="#10b981" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Fill under curve */}
              <path
                d={`M 0,130 L ${currentPoints[0].x},${currentPoints[0].y} ` +
                  currentPoints.map((p) => `L ${p.x},${p.y}`).join(' ') +
                  ` L 800,${currentPoints[currentPoints.length - 1].y} L 800,130 Z`}
                fill="url(#chartAreaGrad)"
                className="transition-all duration-500"
              />

              {/* Glowing Animated Chart Line */}
              <path
                d={`M ${currentPoints[0].x},${currentPoints[0].y} ` +
                  currentPoints.map((p) => `L ${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_12px_#10b981] transition-all duration-500"
              />

              {/* Interactive Points */}
              {currentPoints.map((pt, idx) => (
                <g key={idx} className="cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.index === idx ? 6 : 4}
                    fill={hoveredPoint?.index === idx ? '#34d399' : '#10b981'}
                    stroke="#070b08"
                    strokeWidth="2"
                    className="transition-all duration-200"
                    onMouseEnter={() => setHoveredPoint({ index: idx, date: pt.date, value: pt.value })}
                  />
                  {/* Invisible larger touch target for mobile/mouse */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="16"
                    fill="transparent"
                    onMouseEnter={() => setHoveredPoint({ index: idx, date: pt.date, value: pt.value })}
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Timeline labels */}
          <div className="flex justify-between text-[11px] text-zinc-400 font-mono pt-2 border-t border-zinc-900">
            {currentPoints.map((p, idx) => (
              <span key={idx} className={idx === currentPoints.length - 1 ? 'text-emerald-400 font-bold' : ''}>
                {p.date}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. CLEARLY VISIBLE PREMIUM DARK-GREEN DASHBOARD ACTION BUTTON: Open MDefi Hub */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#041a10] via-[#062416] to-[#04140d] border border-emerald-500/35 backdrop-blur-xl shadow-[0_0_35px_rgba(16,185,129,0.14)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="p-3 rounded-2xl bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0">
            <Layers className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-white tracking-wide font-mono">
                {t('overview_ecosystem_hub', 'MDeFi Ecosystem Hub')}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                {t('overview_phase_tag', { phase: 1 })}
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-0.5">
              {t('overview_hub_desc', 'Access node staking packages, rewards matrix & tokenomics telemetry')}
            </p>
          </div>
        </div>

        {/* Requested Action Button */}
        <button
          id="open-mdefi-hub-button"
          onClick={() => onNavigate('hub')}
          className="web3-btn-primary w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#063a23] via-[#095232] to-[#0d6b41] hover:from-[#08472b] hover:via-[#0c613c] hover:to-[#107d4d] active:scale-[0.98] border border-emerald-400/60 hover:border-emerald-300 text-white font-bold text-sm tracking-wide shadow-[0_0_24px_rgba(16,185,129,0.35)] hover:shadow-[0_0_36px_rgba(52,211,153,0.55)] transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer shrink-0"
        >
          <Layers className="w-4.5 h-4.5 text-emerald-300 group-hover:scale-110 transition-transform" />
          <span>{t('overview_open_hub', 'Open MDeFi Hub')}</span>
          <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 7. FOUR SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* 1. DIRECT TEAM */}
        <div 
          onClick={() => onNavigate('team')}
          className="p-5 rounded-2xl bg-zinc-900/40 border border-emerald-500/15 hover:border-emerald-500/40 transition-all cursor-pointer group relative overflow-hidden backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">{t('overview_direct_team', 'DIRECT TEAM')}</span>
            <div className="p-2 rounded-xl bg-emerald-950/50 text-emerald-400 group-hover:bg-emerald-900/50 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{user.directTeamCount}</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-0.5">
              Verified <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            {t('overview_frontline_partners', 'Frontline referred partners (Demo)')}
          </span>
        </div>

        {/* 2. TOTAL TEAM */}
        <div 
          onClick={() => onNavigate('team')}
          className="p-5 rounded-2xl bg-zinc-900/40 border border-emerald-500/15 hover:border-emerald-500/40 transition-all cursor-pointer group relative overflow-hidden backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">{t('overview_total_team', 'TOTAL TEAM')}</span>
            <div className="p-2 rounded-xl bg-emerald-950/50 text-emerald-400 group-hover:bg-emerald-900/50 transition-colors">
              <Network className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{user.totalTeamCount}</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-0.5">
              Depth 7 <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            {t('overview_multitier_network', 'Multi-tier community network')}
          </span>
        </div>

        {/* 3. ACTIVE PACKAGES */}
        <div 
          onClick={() => onNavigate('packages')}
          className="p-4 sm:p-5 rounded-2xl bg-zinc-900/40 border border-emerald-500/15 hover:border-emerald-500/40 transition-all cursor-pointer group relative overflow-hidden backdrop-blur-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  {t('overview_active_packages', 'ACTIVE PACKAGES')}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border transition-colors ${
                  activePackagesCount > 0
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {t('overview_packages_active_ratio', `${activePackagesCount}/4 Active`, { active: activePackagesCount, count: activePackagesCount, total: 4 })}
                </span>
              </div>
              <div className="p-1.5 rounded-xl bg-emerald-950/50 text-emerald-400 group-hover:bg-emerald-900/50 transition-colors">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            {/* 4 Compact Premium Web3 Mini-Cards in 2×2 Grid */}
            <div className="grid grid-cols-2 gap-2">
              {activePackageCards.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-200 overflow-hidden relative ${
                    pkg.isActive
                      ? 'bg-gradient-to-br from-emerald-950/50 via-zinc-950/90 to-emerald-950/20 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.12)] hover:border-emerald-400/60 hover:shadow-[0_0_16px_rgba(16,185,129,0.22)]'
                      : 'bg-zinc-950/60 border-zinc-800/70 hover:border-zinc-700/80 opacity-70 hover:opacity-85'
                  }`}
                >
                  {/* Subtle top indicator glow for active cards */}
                  {pkg.isActive && (
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-emerald-400/15 rounded-full blur-md pointer-events-none" />
                  )}

                  {/* Header: Package Title & Status Indicator */}
                  <div className="flex items-start justify-between gap-1 mb-1 relative z-10">
                    <span className={`text-[10px] sm:text-[11px] font-bold font-mono tracking-tight leading-tight line-clamp-1 ${
                      pkg.isActive ? 'text-zinc-100' : 'text-zinc-400'
                    }`}>
                      {pkg.name}
                    </span>
                    {pkg.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[8.5px] font-mono font-bold text-emerald-400 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {t('common_active', 'ACTIVE')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[8.5px] font-mono text-zinc-500 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                        {t('common_inactive', 'INACTIVE')}
                      </span>
                    )}
                  </div>

                  {/* Bottom: Price */}
                  <div className="flex items-baseline justify-between relative z-10">
                    <span className={`text-xs sm:text-sm font-black font-mono tracking-tight ${
                      pkg.isActive ? 'text-emerald-400' : 'text-zinc-500'
                    }`}>
                      {pkg.priceFormatted}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">
                      USD
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <span className="text-[11px] text-zinc-400 mt-2 block">
            {t('overview_staking_yielding', 'Staking node actively yielding')}
          </span>
        </div>

        {/* 4. TOTAL REWARDS */}
        <div 
          onClick={() => onNavigate('mbttc')}
          className="p-5 rounded-2xl bg-zinc-900/40 border border-emerald-500/15 hover:border-emerald-500/40 transition-all cursor-pointer group relative overflow-hidden backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">{t('overview_total_rewards', 'TOTAL REWARDS')}</span>
            <div className="p-2 rounded-xl bg-emerald-950/50 text-emerald-400 group-hover:bg-emerald-900/50 transition-colors">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono">1,284.50</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">MBTTC</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            {t('overview_accumulated_yield', 'Accumulated Protocol Yield')}
          </span>
        </div>
      </div>

      {/* 8. ACCOUNT HEALTH CARD */}
      <div className="p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">{t('overview_account_health', 'Account Health')}</h2>
              <span className="text-xs text-zinc-400 font-mono">{t('overview_verified_node_status', 'Verified Node Status — Demo Data')}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Premium Red Heartbeat / ECG Vitality Indicator */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-950/70 via-rose-950/40 to-zinc-950/80 border border-red-500/35 shadow-[0_0_18px_rgba(239,68,68,0.22)]"
              title="Real-time Node Vitality & Cryptographic Heartbeat"
            >
              <div className="relative flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/40 animate-[pulse_1.6s_ease-in-out_infinite]" />
                <span className="absolute w-2 h-2 rounded-full bg-red-400/50 animate-ping pointer-events-none" />
              </div>
              {/* Subtle animated ECG cardiac rhythm line */}
              <svg className="w-9 h-3 text-red-400/90" viewBox="0 0 36 12" fill="none">
                <path 
                  d="M0 6h9l2-4.5 3 9 2.5-6.5 2 3.5h10.5" 
                  stroke="currentColor" 
                  strokeWidth="1.75" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
              <div className="flex items-center gap-1 font-mono text-[11px]">
                <span className="font-bold text-red-300 uppercase tracking-wider">{t('overview_heartbeat', 'HEARTBEAT')}</span>
                <span className="text-[10px] text-red-400 font-extrabold bg-red-950/90 px-1.5 py-0.5 rounded border border-red-500/30">
                  72 BPM
                </span>
              </div>
            </div>

            {/* Existing Registration ACTIVE status badge */}
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-500/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              {t('overview_registration_active', 'Registration ACTIVE')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5">
          {/* Registration */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">{t('overview_registration', 'Registration')}</span>
            <span className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t('common_active', 'ACTIVE')}
            </span>
          </div>

          {/* User ID */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">{t('overview_user_id', 'User ID')}</span>
            <span className="text-sm font-bold text-white font-mono">
              {user.userId}
            </span>
          </div>

          {/* Sponsor */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">{t('overview_sponsor', 'Sponsor')}</span>
            <span className="text-sm font-bold text-emerald-300 font-mono truncate block">
              {formatCompactAddress(user.sponsorAddress)}
            </span>
          </div>

          {/* Registration Reward */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-emerald-500/20">
            <span className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">{t('overview_registration_reward', 'Registration Reward')}</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              100 MBTTC
            </span>
          </div>

          {/* Member Since */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 col-span-2 md:col-span-1">
            <span className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">{t('overview_member_since', 'Member Since')}</span>
            <span className="text-sm font-medium text-zinc-200">
              {user.memberSince}
            </span>
          </div>
        </div>
      </div>

      {/* 9. REWARD CENTER (REGISTRATION REWARD, REFERRAL REWARD, PACKAGE REWARD) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
              {t('overview_reward_center', 'REWARD CENTER')}
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {t('overview_vault_dispatcher', 'Vault Pull-Payment Dispatcher')}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: REGISTRATION REWARD */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">{t('overview_registration_reward_title', 'REGISTRATION REWARD')}</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  Initial
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">{t('overview_total_earned', 'Total Earned')}</span>
                  <span className="font-mono font-bold text-white">100</span>
                  <span className="text-[9px] text-zinc-400 block">MBTTC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">{t('overview_total_claimed', 'Total Claimed')}</span>
                  <span className="font-mono font-bold text-zinc-300">100</span>
                  <span className="text-[9px] text-zinc-400 block">MBTTC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">{t('overview_claimable', 'Claimable')}</span>
                  <span className="font-mono font-bold text-zinc-500">0</span>
                  <span className="text-[9px] text-zinc-400 block">MBTTC</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 mt-4 leading-relaxed">
                {t('overview_genesis_reward_desc', 'One-time genesis reward automatically minted upon verified account activation.')}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-800">
              <button
                disabled={true}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs font-bold font-mono opacity-50 cursor-not-allowed text-center"
              >
                {t('overview_claimed_btn', 'CLAIMED (100 MBTTC)')}
              </button>
            </div>
          </div>

          {/* Card 2: REFERRAL REWARD */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/25 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.05)]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">{t('overview_referral_reward_title', 'REFERRAL REWARD')}</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {t('common_active', 'Active')}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">{t('overview_total_earned', 'Total Earned')}</span>
                  <span className="font-mono font-bold text-white">{rewards.referralEarned}</span>
                  <span className="text-[9px] text-zinc-400 block">MBTTC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">{t('overview_total_claimed', 'Total Claimed')}</span>
                  <span className="font-mono font-bold text-zinc-300">{rewards.referralClaimed}</span>
                  <span className="text-[9px] text-zinc-400 block">MBTTC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-400 block mb-0.5 font-bold">{t('overview_claimable', 'Claimable')}</span>
                  <span className="font-mono font-bold text-emerald-300 text-sm">{rewards.referralClaimable}</span>
                  <span className="text-[9px] text-emerald-400 block">MBTTC</span>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-zinc-400 font-mono">
                <div className="flex justify-between">
                  <span>{t('overview_last_claim', 'Last Claim:')}</span>
                  <span className="text-zinc-300">{rewards.lastReferralClaim}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" /> {t('overview_next_cycle', 'Next Cycle:')}
                  </span>
                  <span className="text-emerald-400 font-semibold bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {formatCountdown(referralCountdown)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-800">
              <button
                onClick={() => onOpenClaimModal('Referral')}
                disabled={rewards.referralClaimable <= 0}
                className="web3-btn-primary w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-extrabold text-xs transition-all shadow-[0_0_18px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('overview_claim_btn', 'CLAIM', { amount: rewards.referralClaimable })}</span>
                <span className="font-mono">({rewards.referralClaimable} MBTTC)</span>
              </button>
            </div>
          </div>

          {/* Card 3: PACKAGE REWARD */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/25 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.05)]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">{t('overview_package_reward_title', 'PACKAGE REWARD')}</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {t('common_active', 'Active')}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">{t('overview_total_earned', 'Total Earned')}</span>
                  <span className="font-mono font-bold text-white">{rewards.packageEarned}</span>
                  <span className="text-[9px] text-zinc-400 block">MBTTC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">{t('overview_total_claimed', 'Total Claimed')}</span>
                  <span className="font-mono font-bold text-zinc-300">{rewards.packageClaimed}</span>
                  <span className="text-[9px] text-zinc-400 block">MBTTC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-400 block mb-0.5 font-bold">{t('overview_claimable', 'Claimable')}</span>
                  <span className="font-mono font-bold text-emerald-300 text-sm">{rewards.packageClaimable}</span>
                  <span className="text-[9px] text-emerald-400 block">MBTTC</span>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-zinc-400 font-mono">
                <div className="flex justify-between">
                  <span>{t('overview_last_claim', 'Last Claim:')}</span>
                  <span className="text-zinc-300">{rewards.lastPackageClaim}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" /> {t('overview_next_cycle', 'Next Cycle:')}
                  </span>
                  <span className="text-emerald-400 font-semibold bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {formatCountdown(packageCountdown)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-800">
              <button
                onClick={() => onOpenClaimModal('Package')}
                disabled={rewards.packageClaimable <= 0}
                className="web3-btn-primary w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-extrabold text-xs transition-all shadow-[0_0_18px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('overview_claim_btn', 'CLAIM', { amount: rewards.packageClaimable })}</span>
                <span className="font-mono">({rewards.packageClaimable} MBTTC)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 11. QUICK ACTIONS SECTION */}
      <div className="p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4">
          {t('overview_quick_actions', 'QUICK ACTIONS')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Action 1: VIEW MBTTC */}
          <button
            onClick={() => onNavigate('mbttc')}
            className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-emerald-500/40 hover:bg-emerald-950/20 text-left transition-all group"
          >
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 w-fit mb-3 group-hover:scale-110 transition-transform">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors block font-mono">
              {t('overview_view_mbttc', 'VIEW MBTTC')}
            </span>
            <span className="text-[11px] text-zinc-400 mt-0.5 block">
              {t('overview_tokenomics_telemetry', 'Tokenomics & Telemetry')}
            </span>
          </button>

          {/* Action 2: MY TEAM */}
          <button
            onClick={() => onNavigate('team')}
            className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-emerald-500/40 hover:bg-emerald-950/20 text-left transition-all group"
          >
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 w-fit mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors block font-mono">
              {t('overview_my_team', 'MY TEAM')}
            </span>
            <span className="text-[11px] text-zinc-400 mt-0.5 block">
              {t('overview_network_partners', '184 Network Partners')}
            </span>
          </button>

          {/* Action 3: PACKAGES */}
          <button
            onClick={() => onNavigate('packages')}
            className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-emerald-500/40 hover:bg-emerald-950/20 text-left transition-all group"
          >
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 w-fit mb-3 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors block font-mono">
              {t('overview_packages_action', 'PACKAGES')}
            </span>
            <span className="text-[11px] text-zinc-400 mt-0.5 block">
              {t('overview_staking_tiers', 'Staking Node Tiers')}
            </span>
          </button>

          {/* Action 4: TRANSACTIONS */}
          <button
            onClick={() => onNavigate('transactions')}
            className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-emerald-500/40 hover:bg-emerald-950/20 text-left transition-all group"
          >
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 w-fit mb-3 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors block font-mono">
              {t('overview_transactions_action', 'TRANSACTIONS')}
            </span>
            <span className="text-[11px] text-zinc-400 mt-0.5 block">
              {t('overview_ledger_audit', 'Ledger & Audit Hashes')}
            </span>
          </button>
        </div>
      </div>

      {/* TEAM OVERVIEW */}
      <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
          <div className="flex items-center gap-3">
            {/* Premium Web3 Team/Network Icon with subtle orbital glow animation */}
            <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-zinc-950 to-zinc-900 border border-emerald-500/40 text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.25)] flex items-center justify-center overflow-hidden shrink-0 group">
              {/* Subtle orbital light ring */}
              <span className="absolute inset-0 rounded-2xl border border-emerald-400/20 border-t-emerald-400/70 animate-[spin_8s_linear_infinite] pointer-events-none" />
              {/* Soft pulse ambient glow */}
              <span className="absolute w-5 h-5 rounded-full bg-emerald-500/20 blur-sm animate-pulse pointer-events-none" />
              <Users className="w-5 h-5 relative z-10 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base tracking-tight flex items-center gap-2">
                {t('overview_team_overview', 'Team Overview')}
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t('overview_synced', 'Synced')}
                </span>
              </h2>
              <span className="text-xs text-zinc-400 font-mono">{t('overview_multitier_growth_metrics', 'Multi-tier network & ecosystem growth metrics')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700">
              {t('overview_network_tag', 'Network')}
            </span>
            <button
              onClick={() => handleSafeNavigate('team')}
              className="py-1.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span>{t('overview_view_team', 'View Team')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenMatrixModal}
              className="py-1.5 px-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Network className="w-3.5 h-3.5" />
              <span>{t('overview_view_matrix', 'View Matrix')}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {/* CARD 1: TOTAL TEAM (Navigates to Team Section) */}
          <div 
            onClick={() => handleSafeNavigate('team')}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-zinc-950/80 via-zinc-950/60 to-emerald-950/20 border border-zinc-800/80 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-[0_4px_20px_rgba(16,185,129,0.12)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] select-none"
            title="Click to view full Team network"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono font-medium group-hover:text-emerald-300 transition-colors">
                {t('overview_total_team_label', 'Total Team')}
              </span>
              <div className="p-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-all">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono group-hover:text-emerald-300 transition-colors">
                {user.totalTeamCount}
              </span>
              <span className="text-xs font-mono text-zinc-400">{t('overview_community', 'community')}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mt-3 pt-2.5 border-t border-zinc-800/70">
              <span className="text-emerald-400/90 font-medium">{t('overview_across_depths', 'Across 7 matrix depths')}</span>
              <span className="text-[11px] text-zinc-400 group-hover:text-emerald-300 flex items-center gap-0.5 font-sans font-medium transition-colors">
                {t('overview_view_network', 'View Network')} <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>

          {/* CARD 2: TOTAL ECOSYSTEM YIELDS (Navigates to Income Section) */}
          <div 
            onClick={() => handleSafeNavigate('income')}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-zinc-950/80 via-zinc-950/60 to-amber-950/15 border border-zinc-800/80 hover:border-amber-500/40 transition-all duration-200 cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-[0_4px_20px_rgba(245,158,11,0.12)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] select-none"
            title="Click to view Lifetime Ecosystem Income breakdown"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono font-medium group-hover:text-amber-300 transition-colors">
                {t('overview_total_ecosystem_yields', 'Total Ecosystem Yields')}
              </span>
              <div className="p-1.5 rounded-xl bg-amber-950/60 border border-amber-500/20 text-amber-400 group-hover:bg-amber-500/20 group-hover:border-amber-500/40 transition-all">
                <Coins className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono group-hover:text-amber-300 transition-colors">
                {totalEcosystemYieldsMbttc}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">MBTTC</span>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mt-3 pt-2.5 border-t border-zinc-800/70">
              <span className="text-amber-400/90 font-medium font-mono">
                ≈ ${totalEcosystemYieldsUsdt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
              </span>
              <span className="text-[11px] text-zinc-400 group-hover:text-amber-300 flex items-center gap-0.5 font-sans font-medium transition-colors">
                {t('overview_income_ledger', 'Income Ledger')} <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>

          {/* CARD 3: MONTHLY PROGRESS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-3 flex flex-col justify-between md:col-span-2 lg:col-span-1 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium block mb-1">
                  {t('overview_monthly_progress', 'Monthly Progress')}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">
                    {monthlyProgressPercent}%
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    ({user.totalTeamCount} / {monthlyTeamTarget} {t('overview_target', 'Target', { target: monthlyTeamTarget })})
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1.5">
              {/* Animated progress indicator */}
              <div className="w-full h-2.5 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden relative shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                  style={{ width: `${monthlyProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {t('overview_direct_label', 'Direct:')} {user.directTeamCount}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> {t('overview_depth_label', 'Depth 2-7:', { level: '2-7' })} {Math.max(0, user.totalTeamCount - user.directTeamCount)}
                </span>
                <span className="text-zinc-500">{t('overview_target', 'Target', { target: monthlyTeamTarget })}: {monthlyTeamTarget}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 10. COMMUNITY ACTIVITY LIVE FEED */}
      <CommunityActivityFeed 
        onNavigate={onNavigate}
        userActivities={activities}
      />

      {/* 11. COMMUNITY RATING SECTION */}
      <CommunityRatingSection 
        userWallet={user.walletAddress}
      />
    </div>
  );
};
