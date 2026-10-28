import React, { useState, useEffect, useRef } from 'react';
import Rotating3DMbttcCoin from './common/Rotating3DMbttcCoin';

interface ApkWelcomeSplashProps {
  onEnter: () => void;
}

export const ApkWelcomeSplash: React.FC<ApkWelcomeSplashProps> = ({ onEnter }) => {
  const [showText, setShowText] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasTriggeredAudio = useRef(false);

  // 1. Android WebView Native Safe Audio Engine
  const startAudio = () => {
    if (hasTriggeredAudio.current) return;
    hasTriggeredAudio.current = true;

    try {
      // Capacitor local base resolution for welcome.mp3
      const audioPath =
        window.location.protocol === 'capacitor:' || window.location.protocol === 'http:'
          ? `${window.location.origin}/assets/welcome.mp3`
          : 'assets/welcome.mp3';

      const audio = new Audio();
      audioRef.current = audio;
      audio.preload = 'auto';
      audio.src = audioPath;

      audio.onended = () => {
        setShowEnterButton(true);
      };

      audio.onerror = () => {
        console.warn('[Audio] Direct path fallback triggered');
        // Simple 1-time fallback without recursive infinite crash
        if (audio.src !== 'assets/welcome.mp3') {
          audio.src = 'assets/welcome.mp3';
          audio.play().catch(() => {});
        } else {
          setShowEnterButton(true);
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Unmute retry policy for strict mobile browsers
          audio.muted = true;
          audio
            .play()
            .then(() => {
              audio.muted = false;
            })
            .catch(() => {
              setShowEnterButton(true);
            });
        });
      }
    } catch (err) {
      console.warn('[Audio Init Error]:', err);
      setShowEnterButton(true);
    }
  };

  // 2. Ultra-Crisp Hardware-Accelerated Blockchain Canvas (Retina / OLED Optimized)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let displayWidth = window.innerWidth;
    let displayHeight = window.innerHeight;

    const setupCanvasResolution = () => {
      if (!canvas) return;
      displayWidth = window.innerWidth;
      displayHeight = window.innerHeight;
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    setupCanvasResolution();
    window.addEventListener('resize', setupCanvasResolution);

    // Blockchain network nodes
    const nodeCount = Math.min(Math.floor((displayWidth * displayHeight) / 12000), 40);
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * displayWidth,
      y: Math.random() * displayHeight,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1.2,
      isEmerald: Math.random() > 0.45,
      pulse: Math.random() * Math.PI,
    }));

    const render = () => {
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Deep Space Matrix Background
      ctx.fillStyle = '#01050a';
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Center Ambient Core Glow
      const radialGlow = ctx.createRadialGradient(
        displayWidth / 2,
        displayHeight * 0.46,
        25,
        displayWidth / 2,
        displayHeight * 0.46,
        displayWidth * 0.7
      );
      radialGlow.addColorStop(0, 'rgba(16, 185, 129, 0.16)');
      radialGlow.addColorStop(0.35, 'rgba(6, 182, 212, 0.1)');
      radialGlow.addColorStop(0.8, 'rgba(1, 5, 10, 0.95)');
      radialGlow.addColorStop(1, '#01050a');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Render Nodes & Circuit Laser Bridges
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.03;

        if (n.x < 0 || n.x > displayWidth) n.vx *= -1;
        if (n.y < 0 || n.y > displayHeight) n.vy *= -1;

        const currentRadius = n.radius + Math.sin(n.pulse) * 0.6;
        const color = n.isEmerald ? '#10b981' : '#06b6d4';

        // Draw Glowing Node
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Blockchain Tracks
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(${n.isEmerald ? '16, 185, 129' : '6, 182, 212'}, ${
              (1 - dist / 110) * 0.45
            })`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setupCanvasResolution);
    };
  }, []);

  // 3. Audio & UI Synchronization
  useEffect(() => {
    const autoAudioTimer = setTimeout(() => {
      startAudio();
    }, 200);

    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 2400);

    const fallbackUnlock = setTimeout(() => {
      setShowEnterButton(true);
    }, 6500);

    const onUserTouch = () => {
      startAudio();
      window.removeEventListener('touchstart', onUserTouch);
      window.removeEventListener('click', onUserTouch);
    };
    window.addEventListener('touchstart', onUserTouch, { once: true });
    window.addEventListener('click', onUserTouch, { once: true });

    return () => {
      clearTimeout(autoAudioTimer);
      clearTimeout(textTimer);
      clearTimeout(fallbackUnlock);
      window.removeEventListener('touchstart', onUserTouch);
      window.removeEventListener('click', onUserTouch);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleEnterClick = () => {
    setIsFadingOut(true);
    if (audioRef.current) {
      let vol = 1.0;
      const fader = setInterval(() => {
        if (audioRef.current && vol > 0.15) {
          vol -= 0.2;
          audioRef.current.volume = Math.max(0, vol);
        } else {
          clearInterval(fader);
        }
      }, 50);
    }

    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <div
      onClick={startAudio}
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-between p-6 select-none overflow-hidden transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* High-Definition Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      <style>{`
        @keyframes goldCinematicShimmer {
          0%, 100% {
            filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.4)) drop-shadow(0 0 24px rgba(245, 158, 11, 0.25));
          }
          50% {
            filter: drop-shadow(0 0 18px rgba(251, 191, 36, 0.85)) drop-shadow(0 0 35px rgba(217, 119, 6, 0.55));
          }
        }
        @keyframes buttonEnergyPulse {
          0%, 100% {
            box-shadow: 0 0 18px rgba(245, 158, 11, 0.35), inset 0 0 10px rgba(251, 191, 36, 0.2);
          }
          50% {
            box-shadow: 0 0 32px rgba(245, 158, 11, 0.75), inset 0 0 18px rgba(251, 191, 36, 0.4);
          }
        }
        .cinematic-gold-title {
          background: linear-gradient(135deg, #FFFFFF 0%, #FEF08A 30%, #F59E0B 70%, #B45309 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: goldCinematicShimmer 3s ease-in-out infinite;
        }
      `}</style>

      {/* Top Protocol Status Badges */}
      <div className="w-full flex justify-between items-center pt-2 z-10 max-w-xl mx-auto">
        <span className="text-[10px] tracking-widest text-emerald-400 font-mono uppercase bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center gap-1.5 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          CORE ONLINE
        </span>
        <span className="text-[10px] tracking-widest text-cyan-300 font-mono uppercase bg-cyan-950/60 border border-cyan-500/40 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.2)] backdrop-blur-sm">
          BEP-20 ECOSYSTEM
        </span>
      </div>

      {/* Center Cinematic Stage */}
      <div className="flex flex-col items-center justify-center text-center my-auto z-10 w-full max-w-md px-4">
        {/* Title */}
        <div
          className={`transition-all duration-1000 transform mb-5 ${
            showText
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-6 scale-95 pointer-events-none'
          }`}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide cinematic-gold-title leading-tight">
            MDeFi Protocol
            <br />
            <span className="text-xl sm:text-2xl font-bold tracking-normal opacity-95 text-amber-200">
              and Networks
            </span>
          </h1>
        </div>

        {/* 3D Rotating MBTTC Coin */}
        <div className="relative my-4 flex items-center justify-center pointer-events-none">
          <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-amber-500/25 via-emerald-500/15 to-cyan-500/15 blur-3xl animate-pulse" />
          <div className="scale-100 sm:scale-110 drop-shadow-[0_0_35px_rgba(245,158,11,0.5)]">
            <Rotating3DMbttcCoin size={175} />
          </div>
        </div>

        {/* Enter Button */}
        <div className="w-full max-w-[220px] mt-6 min-h-[60px] flex items-center justify-center">
          <div
            className={`w-full transition-all duration-700 transform ${
              showEnterButton
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            <button
              onClick={handleEnterClick}
              style={{ animation: 'buttonEnergyPulse 2.4s infinite ease-in-out' }}
              className="w-full py-3 px-8 rounded-xl font-black text-amber-300 text-sm tracking-[0.28em] uppercase transition-all duration-200 active:scale-95 bg-gradient-to-b from-[#131d17] via-[#09120e] to-[#040806] border border-amber-400/90 hover:border-amber-300 flex items-center justify-center gap-2"
            >
              <span>ENTER</span>
              <svg className="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Client Environment Tag */}
      <div className="w-full z-10 pb-2 text-center">
        <span className="text-[10px] text-emerald-400/60 font-mono tracking-widest uppercase">
          SECURE CLIENT ENVIRONMENT • BEP-20
        </span>
      </div>
    </div>
  );
};