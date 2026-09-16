import React, { useState } from 'react';
import { 
  Coins, 
  Layers, 
  PieChart, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  TrendingUp,
  Percent
} from 'lucide-react';
import { MbttcCoin3D } from '../MbttcCoin3D';
import { useLanguage } from '../../context/LanguageContext';

export const TokenomicsSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const allocations = [
    {
      id: 1,
      nameKey: 'tok_alloc_reg_title',
      nameDefault: 'Registration & Referral Allocation',
      amount: '1,400,000 MBTTC',
      percentage: '70%',
      color: '#10b981', // Emerald
      textColor: 'text-emerald-400',
      bgGrad: 'from-emerald-500/20 to-transparent',
      borderColor: 'border-emerald-500/40',
      descKey: 'tok_alloc_reg_desc',
      descDefault: 'Dedicated exclusively to community on-boarding incentives, direct partner rewards, and matrix participation bonuses.',
    },
    {
      id: 2,
      nameKey: 'tok_alloc_lp_title',
      nameDefault: 'LP Bonds (Liquidity)',
      amount: '400,000 MBTTC',
      percentage: '20%',
      color: '#06b6d4', // Cyan
      textColor: 'text-cyan-300',
      bgGrad: 'from-cyan-500/20 to-transparent',
      borderColor: 'border-cyan-500/40',
      descKey: 'tok_alloc_lp_desc',
      descDefault: 'Algorithmic liquidity stabilization reserves and automated exchange pairing depth for Phase 3 readiness.',
    },
    {
      id: 3,
      nameKey: 'tok_alloc_mkt_title',
      nameDefault: 'Ecosystem Marketing & Growth',
      amount: '100,000 MBTTC',
      percentage: '5%',
      color: '#a855f7', // Purple
      textColor: 'text-purple-400',
      bgGrad: 'from-purple-500/20 to-transparent',
      borderColor: 'border-purple-500/40',
      descKey: 'tok_alloc_mkt_desc',
      descDefault: 'Global promotional campaigns, community ambassador initiatives, and strategic Web3 institutional outreach.',
    },
    {
      id: 4,
      nameKey: 'tok_alloc_res_title',
      nameDefault: 'Protocol Reserve & Infrastructure',
      amount: '100,000 MBTTC',
      percentage: '5%',
      color: '#f59e0b', // Amber
      textColor: 'text-amber-400',
      bgGrad: 'from-amber-500/20 to-transparent',
      borderColor: 'border-amber-500/40',
      descKey: 'tok_alloc_res_desc',
      descDefault: 'Smart contract audit maintenance, relayer gas subsidies, and long-term decentralized security verification.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 web3-icon-glyph" />
            <span>{t('tok_badge', 'Tokenomics & Allocation Model')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('tok_title', '2,000,000 Maximum Mint Supply')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {t('tok_desc', 'Strictly mathematically hard-capped. Zero un-governed inflation, no hidden founder pools, and immutable on-chain allocation rules.')}
          </p>
        </div>

        {/* Circular Ring Visualization + Allocation Breakdown */}
        <div className="relative rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-b from-[#07160f] via-zinc-950 to-[#040a06] border border-emerald-500/35 shadow-[0_0_60px_rgba(16,185,129,0.12)] overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Holographic Circular Allocation Ring with MBTTC 3D Coin Center (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                
                {/* SVG Holographic Ring Segments */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  {/* Background Track */}
                  <circle
                    cx="100"
                    cy="100"
                    r="84"
                    fill="none"
                    stroke="#18271e"
                    strokeWidth="16"
                  />

                  {/* 1. Registration & Referral: 70% (Circumference ~ 527.78, 70% ~ 369.45) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="84"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="16"
                    strokeDasharray="369.45 527.78"
                    strokeDashoffset="0"
                    className="transition-all duration-300 hover:stroke-[18px] cursor-pointer"
                    onMouseEnter={() => setActiveSegment(1)}
                    onMouseLeave={() => setActiveSegment(null)}
                  />

                  {/* 2. LP Bonds: 20% (~ 105.55) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="84"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="16"
                    strokeDasharray="105.55 527.78"
                    strokeDashoffset="-369.45"
                    className="transition-all duration-300 hover:stroke-[18px] cursor-pointer"
                    onMouseEnter={() => setActiveSegment(2)}
                    onMouseLeave={() => setActiveSegment(null)}
                  />

                  {/* 3. Marketing: 5% (~ 26.39) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="84"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="16"
                    strokeDasharray="26.39 527.78"
                    strokeDashoffset="-475"
                    className="transition-all duration-300 hover:stroke-[18px] cursor-pointer"
                    onMouseEnter={() => setActiveSegment(3)}
                    onMouseLeave={() => setActiveSegment(null)}
                  />

                  {/* 4. Protocol Reserve: 5% (~ 26.39) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="84"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="16"
                    strokeDasharray="26.39 527.78"
                    strokeDashoffset="-501.39"
                    className="transition-all duration-300 hover:stroke-[18px] cursor-pointer"
                    onMouseEnter={() => setActiveSegment(4)}
                    onMouseLeave={() => setActiveSegment(null)}
                  />
                </svg>

                {/* Center 3D Spinning Coin */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <MbttcCoin3D size="md" interactive={false} autoRotate={true} glow={true} />
                  <span className="text-[10px] font-mono font-bold text-white mt-1">2,000,000</span>
                  <span className="text-[8px] font-mono text-emerald-400">{t('max_mint', 'MAX MINT')}</span>
                </div>
              </div>

              <span className="text-xs font-mono text-zinc-400 mt-4 text-center">
                {t('tok_ring_label', '100% decentralized protocol ')}
              </span>
            </div>

            {/* Right: Allocation Cards Breakdown (7 cols) */}
            <div className="lg:col-span-7 space-y-3.5">
              {allocations.map((alloc) => (
                <div
                  key={alloc.id}
                  onMouseEnter={() => setActiveSegment(alloc.id)}
                  onMouseLeave={() => setActiveSegment(null)}
                  className={`p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border ${alloc.borderColor} transition-all duration-200 ${
                    activeSegment === alloc.id ? 'scale-[1.02] bg-zinc-900/90 shadow-xl' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full shrink-0 shadow-md"
                        style={{ backgroundColor: alloc.color }}
                      />
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {t(alloc.nameKey, alloc.nameDefault)}
                      </h4>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className={`text-base sm:text-lg font-black font-mono ${alloc.textColor}`}>
                        {alloc.amount}
                      </span>
                      <span className="text-xs font-mono font-bold text-zinc-400">
                        ({alloc.percentage})
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 pl-5 leading-relaxed">
                    {t(alloc.descKey, alloc.descDefault)}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
