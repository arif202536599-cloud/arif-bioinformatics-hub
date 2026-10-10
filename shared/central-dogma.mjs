import codes from './genetic-codes.json' with { type: 'json' };

export function parseProteins(text) {
  text = String(text).replace(/^\uFEFF/, '').trim();
  if (!text) throw new Error('Paste a protein sequence or upload a FASTA file.');
  if (text.includes('>') && !text.startsWith('>')) throw new Error('FASTA must begin with a > header.');
  if (!text.startsWith('>')) text = `>query_1\n${text}`;
  return text.split(/^>/m).filter(Boolean).map((entry, i) => {
    const [header, ...lines] = entry.split(/\r?\n/);
    const sequence = lines.join('').replace(/\s/g, '').toUpperCase().replace(/\*$/, '');
    if (!sequence || /[^ACDEFGHIKLMNPQRSTVWYBXZJUO]/.test(sequence)) throw new Error(`Entry ${i + 1}: invalid amino-acid sequence. Remove gaps, numbers and internal stops.`);
    if (sequence.length > 10000) throw new Error(`Entry ${i + 1} exceeds 10,000 residues.`);
    return { order: i + 1, id: header.trim().split(/\s/)[0] || `query_${i + 1}`, description: header.trim(), sequence };
  });
}

export function exactMatch(query, reference) {
  if (query === reference) return /[XBZJ]/.test(query) ? 'Identical strings; ambiguous residues prevent a definitive exact match' : 'Exact full-length reference sequence match';
  if (query && reference.includes(query)) return 'Exact fragment of reference; not a full-length match';
  return 'Similar/different sequence; not an exact full-length match';
}

export function unionLength(intervals) {
  const merged = [];
  for (const [a, b] of intervals.map(([a, b]) => [Math.min(a, b), Math.max(a, b)]).sort((a, b) => a[0] - b[0])) {
    const last = merged.at(-1);
    if (last && a <= last[1] + 1) last[1] = Math.max(last[1], b);
    else merged.push([a, b]);
  }
  return merged.reduce((sum, [a, b]) => sum + b - a + 1, 0);
}

export function blastCandidates(data, query) {
  if (!data || !data.BlastOutput2) throw new Error('BLAST returned an unsupported report; this is not a completed no-hit search.');
  const rows = [];
  for (const item of Array.isArray(data.BlastOutput2) ? data.BlastOutput2 : [data.BlastOutput2]) {
    const search = item.report?.results?.search;
    if (!search || search.error) throw new Error(`BLAST report error: ${search?.error || 'search data missing'}`);
    for (const hit of search.hits || []) {
      const hsps = hit.hsps || [];
      if (!hsps.length) continue;
      const best = hsps.reduce((a, b) => a.bit_score > b.bit_score ? a : b);
      for (const desc of hit.description || []) rows.push({
        query_order: query.order, query_id: query.id, accession: desc.accession || '',
        organism: desc.sciname || 'Unavailable in search response', taxid: desc.taxid,
        title: desc.title, subject_length: hit.len,
        identity_pct: 100 * best.identity / best.align_len,
        query_coverage_pct: Math.min(100, 100 * unionLength(hsps.map(h => [h.query_from, h.query_to])) / (search.query_len || query.sequence.length)),
        subject_coverage_pct: hit.len ? Math.min(100, 100 * unionLength(hsps.map(h => [h.hit_from, h.hit_to])) / hit.len) : null,
        evalue: best.evalue, bit_score: best.bit_score, hsps,
        verification: 'Not verified against complete reference sequence',
      });
    }
  }
  return rows;
}

function splitLocations(text) {
  let depth = 0, start = 0;
  const parts = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '(') depth++;
    if (text[i] === ')') depth--;
    if (text[i] === ',' && depth === 0) { parts.push(text.slice(start, i)); start = i + 1; }
  }
  parts.push(text.slice(start));
  return parts;
}

