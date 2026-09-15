/**
 * Audio Utility for Real Claim Transaction Flow
 * Synthesizes a short, clean, elegant, premium Web3 success chime using standard browser Web Audio API.
 * 
 * Complies with strict browser autoplay policies:
 * - unlockAudioContext() is invoked on user gesture (Confirm Claim click)
 * - playClaimSuccessSound() plays ONLY after the blockchain transaction is confirmed
 * - Completely non-blocking with zero external dependencies
 */

let sharedAudioContext: AudioContext | null = null;
let lastSoundPlayTime = 0;
let lastApprovalPlayTime = 0;
let lastActivationPlayTime = 0;
let lastCongratulationsPlayTime = 0;
let lastCollectPlayTime = 0;
let lastSettlementPlayTime = 0;

/**
 * Checks if sound effects are enabled in user preferences
 */
export function isSoundEffectsEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('mdefi_sound_effects') !== 'false';
}

/**
 * Updates sound effects preference
 */
export function setSoundEffectsEnabled(enabled: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mdefi_sound_effects', enabled ? 'true' : 'false');
  }
}

/**
 * Checks if UI animations are enabled in user preferences
 */
export function isAnimationsEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('mdefi_animations_enabled') !== 'false';
}

/**
 * Updates animations preference and toggles the CSS disable class
 */
export function setAnimationsEnabled(enabled: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mdefi_animations_enabled', enabled ? 'true' : 'false');
    if (!enabled) {
      document.documentElement.classList.add('disable-animations');
    } else {
      document.documentElement.classList.remove('disable-animations');
    }
  }
}

/**
 * Lazily obtains or instantiates the browser AudioContext
 */
function getOrCreateAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
      sharedAudioContext = new AudioContextClass();
    }
    return sharedAudioContext;
  } catch (err) {
    console.warn('[AudioContext] Could not initialize Web Audio API:', err);
    return null;
  }
}

/**
 * Pre-warms / unlocks the AudioContext during a trusted user gesture (e.g. "Confirm Claim" button click).
 * Does NOT play any sound until transaction confirmation.
 */
export function unlockAudioContext(): void {
  try {
    const ctx = getOrCreateAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch((err) => {
        console.debug('[AudioContext] Resume on gesture caught:', err);
      });
    }
  } catch (err) {
    console.debug('[AudioContext] Gesture unlock handled gracefully:', err);
  }
}

/**
 * Plays a short, premium, elegant Web3 success chime.
 * 
 * Rules enforced:
 * - Exactly once per confirmed transaction (debounced against rapid duplicate triggers)
 * - Duration: ~1.0 - 1.2 seconds with warm harmonic decay
 * - Moderate volume (non-jarring, polished)
 * - Never throws or delays the transaction flow
 */
export function playClaimSuccessSound(): void {
  try {
    // Respect user sound effects preference
    if (!isSoundEffectsEnabled()) {
      return;
    }

    const now = Date.now();
    // Guard against rapid duplicate triggers or unintended loops (1.2s cooldown)
    if (now - lastSoundPlayTime < 1200) {
      return;
    }
    lastSoundPlayTime = now;

    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    // Ensure running state
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {
        // Ignored if autoplay is blocked
      });
    }

    const startTime = ctx.currentTime;
    const masterGain = ctx.createGain();
    
    // Master volume: comfortable, moderate listening level (0.28 peak)
    masterGain.gain.setValueAtTime(0.0001, startTime);
    masterGain.gain.linearRampToValueAtTime(0.28, startTime + 0.03);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.15);

    // Warm high-frequency shaper to soften harmonics (luxury Web3 acoustic feel)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3600, startTime);
    filter.Q.setValueAtTime(1.2, startTime);

    masterGain.connect(filter);
    filter.connect(ctx.destination);

    // Three ascending harmonic chime frequencies:
    // E6 (1318.5 Hz) -> G#6 (1661.2 Hz) -> B6 (1975.5 Hz) + subtle root sub (E5: 659.25 Hz)
    const tones = [
      { freq: 659.25, type: 'sine' as OscillatorType, delay: 0.00, gain: 0.35, duration: 0.9 },
      { freq: 1318.51, type: 'sine' as OscillatorType, delay: 0.02, gain: 0.45, duration: 0.8 },
      { freq: 1661.22, type: 'sine' as OscillatorType, delay: 0.08, gain: 0.50, duration: 0.95 },
      { freq: 1975.53, type: 'triangle' as OscillatorType, delay: 0.15, gain: 0.40, duration: 1.05 },
    ];

    tones.forEach(({ freq, type, delay, gain, duration }) => {
      const osc = ctx.createOscillator();
      const toneGain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime + delay);

      const toneStart = startTime + delay;
      const toneEnd = toneStart + duration;

      toneGain.gain.setValueAtTime(0.0001, toneStart);
      toneGain.gain.linearRampToValueAtTime(gain, toneStart + 0.025);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, toneEnd);

      osc.connect(toneGain);
      toneGain.connect(masterGain);

      osc.start(toneStart);
      osc.stop(toneEnd + 0.05);
    });

  } catch (audioError) {
    // Non-blocking fallback: audio failure must never disrupt transaction logic or UI
    console.warn('[AudioContext] Could not play claim success sound:', audioError);
  }
}

