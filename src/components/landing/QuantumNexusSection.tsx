import React from 'react';
import { 
  Cpu, 
  Diamond, 
  Clock, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  TrendingUp,
  Lock
} from 'lucide-react';
import { programPhaseService } from '../../services/programPhaseService';
import { useLanguage } from '../../context/LanguageContext';

interface QuantumNexusSectionProps {
  onSelectPackage?: (pkg: 'quantum' | 'nexus') => void;
}

export const QuantumNexusSection: React.FC<QuantumNexusSectionProps> = ({
  onSelectPackage,
}) => {
  const { t } = useLanguage();
  const currentPhase = programPhaseService.getCurrentPhase();
  const quantumStatus = programPhaseService.getPackagePhaseStatus('quantum');
  const nexusStatus = programPhaseService.getPackagePhaseStatus('nexus');

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>{t('qn_badge', 'Next-Generation Matrix Pipeline • Launch Phase Control')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('qn_title', 'Concentric Radial Nodes')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {t('qn_desc', 'Expanding the binary matrix into an advanced 4-ring concentric matrix geometry with 30 active placement coordinates and exponential yield depth.')}
          </p>
        </div>

        {/* Dual Cards: Quantum Node ($70) & Nexus Prime ($120) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Quantum Node Card (Cyan Space Styling) */}
          <div 
            onClick={() => onSelectPackage?.('quantum')}
            className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-b from-[#041620] via-zinc-950 to-[#030d14] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col justify-between cursor-pointer group hover:scale-[1.01] transition-all"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/90 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
                  <Cpu className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-cyan-300 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40">
                    {t('qn_quantum_tier', '$70 TIER')}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                    quantumStatus.isUnlocked
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                      : 'bg-zinc-900 border-zinc-700 text-amber-400'
                  }`}>
                    {quantumStatus.isUnlocked ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span>{t('status_live', '🟢 AVAILABLE')}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>{t('status_unlocks_phase', '🔒 UNLOCKS IN PHASE 3', { phase: 3 })}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {t('qn_quantum_title', 'Quantum Node Matrix')}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {t('qn_quantum_desc', 'High-throughput concentric matrix. Features direct compensation and 10-level generational depth matching bonuses.')}
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-cyan-500/20 space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">{t('qn_direct_bonus', 'Direct Referral Bonus')}</span>
                  <span className="font-mono text-cyan-300 font-bold">{t('qn_direct_bonus_val', '$12.00 (17.1%)')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">{t('qn_magic_cashback', 'Magic Matrix Cashback')}</span>
                  <span className="font-mono text-cyan-300 font-bold">{t('qn_magic_cashback_val', '$15.00 Per 2 Directs')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">{t('qn_matrix_yield', 'Full Cycle Matrix Yield')}</span>
                  <span className="font-mono text-cyan-300 font-bold">{t('qn_matrix_yield_val', '$265.20 USD')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">{t('qn_level_matching', 'Generational Depth Yield')}</span>
                  <span className="font-mono text-cyan-300 font-bold">{t('qn_level_matching_val', '10 Levels Depth')}</span>
                </div>
              </div>
            </div>

            {/* Launch Status Notice */}
            <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-cyan-400/80">
              <span className="flex items-center gap-1.5">
                {quantumStatus.isUnlocked ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('qn_explore_quantum', 'Explore Quantum Matrix')}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{t('scheduled_phase_launch', 'Scheduled for Phase 3 Ecosystem Launch', { phase: 3 })}</span>
                  </>
                )}
              </span>
              <span className="text-zinc-500">MDeFi Pipeline</span>
            </div>
          </div>

          {/* Nexus Prime Card (Purple/Violet Cosmic Styling) */}
          <div 
            onClick={() => onSelectPackage?.('nexus')}
            className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-b from-[#180824] via-zinc-950 to-[#0d0414] border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col justify-between cursor-pointer group hover:scale-[1.01] transition-all"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-950/90 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner">
                  <Diamond className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-purple-300 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40">
                    {t('qn_nexus_tier', '$120 TIER')}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                    nexusStatus.isUnlocked
                      ? 'bg-purple-950 text-purple-300 border-purple-500/40'
                      : 'bg-zinc-900 border-zinc-700 text-amber-400'
                  }`}>
                    {nexusStatus.isUnlocked ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                        <span>{t('status_live', '🟢 AVAILABLE')}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>{t('status_unlocks_phase', '🔒 UNLOCKS IN PHASE 3', { phase: 3 })}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {t('qn_nexus_title', 'Nexus Prime Node')}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {t('qn_nexus_desc', 'Sovereign tier matrix architecture with maximum generational rewards, direct salary tier qualification, and multi-pool dividends.')}
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-purple-500/20 space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">{t('qn_nexus_direct', 'Direct Referral Bonus')}</span>
                  <span className="font-mono text-purple-300 font-bold">{t('qn_nexus_direct_val', '$15.00 (12.5%)')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">{t('qn_nexus_cashback', 'Magic Matrix Cashback')}</span>
                  <span className="font-mono text-purple-300 font-bold">{t('qn_nexus_cashback_val', '$25.00 Per 2 Directs')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">{t('qn_nexus_yield', 'Full Cycle Matrix Yield')}</span>
                  <span className="font-mono text-purple-300 font-bold">{t('qn_nexus_yield_val', '$306.00 USD')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">{t('qn_nexus_depth', 'Generational Depth Yield')}</span>
                  <span className="font-mono text-purple-300 font-bold">{t('qn_nexus_depth_val', '11 Levels Depth')}</span>
                </div>
              </div>
            </div>

            {/* Launch Status Notice */}
            <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-purple-400/80">
              <span className="flex items-center gap-1.5">
                {nexusStatus.isUnlocked ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('qn_explore_nexus', 'Explore Nexus Prime')}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{t('scheduled_phase_launch', 'Scheduled for Phase 3 Ecosystem Launch', { phase: 3 })}</span>
                  </>
                )}
              </span>
              <span className="text-zinc-500">MDeFi Pipeline</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
