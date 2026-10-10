import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseProteins, exactMatch, unionLength, blastCandidates, locationParts, reverseComplement, translateCDS, transcriptEvidence, geneStructureSvg } from '../shared/central-dogma.mjs';
import { parseRecord, parseGene, genomicEvidence, xml } from '../server/central-dogma.mjs';
const fixture = name => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
const protein = parseRecord(fixture('NP_000509.1.xml'), 'protein');
const rna = parseRecord(fixture('NM_000518.5.xml'), 'nuccore');
const translate = (sequence, location = `1..${sequence.length}`, qualifiers = {}, ref = '') => translateCDS({ sequence, accession: 'TEST.1' }, { location, qualifiers }, ref, ref);

describe('sequence input and alignment evidence', () => {
  it('preserves duplicate IDs, order, uncommon residues and a terminal stop', () => {
    expect(parseProteins('>x first\nmaeu*\n>x second\nMO')).toEqual([
      { order:1,id:'x',description:'x first',sequence:'MAEU' }, { order:2,id:'x',description:'x second',sequence:'MO' }]);
  });
  it.each(['', '>empty\n', 'M12A', 'MA-EL', 'M*EL', 'MA\n>x\nMP'])('rejects invalid protein %s', text => expect(() => parseProteins(text)).toThrow());
  it('accepts plain sequence without inventing an organism', () => expect(parseProteins('maefg')[0].sequence).toBe('MAEFG'));
  it('does not label local alignment or ambiguous equality exact', () => {
    expect(exactMatch('MA', 'MAEFG')).toContain('fragment');
    expect(exactMatch('MAX', 'MAX')).toContain('ambiguous');
    expect(exactMatch('MAEFG','MAEFG')).toBe('Exact full-length reference sequence match');
  });
  it('unions overlapping HSP coverage and keeps all tied descriptions', () => {
    const hsps = [{bit_score:20,identity:5,align_len:5,query_from:1,query_to:5,hit_from:1,hit_to:5,evalue:0.001}, {bit_score:20,identity:5,align_len:5,query_from:4,query_to:8,hit_from:4,hit_to:8,evalue:0.001}];
    const rows = blastCandidates({BlastOutput2:[{report:{results:{search:{query_len:10,hits:[{len:20,hsps,description:[{accession:'A.1'},{accession:'B.2'}]}]}}}}]}, {order:1,id:'q',sequence:'M'.repeat(10)});
    expect(rows).toHaveLength(2); expect(rows[0].query_coverage_pct).toBe(80); expect(rows[0].subject_coverage_pct).toBe(40);
    expect(rows[0].verification).toContain('Not verified'); expect(unionLength([[5,1],[4,8]])).toBe(8);
  });
  it('distinguishes invalid reports from completed no-hit reports', () => {
    expect(() => blastCandidates({}, {sequence:'M'})).toThrow();
    expect(blastCandidates({BlastOutput2:[{report:{results:{search:{hits:[]}}}}]}, {sequence:'M'})).toEqual([]);
  });
});

describe('CDS extraction and genetic-code verification', () => {
  it('handles negative strand joined segment order', () => {
    expect(locationParts('complement(join(1..3,7..9))').map(p => [p.start,p.end,p.strand])).toEqual([[7,9,-1],[1,3,-1]]);
    expect(translate('TTACCCCAT','complement(join(1..3,7..9))',{},'M').computed_protein).toBe('M');
  });
  it('translates alternative complete bacterial initiation', () => {
    const t = translate('GTGGCTTAA','1..9',{transl_table:['11']},'MA');
    expect(t.computed_protein).toBe('MA'); expect(t.complete_cds_validated).toBe(true);
  });
  it('uses mitochondrial genetic code rather than always standard code', () => {
    expect(translate('ATATGAAGA','1..9',{transl_table:['2']},'MW').computed_protein).toBe('MW');
  });
  it('retains codon_start and incomplete terminal codons', () => {
    const t = translate('AATGGCTA','1..8',{codon_start:['2']},'MA');
    expect(t.computed_protein).toBe('MA'); expect(t.complete_cds_validated).toBe(false);
    expect(t.notes.join(' ')).toContain('Incomplete terminal codon');
  });
  it('applies selenocysteine only with explicit mapped codon annotation', () => {
    const t = translate('ATGTGATAA','1..9',{transl_except:['(pos:4..6,aa:Sec)']},'MU');
    expect(t.computed_protein).toBe('MU'); expect(t.translation_exceptions_applied).toHaveLength(1);
    expect(t.complete_cds_validated).toBe(false);
  });
  it('reports unresolvable exceptions and free-text processing', () => {
    const t = translate('ATGGCTTAA','1..9',{transl_except:['(pos:2..4,aa:Sec)'],exception:['ribosomal slippage']},'MA');
    expect(t.translation_exceptions_unresolved).toHaveLength(1); expect(t.notes.join(' ')).toContain('ribosomal slippage');
  });
  it('rejects unknown genetic codes, remote segments and order()', () => {
    expect(() => translate('ATGTAA','1..6',{transl_table:['999']})).toThrow('unsupported');
    expect(() => translate('ATGTAA','OTHER.1:1..6')).toThrow('another nucleotide');
    expect(() => locationParts('order(1..3,7..9)')).toThrow('contiguous');
  });
  it('does not call a genomic DNA record an mRNA or accept a different protein version', () => {
    const record = {...rna,molecule_type:'DNA'};
    expect(transcriptEvidence(record,protein,protein.sequence)[0].transcript_sequence).toBe('');
    expect(() => transcriptEvidence(rna,{...protein,accession:'NP_000509.2'},protein.sequence)).toThrow('explicitly');
  });
  it('does not infer a complete 3-prime UTR from a fuzzy CDS end', () => {
    const r = {accession:'T.1',sequence:'AAAATGGCTTAACCC',molecule_type:'mRNA',features:[{type:'CDS',location:'4..>12',qualifiers:{protein_id:['P.1']}}]};
    const t = transcriptEvidence(r,{accession:'P.1',sequence:'MA'},'MA')[0];
    expect(t.features.filter(x=>x.feature==='3′ UTR')).toHaveLength(0);
  });
  it('reverse complements ambiguous nucleotide symbols', () => expect(reverseComplement('ATGRY')).toBe('RYCAT'));
});

