import React from 'react';
import { 
  Users, 
  Send, 
  Twitter, 
  MessageCircle, 
  ArrowRight, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Youtube
} from 'lucide-react';
import { MbttcCoin3D } from '../MbttcCoin3D';

interface SocialCommunityModalProps {
  onEnterDashboard: () => void;
}

export const SocialCommunityModal: React.FC<SocialCommunityModalProps> = ({
  onEnterDashboard,
}) => {
  const channels = [
    {
      name: 'Telegram Official',
      desc: 'Real-time protocol announcements, node discussions, and community support.',
      url: 'https://t.me',
      icon: Send,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40 hover:border-cyan-400',
    },
    {
      name: 'X (Twitter)',
      desc: 'Official ecosystem dispatches, partnership broadcasts, and developer updates.',
      url: 'https://x.com',
      icon: Twitter,
      color: 'text-blue-400 border-blue-500/30 bg-blue-950/40 hover:border-blue-400',
    },
    {
      name: 'YouTube Channel',
      desc: 'Official video guides, matrix tutorials, and weekly ecosystem reviews.',
      url: 'https://youtube.com',
      icon: Youtube,
      color: 'text-rose-400 border-rose-500/30 bg-rose-950/40 hover:border-rose-400',
    },
    {
      name: 'WhatsApp Community',
      desc: 'Direct global builder network, reward alerts, and regional leadership.',
      url: 'https://whatsapp.com',
      icon: MessageCircle,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40 hover:border-emerald-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#081810] via-[#05110a] to-[#030906] border-2 border-emerald-500/40 shadow-[0_0_70px_rgba(16,185,129,0.3)] space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <MbttcCoin3D size="md" interactive={false} autoRotate={true} glow={true} />
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight">
            JOIN OUR COMMUNITY
          </h3>
          <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
            Stay connected with MDeFi ecosystem updates, node launches, reward distributions, and community events.
          </p>
        </div>

        {/* Channels List */}
        <div className="space-y-2.5">
          {channels.map((ch, idx) => {
            const Icon = ch.icon;
            return (
              <a
                key={idx}
                href={ch.url}
                target="_blank"
                rel="noreferrer"
                className={`p-3.5 rounded-2xl border ${ch.color} flex items-center justify-between transition-all group hover:scale-[1.01] block cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-zinc-950 border border-white/10 shadow-inner">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {ch.name}
                    </h4>
                    <span className="text-[11px] text-zinc-400 line-clamp-1">
                      {ch.desc}
                    </span>
                  </div>
                </div>

                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white shrink-0 ml-2" />
              </a>
            );
          })}
        </div>

        {/* Final Dashboard Entry Action */}
        <div className="pt-2">
          <button
            onClick={onEnterDashboard}
            className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>CONTINUE TO DASHBOARD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center text-[10px] font-mono text-zinc-500">
          Entering verified MDeFi Hub Web3 ecosystem
        </div>
      </div>
    </div>
  );
};
