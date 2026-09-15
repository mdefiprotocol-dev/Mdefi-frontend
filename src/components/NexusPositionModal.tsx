import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Copy, 
  Check, 
  ShieldCheck, 
  User, 
  Clock, 
  ArrowUpRight, 
  Network,
  Info,
  ExternalLink
} from 'lucide-react';
import { NexusMatrixPosition, NexusPositionType } from '../types/nexusMatrix';
import { nexusPositionColors } from '../data/nexusMatrixData';

interface NexusPositionModalProps {
  isOpen: boolean;
  position: NexusMatrixPosition | null;
  packageName: string;
  onClose: () => void;
  rootUser?: {
    userId: string;
    walletAddress: string;
    matrixNumber: number;
    recycleCount: number;
  };
  isRoot?: boolean;
}

export const NexusPositionModal: React.FC<NexusPositionModalProps> = ({
  isOpen,
  position,
  packageName,
  onClose,
  rootUser,
  isRoot = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;
  if (!position && !isRoot) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render Root Node Modal
  if (isRoot && rootUser) {
    const color = nexusPositionColors.self;
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#1b1506] via-[#100d04] to-[#080703] border-2 border-amber-500/60 p-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] relative text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white font-mono">
                  {packageName} — Root Position
                </h3>
              </div>
              <span className="text-xs text-amber-300/80 font-mono">
                Center Matrix Origin (YOU)
              </span>
            </div>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex justify-between items-center">
              <span className="text-zinc-400">Position Level:</span>
              <span className="text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40">
                Center Root
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex justify-between items-center">
              <span className="text-zinc-400">Occupant Status:</span>
              <span className="text-amber-300 font-bold">
                Account Owner (YOU)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex justify-between items-center">
              <span className="text-zinc-400">Member ID:</span>
              <span className="font-bold text-white">
                {rootUser.userId}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex justify-between items-center">
              <span className="text-zinc-400">Wallet Address:</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-300">
                  {rootUser.walletAddress}
                </span>
                <button 
                  onClick={() => handleCopy(rootUser.walletAddress)}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                  title="Copy address"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex justify-between items-center">
              <span className="text-zinc-400">Current Matrix Number:</span>
              <span className="font-bold text-white">
                Matrix #{rootUser.matrixNumber}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 flex justify-between items-center">
              <span className="text-zinc-400">Recycle Count:</span>
              <span className="font-bold text-amber-400">
                {rootUser.recycleCount} Recycles Completed
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                All 30 concentric positions (Ring 1 through Ring 4) in this radial X6 matrix flow upward to complete your current cycle.
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-500/20">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold font-mono text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!position) return null;

  const posColor = nexusPositionColors[position.type];
  const isFilled = position.status === 'Filled';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-md rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-[#0a100c] border-2 ${
          isFilled ? posColor.borderColor : 'border-zinc-700/60'
        } p-6 shadow-2xl relative text-white`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className={`p-3 rounded-2xl border flex items-center justify-center ${posColor.badgeBg} ${posColor.badgeBorder} ${posColor.textColor}`}>
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white font-mono">
              {packageName} — Position #{position.positionNumber}
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              Ring {position.level} (Level {position.level}) • Slot {position.slotInRing} of {position.level === 1 ? 2 : position.level === 2 ? 4 : position.level === 3 ? 8 : 16}
            </span>
          </div>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex justify-between items-center">
            <span className="text-zinc-400">Position Type:</span>
            <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${posColor.badgeBg} ${posColor.badgeBorder} ${posColor.badgeText}`}>
              {posColor.label}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex justify-between items-center">
            <span className="text-zinc-400">Status:</span>
            <span className={`font-bold ${isFilled ? 'text-emerald-400' : 'text-zinc-400'}`}>
              {position.status}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex justify-between items-center">
            <span className="text-zinc-400">Occupant Member:</span>
            <span className="font-bold text-white">
              {position.userId || 'Available Position (Open Slot)'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex justify-between items-center">
            <span className="text-zinc-400">Wallet Address:</span>
            <div className="flex items-center gap-2">
              <span className={isFilled ? 'text-emerald-300 font-bold' : 'text-zinc-500 italic'}>
                {position.walletAddress || 'Pending contract placement'}
              </span>
              {position.walletAddress && (
                <button 
                  onClick={() => handleCopy(position.walletAddress!)}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                  title="Copy address"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex justify-between items-center">
            <span className="text-zinc-400">Parent Position:</span>
            <span className="text-zinc-200">
              {position.parentPositionNumber === 0 
                ? 'Root Node (YOU)' 
                : position.parentPositionNumber 
                ? `Slot #${position.parentPositionNumber}` 
                : 'Center'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex justify-between items-center">
            <span className="text-zinc-400">Active Matrix / Cycle:</span>
            <span className="text-zinc-200">
              Matrix #{position.matrixNumber} • Cycle #{position.recycleNumber}
            </span>
          </div>

          {position.activationDate && (
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex justify-between items-center">
              <span className="text-zinc-400">Placement Timestamp:</span>
              <span className="text-zinc-300">
                {position.activationDate}
              </span>
            </div>
          )}

          {position.incomeGeneratedUSD !== undefined && position.incomeGeneratedUSD > 0 && (
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex justify-between items-center">
              <span className="text-emerald-300">Reward Credit:</span>
              <span className="text-emerald-400 font-bold">
                +${(position.incomeGeneratedUSD ?? 0).toFixed(2)} USD
              </span>
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-[11px] text-zinc-400 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>
              {position.note || 'Contract-derived position telemetry'}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold font-mono text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
