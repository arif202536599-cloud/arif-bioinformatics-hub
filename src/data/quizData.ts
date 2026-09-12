import { QuizQuestion } from '../types';

export const quizQuestionBank: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'Transcriptomics',
    difficulty: 'Medium',
    question: 'Why is splice-aware alignment (e.g., using STAR or HISAT2) required for eukaryotic RNA-seq data instead of standard DNA aligners like BWA-MEM?',
    options: [
      'Because RNA molecules contain Uracil (U) which BWA cannot recognize',
      'Because eukaryotic mature mRNA has introns spliced out, creating reads that span non-contiguous genomic exon junctions',
      'Because RNA-seq reads are always shorter than DNA sequencing reads',
      'Because STAR automatically calculates normalized TPM values during alignment'
    ],
    correctAnswerIndex: 1,
    explanation: 'In eukaryotes, pre-mRNA undergoes splicing where non-coding introns are removed. As a result, sequencing reads derived from mature mRNA frequently span exon-exon boundaries. Standard DNA aligners expect continuous linear alignments and will fail to map these junction-spanning reads, whereas splice-aware aligners like STAR and HISAT2 are specifically engineered to split and map reads across distant genomic exons.'
  },
  {
    id: 'q2',
    category: 'Differential Expression',
    difficulty: 'Medium',
    question: 'In DESeq2 analysis, why should statistical significance be evaluated using the adjusted p-value (padj / FDR) rather than the raw p-value (pvalue)?',
    options: [
      'Adjusted p-values account for the GC-content of each gene',
      'Raw p-values are only applicable to single-cell RNA-seq datasets',
      'Testing thousands of genes simultaneously causes the multiple testing problem, drastically inflating false positive discoveries',
      'Adjusted p-values convert negative binomial distributions into normal distributions'
    ],
    correctAnswerIndex: 2,
    explanation: 'When testing 20,000+ genes simultaneously at a nominal α = 0.05, one would expect approximately 1,000 genes to appear significant purely by random chance (false positives). DESeq2 applies the Benjamini-Hochberg (BH) procedure to control the False Discovery Rate (FDR), ensuring that only a controlled proportion of declared significant genes are false positives.'
  },
  {
    id: 'q3',
    category: 'Plant Genomics',
    difficulty: 'Easy',
    question: 'The rice "Green Revolution" semi-dwarf gene (sd1), which prevents plant lodging and increases grain yield, encodes which key biosynthetic enzyme?',
    options: [
      'Gibberellin 20-oxidase 2 (GA20ox2)',
      'Auxin Response Factor 7 (ARF7)',
      'Abscisic Acid 8\'-hydroxylase (CYP707A)',
      'Ethylene Insensitive 2 (EIN2)'
    ],
    correctAnswerIndex: 0,
    explanation: 'The famous semi-dwarf 1 (sd1) gene in rice encodes Gibberellin 20-oxidase 2 (GA20ox2), a rate-limiting 2-oxoglutarate-dependent dioxygenase involved in the biosynthesis of active gibberellin (GA1). A loss-of-function mutation in sd1 lowers GA levels, producing sturdy, shorter culms that resist lodging under heavy wind and fertilizer application.'
  },
  {
    id: 'q4',
    category: 'Structural Biology',
    difficulty: 'Medium',
    question: 'In AlphaFold 2 structural predictions, what does a per-residue pLDDT score of 85 indicate?',
    options: [
      'Very low confidence; the region is likely intrinsically disordered',
      'Low confidence; the backbone is only roughly positioned',
      'Confident prediction; the backbone and secondary structure are modeled with high accuracy',
      'Very high confidence; side chains are positioned with crystallographic accuracy'
    ],
    correctAnswerIndex: 2,
    explanation: 'AlphaFold outputs a per-residue confidence metric called pLDDT (predicted Local Distance Difference Test) on a 0-100 scale: >90 = Very High (reliable side chains), 70-90 = Confident (accurate backbone and secondary structure), 50-70 = Low confidence, and <50 = Very Low (often indicates intrinsically disordered regions).'
  },
  {
    id: 'q5',
    category: 'Molecular Docking',
    difficulty: 'Easy',
    question: 'In AutoDock Vina, how is the predicted binding affinity interpreted?',
    options: [
      'Higher positive values indicate tighter, more spontaneous binding',
      'More negative values (e.g., -9.5 kcal/mol vs -4.2 kcal/mol) indicate stronger binding affinity and thermodynamic favorability',
      'Binding energy is always measured in optical density (OD600) units',
      'Values between 0 and 1 represent binding probability'
    ],
    correctAnswerIndex: 1,
    explanation: 'Binding affinity in molecular docking is reported as Gibbs free energy of binding (ΔG in kcal/mol). Spontaneous, thermodynamically favorable interactions have negative ΔG values; hence, a more negative score represents a stronger predicted interaction between the receptor and ligand.'
  },
  {
    id: 'q6',
    category: 'Phylogenetics',
    difficulty: 'Hard',
    question: 'Which phylogenetic reconstruction method searches for the evolutionary tree topology and branch lengths that maximize the probability of observing the sequence alignment under a chosen substitution model?',
    options: [
      'Neighbor-Joining (NJ)',
      'Unweighted Pair Group Method with Arithmetic Mean (UPGMA)',
      'Maximum Likelihood (ML)',
      'Parsimony Score Optimization'
    ],
    correctAnswerIndex: 2,
    explanation: 'Maximum Likelihood (ML) evaluates the statistical probability (likelihood) that a specific evolutionary model (e.g., JTT, GTR+G+I) would produce the observed multiple sequence alignment across candidate tree topologies. Tools like IQ-TREE 2 and RAxML utilize ML algorithms.'
  },
  {
    id: 'q7',
    category: 'AI & Research Ethics',
    difficulty: 'Easy',
    question: 'When using Generative AI tools (e.g., ChatGPT, Claude) for bioinformatics analysis and paper writing, which of the following is an essential ethical best practice?',
    options: [
      'Uploading unpublished, confidential patient genomic sequences to public AI chatbots for fast interpretation',
      'Copying AI-generated citations directly into the manuscript without verifying the DOIs and original published papers',
      'Verifying all AI-suggested code, statistical claims, and citations against official biological databases and primary literature',
      'Listing the AI language model as the first author on your research publication'
    ],
    correctAnswerIndex: 2,
    explanation: 'AI language models can hallucinate plausible-sounding citations, fabricated statistical claims, and incorrect API syntaxes. Researchers must independently verify all AI outputs against official biological databases (NCBI, UniProt, PDB) and peer-reviewed literature. Additionally, private or unpublished patient data must never be uploaded to non-HIPAA/public AI platforms.'
  },
  {
    id: 'q8',
    category: 'Plant Bioinformatics',
    difficulty: 'Medium',
    question: 'Which bioinformatic tool is specifically designed to identify conserved plant microRNA (miRNA) targets by considering plant-specific pairing rules and target-site accessibility?',
    options: [
      'TargetScan Human',
      'psRNATarget',
      'miRanda',
      'PicTar'
    ],
    correctAnswerIndex: 1,
    explanation: 'psRNATarget is the gold-standard plant small RNA target analysis server. Unlike animal miRNA algorithms, it calculates plant-specific complementarity scoring, recognizes mismatch penalties in the "seed" region (positions 2-13), and evaluates target site accessibility (unpairing energy, UPE).'
  },
  {
    id: 'q9',
    category: 'Network Biology',
    difficulty: 'Medium',
    question: 'In Cytoscape network analysis, which topological metric identifies nodes that act as critical bridges connecting disparate modules of a protein interaction network?',
    options: [
      'Betweenness Centrality',
      'Degree Centrality',
      'Clustering Coefficient',
      'Eccentricity'
    ],
    correctAnswerIndex: 0,
    explanation: 'Betweenness Centrality measures the number of shortest paths between all pairs of nodes in a network that pass through a particular node. Proteins with high betweenness centrality act as crucial "bottlenecks" or bridges coordinating communication between distinct biological functional modules.'
  },
  {
    id: 'q10',
    category: 'Genomics',
    difficulty: 'Easy',
    question: 'What is the standard bioinformatic file format used to store genomic variant calls (SNPs, insertions, deletions) relative to a reference genome?',
    options: [
      'FASTQ',
      'GFF3',
      'VCF (Variant Call Format)',
      'SAM (Sequence Alignment Map)'
    ],
    correctAnswerIndex: 2,
    explanation: 'VCF (Variant Call Format) is the universal standard format for storing gene sequence variations, including Single Nucleotide Polymorphisms (SNPs), small indels, structural variants, along with genotype annotations and quality metrics.'
  }
];
