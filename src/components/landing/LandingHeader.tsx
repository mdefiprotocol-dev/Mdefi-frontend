import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  LogIn,
  UserPlus
} from 'lucide-react';
import { MbttcCoin3D } from '../MbttcCoin3D';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../context/LanguageContext';

interface LandingHeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onLoginClick,
  onRegisterClick,
  onNavigateSection,
}) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t('nav_home', 'Home'), sectionId: 'hero' },
    { label: t('nav_ecosystem', 'Ecosystem'), sectionId: 'ecosystem' },
    { label: t('nav_community_activity', 'Community Activity'), sectionId: 'community-activity' },
    { label: t('nav_mbttc', 'MBTTC'), sectionId: 'mbttc' },
    { label: t('nav_how_it_works', 'How It Works'), sectionId: 'how-it-works' },
    { label: t('nav_roadmap', 'Roadmap'), sectionId: 'roadmap' },
    { label: t('nav_faq', 'FAQ'), sectionId: 'faq' },
  ];

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050906]/85 backdrop-blur-xl border-b border-emerald-500/20 px-3 sm:px-6 lg:px-10 py-2.5 sm:py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand Identity */}
        <div 
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0"
          title="Return to Top"
        >
          {/* Front-matched MDeFi logo icon - Razor sharp HD (No blurry wrapper) */}
          <div className="relative shrink-0 flex items-center justify-center">
            <MbttcCoin3D size="sm" interactive={false} autoRotate={true} glow={false} />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="font-extrabold text-base sm:text-xl tracking-tight text-white group-hover:text-emerald-300 transition-colors shrink-0">
              MDeFi
            </span>
            <span className="inline-flex items-center text-[9px] sm:text-[10px] font-mono uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-semibold tracking-wider shrink-0 select-none whitespace-nowrap shadow-[0_0_8px_rgba(16,185,129,0.15)]">
              {t('brand_protocol', 'Protocol')}
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-zinc-950/60 border border-emerald-500/20 backdrop-blur-md">
          {navItems.map((item) => (
            <button
              key={item.sectionId}
              onClick={() => handleNavClick(item.sectionId)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 hover:text-white hover:bg-emerald-500/10 transition-all cursor-pointer whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Authentication Actions & Language Selector */}
        <div className="hidden sm:flex items-center gap-2.5">
          <LanguageSelector align="right" />

          <button
            onClick={onLoginClick}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-emerald-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-zinc-400" />
            <span>{t('btn_login', 'LOGIN')}</span>
          </button>

          <button
            onClick={onRegisterClick}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_28px_rgba(16,185,129,0.5)] transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t('btn_register', 'REGISTER')}</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <LanguageSelector align="right" />

          <button
            onClick={onRegisterClick}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_15px_rgba(16,185,129,0.35)] cursor-pointer"
          >
            {t('btn_join', 'JOIN')}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-emerald-500/20 text-zinc-300 hover:text-white cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-3 pt-3 border-t border-zinc-800/80 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-1.5 pb-2">
            {navItems.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => handleNavClick(item.sectionId)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-emerald-300 hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/30 transition-all flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-900 border border-zinc-700 flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('btn_login', 'LOGIN')}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRegisterClick();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t('btn_register', 'REGISTER')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
