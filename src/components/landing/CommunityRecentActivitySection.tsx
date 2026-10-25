import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity as ActivityIcon, 
  ShieldCheck,
  CheckCircle2,
  Inbox
} from 'lucide-react';
import { centralEventSyncService } from '../../services/centralEventSyncService';
import { EcosystemActivity, EcosystemActivityType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

const EcosystemPulseIcon: React.FC = () => (
  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-950/90 to-zinc-950/90 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.25)] overflow-hidden">
    <div className="absolute inset-1 rounded-full border border-dashed border-emerald-500/30 animate-[spin_24s_linear_infinite] pointer-events-none" />
    <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5 text-emerald-400 relative z-10" aria-hidden="true">
      <line x1="16" y1="16" x2="8" y2="9" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="2 2" />
      <line x1="16" y1="16" x2="24" y2="9" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="2 2" />
      <line x1="16" y1="16" x2="8" y2="23" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="2 2" />
      <line x1="16" y1="16" x2="24" y2="23" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="2 2" />
      <circle cx="8" cy="9" r="2.5" fill="#10b981" />
      <circle cx="24" cy="9" r="2.5" fill="#34d399" />
      <circle cx="8" cy="23" r="2.5" fill="#059669" />
      <circle cx="24" cy="23" r="2.5" fill="#10b981" />
      <circle cx="16" cy="16" r="3.5" fill="#10b981" fillOpacity="0.3" stroke="#34d399" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="1.5" fill="#ffffff" />
    </svg>
  </div>
);

function formatMaskedMember(address?: string): string {
  if (!address) return '••••4821';
  const clean = String(address).trim();
  if (clean.includes('••••')) return clean;
  if (clean.length > 4) {
    return `••••${clean.slice(-4)}`;
  }
  return '••••4821';
}

function getBadgeColor(type?: EcosystemActivityType) {
  switch (type) {
    case 'REGISTRATION':
      return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    case 'PACKAGE':
      return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
    case 'MBTTC_CREDIT':
    case 'MBTTC_CLAIM':
      return 'bg-teal-950/80 text-teal-300 border-teal-500/40';
    case 'WEEKLY_REWARD':
    case 'WEEKLY_SALARY':
      return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
    default:
      return 'bg-zinc-900 text-zinc-300 border-zinc-700';
  }
}

