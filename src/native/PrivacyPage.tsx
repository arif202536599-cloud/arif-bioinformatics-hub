import { useState } from 'react';
import { clearHubStorage, isNativeApp } from './platform';
import { clearExportCache } from './runtime';
export function PrivacyPage() {
  const [confirm, setConfirm] = useState(false), [error, setError] = useState('');
  async function clearData() {
    try { if (isNativeApp()) await clearExportCache(); clearHubStorage(localStorage, sessionStorage); window.location.reload(); }
    catch (e) { setError(`Data clearing was not completed: ${(e as Error).message}`); }
  }
  return <section className="native-privacy"><h1>Privacy & app storage</h1><p>Arif Bio Hub · Arif Uddin · policy version 1 · 10 October 2026</p>
    <h2>Data on your device</h2><p>Learning progress, bookmarks, quizzes, research notes, local contact-directory entries and your current analysis are stored on this device. The Android version uses guest mode and does not create online accounts. Contact forms in the local directory do not send a subscription request.</p>
    <h2>Online analysis and external services</h2><p>When you confirm and submit a Central Dogma search, your selected protein sequence goes through the configured Netlify backend to NCBI BLAST. Results and reference records are cached by that backend. NCBI and Netlify may process technical request information such as IP addresses and request metadata. Protein analyses are reference evidence and are not medical diagnosis.</p>
    <p>Cached records have a seven-day reuse window; stored entries are not automatically deleted. Clearing this app does not delete backend records or NCBI requests. For backend deletion requests, contact the developer with the relevant request IDs. NCBI controls its own service records. Do not submit confidential or patient-identifiable sequences to the public service.</p>
    <h2>Exports and links</h2><p>Reports are written to this app’s cache and shared through Android’s chooser only when you choose to export. You select the recipient or save destination. A separately saved/shared copy remains outside this app. External database and video links open in your browser and follow those services’ privacy policies.</p>
    <h2>Permissions and tracking</h2><p>The Android app uses internet and network-state access. It does not request camera, microphone, location, contacts, broad storage or advertising-ID access. No advertising or analytics SDK is included. The app does not read your phone’s contacts; its local directory contains entries you type and sample entries.</p>
    <h2>Contact and deletion</h2><p><a href="mailto:fivupw005@gmail.com">fivupw005@gmail.com</a> · <a href="tel:+923433519195">+92 343 3519195</a>. Uninstalling removes the app’s local data and cache. Exported copies must be removed from their destination separately.</p>
    <button className="cd-secondary" onClick={() => setConfirm(true)}>Clear app data on this device</button>
    {confirm && <div className="cd-note"><p>This removes this app’s progress, notes, directory entries, analysis state and cached exports. It cannot be undone and does not remove remote requests or separately saved files.</p><button className="cd-primary" onClick={clearData}>Confirm clear local app data</button> <button className="cd-secondary" onClick={() => setConfirm(false)}>Cancel</button></div>}
    {error && <p role="alert">{error}</p>}
  </section>;
}
