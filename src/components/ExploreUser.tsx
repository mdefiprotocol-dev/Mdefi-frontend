import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ethers } from 'ethers';
import { 
  Search, 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  Network, 
  Layers, 
  Calendar, 
  RefreshCw, 
  AlertCircle,
  Eye,
  CheckCircle2,
  TrendingUp,
  Award,
  User as UserIcon
} from 'lucide-react';
import { getSharedRpcProvider } from '../config/rpcConfig';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG, HUB_ABI } from '../config/contractConfig';
import { TeamMember, UserProfile, TeamTransactionRecord } from '../types';
import { formatCompactAddress, copyFullAddress } from '../utils/formatAddress';

/**
 * 14 On-Chain Dashboard fields returned by Hub contract getUserDashboard(address)
 */
export interface ExploreUserDashboardData {
  // IDENTITY (Fields 1, 2, 3, 4, 7)
  userId: string;
  wallet: string;
  sponsor: string;
  isRootSponsor: boolean;

  // REGISTRATION (Field 4)
  registrationTimeRaw: number;
  registrationDateFormatted: string;

  // NETWORK (Fields 5, 6, 14)
  directTeamCount: number;
  totalTeamCount: number;
  activePackageCount: number;

  // ACCOUNT STATUS (Field 7)
  isBlocked: boolean;

  // REFERRAL REWARDS (Fields 8, 9, 10)
  referralTotalEarned: string;
  referralTotalClaimed: string;
  referralClaimable: string;

  // PACKAGE REWARDS (Fields 11, 12, 13)
  packageTotalEarned: string;
  packageTotalClaimed: string;
  packageClaimable: string;

  // METADATA & DISPLAY HELPERS
  isRegistered: boolean;
  isRealBlockchainData: boolean;
  isDesignPreview: boolean;
  userDisplayName?: string;
  userAvatarUrl?: string;
  sponsorDisplayName?: string;
  sponsorAvatarUrl?: string;
  sponsorUserId?: string;
  mdfUserId?: string;
  lifetimeYieldUsdt?: string;
}

export interface ExploreUserProps {
  user: UserProfile;
  members: TeamMember[];
  transactions?: TeamTransactionRecord[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  targetInspectUser?: { userId?: string; address?: string } | null;
  onClearTargetInspectUser?: () => void;
  className?: string;
}

// Hub ABI fragment specifically for getUserDashboard
const HUB_DASHBOARD_ABI = [
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'getUserDashboard',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'userId', type: 'uint256' },
          { internalType: 'address', name: 'wallet', type: 'address' },
          { internalType: 'address', name: 'sponsor', type: 'address' },
          { internalType: 'uint256', name: 'registrationTime', type: 'uint256' },
          { internalType: 'uint256', name: 'directTeamCount', type: 'uint256' },
          { internalType: 'uint256', name: 'totalTeamCount', type: 'uint256' },
          { internalType: 'bool', name: 'isBlocked', type: 'bool' },
          { internalType: 'uint256', name: 'referralTotalEarned', type: 'uint256' },
          { internalType: 'uint256', name: 'referralTotalClaimed', type: 'uint256' },
          { internalType: 'uint256', name: 'referralClaimable', type: 'uint256' },
          { internalType: 'uint256', name: 'packageTotalEarned', type: 'uint256' },
          { internalType: 'uint256', name: 'packageTotalClaimed', type: 'uint256' },
          { internalType: 'uint256', name: 'packageClaimable', type: 'uint256' },
          { internalType: 'uint256', name: 'activePackageCount', type: 'uint256' }
        ],
        internalType: 'struct MDEFIEnterpriseHubUnified.MasterUserDashboard',
        name: 'dashboard',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
];

// Short-lived memory cache & deduplication
const responseCache = new Map<string, { data: ExploreUserDashboardData; timestamp: number }>();
const pendingReads = new Map<string, Promise<ExploreUserDashboardData>>();
const CACHE_TTL_MS = 30000;

/**
 * Format raw token amounts into standard BEP-20 (18 decimals) string
 */
function formatTokenBalance(rawVal: bigint | number | string | undefined): string {
  if (rawVal === undefined || rawVal === null) return 'Unavailable';
  try {
    const bn = typeof rawVal === 'bigint' ? rawVal : BigInt(rawVal.toString());
    const formatted = ethers.formatUnits(bn, 18);
    const num = parseFloat(formatted);
    if (isNaN(num)) return '0.00 MBTTC';
    return `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MBTTC`;
  } catch (err) {
    console.warn('[ExploreUser] Format error:', err);
    return '0.00 MBTTC';
  }
}

/**
 * Format registration block timestamp into reference format: OCT 18, 2026
 */
function formatRegDate(rawSec: bigint | number | undefined): { raw: number; formatted: string } {
  if (!rawSec) return { raw: 0, formatted: 'Unregistered' };
  try {
    let sec = typeof rawSec === 'bigint' ? Number(rawSec) : Number(rawSec);
    if (sec > 1e11) sec = Math.floor(sec / 1000);
    if (sec <= 0 || isNaN(sec)) return { raw: 0, formatted: 'Unavailable' };

    const d = new Date(sec * 1000);
    const formatted = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase();

    return { raw: sec, formatted };
  } catch {
    return { raw: 0, formatted: 'Unavailable' };
  }
}

/**
 * Sample preview data for design inspection in Google AI Studio
 */
const SAMPLE_PREVIEW_DATA: ExploreUserDashboardData = {
  userId: '24816',
  wallet: '0x7282E5E883C2aDBa46E45437cF37A7aEA617C',
  sponsor: '0x544d00000000000000000000000000000000cbbd',
  isRootSponsor: false,
  registrationTimeRaw: 1792281600,
  registrationDateFormatted: 'OCT 18, 2026',
  directTeamCount: 18,
  totalTeamCount: 25,
  activePackageCount: 8,
  isBlocked: false,
  referralTotalEarned: '1,800.00 MBTTC',
  referralTotalClaimed: '1,114.00 MBTTC',
  referralClaimable: '686.00 MBTTC',
  packageTotalEarned: '1,500.00 MBTTC',
  packageTotalClaimed: '614.00 MBTTC',
  packageClaimable: '886.00 MBTTC',
  lifetimeYieldUsdt: '886.00 USDT',
  isRegistered: true,
  isRealBlockchainData: false,
  isDesignPreview: true,
  userDisplayName: 'Alex Morgan',
  userAvatarUrl: undefined,
  sponsorDisplayName: 'Jordon Pix',
  sponsorAvatarUrl: undefined,
  sponsorUserId: 'MDF-24815',
  mdfUserId: 'MDF-24816',
};

/**
 * =========================================================================
 * 1. CINEMATIC 3D-INSPIRED WEB3 CONNECTION VISUALIZATION
 * Replaces the previous thin network diagram with:
 * - Left: Luminous Emerald 3D Energy Orb + Rotating Metallic Rings + Orbiting Particles
 * - Right: Luminous Sapphire/Cyan 3D Energy Orb + Rotating Metallic Rings + Orbiting Particles
 * - Center: Multi-Ring 3D Blockchain Gyroscopic Core + Crystallized Hexagon Heart
 * - Animated Laser Pathway with Streaming Luminous Photons
 * =========================================================================
 */
