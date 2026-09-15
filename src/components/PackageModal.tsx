import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  AlertCircle, 
  RotateCcw,
  Network,
  Lock,
  Check
} from 'lucide-react';
import { PackageItem } from '../types';
import { AiHumanCharacter, AiCharacterVariant } from './AiHumanCharacter';
import { unlockAudioContext } from '../utils/successSound';
import { formatCompactAddress } from '../utils/formatAddress';
import { packageActivationService } from '../services/packageActivationService';
import { programPhaseService } from '../services/programPhaseService';

interface PackageModalProps {
  isOpen: boolean;
  pkg?: PackageItem | null;
  packageItem?: PackageItem | null;
  walletAddress?: string;
  onClose: () => void;
  onActivateConfirm?: (pkg: PackageItem) => Promise<{ success: boolean; txHash: string; message?: string }>;
  onConfirm?: (pkg: PackageItem) => Promise<any>;
  onNavigateToMatrix?: (packageId: string) => void;
  onOpenWalletModal?: () => void;
}

type ModalFlowStep = 
  | 'ready'               // Step 1: Ready to initiate USDT approval
  | 'approving'           // Step 1: Waiting for wallet & blockchain approval confirmation
  | 'approval_success'    // Step 1 confirmed! Ready for Step 2: Activate Now
  | 'activating'          // Step 2: Waiting for wallet & blockchain node activation confirmation
  | 'confirmed'           // Step 2 confirmed! Package activated, play sound & celebrate
  | 'rejected'            // Wallet rejected
  | 'failed';             // Network or execution failed

