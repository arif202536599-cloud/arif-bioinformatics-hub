import { transcriptEvidence } from '../../../shared/central-dogma.mjs';

export function centralDogmaDemo() {
  const query = { order: 1, id: 'DEMO_PROTEIN', description: 'Synthetic demonstration', sequence: 'MAEFG' };
  const protein = { accession: 'DEMO_PROTEIN.1', sequence: 'MAEFG', organism: 'Synthetic demonstration — not a species', taxid: null, gene_ids: ['DEMO_GENE'], gene_names: ['DEMO_GENE'], features: [], coded_by: ['DEMO_TRANSCRIPT.1:4..21'], source: 'Synthetic fixture', provenance: { database_fetched_at: 'No database retrieval', served_from_cache: false } };
  const record = { accession: 'DEMO_TRANSCRIPT.1', sequence: 'AAAATGGCTGAATTTGGTTAAACC', molecule_type: 'mRNA', source: 'Synthetic fixture', provenance: protein.provenance,
    features: [{ type: 'CDS', location: '4..21', qualifiers: { protein_id: [protein.accession], gene: ['DEMO_GENE'], translation: ['MAEFG'] } }] };
  const locus = { gene_id: 'DEMO_GENE', gene_name: 'DEMO_GENE', accession: 'DEMO_CONTIG.1', start: 101, end: 130, strand: 1, assembly_label: 'Synthetic', assembly_accession: 'Synthetic', chromosome: 'Synthetic contig', source: 'Synthetic fixture' };
  const detail = { query, protein, match: 'Exact full-length reference sequence match', transcripts: transcriptEvidence(record, protein, query.sequence),
    genes: [{ gene_id: 'DEMO_GENE', gene_name: 'DEMO_GENE', description: 'Synthetic gene', summary: 'Not a real database record', loci: [locus], source: 'Synthetic fixture' }],
    genomic: [{ ...locus, sequence: 'AAAATGGCTGTCCAGGAATTTGGTTAAACC', orientation: 'gene 5prime to 3prime', provenance: protein.provenance, features: [
      { feature: 'exon', start: 101, end: 109, strand: 1, parent: record.accession, evidence: 'Synthetic' },
      { feature: 'intron', start: 110, end: 115, strand: 1, parent: record.accession, evidence: 'Synthetic' },
      { feature: 'exon', start: 116, end: 130, strand: 1, parent: record.accession, evidence: 'Synthetic' },
      { feature: 'CDS', start: 104, end: 109, strand: 1, parent: record.accession, evidence: 'Synthetic' },
      { feature: 'CDS', start: 116, end: 127, strand: 1, parent: record.accession, evidence: 'Synthetic' },
    ] }], warnings: ['SYNTHETIC DEMO: these identifiers, coordinates and sequences are examples, not database evidence.'],
    provenance: [protein.provenance], retrieved_at: 'Synthetic demonstration', linked_nucleotide_ids: [record.accession] };
  const candidate = { query_order: 1, query_id: query.id, accession: protein.accession, organism: protein.organism, taxid: null, subject_length: 5, identity_pct: 100, query_coverage_pct: 100, subject_coverage_pct: 100, evalue: 0, bit_score: 0, hsps: [], verification: detail.match };
  return { queries: [query], jobs: [{ rid: 'DEMO', query, status: 'READY', candidates: [candidate], next_poll_at: 0, database: 'Synthetic fixture' }], details: { '1:DEMO_PROTEIN.1': detail }, demo: true };
}
