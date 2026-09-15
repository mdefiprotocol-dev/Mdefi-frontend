import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguage } from '../../data/translations';

interface LanguageSelectorProps {
  align?: 'left' | 'right';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  align = 'right',
  className = '',
}) => {
  const { language, setLanguage, currentLanguageOption, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-emerald-500/25 hover:border-emerald-400/50 text-xs font-mono text-zinc-200 hover:text-white transition-all shadow-[0_0_12px_rgba(16,185,129,0.08)] cursor-pointer select-none group"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select Language"
        title="Select Language"
      >
        <span className="text-sm leading-none" role="img" aria-label={currentLanguageOption.name}>
          {currentLanguageOption.flag}
        </span>
        <span className="font-bold tracking-wider uppercase text-zinc-200 group-hover:text-emerald-300 text-[11px] sm:text-xs transition-colors">
          {language.toUpperCase()}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-64 max-h-96 flex flex-col rounded-2xl bg-[#090e0b]/98 border border-emerald-500/30 p-2 shadow-[0_12px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(16,185,129,0.12)] backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150`}
          role="menu"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-2.5 py-2 border-b border-zinc-800/80 mb-1 text-zinc-400 shrink-0">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 font-mono">
                {t('select_language', 'Select Language')}
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
              {languages.length}
            </span>
          </div>

          {/* Supported Languages Scrollable List */}
          <div className="space-y-0.5 overflow-y-auto pr-1 max-h-80 custom-scrollbar">
            {languages.map((lang) => {
              const isActive = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/80 border border-transparent font-medium'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base leading-none shrink-0" role="img" aria-label={lang.name}>
                      {lang.flag}
                    </span>
                    <div className="flex flex-col text-left truncate">
                      <span className="text-xs text-zinc-100 truncate">{lang.nativeName}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{lang.name}</span>
                    </div>
                  </div>

                  {isActive && (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-in fade-in ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
