import { AIToolInfo } from '../types';

export const aiBioinformaticsTools: AIToolInfo[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT (GPT-4o / o1)',
    tagline: 'Code Debugging, R/Python Scripting & Study Planning',
    category: 'General LLM & Coding',
    logo: 'Bot',
    officialUrl: 'https://chatgpt.com/',
    keyFeatures: [
      'Translates conceptual workflows into customized R Bioconductor and Python Biopython scripts',
      'Refactors and debugs cryptic error messages from DESeq2, STAR, or AutoDock Vina',
      'Generates concise summaries of complex experimental protocols and methodologies',
      'Drafts structured study outlines and brainstorming experimental designs'
    ],
    recommendedUse: 'Interactive coding assistant, pipeline troubleshooting, and protocol drafting.',
    examplePrompt: 'I have an RNA-seq count matrix from Oryza sativa with 3 control and 3 drought-treated biological replicates. Write a complete, reproducible R script using DESeq2 to identify differentially expressed genes, apply Benjamini-Hochberg FDR correction (padj < 0.05), and produce a publication-quality volcano plot with EnhancedVolcano.',
    limitations: 'May hallucinate non-existent package functions or outdated syntax. Always verify function parameters in package documentation.',
    cautionLevel: 'Medium'
  },
  {
    id: 'elicit',
    name: 'Elicit AI Research Assistant',
    tagline: 'Systematic Paper Discovery & Evidence Synthesis',
    category: 'Literature Discovery',
    logo: 'Search',
    officialUrl: 'https://elicit.com/',
    keyFeatures: [
      'Searches across 200M+ academic papers using semantic query matching rather than rigid keywords',
      'Automatically generates structured comparison tables extracting Sample Size, Organism, Methodology, and Outcomes',
      'Summarizes consensus takeaways across dozens of peer-reviewed papers simultaneously',
      'Extracts specific numerical parameters and assay conditions directly from PDF texts'
    ],
    recommendedUse: 'Systematic literature reviews, background synthesis, and discovering niche crop genomics papers.',
    examplePrompt: 'What are the reported effects of semi-dwarf 1 (sd1) gene mutations on lodging resistance and secondary cell wall lignin content in cereals?',
    limitations: 'Limited to papers in its indexed repository; must manually check that extracted metrics represent the primary conclusion rather than background citations.',
    cautionLevel: 'Low'
  },
  {
    id: 'consensus',
    name: 'Consensus AI',
    tagline: 'Evidence-Based Scientific Consensus Meter',
    category: 'Evidence Aggregation',
    logo: 'CheckCircle2',
    officialUrl: 'https://consensus.app/',
    keyFeatures: [
      'Analyzes scientific literature to provide an automated "Consensus Meter" (Yes / Possible / No distribution)',
      'Extracts direct verbatim evidence quotes linked to peer-reviewed source papers',
      'Filters papers by Study Type (RCT, Meta-analysis, Systematic Review), Sample Size, and Journal SJR Ranking',
      'Synthesizes conflicting findings into clear, balanced summaries'
    ],
    recommendedUse: 'Testing specific biological hypotheses and verifying scientific consensus on controversial topics.',
    examplePrompt: 'Does gibberellin 20-oxidase downregulation consistently enhance stem breaking resistance in monocot crops?',
    limitations: 'Can oversimplify nuanced biological contexts where effects depend on tissue type or specific environmental conditions.',
    cautionLevel: 'Low'
  },
  {
    id: 'scite',
    name: 'Scite.ai',
    tagline: 'Smart Citations & Contextual Evidence Verification',
    category: 'Citation Analysis',
    logo: 'FileText',
    officialUrl: 'https://scite.ai/',
    keyFeatures: [
      'Classifies citation contexts into Supporting, Mentioning, or Contrasting statements',
      'Displays the exact sentence where a paper was cited inside subsequent publications',
      'Detects if a landmark paper has been contradicted or questioned by newer experimental findings',
      'Generates Smart Citation badges for reference validation'
    ],
    recommendedUse: 'Verifying the credibility and reproducibility of foundational claims before citing them in your thesis.',
    examplePrompt: 'Check Smart Citation context for the primary paper describing the structural characterization of the OsGA20ox2 catalytic domain.',
    limitations: 'Full citation sentence parsing requires access to open-access or partner publisher full texts.',
    cautionLevel: 'Low'
  },
  {
    id: 'notebooklm',
    name: 'Google NotebookLM',
    tagline: 'Grounded AI Notebook for Your Papers & Notes',
    category: 'Document Synthesis',
    logo: 'BookOpen',
    officialUrl: 'https://notebooklm.google.com/',
    keyFeatures: [
      'Strictly grounds responses in your uploaded PDF research papers, thesis drafts, and lab notes',
      'Provides clickable in-text citations linking directly to the specific page and paragraph in your source documents',
      'Generates Audio Overviews (conversational podcast-style synthesis) of complex papers',
      'Creates study guides, FAQs, and topic overviews from your private research library'
    ],
    recommendedUse: 'Studying dense multi-page journal articles, synthesizing chapters of your MPhil thesis, and preparing for defense questions.',
    examplePrompt: 'Based only on my uploaded PDF papers on rice culm biomechanics, summarize the comparative role of cellulose vs lignin in lodging resistance.',
    limitations: 'Relies solely on provided source files; does not independently search external databases.',
    cautionLevel: 'Low'
  },
  {
    id: 'alphafold',
    name: 'AlphaFold 2 / 3 (DeepMind)',
    tagline: 'Deep Learning Biomolecular Structure Prediction',
    category: 'Structural AI',
    logo: 'Layers',
    officialUrl: 'https://alphafold.ebi.ac.uk/',
    keyFeatures: [
      'Predicts 3D atomic coordinates from primary amino acid sequence with atomic accuracy',
      'Provides per-residue confidence scores (pLDDT) and Predicted Aligned Error (PAE) matrices',
      'AlphaFold 3 predicts multi-protein complexes, protein-nucleic acid interactions, and small-molecule ligand poses',
      'Over 200 million pre-computed structure models available via open-access database'
    ],
    recommendedUse: 'Obtaining 3D structural models for uncharacterized plant proteins, modeling mutations, and binding pocket identification.',
    examplePrompt: 'Input UniProt ID Q8H8S6 to retrieve the predicted 3D conformation and evaluate pLDDT confidence across the catalytic 2OG-FeII_Oxy domain.',
    limitations: 'Static structural prediction; does not replace experimental validation or full molecular dynamics simulations of flexible loops.',
    cautionLevel: 'Medium'
  },
  {
    id: 'galaxy-ai',
    name: 'Galaxy AI Assistance',
    tagline: 'Intelligent Bioinformatic Workflow & Tool Recommendation',
    category: 'Pipeline Automation',
    logo: 'Cpu',
    officialUrl: 'https://usegalaxy.org/',
    keyFeatures: [
      'Context-aware recommendations for the next logical tool in your NGS analysis history',
      'Automated parameter optimization and pipeline error diagnostics within the Galaxy GUI',
      'Natural language pipeline construction assistance (BioChat / Galaxy Chatbot integrations)',
      '100% reproducible workflow provenance and workflow sharing'
    ],
    recommendedUse: 'Automating multi-step NGS workflows without requiring command-line terminal access.',
    examplePrompt: 'Create a connected Galaxy workflow taking paired-end Illumina FASTQ reads through FastQC, fastp trimming, STAR alignment to Oryza sativa IRGSP-1.0, and featureCounts.',
    limitations: 'Dependent on public Galaxy server queue times and available compute resource quotas.',
    cautionLevel: 'Low'
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot / Cursor',
    tagline: 'Real-Time Bioinformatic Coding Autocomplete',
    category: 'Coding Assistance',
    logo: 'Code',
    officialUrl: 'https://github.com/features/copilot',
    keyFeatures: [
      'Real-time autocomplete for Biopython, R Bioconductor, Bash scripts, and Nextflow / Snakemake pipelines',
      'Understands context from open data science notebooks and bioinformatics scripts in your IDE',
      'Rapidly generates boilerplate data parsing functions (FASTA, VCF, GFF, BAM parsers)',
      'Translates complex command-line pipelines into automated bash shell scripts'
    ],
    recommendedUse: 'Accelerating daily scripting, data wrangling, and pipeline development in VS Code / IDE.',
    examplePrompt: 'Write a Python script with Biopython to parse a multi-FASTA file, filter out sequences shorter than 100 amino acids, calculate the GC percentage for each, and output a clean CSV table.',
    limitations: 'Requires human review of generated code to avoid subtle indexing or off-by-one errors in genomic coordinates.',
    cautionLevel: 'Low'
  }
];

