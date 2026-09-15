export type DashboardTheme = 
  | 'emerald-protocol'
  | 'ocean-blue'
  | 'royal-purple'
  | 'amber-gold'
  | 'cyber-cyan'
  | 'midnight-silver'
  | 'light-emerald'
  | 'diamond-pink'
  | 'golden-red';

export interface ThemeInfo {
  id: DashboardTheme;
  name: string;
  subtitle: string;
  category: 'dark' | 'light';
  accentColor: string;      // Main accent hex
  secondaryColor: string;   // Secondary accent hex
  bgColor: string;          // Main background hex
  cardBgColor: string;      // Card surface hex
  borderColor: string;      // Border hex
  tag: string;              // Short badge text
}

export const DASHBOARD_THEMES: ThemeInfo[] = [
  {
    id: 'emerald-protocol',
    name: 'Emerald Protocol',
    subtitle: 'Signature MDeFi green theme with cyber-emerald accents',
    category: 'dark',
    accentColor: '#10b981',
    secondaryColor: '#34d399',
    bgColor: '#080c09',
    cardBgColor: '#0c130e',
    borderColor: '#10b9814d',
    tag: 'Default',
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    subtitle: 'Deep oceanic navy with vivid royal blue and sky cyan',
    category: 'dark',
    accentColor: '#0ea5e9',
    secondaryColor: '#38bdf8',
    bgColor: '#050a14',
    cardBgColor: '#081324',
    borderColor: '#0ea5e94d',
    tag: 'Deep Blue',
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    subtitle: 'Imperial obsidian canvas with rich amethyst and violet',
    category: 'dark',
    accentColor: '#a855f7',
    secondaryColor: '#c084fc',
    bgColor: '#090412',
    cardBgColor: '#130a21',
    borderColor: '#a855f74d',
    tag: 'Amethyst',
  },
  {
    id: 'amber-gold',
    name: 'Amber Gold',
    subtitle: 'Luxe obsidian basalt with champagne gold and warm amber',
    category: 'dark',
    accentColor: '#f59e0b',
    secondaryColor: '#fbbf24',
    bgColor: '#0a0805',
    cardBgColor: '#141009',
    borderColor: '#f59e0b4d',
    tag: 'Prestige',
  },
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan',
    subtitle: 'Futuristic high-tech navy with glowing cyber-cyan highlights',
    category: 'dark',
    accentColor: '#06b6d4',
    secondaryColor: '#22d3ee',
    bgColor: '#03080e',
    cardBgColor: '#08131d',
    borderColor: '#06b6d44d',
    tag: 'Sci-Fi',
  },
  {
    id: 'midnight-silver',
    name: 'Midnight Silver',
    subtitle: 'Softer graphite charcoal with sleek brushed titanium silver',
    category: 'dark',
    accentColor: '#94a3b8',
    secondaryColor: '#cbd5e1',
    bgColor: '#0a0b0e',
    cardBgColor: '#14171d',
    borderColor: '#94a3b84d',
    tag: 'Titanium',
  },
  {
    id: 'light-emerald',
    name: 'Light Emerald',
    subtitle: 'Clean executive light canvas with rich forest emerald',
    category: 'light',
    accentColor: '#059669',
    secondaryColor: '#10b981',
    bgColor: '#f4f6f4',
    cardBgColor: '#ffffff',
    borderColor: '#05966940',
    tag: 'Executive',
  },
  {
    id: 'diamond-pink',
    name: 'Diamond Pink',
    subtitle: 'High-luxury obsidian canvas with glittering diamond rose & vivid pink',
    category: 'dark',
    accentColor: '#ec4899',
    secondaryColor: '#f472b6',
    bgColor: '#0d0509',
    cardBgColor: '#160a12',
    borderColor: '#ec48994d',
    tag: 'Diamond',
  },
  {
    id: 'golden-red',
    name: 'Golden Red',
    subtitle: 'Imperial majesty with deep ruby crimson and radiant auric gold',
    category: 'dark',
    accentColor: '#e11d48',
    secondaryColor: '#f59e0b',
    bgColor: '#0d0405',
    cardBgColor: '#180809',
    borderColor: '#e11d484d',
    tag: 'Imperial',
  },
];

export const DEFAULT_THEME: DashboardTheme = 'emerald-protocol';
const THEME_STORAGE_KEY = 'mdefi_dashboard_theme';

/**
 * Gets the current active theme from localStorage or returns the default
 */
export function getSavedDashboardTheme(): DashboardTheme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as DashboardTheme;
    if (saved && DASHBOARD_THEMES.some(t => t.id === saved)) {
      return saved;
    }
  } catch {}
  return DEFAULT_THEME;
}

/**
 * Applies a theme to document.documentElement and persists it in localStorage
 */
export function applyDashboardTheme(theme: DashboardTheme): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Dispatch custom event so any reactive components immediately re-render
    window.dispatchEvent(new CustomEvent('mdefi-theme-changed', { detail: { theme } }));
  } catch (e) {
    console.error('Failed to apply dashboard theme:', e);
  }
}

/**
 * Initializes theme on app startup
 */
export function initDashboardTheme(): DashboardTheme {
  const current = getSavedDashboardTheme();
  applyDashboardTheme(current);
  return current;
}
