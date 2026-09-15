import React from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  Coins, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  AlertCircle,
  Cpu,
  Info
} from 'lucide-react';
import { NavPage } from '../../../types';
import { HubAnimatedIcon } from '../HubAnimatedIcon';
import { MbttcCoin3D } from '../../MbttcCoin3D';
import { TokenSpecCard } from './TokenSpecCard';
import { TokenDistributionTelemetry } from './TokenDistributionTelemetry';
import { ExchangeCard, EXCHANGES_DATA } from './ExchangeCard';
import { MBTTC_TOKEN_INFO } from '../../../data/mbttcTokenInfo';
import { ECOSYSTEM_TELEMETRY } from '../../../data/contractConfig';

interface MbttcLaunchDetailProps {
  onBack: () => void;
  onNavigate?: (page: NavPage) => void;
}

export const MbttcLaunchDetail: React.FC<MbttcLaunchDetailProps> = ({
  onBack,
  onNavigate,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300 pb-16">
      {/* ── 1. TOP ACTION: [← Back to MDeFi Hub] & [Open Token Center] ── */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 hover:border-sky-500/40 text-xs font-mono font-medium transition-all shadow-md group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-sky-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to MDeFi Hub</span>
        </button>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('mbttc')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-mono font-bold transition-all cursor-pointer shadow-md"
          >
            <span>Open MBTTC Token Center</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── 2. HERO BANNER ── */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-b from-[#081726]/95 via-[#040e1a]/90 to-[#02070d]/95 border border-sky-500/35 shadow-[0_8px_32px_rgba(0,0,0,0.7)]">
        {/* Ambient background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl bg-sky-500/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/30 to-transparent"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="shrink-0 pt-1">
              <HubAnimatedIcon iconType="token-launch" size="lg" />
            </div>

            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase border bg-zinc-900/90 text-sky-300 border-sky-500/40">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span>TOKEN ROLLOUT</span>
                </span>

                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-400">
                  CARD 07
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 font-semibold">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>LAUNCHING SOON</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                MBTTC TOKEN LAUNCH
              </h1>

              <p className="text-xs sm:text-sm font-mono text-sky-300/90 font-medium">
                Magnet Bitcoin Token (MBTTC) — Ecosystem Utility, Staking &amp; Multi-Exchange Rollout
              </p>

              <p className="text-xs sm:text-sm text-zinc-300/90 leading-relaxed max-w-2xl pt-1">
                The core utility, staking, and decentralized network incentive token powering the MDeFi protocol. Currently advancing through controlled user minting phases toward institutional exchange liquidity.
              </p>
            </div>
          </div>

          {/* Real 3D Coin Asset Visual */}
          <div className="shrink-0 flex items-center justify-center mx-auto lg:mx-0 p-4 rounded-3xl bg-zinc-950/70 border border-sky-500/30 shadow-[0_0_30px_rgba(14,165,233,0.15)]">
            <div className="flex flex-col items-center gap-2">
              <div className="hidden sm:block">
                <MbttcCoin3D size="hero" interactive={true} autoRotate={true} glow={true} />
              </div>
              <div className="block sm:hidden">
                <MbttcCoin3D size="lg" interactive={true} autoRotate={true} glow={true} />
              </div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                Native BEP-20 Asset
              </span>
            </div>
          </div>
        </div>

        {/* Hero Bottom Telemetry Strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-sky-500/20">
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Symbol / Standard</span>
            <span className="text-sm font-mono font-bold text-white">MBTTC / BEP-20</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Hard Ceiling Cap</span>
            <span className="text-sm font-mono font-bold text-emerald-400">{ECOSYSTEM_TELEMETRY.hardCap}</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Benchmark Valuation</span>
            <span className="text-sm font-mono font-bold text-sky-300">$1.50 USD</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Exchange Status</span>
            <span className="text-sm font-mono font-bold text-amber-300">LAUNCHING SOON</span>
          </div>
        </div>
      </div>

      {/* ── 3. TECHNICAL SPECIFICATIONS & CONTRACTS ── */}
      <TokenSpecCard />

      {/* ── 4. SUPPLY & DISTRIBUTION TELEMETRY ── */}
      <TokenDistributionTelemetry />

      {/* ── 5. EXCHANGE LAUNCH PREPARATION & ROADMAP ── */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-sky-500/20 backdrop-blur-xl shadow-xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-semibold">
                Global Liquidity Architecture
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Exchange Launch Preparation
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Target decentralized and centralized exchange rollout destinations post-minting stabilization.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>Target: Launching Soon</span>
          </span>
        </div>

        {/* 4-Step Flow Visual Pipeline */}
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-sky-500/30">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block mb-4">
            Post-Minting Exchange Activation Sequence
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Phase 01</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <h3 className="text-xs font-bold text-white font-mono">MBTTC Genesis &amp; Minting</h3>
              <p className="text-[11px] text-zinc-400">
                Community airdrop, frontline rewards, and node package minting.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Phase 02</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
              <h3 className="text-xs font-bold text-white font-mono">2,000,000 Cap Reached</h3>
              <p className="text-[11px] text-zinc-400">
                Minting smart contract functions permanently self-terminate.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">Phase 03</span>
                <span className="w-2 h-2 rounded-full bg-purple-400" />
              </div>
              <h3 className="text-xs font-bold text-white font-mono">Liquidity Bond Lock</h3>
              <p className="text-[11px] text-zinc-400">
                S4 Node liquidity reserves paired with USDT and locked on-chain.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl bg-sky-950/60 border border-sky-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-sky-300 uppercase">Phase 04</span>
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              </div>
              <h3 className="text-xs font-bold text-white font-mono">Exchange Trading Live</h3>
              <p className="text-[11px] text-zinc-400">
                Decentralized AMMs (PancakeSwap, Uniswap) &amp; CEX (Bitget).
              </p>
            </div>
          </div>
        </div>

        {/* 3 Exchange Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EXCHANGES_DATA.map((exchange) => (
            <ExchangeCard key={exchange.id} exchange={exchange} />
          ))}
        </div>

        {/* Data Integrity & Verification Policy Disclaimer */}
        <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 flex items-start gap-3.5">
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-zinc-200 block uppercase">
              Official Transparency &amp; Data Integrity Policy
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              MDeFi guarantees strict transparency across all token metrics. Rather than simulating fake volume or artificial orderbook activity, the protocol verifies that exchange launch preparations across PancakeSwap, Uniswap, and Bitget are actively planned for rollout following the completion of the 2,000,000 MBTTC minting ceiling and protocol LP bond locking. The current launch state across all markets is strictly <strong className="text-amber-300">LAUNCHING SOON</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* ── 6. BOTTOM ACTION FOOTER ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900/90 via-zinc-950 to-zinc-900/90 border border-zinc-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold block">
            Explore Ecosystem Modules
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Ready to interact with your MBTTC balance?
          </h3>
          <p className="text-xs text-zinc-400">
            Access the MBTTC Token Center for balances, benchmark analytics, and instant token swap.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('mbttc')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-black font-bold text-xs font-mono transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center gap-2 cursor-pointer"
            >
              <span>Open Token Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-mono transition-all cursor-pointer"
          >
            <span>Back to Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
};