/**
 * Plays a celebratory Web3 package activation success chime.
 * Duration: ~1.6 - 2.0 seconds with rich harmonic chord and subtle celebratory shimmer.
 * Strictly respects isSoundEffectsEnabled().
 */
export function playPackageActivationSuccessSound(): boolean {
  try {
    if (!isSoundEffectsEnabled()) {
      return true;
    }

    const now = Date.now();
    if (now - lastActivationPlayTime < 800) {
      return false;
    }
    lastActivationPlayTime = now;

    const ctx = getOrCreateAudioContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const startTime = ctx.currentTime;
    const masterGain = ctx.createGain();
    
    // Master volume: comfortable, non-intrusive (0.30 peak)
    masterGain.gain.setValueAtTime(0.0001, startTime);
    masterGain.gain.linearRampToValueAtTime(0.30, startTime + 0.04);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.85);

    // Warm resonant filter for celebratory acoustic sparkle
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4200, startTime);
    filter.Q.setValueAtTime(1.0, startTime);

    masterGain.connect(filter);
    filter.connect(ctx.destination);

    // Celebratory pentatonic / major chord arpeggio:
    // C5 (523.25) -> G5 (783.99) -> C6 (1046.50) -> E6 (1318.51) -> G6 (1567.98)
    const tones = [
      { freq: 523.25, type: 'sine' as OscillatorType, delay: 0.00, gain: 0.35, duration: 1.4 },
      { freq: 783.99, type: 'sine' as OscillatorType, delay: 0.09, gain: 0.40, duration: 1.3 },
      { freq: 1046.50, type: 'triangle' as OscillatorType, delay: 0.18, gain: 0.45, duration: 1.5 },
      { freq: 1318.51, type: 'sine' as OscillatorType, delay: 0.27, gain: 0.40, duration: 1.4 },
      { freq: 1567.98, type: 'triangle' as OscillatorType, delay: 0.36, gain: 0.32, duration: 1.6 },
    ];

    tones.forEach(({ freq, type, delay, gain, duration }) => {
      const osc = ctx.createOscillator();
      const toneGain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime + delay);

      const toneStart = startTime + delay;
      const toneEnd = toneStart + duration;

      toneGain.gain.setValueAtTime(0.0001, toneStart);
      toneGain.gain.linearRampToValueAtTime(gain, toneStart + 0.03);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, toneEnd);

      osc.connect(toneGain);
      toneGain.connect(masterGain);

      osc.start(toneStart);
      osc.stop(toneEnd + 0.05);
    });

    return true;
  } catch (audioError) {
    console.warn('[AudioContext] Could not play package activation sound:', audioError);
    return false;
  }
}

