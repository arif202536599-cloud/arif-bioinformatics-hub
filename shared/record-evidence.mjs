import { locationParts, reverseComplement } from './central-dogma.mjs';

export function genomicEvidence(record, locus, proteinAccession, transcriptAccessions) {
  const features = [], warnings = [];
  for (const feature of record.features) {
    const q = feature.qualifiers;
    if (!(q.db_xref?.includes(`GeneID:${locus.gene_id}`) || q.protein_id?.includes(proteinAccession) || q.transcript_id?.some(x => transcriptAccessions.includes(x)))) continue;
    if (!['gene', 'mRNA', 'CDS', 'exon', 'intron', "5'UTR", "3'UTR"].includes(feature.type)) continue;
    try {
      const parent = q.transcript_id?.[0] || q.protein_id?.[0] || locus.gene_id;
      const parts = locationParts(feature.location);
      features.push(...parts.map(p => ({ ...p, start: p.start + locus.start - 1, end: p.end + locus.start - 1,
        feature: feature.type, parent, evidence: 'Annotated genomic feature', accession: locus.accession })));
      if (feature.type === 'mRNA') {
        const sorted = [...parts].sort((a, b) => a.start - b.start);
        for (let i = 1; i < sorted.length; i++) if (sorted[i].start > sorted[i - 1].end + 1) features.push({
          feature: 'intron', start: sorted[i - 1].end + locus.start, end: sorted[i].start + locus.start - 2,
          strand: sorted[i].strand, parent, accession: locus.accession, evidence: 'Inferred from this annotated mRNA exon gap' });
      }
    } catch (e) { warnings.push(`Unsupported genomic feature: ${e.message}`); }
  }
  const source = record.features.find(f => f.type === 'source');
  const assembly = record.dbxrefs.filter(x => x.startsWith('Assembly:')).join('; ');
  if (!locus.strand) warnings.push('Gene strand is unavailable. Genomic DNA is in forward reference orientation.');
  return { ...locus, sequence: locus.strand === -1 ? reverseComplement(record.sequence) : record.sequence,
    orientation: locus.strand ? 'gene 5prime to 3prime' : 'forward reference; gene orientation unavailable',
    chromosome: source?.qualifiers.chromosome?.[0] || 'Unavailable; contig accession shown',
    assembly_accession: assembly || locus.assembly_accession, features, warnings,
    provenance: record.provenance, source: `${record.source}?from=${locus.start}&to=${locus.end}` };
}
