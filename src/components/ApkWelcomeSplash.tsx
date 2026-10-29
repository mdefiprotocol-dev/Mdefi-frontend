import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, ShieldCheck, Zap, Lock, ArrowRight } from 'lucide-react';
import Rotating3DMbttcCoin from './common/Rotating3DMbttcCoin';

export interface ApkWelcomeSplashProps {
  onEnter?: () => void;
  className?: string;
  soundEnabled?: boolean;
}

interface TimedLetter {
  char: string;
  time: number;
}

interface TimedWord {
  word: string;
  letters: TimedLetter[];
  isHighlight?: boolean;
}

function buildLetterTimeline(): { line1: TimedWord[]; line2: TimedWord[] } {
  const line1Defs = [
    { word: 'Welcome', start: 3.8, end: 4.4 },
    { word: 'to', start: 4.45, end: 4.8 },
    { word: 'MDeFi', start: 4.85, end: 5.6, isHighlight: true },
  ];

  const line2Defs = [
    { word: 'Protocol', start: 5.65, end: 6.35, isHighlight: true },
    { word: '&', start: 6.4, end: 6.65 },
    { word: 'Networks', start: 6.7, end: 7.7, isHighlight: true },
  ];

  const mapWords = (defs: { word: string; start: number; end: number; isHighlight?: boolean }[]): TimedWord[] => {
    return defs.map((def) => {
      const chars = Array.from(def.word);
      const span = (def.end - def.start) / Math.max(1, chars.length);
      const letters: TimedLetter[] = chars.map((char, i) => ({
        char,
        time: def.start + i * span,
      }));
      return {
        word: def.word,
        letters,
        isHighlight: def.isHighlight,
      };
    });
  };

  return {
    line1: mapWords(line1Defs),
    line2: mapWords(line2Defs),
  };
}

const TIMELINE_DATA = buildLetterTimeline();

