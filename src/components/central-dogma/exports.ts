import { fasta, geneStructureSvg } from '../../../shared/central-dogma.mjs';

export function downloadFile(name: string, contents: Blob | string, mime = 'text/plain') {
  const blob = contents instanceof Blob ? contents : new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob), anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function sequenceDownloads(details: Record<string, any>, queries?: any[]): Record<string, string> {
  const entries: Record<string, { id: string; sequence: string }[]> = { query_proteins: [], reference_proteins: [], transcripts: [], cds: [], computed_proteins: [], genomic_dna: [] };
  for (const [key, d] of Object.entries(details).sort((a, b) => a[1].query.order - b[1].query.order)) {
    entries.query_proteins.push({ id: key, sequence: d.query.sequence });
    entries.reference_proteins.push({ id: `${key} reference=${d.protein.accession}`, sequence: d.protein.sequence });
    for (const t of d.transcripts) {
      if (t.transcript_sequence) entries.transcripts.push({ id: `${key} ${t.accession} transcript_cDNA_alphabet`, sequence: t.transcript_sequence });
      entries.cds.push({ id: `${key} ${t.accession} CDS`, sequence: t.translation.cds });
      entries.computed_proteins.push({ id: `${key} ${t.accession} computed_translation`, sequence: t.translation.computed_protein });
    }
    for (const g of d.genomic) entries.genomic_dna.push({ id: `${key} ${g.accession}:${g.start}-${g.end} strand=${g.strand} orientation=${g.orientation}`, sequence: g.sequence });
  }
  if (queries) entries.query_proteins = [...queries].sort((a, b) => a.order - b.order).map(q => ({ id: `${q.order}:${q.id}`, sequence: q.sequence }));
  return Object.fromEntries(Object.entries(entries).map(([name, rows]) => [name + '.fasta', fasta(rows)]).filter(([, value]) => value));
}

export async function downloadExcel(queries: any[], jobs: any[], details: Record<string, any>) {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Protein-to-Central-Dogma Explorer';
  const add = (name: string, rows: any[]) => {
    const ws = workbook.addWorksheet(name);
    const keys = [...new Set(rows.flatMap(row => Object.keys(row)))];
    ws.columns = (keys.length ? keys : ['Status']).map(key => ({ header: key, key, width: 28 }));
    if (!rows.length) rows = [{ Status: 'No available records' }];
    for (const row of rows) ws.addRow(Object.fromEntries(Object.entries(row).map(([key, value]) => {
      let v: any = typeof value === 'object' ? JSON.stringify(value) : value;
      if (typeof v === 'string') {
        if (/^[=+\-@]/.test(v)) v = "'" + v;
        if (v.length > 30000) v = v.slice(0, 29800) + ' [TRUNCATED IN EXCEL; download full JSON/FASTA]';
      }
      return [key, v];
    })));
    ws.views = [{ state: 'frozen', ySplit: 1 }];
    ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: Math.max(1, ws.rowCount), column: ws.columnCount } };
    ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } };
  };
  const selections = Object.entries(details);
  add('Queries', queries);
  add('Candidates', [...jobs].sort((a,b)=>a.query.order-b.query.order).flatMap(j => j.candidates.map(({ hsps: _hsps, ...c }: any) => ({ rid: j.rid, ...c }))));
  add('Searches', jobs.map(({ candidates: _candidates, raw: _raw, ...j }) => j));
  add('Proteins', selections.map(([key, d]) => ({ selection: key, accession: d.protein.accession, organism: d.protein.organism, taxid: d.protein.taxid, gene_names: d.protein.gene_names, gene_ids: d.protein.gene_ids, match: d.match, reference_update_date: d.protein.reference_update_date, source: d.protein.source, protein_sequence: d.protein.sequence })));
  add('Genes', selections.flatMap(([key, d]) => d.genes.map(({ loci: _loci, ...g }: any) => ({ selection: key, ...g }))));
  add('Gene_Loci', selections.flatMap(([key, d]) => d.genes.flatMap((g: any) => g.loci.map((l: any) => ({ selection: key, ...l })))));
  add('Transcripts_CDS', selections.flatMap(([key, d]) => d.transcripts.map(({ features: _features, translation, ...t }: any) => ({ selection: key, ...t, cds: translation.cds, computed_protein: translation.computed_protein }))));
  add('Translation_Checks', selections.flatMap(([key, d]) => d.transcripts.map((t: any) => ({ selection: key, accession: t.accession, ...t.translation }))));
  add('Genomic_Records', selections.flatMap(([key, d]) => d.genomic.map(({ sequence, features: _features, ...g }: any) => ({ selection: key, ...g, sequence_length: sequence.length }))));
  add('Structure', selections.flatMap(([key, d]) => [...d.genomic.flatMap((g: any) => g.features.map((f: any) => ({ selection: key, accession: g.accession, ...f, context: 'genomic 1-based inclusive' }))), ...d.transcripts.flatMap((t: any) => t.features.map((f: any) => ({ selection: key, accession: t.accession, ...f, context: 'transcript/nucleotide 1-based inclusive' })))]));
  add('Sources_Dates', selections.flatMap(([key, d]) => d.provenance.map((p: any) => ({ selection: key, report_retrieved_at: d.retrieved_at, ...p }))));
  add('Warnings', selections.flatMap(([key, d]) => d.warnings.map((warning: string) => ({ selection: key, warning }))));
  add('Methods', [
    { rule: 'Identity', detail: 'Best local HSP identity; coverage uses the union of all HSP coordinates.' },
    { rule: 'Exact match', detail: 'Requires complete retrieved reference sequence equality; ambiguous residues prevent a definitive exact label.' },
    { rule: 'Reference evidence', detail: 'Does not prove sample origin, uniquely reconstruct DNA, or infer RNA-seq expression.' },
    { rule: 'Scope', detail: 'All returned candidates are preserved, but the hit-list cap is not an exhaustive database search. Web genomic fetches are capped at 1 Mb.' },
    { rule: 'Genetic codes', detail: 'Biopython 1.88 genetic code tables; transl_table, codon_start and explicit codon-position exceptions are recorded.' },
  ]);
  const data = await workbook.xlsx.writeBuffer();
  downloadFile('central_dogma_report.xlsx', new Blob([data as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
}

export async function downloadFigurePNG(detail: any) {
  const svg = geneStructureSvg(detail), url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Figure could not be rendered. Download SVG instead.')); image.src = url; });
    const canvas = document.createElement('canvas'); canvas.width = image.width * 2; canvas.height = image.height * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('PNG rendering is unavailable. Download SVG instead.');
    ctx.scale(2, 2); ctx.drawImage(image, 0, 0);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
    if (blob) downloadFile('gene_structure.png', blob);
  } finally { URL.revokeObjectURL(url); }
}
