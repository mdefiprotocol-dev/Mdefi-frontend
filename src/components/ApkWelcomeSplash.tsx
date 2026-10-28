import React, { useState, useEffect, useRef } from 'react';
import Rotating3DMbttcCoin from './common/Rotating3DMbttcCoin';

interface ApkWelcomeSplashProps {
  onEnter: () => void;
}

export const ApkWelcomeSplash: React.FC<ApkWelcomeSplashProps> = ({ onEnter }) => {
  const [showText, setShowText] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Seamless zero-tap audio auto-play engine
  const triggerAudioPlayback = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
      }

      if (audioRef.current) {
        audioRef.current.muted = false;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Unmute fallback for restrictive environments
            if (audioRef.current) {
              audioRef.current.muted = true;
              audioRef.current.play().then(() => {
                if (audioRef.current) audioRef.current.muted = false;
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn('[Audio AutoPlay] Triggering...', e);
    }
  };

  useEffect(() => {
    // 1. Audio instance setup
    const audio = new Audio('/assets/welcome.mp3');
    audio.preload = 'auto';
    audioRef.current = audio;

    const playTimer = setTimeout(() => {
      triggerAudioPlayback();
    }, 150);

    // 2. Text fade-in sync (matches video at 3.0s)
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 3000);

    // 3. Audio completion triggers the ENTER button
    audio.onended = () => {
      setShowEnterButton(true);
    };

    // 4. Fallback button unlock after 6.8s
    const fallbackTimer = setTimeout(() => {
      setShowEnterButton(true);
    }, 6800);

    const handleFirstTouch = () => {
      triggerAudioPlayback();
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };
    window.addEventListener('touchstart', handleFirstTouch, { once: true });
    window.addEventListener('click', handleFirstTouch, { once: true });

    return () => {
      clearTimeout(playTimer);
      clearTimeout(textTimer);
      clearTimeout(fallbackTimer);
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleEnterClick = () => {
    setIsFadingOut(true);
    if (audioRef.current) {
      let vol = 1.0;
      const fadeInterval = setInterval(() => {
        if (audioRef.current && vol > 0.15) {
          vol -= 0.2;
          audioRef.current.volume = Math.max(0, vol);
        } else {
          clearInterval(fadeInterval);
        }
      }, 50);
    }

    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-between p-6 bg-[#01040a] select-none overflow-hidden transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Visual Animation Engine */}
      <style>{`
        @keyframes laserCircuitPulse {
          0%, 100% { opacity: 0.35; filter: drop-shadow(0 0 5px #06b6d4); }
          50% { opacity: 0.95; filter: drop-shadow(0 0 16px #10b981); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50% { opacity: 0.95; transform: scale(1.25); }
        }
        @keyframes goldGlowText {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.45)); }
          50% { filter: drop-shadow(0 0 22px rgba(245, 158, 11, 0.9)); }
        }
        .gold-shimmer-title {
          background: linear-gradient(135deg, #FFFDF0 0%, #FDE68A 35%, #F59E0B 70%, #D97706 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: goldGlowText 2.4s ease-in-out infinite;
        }
      `}</style>

      {/* Space & Twinkling Gold Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{ animation: 'starTwinkle 3s infinite ease-in-out' }} className="absolute top-[12%] left-[18%] w-1.5 h-1.5 bg-amber-200 rounded-full blur-[0.5px]" />
        <div style={{ animation: 'starTwinkle 2.5s infinite ease-in-out 0.8s' }} className="absolute top-[26%] right-[16%] w-2 h-2 bg-yellow-100 rounded-full blur-[0.5px]" />
        <div style={{ animation: 'starTwinkle 4s infinite ease-in-out 1.2s' }} className="absolute top-[48%] left-[8%] w-1.5 h-1.5 bg-cyan-200 rounded-full blur-[0.5px]" />
        <div style={{ animation: 'starTwinkle 3.2s infinite ease-in-out 0.4s' }} className="absolute bottom-[22%] right-[12%] w-2.5 h-2.5 bg-amber-300 rounded-full blur-[1px]" />
        <div style={{ animation: 'starTwinkle 2.8s infinite ease-in-out 1.5s' }} className="absolute bottom-[35%] left-[22%] w-1 h-1 bg-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[390px] h-[390px] bg-gradient-to-tr from-cyan-600/15 via-emerald-500/10 to-amber-500/15 rounded-full blur-[110px]" />
      </div>

      {/* Cyber Circuit Board Vectors */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <svg
          style={{ animation: 'laserCircuitPulse 2.6s ease-in-out infinite' }}
          className="w-full h-full max-w-[440px] max-h-[720px] object-contain opacity-80"
          viewBox="0 0 400 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 25 210 L 115 285 L 155 340" stroke="#06b6d4" strokeWidth="1.8" strokeDasharray="3 3" />
          <path d="M 10 380 L 85 380 L 145 365" stroke="#10b981" strokeWidth="2" />
          <path d="M 35 520 L 125 460 L 155 395" stroke="#06b6d4" strokeWidth="1.8" />
          <circle cx="115" cy="285" r="4" fill="#06b6d4" />
          <circle cx="85" cy="380" r="4.5" fill="#10b981" />
          <circle cx="125" cy="460" r="4" fill="#06b6d4" />

          <path d="M 375 210 L 295 275 L 245 335" stroke="#10b981" strokeWidth="1.8" strokeDasharray="4 2" />
          <path d="M 390 370 L 315 370 L 255 365" stroke="#06b6d4" strokeWidth="2" />
          <path d="M 365 510 L 285 450 L 245 395" stroke="#10b981" strokeWidth="1.8" />
          <circle cx="295" cy="275" r="4.5" fill="#10b981" />
          <circle cx="315" cy="370" r="4" fill="#06b6d4" />
          <circle cx="285" cy="450" r="4.5" fill="#10b981" />
        </svg>
      </div>

      <div className="w-full h-6 z-10" />

      {/* Center Stage: Title + Native 3D MBTTC Coin + Button */}
      <div className="flex flex-col items-center justify-center text-center my-auto z-20 w-full max-w-sm px-4">
        {/* Title: MDeFi Protocol and Networks */}
        <div
          className={`transition-all duration-1000 transform mb-5 ${
            showText ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-5 scale-95 pointer-events-none'
          }`}
        >
          <h1 className="text-2xl sm:text-3xl font-black tracking-wide gold-shimmer-title leading-tight">
            MDeFi Protocol
            <br />
            <span className="text-xl sm:text-2xl font-bold tracking-normal opacity-95">
              and Networks
            </span>
          </h1>
        </div>

        {/* Integrated Native 3D Coin */}
        <div className="relative my-3 flex items-center justify-center pointer-events-none">
          <div className="absolute w-48 h-48 rounded-full bg-amber-500/20 blur-3xl animate-pulse" />
          <div className="scale-90 sm:scale-100">
            <Rotating3DMbttcCoin size={170} />
          </div>
        </div>

        {/* ENTER Button: Unlocks when audio finishes */}
        <div className="w-full max-w-[210px] mt-6 min-h-[58px] flex items-center justify-center">
          <div
            className={`w-full transition-all duration-700 transform ${
              showEnterButton
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            <button
              onClick={handleEnterClick}
              className="w-full py-2.5 px-6 rounded-lg font-black text-amber-300 text-sm tracking-[0.25em] uppercase transition-all duration-200 active:scale-95 bg-gradient-to-b from-[#141e17] to-[#09110c] border border-amber-400/80 shadow-[0_0_22px_rgba(245,158,11,0.5)] hover:border-amber-300 hover:shadow-[0_0_32px_rgba(245,158,11,0.8)]"
            >
              ENTER
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Secure Client Status */}
      <div className="w-full z-10 pb-2 text-center">
        <span className="text-[10px] text-emerald-500/40 font-mono tracking-widest uppercase">
          SECURE CLIENT ENVIRONMENT • BEP-20
        </span>
      </div>
    </div>
  );
};