/**
 * Stage 3: FINAL CONGRATULATIONS SUCCESS SOUND
 * Plays a triumphant, grand Web3 celebratory congratulations fanfare with rich shimmer.
 * Triggers ONLY after the confirmed activation state has successfully propagated to the final Congratulations state.
 * Never played on button click, pending state, or transaction failure.
 * Strictly respects isSoundEffectsEnabled().
 */
export function playCongratulationsSound(): boolean {
  if (!isSoundEffectsEnabled()) {
    return true;
  }

  const now = Date.now();
  if (now - lastCongratulationsPlayTime < 800) {
    return false;
  }
  lastCongratulationsPlayTime = now;

  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const startTime = ctx.currentTime;
    const masterGain = ctx.createGain();

    // Master volume: rich, triumphant listening level (0.30 peak)
    masterGain.gain.setValueAtTime(0.0001, startTime);
    masterGain.gain.linearRampToValueAtTime(0.30, startTime + 0.04);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.95);

    // Warm resonant filter with celebratory sparkle
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4500, startTime);
    filter.Q.setValueAtTime(1.1, startTime);

    masterGain.connect(filter);
    filter.connect(ctx.destination);

    // Triumphant celebratory fanfare arpeggio:
    // Root sub C4 (261.63Hz) -> G4 (392.00Hz) -> C5 (523.25Hz) -> E5 (659.25Hz) -> G5 (783.99Hz) -> C6 (1046.50Hz) -> E6 (1318.51Hz)
    const tones = [
      { freq: 261.63, type: 'sine' as OscillatorType, delay: 0.00, gain: 0.32, duration: 1.4 },
      { freq: 392.00, type: 'sine' as OscillatorType, delay: 0.08, gain: 0.36, duration: 1.3 },
      { freq: 523.25, type: 'sine' as OscillatorType, delay: 0.16, gain: 0.40, duration: 1.5 },
      { freq: 659.25, type: 'triangle' as OscillatorType, delay: 0.24, gain: 0.42, duration: 1.4 },
      { freq: 783.99, type: 'sine' as OscillatorType, delay: 0.32, gain: 0.38, duration: 1.6 },
      { freq: 1046.50, type: 'triangle' as OscillatorType, delay: 0.40, gain: 0.44, duration: 1.8 },
      { freq: 1318.51, type: 'sine' as OscillatorType, delay: 0.48, gain: 0.30, duration: 1.6 },
    ];

    tones.forEach(({ freq, type, delay, gain, duration }) => {
      const osc = ctx.createOscillator();
      const toneGain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime + delay);

      const toneStart = startTime + delay;
      const toneEnd = toneStart + duration;

      toneGain.gain.setValueAtTime(0.0001, toneStart);
      toneGain.gain.linearRampToValueAtTime(gain, toneStart + 0.03);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, toneEnd);

      osc.connect(toneGain);
      toneGain.connect(masterGain);

      osc.start(toneStart);
      osc.stop(toneEnd + 0.05);
    });

    return true;
  } catch (audioError) {
    console.warn('[AudioContext] Could not play congratulations sound:', audioError);
    return false;
  }
}

/**
 * Plays a short, pristine Web3 swap confirmation sound.
 * Consists of an upward resonant dual-tone glide + sparkling chime (F5 -> Bb5 -> D6).
 * Gated strictly by user preference in Profile and confirmed on-chain status.
 */
