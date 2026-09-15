import React from 'react';
import {
  Calendar,
  Users,
  PieChart,
  Coins,
  DollarSign,
  Share2,
  Wallet,
  Flame,
  Crown,
  Zap,
  Layers,
  ArrowDownRight,
  TrendingUp,
  Sparkles,
  CircleDot
} from 'lucide-react';

export type WeeklyRewardIconType =
  | 'calendar'
  | 'team'
  | 'share'
  | 'pool'
  | 'usdt'
  | 'distribution'
  | 'wallet'
  | 'fee-burn'
  | 'crown'
  | 'quantum-node'
  | 'usdt-pool'
  | 'share-multiplier'
  | 'ecosystem';

interface WeeklyRewardAnimatedIconProps {
  type: WeeklyRewardIconType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'emerald' | 'amber' | 'purple' | 'cyan';
  className?: string;
}

export const WeeklyRewardAnimatedIcon: React.FC<WeeklyRewardAnimatedIconProps> = ({
  type,
  size = 'md',
  theme = 'emerald',
  className = '',
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { box: 'w-9 h-9', icon: 'w-4 h-4', p: 'p-1.5' };
      case 'lg':
        return { box: 'w-16 h-16', icon: 'w-8 h-8', p: 'p-3' };
      case 'xl':
        return { box: 'w-20 h-20', icon: 'w-10 h-10', p: 'p-4' };
      default:
        return { box: 'w-12 h-12', icon: 'w-6 h-6', p: 'p-2.5' };
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'amber':
        return {
          bg: 'from-amber-950/80 via-[#261d06] to-[#120e02]',
          border: 'border-amber-500/40',
          glow: 'bg-amber-400/25',
          ring: 'border-amber-400/30',
          iconColor: 'text-amber-400',
        };
      case 'purple':
        return {
          bg: 'from-purple-950/80 via-[#250d32] to-[#100317]',
          border: 'border-purple-500/40',
          glow: 'bg-purple-400/25',
          ring: 'border-purple-400/30',
          iconColor: 'text-purple-400',
        };
      case 'cyan':
        return {
          bg: 'from-cyan-950/80 via-[#062428] to-[#021114]',
          border: 'border-cyan-500/40',
          glow: 'bg-cyan-400/25',
          ring: 'border-cyan-400/30',
          iconColor: 'text-cyan-400',
        };
      default:
        return {
          bg: 'from-emerald-950/80 via-[#062016] to-[#02100a]',
          border: 'border-emerald-500/40',
          glow: 'bg-emerald-400/25',
          ring: 'border-emerald-400/30',
          iconColor: 'text-emerald-400',
        };
    }
  };

  const { box, icon, p } = getDimensions();
  const st = getThemeStyles();

  const renderIconGlyph = () => {
    switch (type) {
      case 'calendar':
        return <Calendar className={`${icon} ${st.iconColor}`} />;
      case 'team':
        return <Users className={`${icon} ${st.iconColor}`} />;
      case 'share':
        return <Share2 className={`${icon} ${st.iconColor}`} />;
      case 'pool':
      case 'usdt-pool':
        return <Coins className={`${icon} ${st.iconColor}`} />;
      case 'usdt':
        return <DollarSign className={`${icon} ${st.iconColor}`} />;
      case 'distribution':
        return <PieChart className={`${icon} ${st.iconColor}`} />;
      case 'wallet':
        return <Wallet className={`${icon} ${st.iconColor}`} />;
      case 'fee-burn':
        return <Flame className={`${icon} text-orange-400`} />;
      case 'crown':
        return <Crown className={`${icon} text-amber-400`} />;
      case 'quantum-node':
        return <Zap className={`${icon} text-cyan-400`} />;
      case 'share-multiplier':
        return <TrendingUp className={`${icon} ${st.iconColor}`} />;
      case 'ecosystem':
        return <Layers className={`${icon} ${st.iconColor}`} />;
      default:
        return <Sparkles className={`${icon} ${st.iconColor}`} />;
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Subtle outer rotating ring */}
      <div
        className={`absolute -inset-1 rounded-2xl border border-dashed ${st.ring} animate-[spin_20s_linear_infinite] motion-reduce:animate-none opacity-50`}
      />

      {/* Ambient soft glow */}
      <div
        className={`absolute inset-0 rounded-2xl blur-lg ${st.glow} opacity-60 animate-pulse motion-reduce:animate-none`}
      />

      {/* Icon Capsule */}
      <div
        className={`relative z-10 ${box} ${p} rounded-2xl bg-gradient-to-br ${st.bg} border ${st.border} shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex items-center justify-center backdrop-blur-xl group-hover:scale-105 transition-transform duration-300`}
      >
        {renderIconGlyph()}

        {/* Mini status beacon in corner */}
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white/80 animate-ping motion-reduce:animate-none opacity-70" />
      </div>
    </div>
  );
};
