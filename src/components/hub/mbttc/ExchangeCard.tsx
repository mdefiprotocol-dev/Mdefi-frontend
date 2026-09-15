import React from 'react';
import { Clock, ShieldCheck, ArrowUpRight, ExternalLink, Layers, CheckCircle2 } from 'lucide-react';

export interface ExchangeInfo {
  id: 'uniswap' | 'pancakeswap' | 'bitget';
  name: string;
  category: 'DEX' | 'CEX';
  categorySubtitle: string;
  description: string;
  status: string;
  targetPair: string;
  network: string;
  liquidityType: string;
  brandColor: string;
  accentBorder: string;
  badgeStyle: string;
  iconBg: string;
  details: string[];
}

export const EXCHANGES_DATA: ExchangeInfo[] = [
  {
    id: 'uniswap',
    name: 'Uniswap',
    category: 'DEX',
    categorySubtitle: 'Multi-Chain Concentrated Liquidity',
    description: 'Premier decentralized protocol for automated liquidity provision. Uniswap V3 concentrated liquidity pools enable high capital efficiency and minimal slippage for global DeFi traders.',
    status: 'LAUNCHING SOON',
    targetPair: 'MBTTC / USDT (V3 Pool)',
    network: 'Multi-Chain / Cross-Chain Bridge',
    liquidityType: 'Concentrated Liquidity (V3 AMM)',
    brandColor: '#ff007a',
    accentBorder: 'hover:border-pink-500/50',
    badgeStyle: 'bg-pink-950/70 border-pink-500/40 text-pink-300',
    iconBg: 'bg-pink-500/10 border-pink-500/30 text-[#ff007a]',
    details: [
      'Concentrated liquidity ranges for low slippage',
      'Non-custodial smart contract routing',
      'Scheduled deployment post LP bond lock',
    ],
  },
  {
    id: 'pancakeswap',
    name: 'PancakeSwap',
    category: 'DEX',
    categorySubtitle: 'BNB Smart Chain Primary AMM',
    description: 'The leading DEX on BNB Smart Chain. Direct BEP-20 native liquidity pool backed by protocol liquidity reserve funds, offering near-instant swaps with ultra-low BSC gas fees.',
    status: 'LAUNCHING SOON',
    targetPair: 'MBTTC / USDT & MBTTC / BNB',
    network: 'BNB Smart Chain (BEP-20 Native)',
    liquidityType: 'Automated Market Maker (AMM)',
    brandColor: '#1fc7d4',
    accentBorder: 'hover:border-cyan-400/50',
    badgeStyle: 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300',
    iconBg: 'bg-cyan-500/10 border-cyan-500/30 text-[#1fc7d4]',
    details: [
      'Native BNB Smart Chain BEP-20 integration',
      'Direct protocol liquidity injections from S4 nodes',
      'Primary on-chain AMM anchor market',
    ],
  },
  {
    id: 'bitget',
    name: 'Bitget',
    category: 'CEX',
    categorySubtitle: 'Global Centralized Spot Orderbook',
    description: 'Tier-1 global digital asset exchange offering high-throughput CLOB (Central Limit Order Book) spot execution, institutional depth, and multi-currency fiat on-ramps.',
    status: 'LAUNCHING SOON',
    targetPair: 'MBTTC / USDT Spot',
    network: 'Centralized Global Exchange',
    liquidityType: 'Central Limit Order Book (CLOB)',
    brandColor: '#00f0ff',
    accentBorder: 'hover:border-sky-400/50',
    badgeStyle: 'bg-sky-950/70 border-sky-500/40 text-sky-300',
    iconBg: 'bg-sky-500/10 border-sky-500/30 text-[#00f0ff]',
    details: [
      'High-speed institutional matching engine',
      'Global fiat deposit & withdrawal gateways',
      'Scheduled following 2M minting stabilization',
    ],
  },
];

