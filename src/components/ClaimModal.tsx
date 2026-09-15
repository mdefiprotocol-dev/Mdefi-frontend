import React, { useState } from 'react';
import { X, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { MbttcCoin3D } from './MbttcCoin3D';
import { unlockAudioContext, playClaimSuccessSound } from '../utils/successSound';

interface ClaimResult {
  success: boolean;
  txHash: string;
  claimedAmount: number;
  message?: string;
}

interface ClaimModalProps {
  isOpen: boolean;
  rewardType?: 'Registration' | 'Referral' | 'Package' | null;
  type?: 'Registration' | 'Referral' | 'Package' | null;
  amount?: number;
  claimableAmount?: number;
  onClose: () => void;
  onConfirm?: (type: 'Registration' | 'Referral' | 'Package') => Promise<ClaimResult | void>;
  onConfirmClaim?: (type: 'Registration' | 'Referral' | 'Package') => Promise<ClaimResult | void>;
  onTriggerRewardPopup?: (amount: number, type: string) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  rewardType,
  type,
  amount,
  claimableAmount,
  onClose,
  onConfirm,
  onConfirmClaim,
  onTriggerRewardPopup,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedTx, setGeneratedTx] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeRewardType = rewardType || type || null;
  const activeAmount = typeof amount === 'number' ? amount : (typeof claimableAmount === 'number' ? claimableAmount : 0);
  const executeConfirm = onConfirm || onConfirmClaim;

  if (!isOpen || !activeRewardType) return null;

  const handleConfirm = async () => {
    if (!executeConfirm || isSubmitting) return;

    // Unlock Web Audio capability from user click interaction (does not play sound yet)
    unlockAudioContext();

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await executeConfirm(activeRewardType);

      // Verify actual wallet transaction confirmation
      if (res && typeof res === 'object' && res.success === false) {
        setIsSubmitting(false);
        setErrorMessage(res.message || 'Transaction was not confirmed');
        // Critical: Do NOT play sound or trigger success animation on failure
        return;
      }

      const realTx = (res && typeof res === 'object' && res.txHash) ? res.txHash : '';
      setGeneratedTx(realTx);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Play success chime synchronized with visual success
      playClaimSuccessSound();

      // Trigger celebration pop-up if provided
      if (onTriggerRewardPopup) {
        onTriggerRewardPopup(activeAmount, `${activeRewardType} Reward Claim`);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Transaction failed or was rejected by wallet');
      // Critical: Do NOT play sound on error
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-md bg-[#0b100d] border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-[0_0_60px_rgba(16,185,129,0.15)] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <MbttcCoin3D size="sm" interactive={false} glow={true} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Confirm {rewardType} Claim
              </h3>
              <span className="text-[11px] text-emerald-400 font-mono">
                MDefi Hub Vault Protocol
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="py-7 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_#10b981]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Reward Claimed Successfully!</h4>
              <p className="text-xs text-zinc-300 mt-1 max-w-xs mx-auto">
                <strong className="text-emerald-300 font-mono">+{activeAmount} MBTTC</strong> has been credited to your balance.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-left font-mono text-xs space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Status:</span>
                <span className="text-emerald-400 font-semibold">Confirmed</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Channel:</span>
                <span className="text-white">{activeRewardType} Vault</span>
              </div>
              <div className="flex justify-between text-zinc-400 truncate">
                <span>Transaction Hash:</span>
                <span className="text-emerald-300 font-mono">
                  {generatedTx ? (generatedTx.length > 18 ? `${generatedTx.slice(0, 10)}...${generatedTx.slice(-8)}` : generatedTx) : 'Confirmed On-Chain'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="web3-btn-primary web3-btn-success w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="py-5 space-y-4">
            {/* Amount card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-emerald-500/25 text-center relative overflow-hidden">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold block">
                Claimable Reward Amount
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono mt-1 tracking-tight">
                {(activeAmount ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-emerald-400 font-bold">MBTTC</span>
              </div>
              <span className="text-xs text-zinc-400 font-mono mt-1 block">
                ≈ ${((activeAmount ?? 0) * 1.5).toFixed(2)} USD (Benchmark)
              </span>
            </div>

            {/* Breakdown table showing Reward Type, Amount, Demo Network Fee, Total */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-xs font-mono">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Reward Type:</span>
                <span className="text-white font-semibold">{activeRewardType} Reward</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Claim Amount:</span>
                <span className="text-emerald-400 font-bold">{activeAmount ?? 0} MBTTC</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Network Fee:</span>
                <span className="text-zinc-300">~0.00045 BNB</span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between font-bold">
                <span className="text-zinc-200">Total Payout:</span>
                <span className="text-emerald-300 text-sm">+{activeAmount ?? 0} MBTTC</span>
              </div>
            </div>

            {/* Error notice if rejection or failure */}
            {errorMessage && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <p className="leading-snug">
                  <span className="font-semibold text-white">Transaction Not Completed:</span> {errorMessage}
                </p>
              </div>
            )}

            {/* Vault Protocol notice */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <p className="leading-snug">
                <span className="font-semibold text-white">Vault Protocol:</span> Confirming will execute the transaction and record the on-chain claim receipt to your wallet.
              </p>
            </div>

            {/* Action buttons: Cancel and Confirm Claim */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="web3-btn-secondary py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-850 font-semibold text-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting || activeAmount <= 0}
                className={`web3-btn-primary ${isSubmitting ? 'web3-btn-loading' : ''} py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Claim</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
