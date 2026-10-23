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
import { Rotating3DMbttcCoin } from '../components/common/Rotating3DMbttcCoin';
import { MbttcLivePrice } from '../components/MbttcLivePrice';
import { MbttcMarketChart } from '../components/MbttcMarketChart';
import { MbttcSwapSection } from '../components/MbttcSwapSection';
import { MbttcClosingNotice } from '../components/MbttcClosingNotice';
import { MbttcTradeBar } from '../components/MbttcTradeBar';
import { mdefiService } from '../services/mdefiService';
import { mbttcMarketService, MarketStats } from '../services/mbttcMarketService';
import { contractAdapter } from '../services/contractAdapter';
import { CONTRACT_ADDRESSES, HUB_ABI } from '../config/contractConfig';
import { ethers } from 'ethers';

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
  tokenStats: initialTokenStats,
  onExecuteSwap,
  onOpenWalletModal,
}) => {
  const [marketStats, setMarketStats] = useState<MarketStats>(
    mbttcMarketService.getMarketStatsSync()
  );
  const [selectedSwapAction, setSelectedSwapAction] = useState<'BUY' | 'SELL' | null>(null);

  // 100% Live On-Chain Token Distribution State (Default 0.00)
  const [liveTokenStats, setLiveTokenStats] = useState({
    registrationMinted: '0.00 MBTTC',
    referralMinted: '0.00 MBTTC',
    packageMinted: '0.00 MBTTC',
    totalClaimed: '0.00 MBTTC',
    totalBurned: '0.00 MBTTC',
    pendingRewards: '0.00 MBTTC',
    circulatingSupply: '0.00 MBTTC',
  });

  const fetchGlobalTokenStats = async () => {
    try {
      const rpcUrl = 'https://bsc-testnet.publicnode.com';
      const provider = new ethers.JsonRpcProvider(rpcUrl, undefined, { staticNetwork: true });
      const hubAddress = CONTRACT_ADDRESSES?.mdefiHub;

      if (!hubAddress || !ethers.isAddress(hubAddress)) return;

      const hubContract = new ethers.Contract(hubAddress, HUB_ABI as any, provider);
      
      // Direct call with individual property fallback
      const stats = await hubContract.getGlobalTokenStats();

      if (stats) {
        const fmt = (val: any) => {
          if (val === undefined || val === null) return '0.00 MBTTC';
          try {
            const strVal = typeof val === 'bigint' ? val.toString() : String(val);
            const n = parseFloat(ethers.formatUnits(strVal, 18));
            if (isNaN(n)) return '0.00 MBTTC';
            return `${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MBTTC`;
          } catch {
            return '0.00 MBTTC';
          }
        };

        // Ethers v6 Struct: Supports both named access and tuple index fallback
        const regMinted = stats.totalRegistrationMinted ?? stats[0] ?? 0n;
        const refMinted = stats.totalReferralMinted ?? stats[1] ?? 0n;
        const pkgMinted = stats.totalPackageMinted ?? stats[2] ?? 0n;
        const totalClaimed = stats.totalClaimedTokens ?? stats[3] ?? 0n;
        const totalBurned = stats.totalBurnedTokens ?? stats[4] ?? 0n;
        const pending = stats.totalPendingRewards ?? stats[5] ?? 0n;
        const circulating = stats.circulatingSupply ?? stats[6] ?? 0n;

        setLiveTokenStats({
          registrationMinted: fmt(regMinted),
          referralMinted: fmt(refMinted),
          packageMinted: fmt(pkgMinted),
          totalClaimed: fmt(totalClaimed),
          totalBurned: fmt(totalBurned),
          pendingRewards: fmt(pending),
          circulatingSupply: fmt(circulating),
        });
      }
    } catch (err) {
      console.warn('[MbttcView] Primary getGlobalTokenStats error, trying individual contract methods:', err);
      // Secondary fallback to individual methods in case struct decoding was reverted
      try {
        const provider = new ethers.JsonRpcProvider('https://bsc-testnet.publicnode.com', undefined, { staticNetwork: true });
        const hubAddress = CONTRACT_ADDRESSES?.mdefiHub;
        if (!hubAddress) return;
        const hub = new ethers.Contract(hubAddress, HUB_ABI as any, provider);

        const [regM, refM, pkgM, refC, pkgC, burned] = await Promise.all([
          hub.totalRegistrationMinted().catch(() => 0n),
          hub.totalReferralMinted().catch(() => 0n),
          hub.totalPackageMinted().catch(() => 0n),
          hub.totalReferralClaimed().catch(() => 0n),
          hub.totalPackageClaimed().catch(() => 0n),
          hub.totalBurnedTokens().catch(() => 0n),
        ]);

        const fmt = (val: bigint) => {
          const n = parseFloat(ethers.formatUnits(val || 0n, 18));
          return `${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MBTTC`;
        };

        const claimedSum = BigInt(refC || 0n) + BigInt(pkgC || 0n);
        const mintedSum = BigInt(regM || 0n) + BigInt(refM || 0n) + BigInt(pkgM || 0n);

        setLiveTokenStats({
          registrationMinted: fmt(regM),
          referralMinted: fmt(refM),
          packageMinted: fmt(pkgM),
          totalClaimed: fmt(claimedSum),
          totalBurned: fmt(burned),
          pendingRewards: fmt(mintedSum > claimedSum ? mintedSum - claimedSum : 0n),
          circulatingSupply: fmt(claimedSum),
        });
      } catch (fallbackErr) {
        console.warn('[MbttcView] Secondary fallback error:', fallbackErr);
      }
    }
  };

  useEffect(() => {
    fetchGlobalTokenStats();
    const unsubAdapter = contractAdapter.onDataRefresh(() => {
      fetchGlobalTokenStats();
    });
    return () => {
      unsubAdapter();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = mbttcMarketService.subscribe((updated) => {
      setMarketStats(updated);
    });
    return unsubscribe;
  }, []);

  const isLive = marketStats.isLive;
  const currentRate = isLive && marketStats.price > 0 ? marketStats.price : 3.50;

  // Real connected wallet balance fallback
  const realWalletMbttc = rewards?.mbttcBalance || 0;
  const calculatedUsdBalance = (realWalletMbttc * currentRate).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleSwap = onExecuteSwap || (async (params) => {
    return await mdefiService.executeSwap(params);
  });

  const handleSelectTradeAction = (action: 'BUY' | 'SELL') => {
    setSelectedSwapAction(action);
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
              Phase 1 Live
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            The core utility, staking, and decentralized network incentive token powering the MDeFi protocol.
          </p>
        </div>

        {/* Global Transition Status Badge */}
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
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-zinc-900 border border-emerald-500/30 text-xs font-mono text-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ● PRE-MARKET MINTING
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

      {/* 3. MY MBTTC BALANCE CARD (POLISHED 3D COIN + ZERO FAKE BENCHMARK) */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0c1611] via-[#09110d] to-[#070b08] border border-emerald-500/30 p-6 sm:p-8 shadow-[0_0_40px_rgba(16,185,129,0.08)] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                My MBTTC Balance
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                Verified On-Chain
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
                {(rewards.mbttcBalance || 0).toLocaleString()}
              </span>
              <span className="text-2xl text-emerald-400 font-mono font-bold">
                MBTTC
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="text-base text-zinc-300 font-mono">
                ≈ ${calculatedUsdBalance} USDT {isLive ? '(Live AMM)' : '(Target Valuation)'}
              </span>
              <span className="text-xs text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20">
                1 MBTTC = ${currentRate.toFixed(2)} USDT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5 sm:gap-6">
            <div className="shrink-0 flex items-center justify-center">
              <div className="hidden sm:block">
                <Rotating3DMbttcCoin size={90} accent="emerald" />
              </div>
              <div className="block sm:hidden">
                <Rotating3DMbttcCoin size={65} accent="emerald" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 text-xs text-zinc-300 space-y-2 max-w-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
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

      {/* 4. MBTTC LIVE MARKET PRICE STATS */}
      <MbttcLivePrice benchmarkRate={0.00} stats={marketStats} />

      {/* 5. ADVANCED TOKEN CHART */}
      <MbttcMarketChart onSelectTradeAction={handleSelectTradeAction} />

      {/* 6. MBTTC TOKEN SWAP */}
      <MbttcSwapSection
        mbttcBalance={rewards.mbttcBalance || 0}
        usdtBalance={rewards.usdtBalance ?? 0.00}
        walletAddress={user.walletAddress}
        selectedAction={selectedSwapAction}
        onExecuteSwap={handleSwap}
        onOpenWalletModal={onOpenWalletModal}
      />

      

      {/* 8. ON-CHAIN TOKEN DISTRIBUTION (LIVE ON-CHAIN GETGLOBALTOKENSTATS SYNC) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>On-Chain Token Distribution</span>
          </h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/35 text-[11px] font-mono font-bold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Master Hub Telemetry</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1">
              Registration Minted
            </span>
            <span className="text-xl font-bold text-white block">
              {liveTokenStats.registrationMinted}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Airdrop allocation</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1">
              Referral Minted
            </span>
            <span className="text-xl font-bold text-white block">
              {liveTokenStats.referralMinted}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Community growth pool</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1">
              Package Minted
            </span>
            <span className="text-xl font-bold text-white block">
              {liveTokenStats.packageMinted}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Node reward production</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1">
              Total Claimed
            </span>
            <span className="text-xl font-bold text-emerald-400 block">
              {liveTokenStats.totalClaimed}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Unlocked by participants</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Total Burned</span>
              <Flame className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-xl font-bold text-amber-400 block">
              {liveTokenStats.totalBurned}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Deflationary burn</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider block mb-1">
              Pending Rewards
            </span>
            <span className="text-xl font-bold text-zinc-200 block">
              {liveTokenStats.pendingRewards}
            </span>
            <span className="text-[10px] text-zinc-400 mt-1 block">Accumulated in vaults</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-emerald-500/20 col-span-2 sm:col-span-3 lg:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold">
                Circulating Supply
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Verified</span>
            </div>
            <span className="text-2xl font-extrabold text-white block">
              {liveTokenStats.circulatingSupply}
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
                  : 'Phase 1 active. Pre-market token minting open. AMM liquidity pairing unlocks in future phase.'}
              </span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-mono border shrink-0 ${
            isLive 
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' 
              : 'bg-zinc-900 text-zinc-400 border-zinc-800'
          }`}>
            {isLive ? 'DEX Pool Connected' : 'Phase 1 Pre-Market'}
          </span>
        </div>
      </div>

      {/* 9. CLOSING PANEL */}
      <MbttcClosingNotice />
    </div>
  );
};