// GenBank locations remain 1-based inclusive. Complement reverses biological
// segment order as well as strand; order() never silently becomes a splice.
export function locationParts(location) {
  const text = String(location).replace(/\s/g, '');
  if (text.startsWith('complement(') && text.endsWith(')')) return locationParts(text.slice(11, -1)).reverse().map(p => ({ ...p, strand: -p.strand }));
  if (text.startsWith('join(') && text.endsWith(')')) return splitLocations(text.slice(5, -1)).flatMap(locationParts);
  if (text.startsWith('order(')) throw new Error('An order() location does not establish a contiguous CDS.');
  const m = /^(?:([A-Za-z0-9_.]+):)?([<>]?)(\d+)(?:\.\.([<>]?)(\d+))?$/.exec(text);
  if (!m) throw new Error(`Unsupported or uncertain location: ${text}`);
  const start = Number(m[3]), end = Number(m[5] || m[3]);
  if (start < 1 || end < start) throw new Error('Invalid location boundaries.');
  return [{ accession: m[1] || '', start, end, strand: 1, partial: Boolean(m[2] || m[4]) }];
}

export function reverseComplement(sequence) {
  const complements = { A:'T', T:'A', U:'A', C:'G', G:'C', R:'Y', Y:'R', K:'M', M:'K', S:'S', W:'W', B:'V', V:'B', D:'H', H:'D', N:'N' };
  return [...sequence.toUpperCase()].reverse().map(c => complements[c] || 'N').join('');
}