const Cinematic3DConnectionNexus: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center select-none py-1 w-full max-w-[460px] ${className}`}>
      {/* Ambient background volumetric lighting */}
      <div className="absolute w-56 h-24 bg-gradient-to-r from-emerald-500/15 via-teal-400/20 to-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Main 3D Perspective Stage */}
      <div 
        className="relative z-10 w-full h-28 sm:h-32 flex items-center justify-between px-3 sm:px-6"
        style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      >
        {/* ==================== LEFT: EMERALD 3D USER ENERGY ORB ==================== */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Volumetric glow halo */}
          <div className="absolute w-20 h-20 bg-emerald-500/25 rounded-full blur-xl pointer-events-none animate-pulse" />

          {/* 3D Orb & Gyro Container */}
          <div 
            className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Outer Orbiting Metallic Ring 1 */}
            <div 
              className="absolute inset-0 rounded-full border border-emerald-400/60 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-orb-ring-1 pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Luminous orbiting photon on ring */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399]" />
            </div>

            {/* Inner Counter-Rotating Ring 2 */}
            <div 
              className="absolute inset-1.5 rounded-full border border-teal-300/40 border-dashed animate-orb-ring-2 pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            />

            {/* Central 3D Volumetric Sphere */}
            <div 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-[0_4px_16px_rgba(16,185,129,0.5),inset_0_-4px_8px_rgba(2,44,34,0.9),inset_0_4px_8px_rgba(167,243,208,0.8)] relative overflow-hidden flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #ecfdf5 0%, #34d399 28%, #059669 65%, #022c22 100%)',
              }}
            >
              {/* Internal Specular Highlight Flare */}
              <div className="absolute top-1 left-1.5 w-3 h-2 rounded-full bg-white/70 blur-[0.5px]" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_10px_#ffffff] animate-ping opacity-60" />
            </div>
          </div>

          {/* Orb Identity Pill */}
          <span className="mt-1 text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.2)]">
            User Node
          </span>
        </div>

        {/* ==================== CENTER: CONTINUOUS ENERGY CONDUITS & 3D BLOCKCHAIN CORE ==================== */}
        <div className="flex-1 flex items-center justify-center relative px-2 sm:px-3">
          {/* Laser Energy Conduit Lines (Left to Center, Center to Right) */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-300 via-white via-cyan-300 to-sky-500 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-[6px] bg-gradient-to-r from-emerald-500/30 via-white/40 to-cyan-500/30 blur-[2px]" />

          {/* Flowing Quantum Photons (Traveling back and forth along conduit) */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden h-6 pointer-events-none flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-200 shadow-[0_0_10px_#a7f3d0] animate-conduit-photon-left" />
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_12px_#ffffff] animate-conduit-photon-mid" />
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-200 shadow-[0_0_10px_#bae6fd] animate-conduit-photon-right" />
          </div>

          {/* 3D Multi-Ring Blockchain Hyper-Core */}
          <div 
            className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center z-10"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Radial Core Light Pulse */}
            <div className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400/20 via-teal-300/30 to-cyan-400/20 blur-lg animate-core-pulse" />

            {/* Gyroscopic Ring 1: Outer Chrome/Emerald Ring */}
            <div 
              className="absolute inset-0 rounded-full border-[1.5px] border-emerald-400/70 shadow-[0_0_12px_rgba(16,185,129,0.4)] animate-gyro-1 pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_6px_#34d399]" />
            </div>

            {/* Gyroscopic Ring 2: Middle Cyan Glass Ring */}
            <div 
              className="absolute inset-2 rounded-full border-[1.5px] border-cyan-400/70 border-dashed shadow-[0_0_12px_rgba(6,182,212,0.4)] animate-gyro-2 pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_6px_#67e8f9]" />
            </div>

            {/* Gyroscopic Ring 3: Inner Fast Gimbal */}
            <div 
              className="absolute inset-4 rounded-full border border-white/60 animate-gyro-3 pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            />

            {/* Central 3D Hexagonal Blockchain Crystal Core */}
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center">
              <svg 
                viewBox="0 0 60 60" 
                className="w-full h-full drop-shadow-[0_0_14px_rgba(56,189,248,0.7)] animate-core-breathe"
              >
                <defs>
                  <linearGradient id="crystalFacetA" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="35%" stopColor="#38bdf8" />
                    <stop offset="70%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#082f49" />
                  </linearGradient>
                  <linearGradient id="crystalFacetB" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="35%" stopColor="#34d399" />
                    <stop offset="70%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#022c22" />
                  </linearGradient>
                </defs>
                {/* 3D Hexagon Facets */}
                <polygon points="30,4 52,17 30,30 8,17" fill="url(#crystalFacetA)" opacity="0.9" stroke="#ffffff" strokeWidth="0.8" />
                <polygon points="52,17 52,43 30,56 30,30" fill="url(#crystalFacetB)" opacity="0.85" stroke="#67e8f9" strokeWidth="0.8" />
                <polygon points="8,17 30,30 30,56 8,43" fill="url(#crystalFacetA)" opacity="0.75" stroke="#34d399" strokeWidth="0.8" />
                {/* Central Specular Core Star */}
                <circle cx="30" cy="30" r="3.5" fill="#ffffff" className="animate-ping opacity-75" />
                <circle cx="30" cy="30" r="2" fill="#ffffff" />
              </svg>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT: CYAN/SAPPHIRE 3D UPLINE ENERGY ORB ==================== */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Volumetric glow halo */}
          <div className="absolute w-20 h-20 bg-cyan-500/25 rounded-full blur-xl pointer-events-none animate-pulse" />

          {/* 3D Orb & Gyro Container */}
          <div 
            className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Outer Orbiting Metallic Ring 1 */}
            <div 
              className="absolute inset-0 rounded-full border border-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.4)] animate-orb-ring-1 pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
            </div>

            {/* Inner Counter-Rotating Ring 2 */}
            <div 
              className="absolute inset-1.5 rounded-full border border-sky-300/40 border-dashed animate-orb-ring-2 pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            />

            {/* Central 3D Volumetric Sphere */}
            <div 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-[0_4px_16px_rgba(6,182,212,0.5),inset_0_-4px_8px_rgba(8,47,73,0.9),inset_0_4px_8px_rgba(186,230,253,0.8)] relative overflow-hidden flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #f0f9ff 0%, #38bdf8 28%, #0284c7 65%, #082f49 100%)',
              }}
            >
              {/* Internal Specular Highlight Flare */}
              <div className="absolute top-1 left-1.5 w-3 h-2 rounded-full bg-white/70 blur-[0.5px]" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_10px_#ffffff] animate-ping opacity-60" />
            </div>
          </div>

          {/* Orb Identity Pill */}
          <span className="mt-1 text-[9px] font-mono uppercase tracking-wider text-cyan-400 font-bold bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.2)]">
            Upline Node
          </span>
        </div>
      </div>

      {/* Cinematic Protocol Trust Badge */}
      <div className="mt-1 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-zinc-950/90 border border-emerald-500/25 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.14)]">
        <span className="text-emerald-400 font-semibold">TRUST</span>
        <span className="text-zinc-600">·</span>
        <span className="text-teal-300 font-semibold">PARTNERSHIP</span>
        <span className="text-zinc-600">·</span>
        <span className="text-cyan-400 font-semibold">VERIFIED NETWORK</span>
      </div>
    </div>
  );
};

/**
 * =========================================================================
 * 2. PREMIUM 3D CONTINUOUS ROTATING REWARD COIN
 * - Replaces the generic flat dollar icon with a realistic 3D MBTTC token
 * - True 3D perspective rotation around the vertical Y-axis
 * - Thick metallic edge with multi-layer depth
 * - Detailed embossed token emblem (MDeFi Shield / Diamond facet)
 * - Specular reflection sheen sweeping continuously across the surface
 * - Coordinated ambient glow (emerald for referral, rose for package, sapphire for lifetime)
 * =========================================================================
 */
interface Rotating3DMbttcCoinProps {
  size?: number;
  accent?: 'emerald' | 'rose' | 'sapphire';
  className?: string;
}

const Rotating3DMbttcCoin: React.FC<Rotating3DMbttcCoinProps> = ({ 
  size = 54, 
  accent = 'emerald',
  className = '' 
}) => {
  // Glow accent styling
  const glowColor = accent === 'emerald'
    ? 'rgba(16, 185, 129, 0.35)'
    : accent === 'rose'
      ? 'rgba(244, 63, 94, 0.35)'
      : 'rgba(59, 130, 246, 0.35)';

  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        perspective: '800px',
      }}
    >
      {/* Ambient soft backlight */}
      <div 
        className="absolute inset-0 rounded-full blur-md pointer-events-none transition-all duration-300"
        style={{ backgroundColor: glowColor }}
      />

      {/* 3D Coin Body (Continuously Rotating) */}
      <div 
        className="relative w-full h-full flex items-center justify-center mdefi-coin-3d-spin"
        style={{ 
          transformStyle: 'preserve-3d',
          animation: 'coin3dSpinLoop 6s linear infinite'
        }}
      >
        {/* ================= THICK METALLIC RIM SLICES (Z-Depth) ================= */}
        {[-3, -2, -1, 0, 1, 2, 3].map((zOffset) => (
          <div 
            key={zOffset}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${size - 2}px`,
              height: `${size - 2}px`,
              transform: `translateZ(${zOffset}px)`,
              background: 'radial-gradient(circle, #78350f 40%, #b45309 70%, #d97706 95%, #f59e0b 100%)',
              border: '1px solid #92400e',
              opacity: zOffset === 0 ? 0.9 : 0.6,
            }}
          />
        ))}

        {/* ================= FRONT COIN FACE (translateZ: +4px) ================= */}
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden"
          style={{
            transform: 'translateZ(4px)',
            backfaceVisibility: 'visible',
            boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
          }}
        >
          <svg 
            width={size} 
            height={size} 
            viewBox="0 0 64 64" 
            className="w-full h-full"
            aria-label="3D MBTTC Token Front"
          >
            <defs>
              {/* Outer Golden Bevel Gradient */}
              <radialGradient id="goldBevelGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="20%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="85%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>

              {/* Recessed Coin Floor Gradient */}
              <radialGradient id="goldInnerFloor" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="35%" stopColor="#fbbf24" />
                <stop offset="75%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#451a03" />
              </radialGradient>

              {/* Emblem Metallic Inset */}
              <linearGradient id="emblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>

            {/* Outer Rim Ring */}
            <circle cx="32" cy="32" r="30" fill="url(#goldBevelGrad)" stroke="#fef08a" strokeWidth="1.2" />

            {/* Milled Gear Ridges */}
            <circle cx="32" cy="32" r="26.5" fill="none" stroke="#78350f" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.65" />

            {/* Recessed Face Floor */}
            <circle cx="32" cy="32" r="23.5" fill="url(#goldInnerFloor)" stroke="#fde68a" strokeWidth="1" />

            {/* Precision Micro-Ring */}
            <circle cx="32" cy="32" r="20" fill="none" stroke="#fef3c7" strokeWidth="0.8" opacity="0.5" />

            {/* Custom MDeFi / MBTTC Geometric Diamond Shield Emblem */}
            <g transform="translate(16, 16) scale(0.5)">
              {/* Embossed 'M' Geometric Token Logo */}
              <path 
                d="M 12 48 L 12 16 L 32 34 L 52 16 L 52 48 L 42 48 L 42 28 L 32 38 L 22 28 L 22 48 Z" 
                fill="url(#emblemGrad)" 
                stroke="#fffbeb" 
                strokeWidth="1.5"
                filter="drop-shadow(0 2px 3px rgba(0,0,0,0.6))"
              />
              {/* Central Diamond Crystal Node */}
              <polygon points="32,20 37,27 32,34 27,27" fill="#ffffff" />
            </g>

            {/* Micro Star Points around Rim */}
            <circle cx="32" cy="10" r="1.2" fill="#fffbeb" />
            <circle cx="32" cy="54" r="1.2" fill="#fffbeb" />
            <circle cx="10" cy="32" r="1.2" fill="#fffbeb" />
            <circle cx="54" cy="32" r="1.2" fill="#fffbeb" />
          </svg>

          {/* Sweeping Specular Light Sheen */}
          <div className="absolute inset-0 pointer-events-none animate-coin-sheen bg-gradient-to-tr from-transparent via-white/50 to-transparent" />
        </div>

        {/* ================= BACK COIN FACE (rotateY: 180deg, translateZ: -4px) ================= */}
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden"
          style={{
            transform: 'rotateY(180deg) translateZ(4px)',
            backfaceVisibility: 'visible',
            boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
          }}
        >
          <svg 
            width={size} 
            height={size} 
            viewBox="0 0 64 64" 
            className="w-full h-full"
            aria-label="3D MBTTC Token Back"
          >
            {/* Outer Rim Ring */}
            <circle cx="32" cy="32" r="30" fill="url(#goldBevelGrad)" stroke="#fef08a" strokeWidth="1.2" />

            {/* Milled Ridges */}
            <circle cx="32" cy="32" r="26.5" fill="none" stroke="#78350f" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.65" />

            {/* Recessed Face Floor */}
            <circle cx="32" cy="32" r="23.5" fill="url(#goldInnerFloor)" stroke="#fde68a" strokeWidth="1" />

            {/* Reverse Protocol Monogram "MBTTC" */}
            <text
              x="32"
              y="37"
              textAnchor="middle"
              fontSize="12"
              fontWeight="900"
              fontFamily="JetBrains Mono, monospace, sans-serif"
              fill="#ffffff"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.7)',
                filter: 'drop-shadow(0 1px 2px #78350f)'
              }}
            >
              MBTTC
            </text>

            {/* Subtle Protocol Stars */}
            <text x="32" y="24" textAnchor="middle" fontSize="8" fill="#fef08a">✦ ✦ ✦</text>
            <text x="32" y="47" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="#fde68a" opacity="0.8">ON-CHAIN</text>
          </svg>

          {/* Sweeping Specular Light Sheen */}
          <div className="absolute inset-0 pointer-events-none animate-coin-sheen bg-gradient-to-tr from-transparent via-white/50 to-transparent" />
        </div>
      </div>
    </div>
  );
};

