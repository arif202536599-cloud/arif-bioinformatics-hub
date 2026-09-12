import { ResearchPillar, CitationStyleExample } from '../types';

export const researchPillars: ResearchPillar[] = [
  {
    id: 'pillar-1-title',
    section: 'Section 1',
    title: 'Title of Research',
    subtitle: 'The Gateway to Your Scientific Discovery',
    keyGoals: [
      'Succinctly convey the core biological organism, biological pathway, and methodology utilized',
      'Incorporate searchable keywords (e.g., "Pan-genomic", "RNA-seq", "Oryza sativa", "Molecular Docking")',
      'Maintain clarity without unnecessary fluff like "A Study of" or "An Investigation Into"'
    ],
    bestPractices: [
      'Keep titles between 10 to 18 words for optimal citation indexing and reader engagement',
      'Specify the organism and specific gene family or physiological phenotype (e.g., "Genome-Wide Identification of the OsGA20ox Gene Family in Rice and Their Functional Roles in Culm Lodging Resistance")',
      'Ensure the title accurately reflects the balance of in silico vs in vitro findings'
    ],
    commonMistakes: [
      'Making the title overly broad or sensationalized',
      'Using non-standard, obscure acronyms without context',
      'Over-promising conclusions that were only predicted in silico'
    ],
    sampleTemplate: 'Genome-Wide Identification, Evolutionary Dynamics, and Expression Profiling of [Gene Family Name] in [Organism Scientific Name] Under [Specific Abiotic/Biotic Stress / Condition]'
  },
  {
    id: 'pillar-2-abstract',
    section: 'Section 2',
    title: 'Scientific Abstract',
    subtitle: 'High-Impact Standalone Executive Summary (200 - 250 Words)',
    keyGoals: [
      'Background (1-2 sentences): Establish the biological significance and current limitation',
      'Objective (1 sentence): State the explicit purpose and hypotheses tested',
      'Methodology (2-3 sentences): Outline key bioinformatics pipelines and experimental tools',
      'Key Findings (3-4 sentences): Report quantified results (e.g., number of genes, binding energies, fold changes, p-values)',
      'Conclusion & Impact (1-2 sentences): Summarize broader agronomic or biomedical implications'
    ],
    bestPractices: [
      'Write the abstract after completing the entire manuscript',
      'Include specific quantitative values rather than vague qualitative statements (e.g., "identified 24 OsWRKY genes across 12 chromosomes with binding energies of -8.9 kcal/mol")',
      'Follow the target journal format (Structured with Background/Methods/Results vs Unstructured single paragraph)'
    ],
    commonMistakes: [
      'Including citations or undefined abbreviations in the abstract',
      'Spending more than 25% of the word count on background context',
      'Omitting the exact organism or key computational algorithms utilized'
    ],
    sampleTemplate: `Background: [Agronomic/Biomedical challenge]. Despite its importance, the comprehensive regulatory mechanisms of [Target Pathway/Gene] remain poorly understood.
Results: In this study, we identified [N] members of the [Gene Family] in [Organism]. Phylogenetic analysis categorized them into [N] distinct clades. RNA-seq and RT-qPCR validation revealed that [Gene Name] was up-regulated by [N]-fold under [Condition]. Molecular docking demonstrated strong binding affinity (-[N] kcal/mol) with [Ligand].
Conclusions: Our findings elucidate the genetic architecture of [Phenotype] and provide valuable candidate targets for precision molecular breeding.`
  },
  {
    id: 'pillar-3-introduction',
    section: 'Section 3',
    title: 'Introduction & Research Rationale',
    subtitle: 'From Broad Biological Context to Focused Hypothesis (The Inverted Pyramid)',
    keyGoals: [
      'Opening Paragraph: Global significance of the biological question (e.g., food security, rice lodging, human disease mechanisms)',
      'Middle Paragraphs: Critical review of known literature and explicit identification of the "Knowledge Gap"',
      'Closing Paragraph: Clear statement of aims, experimental approach, and how this study addresses the gap'
    ],
    bestPractices: [
      'Cite recent, high-impact peer-reviewed literature from the last 3-5 years',
      'Explicitly state: "However, genome-wide characterization and structural dynamics in [organism] remain largely uncharacterized..."',
      'Conclude the introduction with a roadmap of the discoveries reported in this paper'
    ],
    commonMistakes: [
      'Turning the introduction into an encyclopedic textbook summary',
      'Failing to articulate why the research matters (the "So what?" question)',
      'Failing to cite foundational pioneer papers in the field'
    ],
    sampleTemplate: `[Problem Significance] Rice (Oryza sativa L.) is a primary staple food feeding over half the world's population. However, stem lodging causes annual yield losses of 10-25%. [Known Science] Gibberellin 20-oxidases play crucial roles in internode elongation. [The Knowledge Gap] Nevertheless, the pan-genomic structural variation and regulatory networks of GA20ox genes under modern nitrogen management have not been systematically resolved. [Our Solution] Here, we employ multi-omics profiling and structural modeling to systematically uncover...`
  },
  {
    id: 'pillar-4-literature',
    section: 'Section 4',
    title: 'Literature Review & Systematic Synthesis',
    subtitle: 'Critical Evidence Mapping, Contradiction Resolution & Gap Analysis',
    keyGoals: [
      'Synthesize existing paradigms, contrasting findings, and technological milestones',
      'Classify past studies into thematic matrices (e.g., functional genetics, transcriptomics, structural docking)',
      'Highlight unresolved controversies or unaddressed species/tissues'
    ],
    bestPractices: [
      'Use a structured Literature Review Matrix table tracking Author, Year, Organism, Methodology, Key Findings, and Limitations',
      'Group papers by conceptual themes rather than summarizing study-by-study in chronological order',
      'Use reference managers (Zotero, Mendeley, EndNote) with cloud synchronization'
    ],
    commonMistakes: [
      'Writing a disjointed list of "Smith et al. did X. Jones et al. did Y."',
      'Relying solely on review articles rather than original primary research papers',
      'Ignoring conflicting evidence that challenges your hypothesis'
    ],
    sampleTemplate: `[Theme 1: Evolutionary Conservation] Early investigations established that... [Theme 2: Divergent Functional Roles] While recent studies in Arabidopsis demonstrated [X] (Ref 1), recent crop evidence in wheat suggests [Y] (Ref 2). This discrepancy likely stems from differences in [Z]...`
  },
  {
    id: 'pillar-5-methodology',
    section: 'Section 5',
    title: 'Methodology & Reproducible Workflow',
    subtitle: 'The Blueprints of Scientific Integrity & Reproducibility',
    keyGoals: [
      'Provide exact version numbers, database accession releases, parameters, and command-line arguments',
      'Detail biological and technical replicates (e.g., n = 3 biological replicates)',
      'Specify statistical tests, multiple testing corrections, and significance cutoffs'
    ],
    bestPractices: [
      'State: "All bioinformatics pipelines followed FAIR (Findable, Accessible, Interoperable, Reusable) data principles."',
      'Deposit code on GitHub and archive releases with Zenodo DOIs',
      'Detail wet-lab validation protocols (e.g., Total RNA extraction method, primer sequences in Supplementary Table S1, 2^-ΔΔCt RT-qPCR calculations)'
    ],
    commonMistakes: [
      'Omitting software version numbers or database snapshot dates',
      'Failing to report random seed numbers or cutoffs used in filtering',
      'Vague descriptions like "parameters were adjusted according to default recommendations"'
    ],
    sampleTemplate: `2.1 Genome Data Retrieval: The reference genome (v7.0) and proteome of Oryza sativa subsp. japonica were downloaded from Ensembl Plants (release 57).
2.2 Domain Identification: The HMM profile of [Domain] (Pfam: PFXXXXX) was queried using HMMER v3.3.2 with an E-value cutoff of <= 1e-5.
2.3 Statistical Analysis: Differential expression was modeled using DESeq2 v1.42.0 in R v4.3.2. Multiple testing correction was performed using the Benjamini-Hochberg method with significance set at padj < 0.05.`
  },
  {
    id: 'pillar-6-results',
    section: 'Section 6',
    title: 'Results, Biological Visualization & Discussion',
    subtitle: 'Transforming Computational Output into Biological Meaning',
    keyGoals: [
      'Present findings logically through publication-quality figures and tables',
      'Intertwine Results and Discussion (or maintain dedicated sections based on journal guidelines)',
      'Interpret what the biological data actually signifies in terms of physiological mechanisms'
    ],
    bestPractices: [
      'Ensure every figure is completely self-contained with a comprehensive, descriptive legend',
      'Use consistent, colorblind-friendly palettes (e.g., viridis, colorbrewer)',
      'Directly compare your computational findings with previously published experimental data'
    ],
    commonMistakes: [
      'Merely repeating in text the numbers already clearly shown in a table',
      'Speculating wildly on biological mechanisms without empirical or literature support',
      'Neglecting to discuss study limitations or technical constraints'
    ],
    sampleTemplate: `3.1 Genome-Wide Identification and Chromosomal Distribution
A total of [N] non-redundant [Family] genes were identified across the 12 rice chromosomes (Figure 1A). Chromosome 1 harbored the highest density...
3.2 Structural Homology and Active Site Architecture
Molecular docking revealed that compound [X] formed three stable hydrogen bonds with residues Tyr142, His232, and Asp234 with a binding free energy of -9.2 kcal/mol (Figure 3C), consistent with catalytic inhibition observed in homologous enzymes...`
  },
  {
    id: 'pillar-7-conclusion',
    section: 'Section 7',
    title: 'Conclusion, Future Perspectives & References',
    subtitle: 'The Lasting Scientific Contribution & Next Research Horizons',
    keyGoals: [
      'Reiterate the primary breakthrough without repeating the whole abstract',
      'Highlight translational potential (e.g., CRISPR gene editing, biomarker discovery, crop breeding)',
      'Propose 2-3 concrete future experiments to extend this research'
    ],
    bestPractices: [
      'Emphasize how this computational research creates an actionable roadmap for experimental wet-lab scientists',
      'Check that all in-text citations precisely match the final reference list',
      'Adhere strictly to the chosen citation style (APA, Harvard, Vancouver, Nature, etc.)'
    ],
    commonMistakes: [
      'Introducing brand-new data or claims not mentioned anywhere in the Results',
      'Writing an over-generalized conclusion that adds zero value',
      'Formatting discrepancies across reference entries'
    ],
    sampleTemplate: `In conclusion, this study provides the first comprehensive pan-genomic and structural analysis of the [Family] gene family in [Organism]. We identified [Gene X] as a pivotal regulator of [Phenotype]. Future research leveraging CRISPR/Cas9 targeted knockout lines and in vivo phosphoproteomic assays will further elucidate the precise upstream kinase cascades controlling this agronomic trait.`
  }
];

