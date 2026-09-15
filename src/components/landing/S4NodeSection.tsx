import React from 'react';
import { 
  Network, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  RotateCcw, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Lock
} from 'lucide-react';
import { programPhaseService } from '../../services/programPhaseService';
import { useLanguage } from '../../context/LanguageContext';

interface S4NodeSectionProps {
  onExploreS4: () => void;
}

export const S4NodeSection: React.FC<S4NodeSectionProps> = ({ onExploreS4 }) => {
  const { t } = useLanguage();
  const currentPhase = programPhaseService.getCurrentPhase();
  const s4Status = programPhaseService.getModulePhaseStatus('s4');
  const juniorStatus = programPhaseService.getPackagePhaseStatus('junior');
  const seniorStatus = programPhaseService.getPackagePhaseStatus('senior');

  return (
    <section id="s4-node" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-b from-[#081810] via-[#05110b] to-[#040a06] border border-emerald-500/40 shadow-[0_0_60px_rgba(16,185,129,0.14)] overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Network className="w-3.5 h-3.5" />
                <span>
                  {s4Status.isUnlocked 
                    ? t('s4_node_badge', 'Phase 2+ Active • 2x2 Binary Matrix Live') 
                    : t('s4_node_badge_locked', '🔒 Unlocks in Phase 2 • 2x2 Binary Matrix')}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {t('s4_node_title', 'S4 Node Architecture')}
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
                  {t('s4_node_desc', 'The flagship entry mechanism into the MDeFi decentralized matrix. Operates as an automated 2x2 binary slot matrix tree that pairs direct network expansion with continuous algorithmic spillover.')}
                </p>
              </div>

              {/* Two Tiers Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Junior Node Card */}
                <div className="p-5 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-emerald-400">Tier 1</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black font-mono text-white">$10</span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                        juniorStatus.isUnlocked
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                          : 'bg-zinc-900 text-amber-400 border-zinc-700'
                      }`}>
                        {juniorStatus.badge}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-white">Junior Node</h4>
                  <ul className="text-xs text-zinc-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{t('s4_junior_feature_1', '$4 Direct + $4 Matrix reward')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{t('s4_junior_feature_2', '2x2 Binary Matrix (6 Slots)')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{t('s4_junior_feature_3', 'Continuous auto-recycle engine')}</span>
                    </li>
                  </ul>
                </div>

                {/* Senior Node Card */}
                <div className="p-5 rounded-2xl bg-zinc-950/80 border border-teal-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-teal-300">Tier 2</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black font-mono text-white">$25</span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                        seniorStatus.isUnlocked
                          ? 'bg-teal-950 text-teal-300 border-teal-500/40'
                          : 'bg-zinc-900 text-amber-400 border-zinc-700'
                      }`}>
                        {seniorStatus.badge}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-white">Senior Node</h4>
                  <ul className="text-xs text-zinc-300 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{t('s4_senior_feature_1', '$8 Direct + $8 Matrix reward')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{t('s4_senior_feature_2', 'Double matrix capacity depth')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{t('s4_senior_feature_3', 'Enhanced community spillover')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* S4 CTA Button */}
              <div className="pt-3">
                <button
                  onClick={onExploreS4}
                  className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    s4Status.isUnlocked
                      ? 'text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95'
                      : 'text-amber-300 bg-zinc-900 border border-zinc-700 hover:border-amber-500/50 shadow-lg'
                  }`}
                >
                  {s4Status.isUnlocked ? (
                    <>
                      <span>{t('s4_explore_btn', 'EXPLORE S4 NODE')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>{t('status_unlocks_phase', 'UNLOCKS IN PHASE 2', { phase: 2 })}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Visual Representation of 2x2 Binary Matrix (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-950/70 border border-emerald-500/20 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-xs font-mono text-zinc-400 font-semibold">2x2 Binary Matrix Tree Preview</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Auto-Cycle
                </span>
              </div>

              {/* Schematic Matrix Tree Diagram */}
              <div className="flex flex-col items-center py-4 space-y-6">
                {/* Root Position */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex flex-col items-center justify-center text-black font-mono font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <span>YOU</span>
                  <span className="text-[9px] font-semibold">ROOT</span>
                </div>

                {/* Level 1 Nodes */}
                <div className="w-full flex items-center justify-around relative">
                  <div className="w-11 h-11 rounded-xl bg-zinc-900 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-300 font-mono text-xs font-bold shadow-md">
                    L1-A
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-zinc-900 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-300 font-mono text-xs font-bold shadow-md">
                    L1-B
                  </div>
                </div>

                {/* Level 2 Nodes (4 Slots) */}
                <div className="w-full flex items-center justify-between gap-1 sm:gap-2">
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-teal-500/50 flex items-center justify-center text-teal-300 font-mono text-[10px] font-bold">
                    S1
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-teal-500/50 flex items-center justify-center text-teal-300 font-mono text-[10px] font-bold">
                    S2
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-teal-500/50 flex items-center justify-center text-teal-300 font-mono text-[10px] font-bold">
                    S3
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-amber-500/60 flex items-center justify-center text-amber-300 font-mono text-[9px] font-bold" title="Recycle Trigger">
                    RE-CYC
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-zinc-300 flex items-center justify-between">
                <span className="text-zinc-400">Total Positions per Cycle:</span>
                <span className="font-mono text-emerald-300 font-bold">6 Slots (100% On-Chain)</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