/**
 * Animated Web3 Background Grid and Atmospheric Lighting
 */
const Web3NetworkBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
    <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px]" />
    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/8 rounded-full blur-[130px]" />
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/6 rounded-full blur-[110px]" />

    <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="web3exploregrid" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="24" r="1" fill="#10b981" opacity="0.35" />
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#064e3b" strokeWidth="0.5" strokeDasharray="2 6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#web3exploregrid)" />
    </svg>
  </div>
);

export const ExploreUser: React.FC<ExploreUserProps> = ({
  user,
  members,
  transactions = [],
  searchQuery,
  onSearchChange,
  targetInspectUser,
  onClearTargetInspectUser,
  className = '',
}) => {
  // Modal & Query states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ExploreUserDashboardData | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Production Real Web3 Mode: Preview mode is off by default
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Handle external trigger (e.g. user clicked ID in table)
  useEffect(() => {
    if (targetInspectUser && (targetInspectUser.userId || targetInspectUser.address)) {
      const term = targetInspectUser.userId || targetInspectUser.address || '';
      executeSearch(term);
      if (onClearTargetInspectUser) {
        onClearTargetInspectUser();
      }
    }
  }, [targetInspectUser]);

  // Copy helper with visual toast feedback
  const handleCopy = async (text: string, key: string, label: string = 'Address') => {
    const ok = await copyFullAddress(text);
    if (ok) {
      setCopiedKey(key);
      setCopyToast(`${label} copied!`);
      setTimeout(() => {
        setCopiedKey(null);
        setCopyToast(null);
      }, 2000);
    }
  };

  /**
   * Search Input Resolver
   * Resolves MDF IDs, full 0x addresses, or unambiguous partial addresses
   */
  const resolveAddress = (
    query: string
  ): { isValid: boolean; address?: string; error?: string; mdfId?: string; name?: string } => {
    const trimmed = query.trim();
    if (!trimmed) {
      return { isValid: false, error: 'Please enter an MDF ID or wallet address.' };
    }

    // 1. Full 42-character Ethereum / BSC address
    if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
      const checksummed = ethers.getAddress(trimmed);
      const matched = members.find((m) => m.address && m.address.toLowerCase() === checksummed.toLowerCase());
      const isSelf = user?.walletAddress && user.walletAddress.toLowerCase() === checksummed.toLowerCase();

      return {
        isValid: true,
        address: checksummed,
        mdfId: matched?.userId || (isSelf ? user?.userId : undefined),
        name: matched?.name || (isSelf ? user?.displayName : undefined),
      };
    }

    // 2. MDF User ID (e.g. MDF-24816, MDF-24815, MDF-09112, 24816)
    if (/^(MDF-)?[0-9a-zA-Z_-]+$/i.test(trimmed)) {
      const cleanId = trimmed.toUpperCase().startsWith('MDF-')
        ? trimmed.toUpperCase()
        : `MDF-${trimmed.toUpperCase()}`;

      // Check current user
      if (user?.userId && user.userId.toUpperCase() === cleanId) {
        return {
          isValid: true,
          address: user.walletAddress,
          mdfId: user.userId,
          name: user.displayName,
        };
      }

      // Check loaded team members (Audited: Exact ID, trimmed ID ya numeric match)
      const normalizedDigits = trimmed.replace(/\D/g, '');
      const matched = members.find((m) => {
        const u = (m.userId || '').toUpperCase();
        return (
          u === cleanId ||
          u === trimmed.toUpperCase() ||
          (normalizedDigits.length > 0 && u.replace(/\D/g, '') === normalizedDigits)
        );
      });
      if (matched && matched.address && ethers.isAddress(matched.address)) {
        return {
          isValid: true,
          address: ethers.getAddress(matched.address),
          mdfId: matched.userId || cleanId,
          name: matched.name || matched.userId || cleanId,
        };
      }

      // Check loaded transactions
      const txMatch = transactions.find((t) => {
        const u = (t.userId || '').toUpperCase();
        return (
          u === cleanId ||
          u === trimmed.toUpperCase() ||
          (normalizedDigits.length > 0 && u.replace(/\D/g, '') === normalizedDigits)
        );
      });
      if (txMatch && txMatch.memberWallet && ethers.isAddress(txMatch.memberWallet)) {
        return {
          isValid: true,
          address: ethers.getAddress(txMatch.memberWallet),
          mdfId: txMatch.userId || cleanId,
          name: txMatch.userId || cleanId,
        };
      }

      return {
        isValid: false,
        error: 'Please search with a valid 42-character wallet address (0x...) for on-chain query.',
      };
    }

    // 3. Partial wallet address (only if unambiguous)
    if (/^(0x)?[a-fA-F0-9]{3,39}$/i.test(trimmed)) {
      const searchHex = trimmed.toLowerCase().replace(/^0x/, '');
      const candidates = new Map<string, { address: string; member?: TeamMember; isSelf?: boolean }>();

      if (user?.walletAddress && user.walletAddress.toLowerCase().includes(searchHex)) {
        candidates.set(user.walletAddress.toLowerCase(), { address: user.walletAddress, isSelf: true });
      }

      members.forEach((m) => {
        if (m.address && m.address.toLowerCase().includes(searchHex)) {
          candidates.set(m.address.toLowerCase(), { address: m.address, member: m });
        }
      });

      if (candidates.size === 1) {
        const item = Array.from(candidates.values())[0];
        return {
          isValid: true,
          address: item.address,
          mdfId: item.isSelf ? user?.userId : item.member?.userId,
          name: item.isSelf ? user?.displayName : item.member?.name,
        };
      }

      if (candidates.size > 1) {
        return {
          isValid: false,
          error: `Multiple addresses match "${trimmed}". Please provide the full 42-character address.`,
        };
      }

      return {
        isValid: false,
        error: 'Partial wallet address could not be resolved. Please enter the full 42-character address (0x...).',
      };
    }

    return {
      isValid: false,
      error: 'Invalid wallet address format. Please enter a valid MDF ID or 0x address.',
    };
  };

  /**
   * Executes the on-chain read or preview inspection
   */
  const executeSearch = async (termToSearch?: string) => {
    const rawTerm = (termToSearch !== undefined ? termToSearch : searchQuery).trim();

    // If preview mode is manually toggled on and search input is completely empty
    if (isPreviewMode && !rawTerm) {
      setValidationError(null);
      setErrorMessage(null);
      setIsLoading(false);
      setProfileData({ ...SAMPLE_PREVIEW_DATA });
      setIsModalOpen(true);
      return;
    }

    const resolution = resolveAddress(rawTerm);
    if (!resolution.isValid || !resolution.address) {
      setValidationError(resolution.error || 'User ID could not be resolved to a wallet address.');
      setTimeout(() => setValidationError(null), 4000);
      return;
    }

    setValidationError(null);
    setIsModalOpen(true);
    setIsLoading(true);
    setErrorMessage(null);
    setProfileData(null);

    const targetWallet = resolution.address;
    const cacheKey = `${NETWORK_CONFIG.chainId}:${CONTRACT_ADDRESSES.mdefiHub || 'LOCAL'}:${targetWallet.toLowerCase()}`;

    // Check cache
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setProfileData(cached.data);
      setIsLoading(false);
      return;
    }

    // Deduplicate in-flight requests
    if (pendingReads.has(cacheKey)) {
      try {
        const res = await pendingReads.get(cacheKey)!;
        setProfileData(res);
      } catch (err: any) {
        setErrorMessage(err?.message || 'Error reading on-chain user dashboard.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const readPromise = (async (): Promise<ExploreUserDashboardData> => {
      const provider = getSharedRpcProvider();

      const hubAddress = CONTRACT_ADDRESSES.mdefiHub;

      // 1. Live smart contract read if Hub is deployed on BSC
      if (hubAddress && ethers.isAddress(hubAddress) && hubAddress !== ethers.ZeroAddress) {
        const fullAbi = [...HUB_ABI, ...HUB_DASHBOARD_ABI];
        const hubContract = new ethers.Contract(hubAddress, fullAbi, provider);

        const res = await hubContract.getUserDashboard(targetWallet);
        // Tuple/Struct un-wrapping safety check for Ethers.js v6
        const raw = (res && res.dashboard) ? res.dashboard : ((res && res.userId !== undefined) ? res : (res && res[0] ? res[0] : res));

        if (!raw || raw.userId === undefined) {
          throw new Error('Malformed response from Hub contract getUserDashboard.');
        }

        const userIdBn = BigInt(raw.userId.toString());
        const walletAddress = raw.wallet ? ethers.getAddress(raw.wallet) : ethers.ZeroAddress;
        const isRegistered = userIdBn > 0n && walletAddress.toLowerCase() === targetWallet.toLowerCase();

        const sponsorAddr = raw.sponsor ? ethers.getAddress(raw.sponsor) : ethers.ZeroAddress;
        const isRootSponsor = sponsorAddr === ethers.ZeroAddress || sponsorAddr === '0x000000000000000000000000000000000000dEaD';
        const regDate = formatRegDate(raw.registrationTime);

        // Resolve profile pictures from application's existing profile source
        const matched = members.find((m) => m.address && m.address.toLowerCase() === targetWallet.toLowerCase());
        const isSelf = user && user.walletAddress.toLowerCase() === targetWallet.toLowerCase();

        let sponsorMember = members.find((m) => m.address && m.address.toLowerCase() === sponsorAddr.toLowerCase());
        let sponsorDisplayName = sponsorMember?.name;
        let sponsorAvatarUrl: string | undefined = undefined;
        let sponsorUserId = sponsorMember?.userId;

        if (user && user.walletAddress.toLowerCase() === sponsorAddr.toLowerCase()) {
          sponsorDisplayName = user.displayName;
          sponsorAvatarUrl = user.avatarUrl;
          sponsorUserId = user.userId;
        }

        const result: ExploreUserDashboardData = {
          userId: userIdBn.toString(),
          wallet: targetWallet,
          sponsor: isRootSponsor ? ethers.ZeroAddress : sponsorAddr,
          isRootSponsor,
          registrationTimeRaw: regDate.raw,
          registrationDateFormatted: regDate.formatted,
          directTeamCount: Number(raw.directTeamCount.toString()),
          totalTeamCount: Number(raw.totalTeamCount.toString()),
          activePackageCount: Number(raw.activePackageCount.toString()),
          isBlocked: Boolean(raw.isBlocked),
          referralTotalEarned: formatTokenBalance(raw.referralTotalEarned),
          referralTotalClaimed: formatTokenBalance(raw.referralTotalClaimed),
          referralClaimable: formatTokenBalance(raw.referralClaimable),
          packageTotalEarned: formatTokenBalance(raw.packageTotalEarned),
          packageTotalClaimed: formatTokenBalance(raw.packageTotalClaimed),
          packageClaimable: formatTokenBalance(raw.packageClaimable),
          lifetimeYieldUsdt: undefined, // Contract does not establish USDT yield
          isRegistered,
          isRealBlockchainData: true,
          isDesignPreview: false,
          userDisplayName: matched?.name || (isSelf ? user?.displayName : undefined),
          userAvatarUrl: isSelf ? user?.avatarUrl : undefined,
          sponsorDisplayName,
          sponsorAvatarUrl,
          sponsorUserId,
          mdfUserId: matched?.userId || (isSelf ? user?.userId : undefined),
        };

        responseCache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      }

      // 2. Pre-deployment Mode / Contract read fallback
      const isSelf = user?.walletAddress && user.walletAddress.toLowerCase() === targetWallet.toLowerCase();
      const matched = members.find((m) => m.address && m.address.toLowerCase() === targetWallet.toLowerCase());

      if (!isSelf && !matched) {
        // Unregistered wallet
        const unreg: ExploreUserDashboardData = {
          userId: '0',
          wallet: targetWallet,
          sponsor: ethers.ZeroAddress,
          isRootSponsor: true,
          registrationTimeRaw: 0,
          registrationDateFormatted: 'UNREGISTERED',
          directTeamCount: 0,
          totalTeamCount: 0,
          activePackageCount: 0,
          isBlocked: false,
          referralTotalEarned: '0.00 MBTTC',
          referralTotalClaimed: '0.00 MBTTC',
          referralClaimable: '0.00 MBTTC',
          packageTotalEarned: '0.00 MBTTC',
          packageTotalClaimed: '0.00 MBTTC',
          packageClaimable: '0.00 MBTTC',
          lifetimeYieldUsdt: '0.00 USDT',
          isRegistered: false,
          isRealBlockchainData: false,
          isDesignPreview: false,
        };
        responseCache.set(cacheKey, { data: unreg, timestamp: Date.now() });
        return unreg;
      }

      // Registered member in ecosystem: synthesize the 14 contract-defined fields
      const numericId = isSelf
        ? (user?.sponsorNumericId || 8421)
        : parseInt((matched?.userId || '').replace(/\D/g, '') || '9112', 10);

      const sponsorAddr = isSelf
        ? (user?.sponsorAddress || '0xABCD1839Fa24e93C298B321f8a84620a3b221234')
        : (matched?.sponsorAddress || user?.walletAddress || '0xABCD1839Fa24e93C298B321f8a84620a3b221234');

      const isRootSponsor = !sponsorAddr || sponsorAddr === ethers.ZeroAddress;

      const regDate = formatRegDate(
        isSelf
          ? Math.floor(new Date('2026-05-18T10:00:00Z').getTime() / 1000)
          : Math.floor(new Date(matched?.joinedDate || '2026-08-28').getTime() / 1000)
      );

      let sponsorName = 'Protocol Sponsor';
      let sponsorAvatar: string | undefined = undefined;
      let sponsorId = isSelf ? user?.sponsorId : matched?.sponsor;

      if (user && user.walletAddress.toLowerCase() === sponsorAddr.toLowerCase()) {
        sponsorName = user.displayName || 'You';
        sponsorAvatar = user.avatarUrl;
        sponsorId = user.userId;
      }

      const result: ExploreUserDashboardData = {
        userId: numericId.toString(),
        wallet: targetWallet,
        sponsor: isRootSponsor ? ethers.ZeroAddress : ethers.getAddress(sponsorAddr),
        isRootSponsor,
        registrationTimeRaw: regDate.raw,
        registrationDateFormatted: regDate.formatted,
        directTeamCount: isSelf ? (user?.directTeamCount || 12) : (matched?.directPartners || 18),
        totalTeamCount: isSelf ? (user?.totalTeamCount || 184) : 25,
        activePackageCount: isSelf ? 2 : (matched?.activePackages !== undefined ? matched.activePackages : 8),
        isBlocked: false,
        referralTotalEarned: isSelf ? '500.00 MBTTC' : '1,800.00 MBTTC',
        referralTotalClaimed: isSelf ? '200.00 MBTTC' : '1,114.00 MBTTC',
        referralClaimable: isSelf ? '300.00 MBTTC' : '686.00 MBTTC',
        packageTotalEarned: isSelf ? '1,200.00 MBTTC' : '1,500.00 MBTTC',
        packageTotalClaimed: isSelf ? '600.00 MBTTC' : '614.00 MBTTC',
        packageClaimable: isSelf ? '600.00 MBTTC' : '886.00 MBTTC',
        lifetimeYieldUsdt: '886.00 USDT',
        isRegistered: true,
        isRealBlockchainData: false,
        isDesignPreview: false,
        userDisplayName: isSelf ? user?.displayName : matched?.name,
        userAvatarUrl: isSelf ? user?.avatarUrl : undefined,
        sponsorDisplayName: sponsorName,
        sponsorAvatarUrl: sponsorAvatar,
        sponsorUserId: sponsorId,
        mdfUserId: isSelf ? user?.userId : matched?.userId,
      };

      responseCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    })();

    pendingReads.set(cacheKey, readPromise);

    try {
      const res = await readPromise;
      setProfileData(res);
    } catch (err: any) {
      console.warn('[ExploreUser] Query error:', err);
      setErrorMessage(err?.message || 'Failed to read on-chain user dashboard from Hub contract.');
    } finally {
      pendingReads.delete(cacheKey);
      setIsLoading(false);
    }
  };

  return (
    <div className={`explore-user-container relative ${className}`}>
      {/* ==================== COMPONENT-SCOPED 3D STYLES & REAL KEYFRAMES ==================== */}
      <style>{`
        .explore-user-modal-overlay {
          background-color: rgba(3, 7, 5, 0.92);
          backdrop-filter: blur(18px);
        }

        @keyframes coin3dSpinLoop {
          0% {
            transform: rotateY(0deg) rotateX(8deg);
          }
          50% {
            transform: rotateY(180deg) rotateX(-8deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(8deg);
          }
        }
        .mdefi-coin-3d-spin {
          animation: coin3dSpinLoop 6s linear infinite !important;
          transform-style: preserve-3d !important;
        }

        /* Coin Specular Sheen Sweep */
        @keyframes coin-sheen {
          0% {
            transform: translateX(-160%) skewX(-20deg);
            opacity: 0;
          }
          30% {
            opacity: 0.75;
          }
          60% {
            transform: translateX(160%) skewX(-20deg);
            opacity: 0;
          }
          100% {
            transform: translateX(160%) skewX(-20deg);
            opacity: 0;
          }
        }
        .animate-coin-sheen {
          animation: coin-sheen 3.2s ease-in-out infinite;
        }

        /* 3D Orb Rings */
        @keyframes orb-ring-1 {
          0% { transform: rotateX(68deg) rotateY(15deg) rotateZ(0deg); }
          100% { transform: rotateX(68deg) rotateY(15deg) rotateZ(360deg); }
        }
        .animate-orb-ring-1 {
          animation: orb-ring-1 6s linear infinite;
        }

        @keyframes orb-ring-2 {
          0% { transform: rotateX(-60deg) rotateY(-20deg) rotateZ(0deg); }
          100% { transform: rotateX(-60deg) rotateY(-20deg) rotateZ(-360deg); }
        }
        .animate-orb-ring-2 {
          animation: orb-ring-2 8s linear infinite;
        }

        /* Center Blockchain Gyroscope Rings */
        @keyframes gyro-1 {
          0% { transform: rotateX(70deg) rotateY(20deg) rotateZ(0deg); }
          100% { transform: rotateX(70deg) rotateY(20deg) rotateZ(360deg); }
        }
        .animate-gyro-1 {
          animation: gyro-1 10s linear infinite;
        }

        @keyframes gyro-2 {
          0% { transform: rotateX(-50deg) rotateY(45deg) rotateZ(0deg); }
          100% { transform: rotateX(-50deg) rotateY(45deg) rotateZ(-360deg); }
        }
        .animate-gyro-2 {
          animation: gyro-2 7s linear infinite;
        }

        @keyframes gyro-3 {
          0% { transform: rotateX(35deg) rotateY(-65deg) rotateZ(0deg); }
          100% { transform: rotateX(35deg) rotateY(-65deg) rotateZ(360deg); }
        }
        .animate-gyro-3 {
          animation: gyro-3 4.5s linear infinite;
        }

        /* Conduit Flowing Photons */
        @keyframes conduit-photon-left {
          0% { transform: translateX(0); opacity: 0.1; }
          50% { opacity: 1; }
          100% { transform: translateX(110px); opacity: 0.1; }
        }
        .animate-conduit-photon-left {
          animation: conduit-photon-left 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes conduit-photon-mid {
          0% { transform: translateX(50px) scale(0.6); opacity: 0.2; }
          50% { transform: translateX(180px) scale(1.1); opacity: 1; }
          100% { transform: translateX(300px) scale(0.6); opacity: 0.2; }
        }
        .animate-conduit-photon-mid {
          animation: conduit-photon-mid 3s ease-in-out infinite;
        }

        @keyframes conduit-photon-right {
          0% { transform: translateX(200px); opacity: 0.1; }
          50% { opacity: 1; }
          100% { transform: translateX(310px); opacity: 0.1; }
        }
        .animate-conduit-photon-right {
          animation: conduit-photon-right 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.6s;
        }

        /* Center Core Pulse & Breathing */
        @keyframes core-pulse {
          0%, 100% { transform: scale(1); opacity: 0.45; }
          50% { transform: scale(1.2); opacity: 0.85; }
        }
        .animate-core-pulse {
          animation: core-pulse 2.8s ease-in-out infinite;
        }

        @keyframes core-breathe {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.08) rotate(3deg); }
        }
        .animate-core-breathe {
          animation: core-breathe 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-coin-rotate-3d,
          .animate-coin-sheen,
          .animate-orb-ring-1,
          .animate-orb-ring-2,
          .animate-gyro-1,
          .animate-gyro-2,
          .animate-gyro-3,
          .animate-conduit-photon-left,
          .animate-conduit-photon-mid,
          .animate-conduit-photon-right,
          .animate-core-pulse,
          .animate-core-breathe {
            animation: none !important;
          }
        }
      `}</style>

      {/* SEARCH INPUT BAR (PRESERVED IN TEAMVIEW) */}
      <div className="flex items-center gap-2 relative">
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => executeSearch(searchQuery)}
            className="w-4 h-4 text-zinc-400 hover:text-emerald-400 transition-colors absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer z-10"
            title="Search & Explore User"
          >
            <Search className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (validationError) setValidationError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                executeSearch(searchQuery);
              }
            }}
            placeholder="Search by User ID or wallet address..."
            className="w-full bg-zinc-950/80 border border-emerald-500/25 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 transition-colors font-mono"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                setValidationError(null);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Primary Action Button: "Explore User" */}
        <button
          type="button"
          onClick={() => executeSearch(searchQuery)}
          disabled={isLoading || (!searchQuery.trim() && !isPreviewMode)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#063822] via-[#095031] to-[#0c663e] hover:from-[#08452a] hover:to-[#0f7a4a] border border-emerald-400/50 hover:border-emerald-300 text-white text-xs font-mono font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_22px_rgba(16,185,129,0.4)] cursor-pointer"
          title="Explore User On-Chain Dashboard Data"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>Explore User</span>
        </button>

        {/* Development Design Preview Toggle Button */}
        <button
          type="button"
          onClick={() => {
            const next = !isPreviewMode;
            setIsPreviewMode(next);
            if (next) {
              setValidationError(null);
              setErrorMessage(null);
              setProfileData({ ...SAMPLE_PREVIEW_DATA });
              setIsModalOpen(true);
            }
          }}
          className={`px-2.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shrink-0 border cursor-pointer ${
            isPreviewMode
              ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 border-zinc-800'
          }`}
          title="Toggle Development Design Preview Mode"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">{isPreviewMode ? 'Preview ON' : 'Preview Mode'}</span>
        </button>
      </div>

      {/* Validation Warning Feedback */}
      {validationError && (
        <div className="absolute top-full left-0 mt-2 z-20 text-xs font-mono text-amber-300 bg-amber-950/90 border border-amber-500/40 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* ========================================================
          USER INTELLIGENCE PROFILE MODAL
          RENDERED DIRECTLY TO BODY TO FIX STACKING CONTEXT / LAYER BUG
          ======================================================== */}
      {typeof document !== 'undefined' && isModalOpen && createPortal(
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="explore-user-modal-title"
          className="explore-user-modal-portal fixed inset-0 flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-hidden select-none animate-in fade-in duration-200"
          style={{ position: 'fixed', inset: 0, zIndex: 999999 }}
        >
          {/* Full-screen backdrop overlay covering application viewport */}
          <div
            className="fixed inset-0 explore-user-modal-overlay transition-opacity duration-300"
            aria-hidden="true"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Floating Centered Modal Window with Crisp Metallic Glass Border */}
          <div 
            className="relative z-10 w-[calc(100%-16px)] sm:w-full max-w-[940px] max-h-[92dvh] sm:max-h-[90dvh] flex flex-col rounded-3xl sm:rounded-[32px] bg-[#070b08]/95 border border-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.2)] overflow-hidden text-zinc-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Web3 Network Background */}
            <Web3NetworkBackground />

            {/* TOP STICKY HEADER: Protocol Brand & High-Contrast Red Circular X Close Button */}
            <div className="sticky top-0 z-30 shrink-0 flex items-center justify-between p-3.5 sm:p-5 px-4 sm:px-7 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-900/90 to-zinc-950 border border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase font-black text-emerald-400">
                      MDEFI PROTOCOL
                    </span>
                    <span className="text-zinc-600 hidden sm:inline">·</span>
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase font-bold text-zinc-300 tracking-wider">
                      EXPLORE USER
                    </span>
                    {profileData?.isDesignPreview && (
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                        DESIGN PREVIEW · SAMPLE DATA
                      </span>
                    )}
                  </div>
                  <h2 id="explore-user-modal-title" className="text-xs sm:text-sm text-zinc-400 font-sans">
                    On-chain identity & partner intelligence
                  </h2>
                </div>
              </div>

              {/* Prominent Circular Red X Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-red-700 hover:from-red-600 hover:to-rose-800 text-white shadow-[0_0_18px_rgba(239,68,68,0.55)] border border-red-300/40 flex items-center justify-center transition-all cursor-pointer active:scale-90 focus:outline-none focus:ring-2 focus:ring-red-400 shrink-0 ml-2"
                aria-label="Close Explore User modal"
                title="Close (Esc)"
              >
                <X className="w-5 h-5 text-white stroke-[2.5]" />
              </button>
            </div>

            {/* MODAL BODY WITH INTERNAL SCROLLING */}
            <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-5 sm:px-7 space-y-5">
              {/* 1. LOADING STATE */}
              {isLoading && (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border-2 border-t-emerald-400 border-r-emerald-500 border-b-transparent border-l-transparent animate-spin" />
                    <Sparkles className="w-6 h-6 text-emerald-400 absolute animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                      Reading On-Chain Profile...
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-sm">
                      Executing <code className="text-emerald-400 bg-zinc-900 px-1.5 py-0.5 rounded font-mono">getUserDashboard(address)</code> on the Hub smart contract.
                    </p>
                  </div>
                </div>
              )}

              {/* 2. ERROR STATE */}
              {!isLoading && errorMessage && (
                <div className="p-6 rounded-3xl bg-red-950/40 border border-red-500/40 space-y-4 text-center max-w-lg mx-auto my-8">
                  <div className="w-12 h-12 rounded-2xl bg-red-900/50 border border-red-500/40 text-red-300 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white font-mono">Query Error</h3>
                    <p className="text-xs text-red-200 font-sans">{errorMessage}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => executeSearch(searchQuery)}
                    className="px-4 py-2 rounded-xl bg-red-900/60 hover:bg-red-800 text-white text-xs font-mono font-bold border border-red-500/40 transition-colors inline-flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Query</span>
                  </button>
                </div>
              )}

              {/* 3. UNREGISTERED USER STATE */}
              {!isLoading && !errorMessage && profileData && !profileData.isRegistered && (
                <div className="p-8 sm:p-10 rounded-3xl bg-zinc-950/70 border border-amber-500/35 text-center space-y-5 max-w-xl mx-auto my-6 shadow-xl">
                  <div className="w-16 h-16 rounded-3xl bg-amber-950/60 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40">
                      PROTOCOL ACCOUNT STATUS
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white font-mono">
                      User Not Registered On-Chain
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto font-sans leading-relaxed">
                      The searched address <code className="text-zinc-200 font-mono bg-zinc-900 px-1.5 py-0.5 rounded">{formatCompactAddress(profileData.wallet)}</code> is not registered on the MDeFi Hub smart contract.
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-400 flex items-center justify-between gap-3">
                    <span className="text-zinc-500">Target Address:</span>
                    <div className="flex items-center gap-1.5 text-zinc-200 font-bold">
                      <span>{formatCompactAddress(profileData.wallet)}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(profileData.wallet, 'unreg-wallet', 'Wallet Address')}
                        className="p-1 hover:text-emerald-400 transition-colors"
                      >
                        {copiedKey === 'unreg-wallet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. SUCCESS / PREVIEW VIEW */}
              {!isLoading && !errorMessage && profileData && profileData.isRegistered && (
                <div className="space-y-5">
                  {/* ========================================================
                      SECTION 1: USER + UPLINE CINEMATIC 3D CONNECTION
                      Left: Target User Card
                      Center: Cinematic 3D Multi-Ring Gyroscope & Quantum Orbs
                      Right: Sponsor / Upline Card
                      ======================================================== */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#09110b]/90 via-[#060c08]/85 to-[#040806]/95 border border-emerald-500/25 shadow-[0_0_35px_rgba(16,185,129,0.12)]">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      
                      {/* LEFT: TARGET USER CARD */}
                      <div className="lg:col-span-4 p-4 rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950/95 border border-emerald-500/25 shadow-lg relative overflow-hidden group hover:border-emerald-400/50 transition-all">
                        {/* Ambient subtle card glow */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

                        <div className="flex items-center gap-3.5">
                          {/* User Avatar with Luminous Emerald Ring */}
                          <div className="relative shrink-0">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35)]">
                              {profileData.userAvatarUrl ? (
                                <img
                                  src={profileData.userAvatarUrl}
                                  alt="User Avatar"
                                  className="w-full h-full rounded-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-800 via-teal-950 to-zinc-950 flex items-center justify-center border border-emerald-400/30">
                                  <UserIcon className="w-7 h-7 text-emerald-300" />
                                </div>
                              )}
                            </div>
                            {/* Emerald Verified Check Badge */}
                            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.6)]">
                              <Check className="w-3 h-3 text-zinc-950 stroke-[3]" />
                            </span>
                          </div>

                          {/* User Details */}
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                                {profileData.mdfUserId || `MDF-${profileData.userId}`}
                              </span>
                              <span className="text-[9px] font-mono uppercase font-bold text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                User
                              </span>
                            </div>

                            <h3 className="text-sm sm:text-base font-bold text-white font-sans truncate">
                              {profileData.userDisplayName && profileData.userDisplayName.trim().length > 0 
                                ? profileData.userDisplayName 
                                : (profileData.mdfUserId || `MDF-${profileData.userId}`)}
                            </h3>

                            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                              <span className="truncate">{formatCompactAddress(profileData.wallet)}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(profileData.wallet, 'user-card-wallet', 'Target Wallet')}
                                className="p-1 hover:text-emerald-400 text-zinc-400 transition-colors cursor-pointer"
                                title="Copy Wallet Address"
                              >
                                {copiedKey === 'user-card-wallet' ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CENTER: CINEMATIC 3D CONNECTION NEXUS */}
                      <div className="lg:col-span-4 flex flex-col items-center justify-center py-2 lg:py-0">
                        <Cinematic3DConnectionNexus />
                      </div>

                      {/* RIGHT: SPONSOR / UPLINE CARD */}
                      <div className="lg:col-span-4 p-4 rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950/95 border border-cyan-500/25 shadow-lg relative overflow-hidden group hover:border-cyan-400/50 transition-all">
                        {/* Ambient subtle card glow */}
                        <div className="absolute top-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

                        <div className="flex items-center gap-3.5">
                          {/* Sponsor Avatar with Luminous Cyan Ring */}
                          <div className="relative shrink-0">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-cyan-500 via-sky-400 to-teal-300 shadow-[0_0_15px_rgba(6,182,212,0.35)]">
                              {profileData.isRootSponsor ? (
                                <div className="w-full h-full rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                                  <ShieldCheck className="w-7 h-7 text-cyan-400" />
                                </div>
                              ) : profileData.sponsorAvatarUrl ? (
                                <img
                                  src={profileData.sponsorAvatarUrl}
                                  alt="Sponsor Avatar"
                                  className="w-full h-full rounded-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-800 via-sky-950 to-zinc-950 flex items-center justify-center border border-cyan-400/30">
                                  <UserIcon className="w-7 h-7 text-cyan-300" />
                                </div>
                              )}
                            </div>
                            {/* Cyan Verified Check Badge */}
                            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-cyan-500 border-2 border-zinc-950 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                              <Check className="w-3 h-3 text-zinc-950 stroke-[3]" />
                            </span>
                          </div>

                          {/* Sponsor Details */}
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-md">
                                {profileData.sponsorUserId || 'MDF-24815'}
                              </span>
                              <span className="text-[9px] font-mono uppercase font-bold text-cyan-300/90 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                                Upline
                              </span>
                            </div>

                            <h3 className="text-sm sm:text-base font-bold text-white font-sans truncate">
                              {profileData.isRootSponsor
                                ? 'Root Protocol'
                                : (profileData.sponsorUserId || profileData.sponsorDisplayName || formatCompactAddress(profileData.sponsor))}
                            </h3>

                            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                              <span className="truncate">
                                {profileData.isRootSponsor
                                  ? 'Root · No Sponsor'
                                  : formatCompactAddress(profileData.sponsor)}
                              </span>
                              {!profileData.isRootSponsor && (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(profileData.sponsor, 'sponsor-card-wallet', 'Sponsor Wallet')}
                                  className="p-1 hover:text-cyan-400 text-zinc-400 transition-colors cursor-pointer"
                                  title="Copy Sponsor Wallet"
                                >
                                  {copiedKey === 'sponsor-card-wallet' ? (
                                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================
                      SECTION 2: NETWORK OVERVIEW
                      Header: NETWORK OVERVIEW · Registration Date
                      3 Cards: Active Packages, Direct Partners, Total Team
                      ======================================================== */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-zinc-950/70 border border-zinc-800/80 space-y-3.5">
                    {/* Header Row */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white font-mono">
                          NETWORK OVERVIEW
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-300">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{profileData.registrationDateFormatted}</span>
                      </div>
                    </div>

                    {/* 3 Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      {/* CARD 1: Active Packages (Emerald / Teal Accent) */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-emerald-950/20 to-zinc-900/60 border border-emerald-500/25 text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-emerald-400/50 transition-all shadow-md">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-zinc-300 mb-1 font-sans">
                          <Layers className="w-4 h-4 text-emerald-400" />
                          <span>Active Packages</span>
                        </div>
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-400 font-mono tracking-tight my-1 drop-shadow-[0_2px_12px_rgba(52,211,153,0.35)]">
                          {profileData.activePackageCount}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          Active Node Tiers
                        </span>
                      </div>

                      {/* CARD 2: Direct Partners (Refined Ruby / Pink Accent) */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-rose-950/20 to-zinc-900/60 border border-rose-500/25 text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-rose-400/50 transition-all shadow-md">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-zinc-300 mb-1 font-sans">
                          <Users className="w-4 h-4 text-rose-400" />
                          <span>Direct Partners</span>
                        </div>
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-rose-500 font-mono tracking-tight my-1 drop-shadow-[0_2px_12px_rgba(244,63,94,0.35)]">
                          {profileData.directTeamCount}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          Tier-1 Direct Frontline
                        </span>
                      </div>

                      {/* CARD 3: Total Team (Sapphire / Royal Blue Accent) */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-blue-950/20 to-zinc-900/60 border border-blue-500/25 text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-400/50 transition-all shadow-md">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-zinc-300 mb-1 font-sans">
                          <TrendingUp className="w-4 h-4 text-blue-400" />
                          <span>Total Team</span>
                        </div>
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-400 font-mono tracking-tight my-1 drop-shadow-[0_2px_12px_rgba(59,130,246,0.35)]">
                          {profileData.totalTeamCount}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          Network Downline
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================
                      SECTION 3: REFERRAL REWARDS — MBTTC
                      Prominent Claimable Reward + Rotating 3D MBTTC Coin
                      ======================================================== */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block px-1">
                      REFERRAL REWARD — MBTTC
                    </span>
                    <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#06180e]/90 via-[#071d12]/80 to-zinc-950/90 border border-emerald-500/30 relative overflow-hidden group hover:border-emerald-400/50 transition-all shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-[0_2px_10px_rgba(52,211,153,0.35)]">
                            {profileData.referralClaimable}
                          </div>
                          <span className="text-[11px] font-mono text-emerald-300/80 block mt-0.5">
                            Claimable Referral Reward
                          </span>
                        </div>
                        {/* CONTINUOUS ROTATING 3D MBTTC COIN */}
                        <Rotating3DMbttcCoin size={56} accent="emerald" />
                      </div>

                      {/* Secondary Summary Breakdown */}
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-emerald-500/20 text-[11px] font-mono">
                        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                          <span className="text-zinc-400">Total Earned:</span>
                          <span className="text-white font-bold">{profileData.referralTotalEarned}</span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                          <span className="text-zinc-400">Total Claimed:</span>
                          <span className="text-zinc-300 font-bold">{profileData.referralTotalClaimed}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================
                      SECTION 4: PACKAGE REWARDS — MBTTC
                      Prominent Claimable Reward + Rotating 3D MBTTC Coin
                      ======================================================== */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block px-1">
                      PACKAGE REWARD — MBTTC
                    </span>
                    <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1c080e]/90 via-[#1e0a13]/80 to-zinc-950/90 border border-rose-500/30 relative overflow-hidden group hover:border-rose-400/50 transition-all shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl sm:text-3xl md:text-4xl font-black text-rose-500 font-mono tracking-tight drop-shadow-[0_2px_10px_rgba(244,63,94,0.35)]">
                            {profileData.packageClaimable}
                          </div>
                          <span className="text-[11px] font-mono text-rose-300/80 block mt-0.5">
                            Claimable Package Reward
                          </span>
                        </div>
                        {/* CONTINUOUS ROTATING 3D MBTTC COIN */}
                        <Rotating3DMbttcCoin size={56} accent="rose" />
                      </div>

                      {/* Secondary Summary Breakdown */}
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-rose-500/20 text-[11px] font-mono">
                        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                          <span className="text-zinc-400">Total Earned:</span>
                          <span className="text-white font-bold">{profileData.packageTotalEarned}</span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                          <span className="text-zinc-400">Total Claimed:</span>
                          <span className="text-zinc-300 font-bold">{profileData.packageTotalClaimed}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================
                      SECTION 5: LIFETIME TOTAL YIELD — USDT
                      Only displayed if authoritative source exists or in preview
                      ======================================================== */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                        LIFETIME TOTAL YIELD — USDT
                      </span>
                      {profileData.isDesignPreview && (
                        <span className="text-[9px] font-mono text-amber-300 bg-amber-950/80 border border-amber-500/30 px-1.5 py-0.2 rounded">
                          Sample Demo
                        </span>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#061224]/90 via-[#07162d]/80 to-zinc-950/90 border border-blue-500/30 relative overflow-hidden group hover:border-blue-400/50 transition-all shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-400 font-mono tracking-tight drop-shadow-[0_2px_10px_rgba(59,130,246,0.35)]">
                            {profileData.lifetimeYieldUsdt || '0.00 USDT'}
                          </div>
                          <span className="text-[11px] font-mono text-blue-300/80 block mt-0.5">
                            Total Protocol Yield Distributed
                          </span>
                        </div>
                        {/* CONTINUOUS ROTATING 3D MBTTC COIN */}
                        <Rotating3DMbttcCoin size={56} accent="sapphire" />
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="shrink-0 p-3 sm:p-4 px-4 sm:px-7 border-t border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>MDeFi Hub Smart Contract Read-Only Protocol</span>
                <span className="text-zinc-600 hidden sm:inline">·</span>
                <span className="text-zinc-500 hidden sm:inline">Zero Gas Required</span>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold transition-all border border-zinc-700 hover:border-emerald-500/50 cursor-pointer text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>

          {/* Floating Copy Toast Notification */}
          {copyToast && (
            <div className="fixed bottom-6 z-[100000] px-4 py-2 rounded-2xl bg-zinc-950/95 border border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.4)] text-xs font-mono text-emerald-300 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{copyToast}</span>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default ExploreUser;
