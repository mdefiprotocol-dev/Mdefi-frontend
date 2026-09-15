import React from 'react';
import { 
  Sparkles, 
  Coins, 
  Network, 
  Cpu, 
  Gift, 
  Crown, 
  Wallet, 
  Rocket, 
  Layers, 
  TrendingUp, 
  Users, 
  ShieldCheck,
  Activity
} from 'lucide-react';
import { ModuleIconType } from '../../data/hubModulesData';

interface HubAnimatedIconProps {
  iconType: ModuleIconType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const HubAnimatedIcon: React.FC<HubAnimatedIconProps> = ({ 
  iconType, 
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
  }[size];

  const iconInnerSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  }[size];

  switch (iconType) {
    // CARD 01: MBTTC AIRDROP → Emerald / Cyan / Aqua / Gold
    // Coin + falling/airdrop particle/orbital ring concept
    case 'airdrop':
      return (
        <div className={`relative ${sizeClasses} rounded-2xl bg-gradient-to-br from-[#04281b] via-[#021811] to-[#0a3120] border border-emerald-400/50 flex items-center justify-center overflow-hidden shadow-[0_0_24px_rgba(16,185,129,0.35)] group-hover:border-emerald-300 transition-all duration-300 ${className}`}>
          {/* Subtle orbital aqua/gold particle ring */}
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/15 to-amber-400/10 blur-sm pointer-events-none" />
          <span className="absolute inset-1 rounded-full border border-dashed border-cyan-400/30 animate-[spin_10s_linear_infinite] motion-reduce:animate-none pointer-events-none" />
          {/* Soft live beacon ping */}
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75 motion-reduce:animate-none pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform duration-300">
            <Coins className={`${iconInnerSizes} text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.7)]`} />
          </div>
        </div>
      );

    // CARD 02: S4 NODES → Green / Teal / Cyan
    // Network node structure with orbital ring
    case 's4-nodes':
      return (
        <div className={`relative ${sizeClasses} rounded-2xl bg-gradient-to-br from-[#042422] via-[#021716] to-[#011110] border border-teal-400/40 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(20,184,166,0.3)] group-hover:border-teal-300 transition-all duration-300 ${className}`}>
          {/* Rotating teal/cyan orbital dashed ring */}
          <span className="absolute inset-1 rounded-full border border-dashed border-teal-400/35 animate-[spin_14s_linear_infinite] motion-reduce:animate-none pointer-events-none" />
          <span className="absolute inset-0 rounded-2xl bg-teal-500/10 animate-pulse motion-reduce:animate-none pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center text-teal-300 group-hover:rotate-12 transition-transform duration-300">
            <Network className={`${iconInnerSizes} drop-shadow-[0_0_10px_rgba(45,212,191,0.6)]`} />
          </div>
        </div>
      );

    // CARD 03: QUANTUM & NEXUS NODES → Violet / Blue / Electric Cyan
    // Quantum chip / orbit / network
    case 'quantum-nexus':
      return (
        <div className={`relative ${sizeClasses} rounded-2xl bg-gradient-to-br from-[#12163b] via-[#090b20] to-[#050716] border border-indigo-400/40 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:border-cyan-300 transition-all duration-300 ${className}`}>
          {/* Quantum electron orbit effect with electric cyan edge */}
          <span className="absolute inset-0 rounded-2xl border border-indigo-400/20 border-t-cyan-400/90 animate-[spin_7s_linear_infinite] motion-reduce:animate-none pointer-events-none" />
          <span className="absolute w-5 h-5 rounded-full bg-cyan-400/20 blur-sm animate-pulse motion-reduce:animate-none pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform duration-300">
            <Cpu className={`${iconInnerSizes} drop-shadow-[0_0_10px_rgba(129,140,248,0.7)]`} />
          </div>
        </div>
      );

    // CARD 04: WEEKLY REWARD STARTER → Gold / Amber / Orange
    // Reward / gift with diagonal light sweep
    case 'weekly-starter':
      return (
        <div className={`relative ${sizeClasses} rounded-2xl bg-gradient-to-br from-[#2a1d05] via-[#1a1202] to-[#0f0a01] border border-amber-400/40 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:border-amber-300 transition-all duration-300 ${className}`}>
          {/* Warm amber breathing glow & sweep */}
          <span className="absolute inset-0 rounded-2xl bg-amber-500/12 animate-pulse motion-reduce:animate-none pointer-events-none" />
          <span className="absolute -inset-full bg-gradient-to-r from-transparent via-amber-300/15 to-transparent group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform duration-300">
            <Gift className={`${iconInnerSizes} drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]`} />
          </div>
        </div>
      );

    // CARD 05: WEEKLY REWARD PREMIUM → Purple / Magenta / Gold
    // Premium crown / reward with radiant halo
    case 'weekly-premium':
      return (
        <div className={`relative ${sizeClasses} rounded-2xl bg-gradient-to-br from-[#2a0c36] via-[#17051f] to-[#0c0211] border border-purple-400/40 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:border-fuchsia-300 transition-all duration-300 ${className}`}>
          {/* Crown radiant halo and ping */}
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 via-fuchsia-500/10 to-amber-500/10 blur-sm pointer-events-none" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse motion-reduce:animate-none pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform duration-300">
            <Crown className={`${iconInnerSizes} text-fuchsia-300 drop-shadow-[0_0_10px_rgba(232,121,249,0.7)]`} />
          </div>
        </div>
      );

    // CARD 06: WEEKLY SALARY PASSIVE INCOME → Emerald / Teal / Blue
    // Wallet / income flow
    case 'weekly-salary':
      return (
        <div className={`relative ${sizeClasses} rounded-2xl bg-gradient-to-br from-[#062420] via-[#031412] to-[#010c0b] border border-emerald-400/40 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:border-teal-300 transition-all duration-300 ${className}`}>
          {/* Liquid income stream gradient */}
          <span className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse motion-reduce:animate-none pointer-events-none" />
          <span className="absolute inset-0 rounded-2xl bg-teal-500/10 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform duration-300">
            <Wallet className={`${iconInnerSizes} drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]`} />
          </div>
        </div>
      );

    // CARD 07: MBTTC TOKEN LAUNCH → Blue / Cyan / Violet
    // Token + rocket with thrust shimmer
    case 'token-launch':
      return (
        <div className={`relative ${sizeClasses} rounded-2xl bg-gradient-to-br from-[#08213a] via-[#041221] to-[#020912] border border-sky-400/40 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(14,165,233,0.3)] group-hover:border-cyan-300 transition-all duration-300 ${className}`}>
          {/* Rocket propulsion particle gleam */}
          <span className="absolute bottom-1 w-4 h-4 rounded-full bg-cyan-400/30 blur-sm animate-pulse motion-reduce:animate-none pointer-events-none" />
          <span className="absolute inset-0 rounded-2xl border border-sky-400/20 border-b-cyan-400/80 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center text-sky-300 group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300">
            <Rocket className={`${iconInnerSizes} drop-shadow-[0_0_10px_rgba(56,189,248,0.7)]`} />
          </div>
        </div>
      );

    // CARD 08: MDEFI STACKING NODES → Emerald / Lime / Cyan
    // Layered staking nodes
    case 'stacking-nodes':
      return (
        <div className={`relative ${sizeClasses} rounded-2xl bg-gradient-to-br from-[#122808] via-[#0a1704] to-[#040c01] border border-lime-400/40 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(132,204,22,0.3)] group-hover:border-lime-300 transition-all duration-300 ${className}`}>
          {/* Layer elevation breath */}
          <span className="absolute inset-1 rounded-xl border border-lime-400/25 animate-pulse motion-reduce:animate-none pointer-events-none" />
          <span className="absolute inset-0 rounded-2xl bg-lime-500/10 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center text-lime-300 group-hover:scale-110 transition-transform duration-300">
            <Layers className={`${iconInnerSizes} drop-shadow-[0_0_10px_rgba(163,230,53,0.6)]`} />
          </div>
        </div>
      );

    // CARD 09: ROI PREMIUM NODES → Violet / Blue / Magenta
    // Growth chart with apex ping
    case 'roi-nodes':
      return (
        <div className={`relative ${sizeClasses} rounded-2xl bg-gradient-to-br from-[#290a2e] via-[#17051b] to-[#0b010d] border border-fuchsia-400/40 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(217,70,239,0.3)] group-hover:border-magenta-300 transition-all duration-300 ${className}`}>
          {/* Apex ping */}
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse motion-reduce:animate-none pointer-events-none" />
          <span className="absolute inset-0 rounded-2xl bg-fuchsia-500/10 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center text-fuchsia-300 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className={`${iconInnerSizes} drop-shadow-[0_0_10px_rgba(232,121,249,0.6)]`} />
          </div>
        </div>
      );

    // CARD 10: TEAM & COMMUNITY → Cyan / Blue / Purple
    // Connected people / network cluster
    case 'team-community':
      return (
        <div className={`relative ${sizeClasses} rounded-2xl bg-gradient-to-br from-[#072436] via-[#03131e] to-[#01090f] border border-cyan-400/40 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:border-cyan-300 transition-all duration-300 ${className}`}>
          {/* Orbital network ring */}
          <span className="absolute inset-0 rounded-2xl border border-cyan-400/25 border-t-cyan-300 animate-[spin_10s_linear_infinite] motion-reduce:animate-none pointer-events-none" />
          <span className="absolute w-5 h-5 rounded-full bg-cyan-400/15 blur-sm animate-pulse motion-reduce:animate-none pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform duration-300">
            <Users className={`${iconInnerSizes} drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]`} />
          </div>
        </div>
      );

    // CARD 11: TRANSACTION LEDGER → Teal / Emerald / Gold
    // Blockchain ledger with cryptographic scan
    case 'transaction-ledger':
      return (
        <div className={`relative ${sizeClasses} rounded-2xl bg-gradient-to-br from-[#062920] via-[#031510] to-[#010b08] border border-teal-400/40 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(20,184,166,0.3)] group-hover:border-emerald-300 transition-all duration-300 ${className}`}>
          {/* Cryptographic scan line */}
          <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-teal-300 to-transparent animate-[pulse_2s_ease-in-out_infinite] motion-reduce:animate-none pointer-events-none" />
          <span className="absolute inset-0 rounded-2xl bg-emerald-500/10 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-center text-teal-300 group-hover:scale-110 transition-transform duration-300">
            <ShieldCheck className={`${iconInnerSizes} drop-shadow-[0_0_10px_rgba(45,212,191,0.6)]`} />
          </div>
        </div>
      );

    default:
      return (
        <div className={`relative ${sizeClasses} rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center ${className}`}>
          <Activity className={`${iconInnerSizes} text-zinc-400`} />
        </div>
      );
  }
};
