import { describe, it, expect, vi, afterEach } from 'vitest';
import { createService } from '../server/central-dogma.mjs';
function memoryStore() {
  const rows = new Map(); let etag = 0;
  return { rows, async get(key) { return rows.get(key)?.data ?? null; }, async getWithMetadata(key) { return rows.get(key) ?? null; },
    async setJSON(key,data,options={}) {
      const old = rows.get(key);
      if ((options.onlyIfNew && old) || (options.onlyIfMatch && old?.etag !== options.onlyIfMatch)) return {modified:false};
      rows.set(key,{data:structuredClone(data),etag:String(++etag)});return {modified:true,etag:String(etag)};
    } };
}
const input = {action:'submit',sequence:'MAEFG',database:'refseq_protein',hits:30,taxid:null,submissionId:'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'};
afterEach(()=>vi.useRealTimers());
describe('shared rate limits, cached records and safe BLAST submissions',()=>{
  it('atomically permits one of several simultaneous requests',async()=>{
    const s=createService(memoryStore()); const results=await Promise.allSettled([s.claim('blast',10000),s.claim('blast',10000),s.claim('blast',10000)]);
    expect(results.filter(x=>x.status==='fulfilled')).toHaveLength(1);expect(results.filter(x=>x.status==='rejected')[0].reason.status).toBe(429);
  });
  it('fails closed when a conditional write reports success without an ETag',async()=>{
    const store=memoryStore();store.setJSON=async()=>({modified:true,etag:''});const fetcher=vi.fn();
    await expect(createService(store,fetcher).action(input)).rejects.toMatchObject({status:503});expect(fetcher).not.toHaveBeenCalled();
  });
  it('caches a valid response while retaining original retrieval date',async()=>{
    const fetcher=vi.fn(async()=>new Response('{"esearchresult":{"idlist":["9606"]}}'));
    const s=createService(memoryStore(),fetcher), a=await s.action({action:'taxonomy',term:'Homo sapiens'}), b=await s.action({action:'taxonomy',term:'Homo sapiens'});
    expect(fetcher).toHaveBeenCalledTimes(1);expect(b.provenance.served_from_cache).toBe(true);expect(b.provenance.database_fetched_at).toBe(a.provenance.database_fetched_at);
  });
  it('does not cache malformed responses or NCBI errors',async()=>{
    vi.useFakeTimers(); const store=memoryStore();const fetcher=vi.fn(async()=>new Response('<ERROR>Unavailable</ERROR>'));const s=createService(store,fetcher);
    await expect(s.request('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi',{retmode:'xml'})).rejects.toThrow('malformed');
    vi.advanceTimersByTime(1000);
    await expect(s.request('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi',{retmode:'xml'})).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(2);expect([...store.rows.keys()].some(k=>k.startsWith('cache/'))).toBe(false);
  });
  it('returns the same request ID when a successful submission is repeated',async()=>{
    const fetcher=vi.fn(async()=>new Response('RID = ABCD1234\nRTOE = 10'));const s=createService(memoryStore(),fetcher);
    const a=await s.action(input),b=await s.action(input);expect(a.rid).toBe('ABCD1234');expect(b.rid).toBe(a.rid);expect(fetcher).toHaveBeenCalledTimes(1);
    await expect(s.action({action:'poll',rid:a.rid})).rejects.toMatchObject({status:429,retryAfter:expect.any(Number)});
  });
  it('never automatically resubmits after an uncertain transport timeout',async()=>{
    const fetcher=vi.fn(async()=>{throw new Error('timeout');});const s=createService(memoryStore(),fetcher);
    await expect(s.action(input)).rejects.toMatchObject({submissionUnknown:true});
    await expect(s.action(input)).rejects.toMatchObject({status:409,submissionUnknown:true});expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('rejects multiple proteins, invalid scope and accession URLs before contacting NCBI',async()=>{
    const fetcher=vi.fn();const s=createService(memoryStore(),fetcher);
    await expect(s.action({...input,sequence:'>a\nMA\n>b\nMG'})).rejects.toMatchObject({status:400});
    await expect(s.action({...input,taxid:'9606 OR all'})).rejects.toMatchObject({status:400});
    await expect(s.action({action:'protein',accession:'https://evil.test'})).rejects.toMatchObject({status:400});expect(fetcher).not.toHaveBeenCalled();
  });
  it('blocks new searches at the daily guardrail without blocking cached results',async()=>{
    const store=memoryStore();await store.setJSON('budget/blast',{started:Date.now(),count:50});const fetcher=vi.fn();
    await expect(createService(store,fetcher).action(input)).rejects.toMatchObject({status:429});expect(fetcher).not.toHaveBeenCalled();
    await store.setJSON('results/SAVED123',{status:'READY',completed:Date.now(),raw:{}});
    expect((await createService(store,fetcher).action({action:'poll',rid:'SAVED123'})).status).toBe('READY');
  });
  it('checks returned RID after the polling interval and preserves ready results',async()=>{
    vi.useFakeTimers(); const report={BlastOutput2:[{report:{results:{search:{hits:[]}}}}]};
    const fetcher=vi.fn().mockResolvedValueOnce(new Response('RID = ABCD1234')).mockResolvedValueOnce(new Response(JSON.stringify(report)));
    const s=createService(memoryStore(),fetcher);const a=await s.action(input);vi.advanceTimersByTime(61000);
    expect((await s.action({action:'poll',rid:a.rid})).status).toBe('READY');
    expect((await s.action({action:'poll',rid:a.rid})).raw).toEqual(report);expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