export function translateCDS(record, feature, reference, query) {
  const qualifiers = feature.qualifiers || {};
  const parts = locationParts(feature.location);
  const notes = [], positions = [];
  const dna = parts.map(p => {
    if (p.accession && p.accession !== record.accession) throw new Error('CDS requires another nucleotide record; remote segments were not invented.');
    if (p.end > record.sequence.length) throw new Error('CDS extends beyond the retrieved record.');
    const segment = record.sequence.slice(p.start - 1, p.end);
    const indexes = Array.from({ length: p.end - p.start + 1 }, (_, i) => p.start + i);
    positions.push(...(p.strand === -1 ? indexes.reverse() : indexes));
    return p.strand === -1 ? reverseComplement(segment) : segment;
  }).join('');
  const codonStart = Number(qualifiers.codon_start?.[0] || 1);
  if (![1, 2, 3].includes(codonStart)) throw new Error('Invalid codon_start annotation.');
  const codeId = Number(qualifiers.transl_table?.[0] || 1), code = codes[String(codeId)];
  if (!code) throw new Error(`Genetic code ${codeId} is unsupported; no default translation was substituted.`);
  const coding = dna.slice(codonStart - 1), map = positions.slice(codonStart - 1);
  const usableLength = coding.length - coding.length % 3;
  const residues = [];
  for (let i = 0; i < usableLength; i += 3) residues.push(code.codons[coding.slice(i, i + 3)] || 'X');
  const partial = parts.some(p => p.partial), startCodon = coding.slice(0, 3);
  const completeStartStop = !partial && codonStart === 1 && coding.length % 3 === 0 && code.starts.includes(startCodon) && code.stops.includes(coding.slice(-3));
  // Complete CDS translation uses annotated initiation rules; a partial CDS
  // retains the ordinary residue from the supplied genetic code.
  if (completeStartStop && residues.length) { residues[0] = 'M'; residues[residues.length - 1] = '*'; }
  if (code.dual_stop_codons?.length) notes.push('This genetic code has context-dependent stop codons. Annotated complete-CDS terminal stops are treated as stops; internal codons retain their amino-acid meaning.');
  if (partial) notes.push('Partial/fuzzy CDS boundaries are annotated.');
  if (codonStart !== 1) notes.push(`codon_start=${codonStart}; the initial ${codonStart - 1} nucleotide(s) were excluded.`);
  if (coding.length % 3) notes.push('Incomplete terminal codon excluded from computed translation.');
  const applied = [], unresolved = [];
  for (const annotation of qualifiers.transl_except || []) {
    try {
      const m = /^\(pos:(.+),aa:([^,()]+)\)$/.exec(annotation);
      if (!m) throw new Error('unrecognised syntax');
      const ep = locationParts(m[1]);
      if (ep.some(p => p.partial || p.accession)) throw new Error('remote/uncertain exception');
      const coords = ep.flatMap(p => Array.from({ length: p.end - p.start + 1 }, (_, i) => p.start + i));
      const indexes = coords.map(p => { if (map.indexOf(p) !== map.lastIndexOf(p)) throw new Error('ambiguous CDS position'); return map.indexOf(p); }).sort((a, b) => a - b);
      if (indexes.length !== 3 || indexes[0] < 0 || indexes[0] % 3 || indexes.some((n, i) => n !== indexes[0] + i) || indexes[2] >= usableLength) throw new Error('not one complete translated codon');
      const amino = { Sec:'U', Pyl:'O', TERM:'*', Ala:'A', Arg:'R', Asn:'N', Asp:'D', Cys:'C', Gln:'Q', Glu:'E', Gly:'G', His:'H', Ile:'I', Leu:'L', Lys:'K', Met:'M', Phe:'F', Pro:'P', Ser:'S', Thr:'T', Trp:'W', Tyr:'Y', Val:'V', OTHER:'X' }[m[2]];
      if (!amino) throw new Error('unsupported amino-acid annotation');
      residues[indexes[0] / 3] = amino;
      applied.push({ annotation, protein_position: indexes[0] / 3 + 1, residue: amino });
    } catch (error) { unresolved.push(annotation); notes.push(`Unresolved ${annotation}: ${error.message}.`); }
  }
  const translated = residues.join('').replace(/\*$/, '');
  if (!completeStartStop) notes.push('Complete CDS start/stop validation failed; basic translation shown.');
  if (translated.includes('*')) notes.push('Computed translation contains an internal stop.');
  for (const exception of qualifiers.exception || []) notes.push(`Processing/translation exception: ${exception}. Free text alone does not define recoding.`);
  if (translated !== reference) notes.push('Computed CDS translation differs from the full reference protein. Review annotations, processing and reference versions.');
  return { cds: dna, computed_protein: translated, annotated_protein: qualifiers.translation?.[0] || '', genetic_code: codeId,
    codon_start: codonStart, partial, complete_cds_validated: completeStartStop && !translated.includes('*') && !applied.length && !unresolved.length && !(qualifiers.exception || []).length,
    computed_equals_reference: translated === reference, computed_equals_query: translated === query,
    annotated_equals_reference: qualifiers.translation?.[0] ? qualifiers.translation[0] === reference : null,
    translation_exceptions_applied: applied, translation_exceptions_unresolved: unresolved, notes };
}

export function transcriptEvidence(record, protein, query) {
  const matches = record.features.filter(f => f.type === 'CDS' && f.qualifiers.protein_id?.includes(protein.accession));
  if (!matches.length) throw new Error(`${record.accession}: no CDS explicitly links to ${protein.accession}.`);
  return matches.map(feature => {
    const isTranscript = /rna/i.test(record.molecule_type) && !/dna/i.test(record.molecule_type) && !record.slice;
    const translation = translateCDS(record, feature, protein.sequence, query);
    const features = locationParts(feature.location).map((p, i) => ({ ...p, feature: 'CDS', part: i + 1, evidence: 'Annotated CDS', parent: record.accession }));
    if (isTranscript && features.every(f => f.strand === 1)) {
      const start = Math.min(...features.map(f => f.start)), end = Math.max(...features.map(f => f.end));
      const startPartial = features[0].partial, endPartial = features.at(-1).partial;
      if (start > 1 && !startPartial) features.push({ feature: "5′ UTR", start: 1, end: start - 1, strand: 1, evidence: 'Inferred from transcript and selected CDS boundaries', parent: record.accession });
      if (end < record.sequence.length && !endPartial) features.push({ feature: "3′ UTR", start: end + 1, end: record.sequence.length, strand: 1, evidence: 'Inferred from transcript and selected CDS boundaries', parent: record.accession });
    }
    return { accession: record.accession, is_transcript: isTranscript, molecule_type: record.molecule_type,
      transcript_sequence: isTranscript ? record.sequence : '', cds_location: feature.location, gene_names: feature.qualifiers.gene || [],
      gene_ids: (feature.qualifiers.db_xref || []).filter(x => x.startsWith('GeneID:')).map(x => x.slice(7)),
      translation, features, source: record.source, provenance: record.provenance,
      warnings: isTranscript ? [] : ['This is a genomic/DNA record or fetched slice. Its complete sequence is not labelled a spliced transcript.'] };
  });
}