export const citationStyles: CitationStyleExample[] = [
  {
    style: 'APA 7th Edition',
    description: 'Author-Date format widely used in biological, social, and behavioral sciences.',
    inTextExample: '(Uddin & Smith, 2025) or Uddin et al. (2025)',
    bibliographyExample: 'Uddin, A., Chen, Y., & Rahman, M. (2025). Pan-genomic architecture and structural dynamics of the semi-dwarf 1 (sd1) locus in Asian cultivated rice. Journal of Plant Molecular Biology, 48(3), 245-259. https://doi.org/10.1016/j.jpmb.2025.04.012',
    fieldsUsed: ['Author(s)', 'Year', 'Article Title', 'Journal Name (Italicized)', 'Volume(Issue)', 'Pages', 'DOI URL']
  },
  {
    style: 'Nature Style',
    description: 'Numbered superscript format with condensed citations standard in Nature portfolio journals.',
    inTextExample: '...as demonstrated in previous transcriptomic studies^1,2.',
    bibliographyExample: '1. Uddin, A., Chen, Y. & Rahman, M. Pan-genomic architecture and structural dynamics of the semi-dwarf 1 (sd1) locus in Asian cultivated rice. Nat. Plants 11, 245–259 (2025).',
    fieldsUsed: ['Numbered Index', 'Author(s)', 'Article Title', 'Abbreviated Journal Name (Italicized)', 'Volume (Bold)', 'Page range', 'Year in parentheses']
  },
  {
    style: 'Harvard Style',
    description: 'Standard Author-Date referencing common across European and Commonwealth research institutions.',
    inTextExample: '(Uddin, Chen and Rahman, 2025)',
    bibliographyExample: 'Uddin, A., Chen, Y. and Rahman, M. (2025) ‘Pan-genomic architecture and structural dynamics of the semi-dwarf 1 (sd1) locus in Asian cultivated rice’, Journal of Plant Molecular Biology, 48(3), pp. 245–259. doi: 10.1016/j.jpmb.2025.04.012.',
    fieldsUsed: ['Author(s)', 'Year in parentheses', 'Article title in single quotes', 'Journal Name (Italicized)', 'Volume(Issue)', 'pp. Pages', 'DOI']
  },
  {
    style: 'Vancouver Style',
    description: 'Numbered reference style in order of appearance, standard in biomedical and medical bioinformatics journals.',
    inTextExample: '...culm lodging resistance is regulated by GA20-oxidase pathways (1).',
    bibliographyExample: '1. Uddin A, Chen Y, Rahman M. Pan-genomic architecture and structural dynamics of the semi-dwarf 1 (sd1) locus in Asian cultivated rice. J Plant Mol Biol. 2025 Mar;48(3):245-259. doi: 10.1016/j.jpmb.2025.04.012.',
    fieldsUsed: ['Sequential Number', 'Authors without periods', 'Article title', 'Abbreviated Journal', 'Year Month;Volume(Issue):Pages', 'DOI']
  },
  {
    style: 'IEEE Style',
    description: 'Bracketed numeric format utilized in computational biology, bioengineering, and algorithm publications.',
    inTextExample: '...as shown in deep learning protein predictions [1].',
    bibliographyExample: '[1] A. Uddin, Y. Chen, and M. Rahman, "Pan-genomic architecture and structural dynamics of the semi-dwarf 1 (sd1) locus in Asian cultivated rice," IEEE/ACM Trans. Comput. Biol. Bioinform., vol. 22, no. 3, pp. 245–259, May 2025, doi: 10.1016/j.jpmb.2025.04.012.',
    fieldsUsed: ['[Number]', 'Author initials + Surname', 'Title in quotes', 'Abbreviated Journal', 'vol., no., pp.', 'Month Year', 'DOI']
  }
];

