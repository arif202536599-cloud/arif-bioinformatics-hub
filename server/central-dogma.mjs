import { createHash } from 'node:crypto';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { parseProteins } from '../shared/central-dogma.mjs';

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
const BLAST = 'https://blast.ncbi.nlm.nih.gov/Blast.cgi';
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@', parseTagValue: false });
const array = value => value == null ? [] : Array.isArray(value) ? value : [value];
const text = value => typeof value === 'object' ? value?.['#text'] || '' : String(value ?? '');
const unique = values => [...new Set(values.filter(Boolean))];
const hash = value => createHash('sha256').update(value).digest('hex');

export class APIError extends Error {
  constructor(message, status = 502, retryAfter = 0, submissionUnknown = false) {
    super(message); Object.assign(this, { status, retryAfter, submissionUnknown });
  }
}

export function xml(body) {
  if (XMLValidator.validate(body) !== true || /<html|<ERROR>|<Error>/i.test(body)) throw new APIError('NCBI returned an error or malformed XML. Try again later.');
  return parser.parse(body);
}

export function parseRecord(body, db, provenance = {}) {
  const data = xml(body), r = array(data.GBSet?.GBSeq)[0];
  if (!r || !r['GBSeq_accession-version'] || !r.GBSeq_sequence) throw new APIError('The selected reference record or sequence is unavailable.');
  const features = array(r['GBSeq_feature-table']?.GBFeature).map(f => {
    const qualifiers = {};
    for (const q of array(f.GBFeature_quals?.GBQualifier)) (qualifiers[q.GBQualifier_name] ||= []).push(text(q.GBQualifier_value));
    return { type: f.GBFeature_key, location: f.GBFeature_location, qualifiers };
  });
  const xrefs = features.flatMap(f => f.qualifiers.db_xref || []);
  const dbxrefs = array(r.GBSeq_xrefs?.GBXref).map(x => `${x.GBXref_dbname}:${x.GBXref_id}`);
  const accession = r['GBSeq_accession-version'];
  return { accession, sequence: r.GBSeq_sequence.toUpperCase(), molecule_type: r.GBSeq_moltype,
    organism: r.GBSeq_organism || 'Unavailable', taxid: xrefs.find(x => x.startsWith('taxon:'))?.slice(6) || null,
    gene_ids: unique(xrefs.filter(x => x.startsWith('GeneID:')).map(x => x.slice(7))),
    gene_names: unique(features.flatMap(f => f.qualifiers.gene || [])),
    coded_by: unique(features.flatMap(f => f.qualifiers.coded_by || [])), features, dbxrefs,
    reference_update_date: r['GBSeq_update-date'], description: r.GBSeq_definition,
    source: `https://www.ncbi.nlm.nih.gov/${db === 'protein' ? 'protein' : 'nuccore'}/${accession}`, provenance };
}

function findNodes(object, key, results = []) {
  if (!object || typeof object !== 'object') return results;
  for (const [k, value] of Object.entries(object)) {
    if (k === key) results.push(...array(value));
    else for (const child of array(value)) findNodes(child, key, results);
  }
  return results;
}

export function parseGene(body) {
  const root = xml(body);
  return array(root['Entrezgene-Set']?.Entrezgene).map(g => {
    const id = g['Entrezgene_track-info']?.['Gene-track']?.['Gene-track_geneid'];
    const ref = g.Entrezgene_gene?.['Gene-ref'];
    const loci = [];
    for (const locus of array(g.Entrezgene_locus?.['Gene-commentary'])) {
      if (locus['Gene-commentary_type']?.['@value'] !== 'genomic') continue;
      const accession = locus['Gene-commentary_accession'] + (locus['Gene-commentary_version'] ? `.${locus['Gene-commentary_version']}` : '');
      if (!locus['Gene-commentary_accession']) continue;
      for (const i of findNodes(locus['Gene-commentary_seqs'], 'Seq-interval')) {
        const a = i['Seq-interval_from'], b = i['Seq-interval_to'];
        if (a == null || b == null) continue;
        const strand = i['Seq-interval_strand']?.['Na-strand']?.['@value'];
        loci.push({ gene_id: id, gene_name: ref?.['Gene-ref_locus'] || '', accession,
          start: Number(a) + 1, end: Number(b) + 1, strand: strand === 'minus' ? -1 : strand === 'plus' ? 1 : 0,
          assembly_label: locus['Gene-commentary_label'] || 'Unavailable', assembly_accession: 'Unavailable unless explicitly linked',
          source: `https://www.ncbi.nlm.nih.gov/gene/${id}` });
      }
    }
    return { gene_id: id, gene_name: ref?.['Gene-ref_locus'] || '', description: ref?.['Gene-ref_desc'] || '',
      summary: g.Entrezgene_summary || '', loci, source: `https://www.ncbi.nlm.nih.gov/gene/${id}` };
  });
}

