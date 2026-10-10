import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.arifuddin.biohub',
  appName: 'Arif Bio Hub',
  webDir: 'dist_android',
  android: { allowMixedContent: false, webContentsDebuggingEnabled: false },
  plugins: { SystemBars: { insetsHandling: 'native', style: 'LIGHT' } },
  server: { androidScheme: 'https', hostname: 'localhost' },
};
export default config;
