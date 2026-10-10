import { getStore } from '@netlify/blobs';
import { createService, APIError } from '../../server/central-dogma.mjs';

export default async function handler(request) {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  try {
    if (!['GET', 'POST'].includes(request.method)) return new Response(JSON.stringify({ error: 'Use GET or POST.' }), { status: 405, headers });
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) throw new APIError('Use this explorer from its own website.', 403);
    const body = request.method === 'GET' ? { action: 'health' } : await request.text();
    if (typeof body === 'string' && body.length > 100_000) throw new APIError('Request too large.', 413);
    const input = typeof body === 'string' ? JSON.parse(body) : body;
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new APIError('Expected a JSON action object.', 400);
    const store = getStore({ name: 'central-dogma-v1', consistency: 'strong' });
    const output = await createService(store).action(input);
    return new Response(JSON.stringify(output), { headers });
  } catch (error) {
    const status = error instanceof APIError ? error.status : error instanceof SyntaxError ? 400 : 503;
    const message = error instanceof APIError ? error.message : status === 400 ? 'Invalid JSON request.' : 'The explorer backend is not available. Confirm this site is deployed with Netlify Functions and Blobs enabled.';
    if (error.retryAfter) headers['Retry-After'] = String(error.retryAfter);
    return new Response(JSON.stringify({ error: message, retryAfter: error.retryAfter || 0, submissionUnknown: Boolean(error.submissionUnknown) }), { status, headers });
  }
}
