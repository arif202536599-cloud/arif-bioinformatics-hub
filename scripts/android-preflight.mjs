import { readFile } from 'node:fs/promises';
const config = await readFile(new URL('../capacitor.config.ts', import.meta.url), 'utf8');
if (/server\s*:\s*{[^}]*url\s*:/s.test(config)) throw new Error('Android must bundle the app, not load a remote website.');
const endpoint = process.env.VITE_CENTRAL_DOGMA_API || 'https://capable-fairy-dd36f0.netlify.app/.netlify/functions/central-dogma';
const url = new URL(endpoint);
if (url.protocol !== 'https:' || url.username || url.password) throw new Error('A credential-free HTTPS backend is required.');
try {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Backend is not ready (HTTP ${response.status}).`);
  const data = await response.json();
  if (!response.ok || data.available !== true || data.version !== 'central-dogma-1') throw new Error(`Backend is not ready (HTTP ${response.status}).`);
  const privacyURL = process.env.BIOHUB_PRIVACY_URL || `${url.origin}/privacy-policy.html`;
  const privacy = await fetch(privacyURL, { signal: AbortSignal.timeout(20000) });
  const policy = await privacy.text();
  if (!privacy.ok || !policy.includes('Arif Bio Hub') || !policy.includes('Privacy policy')) throw new Error('Public app privacy policy is not deployed.');
  console.log('Backend health and public privacy policy passed. Still verify live searches, phone behaviour, signing and Play Console disclosures before release.');
} catch (error) {
  console.error(`Release readiness failed: ${error.message} Deploy the Netlify backend and privacy page before publishing the full online app. Offline learning and the synthetic demo can still be tested.`);
  process.exitCode = 1;
}
