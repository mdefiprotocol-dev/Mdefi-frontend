import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { MbttcCoin3D } from './MbttcCoin3D';
import { playSwapSuccessSound } from '../utils/successSound';
import { mbttcMarketService } from '../services/mbttcMarketService';

interface MbttcSwapSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromToken: string;
  fromAmount: number;
  toToken: string;
  toAmount: number;
  txHash: string;
}

export const MbttcSwapSuccessModal: React.FC<MbttcSwapSuccessModalProps> = ({
  isOpen,
  onClose,
  fromToken,
  fromAmount,
  toToken,
  toAmount,
  txHash,
}) => {
  const [copied, setCopied] = useState(false);
  const isLive = mbttcMarketService.getMode() === 'live';

  useEffect(() => {
    if (isOpen) {
      // Play Web3 swap success sound on confirmed mount
      playSwapSuccessSound();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyHash = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortHash = txHash 
    ? `${txHash.slice(0, 10)}...${txHash.slice(-8)}`
    : '0x71c8...4982';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#0e1b14] via-[#0a140f] to-[#070c09] border border-emerald-500/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(16,185,129,0.22)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Rotating Light Rays Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 overflow-hidden">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-500/20 to-transparent animate-spin duration-[20s] linear" />
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800 transition-colors z-20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Main Content */}
        <div className="relative z-10 text-center">
          {/* Orbiting Tokens Celebration Animation */}
          <div className="relative w-28 h-28 mx-auto mb-4 flex items-center justify-center">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/40 animate-spin duration-[12s] linear" />
            
            {/* Center Checkmark */}
            <div className="relative z-10 p-4 rounded-full bg-emerald-950 border-2 border-emerald-400 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            {/* Orbiting Token 1: MBTTC */}
            <div className="absolute -top-1 -left-1 transform -translate-x-1 animate-bounce duration-1000">
              <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-400 flex items-center justify-center shadow-lg">
                <span className="text-[10px] font-black font-mono text-emerald-300">M</span>
              </div>
            </div>

            {/* Orbiting Token 2: USDT */}
            <div className="absolute -bottom-1 -right-1 transform translate-x-1 animate-bounce duration-1000 delay-150">
              <div className="w-8 h-8 rounded-full bg-[#26a17b] border border-white/40 flex items-center justify-center shadow-lg">
                <span className="text-[10px] font-black font-mono text-white">₮</span>
              </div>
            </div>
          </div>

          {/* Title & Celebration */}
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              ON-CHAIN TRANSACTION SETTLED
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-semibold mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              DEMO SWAP PREVIEW EXECUTED
            </span>
          )}

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isLive ? 'SWAP SUCCESSFUL! 🎉' : 'DEMO SWAP PREVIEW! 🎉'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-sm mx-auto">
            {isLive 
              ? 'Your token conversion has been verified and settled on BNB Smart Chain.'
              : 'Preview simulated trade completed. No real on-chain assets or contracts were modified.'}
          </p>

          {/* Swap Summary Card */}
          <div className="my-5 p-4 rounded-2xl bg-zinc-950/80 border border-emerald-500/20 text-left space-y-3">
            {/* From -> To Row */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase font-mono">Swapped Out</span>
                <span className="text-base font-bold text-white font-mono">
                  {fromAmount.toLocaleString()} {fromToken}
                </span>
              </div>
              <div className="p-2 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 block uppercase font-mono">Received</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  +{toAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {toToken}
                </span>
              </div>
            </div>

            {/* Status & Telemetry details */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Execution Mode</span>
                <span className={`font-mono font-semibold flex items-center gap-1 ${
                  isLive ? 'text-emerald-400' : 'text-amber-300'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isLive ? 'On-Chain Block Finalized' : 'Simulated Preview (Demo)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Settlement Route</span>
                <span className="font-mono text-zinc-300">
                  {fromToken} &rarr; {toToken} ({isLive ? 'PancakeSwap V2' : 'Simulated AMM'})
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-400 pt-2 border-t border-zinc-800/80">
                <span>Transaction Reference</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-zinc-300 text-[11px]">{shortHash}</span>
                  <button
                    onClick={handleCopyHash}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Reference"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-extrabold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Done &amp; Return</span>
            </button>

            {isLive ? (
              <a
                href={`https://bscscan.com/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-emerald-500/40 text-xs font-mono transition-all flex items-center justify-center gap-2"
              >
                <span>View on BscScan</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </a>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Close Simulation</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
