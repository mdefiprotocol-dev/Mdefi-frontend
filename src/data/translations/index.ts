import { SupportedLanguage, SUPPORTED_LANGUAGES } from './types';
import { en } from './en';
import { bn } from './bn';
import { zh } from './zh';
import { ru } from './ru';
import { fr } from './fr';
import { de } from './de';
import { es } from './es';
import { hi } from './hi';
import { id } from './id';
import { it } from './it';
import { ja } from './ja';
import { ko } from './ko';
import { pt } from './pt';
import { tr } from './tr';
import { vi } from './vi';
import { nl } from './nl';
import { pl } from './pl';
import { uk } from './uk';
import { ro } from './ro';
import { tl } from './tl';
import { kk } from './kk';
import { lt } from './lt';

export * from './types';

const rawPacks: Record<SupportedLanguage, Record<string, string>> = {
  en,
  bn,
  zh,
  ru,
  fr,
  de,
  es,
  hi,
  id,
  it,
  ja,
  ko,
  pt,
  tr,
  vi,
  nl,
  pl,
  uk,
  ro,
  tl,
  kk,
  lt,
};

// Build robust packs where every language pack inherits all base keys from en, ensuring zero missing keys
export const TRANSLATION_PACKS: Record<SupportedLanguage, Record<string, string>> = (
  Object.keys(rawPacks) as SupportedLanguage[]
).reduce((acc, code) => {
  acc[code] = { ...en, ...rawPacks[code] };
  return acc;
}, {} as Record<SupportedLanguage, Record<string, string>>);

export const translations = TRANSLATION_PACKS;

/**
 * Translates a key for a given language.
 * Falls back to English if the translation is missing or language not found.
 */
export function translate(language: SupportedLanguage, key: string): string {
  const pack = TRANSLATION_PACKS[language] || TRANSLATION_PACKS.en;
  if (pack && pack[key] !== undefined && pack[key] !== '') {
    return pack[key];
  }
  // English fallback
  return TRANSLATION_PACKS.en[key] ?? key;
}
