import { Browser } from '@capacitor/browser';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { registerPlugin } from '@capacitor/core';
import { isNativeApp, safeFileName } from './platform';
const ExternalLinks = registerPlugin<{ open(options: { url: string }): Promise<void> }>('ExternalLinks');
export const nativeNotice = (message: string) => window.dispatchEvent(new CustomEvent('biohub-native-notice', { detail: message }));
export async function shareExport(name: string, blob: Blob) {
  if (blob.size > 50_000_000) throw new Error('This export exceeds the 50 MB mobile limit. Export fewer selections or use the desktop app.');
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let i = 0; i < bytes.length; i += 32768) binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
  const path = `exports/${Date.now()}-${crypto.randomUUID()}-${safeFileName(name)}`;
  await Filesystem.writeFile({ directory: Directory.Cache, path, data: btoa(binary), recursive: true });
  const { uri } = await Filesystem.getUri({ directory: Directory.Cache, path });
  await Share.share({ title: 'Arif Bio Hub export', files: [uri], dialogTitle: 'Save or share your report' });
}
export async function clearExportCache() {
  try { await Filesystem.rmdir({ directory: Directory.Cache, path: 'exports', recursive: true }); }
  catch (error) {
    // Only ignore a directory that is already absent; other failures remain visible.
    if (!/not exist|not found|ENOENT/i.test(String((error as Error).message))) throw error;
  }
}
export function installNativeLinks() {
  if (!isNativeApp()) return () => {};
  const activate = (event: MouseEvent) => {
    const anchor = (event.target as Element)?.closest?.('a') as HTMLAnchorElement | null;
    if (!anchor) return;
    const href = anchor.href;
    if (anchor.hasAttribute('download') && /^(blob:|data:)/.test(href)) {
      event.preventDefault();
      void fetch(href).then(r => r.blob()).then(blob => shareExport(anchor.download, blob)).catch(e => nativeNotice(`Export not completed: ${e.message}`));
    } else if (/^https?:/.test(href) && new URL(href).origin !== window.location.origin) {
      event.preventDefault(); void Browser.open({ url: href }).catch(e => nativeNotice(`Link could not open: ${e.message}`));
    } else if (/^(mailto:|tel:)/.test(href)) {
      event.preventDefault(); void ExternalLinks.open({ url: href }).catch(e => nativeNotice(e.message));
    }
  };
  document.addEventListener('click', activate, true);
  return () => document.removeEventListener('click', activate, true);
}
