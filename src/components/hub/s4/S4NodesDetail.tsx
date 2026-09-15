import React, { useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Layers,
  ShieldCheck,
  Zap,
  Repeat,
  Info,
  GitBranch,
  Network,
  Users,
  Award,
  ChevronRight,
  Eye,
  Sparkles
} from 'lucide-react';
import { NavPage } from '../../../types';
import { HubAnimatedIcon } from '../HubAnimatedIcon';
import { S4PackageCard } from './S4PackageCard';
import { S4CalculationCard } from './S4CalculationCard';
import { S4FlowSection } from './S4FlowSection';
import { S4MatrixTree } from '../../S4MatrixTree';
import { juniorNodeData, seniorNodeData } from '../../../data/s4MatrixData';

interface S4NodesDetailProps {
  onBack: () => void;
  onNavigate?: (page: NavPage) => void;
  onNavigateS4?: (pkg?: 'junior' | 'senior') => void;
}

export const S4NodesDetail: React.FC<S4NodesDetailProps> = ({
  onBack,
  onNavigate,
  onNavigateS4,
}) => {
  // Option to inspect existing live tree right here
  const [showLiveTreePreview, setShowLiveTreePreview] = useState<boolean>(false);
  const [selectedPreviewPkg, setSelectedPreviewPkg] = useState<'junior' | 'senior'>('junior');

  const handleGoToS4Matrix = (pkg?: 'junior' | 'senior') => {
    if (onNavigateS4) {
      onNavigateS4(pkg);
    } else if (onNavigate) {
      onNavigate('s4-matrix');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300 pb-16">
      {/* ── TOP ACTION: [← Back to MDeFi Hub] ── */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 hover:border-teal-500/40 text-xs font-mono font-medium transition-all shadow-md group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-teal-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to MDeFi Hub</span>
        </button>

        <button
          type="button"
          onClick={() => handleGoToS4Matrix()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
        >
          <span>Open Live S4 Matrix</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── 2. PREMIUM HERO ── */}
      <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-b from-[#051c19]/95 via-[#031311]/90 to-[#020b0a]/95 border border-teal-500/35 shadow-[0_8px_32px_rgba(0,0,0,0.7)]">
        {/* Ambient background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl bg-teal-500/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/30 to-transparent"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="shrink-0 pt-1">
              <HubAnimatedIcon iconType="s4-nodes" size="lg" />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase border bg-zinc-900/90 text-teal-300 border-teal-500/40">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span>MATRIX PROTOCOL</span>
                </span>

                <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-400">
                  CARD 02
                </span>

                <span className="text-xs font-mono text-teal-400/80">
                  Green / Teal / Cyan
                </span>
              </div>

              {/* S4 NODES Title & Subtitle */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-mono">
                S4 NODES
              </h1>
              <h2 className="text-base sm:text-lg font-bold text-teal-300 font-mono">
                Smart 2×2 Matrix Infrastructure
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                Understand the S4 Node structure, placement flow, direct referral income, matrix income, spillover, upline flow and automatic re-entry.
              </p>
            </div>
          </div>

          {/* Shortcut to Live S4 Matrix */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <button
              type="button"
              onClick={() => handleGoToS4Matrix()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-black font-extrabold text-sm font-mono tracking-wide shadow-[0_0_24px_rgba(20,184,166,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Layers className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
              <span>Launch Matrix &amp; Nodes</span>
              <ExternalLink className="w-4 h-4 text-black/70 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => setShowLiveTreePreview(!showLiveTreePreview)}
              className="px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span>{showLiveTreePreview ? 'Hide Live Tree' : 'Inspect Live Tree'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── CRITICAL RULE #1: REUSING & EXPLAINING THE EXISTING S4 MATRIX TREE ── */}
      <div className="rounded-3xl bg-zinc-950/80 border border-teal-500/25 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <h3 className="text-lg font-bold text-white font-mono">
                Unified S4 Matrix Engine (Single Source of Truth)
              </h3>
            </div>
            <p className="text-xs text-zinc-400">
              The application utilizes a single, high-fidelity concentric circular tree visualization for both Junior and Senior tiers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLiveTreePreview(!showLiveTreePreview)}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span>{showLiveTreePreview ? 'Collapse Tree' : 'Expand Tree Preview'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleGoToS4Matrix()}
              className="px-3.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Full Screen</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          In the S4 architecture, your active node sits in the center (<strong>YOU</strong>), surrounded by a 2-level concentric orbital ring system: <strong>Level 1</strong> (inner orbit, 2 positions) and <strong>Level 2</strong> (outer orbit, 4 positions). Live on-chain events update each position dynamically with color-coded placement indicators (Direct, Spillover, Level 1, Level 2, Recycle).
        </p>

        {/* Existing Matrix Tree Interactive Embed (Strictly reuses existing S4MatrixTree without duplication) */}
        {showLiveTreePreview && (
          <div className="pt-4 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
              <span className="text-xs font-mono text-zinc-400 font-bold">
                Inspecting Active Matrix Tree:
              </span>
              <div className="inline-flex p-1 rounded-xl bg-zinc-950 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setSelectedPreviewPkg('junior')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    selectedPreviewPkg === 'junior'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Junior ($10)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPreviewPkg('senior')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    selectedPreviewPkg === 'senior'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Senior ($25)
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-teal-500/30 overflow-hidden bg-black/80">
              <S4MatrixTree
                packageData={selectedPreviewPkg === 'junior' ? juniorNodeData : seniorNodeData}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── 1. S4 NODE PACKAGE STRUCTURE ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <h2 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-wider">
              1. S4 Node Package Structure
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            2 Contract-Verified Packages
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* S4 JUNIOR NODE — $10 USDT */}
          <S4PackageCard
            packageId={1}
            title="S4 Junior Node"
            priceUSD={10}
            badge="Fast-Cycle Community"
            directIncome={4}
            matrixIncome={4}
            mbttcLiquidity={1}
            adminFee={1}
            onActivateOrView={() => handleGoToS4Matrix('junior')}
          />

          {/* S4 SENIOR NODE — $25 USDT */}
          <S4PackageCard
            packageId={2}
            title="S4 Senior Node"
            priceUSD={25}
            badge="High-Yield Senior"
            directIncome={8}
            matrixIncome={8}
            mbttcLiquidity={2}
            rewardFund={4}
            adminFee={3}
            requiresJunior={true}
            onActivateOrView={() => handleGoToS4Matrix('senior')}
          />
        </div>
      </div>

      {/* ── 3, 4, 7, 8, 13, 14, 15, 17, 18, 19: FLOWS & ARCHITECTURE ── */}
      <S4FlowSection />

      {/* ── 5, 6, 9, 10, 11, 12: DIRECT & MATRIX CALCULATIONS + 6-PARTNER EXAMPLES ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h2 className="text-base sm:text-lg font-bold text-white font-mono uppercase tracking-wider">
            Mathematical Allocations &amp; 6-Partner Examples
          </h2>
        </div>

        <S4CalculationCard />
      </div>

      {/* ── BOTTOM ACTION: [← Back to MDeFi Hub] & [Go to Live Matrix] ── */}
      <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 hover:border-teal-500/40 text-xs font-mono font-medium transition-all shadow-md group cursor-pointer w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-teal-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to MDeFi Hub</span>
        </button>

        <button
          type="button"
          onClick={() => handleGoToS4Matrix()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-black font-extrabold text-xs font-mono tracking-wider transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] cursor-pointer w-full sm:w-auto justify-center"
        >
          <span>Open Live S4 Matrix Dashboard</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