export { genomicEvidence } from '../shared/record-evidence.mjs';

export function createService(store, fetcher = fetch) {
  async function atomicWrite(key, data, options) {
    const result = await store.setJSON(key, data, options);
    // Blobs conditional writes can report modified=true without an ETag on a
    // failed HTTP response. Fail closed rather than bypass request pacing.
    if (result.modified && !result.etag) throw new APIError('Shared request tracking could not be confirmed. No remote request was made. Try later.', 503);
    return result;
  }
  async function submissionBudget() {
    const key = 'budget/blast';
    for (let attempt = 0; attempt < 3; attempt++) {
      const previous = await store.getWithMetadata(key, { type: 'json', consistency: 'strong' });
      const now = Date.now(), old = previous?.data;
      const current = old && now - old.started < 86400000 ? old : { started: now, count: 0 };
      if (current.count >= 50) throw new APIError('This website has reached its 50-search rolling 24-hour limit. Existing request IDs and reference retrieval remain available. Use standalone BLAST for larger projects.', 429, Math.ceil((current.started + 86400000 - now) / 1000));
      const result = await atomicWrite(key, { started: current.started, count: current.count + 1 }, previous ? { onlyIfMatch: previous.etag } : { onlyIfNew: true });
      if (result.modified) return;
    }
    throw new APIError('Search budget is busy. Retry shortly.', 429, 2);
  }
  async function claim(key, interval) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const previous = await store.getWithMetadata(`rate/${key}`, { type: 'json', consistency: 'strong' });
      const now = Date.now(), remaining = (previous?.data?.next || 0) - now;
      if (remaining > 0) throw new APIError('Service request limit reached. Please wait before checking again.', 429, Math.ceil(remaining / 1000));
      const { modified } = await atomicWrite(`rate/${key}`, { next: now + interval }, previous ? { onlyIfMatch: previous.etag } : { onlyIfNew: true });
      if (modified) return;
    }
    throw new APIError('Another request is in progress. Please retry shortly.', 429, 2);
  }

  async function request(endpoint, params, { post = false, cache = true } = {}) {
    params = { ...params, tool: 'arif_bioinformatics_hub' };
    if (process.env.NCBI_CONTACT_EMAIL) params.email = process.env.NCBI_CONTACT_EMAIL;
    const key = `cache/${hash(endpoint + JSON.stringify(params))}`;
    if (cache) {
      const previous = await store.get(key, { type: 'json' });
      if (previous && Date.now() - previous.fetched < 7 * 86400000) return { body: previous.body,
        provenance: { database_fetched_at: new Date(previous.fetched).toISOString(), served_from_cache: true, endpoint, parameters: Object.fromEntries(Object.entries(params).filter(([k]) => k !== 'email')) } };
    }
    await claim(endpoint === BLAST ? 'blast' : 'eutils', endpoint === BLAST ? 10100 : 360);
    const form = new URLSearchParams(params);
    let response;
    try { response = await fetcher(post ? endpoint : `${endpoint}?${form}`, {
      method: post ? 'POST' : 'GET', ...(post ? { body: form } : {}), signal: AbortSignal.timeout(20000),
      headers: { 'User-Agent': 'ArifBioinformaticsHub/1.0', ...(post ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}) },
    }); } catch { throw new APIError(post ? 'The BLAST submission timed out. It may exist remotely; do not immediately resubmit.' : 'NCBI could not be reached. Your existing search is retained.', 502, 0, post); }
    if (!response.ok) throw new APIError(`NCBI returned HTTP ${response.status}. Try again later.`, 502, 0, post);
    const body = await response.text(), fetched = Date.now();
    if (body.length > 8_000_000) throw new APIError('The reference response is too large for this web retrieval; use the Python version.');
    if (/^\s*<!doctype html/i.test(body) && endpoint !== BLAST) throw new APIError('NCBI returned a service page instead of a record.');
    if (endpoint !== BLAST) {
      if (params.retmode === 'xml') xml(body);
      if (params.retmode === 'json') {
        let parsed;
        try { parsed = JSON.parse(body); } catch { throw new APIError('NCBI returned malformed JSON. Please try again later.'); }
        if (parsed.error || parsed.esearchresult?.ERROR || parsed.esearchresult?.errorlist) throw new APIError('NCBI reported a database query error. Check the identifier or try later.');
      }
    }
    if (cache) await store.setJSON(key, { body, fetched });
    return { body, provenance: { database_fetched_at: new Date(fetched).toISOString(), served_from_cache: false, endpoint,
      parameters: Object.fromEntries(Object.entries(params).filter(([k]) => k !== 'email')) } };
  }
  const accession = value => { if (!/^[A-Za-z0-9_]+(?:\.\d+)?$/.test(String(value)) || String(value).length > 50) throw new APIError('Invalid accession or identifier.', 400); return String(value); };
  async function record(db, id, extra = {}) {
    const r = await request(EUTILS + 'efetch.fcgi', { db, id: accession(id), rettype: 'gb', retmode: 'xml', ...extra });
    return parseRecord(r.body, db, r.provenance);
  }

  async function action(input) {
    switch (input.action) {
      case 'health':
        await store.get('rate/blast', { type: 'json', consistency: 'strong' });
        return { available: true, version: 'central-dogma-1', search_service: 'NCBI BLASTp' };
      case 'taxonomy': {
        const term = String(input.term || '').trim().slice(0, 150);
        if (!term) throw new APIError('Enter an organism name or taxonomy ID.', 400);
        const search = await request(EUTILS + 'esearch.fcgi', { db: 'taxonomy', term, retmode: 'json', retmax: '20' });
        const ids = JSON.parse(search.body).esearchresult?.idlist || [];
        // Separate API calls keep serverless execution short and paced.
        return { ids, provenance: search.provenance };
      }
      case 'taxa': {
        const ids = array(input.ids).slice(0, 20).map(accession);
        if (!ids.length) return { taxa: [] };
        const r = await request(EUTILS + 'efetch.fcgi', { db: 'taxonomy', id: ids.join(','), retmode: 'xml' });
        return { taxa: array(xml(r.body).TaxaSet?.Taxon).map(t => ({ taxid: Number(t.TaxId), name: t.ScientificName, rank: t.Rank })) };
      }
      case 'submit': {
        let queries;
        try { queries = parseProteins(input.sequence); } catch (error) { throw new APIError(error.message, 400); }
        if (queries.length !== 1) throw new APIError('Each paced BLAST submission must contain one protein.', 400);
        const query = queries[0];
        if (!['refseq_protein', 'nr'].includes(input.database)) throw new APIError('Invalid protein database.', 400);
        const params = { CMD: 'Put', PROGRAM: 'blastp', DATABASE: input.database, QUERY: query.sequence,
          HITLIST_SIZE: String(Math.min(100, Math.max(10, Number(input.hits) || 30))), EXPECT: '0.00001', FILTER: 'L', FORMAT_TYPE: 'JSON2_S' };
        if (input.taxid != null) { if (!/^\d+$/.test(String(input.taxid))) throw new APIError('Invalid taxonomy ID.', 400); params.ENTREZ_QUERY = `txid${input.taxid}[ORGN]`; }
        if (!/^[a-f0-9-]{36}$/.test(String(input.submissionId))) throw new APIError('Submission identifier missing.', 400);
        // Atomically mark each submission before contacting NCBI. A transport
        // timeout cannot turn a retry into a second biological search.
        const key = `submissions/${input.submissionId}`, existing = await store.get(key, { type: 'json', consistency: 'strong' });
        if (existing?.rid) return existing;
        if (existing) throw new APIError('This submission was already attempted. Its remote outcome is uncertain; do not immediately resubmit.', 409, 0, true);
        await claim('blast', 10100);
        await submissionBudget();
        const { modified } = await atomicWrite(key, { attempted_at: Date.now() }, { onlyIfNew: true });
        if (!modified) throw new APIError('This submission is already being processed.', 409, 0, true);
        // request() has its own global limiter. Release no slot: call the POST
        // directly only after the slot above has been atomically reserved.
        const form = new URLSearchParams({ ...params, tool: 'arif_bioinformatics_hub', ...(process.env.NCBI_CONTACT_EMAIL ? { email: process.env.NCBI_CONTACT_EMAIL } : {}) });
        let response;
        try { response = await fetcher(BLAST, { method: 'POST', body: form, signal: AbortSignal.timeout(20000) }); }
        catch { throw new APIError('BLAST submission timed out; it may exist remotely. Do not immediately resubmit.', 502, 0, true); }
        if (!response.ok) throw new APIError('BLAST submission was not confirmed. Do not immediately resubmit.', 502, 0, true);
        const body = await response.text(), rid = /RID\s*=\s*([A-Z0-9-]+)/.exec(body)?.[1];
        if (!rid) throw new APIError('NCBI did not confirm a request ID. No automatic resubmission was made.', 502, 0, true);
        const job = { rid, submitted_at: new Date().toISOString(), status: 'WAITING', next_poll_at: Date.now() + 60100 };
        try {
          await store.setJSON(key, job);
          await store.setJSON(`rate/rid-${rid}`, { next: job.next_poll_at });
        } catch { throw new APIError(`BLAST accepted request ${rid}, but storing it failed. Save this RID and resume it; do not resubmit.`, 503, 0, true); }
        return job;
      }
      case 'poll': {
        const rid = String(input.rid);
        if (!/^[A-Z0-9-]{5,50}$/.test(rid)) throw new APIError('Invalid BLAST request ID.', 400);
        const cached = await store.get(`results/${rid}`, { type: 'json' });
        if (cached && Date.now() - cached.completed < 7 * 86400000) return cached;
        await claim('rid-' + rid, 60100);
        const r = await request(BLAST, { CMD: 'Get', RID: rid, FORMAT_TYPE: 'JSON2_S' }, { cache: false });
        if (/Status\s*=\s*WAITING/.test(r.body)) return { rid, status: 'WAITING', next_poll_at: Date.now() + 60100 };
        if (/Status\s*=\s*(FAILED|UNKNOWN)/.test(r.body)) return { rid, status: /UNKNOWN/.test(r.body) ? 'EXPIRED' : 'FAILED' };
        let raw;
        try { raw = JSON.parse(r.body); } catch { throw new APIError('BLAST returned an unrecognised response. Keep the request ID and check later.'); }
        if (!raw.BlastOutput2) throw new APIError('BLAST did not return a supported result report.');
        const result = { rid, status: 'READY', raw, completed: Date.now(), provenance: r.provenance };
        await store.setJSON(`results/${rid}`, result);
        return result;
      }
      case 'protein': return await record('protein', input.accession);
      case 'links': {
        if (!['gene', 'nuccore'].includes(input.db)) throw new APIError('Invalid linked database.', 400);
        const linkname = input.db === 'nuccore' ? 'protein_nuccore_mrna' : 'protein_gene';
        const r = await request(EUTILS + 'elink.fcgi', { dbfrom: 'protein', db: input.db, id: accession(input.accession), linkname, retmode: 'xml' });
        const root = xml(r.body);
        return { ids: unique(findNodes(root, 'LinkSetDb').filter(n => n.LinkName === linkname).flatMap(n => array(n.Link).map(l => text(l.Id)))), provenance: r.provenance };
      }
      case 'metadata': {
        const r = await request(EUTILS + 'esummary.fcgi', { db: 'nuccore', id: accession(input.accession), retmode: 'json' });
        const root = JSON.parse(r.body).result;
        const metadata = root?.[root.uids?.[0]];
        if (!metadata) throw new APIError('Nucleotide record metadata unavailable.');
        return { length: Number(metadata.slen), accession: metadata.accessionversion, provenance: r.provenance };
      }
      case 'nucleotide': {
        // No unbounded chromosome download is exposed through this endpoint.
        const cachedMeta = await request(EUTILS + 'esummary.fcgi', { db: 'nuccore', id: accession(input.accession), retmode: 'json' });
        const metaRoot = JSON.parse(cachedMeta.body).result;
        const metadata = metaRoot?.[metaRoot.uids?.[0]];
        if (!metadata || Number(metadata.slen) > 1_000_000) throw new APIError('Nucleotide record exceeds 1 Mb or its size is unavailable. Use an explicitly linked genomic slice or the Python version.', 400);
        return await record('nuccore', input.accession);
      }
      case 'gene': {
        if (!/^\d+$/.test(String(input.id))) throw new APIError('Invalid GeneID.', 400);
        const r = await request(EUTILS + 'efetch.fcgi', { db: 'gene', id: input.id, retmode: 'xml' });
        return { genes: parseGene(r.body), provenance: r.provenance };
      }
      case 'genomic': {
        // A client cannot turn this into an arbitrary coordinate lookup: the
        // exact locus must occur in the explicitly fetched Gene record.
        if (!/^\d+$/.test(String(input.geneId))) throw new APIError('Invalid GeneID.', 400);
        const g = await request(EUTILS + 'efetch.fcgi', { db: 'gene', id: input.geneId, retmode: 'xml' });
        const locus = parseGene(g.body).flatMap(x => x.loci).find(l => l.accession === input.accession && l.start === Number(input.start) && l.end === Number(input.end));
        if (!locus) throw new APIError('Coordinates are not explicitly linked by this Gene record.', 400);
        if (locus.end - locus.start + 1 > 1_000_000) throw new APIError('Gene locus exceeds the 1 Mb web retrieval limit. Coordinates remain available.', 400);
        const r = await record('nuccore', locus.accession, { seq_start: String(locus.start), seq_stop: String(locus.end), strand: '1' });
        return { record: { ...r, slice: true }, locus };
      }
      default: throw new APIError('Unknown explorer action.', 400);
    }
  }
  return { action, claim, request };
}
