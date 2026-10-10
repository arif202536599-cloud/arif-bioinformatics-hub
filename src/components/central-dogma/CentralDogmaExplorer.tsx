import { useEffect, useMemo, useState } from 'react';
import { Dna, Search, Download, ArrowRight, CheckCircle2, FlaskConical, ExternalLink, LoaderCircle } from 'lucide-react';
import { parseProteins, exactMatch, blastCandidates, locationParts, transcriptEvidence, geneStructureSvg } from '../../../shared/central-dogma.mjs';
import type { ProteinQuery } from '../../../shared/central-dogma.mjs';
import { explorerAPI } from './api';
import { centralDogmaDemo } from './demo';
import { CentralDogmaConcept } from './CentralDogmaConcept';
import { downloadFile, downloadExcel, downloadFigurePNG, sequenceDownloads } from './exports';
import './central-dogma.css';

type State = { queries: ProteinQuery[]; jobs: any[]; details: Record<string, any>; demo: boolean };
const empty: State = { queries: [], jobs: [], details: {}, demo: false };
const unique = (values: string[]) => [...new Set(values)];
const pct = (value: number | null) => value == null ? 'Unavailable' : `${value.toFixed(2)}%`;
const sourceLink = (url: string, label: string) => url?.startsWith('https://www.ncbi.nlm.nih.gov/')
  ? <a href={url} target="_blank" rel="noreferrer" className="cd-source">{label}<ExternalLink size={13} /></a> : <span>{label}: {url || 'Unavailable'}</span>;

function Table({ rows }: { rows: Record<string, any>[] }) {
  if (!rows.length) return <p className="cd-muted">No available records.</p>;
  const keys = [...new Set(rows.flatMap(r => Object.keys(r)))];
  return <div className="cd-table-wrap"><table><thead><tr>{keys.map(k => <th key={k}>{k.replace(/_/g, ' ')}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={i}>{keys.map(k => <td key={k}>{r[k] == null ? 'Unavailable' : typeof r[k] === 'object' ? JSON.stringify(r[k]) : String(r[k])}</td>)}</tr>)}</tbody></table></div>;
}
function Sequence({ title, sequence }: { title: string; sequence: string }) {
  return <details className="cd-sequence"><summary>{title} · {sequence?.length || 0} {title.toLowerCase().includes('protein') ? 'aa' : 'nt'}</summary>
    {sequence ? <pre>{sequence.match(/.{1,80}/g)?.join('\n')}</pre> : <p className="cd-muted">Unavailable in explicitly linked records.</p>}</details>;
}