export const CommunityRecentActivitySection: React.FC = () => {
  const { t } = useLanguage();
  const [activities, setActivities] = useState<EcosystemActivity[]>([]);

  // 0% Network RPC: Reads purely from local state cache
  useEffect(() => {
    let isMounted = true;
    const syncActivities = () => {
      try {
        const liveEvents = centralEventSyncService?.getState?.()?.publicEcosystemActivities || [];
        if (isMounted) {
          setActivities(Array.isArray(liveEvents) ? liveEvents : []);
        }
      } catch (err) {
        console.warn('[CommunityRecentActivitySection] Cached events sync safe fallback:', err);
      }
    };

    syncActivities();
    const interval = setInterval(syncActivities, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Safe and bounded base list generator
  const baseItems = useMemo(() => {
    if (!Array.isArray(activities) || activities.length === 0) return [];
    const repeatCount = Math.min(10, Math.max(2, Math.ceil(8 / activities.length)));
    const list: EcosystemActivity[] = [];
    for (let i = 0; i < repeatCount; i++) {
      list.push(...activities);
    }
    return list;
  }, [activities]);

  const durationSec = useMemo(() => {
    const count = activities.length || 6;
    return Math.max(25, count * 5);
  }, [activities.length]);

  return (
    <section
      id="community-activity"
      aria-labelledby="ecosystem-activities-heading"
      className="relative my-8 sm:my-12 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 z-10 w-full overflow-hidden"
    >
      {/* Zero Jitter Hardware-Accelerated Continuous Keyframe */}
      <style>{`
        @keyframes mdefi-ticker-loop {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }
        .mdefi-ticker-viewport {
          display: flex;
          overflow: hidden;
          user-select: none;
          mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
        }
        .mdefi-ticker-group {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          animation: mdefi-ticker-loop ${durationSec}s linear infinite;
          will-change: transform;
        }
        .mdefi-ticker-viewport:hover .mdefi-ticker-group,
        .mdefi-ticker-viewport:active .mdefi-ticker-group {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="relative rounded-3xl bg-gradient-to-b from-[#0a150f] via-[#07110c] to-[#040906] border border-emerald-500/25 p-4 sm:p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden w-full">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* SECTION HEADER */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <EcosystemPulseIcon />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <ActivityIcon className="w-3 h-3 text-emerald-400" />
                  <span>{t('activity_pulse_label', 'GLOBAL ECOSYSTEM PULSE')}</span>
                </span>
              </div>
              <h2
                id="ecosystem-activities-heading"
                className="text-lg sm:text-xl font-extrabold text-white tracking-tight"
              >
                {t('activity_heading', 'MDeFi Ecosystem Activities')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-semibold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE FEED</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-RPC Cache Stream</span>
            </div>
          </div>
        </div>

        {/* SINGLE LINE RUNNING MARQUEE CARD TRACK */}
        <div className="relative z-10 mt-4 overflow-hidden w-full">
          {baseItems.length === 0 ? (
            <div className="py-6 px-4 rounded-2xl bg-zinc-950/50 border border-zinc-850 flex items-center justify-center gap-3 text-xs text-zinc-400">
              <Inbox className="w-4 h-4 text-emerald-400" />
              <span>Waiting for verified ecosystem transactions. Real on-chain events stream here automatically.</span>
            </div>
          ) : (
            <div className="mdefi-ticker-viewport py-1">
              {/* Group 1 (Primary track) */}
              <div className="mdefi-ticker-group">
                {baseItems.map((item, idx) => (
                  <div
                    key={`group1-${item.id || 'tx'}-${idx}`}
                    className="flex items-center gap-3 px-3.5 py-2.5 mr-3 sm:mr-4 rounded-2xl bg-zinc-950/90 hover:bg-[#0b1710] border border-zinc-800/90 hover:border-emerald-500/50 shadow-md transition-colors shrink-0 select-none cursor-default min-w-[280px] sm:min-w-[320px]"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_#34d399]" />
                    
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate max-w-[140px]">
                          {item.title || 'Ecosystem Event'}
                        </span>
                        <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border font-mono font-semibold ${getBadgeColor(item.type)}`}>
                          {(item.type || 'EVENT').replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                        <span className="font-mono text-zinc-300">{formatMaskedMember(item.member)}</span>
                        <span>&bull;</span>
                        <span className="text-zinc-500 text-[10px]">{item.timestamp || 'Just now'}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-emerald-400 font-mono block">
                        {item.amount || 'Recorded'}
                      </span>
                      <span className="text-[9px] text-zinc-500 flex items-center justify-end gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                        <span>Confirmed</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Group 2 (Exact identical clone for 100% gapless continuous loop) */}
              <div className="mdefi-ticker-group" aria-hidden="true">
                {baseItems.map((item, idx) => (
                  <div
                    key={`group2-${item.id || 'tx'}-${idx}`}
                    className="flex items-center gap-3 px-3.5 py-2.5 mr-3 sm:mr-4 rounded-2xl bg-zinc-950/90 hover:bg-[#0b1710] border border-zinc-800/90 hover:border-emerald-500/50 shadow-md transition-colors shrink-0 select-none cursor-default min-w-[280px] sm:min-w-[320px]"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_#34d399]" />
                    
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate max-w-[140px]">
                          {item.title || 'Ecosystem Event'}
                        </span>
                        <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border font-mono font-semibold ${getBadgeColor(item.type)}`}>
                          {(item.type || 'EVENT').replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                        <span className="font-mono text-zinc-300">{formatMaskedMember(item.member)}</span>
                        <span>&bull;</span>
                        <span className="text-zinc-500 text-[10px]">{item.timestamp || 'Just now'}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-emerald-400 font-mono block">
                        {item.amount || 'Recorded'}
                      </span>
                      <span className="text-[9px] text-zinc-500 flex items-center justify-end gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                        <span>Confirmed</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};