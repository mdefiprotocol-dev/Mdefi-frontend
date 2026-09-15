import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  GitFork, 
  Network, 
  Cpu, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { UserProfile } from '../types';

export type MatrixOptionType = 's4-10' | 's4-25' | 'quantum-70' | 'nexus-120';

interface MatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  onSelectMatrix?: (matrixType: MatrixOptionType) => void;
  onNavigateS4?: (focus: 'junior' | 'senior') => void;
  onNavigateQuantum?: () => void;
  onNavigateNexusPrime?: () => void;
}

interface MatrixCardOption {
  id: MatrixOptionType;
  title: string;
  price: string;
  badge: string;
  tag: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badgeBorder: string;
  badgeBg: string;
  badgeText: string;
}

const matrixOptions: MatrixCardOption[] = [
  {
    id: 's4-10',
    title: 'S4 Node — $10',
    price: '$10',
    badge: 'Junior Node',
    tag: 'Community Tier',
    description: '2-Level 6-Node Circular Radial Matrix with instant 100% peer recycling.',
    icon: GitFork,
    accentColor: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-950/60',
    badgeText: 'text-emerald-300',
  },
  {
    id: 's4-25',
    title: 'S4 Node — $25',
    price: '$25',
    badge: 'Senior Node',
    tag: 'Standard Tier',
    description: '2-Level 6-Node Circular Radial Matrix with enhanced cycle yields.',
    icon: Network,
    accentColor: 'text-teal-400',
    badgeBorder: 'border-teal-500/30',
    badgeBg: 'bg-teal-950/60',
    badgeText: 'text-teal-300',
  },
  {
    id: 'quantum-70',
    title: 'Quantum Matrix — $70',
    price: '$70',
    badge: 'Quantum Nexus',
    tag: 'Advanced Tier',
    description: '30-Position Concentric Tree with 4-level orbital ring spillovers.',
    icon: Cpu,
    accentColor: 'text-cyan-400',
    badgeBorder: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-950/60',
    badgeText: 'text-cyan-300',
  },
  {
    id: 'nexus-120',
    title: 'Nexus Prime — $120',
    price: '$120',
    badge: 'Nexus Prime',
    tag: 'VIP Elite Tier',
    description: '30-Position High-Tier Orbit Matrix with automated infinite cycle re-entries.',
    icon: ShieldCheck,
    accentColor: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-950/60',
    badgeText: 'text-emerald-200',
  },
];

export const MatrixModal: React.FC<MatrixModalProps> = ({
  isOpen,
  onClose,
  onSelectMatrix,
  onNavigateS4,
  onNavigateQuantum,
  onNavigateNexusPrime,
}) => {
  const [selectedId, setSelectedId] = useState<MatrixOptionType | null>(null);
  const isNavigatingRef = useRef(false);

  // Clean state reset whenever modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedId(null);
      isNavigatingRef.current = false;
    }
  }, [isOpen]);

  // Handle ESC key to dismiss modal cleanly
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = useCallback((optionId: MatrixOptionType) => {
    // Prevent duplicate triggers / race condition
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setSelectedId(optionId);

    // Provide visual feedback, cleanly close modal first, then navigate smoothly
    setTimeout(() => {
      onClose();

      // Defer navigation to next frame after modal is unmounted/closed
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (onSelectMatrix) {
            onSelectMatrix(optionId);
          } else {
            if (optionId === 's4-10' && onNavigateS4) {
              onNavigateS4('junior');
            } else if (optionId === 's4-25' && onNavigateS4) {
              onNavigateS4('senior');
            } else if (optionId === 'quantum-70' && onNavigateQuantum) {
              onNavigateQuantum();
            } else if (optionId === 'nexus-120' && onNavigateNexusPrime) {
              onNavigateNexusPrime();
            }
          }
          isNavigatingRef.current = false;
        }, 30);
      });
    }, 180);
  }, [onClose, onSelectMatrix, onNavigateS4, onNavigateQuantum, onNavigateNexusPrime]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#0b100d]/95 border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden text-zinc-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft background glow accents */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-zinc-800/80 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Network Architecture
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Which Matrix Tree would you like to view?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Select a protocol matrix tier to inspect its circular position tree, cycle spillovers, and member nodes.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Selectable Matrix Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6 relative z-10">
          {matrixOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedId === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                disabled={isNavigatingRef.current}
                className={`group relative text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-950/70 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400 scale-[1.01]'
                    : 'bg-zinc-950/80 hover:bg-zinc-900/90 border-emerald-500/20 hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.18)] active:scale-[0.98]'
                } ${isNavigatingRef.current && !isSelected ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {/* Subtle light sweep animation passing on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

                <div>
                  {/* Card Top Row: Badge & Icon */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-mono font-bold tracking-wide uppercase ${opt.badgeBg} ${opt.badgeBorder} ${opt.badgeText}`}>
                      {opt.badge}
                    </span>

                    <div className={`p-2 rounded-xl border border-zinc-800 bg-zinc-900/80 ${opt.accentColor} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Option Title & Price */}
                  <div className="space-y-0.5 mb-2">
                    <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
                      {opt.title}
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-1.5">
                      <span className={isSelected ? 'text-emerald-300' : 'text-white'}>
                        {opt.price}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500 font-normal">
                        USD
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                {/* Card Bottom: Action / Selection Status */}
                <div className="mt-4 pt-3 border-t border-zinc-900/90 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-zinc-500">
                    {opt.tag}
                  </span>

                  <div className={`flex items-center gap-1.5 font-semibold text-xs transition-colors ${
                    isSelected ? 'text-emerald-300 font-bold' : 'text-zinc-400 group-hover:text-emerald-400'
                  }`}>
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Opening Tree...</span>
                      </>
                    ) : (
                      <>
                        <span>View Tree</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80 text-xs text-zinc-500 relative z-10">
          <span className="text-[11px] font-mono">
            Directly routes to the verified on-chain matrix circular layout
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

