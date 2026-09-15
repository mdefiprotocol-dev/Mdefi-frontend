import React from 'react';
import { Lock, ArrowLeft, Layers, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { LaunchPhase, MODULE_LAUNCH_DEFINITIONS, LaunchModuleKey } from '../../config/launchPhaseConfig';

interface PhaseLockedViewProps {
  moduleKey?: LaunchModuleKey;
  requiredPhase: LaunchPhase;
  customTitle?: string;
  customDescription?: string;
  onBackToDashboard?: () => void;
  onNavigateHub?: () => void;
  backButtonLabel?: string;
  actionButtonLabel?: string;
}

export const PhaseLockedView: React.FC<PhaseLockedViewProps> = ({
  moduleKey,
  requiredPhase,
  customTitle,
  customDescription,
  onBackToDashboard,
  onNavigateHub,
  backButtonLabel = 'RETURN TO DASHBOARD',
  actionButtonLabel = 'EXPLORE LIVE HUB',
}) => {
  const moduleDef = moduleKey ? MODULE_LAUNCH_DEFINITIONS[moduleKey] : null;
  const title = customTitle || (moduleDef ? moduleDef.name : `Phase ${requiredPhase} Module`);
  
  let lockMessage = `This feature will unlock after the Phase ${requiredPhase} community launch.`;
  if (requiredPhase === 4) {
    lockMessage = 'MBTTC Trading launches in Phase 4.';
  } else if (customDescription) {
    lockMessage = customDescription;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl rounded-3xl p-7 sm:p-9 bg-gradient-to-b from-[#0e1613] via-[#09110d] to-[#050907] border-2 border-amber-500/35 overflow-hidden backdrop-blur-2xl shadow-[0_0_50px_rgba(245,158,11,0.12)] text-center">
        {/* Ambient Top Glow */}
        <div 
          aria-hidden="true" 
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" 
        />

        {/* Top Phase Lock Badge */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-950/40 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-5 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-mono font-extrabold tracking-wider uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>🔒 PHASE {requiredPhase} LOCKED</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono mb-2">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed mb-6 font-sans">
            {lockMessage}
          </p>

          {/* Module Information Pill */}
          {moduleDef && (
            <div className="w-full p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 text-left mb-6 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Required Launch Stage:</span>
                <span className="text-amber-400 font-bold">Phase {requiredPhase} Activation</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Module Classification:</span>
                <span className="text-zinc-200">{moduleDef.description}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Access Rule:</span>
                <span className="text-emerald-400 font-medium">Auto-Unlocks with Central Phase Control</span>
              </div>
            </div>
          )}

          {/* Action Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-mono text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{backButtonLabel}</span>
              </button>
            )}

            {onNavigateHub && (
              <button
                type="button"
                onClick={onNavigateHub}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-mono text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <Layers className="w-4 h-4" />
                <span>{actionButtonLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
