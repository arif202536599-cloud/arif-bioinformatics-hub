import React, { useState } from 'react';
import { Table, Plus, Trash2, Download, FileText, Sparkles, Copy, Check, GraduationCap } from 'lucide-react';

interface MatrixRow {
  id: string;
  authorYear: string;
  organism: string;
  methodology: string;
  keyFindings: string;
  knowledgeGap: string;
}

const initialRows: MatrixRow[] = [
  {
    id: '1',
    authorYear: 'Smith et al. (2023)',
    organism: 'Model Biological System',
    methodology: 'High-Throughput RNA-seq & DESeq2',
    keyFindings: 'Identified 142 differentially expressed genes under abiotic stress conditions with significant enrichment in antioxidant pathways.',
    knowledgeGap: 'Upstream transcriptional master regulators and promoter motif binding profiles remain uncharacterized.'
  },
  {
    id: '2',
    authorYear: 'Johnson & Wang (2024)',
    organism: 'Eukaryotic Model Organism',
    methodology: 'AlphaFold 3D Modeling & AutoDock Vina',
    keyFindings: 'Resolved active pocket catalytic triad coordinates with binding affinity of -8.4 kcal/mol.',
    knowledgeGap: 'In vivo validation and physiological cellular dynamics require further verification.'
  }
];

