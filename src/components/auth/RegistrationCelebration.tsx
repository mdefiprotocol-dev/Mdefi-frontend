import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  ExternalLink,
  Coins,
  ShieldCheck,
  Award,
  Clock
} from 'lucide-react';
import { MbttcCoin3D } from '../MbttcCoin3D';
import { playClaimSuccessSound, unlockAudioContext } from '../../utils/successSound';
import { 
  MBTTC_TOKEN_ADDRESS, 
  getActivePhaseConfig 
} from '../../data/contractConfig';
import { formatCompactAddress, copyFullAddress } from '../../utils/formatAddress';

interface RegistrationCelebrationProps {
  userId: string;
  sponsorId: string;
  walletAddress: string;
  onProceedToApprovals: () => void;
}

export const RegistrationCelebration: React.FC<RegistrationCelebrationProps> = ({
  userId,
  sponsorId,
  walletAddress,
  onProceedToApprovals,
}) => {
  const [copied, setCopied] = useState(false);
  const activePhase = getActivePhaseConfig();
  const rewardAmount = activePhase.registrationReward; // 30 MBTTC in Phase 1

  useEffect(() => {
    // Attempt audio unlock and chime safely
    try {
      unlockAudioContext();
      setTimeout(() => {
        playClaimSuccessSound();
      }, 250);
    } catch {
      // Audio autoplay fallback
    }
  }, []);

  const handleCopyAddress = async () => {
    const ok = await copyFullAddress(MBTTC_TOKEN_ADDRESS);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

 const truncatedWallet = walletAddress
    ? formatCompactAddress(walletAddress)
    : '0x0000...0000';

  // Bug 3 Root Fix: Agar NO UPLINE ya Root mapping ho, to guaranteed MDF-248161 dikhe
  const displaySponsor = (() => {
    if (!sponsorId || sponsorId === 'None' || sponsorId === '0' || sponsorId === '1' || sponsorId.includes('248269')) {
      return 'MDF-248161';
    }
    if (sponsorId.startsWith('MDF-')) {
      return sponsorId;
    }
    const num = Number(sponsorId);
    if (!isNaN(num) && num > 0) {
      return `MDF-${num < 1000 ? 248160 + num : num}`;
    }
    return sponsorId;
  })();

  const isDeployed = Boolean(MBTTC_TOKEN_ADDRESS && MBTTC_TOKEN_ADDRESS.length >= 18);
  const truncatedContract = isDeployed
    ? formatCompactAddress(MBTTC_TOKEN_ADDRESS)
    : 'Pre-Deployment (Pending Contract Launch)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl overflow-y-auto select-none">
      {/* Dynamic Celebration Rays in background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-cyan-500/15 blur-3xl animate-pulse duration-5000" />
      </div>

      {/* Floating Celebration Particles / Balloons Simulation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 10 + 6}px`,
              height: `${Math.random() * 14 + 8}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#10b981', '#34d399', '#06b6d4', '#a855f7', '#fbbf24'][i % 5],
              opacity: 0.6,
              animation: `floatUpFade ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.2)}s`,
              boxShadow: '0 0 12px currentColor',
            }}
          />
        ))}
      </div>

      {/* Celebration Modal Content */}
      <div className="relative z-10 w-full max-w-lg my-auto max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0a1a11] via-[#05110a] to-[#030906] border-2 border-emerald-400 shadow-[0_0_80px_rgba(16,185,129,0.35)] text-center space-y-6 animate-in zoom-in-95 duration-300">
        
        {/* Celebration Coin Badge */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-emerald-500/30 rounded-full blur-xl animate-pulse" />
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-950/90 border-2 border-emerald-400 flex items-center justify-center shadow-2xl relative">
              <MbttcCoin3D size="lg" interactive={false} autoRotate={true} glow={true} />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-black shadow-lg">
              <CheckCircle2 className="w-4 h-4 font-black" />
            </div>
          </div>
        </div>

        {/* Celebration Heading */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>🎉 REGISTRATION BONUS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            MBTTC TOKEN CREDITED
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Welcome to MDeFi! Your genesis registration reward has been programmatically minted to your account.
          </p>
        </div>

        {/* Big Reward Amount Box */}
        <div className="p-5 rounded-2xl bg-zinc-950/90 border border-emerald-500/40 shadow-inner space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block">
            GENESIS REWARD AMOUNT
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-4xl sm:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              {rewardAmount}
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
              MBTTC
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 block">
            Calculated via Hub Smart Contract: {activePhase.name} (Live Phase)
          </span>
        </div>

        {/* Account & Token Telemetry Box */}
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2 text-xs text-left">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-mono">Assigned MDeFi ID:</span>
            <span className="font-mono font-bold text-emerald-400">{userId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-mono">Upline Sponsor:</span>
            <span className="font-mono font-semibold text-cyan-300">{displaySponsor}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-mono">Your Wallet:</span>
            <span className="font-mono font-bold text-white">{truncatedWallet}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
            <span className="text-zinc-400 font-mono">Token Contract:</span>
            <span className="font-mono text-zinc-300 text-[11px]">{truncatedContract}</span>
          </div>
        </div>

        {/* Token Actions: Copy Address & View Token */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {isDeployed ? (
            <>
              <button
                onClick={handleCopyAddress}
                className="w-full py-3 px-4 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 bg-zinc-900 border-zinc-700 hover:border-emerald-400 text-zinc-200 hover:text-white"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">✓ Token Address Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-400" />
                    <span>COPY TOKEN ADDRESS</span>
                  </>
                )}
              </button>

              <a
                href={`https://bscscan.com/token/${MBTTC_TOKEN_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 bg-zinc-900 border-zinc-700 hover:border-cyan-400 text-zinc-200 hover:text-white"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>VIEW MBTTC TOKEN</span>
              </a>
            </>
          ) : (
            <div className="sm:col-span-2 py-2.5 px-4 rounded-xl text-xs font-mono border bg-zinc-950/80 border-zinc-800 text-zinc-400 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Token Contract: Official BEP-20 Contract Pending Mainnet Deployment</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onProceedToApprovals}
            className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>PROCEED TO SYSTEM APPROVALS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
