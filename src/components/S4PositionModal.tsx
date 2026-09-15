import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  ShieldCheck, 
  Copy, 
  Check, 
  Clock, 
  DollarSign, 
  RotateCcw, 
  Sparkles, 
  User, 
  ArrowUpRight,
  Info
} from 'lucide-react';
import { S4MatrixPosition, S4PackageData, S4PlacementType } from '../types/s4Matrix';
import { placementColors } from '../data/s4MatrixData';

interface S4PositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: S4MatrixPosition | null;
  isRoot?: boolean;
  packageData: S4PackageData;
}

export const S4PositionModal: React.FC<S4PositionModalProps> = ({
  isOpen,
  onClose,
  position,
  isRoot = false,
  packageData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { name, priceDisplay, currentMatrixNumber, recycleCount, rootUser, priceUSD } = packageData;

  // Render Root Position Details
  if (isRoot || !position) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-[#0c1810] border-2 border-amber-500/40 p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.15)] relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-mono font-extrabold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                  ROOT POSITION (YOU)
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {name} ({priceDisplay})
                </span>
              </div>
              <h3 className="text-xl font-black text-white font-mono mt-0.5 tracking-tight">
                Matrix Genesis Root Owner
              </h3>
            </div>
          </div>

          {/* Root Telemetry Grid */}
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-between">
              <span className="text-zinc-400">Owner Member ID:</span>
              <span className="font-extrabold text-white text-sm">
                {rootUser.userId}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-between">
              <span className="text-zinc-400">Wallet Address:</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-300 font-bold">
                  {rootUser.walletAddress}
                </span>
                <button
                  onClick={() => handleCopy(rootUser.walletAddress)}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy Wallet Address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-850 text-center">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                  Active Matrix
                </span>
                <span className="text-base font-extrabold text-white font-mono">
                  Matrix #{currentMatrixNumber}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-rose-500/30 text-center">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                  Auto-Recycle Cycles
                </span>
                <span className="text-base font-extrabold text-rose-400 font-mono">
                  {recycleCount} Completed
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-850 space-y-2">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-400">Matrix Structure:</span>
                <span className="text-white font-bold">2 Concentric Rings (6 Slots)</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-400">Level 1 Capacity:</span>
                <span className="text-emerald-400 font-bold">2 Positions (Ring 1)</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-400">Level 2 Capacity:</span>
                <span className="text-teal-400 font-bold">4 Positions (Ring 2)</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300 pt-1 border-t border-zinc-850">
                <span className="text-zinc-400">Total Yield Per Cycle:</span>
                <span className="text-emerald-300 font-extrabold">
                  {packageData.totalIncomePerCompleteMatrix}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold font-mono text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
            >
              Close Telemetry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render S4 Individual Slot Position Details
  const isFilled = position.status === 'Filled';
  const colorCfg = placementColors[position.placementType] || placementColors.empty;
  const ringLabel = position.level === 1 ? 'Ring 1 • Level 1' : 'Ring 2 • Level 2';
  const positionIndex = position.level === 1 ? `${position.slot} of 2` : `${position.slot - 2} of 4`;

  // Default demo yield based on package & level
  const defaultIncomeUSD = position.incomeGeneratedUSD ?? (priceUSD === 10 ? 4 : 8);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-[#0b1610] border-2 border-emerald-500/40 p-6 sm:p-7 shadow-[0_0_40px_rgba(16,185,129,0.18)] relative">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className={`p-3 rounded-2xl border ${colorCfg.badgeBg} ${colorCfg.badgeBorder} ${colorCfg.textColor}`}>
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] uppercase font-mono font-extrabold px-2 py-0.5 rounded border ${colorCfg.badgeBg} ${colorCfg.badgeBorder} ${colorCfg.badgeText}`}>
                {ringLabel}
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {name} (${priceUSD})
              </span>
            </div>
            <h3 className="text-xl font-black text-white font-mono mt-0.5 tracking-tight flex items-center gap-2">
              <span>Slot #{position.slot}</span>
              <span className="text-xs text-zinc-400 font-normal">
                (Position {positionIndex})
              </span>
            </h3>
          </div>
        </div>

        {/* Position Details Table */}
        <div className="space-y-2.5 font-mono text-xs">
          {/* Status & Placement Type */}
          <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-between">
            <span className="text-zinc-400">Placement Type:</span>
            <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 ${colorCfg.badgeBg} ${colorCfg.badgeBorder} ${colorCfg.badgeText}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${colorCfg.dotColor}`} />
              {colorCfg.label}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-between">
            <span className="text-zinc-400">Slot Status:</span>
            <span className={`font-extrabold flex items-center gap-1.5 ${isFilled ? 'text-emerald-400' : 'text-zinc-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isFilled ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
              {isFilled ? 'Occupied / Active' : 'Available / Empty Slot'}
            </span>
          </div>

          {/* Member & Wallet */}
          <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-between">
            <span className="text-zinc-400">Occupant Member ID:</span>
            <span className="font-extrabold text-white">
              {isFilled ? position.userId : 'Awaiting Member Placement'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-between">
            <span className="text-zinc-400">Masked Wallet:</span>
            {isFilled ? (
              <div className="flex items-center gap-2">
                <span className="text-emerald-300 font-bold">
                  {position.walletAddress}
                </span>
                <button 
                  onClick={() => handleCopy(position.walletAddress)}
                  className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy Wallet"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            ) : (
              <span className="text-zinc-500 italic">None</span>
            )}
          </div>

          {/* Sponsor ID */}
          {position.sponsorId && (
            <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-between">
              <span className="text-zinc-400">Sponsor ID:</span>
              <span className="text-zinc-200 font-bold">
                {position.sponsorId}
              </span>
            </div>
          )}

          {/* Matrix Number & Recycle Cycle */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-850 text-center">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-0.5">
                Matrix Cycle
              </span>
              <span className="text-sm font-extrabold text-white font-mono">
                Matrix #{position.matrixNumber}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-850 text-center">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-0.5">
                Recycle Status
              </span>
              <span className="text-sm font-extrabold text-rose-400 font-mono">
                {position.placementType === 'recycle' ? 'Re-entry Node' : `Cycle #${position.recycleNumber}`}
              </span>
            </div>
          </div>

          {/* Placement Timestamp */}
          {position.activationDate && (
            <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-850 flex items-center justify-between">
              <span className="text-zinc-400">Placement Timestamp:</span>
              <span className="text-zinc-300">
                {position.activationDate}
              </span>
            </div>
          )}

          {/* Income Generated */}
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <span className="text-emerald-200 font-medium">Matrix Income Generated:</span>
            <span className="text-emerald-400 font-extrabold text-sm">
              {isFilled ? `+$${defaultIncomeUSD.toFixed(2)} USD` : '$0.00 USD'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end">
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