export const ExchangeBrandLogo: React.FC<{ id: 'uniswap' | 'pancakeswap' | 'bitget'; size?: 'md' | 'lg' }> = ({
  id,
  size = 'md',
}) => {
  const dim = size === 'lg' ? 'w-10 h-10' : 'w-7 h-7';

  if (id === 'uniswap') {
    return (
      <svg
        className={dim}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Uniswap Logo"
      >
        <rect width="32" height="32" rx="8" fill="#180c14" />
        <path
          d="M23.8 8.4C22.6 6.8 20.3 6.1 18.2 6.8C16.8 5.6 14.8 5.2 13.1 5.9C11.5 6.5 10.3 8 10 9.7C8.4 10.3 7.2 11.8 7 13.5C6.8 15.6 7.9 17.6 9.7 18.5C9.4 19.3 9.4 20.2 9.8 21C10.4 22.4 11.9 23.3 13.5 23.2C14.2 24.3 15.4 25 16.7 25C18.6 25 20.2 23.8 20.8 22.1C22.4 21.6 23.6 20.2 23.9 18.4C24.3 16.2 23.4 14.1 21.8 13C22.4 11.9 22.4 10.5 21.7 9.5L23.8 8.4Z"
          fill="url(#uniswapGradient)"
        />
        <path
          d="M17.5 10.5C16.8 11.2 16.2 12.2 16 13.3C15.8 14.4 16.1 15.5 16.8 16.3C17.5 17.1 18.6 17.5 19.7 17.4C20.8 17.3 21.8 16.6 22.4 15.7"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="14" cy="11" r="1" fill="#ffffff" />
        <defs>
          <linearGradient id="uniswapGradient" x1="7" y1="5" x2="24" y2="25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF007A" />
            <stop offset="0.5" stopColor="#FF439D" />
            <stop offset="1" stopColor="#A91B60" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (id === 'pancakeswap') {
    return (
      <svg
        className={dim}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="PancakeSwap Logo"
      >
        <rect width="32" height="32" rx="8" fill="#08181a" />
        <path
          d="M11 6.5C10.2 6.5 9.5 7.2 9.5 8C9.5 9.8 11.2 11.2 12.8 12.5C11.5 13.3 10.5 14.5 10 16C8.2 16.3 6.8 17.8 6.5 19.6C6.2 21.8 7.5 23.8 9.6 24.5C11.4 25.1 13.5 24.8 15 23.8C16 24.5 17.2 24.8 18.5 24.6C21 24.2 23 22.2 23.5 19.7C23.8 17.8 23 16 21.5 15C22.2 13.5 22.1 11.8 21.2 10.5C20.3 9.2 18.8 8.5 17.2 8.6C16.8 7.4 15.8 6.5 14.5 6.5C13.8 6.5 13.2 6.8 12.8 7.2C12.3 6.8 11.7 6.5 11 6.5Z"
          fill="url(#pancakeGradient)"
        />
        <circle cx="13" cy="14" r="1.1" fill="#2d1b09" />
        <circle cx="18" cy="14" r="1.1" fill="#2d1b09" />
        <ellipse cx="15.5" cy="16.5" rx="1.2" ry="0.8" fill="#d1884f" />
        <defs>
          <linearGradient id="pancakeGradient" x1="6" y1="6" x2="24" y2="25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1FC7D4" />
            <stop offset="0.45" stopColor="#48D1DC" />
            <stop offset="1" stopColor="#D1884F" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Bitget
  return (
    <svg
      className={dim}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bitget Logo"
    >
      <rect width="32" height="32" rx="8" fill="#041217" />
      <path
        d="M7.5 16L14 9.5L16.2 11.7L11.9 16L16.2 20.3L14 22.5L7.5 16Z"
        fill="#00F0FF"
      />
      <path
        d="M15.5 16L22 9.5L24.2 11.7L19.9 16L24.2 20.3L22 22.5L15.5 16Z"
        fill="#00F0FF"
        fillOpacity="0.85"
      />
      <circle cx="21" cy="9" r="1.2" fill="#FFFFFF" />
    </svg>
  );
};

export const ExchangeCard: React.FC<{ exchange: ExchangeInfo }> = ({ exchange }) => {
  return (
    <div
      className={`relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-zinc-900/90 via-[#0a0f0d]/95 to-[#050807]/95 border border-zinc-800/80 ${exchange.accentBorder} transition-all duration-300 flex flex-col justify-between shadow-xl group hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]`}
    >
      {/* Top Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-2xl border ${exchange.iconBg} shadow-inner flex items-center justify-center`}>
              <ExchangeBrandLogo id={exchange.id} size="md" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                  {exchange.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold">
                  {exchange.category}
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-400 block">
                {exchange.categorySubtitle}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${exchange.badgeStyle} flex items-center gap-1.5 shrink-0 shadow-sm`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <span>{exchange.status}</span>
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-300 leading-relaxed pt-1">
          {exchange.description}
        </p>

        {/* Pair Spec Container */}
        <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Target Pair:</span>
            <span className="text-emerald-400 font-bold">{exchange.targetPair}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono border-t border-zinc-800/60 pt-1.5">
            <span className="text-zinc-400">Execution Model:</span>
            <span className="text-zinc-300">{exchange.liquidityType}</span>
          </div>
        </div>

        {/* Details Checklist */}
        <div className="space-y-1.5 pt-1">
          {exchange.details.map((detail, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11px] text-zinc-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-5 mt-5 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Post-Minting Rollout</span>
        </span>
        <span className="text-zinc-400 group-hover:text-emerald-400 transition-colors flex items-center gap-1 text-[11px]">
          <span>Verified Target</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