export const LitReviewMatrix: React.FC = () => {
  const [rows, setRows] = useState<MatrixRow[]>(initialRows);
  const [authorYear, setAuthorYear] = useState('');
  const [organism, setOrganism] = useState('');
  const [methodology, setMethodology] = useState('');
  const [keyFindings, setKeyFindings] = useState('');
  const [knowledgeGap, setKnowledgeGap] = useState('');
  const [copied, setCopied] = useState(false);

  // Degree Level state: BS, MPhil, PhD
  const [degreeTrack, setDegreeTrack] = useState<'BS' | 'MPhil' | 'PhD'>('BS');

  // Synopsis Generator state
  const [synopsisTitle, setSynopsisTitle] = useState('Genome-Wide Identification, Structural Modeling, and Transcriptomic Profiling of Stress-Responsive Gene Families');
  const [synopsisBackground, setSynopsisBackground] = useState('Understanding gene expression and structural protein dynamics is fundamental to elucidating biological stress adaptation. Despite advances in high-throughput sequencing, key regulatory networks and docking targets remain uncharacterized.');
  const [synopsisObjectives, setSynopsisObjectives] = useState('1. Identify target gene family members across reference genomes using HMMER and BLAST.\n2. Model differential expression using bulk RNA-seq data across treatment vs control conditions.\n3. Predict 3D macromolecular structures and perform virtual docking against target ligands.');
  const [generatedSynopsis, setGeneratedSynopsis] = useState('');

  const handleAddRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorYear.trim() || !keyFindings.trim()) return;

    const newRow: MatrixRow = {
      id: Date.now().toString(),
      authorYear,
      organism: organism || 'Target Species',
      methodology: methodology || 'Bioinformatics / NGS',
      keyFindings,
      knowledgeGap: knowledgeGap || 'To be explored'
    };

    setRows([...rows, newRow]);
    setAuthorYear('');
    setOrganism('');
    setMethodology('');
    setKeyFindings('');
    setKnowledgeGap('');
  };

  const handleDeleteRow = (id: string) => {
    setRows(rows.filter(r => r.id !== id));
  };

  const exportMatrixCSV = () => {
    let csv = 'Author & Year,Organism,Methodology,Key Findings,Knowledge Gap\n';
    rows.forEach(r => {
      csv += `"${r.authorYear}","${r.organism}","${r.methodology}","${r.keyFindings}","${r.knowledgeGap}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'literature_review_matrix.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateSynopsis = () => {
    const text = `# Academic Research Synopsis & Proposal Outline
## Degree Level: ${degreeTrack === 'BS' ? 'Bachelor of Science (BS) Thesis / Capstone' : degreeTrack === 'MPhil' ? 'Master of Philosophy (MPhil) Thesis Proposal' : 'Doctor of Philosophy (PhD) Dissertation Proposal'}
## Project Title: ${synopsisTitle}

---

### 1. Problem Statement & Background
${synopsisBackground}

### 2. Research Objectives & Hypotheses
${synopsisObjectives}

### 3. Synthesized Literature Matrix & Knowledge Gaps
${rows.map((r, i) => `${i + 1}. **${r.authorYear}** (${r.organism}): Utilized ${r.methodology}. Finding: ${r.keyFindings}. *Identified Gap:* ${r.knowledgeGap}`).join('\n\n')}

### 4. Computational Methodology & Software Stack
- **Sequence Retrieval & Alignment:** NCBI BLAST+, HMMER 3.3, MAFFT / MUSCLE
- **Transcriptomics & Differential Expression:** FastQC, fastp, STAR, featureCounts, DESeq2 (R/Bioconductor)
- **Structural Biology & Docking:** AlphaFold DB / RCSB PDB, AutoDock Vina, PyMOL, CASTp 3.0
- **Pathway & Network Enrichment:** clusterProfiler, STRING v12, KEGG, Reactome

### 5. Expected Scientific Deliverables
- Comprehensive catalog of verified gene family members or expression signatures.
- High-resolution publication-quality figures (Volcano plot, Heatmap, 3D Binding Pose).
- Peer-reviewed research manuscript prepared according to international standard guidelines.

---
*Generated via Arif Bioinformatics Research Hub • Official Website: http://arif_bioinformatics_mastery.com*
`;
    setGeneratedSynopsis(text);
  };

  const handleCopySynopsis = () => {
    if (!generatedSynopsis) return;
    navigator.clipboard.writeText(generatedSynopsis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Matrix Builder */}
      <div className="rounded-3xl bio-glass border-orange-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-200 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-orange-700">
              <Table className="w-4 h-4 text-orange-600" />
              <span>Literature Review Synthesis</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Literature Review Matrix & Gap Finder
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Systematically compare published studies, capture methodological standards, and isolate novel research gaps.
            </p>
          </div>

          <button
            onClick={exportMatrixCSV}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-orange-50 text-slate-800 border border-orange-200 text-xs font-bold flex items-center space-x-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-orange-600" />
            <span>Export Matrix (.CSV)</span>
          </button>
        </div>

        {/* Input Form for new papers */}
        <form onSubmit={handleAddRow} className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-3">
          <span className="text-xs font-extrabold text-orange-950 block">Add New Paper Record:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Author & Year (e.g. Smith et al., 2024)"
              value={authorYear}
              onChange={(e) => setAuthorYear(e.target.value)}
              className="p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
            />
            <input
              type="text"
              placeholder="Model Organism / Cell Line"
              value={organism}
              onChange={(e) => setOrganism(e.target.value)}
              className="p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
            />
            <input
              type="text"
              placeholder="Methodology (e.g. RNA-seq + DESeq2)"
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              className="p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Key Findings / Quantitative Results"
              value={keyFindings}
              onChange={(e) => setKeyFindings(e.target.value)}
              className="p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
            />
            <input
              type="text"
              placeholder="Identified Knowledge Gap / Missing Dimension"
              value={knowledgeGap}
              onChange={(e) => setKnowledgeGap(e.target.value)}
              className="p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Study to Matrix</span>
            </button>
          </div>
        </form>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-2xl border border-orange-200">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-orange-100/90 text-[11px] uppercase font-mono font-extrabold text-orange-950 border-b border-orange-200">
              <tr>
                <th className="p-3">Author & Year</th>
                <th className="p-3">Organism</th>
                <th className="p-3">Methodology</th>
                <th className="p-3">Key Findings</th>
                <th className="p-3">Identified Knowledge Gap</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100 bg-white">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-orange-50/50 transition-colors">
                  <td className="p-3 font-bold text-slate-900 whitespace-nowrap">{row.authorYear}</td>
                  <td className="p-3 font-mono text-slate-700 italic">{row.organism}</td>
                  <td className="p-3 text-slate-700 font-medium">{row.methodology}</td>
                  <td className="p-3 text-slate-800 font-medium">{row.keyFindings}</td>
                  <td className="p-3 text-orange-950 font-semibold bg-orange-50/30">{row.knowledgeGap}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete study row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BS / MPhil / PhD Thesis Planning & Synopsis Builder */}
      <div className="rounded-3xl bio-glass border-orange-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center space-x-2.5 border-b border-orange-200 pb-4">
          <div className="p-2 rounded-xl bg-orange-100 text-orange-600 border border-orange-200">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-950 font-bold border border-orange-300">
                BS • MPhil • PhD Planning
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Research Synopsis & Proposal Generator
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Draft a structured research synopsis integrating your literature matrix into a publication outline.
            </p>
          </div>
        </div>

        {/* Degree Track Selection (BS / MPhil / PhD) */}
        <div>
          <label className="block text-xs font-extrabold text-slate-900 mb-2 uppercase tracking-wide">
            Select Academic Level:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'BS', label: 'BS (Bachelor of Science)', subtitle: 'Senior Capstone / Undergraduate Thesis' },
              { id: 'MPhil', label: 'MPhil (Master of Philosophy)', subtitle: 'Postgraduate Research Thesis Proposal' },
              { id: 'PhD', label: 'PhD (Doctor of Philosophy)', subtitle: 'Doctoral Dissertation & Novel Milestone Plan' }
            ].map((track) => (
              <button
                key={track.id}
                onClick={() => setDegreeTrack(track.id as 'BS' | 'MPhil' | 'PhD')}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer shadow-xs ${
                  degreeTrack === track.id
                    ? 'bg-orange-100 border-orange-400 text-orange-950 scale-[1.02]'
                    : 'bg-white border-orange-200 hover:border-orange-300 text-slate-700'
                }`}
              >
                <div className="font-extrabold text-xs text-slate-900">{track.label}</div>
                <div className="text-[11px] text-slate-600 font-medium mt-0.5">{track.subtitle}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-900 mb-1.5 uppercase tracking-wide">
              Research Proposal Title ({degreeTrack} Level):
            </label>
            <input
              type="text"
              value={synopsisTitle}
              onChange={(e) => setSynopsisTitle(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-900 mb-1.5 uppercase tracking-wide">
              Background & Problem Statement:
            </label>
            <textarea
              rows={3}
              value={synopsisBackground}
              onChange={(e) => setSynopsisBackground(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white border border-orange-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-orange-500 shadow-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-900 mb-1.5 uppercase tracking-wide">
              Research Objectives (Numbered):
            </label>
            <textarea
              rows={3}
              value={synopsisObjectives}
              onChange={(e) => setSynopsisObjectives(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white border border-orange-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-orange-500 shadow-xs leading-relaxed font-mono"
            />
          </div>

          <button
            onClick={handleGenerateSynopsis}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-orange-500/20 cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate {degreeTrack} Thesis Synopsis Outline</span>
          </button>
        </div>

        {/* Output */}
        {generatedSynopsis && (
          <div className="mt-6 rounded-2xl bg-slate-950 border border-orange-200 overflow-hidden shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
              <span className="font-mono text-orange-400 font-bold">
                PROPOSAL_OUTLINE_{degreeTrack.toUpperCase()}.MD
              </span>
              <button
                onClick={handleCopySynopsis}
                className="flex items-center space-x-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px] font-bold">{copied ? 'Copied!' : 'Copy Outline'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {generatedSynopsis}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
