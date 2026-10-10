import { isNativeApp, centralDogmaEndpoint, nativeJSONRequest } from '../../native/platform';
const endpoint = centralDogmaEndpoint(import.meta.env.BASE_URL, isNativeApp(), import.meta.env.VITE_CENTRAL_DOGMA_API);

export async function explorerAPI(input: Record<string, unknown>, onWait?: (message: string) => void): Promise<any> {
  for (let attempt = 0; attempt < 8; attempt++) {
    let response: { ok: boolean; status: number; text: () => Promise<string> };
    try {
      response = isNativeApp() ? await nativeJSONRequest(endpoint, input) : await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input), signal: AbortSignal.timeout(45000) });
    } catch {
      throw new Error(input.action === 'submit' ? 'Submission was not confirmed. It may exist remotely; do not immediately resubmit.' : 'The backend could not be reached. Your existing results are retained.');
    }
    const text = await response.text();
    let data: any;
    try { data = JSON.parse(text); } catch { throw new Error('Live analysis requires the Netlify backend. This deployment returned a page instead of an API response. The offline demonstration remains available.'); }
    if (response.ok) return data;
    if (response.status === 429 && data.retryAfter && Number(data.retryAfter) <= 65 && !data.submissionUnknown) {
      const seconds = Math.min(65, Number(data.retryAfter) + 1);
      onWait?.(`Respecting NCBI request limits. Continuing in ${seconds} second(s)…`);
      await new Promise(resolve => setTimeout(resolve, seconds * 1000));
      continue;
    }
    throw new Error(data.error || `Explorer request failed (HTTP ${response.status}).`);
  }
  throw new Error('The shared service is busy. Keep your request IDs and try again later.');
}
