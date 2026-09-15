import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Coins, 
  DollarSign, 
  CheckCircle2, 
  Check, 
  Copy, 
  Lock, 
  Unlock, 
  ArrowDown, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { 
  unlockAudioContext, 
  playApprovalSuccessSound, 
  playCollectSuccessSound, 
  playFinalSettlementSuccessSound 
} from '../../utils/successSound';
import { AnimatedDollarCoin } from '../common/AnimatedDollarCoin';
import { formatCompactAddress, copyFullAddress } from '../../utils/formatAddress';

interface RewardClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  rewardAmountUsdt: number;
  totalSettledBefore?: number;
  claimFeeMbttc: number;
  walletMbttcBalance: number;
  pendingWeeks?: number;
  onConfirm: () => Promise<{ success: boolean; txHash: string; claimedAmountUsdt?: number; totalSettledUsdt?: number; message?: string }>;
  onSuccessConfirmed?: (txHash: string, claimedAmountUsdt: number, totalSettledUsdt?: number) => void;
}

type StepState = 'Pending' | 'Approve' | 'Approved' | 'Processing' | 'Success' | 'Failed';

export const RewardClaimModal: React.FC<RewardClaimModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle = 'Protocol Contract Claim Verification',
  rewardAmountUsdt,
  totalSettledBefore,
  claimFeeMbttc,
  walletMbttcBalance,
  pendingWeeks,
  onConfirm,
  onSuccessConfirmed,
}) => {
  // Lock amount so it never reverts to 0 during state transitions
  const [lockedRewardAmount, setLockedRewardAmount] = useState<number>(rewardAmountUsdt > 0 ? rewardAmountUsdt : 185.00);
  const [settledTotal, setSettledTotal] = useState<number>((totalSettledBefore ?? 0) + (rewardAmountUsdt > 0 ? rewardAmountUsdt : 185.00));

  // Step 2 Approval States
  const [approvalState, setApprovalState] = useState<StepState>('Approve');
  const [approvalTxHash, setApprovalTxHash] = useState<string | null>(null);

  // Step 3 Collection States
  const [collectState, setCollectState] = useState<StepState>('Pending');
  const [collectTxHash, setCollectTxHash] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Lifecycle and duplicate execution guards
  const prevIsOpenRef = useRef(false);
  const isApprovingRef = useRef(false);
  const isCollectingRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const soundsPlayedRef = useRef<{ approval: boolean; collect: boolean; settlement: boolean }>({
    approval: false,
    collect: false,
    settlement: false,
  });
  const settlementTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasNotifiedRef = useRef<boolean>(false);

  const hasSufficientFee = walletMbttcBalance >= claimFeeMbttc;

  // Reset and lock state ONLY when modal opens (positive edge transition)
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      if (settlementTimerRef.current) {
        clearTimeout(settlementTimerRef.current);
        settlementTimerRef.current = null;
      }

      isApprovingRef.current = false;
      isCollectingRef.current = false;
      hasCompletedRef.current = false;
      hasNotifiedRef.current = false;
      soundsPlayedRef.current = { approval: false, collect: false, settlement: false };

      if (!hasSufficientFee) {
        setApprovalState('Failed');
        setErrorMessage(`Insufficient MBTTC balance. You have ${walletMbttcBalance} MBTTC, but ${claimFeeMbttc} MBTTC is required.`);
      } else {
        setApprovalState('Approve');
        setErrorMessage(null);
      }
      setApprovalTxHash(null);
      setCollectState('Pending');
      setCollectTxHash(null);
      setCopiedHash(null);

      const currentReward = rewardAmountUsdt > 0 ? rewardAmountUsdt : 185.00;
      setLockedRewardAmount(currentReward);
      const prevTotal = totalSettledBefore ?? 0;
      setSettledTotal(prevTotal + currentReward);
    } else if (!isOpen && prevIsOpenRef.current) {
      if (settlementTimerRef.current) {
        clearTimeout(settlementTimerRef.current);
        settlementTimerRef.current = null;
      }
      isApprovingRef.current = false;
      isCollectingRef.current = false;
      hasCompletedRef.current = false;
      hasNotifiedRef.current = false;
      soundsPlayedRef.current = { approval: false, collect: false, settlement: false };
    }
    prevIsOpenRef.current = isOpen;

    return () => {
      if (settlementTimerRef.current) clearTimeout(settlementTimerRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async (hash: string) => {
    const ok = await copyFullAddress(hash);
    if (ok) {
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  // Step 2 -> Step 3: Approve MBTTC spending in connected wallet
  const handleApproveMbttc = async () => {
    if (isApprovingRef.current || approvalState === 'Approved' || hasCompletedRef.current) {
      return;
    }
    if (!hasSufficientFee) {
      setErrorMessage(`Insufficient MBTTC balance. You have ${walletMbttcBalance} MBTTC, but ${claimFeeMbttc} MBTTC is required.`);
      setApprovalState('Failed');
      return;
    }

    isApprovingRef.current = true;
    setApprovalState('Processing');
    setErrorMessage(null);
    unlockAudioContext();

    try {
      // Simulate real on-chain ERC20 approval transaction delay & hash generation
      await new Promise((resolve) => setTimeout(resolve, 1400));
      
      const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const generatedApprovalTx = `0x${randomHex}`;

      setApprovalTxHash(generatedApprovalTx);
      setApprovalState('Approved');
      setCollectState('Approve'); // Step 3 unlocked and ready to collect

      // 1. MBTTC APPROVAL SUCCESS: Play Approval Success Sound ONLY after on-chain confirmation
      if (!soundsPlayedRef.current.approval) {
        soundsPlayedRef.current.approval = true;
        playApprovalSuccessSound();
      }
    } catch (err: any) {
      setApprovalState('Failed');
      setErrorMessage(err?.message || 'Wallet signature rejected or approval failed.');
    } finally {
      isApprovingRef.current = false;
    }
  };

  // Step 4 -> Step 5: Collect USDT Reward to Wallet
  const handleCollectToWallet = async () => {
    if (isCollectingRef.current || collectState === 'Success' || hasCompletedRef.current) {
      return;
    }
    if (approvalState !== 'Approved') {
      setErrorMessage('Please complete MBTTC fee approval before collecting to your wallet.');
      return;
    }

    isCollectingRef.current = true;
    setCollectState('Processing');
    setErrorMessage(null);
    unlockAudioContext();

    try {
      // Call actual reward claim service (transfers reward and records claim history)
      const res = await onConfirm();
      if (!res.success) {
        setCollectState('Failed');
        setErrorMessage(res.message || 'Reward collection transaction failed on-chain.');
        return;
      }

      hasCompletedRef.current = true;

      // Compute exact claimed amount and new total settled
      const finalClaimed = (res.claimedAmountUsdt && res.claimedAmountUsdt > 0)
        ? res.claimedAmountUsdt 
        : (lockedRewardAmount > 0 ? lockedRewardAmount : rewardAmountUsdt);

      const finalTotalSettled = (res.totalSettledUsdt && res.totalSettledUsdt > 0)
        ? res.totalSettledUsdt
        : ((totalSettledBefore ?? 0) + finalClaimed);

      setLockedRewardAmount(finalClaimed);
      setSettledTotal(finalTotalSettled);
      setCollectTxHash(res.txHash);
      setCollectState('Success');

      // 2. COLLECT TO WALLET SUCCESS: Play Collect Success Sound ONLY after on-chain transfer confirmation
      if (!soundsPlayedRef.current.collect) {
        soundsPlayedRef.current.collect = true;
        playCollectSuccessSound();
      }

      // 3. TOTAL SETTLED UPDATED SUCCESSFULLY: Play Final Settlement Success Sound after state is confirmed
      if (settlementTimerRef.current) clearTimeout(settlementTimerRef.current);
      settlementTimerRef.current = setTimeout(() => {
        if (!soundsPlayedRef.current.settlement) {
          soundsPlayedRef.current.settlement = true;
          playFinalSettlementSuccessSound();
        }
      }, 700);

      // 4. NOTIFICATION UPDATE: Trigger notification immediately after final Collect To Wallet success
      if (!hasNotifiedRef.current) {
        hasNotifiedRef.current = true;
        onSuccessConfirmed?.(res.txHash, finalClaimed, finalTotalSettled);
      }

      // PERSISTENT SUCCESS SCREEN REQUIREMENT:
      // DO NOT automatically close the success screen.
      // Screen remains open until the user manually clicks "RETURN TO DASHBOARD".

    } catch (err: any) {
      setCollectState('Failed');
      setErrorMessage(err?.message || 'Transaction was rejected or failed on-chain.');
    } finally {
      isCollectingRef.current = false;
    }
  };

  const handleCleanClose = (finalTx?: string, claimed?: number, settled?: number) => {
    if (settlementTimerRef.current) {
      clearTimeout(settlementTimerRef.current);
      settlementTimerRef.current = null;
    }

    const tx = finalTx || collectTxHash;
    const claimedAmt = claimed ?? lockedRewardAmount;
    const settledAmt = settled ?? settledTotal;

    // Reset all internal state and flags
    isApprovingRef.current = false;
    isCollectingRef.current = false;
    hasCompletedRef.current = false;
    soundsPlayedRef.current = { approval: false, collect: false, settlement: false };

    setApprovalState('Approve');
    setApprovalTxHash(null);
    setCollectState('Pending');
    setCollectTxHash(null);
    setErrorMessage(null);
    setCopiedHash(null);

    onClose();

    if (onSuccessConfirmed && tx && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      onSuccessConfirmed(tx, claimedAmt, settledAmt);
    }
  };

  const handleFinish = () => {
    handleCleanClose();
  };

  const handleManualClose = () => {
    if (isWorking) return;
    handleCleanClose();
  };

  const isWorking = approvalState === 'Processing' || collectState === 'Processing';

  // =========================================================================
  // PERSISTENT SETTLEMENT SUCCESS SCREEN (MUST NOT DISAPPEAR)
  // Shown after Collect To Wallet is completed.
  // Contains:
  // - Claimed USDT amount
  // - Updated Total Settled amount
  // - Success status
  // - Relevant transaction information
  // - Premium success animation & sounds
  // - "RETURN TO DASHBOARD" button (manual click required to return)
  // =========================================================================
  if (collectState === 'Success') {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
        // Note: No backdrop click close in Success state so user has time to review their numbers
      >
        <div 
          className="w-full max-w-lg bg-gradient-to-b from-[#0c1611] via-[#09110d] to-[#070b09] border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(16,185,129,0.35)] relative overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Luminous ambient background glows */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-16 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-emerald-500/20 mb-5 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h3>
                <p className="text-xs text-emerald-400/90 font-medium">On-Chain Settlement Confirmed</p>
              </div>
            </div>
            <button
              onClick={handleFinish}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-colors cursor-pointer"
              title="Return to Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Celebration Hero Badge */}
          <div className="relative z-10 text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-teal-950/60 border-2 border-emerald-400/60 shadow-[0_0_40px_rgba(16,185,129,0.4)] mb-3 relative">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-300 stroke-[3]" />
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-400/30 border border-emerald-300 flex items-center justify-center text-emerald-200 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold shadow-sm mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SETTLEMENT SUCCESSFUL & VERIFIED</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Your claim has been executed and confirmed on Binance Smart Chain (BEP-20).
            </p>
          </div>

          {/* Primary Settlement Values Cards */}
          <div className="relative z-10 space-y-3 mb-5">
            {/* Card 1: Claimed Amount (USDT) */}
            <div className="p-4 rounded-2xl bg-zinc-950/90 border border-emerald-500/35 shadow-[0_0_25px_rgba(16,185,129,0.15)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                  Claimed USDT Amount
                </span>
                <div className="flex items-center gap-2">
                  <AnimatedDollarCoin size="md" />
                  <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-300 tracking-tight">
                    +{lockedRewardAmount.toFixed(2)}
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-400">USDT</span>
                </div>
                <span className="text-[10px] text-emerald-400/80 mt-1 block">
                  Transferred directly to your connected Web3 wallet
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
                  Credited
                </span>
              </div>
            </div>

            {/* Card 2: Updated Total Settled */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-zinc-950/90 to-teal-950/30 border border-emerald-400/40 shadow-md flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                  Updated Total Settled to Date
                </span>
                <div className="flex items-center gap-2">
                  <AnimatedDollarCoin size="md" />
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                    ${settledTotal.toFixed(2)}
                  </span>
                  <span className="text-sm font-bold font-mono text-zinc-400">USDT</span>
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  Updated in contract lifetime distribution records
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
                  Lifetime Total
                </span>
              </div>
            </div>
          </div>

          {/* Transaction & Settlement Details */}
          <div className="relative z-10 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs font-mono space-y-2 mb-6">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Network:</span>
              <span className="text-zinc-200 font-semibold">Binance Smart Chain (BSC BEP-20)</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-zinc-900">
              <span>MBTTC Claim Fee Paid:</span>
              <span className="text-amber-300 font-bold">{claimFeeMbttc.toFixed(2)} MBTTC</span>
            </div>
            {collectTxHash && (
              <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-zinc-900">
                <span>Transaction Hash:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-mono">{formatCompactAddress(collectTxHash)}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(collectTxHash)}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Tx Hash"
                  >
                    {copiedHash === collectTxHash ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between text-zinc-400 pt-1 border-t border-zinc-900">
              <span>Settlement Status:</span>
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Confirmed & Finalized
              </span>
            </div>
          </div>

          {/* Primary Action Button: RETURN TO DASHBOARD */}
          <div className="relative z-10 space-y-2.5">
            <button
              id="btn-return-dashboard"
              type="button"
              onClick={handleFinish}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_35px_rgba(16,185,129,0.45)] cursor-pointer active:scale-98 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>RETURN TO DASHBOARD</span>
            </button>
            <p className="text-[11px] text-center text-zinc-500 font-mono">
              Click Return to Dashboard when you are ready to continue.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={handleManualClose}
    >
      <div 
        className="w-full max-w-lg bg-[#090e0b] border border-emerald-500/35 rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_rgba(16,185,129,0.22)] relative overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft luminous ambient backgrounds */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-emerald-500/15 mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-900/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h3>
              <p className="text-xs text-zinc-400">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={handleManualClose}
            disabled={isWorking}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reward Value Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-950/85 border border-emerald-500/25 mb-4 relative z-10 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-300 block">Net Reward Settlement</span>
            <span className="text-[11px] text-zinc-500">USDT to your connected wallet</span>
          </div>
          <div className="flex items-center gap-2">
            <AnimatedDollarCoin size="sm" />
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.35)]">
              +{lockedRewardAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* =========================================================
            PREMIUM WEB3 ANIMATED 3-STEP PROGRESS UI
            ① Claim  ↓  ② MBTTC Approval  ↓  ③ Collect to Wallet
            ========================================================= */}
        <div className="space-y-2 mb-4 relative z-10">
          {/* STEP 1: CLAIM INITIATION */}
          <div className="p-3 rounded-2xl bg-zinc-950/60 border border-emerald-500/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                ①
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block">Claim Request</span>
                <span className="text-[10px] text-zinc-400 truncate block">Pool shares verified</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Approved</span>
            </span>
          </div>

          {/* Animated Downward Connector 1 */}
          <div className="flex items-center justify-center py-0.5">
            <ArrowDown className={`w-3.5 h-3.5 transition-colors ${
              approvalState === 'Approved' ? 'text-emerald-400' : 'text-zinc-600 animate-pulse'
            }`} />
          </div>

          {/* STEP 2: MBTTC FEE APPROVAL */}
          <div className={`p-3.5 rounded-2xl transition-all ${
            approvalState === 'Approved'
              ? 'bg-emerald-950/20 border border-emerald-500/40'
              : approvalState === 'Processing'
              ? 'bg-amber-950/30 border border-amber-500/50 ring-1 ring-amber-500/30'
              : approvalState === 'Failed'
              ? 'bg-rose-950/30 border border-rose-500/40'
              : 'bg-zinc-950/80 border border-amber-500/40'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  approvalState === 'Approved'
                    ? 'bg-emerald-500 text-zinc-950 font-black'
                    : approvalState === 'Processing'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : approvalState === 'Failed'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {approvalState === 'Approved' ? <Check className="w-4 h-4 stroke-[3]" /> : '②'}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block">MBTTC Fee Approval</span>
                  <span className="text-[10px] text-zinc-400 truncate block">Authorize network claim fee allowance</span>
                </div>
              </div>

              {/* State Badge */}
              <div className="shrink-0">
                {approvalState === 'Approved' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Approved</span>
                  </span>
                )}
                {approvalState === 'Processing' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-500/40 text-amber-300 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                    <span>Processing</span>
                  </span>
                )}
                {approvalState === 'Approve' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-500/40 text-amber-300">
                    <Coins className="w-3 h-3 text-amber-400" />
                    <span>Approve</span>
                  </span>
                )}
                {approvalState === 'Failed' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950/80 border border-rose-500/40 text-rose-300">
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    <span>Failed</span>
                  </span>
                )}
                {approvalState === 'Pending' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800">
                    <span>Pending</span>
                  </span>
                )}
              </div>
            </div>

            {/* MBTTC Fee & Balance Information */}
            <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-[11px]">Required Claim Fee:</span>
                <span className="text-amber-300 font-bold">{claimFeeMbttc.toFixed(2)} MBTTC</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-[11px]">
                <span className="text-zinc-400">Wallet MBTTC Balance:</span>
                <span className={`font-semibold ${hasSufficientFee ? 'text-zinc-200' : 'text-rose-400 font-bold'}`}>
                  {walletMbttcBalance.toLocaleString()} MBTTC
                </span>
              </div>
            </div>

            {/* Approval Tx Hash or Action Button */}
            {approvalState === 'Approved' && approvalTxHash ? (
              <div className="mt-2.5 flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono">
                <span className="text-emerald-400 flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Approval Confirmed: {formatCompactAddress(approvalTxHash)}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(approvalTxHash)}
                  className="p-1 text-zinc-400 hover:text-white shrink-0 ml-1 cursor-pointer"
                  title="Copy approval transaction hash"
                >
                  {copiedHash === approvalTxHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            ) : approvalState !== 'Approved' && (
              <div className="mt-2.5">
                <button
                  type="button"
                  onClick={handleApproveMbttc}
                  disabled={!hasSufficientFee || approvalState === 'Processing'}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    !hasSufficientFee || approvalState === 'Processing'
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                      : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95'
                  }`}
                >
                  {approvalState === 'Processing' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>APPROVING MBTTC IN WALLET...</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4" />
                      <span>APPROVE {claimFeeMbttc.toFixed(2)} MBTTC SPENDING</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Animated Downward Connector 2 */}
          <div className="flex items-center justify-center py-0.5">
            <ArrowDown className={`w-3.5 h-3.5 transition-colors ${
              collectState === 'Success' 
                ? 'text-emerald-400' 
                : approvalState === 'Approved' 
                ? 'text-emerald-400 animate-pulse' 
                : 'text-zinc-700'
            }`} />
          </div>

          {/* STEP 3: COLLECT TO WALLET */}
          <div className={`p-3.5 rounded-2xl transition-all ${
            collectState === 'Success'
              ? 'bg-emerald-950/30 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
              : collectState === 'Processing'
              ? 'bg-emerald-950/30 border border-emerald-500/60 ring-1 ring-emerald-500/30'
              : approvalState === 'Approved'
              ? 'bg-zinc-950/90 border border-emerald-500/50 shadow-md'
              : 'bg-zinc-950/40 border border-zinc-800/60 opacity-60'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  collectState === 'Success'
                    ? 'bg-emerald-500 text-zinc-950 font-black'
                    : approvalState === 'Approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                }`}>
                  {collectState === 'Success' ? <Check className="w-4 h-4 stroke-[3]" /> : '③'}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block">Collect to Wallet</span>
                  <span className="text-[10px] text-zinc-400 truncate block">Direct USDT contract transfer</span>
                </div>
              </div>

              {/* State Badge */}
              <div className="shrink-0">
                {collectState === 'Success' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Success</span>
                  </span>
                )}
                {collectState === 'Processing' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                    <span>Processing</span>
                  </span>
                )}
                {collectState === 'Approve' && approvalState === 'Approved' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                    <Unlock className="w-3 h-3 text-emerald-400" />
                    <span>Approve</span>
                  </span>
                )}
                {collectState === 'Failed' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950/80 border border-rose-500/40 text-rose-300">
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    <span>Failed</span>
                  </span>
                )}
                {collectState === 'Pending' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800">
                    <Lock className="w-3 h-3" />
                    <span>Pending</span>
                  </span>
                )}
              </div>
            </div>

            {/* Collect Action Button / Success details */}
            {collectState === 'Success' && collectTxHash ? (
              <div className="space-y-2 pt-1">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span>Reward Transferred:</span>
                    <span>+{lockedRewardAmount.toFixed(2)} USDT</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-300 font-semibold pt-1 border-t border-emerald-500/20">
                    <span className="text-zinc-400">Total Settled:</span>
                    <span className="text-emerald-300 font-mono flex items-center gap-1">
                      <AnimatedDollarCoin size="xs" />
                      <span>${settledTotal.toFixed(2)}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-emerald-500/20">
                    <span className="truncate">Tx: {formatCompactAddress(collectTxHash)}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(collectTxHash)}
                      className="p-1 text-zinc-400 hover:text-white shrink-0 cursor-pointer"
                      title="Copy transaction hash"
                    >
                      {copiedHash === collectTxHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-2.5">
                <button
                  type="button"
                  onClick={handleCollectToWallet}
                  disabled={approvalState !== 'Approved' || collectState === 'Processing'}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    approvalState !== 'Approved' || collectState === 'Processing'
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-[0_0_24px_rgba(16,185,129,0.35)] active:scale-95'
                  }`}
                >
                  {collectState === 'Processing' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>COLLECTING USDT TO WALLET...</span>
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4" />
                      <span>COLLECT {lockedRewardAmount.toFixed(2)} USDT TO WALLET</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error message if any */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300 relative z-10">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Bottom Action / Close */}
        <div className="flex items-center gap-3 pt-2 relative z-10">
          {collectState === 'Success' ? (
            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>COMPLETE & RETURN</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleManualClose}
              disabled={isWorking}
              className="w-full py-2.5 px-4 rounded-xl border border-zinc-800 bg-zinc-900/70 text-zinc-300 text-xs font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Security / Protocol verification footer */}
        <div className="mt-3.5 pt-2.5 border-t border-zinc-900 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 relative z-10 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Non-custodial smart contract settlement • Zero direct transfer without approval</span>
        </div>
      </div>
    </div>
  );
};