export const roadmap2026Steps = [
  {
    step: 'Phase 1',
    title: 'Hypothesis Formulation & AI-Driven Literature Synthesis',
    tools: ['Elicit', 'Consensus', 'Scite', 'PubMed BioC API'],
    description: 'Formulate precision biological questions, synthesize multi-study evidence matrices, and verify citation context networks before dry-lab execution.'
  },
  {
    step: 'Phase 2',
    title: 'Pan-Genomic & Structural Variation Mining',
    tools: ['Ensembl Plants', 'NCBI SRA', 'PLINK', 'GATK4', 'VG (Variation Graph)'],
    description: 'Move beyond single reference genomes to graph-based pan-genomes to capture large structural inversions, copy number variations (CNVs), and presence-absence variants (PAVs).'
  },
  {
    step: 'Phase 3',
    title: 'Spatial & Single-Cell Transcriptomics Integration',
    tools: ['Seurat v5', 'Scanpy', 'STARsolo', 'Space Ranger'],
    description: 'Deconstruct tissue heterogeneity at single-cell resolution and map spatial gene expression niches in plant culms, roots, and disease tissues.'
  },
  {
    step: 'Phase 4',
    title: 'AI Biomolecular Complex Modeling (AlphaFold 3 & ESMFold)',
    tools: ['AlphaFold 3', 'ESM-2 / ESMFold', 'PyMOL', 'Foldseek'],
    description: 'Predict all-atom structures of multi-protein complexes, protein-DNA promoter interactions, and post-translational chemical modifications in silico.'
  },
  {
    step: 'Phase 5',
    title: 'Generative Ligand Design & Network Pharmacology',
    tools: ['AutoDock Vina', 'RDKit', 'Cytoscape / CytoHubba', 'SwissADME'],
    description: 'Design selective lead molecules against disease targets, map biological hub-gene interactomes, and evaluate in silico ADMET pharmacokinetic profiles.'
  },
  {
    step: 'Phase 6',
    title: 'Experimental Wet-Lab Validation & Benchmarking',
    tools: ['RT-qPCR', 'CRISPR/Cas9', 'Surface Plasmon Resonance (SPR)', 'Western Blot'],
    description: 'Empirically validate top in silico candidate genes and predicted binding leads through targeted molecular biology assays.'
  },
  {
    step: 'Phase 7',
    title: 'Reproducible FAIR Publication & Containerization',
    tools: ['Nextflow / Snakemake', 'Docker / Singularity', 'Zenodo (DOI)', 'GitHub Actions'],
    description: 'Package all analysis scripts, raw data, and workflows into self-contained, reproducible pipelines compliant with FAIR open-science standards.'
  }
];
