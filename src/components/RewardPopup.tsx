import React, { useEffect, useState } from 'react';
import { MbttcCoin3D } from './MbttcCoin3D';

export interface RewardPopupEvent {
  id: string;
  amount: number | string;
  type?: string;
}

interface RewardPopupProps {
  event?: RewardPopupEvent | null;
  onComplete?: () => void;
  amount?: number | string;
  type?: string;
  onClose?: () => void;
}

export const RewardPopup: React.FC<RewardPopupProps> = ({ 
  event, 
  onComplete, 
  amount, 
  type, 
  onClose 
}) => {
  const [visible, setVisible] = useState(false);

  const activeAmount = event ? event.amount : amount;
  const activeType = event ? event.type : type;
  const handleDone = () => {
    if (onComplete) onComplete();
    if (onClose) onClose();
  };

  useEffect(() => {
    if (event || amount !== undefined) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(handleDone, 400);
      }, 2600);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [event, amount]);

  if ((!event && amount === undefined) || !visible) return null;

  // Generate 8 randomized micro-particles
  const particles = [
    { tx: '-38px', ty: '-42px', delay: '0.1s', size: 'w-1.5 h-1.5' },
    { tx: '44px', ty: '-36px', delay: '0.15s', size: 'w-2 h-2' },
    { tx: '-48px', ty: '20px', delay: '0.2s', size: 'w-1.5 h-1.5' },
    { tx: '46px', ty: '28px', delay: '0.05s', size: 'w-1 h-1' },
    { tx: '-22px', ty: '-54px', delay: '0.25s', size: 'w-1 h-1' },
    { tx: '25px', ty: '-58px', delay: '0.18s', size: 'w-1.5 h-1.5' },
    { tx: '-14px', ty: '45px', delay: '0.12s', size: 'w-2 h-2' },
    { tx: '38px', ty: '-10px', delay: '0.22s', size: 'w-1 h-1' },
  ];

  return (
    <div 
      className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center animate-in fade-in duration-200"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center">
        {/* Soft emerald radial flash behind */}
        <div className="absolute w-56 h-56 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-pulse" />

        {/* Particles around the coin */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {particles.map((p, idx) => (
            <span
              key={idx}
              className={`absolute rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399] animate-particle ${p.size}`}
              style={
                {
                  '--tx': p.tx,
                  '--ty': p.ty,
                  animationDelay: p.delay,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* 3D Coin that pops up, scales up, and rotates smoothly */}
        <div className="relative z-10 animate-coin-pop drop-shadow-[0_12px_24px_rgba(16,185,129,0.35)]">
          <MbttcCoin3D size="lg" interactive={false} autoRotate={true} glow={true} />
        </div>

        {/* Floating "+XXX MBTTC" with elegant upward translation */}
        <div className="mt-3 relative z-20 animate-float-up-fade text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-950/90 border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.4)] backdrop-blur-md">
            <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-emerald-300 drop-shadow-[0_0_10px_#10b981]">
              +{activeAmount} MBTTC
            </span>
          </div>
          <span className="block text-[11px] font-medium text-emerald-400/90 font-mono mt-1 drop-shadow">
            {activeType || 'Simulated Reward Received'}
          </span>
        </div>
      </div>
    </div>
  );
};
