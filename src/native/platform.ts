import { Capacitor, CapacitorHttp } from '@capacitor/core';
export const isAndroidBuild = import.meta.env.VITE_BUILD_TARGET === 'android';
export const isNativeApp = () => Capacitor.isNativePlatform();
export function centralDogmaEndpoint(base: string, native: boolean, configured?: string) {
  if (!native) return `${base}.netlify/functions/central-dogma`;
  const url = new URL(configured || 'https://capable-fairy-dd36f0.netlify.app/.netlify/functions/central-dogma');
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('The Android analysis backend must use HTTPS without embedded credentials.');
  return url.toString();
}
export async function nativeJSONRequest(url: string, input: Record<string, unknown>) {
  const result = await CapacitorHttp.post({ url, headers: { 'Content-Type': 'application/json' }, data: input,
    connectTimeout: 20000, readTimeout: 45000, responseType: 'text' });
  return { ok: result.status >= 200 && result.status < 300, status: result.status, text: async () => typeof result.data === 'string' ? result.data : JSON.stringify(result.data) };
}
export function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/^\.+/, '').slice(-160) || 'biohub_export.txt';
}
export function clearHubStorage(local: Storage, session: Storage) {
  for (const storage of [local, session]) {
    for (let i = storage.length - 1; i >= 0; i--) {
      const key = storage.key(i);
      if (key && (key.startsWith('arif_bio_') || key.startsWith('central_dogma_'))) storage.removeItem(key);
    }
  }
}
