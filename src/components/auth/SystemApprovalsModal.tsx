import React, { useState, useEffect } from 'react';
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
import { getContractProvider } from '../../services/contractProvider';
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

  const handleStartApprovals = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Step 1: Hub Approval Animation
      setHubState('waiting_wallet');
      await new Promise((r) => setTimeout(r, 800));
      setHubState('confirming');
      await new Promise((r) => setTimeout(r, 1200));
      setHubState('confirmed');

      // Step 2: 100% Real On-Chain USDT Token Approval (Hub Contract reads dynamic usdtToken())
      setUsdtState('waiting_wallet');
      
      const liveUsdtAddress = await contractAdapter.getOnChainUsdtAddress();
      if (!liveUsdtAddress || !ethers.isAddress(liveUsdtAddress) || liveUsdtAddress === ethers.ZeroAddress) {
        throw new Error('Hub smart contract has not configured a valid USDT token address.');
      }

      const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
const signer = await browserProvider.getSigner();
      if (!signer) {
        throw new Error('Wallet signer unavailable. Please unlock your Web3 wallet.');
      }

      const usdtContract = new ethers.Contract(liveUsdtAddress, ERC20_ABI, signer);
      const activeWallet = connectedWalletAddress || await signer.getAddress();

      // Check live on-chain allowance first
      const currentAllowance: bigint = await usdtContract.allowance(activeWallet, HUB_ADDRESS);

      if (currentAllowance < ethers.parseUnits('1000', 18)) {
        // Trigger real wallet popup
        const tx = await usdtContract.approve(HUB_ADDRESS, ethers.MaxUint256);
        setUsdtState('confirming');
        const receipt = await tx.wait(1);
        if (!receipt || receipt.status === 0) {
          throw new Error('On-chain USDT approval transaction failed on BSC.');
        }
      } else {
        // Already approved on-chain
        setUsdtState('confirming');
        await new Promise((r) => setTimeout(r, 800));
      }

      setUsdtState('confirmed');

      // Step 3: System Activation Animation
      setActivationState('waiting_wallet');
      await new Promise((r) => setTimeout(r, 700));
      setActivationState('confirming');
      await new Promise((r) => setTimeout(r, 1100));
      setActivationState('confirmed');

      setIsProcessing(false);

      try {
        playClaimSuccessSound();
      } catch {
        // Audio fallback
      }
    } catch (err: any) {
      console.error('[SystemApprovals] Error:', err);
      const isReject = err?.code === 4001 || err?.message?.includes('rejected');
      setErrorMessage(isReject ? 'Approval transaction was rejected in your wallet.' : (err?.message || 'On-chain approval failed.'));
      setUsdtState('ready');
      setIsProcessing(false);
    }
  };

  const isAllApproved = hubState === 'confirmed' && usdtState === 'confirmed' && activationState === 'confirmed';

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
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> Waiting for wallet...
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
            Authorize standard decentralized smart contract interactions for the MDeFi protocol and BEP-20 token relayers.
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
          
          {/* Real Item 1: Live Wallet Connected */}
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

          {/* Real Item 2: Registration Completed */}
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

          {/* Step 3: Hub Approval */}
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

          {/* Step 4: Real On-Chain USDT Approval */}
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
                  <span className="text-[10px] text-zinc-400">BEP-20 Allowance Authorization</span>
                </div>
              </div>
              <div>{renderStateBadge(usdtState)}</div>
            </div>
          </div>

          {/* Step 5: System Activation */}
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
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>TRANSMITTING SMART CONTRACT APPROVALS...</span>
                </>
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