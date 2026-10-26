import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.mdefi.app',
  appName: 'MDeFi Network',
  webDir: 'dist',
  server: {
    url: 'https://mdefipro.xyz',
    cleartext: false
  }
};

export default config;