export const PackageModal: React.FC<PackageModalProps> = ({
  isOpen,
  pkg: directPkg,
  packageItem,
  walletAddress,
  onClose,
  onActivateConfirm,
  onConfirm,
  onNavigateToMatrix,
}) => {
  const pkg = directPkg || packageItem || null;
  const executeConfirm = onActivateConfirm || onConfirm;

  const [flowStep, setFlowStep] = useState<ModalFlowStep>('ready');
  const [approvalHash, setApprovalHash] = useState<string>('');
  const [activationHash, setActivationHash] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState(false);

  // Subscribe to package activation lifecycle events with automatic cleanup on unmount
  useEffect(() => {
    const unsubscribe = packageActivationService.subscribeToEvents((event) => {
      // Event listener for package activation events
      if (event.type === 'USDT_APPROVAL_CONFIRMED') {
        setApprovalHash(event.txHash);
      } else if (event.type === 'FINAL_PACKAGE_SUCCESS_CONFIRMED') {
        setActivationHash(event.txHash);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Reset state when opening modal for a new or different package
  useEffect(() => {
    if (isOpen) {
      setFlowStep('ready');
      setApprovalHash('');
      setActivationHash('');
      setErrorMessage('');
      setCopiedHash(false);
    }
  }, [isOpen, pkg?.id]);

  const handleTryAgain = () => {
    setFlowStep('ready');
    setErrorMessage('');
  };

  if (!isOpen || !pkg) return null;

  // Determine character variant from package
  const getCharacterVariant = (): AiCharacterVariant => {
    const id = pkg.id.toLowerCase();
    const name = pkg.name.toLowerCase();
    if (id.includes('junior') || name.includes('junior')) return 'junior';
    if (id.includes('senior') || name.includes('senior')) return 'senior';
    if (id.includes('quantum') || name.includes('quantum')) return 'quantum';
    if (id.includes('nexus') || name.includes('nexus')) return 'nexus';
    return 'junior';
  };

  const characterVariant = getCharacterVariant();

  const getPackageLaunchPhase = (): number => {
    const id = pkg.id.toLowerCase();
    const name = pkg.name.toLowerCase();
    if (id.includes('quantum') || name.includes('quantum') || id.includes('nexus') || name.includes('nexus')) return 3;
    if (id.includes('junior') || name.includes('junior') || id.includes('senior') || name.includes('senior')) return 2;
    return 1;
  };

  const requiredPhase = getPackageLaunchPhase();
  const isPackagePhaseActive = programPhaseService.getCurrentPhase() >= requiredPhase;

  const getSystemLabel = () => {
    if (pkg.id.includes('quantum') || pkg.name.includes('Quantum')) return 'Quantum Radial Matrix (30 Positions)';
    if (pkg.id.includes('nexus') || pkg.name.includes('Nexus')) return 'Nexus Prime Radial Matrix (30 Positions)';
    if (pkg.id.includes('senior') || pkg.name.includes('Senior')) return 'Senior S4 Binary Matrix (6 Slots)';
    return 'Junior S4 Binary Matrix (6 Slots)';
  };

  const activeWallet = walletAddress || '0x71C8395B5B821A8bF799059fF775485246999027';

  // =========================================================================
  // STEP 1: Execute USDT Approval
  // =========================================================================
  const handleStartApproval = async () => {
    if (!isPackagePhaseActive) {
      setFlowStep('failed');
      setErrorMessage(`This package unlocks in Phase ${requiredPhase} community launch.`);
      return;
    }
    // Trusted user gesture: unlock AudioContext for playback upon on-chain confirmation
    unlockAudioContext();
    console.log('[PACKAGE] Approval submitted');
    setFlowStep('approving');
    setErrorMessage('');

    try {
      const res = await packageActivationService.approveUsdt(activeWallet, pkg.priceUSD);
      // ONLY when actually confirmed successfully on-chain:
      if (res.success && res.txHash) {
        setApprovalHash(res.txHash);
        setFlowStep('approval_success');

        // Emit USDT_APPROVAL_CONFIRMED event (which triggers Approval Success Sound with txHash guard)
        packageActivationService.emitConfirmedEvent({
          type: 'USDT_APPROVAL_CONFIRMED',
          txHash: res.txHash,
          packageId: pkg.id,
          packageName: pkg.name,
          amountUsdt: pkg.priceUSD,
          ownerAddress: activeWallet,
          timestamp: Date.now(),
        });
      } else {
        setFlowStep('failed');
        setErrorMessage(res.message || 'USDT approval could not be confirmed on blockchain.');
      }
    } catch (err: any) {
      if (err?.code === 4001 || err?.message?.toLowerCase().includes('reject')) {
        setFlowStep('rejected');
        setErrorMessage('USDT spending approval was rejected in your wallet.');
      } else {
        setFlowStep('failed');
        setErrorMessage(err?.message || 'Approval transaction failed on network.');
      }
    }
  };

  // =========================================================================
  // STEP 2: Execute Node Activation Transaction & Final State Confirmation
  // =========================================================================
  const handleStartActivation = async () => {
    // Trusted user gesture: unlock AudioContext for playback upon on-chain confirmation
    unlockAudioContext();
    console.log('[PACKAGE] Activation submitted');
    setFlowStep('activating');
    setErrorMessage('');

    try {
      // 1. Verify and execute on-chain node placement
      const svcRes = await packageActivationService.activatePackage(pkg.id, pkg.priceUSD, activeWallet);
      if (!svcRes.success || !svcRes.txHash) {
        setFlowStep('failed');
        setErrorMessage(svcRes.message || 'Node activation failed payment verification.');
        return;
      }

      // STAGE 2: Blockchain node placement confirmed on-chain!
      // Emit PACKAGE_ACTIVATION_CONFIRMED event (which triggers Activation Success Sound with txHash guard)
      packageActivationService.emitConfirmedEvent({
        type: 'PACKAGE_ACTIVATION_CONFIRMED',
        txHash: svcRes.txHash,
        packageId: pkg.id,
        packageName: pkg.name,
        amountUsdt: pkg.priceUSD,
        ownerAddress: activeWallet,
        timestamp: Date.now(),
      });

      // 2. Synchronize package state and verify active status
      let txHash = svcRes.txHash;
      if (executeConfirm) {
        const appRes = await executeConfirm(pkg);
        if (appRes?.txHash) {
          txHash = appRes.txHash;
        }
      }

      // STAGE 3: Final package state confirmed and active!
      setActivationHash(txHash);
      setFlowStep('confirmed');

      // Emit FINAL_PACKAGE_SUCCESS_CONFIRMED event (which triggers Final Congratulations Sound with txHash guard)
      packageActivationService.emitConfirmedEvent({
        type: 'FINAL_PACKAGE_SUCCESS_CONFIRMED',
        txHash: txHash,
        packageId: pkg.id,
        packageName: pkg.name,
        amountUsdt: pkg.priceUSD,
        ownerAddress: activeWallet,
        timestamp: Date.now(),
      });

    } catch (err: any) {
      if (err?.code === 4001 || err?.message?.toLowerCase().includes('reject')) {
        setFlowStep('rejected');
        setErrorMessage('Node activation transaction was rejected in your wallet.');
      } else {
        setFlowStep('failed');
        setErrorMessage(err?.message || 'Activation transaction failed on network.');
      }
    }
  };

  const handleCopyHash = (hash: string) => {
    if (!hash) return;
    navigator.clipboard?.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const isBusy = flowStep === 'approving' || flowStep === 'activating';

  const handleCloseModal = () => {
    if (isBusy) return; // Prevent dismissing while blockchain transaction is broadcasting
    setFlowStep('ready');
    onClose();
  };

  const handleViewMatrix = () => {
    onClose();
    if (onNavigateToMatrix) {
      onNavigateToMatrix(pkg.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#070e0a] border-2 border-emerald-500/35 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.2)] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Light Beam */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={handleCloseModal}
          disabled={isBusy}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-40 cursor-pointer z-20"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Character Badge */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800/80 relative z-10">
          <AiHumanCharacter variant={characterVariant} size={56} mode="card-badge" />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400 uppercase">
                Package Activation
              </span>
              <span className="text-xs text-zinc-400 font-mono">Web3 Contract Flow</span>
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">
              {pkg.name} (${pkg.priceUSD} USDt)
            </h3>
          </div>
        </div>

        {/* Two-Step Progress Flow Indicator (USDT Approval → Node Activation) */}
        {flowStep !== 'confirmed' && flowStep !== 'rejected' && flowStep !== 'failed' && (
          <div className="my-4 p-3 rounded-2xl bg-zinc-950/90 border border-zinc-850 relative z-10 font-mono">
            <div className="flex items-center justify-between text-xs">
              {/* Step 1 Item */}
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  flowStep === 'approval_success' || flowStep === 'activating'
                    ? 'bg-emerald-500 text-black'
                    : flowStep === 'approving'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                }`}>
                  {flowStep === 'approval_success' || flowStep === 'activating' ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    '1'
                  )}
                </div>
                <div>
                  <span className={`text-[11px] font-bold block ${
                    flowStep === 'ready' || flowStep === 'approving' ? 'text-emerald-400' : 'text-zinc-300'
                  }`}>
                    USDT Approval
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {flowStep === 'approval_success' || flowStep === 'activating' ? 'Confirmed' : 'Spending Cap'}
                  </span>
                </div>
              </div>

              {/* Connector Arrow */}
              <div className="w-8 h-[1px] bg-zinc-800" />

              {/* Step 2 Item */}
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  flowStep === 'activating'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500 animate-pulse'
                    : flowStep === 'approval_success'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}>
                  {flowStep === 'ready' || flowStep === 'approving' ? (
                    <Lock className="w-3 h-3 text-zinc-400" />
                  ) : (
                    '2'
                  )}
                </div>
                <div>
                  <span className={`text-[11px] font-bold block ${
                    flowStep === 'approval_success' || flowStep === 'activating' ? 'text-emerald-400' : 'text-zinc-400'
                  }`}>
                    Activate Node
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {flowStep === 'activating' ? 'Mining Block...' : 'On-Chain Placement'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 1: READY FOR STEP 1 (USDT APPROVAL) */}
        {/* ================================================================= */}
        {flowStep === 'ready' && (
          <div className="space-y-4 animate-in fade-in relative z-10">
            {/* Package Price & Mode Summary */}
            <div className="p-4 rounded-2xl bg-zinc-950/90 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 block mb-0.5">Activation Fee</span>
                <span className="text-3xl font-black text-white font-mono">${pkg.priceUSD}.00</span>
                <span className="text-[11px] text-emerald-400 font-mono block mt-0.5">
                  BEP-20 USDt Stablecoin
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-zinc-400 block mb-0.5">Placement Engine</span>
                <span className="text-xs font-bold text-emerald-300 font-mono bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 inline-block">
                  {getSystemLabel()}
                </span>
              </div>
            </div>

            {/* Contract Specifications & Safety Check */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-850 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>USDT Contract:</span>
                <span className="text-zinc-300 font-bold">{formatCompactAddress(packageActivationService.getUsdtContractAddress(), 'BEP-20 (BSC)')}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Spender Contract:</span>
                <span className="text-zinc-300 font-bold">{formatCompactAddress(packageActivationService.getSpenderContractAddress(), 'Pre-Mainnet Ready')}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Connected Wallet:</span>
                <span className="text-emerald-400">{formatCompactAddress(activeWallet)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Current Allowance:</span>
                <span className="text-amber-400 font-bold">$0.00 USDt (Approval Required)</span>
              </div>
            </div>

            {/* Smart Contract Safety Note */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-2.5 text-xs text-zinc-400 font-sans">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Standard decentralized token payment safety: You must first approve the contract to spend exact <strong>${pkg.priceUSD}.00 USDT</strong>. No funds are deducted during the approval step.
              </span>
            </div>

            {!isPackagePhaseActive && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-2.5 text-left font-mono text-xs text-amber-300">
                <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>This package unlocks in Phase {requiredPhase} community launch. Node activation is currently locked.</span>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleCloseModal}
                className="web3-btn-secondary py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-bold cursor-pointer transition-colors"
              >
                {isPackagePhaseActive ? 'Cancel' : 'Close'}
              </button>
              {isPackagePhaseActive ? (
                <button
                  type="button"
                  onClick={handleStartApproval}
                  className="web3-btn-primary py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-mono font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Step 1: Approve USDT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="py-3 px-4 rounded-xl bg-zinc-900 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed opacity-90"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Phase {requiredPhase} Locked</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 2: APPROVING (WAITING FOR WALLET & BLOCKCHAIN CONFIRMATION) */}
        {/* ================================================================= */}
        {flowStep === 'approving' && (
          <div className="py-8 text-center space-y-5 animate-in fade-in relative z-10 font-mono">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
              <div className="w-16 h-16 rounded-full bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              </div>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase inline-block mb-2">
                Step 1 of 2: Approval In Progress
              </span>
              <h4 className="text-xl font-black text-white tracking-tight font-sans">
                Approving ${pkg.priceUSD}.00 USDT
              </h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto font-sans">
                Please approve the USDT spending cap in your connected wallet. Awaiting blockchain confirmation...
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 max-w-xs mx-auto flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Network State: Broadcasting Approval</span>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 3: APPROVAL SUCCESS (READY FOR STEP 2: ACTIVATE NOW) */}
        {/* ================================================================= */}
        {flowStep === 'approval_success' && (
          <div className="space-y-4 animate-in zoom-in-95 duration-200 relative z-10">
            {/* Approval Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-emerald-300 block">
                  Step 1 Complete: USDT Approved!
                </span>
                <span className="text-[11px] text-zinc-400 font-sans block">
                  Spending allowance of <strong>${pkg.priceUSD}.00 USDT</strong> verified on contract.
                </span>
              </div>
            </div>

            {/* Summary Card */}
            <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-850">
                <span className="text-zinc-400">Node Package:</span>
                <span className="text-white font-black">{pkg.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-850">
                <span className="text-zinc-400">Approval Hash:</span>
                <span className="text-emerald-400">{formatCompactAddress(approvalHash)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Contract Spender:</span>
                <span className="text-zinc-300 font-bold">MDeFi Matrix Node Contract</span>
              </div>
            </div>

            {/* Instruction */}
            <p className="text-xs text-zinc-400 font-sans leading-relaxed text-center px-2">
              Ready to execute on-chain node registration. Click below to execute the smart contract activation call.
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleCloseModal}
                className="web3-btn-secondary py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleStartActivation}
                className="web3-btn-primary py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-mono font-extrabold text-xs transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Step 2: Activate Now</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 4: ACTIVATING (WAITING FOR BLOCK MINING & PLACEMENT) */}
        {/* ================================================================= */}
        {flowStep === 'activating' && (
          <div className="py-8 text-center space-y-5 animate-in fade-in relative z-10 font-mono">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-teal-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
              <div className="w-16 h-16 rounded-full bg-teal-950/70 border border-teal-500/40 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
              </div>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-teal-950/70 border border-teal-500/40 text-teal-300 text-xs font-bold uppercase inline-block mb-2">
                Step 2 of 2: Node Placement
              </span>
              <h4 className="text-xl font-black text-white tracking-tight font-sans">
                Activating {pkg.name}...
              </h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto font-sans">
                Executing smart contract node placement on BNB Smart Chain. Synchronizing matrix cycle ledger...
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 max-w-xs mx-auto flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Network State: Mining Block</span>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 5: CONFIRMED / PREMIUM CONGRATULATIONS EXPERIENCE */}
        {/* ================================================================= */}
        {flowStep === 'confirmed' && (
          <div className="py-4 text-center space-y-5 animate-in zoom-in-95 duration-300 relative">
            {/* Rotating Celebration Light Rays */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none opacity-25 overflow-hidden">
              <div className="w-full h-full animate-ray-rotate bg-[conic-gradient(from_0deg_at_50%_50%,rgba(16,185,129,0.4)_0deg,transparent_60deg,rgba(20,184,166,0.3)_120deg,transparent_180deg,rgba(16,185,129,0.4)_240deg,transparent_300deg,rgba(16,185,129,0.4)_360deg)]" />
            </div>

            {/* Particle Burst Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <span className="absolute top-10 left-12 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute top-12 right-12 w-2.5 h-2.5 rounded-full bg-teal-300 animate-bounce" />
              <span className="absolute bottom-16 left-16 w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="absolute bottom-20 right-16 w-1.5 h-1.5 rounded-full bg-teal-200 animate-ping" />
            </div>

            {/* AI Human Character Celebration Presentation */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <AiHumanCharacter variant={characterVariant} mode="celebration" size={105} />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center text-black shadow-lg">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Congratulations Headline */}
            <div className="relative z-10 space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                <span>CONGRATULATIONS!</span>
                <span className="text-2xl">🎉</span>
              </h3>
              <p className="text-sm font-bold text-emerald-400 font-mono uppercase tracking-wider">
                Package Activation Complete
              </p>
            </div>

            {/* Telemetry Information Table */}
            <div className="relative z-10 space-y-2 p-4 rounded-2xl bg-zinc-950/90 border border-emerald-500/35 text-xs font-mono text-left">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-850">
                <span className="text-zinc-400">Package:</span>
                <span className="text-white font-extrabold">{pkg.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-850">
                <span className="text-zinc-400">Amount:</span>
                <span className="text-emerald-400 font-black">${pkg.priceUSD}.00 USDT</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-850">
                <span className="text-zinc-400">Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SUCCESS &bull; Confirmed On-Chain
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-850">
                <span className="text-zinc-400">Matrix Engine:</span>
                <span className="text-emerald-300 font-bold">Active & Synchronized</span>
              </div>
              
              {/* Transaction Hash */}
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                <span className="text-zinc-400">Transaction:</span>
                <div className="flex items-center gap-1.5 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800 text-zinc-300">
                  <span className="truncate max-w-[170px] sm:max-w-[220px]">
                    {activationHash || '0x498a12bc90fa77d8213e4492'}
                  </span>
                  <button
                    onClick={() => handleCopyHash(activationHash)}
                    className="p-1 rounded hover:text-emerald-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Copy Transaction Hash"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copiedHash && (
                    <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions: View Matrix & Continue */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleViewMatrix}
                className="web3-btn-secondary py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Network className="w-4 h-4" />
                <span>View Node Matrix</span>
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="web3-btn-primary web3-btn-success py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-mono font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.35)]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 6: REJECTED OR FAILED */}
        {/* ================================================================= */}
        {(flowStep === 'rejected' || flowStep === 'failed') && (
          <div className="py-6 text-center space-y-5 animate-in fade-in relative z-10 font-mono">
            <div className="w-16 h-16 rounded-full bg-rose-950/70 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(244,63,94,0.25)]">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold uppercase inline-block mb-2">
                {flowStep === 'rejected' ? 'REJECTED' : 'FAILED'}
              </span>
              <h4 className="text-xl font-black text-white tracking-tight font-sans">
                Activation Not Completed
              </h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto font-sans leading-relaxed">
                {errorMessage || 'The activation transaction was not completed. No funds or packages were modified.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="web3-btn-secondary py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-bold cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={handleTryAgain}
                className="web3-btn-primary web3-btn-failed py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
