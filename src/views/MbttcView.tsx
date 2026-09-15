import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Sparkles, 
  Flame, 
  Layers, 
  Users, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  Info, 
  AlertCircle,
  TrendingUp,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, RewardBalances, MbttcTokenStats } from '../types';
import { MbttcCoin3D } from '../components/MbttcCoin3D';
import { MbttcLivePrice } from '../components/MbttcLivePrice';
import { MbttcMarketChart } from '../components/MbttcMarketChart';
import { MbttcSwapSection } from '../components/MbttcSwapSection';
import { MbttcClosingNotice } from '../components/MbttcClosingNotice';
import { MbttcTradeBar } from '../components/MbttcTradeBar';
import { mdefiService } from '../services/mdefiService';
import { mbttcMarketService, MarketStats } from '../services/mbttcMarketService';

interface MbttcViewProps {
  user: UserProfile;
  rewards: RewardBalances;
  tokenStats: MbttcTokenStats;
  onOpenClaimModal: (type: 'Registration' | 'Referral' | 'Package') => void;
  onExecuteSwap?: (params: {
    fromToken: 'MBTTC' | 'USDT';
    toToken: 'MBTTC' | 'USDT';
    fromAmount: number;
    toAmount: number;
    slippage: number;
  }) => Promise<{ success: boolean; txHash: string; message?: string }>;
  onOpenWalletModal?: () => void;
}