export function playSwapSuccessSound(): void {
  if (!isSoundEffectsEnabled()) {
    return;
  }

  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const startTime = ctx.currentTime;
    const masterGain = ctx.createGain();

    masterGain.gain.setValueAtTime(0.0001, startTime);
    masterGain.gain.linearRampToValueAtTime(0.28, startTime + 0.03);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4800, startTime);
    filter.Q.setValueAtTime(1.2, startTime);

    masterGain.connect(filter);
    filter.connect(ctx.destination);

    // Dynamic upward swap chime (F5 698.46Hz -> Bb5 932.33Hz -> D6 1174.66Hz)
    const tones = [
      { freq: 698.46, type: 'sine' as OscillatorType, delay: 0.00, gain: 0.35, duration: 0.8 },
      { freq: 932.33, type: 'triangle' as OscillatorType, delay: 0.08, gain: 0.40, duration: 0.9 },
      { freq: 1174.66, type: 'sine' as OscillatorType, delay: 0.16, gain: 0.42, duration: 1.1 },
    ];

    tones.forEach(({ freq, type, delay, gain, duration }) => {
      const osc = ctx.createOscillator();
      const toneGain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime + delay);

      const toneStart = startTime + delay;
      const toneEnd = toneStart + duration;

      toneGain.gain.setValueAtTime(0.0001, toneStart);
      toneGain.gain.linearRampToValueAtTime(gain, toneStart + 0.02);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, toneEnd);

      osc.connect(toneGain);
      toneGain.connect(masterGain);

      osc.start(toneStart);
      osc.stop(toneEnd + 0.04);
    });
  } catch (audioError) {
    console.warn('[AudioContext] Could not play swap success sound:', audioError);
  }
}

/**
 * 1. MBTTC APPROVAL SUCCESS SOUND
 * Plays crisp Web3 smart contract spending allowance confirmation chime.
 * Triggers ONLY after MBTTC approval transaction is successfully confirmed on-chain.
 * Never played on button click, pending state, or transaction failure.
 */
export function playApprovalSuccessSound(): boolean {
  if (!isSoundEffectsEnabled()) {
    return true;
  }

  const now = Date.now();
  if (now - lastApprovalPlayTime < 800) {
    return false;
  }
  lastApprovalPlayTime = now;

  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const startTime = ctx.currentTime;
    const masterGain = ctx.createGain();

    // Crisp, positive authorization volume envelope
    masterGain.gain.setValueAtTime(0.0001, startTime);
    masterGain.gain.linearRampToValueAtTime(0.24, startTime + 0.02);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.65);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4000, startTime);
    filter.Q.setValueAtTime(1.0, startTime);

    masterGain.connect(filter);
    filter.connect(ctx.destination);

    // Dual-tone authorization affirmative chime (F5: 698.46Hz -> C6: 1046.50Hz)
    const tones = [
      { freq: 698.46, type: 'sine' as OscillatorType, delay: 0.00, gain: 0.38, duration: 0.45 },
      { freq: 1046.50, type: 'triangle' as OscillatorType, delay: 0.08, gain: 0.42, duration: 0.55 },
      { freq: 1396.91, type: 'sine' as OscillatorType, delay: 0.12, gain: 0.20, duration: 0.40 },
    ];

    tones.forEach(({ freq, type, delay, gain, duration }) => {
      const osc = ctx.createOscillator();
      const toneGain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime + delay);

      const toneStart = startTime + delay;
      const toneEnd = toneStart + duration;

      toneGain.gain.setValueAtTime(0.0001, toneStart);
      toneGain.gain.linearRampToValueAtTime(gain, toneStart + 0.02);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, toneEnd);

      osc.connect(toneGain);
      toneGain.connect(masterGain);

      osc.start(toneStart);
      osc.stop(toneEnd + 0.03);
    });

    return true;
  } catch (audioError) {
    console.warn('[AudioContext] Could not play approval success sound:', audioError);
    return false;
  }
}

/**
 * 2. COLLECT TO WALLET SUCCESS SOUND
 * Plays sparkling, ascending multi-coin transfer collection sound.
 * Triggers ONLY after reward collection transaction is confirmed on-chain.
 * Never played on button click, pending state, or transaction failure.
 */