export function fasta(entries) {
  return entries.filter(e => e.sequence).map(e => `>${e.id.replace(/[\r\n]/g, ' ')}\n${e.sequence.match(/.{1,70}/g).join('\n')}\n`).join('');
}

export function geneStructureSvg(detail) {
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;' }[c]));
  const rows = [];
  for (const g of detail.genomic || []) {
    for (const parent of new Set(g.features.filter(f => f.feature !== 'gene').map(f => f.parent))) rows.push({
      label: `${g.accession} / ${parent}`, origin: g.start, length: g.end - g.start + 1,
      sublabel: `origin ${g.start}; strand ${g.strand === -1 ? '−' : g.strand === 1 ? '+' : 'unknown'}`,
      features: g.features.filter(f => f.parent === parent && f.feature !== 'gene'),
    });
  }
  if (!rows.length) for (const t of detail.transcripts || []) rows.push({ label: t.accession, origin: 1,
    length: Math.max(...t.features.map(f => f.end), t.transcript_sequence.length), sublabel: t.is_transcript ? 'transcript coordinates' : 'nucleotide record coordinates', features: t.features });
  const max = Math.max(1, ...rows.map(r => r.length)), height = Math.max(210, rows.length * 78 + 140), width = 1100;
  let body = `<rect width="${width}" height="${height}" fill="white"/><text x="30" y="35" font-size="20" font-weight="bold">Gene / transcript structure · ${escape(detail.protein.accession)}</text>`;
  if (!rows.length) body += '<text x="30" y="100">Annotated structure is unavailable for this reference.</text>';
  rows.forEach((r, i) => {
    const y = 85 + i * 78;
    body += `<text x="25" y="${y - 8}" font-size="13">${escape(r.label)}</text><text x="25" y="${y + 13}" fill="#64748b" font-size="11">${escape(r.sublabel)}</text><line x1="355" x2="${355 + r.length / max * 690}" y1="${y}" y2="${y}" stroke="#94a3b8"/>`;
    for (const f of [...r.features].sort((a, b) => Number(a.feature === 'CDS') - Number(b.feature === 'CDS'))) {
      const x = 355 + (f.start - r.origin) / max * 690, w = Math.max(1, (f.end - f.start + 1) / max * 690);
      const color = f.feature === 'CDS' ? '#0d9488' : /UTR/.test(f.feature) ? '#eab308' : f.feature === 'exon' ? '#86cba7' : '#b8cad6';
      if (f.feature === 'intron') body += `<line x1="${x}" x2="${x + w}" y1="${y}" y2="${y}" stroke="#475569" stroke-dasharray="4 3"/>`;
      else body += `<rect x="${x}" y="${y - (f.feature === 'CDS' ? 12 : 7)}" width="${w}" height="${f.feature === 'CDS' ? 24 : 14}" fill="${color}"/>`;
    }
  });
  body += `<text x="355" y="${height - 55}" font-size="12">Reference region position: 1 to ${max} bp (absolute origins shown per row)</text><text x="30" y="${height - 25}" font-size="12" fill="#475569">Teal: CDS · green: exon · yellow: UTR · pale: mRNA · dashed: inferred/annotated intron</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="Arial, sans-serif">${body}</svg>`;
}
