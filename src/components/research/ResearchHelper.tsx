import React, { useState } from 'react';
import { 
  Compass, Lightbulb, CheckCircle2, Sparkles, BookOpen, 
  Layers, ArrowRight, FileSpreadsheet, Activity, Database, Download, Award
} from 'lucide-react';

interface ResearchHelperProps {
  onNavigate?: (tab: string, extraId?: string) => void;
}

export const ResearchHelper: React.FC<ResearchHelperProps> = ({ onNavigate }) => {
  const [degreeLevel, setDegreeLevel] = useState<'BS' | 'MPhil' | 'PhD'>('MPhil');
  const [researchDomain, setResearchDomain] = useState<string>('transcriptomics');
  const [targetSampleType, setTargetSampleType] = useState<string>('plants');

  const domainGuides: Record<string, {
    title: string;
    description: string;
    recommendedTools: string[];
    statMethod: string;
    keyMilestones: string[];
    commonTraps: string;
  }> = {
    transcriptomics: {
      title: 'Bulk & Single-Cell RNA-seq Transcriptomics',
      description: 'Quantifying differential gene expression, alternative splicing, and functional pathway enrichment across biological conditions.',
      recommendedTools: ['FastQC / fastp', 'STAR or HISAT2', 'featureCounts', 'DESeq2 (R/Bioconductor)', 'clusterProfiler (GO/KEGG)', 'EnhancedVolcano'],
      statMethod: 'Negative Binomial Generalized Linear Model (Wald Test / Likelihood Ratio Test) with Benjamini-Hochberg FDR correction (padj < 0.05).',
      keyMilestones: [
        'Biological Replicates: Minimum n = 3 per group (n = 4-6 recommended for outbred/plant species)',
        'Sequencing Depth: 25-40 Million paired-end reads per sample for standard mRNA-seq',
        'Quality Threshold: Q30 > 90%, raw adapter removal, unique mapping rate > 75%'
      ],
      commonTraps: 'Comparing raw FPKM/TPM directly for differential testing instead of raw read counts in DESeq2/edgeR.'
    },
    genefamily: {
      title: 'Genome-Wide Gene Family Identification & Evolution',
      description: 'Comprehensive identification, phylogenetic reconstruction, conserved motif analysis, and spatio-temporal expression of a target gene family.',
      recommendedTools: ['NCBI BLAST+ / HMMER 3.3', 'MAFFT / MUSCLE', 'IQ-TREE 2 (Maximum Likelihood)', 'MEME Suite', 'TBtools / PlantTFDB', 'MCScanX'],
      statMethod: 'Bootstrap statistical validation (1,000 Ultrafast replicates), Ka/Ks selection pressure tests, Fisher exact test for duplication enrichment.',
      keyMilestones: [
        'Domain Validation: CDD, Pfam, and SMART verification for every putative candidate',
        'Phylogeny: Best-fit substitution model selection via ModelFinder (BIC criterion)',
        'Structure: Exon-intron organization and chromosome physical synteny mapping'
      ],
      commonTraps: 'Relying solely on BLAST e-value without verifying domain architecture and active catalytic sites in Pfam/InterPro.'
    },
    docking: {
      title: 'Structure-Based Virtual Screening & Molecular Docking',
      description: 'Identifying high-affinity small molecule inhibitors or peptide binders against target macromolecular receptor cavities.',
      recommendedTools: ['AlphaFold DB / RCSB PDB', 'AutoDock Vina / PyRx', 'CASTp 3.0 / PocketFinder', 'PyMOL / Discovery Studio', 'SwissADME / ProTox-II'],
      statMethod: 'Binding affinity calculation (kcal/mol), RMSD re-docking benchmark validation (< 2.0 Å), Lipinski Rule of 5 drug-likeness scoring.',
      keyMilestones: [
        'Receptor Preparation: Missing loops repair, Gasteiger charges, water deletion, Kollman charges',
        'Grid Box Definition: Centered on known catalytic triad/pocket with exhaustiveness >= 32',
        'In Silico ADMET: Oral bioavailability, CYP450 inhibition, and blood-brain barrier permeability'
      ],
      commonTraps: 'Failing to validate the docking grid protocol by redocking the co-crystallized native ligand to assess RMSD recovery.'
    },
    multiomics: {
      title: 'Multi-Omics Data Integration & Network Pharmacology',
      description: 'Combining genomics, transcriptomics, proteomics, and metabolomics datasets to uncover complex regulatory networks and core hub genes.',
      recommendedTools: ['MOFA+ (Multi-Omics Factor Analysis)', 'WGCNA (Co-expression Networks)', 'STRING v12 / Cytoscape', 'MetaboAnalyst 6.0', 'Reactome'],
      statMethod: 'Scale-free topology network fitting (R^2 > 0.85), Module-trait correlation, Hypergeometric enrichment analysis.',
      keyMilestones: [
        'Data Harmonization: Cross-platform batch effect normalization using ComBat / limma',
        'Hub Gene Selection: Top 5% Betweenness Centrality and Degree Connectivity in CytoHubba',
        'Phenotypic Correlation: Validating module eigengene correlation with clinical/stress traits'
      ],
      commonTraps: 'Over-interpreting giant hairball networks without filtering edges by high confidence interaction scores (>= 0.700).'
    }
  };

  const currentGuide = domainGuides[researchDomain] || domainGuides.transcriptomics;

  const handleExportChecklist = () => {
    const text = `# Academic Research Blueprint & Helper Guide
**Target Academic Level:** ${degreeLevel} Level Research
**Research Domain:** ${currentGuide.title}
**Sample System:** ${targetSampleType.toUpperCase()}
**Generated by:** Arif Bioinformatics Research Hub (Master Bioinformatics with Arif)
**Official Domain:** http://arif_bioinformatics_mastery.com

---

## 1. Domain Overview
${currentGuide.description}

## 2. Recommended Verified Computational Tools
${currentGuide.recommendedTools.map(t => `- ${t}`).join('\n')}

## 3. Recommended Statistical Methodology
${currentGuide.statMethod}

## 4. Key Experimental Milestones
${currentGuide.keyMilestones.map(m => `- ${m}`).join('\n')}

## 5. Critical Reviewer Trap to Avoid
> ${currentGuide.commonTraps}

## 6. Target Dissertation Milestones for ${degreeLevel} Level
${degreeLevel === 'BS' ? `
- Completed comprehensive literature review (25+ peer-reviewed articles)
- Executed benchmark standard pipeline on 1-2 curated datasets
- Visualized publication-ready figures (Volcano, Phylogenetic Tree, 3D Pose)
- Documented step-by-step reproducible script repository
` : degreeLevel === 'MPhil' ? `
- Novel biological hypothesis with clear agricultural / biomedical significance
- Multi-dataset validation (internal + external GEO/SRA validation cohorts)
- In-depth functional enrichment (GO biological processes + KEGG pathways)
- Minimum 1 targeted manuscript prepared for Q1/Q2 indexed journal submission
` : `
- Groundbreaking theoretical or applied mechanistic discovery
- Multi-omics integration (e.g. Genomics + RNA-seq + Proteomics + Docking)
- Extensive in silico + wet-lab benchmark verification
- Minimum 2-3 first-author peer-reviewed publications in high-impact journals
`}
`;

    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Research_Blueprint_${degreeLevel}_${researchDomain}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-3xl bio-glass border-orange-200 p-6 sm:p-8 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-200 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-950 font-bold border border-orange-300">
                Interactive Advisor
              </span>
              <span className="text-xs font-bold text-orange-700">BS • MPhil • PhD</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Bioinformatics Research Helper & Method Advisor
            </h3>
          </div>
        </div>

        <button
          onClick={handleExportChecklist}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Research Blueprint</span>
        </button>
      </div>

      {/* Selectors: Level & Domain */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Degree Level Selector */}
        <div>
          <label className="block text-xs font-extrabold text-slate-900 mb-1.5 uppercase tracking-wide">
            1. Target Degree Level:
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-orange-200 shadow-xs">
            {(['BS', 'MPhil', 'PhD'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDegreeLevel(lvl)}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  degreeLevel === lvl
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-700 hover:text-orange-950 hover:bg-orange-50'
                }`}
              >
                {lvl} {lvl === 'BS' ? 'Thesis' : lvl === 'MPhil' ? 'MPhil' : 'PhD'}
              </button>
            ))}
          </div>
        </div>

        {/* Domain Selector */}
        <div>
          <label className="block text-xs font-extrabold text-slate-900 mb-1.5 uppercase tracking-wide">
            2. Research Domain:
          </label>
          <select
            value={researchDomain}
            onChange={(e) => setResearchDomain(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
          >
            <option value="transcriptomics">RNA-seq & Transcriptomics</option>
            <option value="genefamily">Gene Family & Phylogenetics</option>
            <option value="docking">Molecular Docking & Drug Discovery</option>
            <option value="multiomics">Multi-Omics & Systems Biology</option>
          </select>
        </div>

        {/* Sample System */}
        <div>
          <label className="block text-xs font-extrabold text-slate-900 mb-1.5 uppercase tracking-wide">
            3. Biological Model System:
          </label>
          <select
            value={targetSampleType}
            onChange={(e) => setTargetSampleType(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
          >
            <option value="plants">Plants & Crops (Rice, Arabidopsis, Wheat)</option>
            <option value="human">Human Disease / Oncology / Clinical Cohorts</option>
            <option value="microbes">Microbial & Infectious Pathogens</option>
            <option value="animals">Model Organisms (Mouse, Zebrafish, Drosophila)</option>
          </select>
        </div>
      </div>

      {/* Dynamic Recommendation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Left Column: Scope & Milestones */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-orange-200 shadow-xs space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-orange-800">
              Target Scope for {degreeLevel} Level Research
            </span>
            <h4 className="text-base font-extrabold text-slate-900">{currentGuide.title}</h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {currentGuide.description}
            </p>
          </div>

          {/* Key Milestones */}
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-orange-950">
              <CheckCircle2 className="w-4 h-4 text-orange-600" />
              <span>Recommended Experimental Standards & Milestones</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
              {currentGuide.keyMilestones.map((m, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Tools & Stats */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tool Stack */}
          <div className="p-4 rounded-2xl bg-white border border-orange-200 shadow-xs space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-slate-900 block">
              Verified Software Stack:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentGuide.recommendedTools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-orange-100/90 text-orange-950 font-bold text-[11px] border border-orange-300"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Statistical Standard */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
            <span className="text-[11px] font-mono uppercase font-bold text-emerald-950 flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-700" />
              <span>Statistical Validation Standard:</span>
            </span>
            <p className="text-xs text-emerald-950 font-medium leading-relaxed">
              {currentGuide.statMethod}
            </p>
          </div>

          {/* Reviewer Trap Warning */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-1">
            <div className="flex items-center space-x-1.5 font-extrabold text-amber-900">
              <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
              <span>Reviewer Trap to Avoid:</span>
            </div>
            <p className="text-[11px] text-slate-800 leading-snug font-medium">
              {currentGuide.commonTraps}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