export default function CentralDogmaExplorer() {
  const [state, setState] = useState<State>(() => {
    try { const s = JSON.parse(sessionStorage.getItem('central_dogma_v1') || 'null'); return s && Array.isArray(s.jobs) && Array.isArray(s.queries) && s.details ? s : empty; } catch { return empty; }
  });
  const [input, setInput] = useState(''), [mode, setMode] = useState('paste');
  const [organismMode, setOrganismMode] = useState('auto'), [term, setTerm] = useState(''), [taxa, setTaxa] = useState<any[]>([]), [taxid, setTaxid] = useState('');
  const [database, setDatabase] = useState('refseq_protein'), [hits, setHits] = useState(30);
  const [busy, setBusy] = useState(false), [progress, setProgress] = useState(0), [message, setMessage] = useState(''), [error, setError] = useState('');
  const [selection, setSelection] = useState(''), [view, setView] = useState('gene'), [includeGenomic, setIncludeGenomic] = useState(true);
  const [batchStart, setBatchStart] = useState(1), [backend, setBackend] = useState('Checking web backend…');
  const [savedRid, setSavedRid] = useState(''), [consent, setConsent] = useState(false);

  useEffect(() => {
    explorerAPI({ action: 'health' }).then(() => setBackend('Web backend ready')).catch(() => setBackend('Live backend unavailable · offline demo works'));
  }, []);
  useEffect(() => { try { sessionStorage.setItem('central_dogma_v1', JSON.stringify(state)); } catch { /* Large records remain in memory and can be downloaded. */ } }, [state]);

  const parsed = useMemo(() => { try { return { queries: input.trim() ? parseProteins(input) : [], error: '' }; } catch (e) { return { queries: [], error: (e as Error).message }; } }, [input]);
  const candidates = state.jobs.flatMap((job, ji) => job.candidates.map((candidate: any, ci: number) => ({ job, candidate, index: `${ji}:${ci}` }))).sort((a, b) => a.candidate.query_order - b.candidate.query_order);
  const selected = candidates.find(x => x.index === selection) || candidates[0];
  const key = selected ? `${selected.candidate.query_order}:${selected.candidate.accession}` : '';
  const detail = state.details[key];
  const api = (input: Record<string, unknown>) => explorerAPI(input, setMessage);

  async function run(work: () => Promise<void>) {
    setBusy(true); setError(''); setProgress(0);
    try { await work(); } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function submit() {
    await run(async () => {
      if (!consent) throw new Error('Confirm that the selected protein sequences may be sent to NCBI.');
      if (organismMode === 'specific' && !taxid) throw new Error('Find and select an organism or taxonomic group.');
      const queries = parsed.queries;
      if (!queries.length) throw new Error(parsed.error || 'Add valid protein sequences first.');
      if (batchStart < 1 || batchStart > queries.length) throw new Error('Choose a valid first input entry for this batch.');
      const same = JSON.stringify(state.queries) === JSON.stringify(queries) && !state.demo;
      let jobs = same ? [...state.jobs] : [], details = same ? state.details : {};
      setState({ queries, jobs, details, demo: false }); setSelection('');
      const batch = queries.slice(batchStart - 1, batchStart + 4);
      for (let i = 0; i < batch.length; i++) {
        const query = batch[i], scope = organismMode === 'specific' ? Number(taxid) : null;
        if (jobs.some(j => j.query.order === query.order && j.query.sequence === query.sequence && j.database === database && j.taxid === scope && j.hits === hits && !['FAILED', 'EXPIRED'].includes(j.status))) {
          setMessage(`Entry ${query.order}: existing request retained.`); continue;
        }
        setMessage(`Submitting entry ${query.order} of ${queries.length}…`);
        const submissionId = crypto.randomUUID();
        const result = await api({ action: 'submit', sequence: query.sequence, database, taxid: scope, hits, submissionId });
        jobs = [...jobs, { ...result, query, database, taxid: scope, hits, candidates: [] }];
        setState({ queries, jobs, details, demo: false }); setProgress((i + 1) / batch.length * 100);
      }
      setMessage('Search requests saved. Wait at least a minute, then check their results. Queue times vary.');
    });
  }

  async function poll() {
    await run(async () => {
      const jobs = [...state.jobs];
      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i];
        if (job.status !== 'WAITING') continue;
        if (Date.now() < job.next_poll_at) { setMessage(`${job.rid}: next check is allowed in ${Math.ceil((job.next_poll_at - Date.now()) / 1000)} seconds.`); continue; }
        setMessage(`Checking ${job.rid}…`);
        try {
          const result = await api({ action: 'poll', rid: job.rid });
          jobs[i] = { ...job, ...result, candidates: result.status === 'READY' ? blastCandidates(result.raw, job.query) : job.candidates };
        } catch (e) { jobs[i] = { ...job, next_poll_at: Date.now() + 60100 }; setError(`${job.rid}: ${(e as Error).message}`); }
        setState(s => ({ ...s, jobs: [...jobs] })); setProgress((i + 1) / jobs.length * 100);
      }
      setMessage('Search status updated. A queued request can be checked again after its polling interval.');
    });
  }

  async function retrieve() {
    if (!selected) return;
    await run(async () => {
      setMessage('Retrieving the full reference protein…');
      const { candidate, job } = selected;
      const protein = await api({ action: 'protein', accession: candidate.accession });
      const d: any = { query: job.query, protein, match: exactMatch(job.query.sequence, protein.sequence), transcripts: [], genes: [], genomic: [], warnings: [], provenance: [protein.provenance], retrieved_at: new Date().toISOString() };
      const save = () => setState(s => ({ ...s, details: { ...s.details, [key]: { ...d } }, jobs: s.jobs.map(j => ({ ...j, candidates: j.candidates.map((c: any) => c.query_order === candidate.query_order && c.accession === candidate.accession ? { ...c, verification: d.match, organism: protein.organism, taxid: protein.taxid, reference_accession_version: protein.accession } : c) })) }));
      save(); setProgress(15);
      let nucleotideIds: string[] = [];
      for (const location of protein.coded_by) {
        try {
          const parts = locationParts(location);
          for (const id of unique(parts.map((p: any) => p.accession).filter(Boolean))) {
            nucleotideIds.push(id);
          }
        } catch (e) { d.warnings.push(`Unresolved coded_by: ${(e as Error).message}`); }
      }
      try { const links = await api({ action: 'links', accession: protein.accession, db: 'nuccore' }); nucleotideIds.push(...links.ids); d.provenance.push(links.provenance); }
      catch (e) { d.warnings.push(`Transcript links: ${(e as Error).message}`); }
      nucleotideIds = unique(nucleotideIds); d.linked_nucleotide_ids = nucleotideIds;
      if (nucleotideIds.length > 30) d.warnings.push('Linked nucleotide retrieval is capped at 30 records; remaining linked IDs are preserved.');
      const seen = new Set();
      for (let i = 0; i < Math.min(30, nucleotideIds.length); i++) {
        const accession = nucleotideIds[i]; setMessage(`Following linked nucleotide record ${i + 1}: ${accession}…`);
        try {
          const meta = await api({ action: 'metadata', accession }); d.provenance.push(meta.provenance);
          if (meta.length > 1_000_000) throw new Error('Record exceeds the 1 Mb web limit. The Python version can retrieve explicit coded_by slices. Gene-linked slices are fetched below when available.');
          const record = await api({ action: 'nucleotide', accession }); d.provenance.push(record.provenance);
          for (const transcript of transcriptEvidence(record, protein, job.query.sequence)) {
            const token = `${transcript.accession}:${transcript.cds_location}`;
            if (!seen.has(token)) { seen.add(token); d.transcripts.push(transcript); d.warnings.push(...transcript.warnings, ...transcript.translation.notes); }
          }
        } catch (e) { d.warnings.push(`${accession}: ${(e as Error).message}`); }
        save(); setProgress(20 + (i + 1) / Math.max(1, Math.min(30, nucleotideIds.length)) * 35);
      }
      let geneIds = unique([...protein.gene_ids, ...d.transcripts.flatMap((t: any) => t.gene_ids)]);
      try { const links = await api({ action: 'links', accession: protein.accession, db: 'gene' }); geneIds = unique([...geneIds, ...links.ids]); d.provenance.push(links.provenance); }
      catch (e) { d.warnings.push(`Gene links: ${(e as Error).message}`); }
      d.linked_gene_ids = geneIds;
      for (const id of geneIds) {
        setMessage(`Retrieving linked GeneID ${id}…`);
        try { const result = await api({ action: 'gene', id }); d.genes.push(...result.genes); d.provenance.push(result.provenance); }
        catch (e) { d.warnings.push(`Gene ${id}: ${(e as Error).message}`); }
      }
      if (!geneIds.length) d.warnings.push('No explicitly linked GeneID found. A genomic locus cannot be assigned from similarity alone.');
      save(); setProgress(65);
      if (includeGenomic) {
        const loci: any[] = d.genes.flatMap((g: any) => g.loci);
        const seenLoci = new Set();
        for (let i = 0; i < loci.length; i++) {
          const locus = loci[i], token = `${locus.accession}:${locus.start}-${locus.end}:${locus.strand}`;
          if (seenLoci.has(token)) continue; seenLoci.add(token);
          setMessage(`Retrieving linked genomic region ${token}…`);
          try {
            const result = await api({ action: 'genomic', geneId: locus.gene_id, accession: locus.accession, start: locus.start, end: locus.end });
            const { genomicEvidence } = await import('../../../shared/record-evidence.mjs');
            const g = genomicEvidence(result.record, result.locus, protein.accession, d.transcripts.map((t: any) => t.accession));
            d.genomic.push(g); d.warnings.push(...g.warnings); d.provenance.push(g.provenance);
            // A genomic CDS is useful even when no full transcript is available.
            // It is never presented as a complete spliced mRNA.
            if (!d.transcripts.length) {
              try { for (const t of transcriptEvidence(result.record, protein, job.query.sequence)) { d.transcripts.push(t); d.warnings.push(...t.warnings, ...t.translation.notes); } }
              catch { /* The selected product may not be annotated on this assembly. */ }
            }
          } catch (e) { d.warnings.push(`${token}: ${(e as Error).message}`); }
          save(); setProgress(65 + (i + 1) / Math.max(1, loci.length) * 30);
        }
      }
      if (!d.transcripts.length) d.warnings.push('No retrievable CDS explicitly linked to the reference protein. Transcript and CDS sequences remain unavailable.');
      d.warnings = unique(d.warnings); d.retrieved_at = new Date().toISOString(); save(); setProgress(100);
      setMessage('Reference retrieval finished. Review alternative candidates, assembly records, translation checks and any missing links.');
    });
  }

  return <section className="cd-explorer" aria-labelledby="central-dogma-title">
    <div className="cd-hero">
      <div><span className="cd-badge"><Dna size={15} /> REFERENCE SEQUENCE EXPLORER</span>
        <h1 id="central-dogma-title">Protein-to-Central-Dogma Explorer</h1>
        <p>Start with a protein. Follow database evidence to its possible genes, transcripts and coding sequences.</p>
        <p className="cd-flow">Genomic DNA <ArrowRight size={16} /> transcript/mRNA <ArrowRight size={16} /> CDS translation <ArrowRight size={16} /> protein</p>
      </div>
      <div className="cd-hero-actions"><span className="cd-status">{backend}</span>
        <button className="cd-secondary" disabled={busy} onClick={() => { setState(centralDogmaDemo()); setSelection(''); setError(''); setMessage('Offline synthetic demonstration loaded.'); }}><FlaskConical size={17} /> Try offline demonstration</button>
        <a className="cd-source" href="https://github.com/arif202536599-cloud/arif-bioinformatics-hub/tree/main/protein_central_dogma" target="_blank" rel="noreferrer">Python app & Codex agent instructions <ExternalLink size={14} /></a>
      </div>
    </div>
    <div className="cd-note">A protein cannot uniquely reconstruct the original DNA. Identical proteins may belong to multiple genes or organisms. Reference mapping is evidence, not proof of your sample’s origin. RNA-seq expression needs separate experimental data.</div>

    <CentralDogmaConcept />

    <div className="cd-input-grid">
      <div className="cd-panel"><h2><span>1</span> Add your proteins</h2>
        <div className="cd-row" role="group" aria-label="Protein input method">
          <button className={mode === 'paste' ? 'cd-choice active' : 'cd-choice'} disabled={busy} onClick={() => { setMode('paste'); setInput(''); }}>Paste sequence / FASTA</button>
          <button className={mode === 'upload' ? 'cd-choice active' : 'cd-choice'} disabled={busy} onClick={() => { setMode('upload'); setInput(''); }}>Upload protein FASTA</button>
        </div>
        {mode === 'paste' ? <label className="cd-field">Protein sequence or FASTA<textarea value={input} disabled={busy} onChange={e => setInput(e.target.value)} placeholder={'>my_protein\nM...'} rows={7} /></label>
          : <label className="cd-field cd-upload">Protein FASTA file<input type="file" accept=".fasta,.fa,.faa,.txt" disabled={busy} onChange={async e => {
            setError(''); const file = e.target.files?.[0]; if (!file) return;
            if (file.size > 10_000_000) { setError('FASTA upload limit is 10 MB.'); return; }
            const bytes = await file.arrayBuffer();
            try { setInput(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); } catch { setError('Upload a UTF-8 text FASTA file.'); }
          }} /></label>}
        {parsed.error && <p className="cd-error" role="alert">{parsed.error}</p>}
        {parsed.queries.length > 0 && <><p className="cd-success"><CheckCircle2 size={16} /> {parsed.queries.length} protein(s) validated · input order preserved</p>
          <Table rows={parsed.queries.map(q => ({ order: q.order, identifier: q.id, residues: q.sequence.length }))} />
          {new Set(parsed.queries.map(q => q.id)).size < parsed.queries.length && <p className="cd-muted">Duplicate identifiers remain separate and are tracked by their input order.</p>}
          {parsed.queries.some(q => /^[ACGTN]+$/.test(q.sequence)) && <p className="cd-note">Some entries contain only A/C/G/T/N. Confirm these are amino-acid sequences, rather than nucleotides.</p>}</>}
      </div>
      <div className="cd-panel"><h2><span>2</span> Choose where to search</h2>
        <label className="cd-field">Organism options<select disabled={busy} value={organismMode} onChange={e => setOrganismMode(e.target.value)}>
          <option value="auto">Auto-detect / Search across organisms</option><option value="specific">Specify organism</option>
        </select></label>
        {organismMode === 'specific' && <><label className="cd-field">Search organism name or taxonomy ID<input value={term} disabled={busy} onChange={e => setTerm(e.target.value)} placeholder="Scientific name, common name or taxid" /></label>
          <button className="cd-secondary" disabled={busy || !term.trim()} onClick={() => run(async () => {
            setMessage('Searching NCBI Taxonomy…'); setTaxa([]); setTaxid('');
            const found = await api({ action: 'taxonomy', term });
            const result = found.ids.length ? await api({ action: 'taxa', ids: found.ids }) : { taxa: [] };
            setTaxa(result.taxa); setMessage(result.taxa.length ? 'Select a matching organism or taxonomic group.' : 'No taxonomy matches. Try another name or taxid.');
          })}><Search size={16} /> Find organisms</button>
          <label className="cd-field">Matching organisms / groups<select value={taxid} disabled={busy} onChange={e => setTaxid(e.target.value)}>
            <option value="">Select a result</option>{taxa.map(t => <option key={t.taxid} value={t.taxid}>{t.name} · taxid {t.taxid} · {t.rank}</option>)}
          </select></label></>}
        <div className="cd-row"><label className="cd-field">Protein database<select disabled={busy} value={database} onChange={e => setDatabase(e.target.value)}><option value="refseq_protein">RefSeq proteins</option><option value="nr">NCBI nr</option></select></label>
          <label className="cd-field">Hit-list limit<select value={hits} disabled={busy} onChange={e => setHits(Number(e.target.value))}>{[10, 30, 50, 100].map(h => <option key={h}>{h}</option>)}</select></label></div>
        <p className="cd-muted">All returned accessions are kept, including tied hits. The hit-list limit caps the search; it does not guarantee every possible gene or organism. E-value cutoff: 1 × 10⁻⁵.</p>
        {parsed.queries.length > 5 && <label className="cd-field">Start this batch at input entry<input type="number" min={1} max={parsed.queries.length} disabled={busy} value={batchStart} onChange={e => setBatchStart(Number(e.target.value))} /><small>Up to five proteins per submission batch. All uploaded entries remain available for later batches.</small></label>}
        <label className="cd-checkbox"><input type="checkbox" disabled={busy} checked={consent} onChange={e => setConsent(e.target.checked)} /> Send the selected protein sequences to NCBI for sequence search.</label>
        <button className="cd-primary" disabled={busy || !parsed.queries.length || !consent} onClick={submit}>{busy ? <LoaderCircle className="cd-spin" size={18} /> : <Search size={18} />} Analyse proteins</button>
      </div>
    </div>

    {(busy || message) && <div className="cd-progress" role="status" aria-live="polite"><span>{message}</span>{busy && <progress max={100} value={progress} aria-label="Analysis progress" />}</div>}
    {error && <div className="cd-error" role="alert">{error}</div>}
    {state.demo && <div className="cd-note">OFFLINE SYNTHETIC DEMO · These are illustrative sequences and identifiers, not public database findings.</div>}

    <details className="cd-panel cd-resume"><summary>Resume an NCBI request ID</summary><p className="cd-muted">Paste a request ID and the same original protein sequence above. Resume preserves the first parsed input entry as this request’s query; confirm it is the sequence you submitted.</p>
      <label className="cd-field">BLAST request ID<input value={savedRid} onChange={e => setSavedRid(e.target.value.trim().toUpperCase())} /></label>
      <button className="cd-secondary" disabled={busy || !savedRid || !parsed.queries.length} onClick={() => {
        if (!/^[A-Z0-9-]{5,50}$/.test(savedRid)) { setError('Invalid BLAST request ID.'); return; }
        if (state.jobs.some(j => j.rid === savedRid)) { setMessage('This request is already in your session.'); return; }
        setState(s => ({ ...s, demo: false, queries: parsed.queries, jobs: [...s.jobs, { rid: savedRid, query: parsed.queries[0], status: 'WAITING', next_poll_at: 0, candidates: [], database: 'Resumed NCBI request' }] }));
      }}>Restore request</button>
    </details>

    {state.jobs.length > 0 && <div className="cd-panel"><h2><span>3</span> Search progress & candidates</h2>
      <div className="cd-row"><button className="cd-secondary" disabled={busy || state.demo} onClick={poll}>Check search results</button>
        <button className="cd-secondary" disabled={busy} onClick={() => { setState(empty); setSelection(''); setMessage('This tab’s analysis session was cleared.'); }}>Clear analysis session</button></div>
      <Table rows={[...state.jobs].sort((a, b) => a.query.order - b.query.order).map(j => ({ input_order: j.query.order, query: j.query.id, request_id: j.rid, status: j.status, candidates: j.candidates.length, next_allowed_check: j.status === 'WAITING' ? new Date(j.next_poll_at).toLocaleTimeString() : 'Completed' }))} />
      {state.jobs.some(j => j.status === 'READY' && !j.candidates.length) && <p className="cd-note">A completed search has no hits at this cutoff. This does not establish that no coding gene exists.</p>}
      {candidates.length > 0 && <>
        <p className="cd-muted">Identity refers to the best local alignment (HSP). Query and subject coverage use the union of all alignment intervals. Exact-match labels require a separate comparison with the full retrieved reference.</p>
        <div className="cd-table-wrap"><table aria-label="Candidate proteins"><thead><tr>{['Select', 'Input order', 'Accession', 'Organism', 'Identity', 'Query coverage', 'Subject coverage', 'E-value', 'Full sequence verification'].map(c => <th key={c}>{c}</th>)}</tr></thead><tbody>
          {candidates.map(({ candidate: c, index }) => <tr key={index} className={selected?.index === index ? 'cd-selected' : ''}>
            <td><input type="radio" name="candidate" aria-label={`Select ${c.accession} for query ${c.query_order}`} checked={selected?.index === index} onChange={() => setSelection(index)} disabled={busy} /></td>
            <td>{c.query_order} · {c.query_id}</td><td>{c.accession}</td><td>{c.organism}</td><td>{pct(c.identity_pct)}</td><td>{pct(c.query_coverage_pct)}</td><td>{pct(c.subject_coverage_pct)}</td><td>{c.evalue?.toExponential?.(2) ?? c.evalue}</td><td>{c.verification}</td>
          </tr>)}</tbody></table></div>
        <label className="cd-checkbox"><input type="checkbox" checked={includeGenomic} onChange={e => setIncludeGenomic(e.target.checked)} disabled={busy} /> Retrieve linked genomic DNA and annotated gene structure</label>
        <button className="cd-primary" disabled={busy || state.demo} onClick={retrieve}><Dna size={18} /> Retrieve selected candidate’s linked records</button>
        {selected && <details className="cd-alignments"><summary>View alignment for {selected.candidate.accession}</summary>{selected.candidate.hsps.map((h: any, i: number) => <div key={i}><p>Query {h.query_from}–{h.query_to} · reference {h.hit_from}–{h.hit_to} · E-value {h.evalue}</p><pre>{`Query    ${h.qseq}\n         ${h.midline || ''}\nSubject  ${h.hseq}`}</pre></div>)}</details>}
      </>}
    </div>}

    {detail && <div className="cd-panel cd-details"><h2><span>4</span> Reference-based central dogma</h2>
      <div className="cd-metrics"><div><small>Reference protein</small><strong>{detail.protein.accession}</strong></div><div><small>Organism · taxonomy ID</small><strong>{detail.protein.organism}</strong><span>{detail.protein.taxid || 'Unavailable'}</span></div><div><small>Explicit gene links</small><strong>{(detail.linked_gene_ids || detail.protein.gene_ids).length}</strong></div></div>
      <p className="cd-match">{detail.match}</p>
      {detail.warnings.length > 0 && <details className="cd-note" open><summary>Availability & translation notes ({detail.warnings.length})</summary><ul>{detail.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}</ul></details>}
      <div className="cd-tabs" role="tablist" aria-label="Reference details">{[['gene', 'Gene & location'], ['transcript', 'Transcript & CDS'], ['protein', 'Protein & translation'], ['structure', 'Gene structure'], ['evidence', 'Sources & evidence']].map(([id, label]) => <button key={id} role="tab" aria-selected={view === id} className={view === id ? 'active' : ''} onClick={() => setView(id)}>{label}</button>)}</div>
      <div role="tabpanel">
        {view === 'gene' && <><Table rows={detail.genes.map(({ loci: _loci, ...g }: any) => g)} /><Table rows={detail.genes.flatMap((g: any) => g.loci)} />
          {detail.genomic.map((g: any, i: number) => <div key={i}><h3>{g.accession}:{g.start}–{g.end} · strand {g.strand === -1 ? '−' : g.strand === 1 ? '+' : 'Unavailable'}</h3>
            <p className="cd-muted">{g.assembly_label} · assembly accession: {g.assembly_accession} · chromosome/contig: {g.chromosome} · {g.orientation}</p><Sequence title="Genomic DNA" sequence={g.sequence} /></div>)}</>}
        {view === 'transcript' && <>{!detail.transcripts.length && <p>No explicitly linked transcript/CDS was available.</p>}{detail.transcripts.map((t: any, i: number) => <div key={i} className="cd-transcript"><h3>{t.accession} · {t.molecule_type}</h3>
          <p className="cd-muted">{t.is_transcript ? 'Reference spliced transcript in cDNA alphabet (T). This is not RNA-seq data.' : 'Genomic/nucleotide CDS record; full spliced transcript unavailable.'}</p>
          <Sequence title="Spliced transcript" sequence={t.transcript_sequence} /><Sequence title="CDS" sequence={t.translation.cds} /><p className="cd-muted">Annotated CDS location: {t.cds_location}. Numeric tables use 1-based inclusive coordinates.</p><Table rows={t.features} /></div>)}</>}
        {view === 'protein' && <><Sequence title="Input protein" sequence={detail.query.sequence} /><Sequence title="Reference protein" sequence={detail.protein.sequence} />
          <Table rows={detail.protein.features.filter((f: any) => !['source', 'CDS'].includes(f.type)).map((f: any) => ({ ...f, coordinate_context: 'protein residues' }))} />
          {detail.transcripts.map((t: any, i: number) => <div key={i}><h3>Translation check · {t.accession}</h3><Table rows={[Object.fromEntries(Object.entries(t.translation).filter(([k]) => !['cds', 'computed_protein', 'annotated_protein'].includes(k)))]} /><Sequence title="Computed CDS protein" sequence={t.translation.computed_protein} /><Sequence title="Database annotated protein" sequence={t.translation.annotated_protein} /></div>)}</>}
        {view === 'structure' && <><img className="cd-figure" alt={`Annotated gene and transcript structure for ${detail.protein.accession}`} src={'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(geneStructureSvg(detail))} />
          <div className="cd-row"><button className="cd-secondary" onClick={() => run(() => downloadFile('gene_structure.svg', geneStructureSvg(detail), 'image/svg+xml'))}>Download structure SVG</button><button className="cd-secondary" onClick={() => run(() => downloadFigurePNG(detail))}>Download structure PNG</button></div></>}
        {view === 'evidence' && <><p className="cd-muted">Report retrieval time: {detail.retrieved_at}. Cached records retain their original database fetch date. Reference protein updated: {detail.protein.reference_update_date || 'Unavailable'}.</p>
          <div className="cd-sources">{sourceLink(detail.protein.source, detail.protein.accession)}{detail.transcripts.map((t: any) => <span key={t.accession}>{sourceLink(t.source, t.accession)}</span>)}{detail.genes.map((g: any) => <span key={g.gene_id}>{sourceLink(g.source, `GeneID ${g.gene_id}`)}</span>)}{detail.genomic.map((g: any) => <span key={g.accession}>{sourceLink(g.source, g.accession)}</span>)}</div>
          <Table rows={detail.provenance} /><details><summary>Explicit mapping evidence</summary><pre>{JSON.stringify({ coded_by: detail.protein.coded_by, linked_nucleotide_ids: detail.linked_nucleotide_ids, linked_gene_ids: detail.linked_gene_ids }, null, 2)}</pre></details></>}
      </div>
    </div>}

    {state.jobs.length > 0 && <div className="cd-panel"><h2><span>5</span> Download your results</h2><p className="cd-muted">Exports retain every returned candidate and every retrieved selection. Select further candidates to include their detailed records.</p>
      <div className="cd-downloads"><button className="cd-primary" disabled={busy} onClick={() => run(async () => { setMessage('Preparing Excel report…'); await downloadExcel(state.queries, state.jobs, state.details); setMessage('Excel report prepared.'); })}><Download size={17} /> Excel report (.xlsx)</button>
        <button className="cd-secondary" onClick={() => run(() => downloadFile('central_dogma_evidence.json', JSON.stringify(state, null, 2), 'application/json'))}>Evidence & alignments JSON</button>
        {Object.entries(sequenceDownloads(state.details, state.queries)).map(([name, value]) => <button className="cd-secondary" key={name} onClick={() => run(() => downloadFile(name, value))}>{name}</button>)}</div>
    </div>}
    <p className="cd-footer-note">Searches run on NCBI. The shared website allows 50 new searches per rolling 24 hours. Cached reference responses and completed searches are reused for seven days; stored entries are not automatically deleted; this tab’s analysis state is kept in browser session storage. No language model or model API key is used by this explorer.</p>
  </section>;
}
