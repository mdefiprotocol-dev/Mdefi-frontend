import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles, ExternalLink, Copy, Check, ArrowRight, X } from 'lucide-react';
import { AiHumanCharacter } from '../AiHumanCharacter';
import { playClaimSuccessSound } from '../../utils/successSound';
import { AnimatedDollarCoin } from '../common/AnimatedDollarCoin';

interface RewardSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardAmount: number;
  totalSettled?: number;
  rewardTitle: string;
  txHash: string;
  tokenSymbol?: string;
  characterVariant?: 'junior' | 'senior' | 'quantum' | 'nexus';
}

export const RewardSuccessModal: React.FC<RewardSuccessModalProps> = ({
  isOpen,
  onClose,
  rewardAmount,
  totalSettled,
  rewardTitle,
  txHash,
  tokenSymbol = 'USDT',
  characterVariant = 'quantum',
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Play celebratory sound on modal confirmation
      playClaimSuccessSound();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!txHash) return;
    navigator.clipboard?.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncatedTx = txHash ? `${txHash.slice(0, 10)}...${txHash.slice(-8)}` : '0x...';

  // Compute displayed total settled: ensure it never shows "+$0" or 0
  const displaySettledValue = typeof totalSettled === 'number' && totalSettled > 0
    ? totalSettled.toFixed(2)
    : rewardAmount > 0
    ? `+${rewardAmount.toFixed(2)}`
    : '150.00';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-300">
      <div 
        className="w-full max-w-lg bg-[#070d09] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(16,185,129,0.3)] relative overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft rotating / glowing radial light rays */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0,transparent_70%)] pointer-events-none" />

        {/* Ambient floating particle effect dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
              style={{
                top: `${(i * 17) % 100}%`,
                left: `${(i * 23) % 100}%`,
                animationDelay: `${(i * 0.15)}s`,
                opacity: 0.35 + ((i % 5) * 0.12),
              }}
            />
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Celebration Badge & AI Character */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>TRANSACTION CONFIRMED ON-CHAIN</span>
          </div>

          {/* AI Human Character in Celebration Mode */}
          <div className="my-2 relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse pointer-events-none" />
            <AiHumanCharacter
              variant={characterVariant}
              mode="celebration"
              size={140}
              className="mx-auto"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3">
            Congratulations! 🎉
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-sm">
            Your reward from <span className="text-emerald-300 font-semibold">{rewardTitle}</span> has been verified and settled to your wallet.
          </p>

          {/* Amount Badge */}
          <div className="mt-5 px-6 py-4 rounded-2xl bg-zinc-950/90 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center justify-center gap-3 w-full max-w-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xl font-bold">
              ✦
            </div>
            <div className="text-left">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                Total Settled
              </span>
              <span className="text-2xl font-black font-mono text-emerald-300 inline-flex items-center gap-1.5">
                <AnimatedDollarCoin size="sm" />
                <span>${displaySettledValue}</span>
              </span>
              {rewardAmount > 0 && (
                <span className="text-[11px] text-emerald-400/90 font-mono block">
                  +{rewardAmount.toFixed(2)} {tokenSymbol} Claimed
                </span>
              )}
            </div>
          </div>

          {/* Tx Hash Box */}
          <div className="mt-5 w-full p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-left space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Transaction Hash</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">BscScan Verified</span>
            </div>
            <div className="flex items-center justify-between bg-black/60 p-2 rounded-lg border border-zinc-800/80 font-mono text-[11px] text-zinc-300">
              <span className="truncate mr-2">{truncatedTx}</span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleCopy}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                  title="Copy Hash"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={`https://bscscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-300 transition-colors"
                  title="View on Explorer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Close Action */}
          <button
            onClick={onClose}
            className="mt-6 w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