describe('archived public NCBI records (no remote requests)', () => {
  it('maps versioned protein to explicitly linked transcript and validates translation', () => {
    expect(protein.taxid).toBe('9606'); expect(protein.coded_by).toContain('NM_000518.5:51..494');
    const t = transcriptEvidence(rna,protein,protein.sequence)[0];
    expect(t.translation.computed_equals_reference).toBe(true); expect(t.translation.complete_cds_validated).toBe(true);
    expect(t.accession).toBe('NM_000518.5'); expect(t.transcript_sequence.length).toBeGreaterThan(t.translation.cds.length);
  });
  it('extracts only gene loci, preserves alternative assemblies and 1-based negative coordinates', () => {
    const gene = parseGene(fixture('Gene3043.xml'))[0]; expect(gene.gene_id).toBe('3043'); expect(gene.loci).toHaveLength(4);
    expect(gene.loci.find(l=>l.accession==='NC_000011.10')).toMatchObject({start:5225464,end:5227071,strand:-1});
    expect(gene.loci.some(l=>l.accession==='NC_060935.1')).toBe(true);
  });
  it('validates archived negative-strand genomic CDS and explicit assembly links', () => {
    const r = {...parseRecord(fixture('HBB_genomic_slice.xml'),'nuccore'),slice:true};
    const locus=parseGene(fixture('Gene3043.xml'))[0].loci.find(l=>l.accession==='NC_000011.10');
    const g=genomicEvidence(r,locus,protein.accession,['NM_000518.5']);
    expect(r.sequence.length).toBe(1608);expect(g.assembly_accession).toBe('Assembly:GCF_000001405.40');
    expect(transcriptEvidence(r,protein,protein.sequence)[0].translation.computed_equals_reference).toBe(true);
    expect(g.features.filter(f=>f.feature==='intron')).toHaveLength(2);
  });
  it('turns slice-relative mRNA gaps into absolute introns and gene-oriented DNA', () => {
    const record = {accession:'C.1',sequence:'A'.repeat(30),dbxrefs:['Assembly:GCF_TEST'],features:[{type:'mRNA',location:'complement(join(1..9,16..30))',qualifiers:{db_xref:['GeneID:7'],transcript_id:['T.1']}}]};
    const g=genomicEvidence(record,{gene_id:'7',accession:'C.1',start:101,end:130,strand:-1},'P.1',['T.1']);
    expect(g.sequence).toBe('T'.repeat(30)); expect(g.features.find(f=>f.feature==='intron')).toMatchObject({start:110,end:115,strand:-1});
    expect(g.assembly_accession).toBe('Assembly:GCF_TEST');
  });
  it('escapes diagram labels and reports unavailable structure', () => {
    const svg = geneStructureSvg({protein:{accession:'<script>'},transcripts:[],genomic:[]});
    expect(svg).toContain('&lt;script&gt;'); expect(svg).not.toContain('<script>'); expect(svg).toContain('unavailable');
  });
  it.each(['<ERROR>Unavailable</ERROR>','<html>Bad service</html>','<GBSet>'])('rejects service error %s', text => expect(() => xml(text)).toThrow());
});
