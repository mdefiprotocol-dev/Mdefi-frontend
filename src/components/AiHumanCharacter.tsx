import React from 'react';

export type AiCharacterVariant = 'junior' | 'senior' | 'quantum' | 'nexus';

interface AiHumanCharacterProps {
  variant?: AiCharacterVariant;
  mode?: 'card-badge' | 'celebration';
  className?: string;
  size?: number;
  interactive?: boolean;
}

interface CharacterProfile {
  name: string;
  role: string;
  primaryColor: string;
  accentColor: string;
  glowColor: string;
  dialogue: string;
}

const profiles: Record<AiCharacterVariant, CharacterProfile> = {
  junior: {
    name: 'Aria',
    role: 'S4 Junior Sentinel',
    primaryColor: '#10b981', // emerald-500
    accentColor: '#34d399', // emerald-400
    glowColor: 'rgba(16, 185, 129, 0.4)',
    dialogue: 'Junior Node active. 2x2 binary tree ready to cycle!',
  },
  senior: {
    name: 'Kaelen',
    role: 'S4 Senior Architect',
    primaryColor: '#14b8a6', // teal-500
    accentColor: '#2dd4bf', // teal-400
    glowColor: 'rgba(20, 184, 166, 0.4)',
    dialogue: 'Senior Node calibrated. Enhanced spillover channels open.',
  },
  quantum: {
    name: 'Lyra',
    role: 'Quantum Nexus Specialist',
    primaryColor: '#059669', // emerald-600
    accentColor: '#10b981', // emerald-500
    glowColor: 'rgba(16, 185, 129, 0.5)',
    dialogue: 'Quantum 4-ring radial matrix synchronized at 30 slots.',
  },
  nexus: {
    name: 'Zephyr',
    role: 'Nexus Prime Overseer',
    primaryColor: '#0d9488', // teal-600
    accentColor: '#5eead4', // teal-300
    glowColor: 'rgba(45, 212, 191, 0.55)',
    dialogue: 'Prime tier matrix online. Highest priority re-entry routing enabled.',
  },
};

