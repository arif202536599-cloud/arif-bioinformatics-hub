import { describe,it,expect,vi } from 'vitest';
vi.mock('@netlify/blobs',()=>({getStore:()=>({get:async()=>null})}));
import handler from '../netlify/functions/central-dogma.mjs';
const url='https://example.netlify.app/.netlify/functions/central-dogma';
describe('HTTP function boundary',()=>{
  it('serves a JSON health response on the same origin',async()=>{const r=await handler(new Request(url));expect(r.status).toBe(200);expect((await r.json()).available).toBe(true);expect(r.headers.get('cache-control')).toBe('no-store');});
  it('rejects cross-origin browser requests',async()=>{const r=await handler(new Request(url,{method:'POST',headers:{Origin:'https://other.test'},body:'{}'}));expect(r.status).toBe(403);});
  it('rejects unsupported methods',async()=>expect((await handler(new Request(url,{method:'DELETE'}))).status).toBe(405));
  it.each(['bad json','null','[]'])('reports malformed action input as a client error: %s',async body=>expect((await handler(new Request(url,{method:'POST',body}))).status).toBe(400));
  it('bounds request body size',async()=>expect((await handler(new Request(url,{method:'POST',body:'x'.repeat(100001)}))).status).toBe(413));
});
