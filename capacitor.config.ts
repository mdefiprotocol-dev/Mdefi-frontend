import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.mdefi.app',
  appName: 'MDeFi Network',
  webDir: 'dist',
  server: {
    url: 'https://mdefipro.xyz',
    cleartext: true,
    androidScheme: 'https',
    allowNavigation: [
      'mdefipro.xyz',
      '*.mdefipro.xyz',
      '*.walletconnect.com',
      '*.walletconnect.org',
      '*.binance.org',
      'bsc-dataseed.binance.org',
      'data-seed-prebsc-1-s1.binance.org'
    ]
  }
};

export default config;