const SciFiConstellationCanvas: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let displayWidth = window.innerWidth;
    let displayHeight = window.innerHeight;

    const resize = () => {
      if (!canvas) return;
      displayWidth = window.innerWidth;
      displayHeight = window.innerHeight;
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(50, Math.floor((displayWidth * displayHeight) / 14000));
    const particles = Array.from({ length: count }, (_, i) => {
      const isUpper = i % 2 === 0;
      return {
        x: Math.random() * displayWidth,
        y: isUpper ? Math.random() * (displayHeight * 0.55) : Math.random() * displayHeight,
        z: Math.random() * 0.9 + 0.35,
        vx: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.3),
        vy: (Math.random() - 0.5) * (reducedMotion ? 0 : 0.3),
        radius: Math.random() * 1.5 + 0.8,
        color:
          Math.random() > 0.6
            ? '6, 182, 212'
            : Math.random() > 0.3
            ? '16, 185, 129'
            : '251, 191, 36',
        alpha: Math.random() * 0.5 + 0.25,
        pulse: Math.random() * 0.012 + 0.006,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      const maxDist = 115;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.22 * particles[i].z;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha * p.z})`;
        ctx.shadowColor = p.color.includes('251') ? '#fbbf24' : '#06b6d4';
        ctx.shadowBlur = 6 * p.z;
        ctx.fill();

        if (!reducedMotion) {
          p.x += p.vx * p.z;
          p.y += p.vy * p.z;
          p.alpha += p.pulse;
          if (p.alpha > 0.85 || p.alpha < 0.2) p.pulse = -p.pulse;

          if (p.x < -10) p.x = displayWidth + 10;
          if (p.x > displayWidth + 10) p.x = -10;
          if (p.y < -10) p.y = displayHeight + 10;
          if (p.y > displayHeight + 10) p.y = -10;
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%', opacity: 0.95 }}
    />
  );
};

export function ApkWelcomeSplash({
  onEnter,
  className = '',
  soundEnabled = true,
}: ApkWelcomeSplashProps) {
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [audioAllowed, setAudioAllowed] = useState<boolean>(soundEnabled);
  const [audioNeedsInteraction, setAudioNeedsInteraction] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isEntering, setIsEntering] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    const audioPath =
      typeof window !== 'undefined' &&
      (window.location.protocol === 'capacitor:' || window.location.protocol === 'http:')
        ? `${window.location.origin}/assets/welcome.mp3`
        : 'assets/welcome.mp3';

    const audio = new Audio(audioPath);
    audio.preload = 'auto';
    audioRef.current = audio;

    const onTimeUpdate = () => {
      const curr = audio.currentTime;
      setPlaybackTime(curr);
      if (curr >= 7.6) {
        setIsUnlocked(true);
      }
    };

    const onEnded = () => {
      setPlaybackTime(8.0);
      setIsUnlocked(true);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    if (audioAllowed) {
      audio
        .play()
        .then(() => setAudioNeedsInteraction(false))
        .catch(() => setAudioNeedsInteraction(true));
    }

    let fallbackTimer: NodeJS.Timeout | null = null;
    const fallbackStart = setTimeout(() => {
      if (audio.paused) {
        let elapsed = 0;
        fallbackTimer = setInterval(() => {
          elapsed += 0.2;
          setPlaybackTime((p) => Math.max(p, elapsed));
          if (elapsed >= 7.8) {
            setIsUnlocked(true);
            if (fallbackTimer) clearInterval(fallbackTimer);
          }
        }, 200);
      }
    }, 800);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      clearTimeout(fallbackStart);
      if (fallbackTimer) clearInterval(fallbackTimer);
    };
  }, [audioAllowed]);

  const handleUserInteract = () => {
    if (audioNeedsInteraction && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setAudioNeedsInteraction(false);
          setAudioAllowed(true);
        })
        .catch(() => {});
    }
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioAllowed) {
      audioRef.current?.pause();
      setAudioAllowed(false);
      setAudioNeedsInteraction(false);
    } else {
      setAudioAllowed(true);
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setAudioNeedsInteraction(false))
          .catch(() => setAudioNeedsInteraction(true));
      }
    }
  };

  const handleEnterTap = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isUnlocked || isEntering) return;
      setIsEntering(true);

      const timer = setTimeout(() => {
        if (onEnter) onEnter();
      }, 400);

      return () => clearTimeout(timer);
    },
    [isUnlocked, isEntering, onEnter]
  );

  const isHeroTextVisible = playbackTime >= 3.8 || reducedMotion;

  return (
    <div
      onClick={handleUserInteract}
      className={`relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#020708] text-white flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200 ${className}`}
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, #032b25 0%, #011b1f 36%, #001217 68%, #020708 100%)',
        }}
      />

      <div
        className="absolute -top-12 left-1/2 -translate-x-1/2 w-[110vw] max-w-[850px] h-[55vh] rounded-full pointer-events-none z-0 opacity-45"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(6, 182, 212, 0.38) 0%, rgba(16, 185, 129, 0.26) 42%, rgba(2, 43, 37, 0.1) 70%, transparent 85%)',
          filter: 'blur(50px)',
          animation: reducedMotion ? 'none' : 'refraction-sway 10s ease-in-out infinite alternate',
        }}
      />

      <SciFiConstellationCanvas reducedMotion={reducedMotion} />

      <header className="relative z-20 w-full px-5 sm:px-8 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/25 bg-[#02181b]/70 backdrop-blur-md shadow-[0_0_12px_rgba(6,182,212,0.12)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </span>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-emerald-300 font-mono">
            CORE ONLINE
          </span>
        </div>

        <div className="flex items-center gap-2">
          {audioNeedsInteraction && (
            <button
              type="button"
              onClick={handleUserInteract}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-300 animate-pulse transition-colors"
            >
              Tap for Audio
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-2 rounded-full border transition-all ${
              audioAllowed
                ? 'border-cyan-500/50 bg-cyan-950/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'border-slate-700/60 bg-slate-900/60 text-slate-400'
            }`}
          >
            {audioAllowed ? (
              <Volume2 className="w-4 h-4 text-cyan-300 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </header>

      <main className="relative z-10 w-full px-4 flex flex-col items-center justify-center flex-1 my-auto">
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center">
          <div
            className={`w-full text-center flex flex-col items-center justify-center mb-3 transition-all duration-700 ${
              isHeroTextVisible
                ? 'opacity-100 scale-100 translate-y-0 filter-none pointer-events-auto'
                : 'opacity-0 scale-95 -translate-y-2 blur-[6px] pointer-events-none'
            }`}
          >
            <div className="flex flex-wrap items-center justify-center gap-x-2 mb-1">
              {TIMELINE_DATA.line1.map((w, wIdx) => (
                <span key={`l1-w-${wIdx}`} className="inline-flex items-center">
                  {w.letters.map((l, lIdx) => {
                    const isLetterReached = reducedMotion || playbackTime >= l.time;
                    const isCurrent =
                      !reducedMotion && playbackTime >= l.time && playbackTime < l.time + 0.15;

                    return (
                      <span
                        key={`l1-${wIdx}-${lIdx}`}
                        className={`inline-block transition-all duration-300 select-none ${
                          isLetterReached ? 'opacity-100 scale-100' : 'opacity-0 scale-75 blur-[4px]'
                        }`}
                        style={{
                          fontSize: 'clamp(1.4rem, 4.6vw, 2.1rem)',
                          fontWeight: 900,
                          letterSpacing: '0.04em',
                          lineHeight: 1.2,
                          background: w.isHighlight
                            ? 'linear-gradient(135deg, #34d399 0%, #22d3ee 50%, #fde047 100%)'
                            : 'linear-gradient(135deg, #ffffff 0%, #d8f5f0 50%, #22d3ee 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: isCurrent
                            ? 'drop-shadow(0 0 16px rgba(34, 211, 238, 0.95)) drop-shadow(0 0 24px rgba(251, 191, 36, 0.8))'
                            : isLetterReached
                            ? 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))'
                            : 'none',
                        }}
                      >
                        {l.char}
                      </span>
                    );
                  })}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-2">
              {TIMELINE_DATA.line2.map((w, wIdx) => (
                <span key={`l2-w-${wIdx}`} className="inline-flex items-center">
                  {w.letters.map((l, lIdx) => {
                    const isLetterReached = reducedMotion || playbackTime >= l.time;
                    const isCurrent =
                      !reducedMotion && playbackTime >= l.time && playbackTime < l.time + 0.15;

                    return (
                      <span
                        key={`l2-${wIdx}-${lIdx}`}
                        className={`inline-block transition-all duration-300 select-none ${
                          isLetterReached ? 'opacity-100 scale-100' : 'opacity-0 scale-75 blur-[4px]'
                        }`}
                        style={{
                          fontSize: 'clamp(1.3rem, 4.2vw, 2.0rem)',
                          fontWeight: 900,
                          letterSpacing: '0.04em',
                          lineHeight: 1.2,
                          background:
                            w.word === 'Protocol'
                              ? 'linear-gradient(135deg, #34d399 0%, #22d3ee 60%, #38bdf8 100%)'
                              : w.word === 'Networks'
                              ? 'linear-gradient(135deg, #fef08a 0%, #fbbf24 60%, #34d399 100%)'
                              : 'linear-gradient(135deg, #ffffff 0%, #22d3ee 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: isCurrent
                            ? 'drop-shadow(0 0 16px rgba(34, 211, 238, 0.95)) drop-shadow(0 0 24px rgba(251, 191, 36, 0.8))'
                            : isLetterReached
                            ? 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))'
                            : 'none',
                        }}
                      >
                        {l.char}
                      </span>
                    );
                  })}
                </span>
              ))}
            </div>
          </div>

          <div className="relative my-2 flex items-center justify-center pointer-events-none">
            <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-amber-500/25 via-emerald-500/20 to-cyan-500/20 blur-3xl animate-pulse" />
            <div className="scale-95 sm:scale-105 drop-shadow-[0_0_35px_rgba(245,158,11,0.55)]">
              <Rotating3DMbttcCoin size={175} />
            </div>
          </div>

          <div className="w-full flex justify-center mt-3">
            <button
              type="button"
              onClick={handleEnterTap}
              disabled={!isUnlocked || isEntering}
              className={`group relative flex items-center justify-center w-[210px] h-[48px] rounded-full border transition-all duration-300 select-none backdrop-blur-md ${
                !isUnlocked
                  ? 'opacity-40 cursor-not-allowed border-slate-700/50 bg-[#031518]/50'
                  : isEntering
                  ? 'opacity-95 scale-[0.96] border-amber-300 bg-amber-500/25 shadow-[0_0_24px_rgba(251,191,36,0.6)]'
                  : 'opacity-100 cursor-pointer hover:scale-[1.03] active:scale-[0.96] border-emerald-400/80 bg-gradient-to-r from-[#032024]/90 via-[#063339] to-[#032024]/90 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
              }`}
            >
              <div className="relative z-10 flex items-center justify-center gap-1.5 font-black uppercase text-xs sm:text-sm tracking-[0.22em] text-emerald-200">
                {!isUnlocked ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                    <span>SYNC {Math.max(0, 8 - Math.floor(playbackTime))}S</span>
                  </>
                ) : isEntering ? (
                  <>
                    <span className="inline-block animate-spin mr-1">✦</span>
                    <span>OPENING...</span>
                  </>
                ) : (
                  <>
                    <span>ENTER PORTAL</span>
                    <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-5 w-full max-w-xs">
            <div className="bg-[#041a1e]/70 border border-cyan-500/35 rounded-lg p-2 backdrop-blur-md flex flex-col items-center shadow-[0_0_12px_rgba(6,182,212,0.12)]">
              <span className="text-[11px] font-extrabold text-cyan-300 tracking-wider">100% NON-CUSTODIAL</span>
              <span className="text-[9px] text-slate-400 font-mono">Peer-to-Peer Protocol</span>
            </div>

            <div className="bg-[#031e17]/70 border border-emerald-500/35 rounded-lg p-2 backdrop-blur-md flex flex-col items-center shadow-[0_0_12px_rgba(16,185,129,0.12)]">
              <span className="text-[11px] font-extrabold text-emerald-300 tracking-wider">VERIFIED ON-CHAIN</span>
              <span className="text-[9px] text-slate-400 font-mono">Long-Term Ecosystem</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-20 w-full px-5 sm:px-8 flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-1.5 text-emerald-400/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase text-emerald-300/80 font-mono">
            SECURE CLIENT ENVIRONMENT • BEP-20
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-cyan-400/80 font-mono">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>v2.4.1</span>
        </div>
      </footer>

      <style>{`
        @keyframes refraction-sway {
          0% { transform: translate(-50%, 0%) scale(1); opacity: 0.4; }
          100% { transform: translate(-50%, 4%) scale(1.06); opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}

export default ApkWelcomeSplash;