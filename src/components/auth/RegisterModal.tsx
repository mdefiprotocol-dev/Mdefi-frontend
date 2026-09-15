import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserPlus, 
  Wallet, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  Check, 
  AlertCircle,
  FileText,
  Lock,
  Sparkles,
  Loader2
} from 'lucide-react';
import { LegalDocType } from './LegalDocsModal';
import { formatCompactAddress } from '../../utils/formatAddress';
import { sponsorIdResolver, SponsorIdResolver } from '../../services/sponsorIdResolver';
import { contractAdapter, IRegistrationFeeInfo } from '../../services/contractAdapter';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedWalletAddress?: string;
  referralSponsorId?: string | null;
  onSuccess: (data: { userId: string; sponsorId: string; walletAddress: string }) => void;
  onOpenLegalDoc: (type: LegalDocType) => void;
  onSwitchWallet?: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  connectedWalletAddress = '0x71C839Fa24e93C298B321f8a84620a3b221B389',
  referralSponsorId,
  onSuccess,
  onOpenLegalDoc,
  onSwitchWallet,
}) => {
  // Form State
  const [hasUpline, setHasUpline] = useState<boolean | null>(referralSponsorId ? true : null);
  const [uplineId, setUplineId] = useState(referralSponsorId ? referralSponsorId.trim().toUpperCase() : '');
  
  // Mandatory Compliance Checkboxes
  const [agreeRisk, setAgreeRisk] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false);
  
  // Dynamic Registration Fee State
  const [feeInfo, setFeeInfo] = useState<IRegistrationFeeInfo | null>(null);

  // Submitting / Loading State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation / Error state
  const [errorMsg, setErrorMsg] = useState('');

  // Reset or initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setIsSubmitting(false);
      contractAdapter.getRegistrationFee().then(setFeeInfo);

      if (referralSponsorId) {
        setHasUpline(true);
        setUplineId(referralSponsorId.trim().toUpperCase());
      } else if (!hasUpline && (!uplineId || uplineId === 'MDF-00109')) {
        setHasUpline(null);
        setUplineId('');
      }
    }
  }, [isOpen, referralSponsorId]);

  if (!isOpen) return null;

  // Shorten address helper
  const shortenAddress = (addr: string) => {
    return formatCompactAddress(addr);
  };

  const isWalletConnected = Boolean(connectedWalletAddress && connectedWalletAddress.length > 0);
  const isUplineValid = hasUpline === false || (hasUpline === true && (referralSponsorId ? referralSponsorId.trim().length > 0 : uplineId.trim().length > 0));
  const isTermsAccepted = agreeRisk && agreePrivacy && agreeDisclaimer;
  const isReadyToRegister = isWalletConnected && isUplineValid && isTermsAccepted && !isSubmitting;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isWalletConnected) {
      setErrorMsg('A connected Web3 wallet is required to register.');
      return;
    }

    if (hasUpline === null && !referralSponsorId) {
      setErrorMsg('Please select whether you have an upline sponsor.');
      return;
    }

    if (hasUpline && !referralSponsorId && !uplineId.trim()) {
      setErrorMsg('Please enter your Upline / Sponsor ID.');
      return;
    }

    if (!isTermsAccepted) {
      setErrorMsg('You must review and accept all 3 legal policies to register.');
      return;
    }

    setIsSubmitting(true);

    try {
      const rawSponsor = referralSponsorId
        ? referralSponsorId.trim().toUpperCase()
        : (hasUpline ? uplineId.trim().toUpperCase() : SponsorIdResolver.ROOT_ADMIN_HUMAN_ID);

      // Decoupled resolution of Human-facing ID -> Smart Contract Numeric ID
      const resolved = await sponsorIdResolver.resolveSponsorNumericId(rawSponsor);
      if (!resolved.isValid) {
        setErrorMsg(resolved.errorMessage || 'Invalid Sponsor ID format.');
        setIsSubmitting(false);
        return;
      }

      // Execute through Contract Adapter
      const result = await contractAdapter.executeRegistration({
        uplineHumanFacingId: resolved.humanFacingId,
        uplineNumericId: resolved.numericId,
        walletAddress: connectedWalletAddress,
      });

      if (!result.success) {
        setErrorMsg(result.message || 'Registration execution failed.');
        setIsSubmitting(false);
        return;
      }

      onSuccess({
        userId: result.userFacingId,
        sponsorId: result.sponsorId,
        walletAddress: result.walletAddress,
      });
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred during registration.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl select-none overflow-y-auto">
      <div 
        className="relative w-full max-w-lg my-auto max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#081810] via-[#05110a] to-[#030906] border-2 border-emerald-500/40 shadow-[0_0_80px_rgba(16,185,129,0.3)] p-5 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">
                Create MDeFi Account
              </h3>
              <span className="text-xs text-zinc-400 font-mono">
                BNB Smart Chain Web3 Registration
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Section 1: Connected Web3 Wallet (Auto-populated, Readonly Display) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-300">
                Connected Web3 Wallet
              </span>
              {onSwitchWallet && (
                <button
                  type="button"
                  onClick={onSwitchWallet}
                  className="text-[11px] font-mono text-emerald-400 hover:underline hover:text-emerald-300 cursor-pointer"
                >
                  Switch Wallet
                </button>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-emerald-500/40 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-mono font-bold text-white tracking-wide block">
                    {shortenAddress(connectedWalletAddress)}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono block">
                    BNB Smart Chain (BEP-20)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Connected</span>
              </div>
            </div>
          </div>

          {/* Section 2: Upline Sponsor Selection */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-900">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-zinc-300 block">
                Do you have an Upline Sponsor?
              </label>
              {referralSponsorId && (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                  <Lock className="w-3 h-3" /> Referred by {referralSponsorId.toUpperCase()}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                disabled={Boolean(referralSponsorId)}
                onClick={() => {
                  if (referralSponsorId) return;
                  setHasUpline(true);
                  if (uplineId === 'MDF-00109') setUplineId('');
                }}
                className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-2xl text-[11px] sm:text-xs font-mono font-bold border transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-center ${
                  hasUpline === true
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/40'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                } ${referralSponsorId ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">YES, I HAVE UPLINE</span>
              </button>

              <button
                type="button"
                disabled={Boolean(referralSponsorId)}
                onClick={() => {
                  if (referralSponsorId) return;
                  setHasUpline(false);
                  setUplineId('MDF-00109');
                }}
                className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-2xl text-[11px] sm:text-xs font-mono font-bold border transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-center ${
                  hasUpline === false
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/40'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                } ${referralSponsorId ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="truncate">NO UPLINE</span>
              </button>
            </div>

            {/* If YES: Input Upline ID */}
            {hasUpline === true && (
              <div className="pt-2 animate-in fade-in-50 duration-150 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-zinc-300 block">
                    {referralSponsorId ? 'Verified Referral Sponsor ID:' : 'Enter Sponsor / Upline ID:'}
                  </label>
                  {referralSponsorId && (
                    <span className="text-[10px] font-mono text-zinc-500">Locked to referral</span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={referralSponsorId ? referralSponsorId.toUpperCase() : uplineId}
                    onChange={(e) => {
                      if (!referralSponsorId) {
                        setUplineId(e.target.value);
                      }
                    }}
                    readOnly={Boolean(referralSponsorId)}
                    placeholder="e.g. MDF-08421"
                    className={`w-full px-4 py-2.5 rounded-xl bg-zinc-950 border text-sm font-mono text-white placeholder-zinc-600 outline-none ${
                      referralSponsorId
                        ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300 cursor-not-allowed pr-10'
                        : 'border-zinc-800 focus:border-emerald-400'
                    }`}
                    required
                    autoFocus={!referralSponsorId}
                  />
                  {referralSponsorId && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 flex items-center pointer-events-none">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* If NO: Admin ID automatic binding notice */}
            {hasUpline === false && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-300 animate-in fade-in-50 duration-150 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Automatically assigned to Protocol Admin: <strong>MDF-00109</strong>
                </span>
              </div>
            )}
          </div>

          {/* Section 3: Risk Management & Legal Acceptance */}
          <div className="space-y-2.5 pt-2 border-t border-zinc-900">
            <span className="text-xs font-mono font-bold text-zinc-300 block">
              Required Terms &amp; Compliance Acceptance
            </span>

            {/* Checkbox 1: Risk Management */}
            <label className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeRisk}
                onChange={(e) => setAgreeRisk(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-400 cursor-pointer"
              />
              <span>
                I have read and understood the{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenLegalDoc('risk');
                  }}
                  className="text-emerald-400 font-semibold underline hover:text-emerald-300 inline-flex items-center gap-0.5 cursor-pointer"
                >
                  Risk Management Policy
                </button>{' '}
                and decentralized smart-contract execution dynamics.
              </span>
            </label>

            {/* Checkbox 2: Privacy Policy */}
            <label className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-400 cursor-pointer"
              />
              <span>
                I agree to the{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenLegalDoc('privacy');
                  }}
                  className="text-emerald-400 font-semibold underline hover:text-emerald-300 inline-flex items-center gap-0.5 cursor-pointer"
                >
                  Privacy Policy
                </button>{' '}
                and public blockchain storage guidelines.
              </span>
            </label>

            {/* Checkbox 3: Protocol Disclaimer */}
            <label className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeDisclaimer}
                onChange={(e) => setAgreeDisclaimer(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-zinc-700 text-emerald-500 focus:ring-emerald-400 cursor-pointer"
              />
              <span>
                I agree to the{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenLegalDoc('disclaimer');
                  }}
                  className="text-emerald-400 font-semibold underline hover:text-emerald-300 inline-flex items-center gap-0.5 cursor-pointer"
                >
                  Protocol Disclaimer
                </button>{' '}
                and voluntary non-custodial participation terms.
              </span>
            </label>
          </div>

          {/* Dynamic Registration Execution Fee Info */}
          {feeInfo && (
            <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Protocol Network Fee:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">{feeInfo.feeFormatted}</span>
                {feeInfo.isDynamic && (
                  <span className="text-[10px] text-zinc-500 font-mono">(Dynamic)</span>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button (Only enabled after all conditions met) */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={!isReadyToRegister}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isReadyToRegister
                  ? 'text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_35px_rgba(16,185,129,0.45)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  : 'text-zinc-500 bg-zinc-900 border border-zinc-800 opacity-60 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>CONFIRMING ON BLOCKCHAIN...</span>
                </>
              ) : (
                <>
                  <span>REGISTER ACCOUNT</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {!isReadyToRegister && !isSubmitting && (
              <p className="text-[11px] font-mono text-zinc-500 text-center">
                Select upline option and accept all 3 policies to enable registration
              </p>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