export const MbttcView: React.FC<MbttcViewProps> = ({
  user,
  rewards,
  tokenStats,
  onOpenClaimModal,
  onExecuteSwap,
  onOpenWalletModal,
}) => {
  const [marketStats, setMarketStats] = useState<MarketStats>(
    mbttcMarketService.getMarketStatsSync()
  );
  const [selectedSwapAction, setSelectedSwapAction] = useState<'BUY' | 'SELL' | null>(null);

  useEffect(() => {
    const unsubscribe = mbttcMarketService.subscribe((updated) => {
      setMarketStats(updated);
    });
    return unsubscribe;
  }, []);

  const isLive = marketStats.isLive;

  const currentRate = isLive ? marketStats.price : (rewards.demoUsdRate || 1.50);
  const calculatedUsdBalance = (rewards.mbttcBalance * currentRate).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleSwap = onExecuteSwap || (async (params) => {
    return await mdefiService.executeSwap(params);
  });

  const handleSelectTradeAction = (action: 'BUY' | 'SELL') => {
    setSelectedSwapAction(action);
    // Smooth scroll to swap section
    setTimeout(() => {
      const el = document.getElementById('mbttc-swap-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  const handleToggleMode = (newMode: 'demo' | 'live') => {
    mbttcMarketService.setMode(newMode);
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300 pb-28 lg:pb-12 max-w-7xl mx-auto">
      {/* 1. TITLE & HEADER AREA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold">
              Token Ecosystem
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono">
              BEP-20 / Native
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>MBTTC — Magnet Bitcoin Token</span>
            <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              Phase 1
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            The core utility, staking, and decentralized network incentive token powering the MDefi protocol.
          </p>
        </div>

        {/* Global Live/Demo Transition Status Badge */}
        <div className="flex items-center gap-2">
          {isLive ? (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-xs font-mono text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              ● LIVE MARKET DATA
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-xs font-mono text-amber-300 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              ● DEMO MARKET DATA
            </span>
          )}
        </div>
      </div>

      {/* 2. BINANCE-INSPIRED TRADING QUICK ACTIONS & STATUS BAR */}
      <MbttcTradeBar
        stats={marketStats}
        onSelectAction={handleSelectTradeAction}
        onToggleMode={handleToggleMode}
      />

      {/* 3. MY MBTTC BALANCE CARD */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0c1611] via-[#09110d] to-[#070b08] border border-emerald-500/30 p-6 sm:p-8 shadow-[0_0_40px_rgba(16,185,129,0.08)] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                My MBTTC Balance
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                isLive ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
              }`}>
                {isLive ? 'Live Wallet' : 'Demo Balance'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                {rewards.mbttcBalance.toLocaleString()}
              </span>
              <span className="text-2xl text-emerald-400 font-mono font-bold">
                MBTTC
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-base text-zinc-300 font-mono">
                ≈ ${calculatedUsdBalance} USD {isLive ? '(Live DEX Rate)' : '(Simulated Benchmark)'}
              </span>
              <span className="text-xs text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20">
                1 MBTTC ≈ ${currentRate.toFixed(isLive ? 4 : 2)} USD
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5 sm:gap-6">
            <div className="shrink-0">
              <div className="hidden sm:block">
                <MbttcCoin3D size="xl" interactive={true} autoRotate={true} glow={true} />
              </div>
              <div className="block sm:hidden">
                <MbttcCoin3D size="md" interactive={true} autoRotate={true} glow={true} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 text-xs text-zinc-300 space-y-2 max-w-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Zap className="w-4 h-4" />
                <span>Token Vault Utility</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Balances accrue continuously from package yield cycles and direct team commissions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MBTTC LIVE / DEMO MARKET PRICE STATS */}
      <MbttcLivePrice benchmarkRate={rewards.demoUsdRate || 1.50} stats={marketStats} />

      {/* 5. ADVANCED TOKEN CHART (CANDLESTICKS + VOLUME BARS + QUICK TRADING) */}
      <MbttcMarketChart onSelectTradeAction={handleSelectTradeAction} />

      {/* 6. MBTTC TOKEN SWAP (INSTANT MBTTC <-> USDT) */}
      <MbttcSwapSection
        mbttcBalance={rewards.mbttcBalance}
        usdtBalance={rewards.usdtBalance ?? 450.00}
        walletAddress={user.walletAddress}
        selectedAction={selectedSwapAction}
        onExecuteSwap={handleSwap}
        onOpenWalletModal={onOpenWalletModal}
      />

      {/* 7. EXISTING REWARD CARDS: Registration, Referral, Package */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span>Reward Distribution Channels</span>
          <span className="text-xs text-zinc-400 font-normal">
            {isLive ? '(Verified Stream)' : '(Demo Stream)'}
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: Registration Reward */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Registration Reward</h3>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  Initial
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">Earned</span>
                  <span className="font-mono font-bold text-white">{user.registrationReward}</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">Claimed</span>
                  <span className="font-mono font-bold text-zinc-300">{user.registrationReward}</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">Claimable</span>
                  <span className="font-mono font-bold text-zinc-500">0</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 mt-4 leading-relaxed">
                One-time registration reward automatically minted to your account upon verified account creation.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Status</span>
              <span className="text-emerald-400 font-mono font-medium">Fully Credited</span>
            </div>
          </div>

          {/* Card 2: Referral Reward */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Referral Reward</h3>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">Earned</span>
                  <span className="font-mono font-bold text-white">{rewards.referralEarned}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">Claimed</span>
                  <span className="font-mono font-bold text-zinc-300">{rewards.referralClaimed}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 block mb-0.5 font-semibold">Claimable</span>
                  <span className="font-mono font-bold text-emerald-300">{rewards.referralClaimable}</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 mt-4 leading-relaxed">
                Commissions generated from your {user.directTeamCount} direct frontline partners and multi-tier network nodes.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-800">
              <button
                onClick={() => onOpenClaimModal('Referral')}
                disabled={rewards.referralClaimable <= 0}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Claim Referral</span>
                <span className="font-mono">({rewards.referralClaimable} MBTTC)</span>
              </button>
            </div>
          </div>

          {/* Card 3: Package Reward */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Package Reward</h3>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">Earned</span>
                  <span className="font-mono font-bold text-white">{rewards.packageEarned}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-0.5">Claimed</span>
                  <span className="font-mono font-bold text-zinc-300">{rewards.packageClaimed}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 block mb-0.5 font-semibold">Claimable</span>
                  <span className="font-mono font-bold text-emerald-300">{rewards.packageClaimable}</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 mt-4 leading-relaxed">
                Daily protocol yield generated by your node packages accumulating per block validation cycle.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-zinc-800">
              <button
                onClick={() => onOpenClaimModal('Package')}
                disabled={rewards.packageClaimable <= 0}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Claim Package Yield</span>
                <span className="font-mono">({rewards.packageClaimable} MBTTC)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 8. ON-CHAIN TOKEN METRICS & SUPPLY */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Coins className="w-4 h-4 text-emerald-400" />
          <span>On-Chain Token Distribution</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Registration Minted */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1">
              Registration Minted
            </span>
            <span className="text-xl font-bold text-white font-mono block">
              {tokenStats.registrationMinted}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Airdrop allocation</span>
          </div>

          {/* 2. Referral Minted */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1">
              Referral Minted
            </span>
            <span className="text-xl font-bold text-white font-mono block">
              {tokenStats.referralMinted}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Community growth pool</span>
          </div>

          {/* 3. Package Minted */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1">
              Package Minted
            </span>
            <span className="text-xl font-bold text-white font-mono block">
              {tokenStats.packageMinted}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Node reward production</span>
          </div>

          {/* 4. Total Claimed */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1">
              Total Claimed
            </span>
            <span className="text-xl font-bold text-emerald-400 font-mono block">
              {tokenStats.totalClaimed}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Unlocked by participants</span>
          </div>

          {/* 5. Total Burned */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Total Burned</span>
              <Flame className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-xl font-bold text-amber-400 font-mono block">
              {tokenStats.totalBurned}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Deflationary burn contract</span>
          </div>

          {/* 6. Pending Rewards */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1">
              Pending Rewards
            </span>
            <span className="text-xl font-bold text-zinc-200 font-mono block">
              {tokenStats.pendingRewards}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Accumulated in vaults</span>
          </div>

          {/* 7. Circulating Supply */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-emerald-500/20 col-span-2 sm:col-span-3 lg:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold">
                Circulating Supply
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Verified</span>
            </div>
            <span className="text-2xl font-extrabold text-white font-mono block">
              {tokenStats.circulatingSupply}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Active on-chain market float</span>
          </div>
        </div>

        {/* Oracle Notice */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400">
              <Info className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-zinc-400 font-semibold block">
                Live Price &amp; Oracle Telemetry
              </span>
              <span className="text-sm font-semibold text-zinc-200">
                {isLive 
                  ? 'Real-time on-chain DEX AMM pool feeds active on BNB Smart Chain.'
                  : 'Live AMM price oracle integration will activate in Phase 7 with liquidity pool deployment.'}
              </span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-mono border shrink-0 ${
            isLive 
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' 
              : 'bg-zinc-900 text-zinc-400 border-zinc-800'
          }`}>
            {isLive ? 'DEX Pool Connected' : 'DEX Oracle Phase 7'}
          </span>
        </div>
      </div>

      {/* 9. PREMIUM CLOSING ANNOUNCEMENT PANEL */}
      <MbttcClosingNotice />
    </div>
  );
};
