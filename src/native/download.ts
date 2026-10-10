import { isNativeApp } from './platform';
import { shareExport, nativeNotice } from './runtime';
export async function downloadReport(name: string, contents: Blob | string, mime = 'text/plain') {
  const blob = contents instanceof Blob ? contents : new Blob([contents], { type: mime });
  if (isNativeApp()) { await shareExport(name, blob); return; }
  const url = URL.createObjectURL(blob), anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; document.body.appendChild(anchor);
  anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export function exportReport(name: string, contents: Blob | string, mime = 'text/plain') {
  void downloadReport(name, contents, mime).catch(e => nativeNotice(`Export not completed: ${e.message}`));
}
