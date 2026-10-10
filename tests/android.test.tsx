// @vitest-environment jsdom
import React from 'react';
import { Blob as NodeBlob } from 'node:buffer';
import { it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
const native = vi.hoisted(() => ({ enabled: true, post: vi.fn(), write: vi.fn(), uri: vi.fn(), share: vi.fn(), rmdir: vi.fn(), open: vi.fn(), external: vi.fn(), remove: vi.fn() }));
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => native.enabled }, CapacitorHttp: { post: native.post }, registerPlugin: () => ({ open: native.external }) }));
vi.mock('@capacitor/filesystem', () => ({ Directory: { Cache: 'CACHE' }, Filesystem: { writeFile: native.write, getUri: native.uri, rmdir: native.rmdir } }));
vi.mock('@capacitor/share', () => ({ Share: { share: native.share } }));
vi.mock('@capacitor/browser', () => ({ Browser: { open: native.open } }));
vi.mock('@capacitor/network', () => ({ Network: { getStatus: async () => ({ connected: true }), addListener: async () => ({ remove: native.remove }) } }));
import { centralDogmaEndpoint, safeFileName, clearHubStorage, nativeJSONRequest } from '../src/native/platform';
import { downloadReport } from '../src/native/download';
import { clearExportCache, installNativeLinks } from '../src/native/runtime';
import { PrivacyPage } from '../src/native/PrivacyPage';
import { NativeChrome } from '../src/native/NativeChrome';
beforeEach(() => { vi.clearAllMocks(); vi.stubGlobal('Blob', NodeBlob); native.open.mockResolvedValue(undefined); native.external.mockResolvedValue(undefined); native.enabled = true; localStorage.clear(); sessionStorage.clear(); native.uri.mockResolvedValue({ uri: 'file:///cache/exports/report.xlsx' }); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it('uses a same-origin web endpoint and a credential-free HTTPS native endpoint', () => {
  expect(centralDogmaEndpoint('/project/', false)).toBe('/project/.netlify/functions/central-dogma');
  expect(centralDogmaEndpoint('/', true)).toMatch(/^https:\/\/capable-fairy-/);
  expect(() => centralDogmaEndpoint('/', true, 'http://example.org/api')).toThrow(/HTTPS/);
  expect(() => centralDogmaEndpoint('/', true, 'https://secret@example.org/api')).toThrow(/credentials/);
});
it('sends native JSON with timeouts and no browser origin or embedded keys', async () => {
  native.post.mockResolvedValue({ status: 429, data: { error: 'Wait', retryAfter: 60 } });
  const r = await nativeJSONRequest('https://example.test/api', { action: 'poll', rid: 'TEST' });
  expect(r.ok).toBe(false); expect(r.status).toBe(429); expect(JSON.parse(await r.text()).retryAfter).toBe(60);
  expect(native.post).toHaveBeenCalledWith(expect.objectContaining({ headers: { 'Content-Type': 'application/json' }, data: { action: 'poll', rid: 'TEST' }, readTimeout: 45000 }));
});
it('shares original binary export bytes through cache URI without creating a browser download', async () => {
  const blob = new Blob([Uint8Array.from([0, 255, 13, 10])]);
  await downloadReport('../../report.xlsx', blob);
  const args = native.write.mock.calls[0][0];
  expect(args.directory).toBe('CACHE'); expect(args.path).toMatch(/^exports\//); expect(args.path).not.toContain('../');
  expect([...atob(args.data)].map(x => x.charCodeAt(0))).toEqual([0, 255, 13, 10]);
  expect(native.share).toHaveBeenCalledWith(expect.objectContaining({ files: ['file:///cache/exports/report.xlsx'] }));
});
it('does not silently succeed when sharing or saving fails', async () => {
  native.share.mockRejectedValueOnce(new Error('No share target'));
  const blob = new Blob([]);
  await expect(downloadReport('report.txt', blob)).rejects.toThrow('No share target');
});
it('rejects oversized exports before writing cache files', async () => {
  await expect(downloadReport('huge.fasta', new Blob([new Uint8Array(50_000_001)]))).rejects.toThrow('50 MB');
  expect(native.write).not.toHaveBeenCalled();
});
it('preserves unrelated storage and clears all owned local and analysis keys', () => {
  localStorage.setItem('arif_bio_notes', 'note'); localStorage.setItem('unrelated', 'keep');
  sessionStorage.setItem('central_dogma_v1', 'state'); sessionStorage.setItem('unrelated', 'keep');
  clearHubStorage(localStorage, sessionStorage);
  expect(localStorage.getItem('arif_bio_notes')).toBeNull(); expect(sessionStorage.getItem('central_dogma_v1')).toBeNull();
  expect(localStorage.getItem('unrelated')).toBe('keep'); expect(sessionStorage.getItem('unrelated')).toBe('keep');
  expect(safeFileName('../bad/name.xlsx')).toBe('_bad_name.xlsx');
});
it('only suppresses missing export directories when clearing cache', async () => {
  native.rmdir.mockRejectedValueOnce(new Error('Folder does not exist')); await clearExportCache();
  native.rmdir.mockRejectedValueOnce(new Error('Permission denied')); await expect(clearExportCache()).rejects.toThrow('Permission denied');
});
it('requires a separate confirmation and supports cancel before deleting local data', async () => {
  const user = userEvent.setup(); localStorage.setItem('arif_bio_notes', 'keep'); render(<PrivacyPage />);
  expect(screen.queryByRole('button', { name: 'Confirm clear local app data' })).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Clear app data on this device' }));
  expect(screen.getByRole('button', { name: 'Confirm clear local app data' })).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Cancel' })); expect(localStorage.getItem('arif_bio_notes')).toBe('keep'); expect(native.rmdir).not.toHaveBeenCalled();
});
it('opens external HTTPS in the native browser and telephone links in the restricted plugin', () => {
  const dispose = installNativeLinks();
  const external = document.createElement('a'); external.href = 'https://www.ncbi.nlm.nih.gov/protein/TEST'; document.body.appendChild(external); external.click();
  const phone = document.createElement('a'); phone.href = 'tel:+923433519195'; document.body.appendChild(phone); phone.click();
  expect(native.open).toHaveBeenCalledWith({ url: external.href }); expect(native.external).toHaveBeenCalledWith({ url: phone.href });
  dispose(); external.remove(); phone.remove();
});
it('navigates Android tabs using the existing app route identifiers', async () => {
  const navigate = vi.fn(), user = userEvent.setup(); const view = render(<NativeChrome activeTab="central-dogma" navigate={navigate} />);
  expect(screen.getByRole('button', { name: 'Dogma' }).getAttribute('aria-current')).toBe('page');
  await user.click(screen.getByRole('button', { name: 'Learn' })); expect(navigate).toHaveBeenCalledWith('learning');
  await user.click(screen.getByRole('button', { name: 'Tools' })); expect(navigate).toHaveBeenCalledWith('software');
  view.unmount(); await Promise.resolve(); expect(native.remove).toHaveBeenCalledOnce();
});