export function playCollectSuccessSound(): void {
  if (!isSoundEffectsEnabled()) {
    return;
  }

  const now = Date.now();
  if (now - lastCollectPlayTime < 900) {
    return;
  }
  lastCollectPlayTime = now;

  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const startTime = ctx.currentTime;
    const masterGain = ctx.createGain();

    masterGain.gain.setValueAtTime(0.0001, startTime);
    masterGain.gain.linearRampToValueAtTime(0.26, startTime + 0.025);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.85);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4500, startTime);
    filter.Q.setValueAtTime(1.1, startTime);

    masterGain.connect(filter);
    filter.connect(ctx.destination);

    // Sparkling 4-tone rapid coin transfer cascade (A5 -> C#6 -> E6 -> A6)
    const tones = [
      { freq: 880.00, type: 'sine' as OscillatorType, delay: 0.00, gain: 0.35, duration: 0.60 },
      { freq: 1108.73, type: 'sine' as OscillatorType, delay: 0.06, gain: 0.40, duration: 0.65 },
      { freq: 1318.51, type: 'triangle' as OscillatorType, delay: 0.12, gain: 0.44, duration: 0.70 },
      { freq: 1760.00, type: 'sine' as OscillatorType, delay: 0.18, gain: 0.38, duration: 0.75 },
    ];

    tones.forEach(({ freq, type, delay, gain, duration }) => {
      const osc = ctx.createOscillator();
      const toneGain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime + delay);

      const toneStart = startTime + delay;
      const toneEnd = toneStart + duration;

      toneGain.gain.setValueAtTime(0.0001, toneStart);
      toneGain.gain.linearRampToValueAtTime(gain, toneStart + 0.02);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, toneEnd);

      osc.connect(toneGain);
      toneGain.connect(masterGain);

      osc.start(toneStart);
      osc.stop(toneEnd + 0.03);
    });
  } catch (audioError) {
    console.warn('[AudioContext] Could not play collect success sound:', audioError);
  }
}

/**
 * 3. TOTAL SETTLED UPDATED SUCCESSFULLY SOUND
 * Plays a grand, rich, warm, luxurious settlement resolution chord.
 * Triggers ONLY after Total Settled has been successfully calculated, updated in state, and finalized.
 * Never played on button click, pending state, or transaction failure.
 */
export function playFinalSettlementSuccessSound(): void {
  if (!isSoundEffectsEnabled()) {
    return;
  }

  const now = Date.now();
  if (now - lastSettlementPlayTime < 1000) {
    return;
  }
  lastSettlementPlayTime = now;

  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const startTime = ctx.currentTime;
    const masterGain = ctx.createGain();

    masterGain.gain.setValueAtTime(0.0001, startTime);
    masterGain.gain.linearRampToValueAtTime(0.28, startTime + 0.035);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.25);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3800, startTime);
    filter.Q.setValueAtTime(1.0, startTime);

    masterGain.connect(filter);
    filter.connect(ctx.destination);

    // Harmonious final settlement chord with acoustic depth:
    // C4 (261.63Hz) sub-bass -> C5 (523.25Hz) -> G5 (783.99Hz) -> C6 (1046.50Hz) -> E6 (1318.51Hz)
    const tones = [
      { freq: 261.63, type: 'sine' as OscillatorType, delay: 0.00, gain: 0.28, duration: 1.10 },
      { freq: 523.25, type: 'sine' as OscillatorType, delay: 0.03, gain: 0.36, duration: 1.15 },
      { freq: 783.99, type: 'triangle' as OscillatorType, delay: 0.08, gain: 0.40, duration: 1.20 },
      { freq: 1046.50, type: 'sine' as OscillatorType, delay: 0.14, gain: 0.42, duration: 1.25 },
      { freq: 1318.51, type: 'triangle' as OscillatorType, delay: 0.20, gain: 0.34, duration: 1.25 },
    ];

    tones.forEach(({ freq, type, delay, gain, duration }) => {
      const osc = ctx.createOscillator();
      const toneGain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime + delay);

      const toneStart = startTime + delay;
      const toneEnd = toneStart + duration;

      toneGain.gain.setValueAtTime(0.0001, toneStart);
      toneGain.gain.linearRampToValueAtTime(gain, toneStart + 0.025);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, toneEnd);

      osc.connect(toneGain);
      toneGain.connect(masterGain);

      osc.start(toneStart);
      osc.stop(toneEnd + 0.04);
    });
  } catch (audioError) {
    console.warn('[AudioContext] Could not play final settlement success sound:', audioError);
  }
}

