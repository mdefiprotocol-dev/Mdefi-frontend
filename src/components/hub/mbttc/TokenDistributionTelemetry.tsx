import React from 'react';
import { 
  Flame, 
  Coins, 
  Layers, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Lock,
  Compass
} from 'lucide-react';
import { MBTTC_TOKEN_INFO } from '../../../data/mbttcTokenInfo';
import { MINTING_PHASES_CONFIG, ECOSYSTEM_TELEMETRY } from '../../../data/contractConfig';

export const TokenDistributionTelemetry: React.FC = () => {
  const telemetry = MBTTC_TOKEN_INFO.telemetry;

  const stats = [
    {
      label: 'Registration Minted',
      value: telemetry.registrationMinted,
      subtitle: 'Onboarding airdrop allocation',
      icon: Sparkles,
      color: 'text-white',
    },
    {
      label: 'Referral Minted',
      value: telemetry.referralMinted,
      subtitle: 'Community frontline growth pool',
      icon: Users,
      color: 'text-white',
    },
    {
      label: 'Package Minted',
      value: telemetry.packageMinted,
      subtitle: 'Node validation reward yield',
      icon: Layers,
      color: 'text-white',
    },
    {
      label: 'Total Claimed',
      value: telemetry.totalClaimed,
      subtitle: 'Unlocked by ecosystem participants',
      icon: Coins,
      color: 'text-emerald-400',
    },
    {
      label: 'Total Burned',
      value: telemetry.totalBurned,
      subtitle: 'Deflationary null contract sink',
      icon: Flame,
      color: 'text-amber-400',
    },
    {
      label: 'Pending Rewards',
      value: telemetry.pendingRewards,
      subtitle: 'Accumulating in smart contracts',
      icon: Lock,
      color: 'text-zinc-300',
    },
    {
      label: 'Circulating Supply',
      value: telemetry.circulatingSupply,
      subtitle: 'Active verified on-chain float',
      icon: TrendingUp,
      color: 'text-emerald-300 font-extrabold',
      colSpan: 'col-span-1 sm:col-span-2',
    },
  ];

  const utilityPillars = [
    {
      title: 'Staking & Node Production',
      desc: 'Active node packages generate daily protocol yield in MBTTC per block validation cycle, incentivizing long-term network participation.',
      badge: 'Daily Block Yield',
      icon: Layers,
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      title: 'Protocol Claim Fee Settlement',
      desc: 'MBTTC is utilized across the MDeFi ecosystem to settle protocol claim fees for Weekly Starter, Weekly Premium, and Passive Salary bonuses.',
      badge: 'Fee Fuel',
      icon: Zap,
      border: 'border-amber-500/30',
      iconBg: 'bg-amber-500/10 text-amber-400',
    },
    {
      title: 'S4 Node Liquidity Inflow',
      desc: 'Every S4 Node activation directly reserves and deposits $1 USDT (Junior) or $2 USDT (Senior) toward the MBTTC liquidity pool buffer.',
      badge: 'Automated LP Growth',
      icon: Compass,
      border: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/10 text-cyan-400',
    },
    {
      title: 'Deflationary Proof-of-Burn',
      desc: 'Portions of protocol fees are perpetually routed to the 0x0...dEaD burn contract, continually decreasing the supply ceiling.',
      badge: 'Proof-of-Burn Sink',
      icon: Flame,
      border: 'border-red-500/30',
      iconBg: 'bg-red-500/10 text-red-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Global Distribution Telemetry */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                On-Chain Telemetry
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-400" />
              <span>MBTTC Supply &amp; Distribution Telemetry</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
            Live Verified Metrics
          </span>
        </div>

        {/* 7 Telemetry Metric Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-emerald-500/30 transition-colors ${
                  item.colSpan || ''
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <span className={`text-xl font-mono block ${item.color}`}>
                  {item.value}
                </span>
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  {item.subtitle}
                </span>
              </div>
            );
          })}
        </div>

        {/* Minting Phases Roadmap Pipeline */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              3-Phase Minting Hard Ceiling Architecture
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              {ECOSYSTEM_TELEMETRY.currentUsers.toLocaleString()} / {ECOSYSTEM_TELEMETRY.nextPhaseThreshold.toLocaleString()} Phase 1 Users
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MINTING_PHASES_CONFIG.map((p) => {
              const isActive = p.isCurrent;
              return (
                <div
                  key={p.phase}
                  className={`p-4 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : 'bg-zinc-950/60 border-zinc-800/80 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-white">
                      {p.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 animate-pulse'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">
                    {p.userTierDescription}
                  </p>

                  <div className="space-y-1.5 text-[11px] font-mono border-t border-zinc-800/80 pt-2.5">
                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="text-zinc-400">Registration:</span>
                      <span className="font-bold text-white">{p.registrationReward} MBTTC</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="text-zinc-400">Referral:</span>
                      <span className="font-bold text-white">{p.referralReward} MBTTC</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-300">
                      <span className="text-zinc-400">Quantum S4:</span>
                      <span className="font-bold text-emerald-400">{p.quantumS4Reward} MBTTC</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Token Utility Pillars */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Ecosystem Utility
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              MBTTC Utility &amp; Economic Roles
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
            Multi-Pronged Utility
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {utilityPillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className={`p-5 rounded-2xl bg-zinc-950/70 border ${pillar.border} space-y-2.5 flex flex-col justify-between hover:bg-zinc-950/90 transition-colors`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2.5 rounded-xl ${pillar.iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white font-mono">{pillar.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1.5">{pillar.desc}</p>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 pt-2 border-t border-zinc-900">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Integrated protocol mechanism</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
