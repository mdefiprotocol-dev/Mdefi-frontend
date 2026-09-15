import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, LanguageOption, translations } from '../data/translations';

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentLanguageOption: LanguageOption;
  t: (
    key: string,
    fallbackOrParams?: string | Record<string, string | number>,
    params?: Record<string, string | number>
  ) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'mdefi_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGUAGES.some((opt) => opt.code === stored)) {
        return stored as SupportedLanguage;
      }
    } catch {
      // Fallback on storage errors
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    if (!SUPPORTED_LANGUAGES.some((opt) => opt.code === lang)) return;
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      window.dispatchEvent(new CustomEvent('mdefi_language_changed', { detail: lang }));
    } catch {
      // Ignore storage write errors
    }
  };

  useEffect(() => {
    // Keep html lang attribute synchronized
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && SUPPORTED_LANGUAGES.some((opt) => opt.code === e.newValue)) {
        setLanguageState(e.newValue as SupportedLanguage);
      }
    };
    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<SupportedLanguage>;
      if (customEvent.detail && SUPPORTED_LANGUAGES.some((opt) => opt.code === customEvent.detail)) {
        setLanguageState(customEvent.detail);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('mdefi_language_changed', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('mdefi_language_changed', handleCustom);
    };
  }, []);

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((opt) => opt.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (
    key: string,
    fallbackOrParams?: string | Record<string, string | number>,
    params?: Record<string, string | number>
  ): string => {
    let fallback: string | undefined;
    let actualParams: Record<string, string | number> | undefined;

    if (typeof fallbackOrParams === 'string') {
      fallback = fallbackOrParams;
      actualParams = params;
    } else if (typeof fallbackOrParams === 'object' && fallbackOrParams !== null) {
      actualParams = fallbackOrParams;
      fallback = undefined;
    } else {
      fallback = undefined;
      actualParams = params;
    }

    const langDict = translations[language];
    let result =
      (langDict && langDict[key]) ||
      (translations.en && translations.en[key]) ||
      (fallback !== undefined ? fallback : key);

    if (actualParams && typeof result === 'string') {
      Object.entries(actualParams).forEach(([k, v]) => {
        const strVal = String(v ?? '');
        // Replace standard {param}
        result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), strVal);
        // Replace ${param}
        result = result.replace(new RegExp(`\\$\\{${k}\\}`, 'g'), strVal);

        // Aliases and compound parameter mappings
        if (k === 'phase' || k === 'minPhase') {
          result = result.replace(/\$\{mod\.minPhase\}/g, strVal);
          result = result.replace(/\{mod\.minPhase\}/g, strVal);
          result = result.replace(/\$\{phase\}/g, strVal);
        }
        if (k === 'count' || k === 'active') {
          result = result.replace(/\{active\}/g, strVal);
        }
        if (k === 'level') {
          result = result.replace(/\{level\}/g, strVal);
        }
        if (k === 'target') {
          result = result.replace(/\{target\}/g, strVal);
        }
        if (k === 'amount') {
          result = result.replace(/\{amount\}/g, strVal);
        }
      });
    }

    // Safety fallback: if string still contains an unresolved phase placeholder,
    // and a fallback string contains an evaluated phase number (e.g. 'Phase 2' or 'PHASE 3'),
    // resolve it automatically
    if (typeof result === 'string' && (result.includes('{phase}') || result.includes('${mod.minPhase}') || result.includes('{mod.minPhase}'))) {
      if (fallback) {
        const match = fallback.match(/phase\s*(\d+)/i);
        if (match && match[1]) {
          const phaseNum = match[1];
          result = result
            .replace(/\{phase\}/g, phaseNum)
            .replace(/\$\{mod\.minPhase\}/g, phaseNum)
            .replace(/\{mod\.minPhase\}/g, phaseNum)
            .replace(/\$\{phase\}/g, phaseNum);
        }
      }
    }

    return result || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLanguageOption,
        t,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