export const bioPromptTemplates = [
  {
    category: 'RNA-seq & Transcriptomics',
    title: 'DESeq2 Analysis Script Generator',
    template: `You are an expert bioinformatician. Write a complete, reproducible R script for bulk RNA-seq differential expression analysis with DESeq2.
Organism: [e.g., Oryza sativa]
Samples: [e.g., 3 Control vs 3 Salt-Treated replicates]
Requirements:
1. Load raw count matrix from 'counts.txt' and metadata from 'samples.csv'
2. Create DESeqDataSet and pre-filter low counts (rowSums >= 10)
3. Run DESeq() and extract results with contrast (padj < 0.05, |log2FC| > 1.0)
4. Plot a PCA sample plot and an EnhancedVolcano plot
5. Annotate top 10 DEGs and export significant results to 'DEGs_significant.csv'`
  },
  {
    category: 'Structural Biology & Docking',
    title: 'AutoDock Vina Grid Box & Receptor Preparation',
    template: `You are an expert computational chemist and structural biologist.
Target Protein: [e.g., Rice GA20ox2 / UniProt Q8H8S6]
Active Site Residues: [e.g., His232, Asp234, His298]
Lead Molecule: [e.g., Gibberellin intermediate analog / SMILES]
Please provide:
1. Step-by-step PyMOL and AutoDockTools preparation protocol (polar hydrogens, Kollman charges)
2. Calculated Cartesian center coordinates (x, y, z) and box dimensions (size_x, size_y, size_z)
3. A complete 'config.txt' file for AutoDock Vina with exhaustiveness = 32
4. Guidelines for interpreting binding affinity (kcal/mol) and 2D interaction analysis`
  },
  {
    category: 'Gene Family & Phylogenetics',
    title: 'HMMER Domain Identification Pipeline',
    template: `You are a comparative genomics specialist. Write a bash pipeline to identify all members of the [Gene Family Name, e.g., WRKY] gene family in a crop genome.
Input Files: 'proteome.fasta' and 'PF03106.hmm' (Pfam HMM)
Steps to generate:
1. hmmsearch command with E-value cutoff <= 1e-5
2. awk/sed script to parse candidate sequence IDs
3. samtools faidx / seqtk command to extract candidate protein FASTA sequences
4. Batch CDD and SMART validation verification steps
5. MAFFT alignment and IQ-TREE 2 phylogenetic command with ModelFinder and 1000 ultrafast bootstraps`
  },
  {
    category: 'Scientific Writing',
    title: 'Research Abstract & Graphical Abstract Outline',
    template: `You are a scientific writing mentor for a peer-reviewed plant science journal.
Draft a structured 250-word research abstract based on the following findings:
- Objective: [e.g., Uncovering the genetic basis of culm lodging resistance in rice]
- Methods: [e.g., Pan-genome analysis of 50 accessions, RNA-seq, molecular docking, RT-qPCR]
- Results: [e.g., Identified 18 GA20ox genes, OsGA20ox2 showed 4.2-fold downregulation in lodging-resistant cultivars, docking revealed binding energy of -8.6 kcal/mol]
- Conclusion: [e.g., Provides key targets for breeding semi-dwarf lodging-resistant cultivars]
Also suggest a visual layout concept for a Graphical Abstract.`
  }
];