export const AiHumanCharacter: React.FC<AiHumanCharacterProps> = ({
  variant = 'junior',
  mode = 'card-badge',
  className = '',
  size,
  interactive = true,
}) => {
  const profile = profiles[variant];
  const isCelebration = mode === 'celebration';
  const defaultSize = isCelebration ? 120 : 64;
  const actualSize = size || defaultSize;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      title={`${profile.name} • ${profile.role}`}
    >
      {/* Ambient Cyber Aura / Glow */}
      <div
        className={`absolute rounded-full pointer-events-none transition-all duration-700 ${
          isCelebration
            ? 'w-36 h-36 blur-2xl animate-pulse'
            : 'w-20 h-20 blur-xl opacity-60'
        }`}
        style={{
          background: `radial-gradient(circle, ${profile.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Floating particles around character */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <span
          className="absolute w-1 h-1 rounded-full bg-emerald-300 animate-ping opacity-75"
          style={{ top: '15%', left: '10%', animationDuration: '3.2s' }}
        />
        <span
          className="absolute w-1.5 h-1.5 rounded-full bg-teal-300 opacity-60 animate-pulse"
          style={{ top: '70%', right: '8%', animationDuration: '2.8s' }}
        />
        {isCelebration && (
          <>
            <span
              className="absolute w-2 h-2 rounded-full bg-emerald-400 opacity-90 animate-bounce"
              style={{ top: '-10%', right: '25%', animationDuration: '2s' }}
            />
            <span
              className="absolute w-1.5 h-1.5 rounded-full bg-teal-200 opacity-80 animate-ping"
              style={{ bottom: '5%', left: '15%', animationDuration: '2.5s' }}
            />
          </>
        )}
      </div>

      {/* Character Graphic Container */}
      <div
        className={`relative z-10 transition-transform duration-300 ${
          interactive ? 'hover:scale-105' : ''
        } ${isCelebration ? 'animate-character-breathe' : 'animate-character-breathe'}`}
        style={{ width: actualSize, height: actualSize }}
      >
        <svg
          width={actualSize}
          height={actualSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
        >
          <defs>
            {/* Linear Gradients */}
            <linearGradient id={`skinGrad-${variant}`} x1="30" y1="25" x2="70" y2="75" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffdfc4" />
              <stop offset="60%" stopColor="#f3c5a5" />
              <stop offset="100%" stopColor="#e2ad89" />
            </linearGradient>

            <linearGradient id={`suitGrad-${variant}`} x1="20" y1="65" x2="80" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#18241e" />
              <stop offset="50%" stopColor="#0c1611" />
              <stop offset="100%" stopColor="#060c09" />
            </linearGradient>

            <linearGradient id={`armorAccent-${variant}`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={profile.accentColor} />
              <stop offset="100%" stopColor={profile.primaryColor} />
            </linearGradient>

            <linearGradient id={`hairGrad-${variant}`} x1="30" y1="10" x2="70" y2="45" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#27322d" />
              <stop offset="60%" stopColor="#141c18" />
              <stop offset="100%" stopColor="#0a0f0d" />
            </linearGradient>

            <linearGradient id={`visorGrad-${variant}`} x1="35" y1="40" x2="65" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={profile.accentColor} stopOpacity="0.85" />
              <stop offset="100%" stopColor={profile.primaryColor} stopOpacity="0.95" />
            </linearGradient>

            <filter id={`visorGlow-${variant}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Outer Orbital Holographic Frame / Halo Ring */}
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke={`url(#armorAccent-${variant})`}
            strokeWidth={isCelebration ? '2.5' : '1.8'}
            strokeDasharray={isCelebration ? '8 4' : '4 3'}
            className="opacity-70"
          />

          {/* Soft Dark Vignette Base */}
          <circle cx="50" cy="50" r="44" fill="#09120e" />

          {/* Cybernetic Suit / Torso / Shoulder Armor */}
          <path
            d="M20 92 C20 74 34 68 50 68 C66 68 80 74 80 92 C80 96 74 98 50 98 C26 98 20 96 20 92 Z"
            fill={`url(#suitGrad-${variant})`}
            stroke={`url(#armorAccent-${variant})`}
            strokeWidth="1.2"
          />

          {/* Shoulder Armor Plates */}
          <path
            d="M22 78 Q30 73 38 77 L35 88 Q26 84 22 78 Z"
            fill="#102119"
            stroke={profile.accentColor}
            strokeWidth="1"
          />
          <path
            d="M78 78 Q70 73 62 77 L65 88 Q74 84 78 78 Z"
            fill="#102119"
            stroke={profile.accentColor}
            strokeWidth="1"
          />

          {/* Chest Core Indicator / Node Emblem */}
          <circle cx="50" cy="80" r="4.5" fill="#040906" stroke={profile.accentColor} strokeWidth="1.2" />
          <circle cx="50" cy="80" r="2.5" fill={profile.accentColor} className="animate-pulse" />

          {/* Neck */}
          <path d="M44 58 L44 69 Q50 72 56 69 L56 58 Z" fill={`url(#skinGrad-${variant})`} />
          {/* Cyber Neck Collar Band */}
          <path d="M42 63 Q50 66 58 63" stroke={profile.accentColor} strokeWidth="1.5" strokeLinecap="round" />

          {/* Head & Face Contour */}
          <path
            d="M34 38 C34 26 40 20 50 20 C60 20 66 26 66 38 C66 50 59 58 50 58 C41 58 34 50 34 38 Z"
            fill={`url(#skinGrad-${variant})`}
          />

          {/* Ears with Cybernetic Comm Communicators */}
          <ellipse cx="33" cy="38" rx="2.5" ry="5" fill="#f0be9e" />
          <ellipse cx="67" cy="38" rx="2.5" ry="5" fill="#f0be9e" />
          {/* Left / Right Ear Comm Device */}
          <rect x="31" y="35" width="2.5" height="6" rx="1" fill={profile.accentColor} />
          <rect x="66.5" y="35" width="2.5" height="6" rx="1" fill={profile.accentColor} />

          {/* Stylized Futuristic Hair */}
          <path
            d="M32 35 C31 22 40 14 50 14 C61 14 69 20 68 33 C64 25 56 21 48 22 C42 22 36 26 32 35 Z"
            fill={`url(#hairGrad-${variant})`}
          />
          {/* Hair fringe sweep */}
          <path
            d="M35 24 Q48 18 63 26 Q52 23 42 28 Q37 31 35 34 Z"
            fill={profile.accentColor}
            opacity="0.35"
          />

          {/* Eyebrows */}
          <path d="M39 33 Q44 31 47 33" stroke="#2c3a32" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M53 33 Q56 31 61 33" stroke="#2c3a32" strokeWidth="1.4" strokeLinecap="round" />

          {/* Eyes with Blinking Animation Class */}
          <g className="animate-character-blink">
            {/* Left Eye */}
            <ellipse cx="43" cy="37" rx="3" ry="2" fill="#ffffff" />
            <circle cx="43.5" cy="37" r="1.5" fill="#1e3a2b" />
            <circle cx="44" cy="36.5" r="0.6" fill="#ffffff" />

            {/* Right Eye */}
            <ellipse cx="57" cy="37" rx="3" ry="2" fill="#ffffff" />
            <circle cx="56.5" cy="37" r="1.5" fill="#1e3a2b" />
            <circle cx="56" cy="36.5" r="0.6" fill="#ffffff" />
          </g>

          {/* Futuristic Cyber Visor / Holographic HUD Eyepiece */}
          {variant === 'junior' && (
            <path
              d="M37 35 Q50 33 63 35 L62 38 Q50 36 38 38 Z"
              fill={`url(#visorGrad-${variant})`}
              filter={`url(#visorGlow-${variant})`}
              opacity="0.9"
            />
          )}

          {variant === 'senior' && (
            <path
              d="M51 34 Q58 32 65 35 L64 40 Q57 37 51 39 Z"
              fill={`url(#visorGrad-${variant})`}
              filter={`url(#visorGlow-${variant})`}
              opacity="0.9"
            />
          )}

          {variant === 'quantum' && (
            <g filter={`url(#visorGlow-${variant})`}>
              <circle cx="43" cy="37" r="5" stroke={profile.accentColor} strokeWidth="1" fill="none" opacity="0.8" />
              <path d="M38 37 H48 M43 32 V42" stroke={profile.accentColor} strokeWidth="0.8" opacity="0.9" />
              <rect x="52" y="35.5" width="13" height="3" rx="1.5" fill={`url(#visorGrad-${variant})`} />
            </g>
          )}

          {variant === 'nexus' && (
            <g filter={`url(#visorGlow-${variant})`}>
              <polygon points="50,12 53,19 59,20 54,24 56,30 50,26 44,30 46,24 41,20 47,19" fill={profile.accentColor} opacity="0.8" />
              <path d="M35 34 Q50 31 65 34 L64 38 Q50 35 36 38 Z" fill={`url(#visorGrad-${variant})`} opacity="0.9" />
            </g>
          )}

          {/* Nose */}
          <path d="M50 38 L49 44 L51.5 44" stroke="#d59f7d" strokeWidth="1" strokeLinecap="round" fill="none" />

          {/* Friendly, Professional Mouth / Smile */}
          {isCelebration ? (
            <path d="M45 49 Q50 54 55 49" stroke="#b0634a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M46 49 Q50 52 54 49" stroke="#b0634a" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          )}

          {/* Professional Celebration Salute / Gesture in Celebration Mode */}
          {isCelebration && (
            <g className="animate-in fade-in zoom-in-50 duration-500">
              {/* Thumbs up / Raised Gauntlet */}
              <path
                d="M75 58 Q84 52 86 62 Q88 74 76 76 Q72 76 70 70 Z"
                fill="#12251c"
                stroke={profile.accentColor}
                strokeWidth="1.5"
              />
              <path d="M80 57 L80 50 Q83 50 83 55 L83 60" stroke={profile.accentColor} strokeWidth="1.5" strokeLinecap="round" />
              {/* Energy sparkles from hand */}
              <circle cx="82" cy="46" r="2" fill="#ffffff" className="animate-ping" />
            </g>
          )}
        </svg>
      </div>

      {/* Role Pill Badge for Card Header */}
      {!isCelebration && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded-full bg-zinc-950/90 border border-emerald-500/40 text-[9px] font-mono font-extrabold text-emerald-300 shadow-md">
          {profile.name}
        </div>
      )}
    </div>
  );
};
