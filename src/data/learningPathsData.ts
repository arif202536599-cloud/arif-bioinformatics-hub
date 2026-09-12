import { LearningPathway } from '../types';

export const learningPathways: LearningPathway[] = [
  // Pathway 1: RNA-seq Workflow
  {
    id: 'rnaseq-workflow',
    title: 'RNA-seq Transcriptomics Pipeline',
    subtitle: 'From Raw Illumina Reads to Differential Expression & Functional Pathways',
    category: 'Transcriptomics',
    description: 'A complete, industry-standard computational protocol for bulk RNA-seq data processing. Covers quality control, read trimming, splice-aware genome alignment, feature quantification, and statistical testing with DESeq2.',
    estimatedTime: '4 - 6 Hours',
    difficulty: 'Intermediate',
    outcome: 'Generate publication-ready volcano plots, PCA sample clusters, differentially expressed gene (DEG) matrices, and biological pathway enrichments from raw FASTQ files.',
    steps: [
      {
        id: 'rna-1-raw',
        stepNumber: 1,
        title: 'Raw Read Acquisition & Format Inspection',
        description: 'Obtain raw paired-end or single-end sequencing files in FASTQ format (.fastq.gz) from sequencing facilities or public repositories (NCBI SRA/GEO).',
        rationale: 'FASTQ files store biological sequence data alongside Phred quality scores (Q-scores). Understanding the four-line structure (Header, Sequence, Plus separator, Quality string) is essential for diagnosing sequencing errors.',
        recommendedTools: ['NCBI SRA Toolkit (fasterq-dump)', 'EBI ENA Explorer', 'curl / wget'],
        inputFormat: 'SRA Run Accession (SRRXXXXXX)',
        outputFormat: 'sample_R1.fastq.gz, sample_R2.fastq.gz',
        codeSnippet: '# Download and split paired-end sequencing reads\nfasterq-dump --split-files --gzip SRR12345678 -O ./raw_reads/',
        codeLanguage: 'bash',
        keyTip: 'Always verify file integrity with md5sum checks and inspect the Phred score encoding (Phred+33 for modern Illumina platforms).'
      },
      {
        id: 'rna-2-qc',
        stepNumber: 2,
        title: 'Quality Assessment with FastQC',
        description: 'Perform initial quality diagnostic checks on raw read data to identify base call quality drops, GC content anomalies, adapter contamination, and sequence duplication rates.',
        rationale: 'Poor sequencing quality or residual Illumina sequencing adapters will lead to misalignments and false variant/differential expression calls.',
        recommendedTools: ['FastQC', 'MultiQC'],
        inputFormat: 'Raw FASTQ files (.fastq.gz)',
        outputFormat: 'sample_fastqc.html, sample_fastqc.zip, multiqc_report.html',
        codeSnippet: '# Run FastQC on all reads and aggregate with MultiQC\nfastqc raw_reads/*.fastq.gz -o qc_reports/ -t 4\nmultiqc qc_reports/ -o multiqc_summary/',
        codeLanguage: 'bash',
        keyTip: 'Pay special attention to "Per Base Sequence Quality" (aim for median Q > 30) and the "Adapter Content" module.'
      },
      {
        id: 'rna-3-trimming',
        stepNumber: 3,
        title: 'Adapter Removal & Quality Trimming',
        description: 'Trim low-quality base calls (Q < 20) from read ends, eliminate residual sequencing adapter sequences (Illumina TruSeq / Nextera), and filter out short degraded reads (< 35 bp).',
        rationale: 'Clean reads significantly improve alignment rates, reduce ambiguous mappings across exon junctions, and eliminate artificial technical biases.',
        recommendedTools: ['fastp', 'Trimmomatic', 'Cutadapt'],
        inputFormat: 'Raw FASTQ reads',
        outputFormat: 'clean_R1.fastq.gz, clean_R2.fastq.gz, fastp.html',
        codeSnippet: '# High-speed paired-end trimming with fastp\nfastp -i raw_reads/R1.fq.gz -I raw_reads/R2.fq.gz \\\n      -o clean_reads/R1.clean.fq.gz -O clean_reads/R2.clean.fq.gz \\\n      --detect_adapter_for_pe --qualified_quality_phred 20 \\\n      --length_required 36 -h clean_qc.html -j clean_qc.json',
        codeLanguage: 'bash',
        keyTip: '`fastp` is up to 5x faster than Trimmomatic, auto-detects adapter sequences, and generates a built-in interactive HTML report in a single run.'
      },
      {
        id: 'rna-4-alignment',
        stepNumber: 4,
        title: 'Splice-Aware Reference Genome Alignment',
        description: 'Align the filtered reads against the reference genome index using a splice-aware aligner capable of mapping across eukaryotic intron-exon boundaries.',
        rationale: 'Because mRNA transcripts have introns spliced out, reads bridging exon-exon junctions cannot align continuously to genomic DNA without splice-aware seed search algorithms.',
        recommendedTools: ['STAR', 'HISAT2', 'Samtools'],
        inputFormat: 'Clean FASTQ files + Reference Genome (.fa) + Annotation (.gtf)',
        outputFormat: 'Aligned.sortedByCoord.out.bam, Log.final.out',
        codeSnippet: '# 1. Build STAR genome index (one-time step)\nSTAR --runMode genomeGenerate --genomeDir star_index/ \\\n     --genomeFastaFiles genome.fa --sjdbGTFfile annotation.gtf --runThreadN 8\n\n# 2. Align clean reads\nSTAR --genomeDir star_index/ --runThreadN 8 \\\n     --readFilesIn clean_reads/R1.clean.fq.gz clean_reads/R2.clean.fq.gz \\\n     --readFilesCommand zcat --outFileNamePrefix aligned_samples/sample1_ \\\n     --outSAMtype BAM SortedByCoordinate',
        codeLanguage: 'bash',
        keyTip: 'A successful eukaryotic RNA-seq alignment should achieve > 80% uniquely mapped reads in STAR Log.final.out.'
      },
      {
        id: 'rna-5-counting',
        stepNumber: 5,
        title: 'Transcript & Gene Read Quantification',
        description: 'Count the number of mapped sequencing fragments overlapping each annotated gene or exon feature in the genome annotation (GTF/GFF3).',
        rationale: 'Differential expression analysis requires raw, integer read counts per gene. Normalizations (TPM, FPKM) are not suitable as raw input for negative binomial statistical models.',
        recommendedTools: ['featureCounts (Subread package)', 'HTSeq-count', 'Salmon'],
        inputFormat: 'Coordinate-sorted BAM files + Annotation (.gtf)',
        outputFormat: 'gene_counts_matrix.txt, gene_counts_matrix.txt.summary',
        codeSnippet: '# Quantify paired-end reads across all BAM files\nfeatureCounts -T 8 -p --countReadPairs -t exon -g gene_id \\\n              -a annotation.gtf -o counts/gene_counts_matrix.txt \\\n              aligned_samples/*.bam',
        codeLanguage: 'bash',
        keyTip: 'Use `-p --countReadPairs` flag for paired-end sequencing to ensure read fragments are counted once rather than doubling read numbers.'
      },
      {
        id: 'rna-6-deseq2',
        stepNumber: 6,
        title: 'Differential Expression Modeling with DESeq2',
        description: 'Import raw count matrices into R, perform library size normalization (median of ratios), estimate gene-wise dispersion, fit negative binomial Generalized Linear Models (GLMs), and test for differential expression.',
        rationale: 'RNA-seq data exhibits overdispersion (variance > mean), which Poisson distributions underestimate. DESeq2 uses empirical Bayes shrinkage to stabilize dispersion estimates for low-count genes.',
        recommendedTools: ['R / Bioconductor (DESeq2)', 'EnhancedVolcano', 'pheatmap'],
        inputFormat: 'Integer count matrix + Sample metadata dataframe (sample_id, condition, batch)',
        outputFormat: 'DEG_results_table.csv, Volcano_plot.pdf, Sample_PCA.pdf',
        codeSnippet: `library(DESeq2)
# Create DESeq2 dataset object
dds <- DESeqDataSetFromMatrix(countData = counts_matrix,
                              colData = sample_metadata,
                              design = ~ condition)
# Filter lowly expressed genes
keep <- rowSums(counts(dds) >= 10) >= 3
dds <- dds[keep, ]

# Run differential expression pipeline
dds <- DESeq(dds)
res <- results(dds, contrast = c("condition", "Treated", "Control"))

# Filter statistically significant DEGs (|log2FC| > 1, padj < 0.05)
sig_degs <- subset(res, padj < 0.05 & abs(log2FoldChange) > 1.0)
write.csv(as.data.frame(sig_degs), "significant_DEGs.csv")`,
        codeLanguage: 'r',
        keyTip: 'Always filter based on Benjamini-Hochberg adjusted p-value (`padj < 0.05`) rather than raw p-values to control the False Discovery Rate.'
      },
      {
        id: 'rna-7-pathway',
        stepNumber: 7,
        title: 'Functional Pathway Enrichment & Visualization',
        description: 'Map significant differentially expressed genes to Gene Ontology (GO) terms and KEGG / Reactome biological pathways to uncover biological mechanisms and stress responses.',
        rationale: 'Individual gene lists are overwhelming; grouping genes into enriched pathways reveals coordinated biological cascades, regulatory modules, and phenotypic drivers.',
        recommendedTools: ['clusterProfiler', 'pathview', 'g:Profiler', 'STRING-db'],
        inputFormat: 'List of Entrez / Ensembl Gene IDs from significant DEGs',
        outputFormat: 'GO_dotplot.pdf, KEGG_pathway_map.png, Enrichment_summary.csv',
        codeSnippet: `library(clusterProfiler)
library(org.Osativa.eg.db) # Or relevant organism database

# GO Over-Representation Analysis
ego <- enrichGO(gene          = deg_gene_ids,
                OrgDb         = org.Osativa.eg.db,
                keyType       = 'GID',
                ont           = "BP", # Biological Process
                pAdjustMethod = "BH",
                pvalueCutoff  = 0.01,
                qvalueCutoff  = 0.05)
dotplot(ego, showCategory = 15, title = "Enriched Biological Processes")`,
        codeLanguage: 'r',
        keyTip: 'Perform both Over-Representation Analysis (ORA) on thresholded DEGs and Gene Set Enrichment Analysis (GSEA) on the full ranked gene list for robust biological insights.'
      }
    ]
  },

  // Pathway 2: Gene Family Analysis
  {
    id: 'genefamily-workflow',
    title: 'Genome-Wide Gene Family Identification & Analysis',
    subtitle: 'From Raw Genome Assemblies to Evolutionary Phylogeny, Motifs & Expression',
    category: 'Plant & Comparative Genomics',
    description: 'Comprehensive genome-wide identification, evolutionary phylogeny, conserved motif discovery, gene structure mapping, cis-regulatory element profiling, and expression dynamics across plant/crop genomes.',
    estimatedTime: '5 - 8 Hours',
    difficulty: 'Intermediate',
    outcome: 'Complete publication-ready gene family atlas (e.g., OsWRKY, OsMYB, OsGA20ox) with phylogenetic trees, motif architectures, promoter cis-elements, and stress expression heatmaps.',
    steps: [
      {
        id: 'gf-1-retrieval',
        stepNumber: 1,
        title: 'Genome Sequence & Hidden Markov Model (HMM) Retrieval',
        description: 'Download the complete proteome, CDS, and genome GFF3 files of the target species (e.g., Oryza sativa, Arabidopsis thaliana) and retrieve the Pfam HMM profile of the target domain.',
        rationale: 'A standardized HMM profile captures the probabilistic sequence conservation across diverse family members, enabling discovery of divergent novel paralogs.',
        recommendedTools: ['Ensembl Plants', 'Phytozome', 'NCBI Genome', 'Pfam / InterPro'],
        inputFormat: 'Target Proteome (proteome.fasta) + Pfam HMM file (PF03106.hmm)',
        outputFormat: 'candidate_proteins.fasta',
        codeSnippet: '# Search for domain-containing proteins using HMMER3\nhmmsearch -E 1e-5 --domE 1e-5 --tblout hmm_hits.txt PF03106.hmm proteome.fasta\n# Extract unique protein IDs\nawk \'!/^#/ {print $1}\' hmm_hits.txt | sort -u > candidate_ids.txt',
        codeLanguage: 'bash',
        keyTip: 'Combine both BLASTP (using verified Arabidopsis/Rice reference sequences) and HMMER search to avoid missing non-canonical family members.'
      },
      {
        id: 'gf-2-domain-validation',
        stepNumber: 2,
        title: 'Conserved Domain Verification & Physicochemical Profiling',
        description: 'Validate candidate proteins by scanning through CDD (Conserved Domain Database), SMART, and InterProScan to remove false positives and truncated pseudogenes. Calculate molecular weight, pI, and subcellular localization.',
        rationale: 'Only proteins containing intact, essential catalytic/binding motifs should be designated as genuine family members.',
        recommendedTools: ['NCBI CD-Search', 'InterProScan', 'ExPASy ProtParam', 'WoLF PSORT / Plant-mPLoc'],
        inputFormat: 'candidate_proteins.fasta',
        outputFormat: 'validated_family_members.fasta, physicochemical_properties.csv',
        codeSnippet: '# Run InterProScan locally or through web portal\ninterproscan.sh -i candidate_proteins.fasta -f tsv -dp -goterms -pa',
        codeLanguage: 'bash',
        keyTip: 'Calculate Molecular Weight (kDa), Isoelectric Point (pI), Instability Index, and Grand Average of Hydropathicity (GRAVY) for your descriptive family table.'
      },
      {
        id: 'gf-3-phylogeny',
        stepNumber: 3,
        title: 'Multiple Sequence Alignment & Phylogenetic Reconstruction',
        description: 'Align full-length protein sequences or conserved domain regions with Clustal Omega/MUSCLE and build maximum likelihood phylogenetic trees with ultrafast bootstrap support.',
        rationale: 'Phylogenetic trees partition the gene family into distinct evolutionary subfamilies and orthologous clades, allowing functional inference based on characterized orthologs.',
        recommendedTools: ['IQ-TREE 2', 'MEGA 11', 'MAFFT', 'iTOL / ggtree'],
        inputFormat: 'validated_family_members.fasta + reference species sequences',
        outputFormat: 'alignment.fasta, phylogenetic_tree.treefile, annotated_tree.pdf',
        codeSnippet: '# 1. High-accuracy alignment with MAFFT\nmafft --auto validated_family_members.fasta > family_aligned.fasta\n\n# 2. Maximum Likelihood phylogenetic tree with ModelFinder & 1000 UFBoot\niqtree2 -s family_aligned.fasta -m MFP -B 1000 -T AUTO',
        codeLanguage: 'bash',
        keyTip: 'Always include characterized benchmark sequences from Arabidopsis (*Arabidopsis thaliana*) and Rice (*Oryza sativa*) to anchor and classify your subfamilies correctly.'
      },
      {
        id: 'gf-4-motifs',
        stepNumber: 4,
        title: 'Conserved Motif Discovery & Gene Structure Mapping',
        description: 'Identify conserved sequence motifs with the MEME Suite and parse exon-intron boundaries from genomic GFF3 annotations.',
        rationale: 'Conserved motifs define structural sub-domains, nuclear localization signals (NLS), and phosphorylation sites, while exon-intron architecture reveals evolutionary gene duplication and splicing events.',
        recommendedTools: ['MEME Suite', 'TBtools-II', 'GSDS 2.0 (Gene Structure Display Server)'],
        inputFormat: 'validated_family_members.fasta + genome.gff3',
        outputFormat: 'meme.xml, gene_structure_coordinates.txt, integrated_diagram.pdf',
        codeSnippet: '# Discover 10 conserved motifs using MEME\nmeme validated_family_members.fasta -protein -oc meme_out/ -nostatus -time 14400 -mod zoops -nmotifs 10 -minw 6 -maxw 50',
        codeLanguage: 'bash',
        keyTip: 'Display phylogenetic tree, motif architecture, and exon-intron structure side-by-side in a single integrative multi-panel figure for high-impact publication.'
      },
      {
        id: 'gf-5-promoter',
        stepNumber: 5,
        title: 'Promoter Cis-Regulatory Element & miRNA Target Analysis',
        description: 'Extract 1,500 - 2,000 bp upstream promoter regions from the transcription start site (TSS) and scan for hormone (ABA, GA, Auxin, SA), light, and stress-responsive cis-elements with PlantCARE.',
        rationale: 'Promoter cis-elements indicate which transcription factors and signaling pathways activate or repress specific family members during developmental stages or abiotic stresses.',
        recommendedTools: ['PlantCARE', 'PlantTFDB', 'psRNATarget', 'Bedtools'],
        inputFormat: 'Promoter sequences (1.5 kb upstream FASTA)',
        outputFormat: 'plantcare_results.tab, cis_element_heatmap.pdf, mirna_targets.tsv',
        codeSnippet: '# Extract 2000 bp upstream promoter regions using bedtools\nbedtools flank -i gene_locations.bed -g genome.chrom.sizes -l 2000 -r 0 -s > promoters.bed\nbedtools getfasta -fi genome.fa -bed promoters.bed -s -fo promoters_2kb.fasta',
        codeLanguage: 'bash',
        keyTip: 'Categorize cis-elements into functional groups: Abiotic stress (STRE, DRE/MBS), Phytohormones (ABRE, GARE, AuxRR, TCA-element), and Growth/Development (CAT-box).'
      },
      {
        id: 'gf-6-expression',
        stepNumber: 6,
        title: 'Spatio-Temporal & Stress Expression Profiling',
        description: 'Mine public RNA-seq datasets (NCBI GEO, Rice Expression Database, Genevestigator) to profile gene expression across tissues (root, stem, leaf, panicle) and abiotic/biotic stress conditions (drought, salt, cold, lodging, pathogens).',
        rationale: 'Expression patterns pinpoint which family members have specialized tissue roles or are strongly induced under specific agronomic challenges.',
        recommendedTools: ['R (pheatmap / ComplexHeatmap)', 'DESeq2 / edgeR', 'Rice Expression Database (RED)', 'RT-qPCR'],
        inputFormat: 'TPM / FPKM expression matrix of family genes across conditions',
        outputFormat: 'Expression_Heatmap.pdf, Correlation_Network.pdf, RT-qPCR_Validation_Barplot.pdf',
        codeSnippet: `library(ComplexHeatmap)
library(circlize)

# Log2(TPM + 1) transformation and row-scaling
mat_scaled <- t(scale(t(log2(expression_matrix + 1))))

col_fun = colorRamp2(c(-2, 0, 2), c("#1e40af", "#ffffff", "#b91c1c"))
Heatmap(mat_scaled, name = "Z-Score", col = col_fun,
        cluster_rows = TRUE, cluster_columns = FALSE,
        column_title = "Tissue & Stress Expression Dynamics")`,
        codeLanguage: 'r',
        keyTip: 'Select 4 - 6 key candidate genes identified in silico and validate their expression changes experimentally using wet-lab RT-qPCR.'
      }
    ]
  },

  // Pathway 3: Protein Analysis
  {
    id: 'protein-workflow',
    title: 'Comprehensive Protein Analysis & Structural Docking',
    subtitle: 'From Primary Amino Acid Sequence to 3D Conformation, Docking & Pathway Networks',
    category: 'Protein Structural Biology',
    description: 'An integrative computational biology workflow for structural modeling, catalytic residue profiling, small-molecule virtual screening, and protein-protein interaction (PPI) network topology.',
    estimatedTime: '4 - 6 Hours',
    difficulty: 'Intermediate',
    outcome: 'High-resolution 3D structural model with verified stereochemistry (Ramachandran plot), identified ligand binding pockets, molecular docking binding energies (kcal/mol), and STRING PPI interactome.',
    steps: [
      {
        id: 'prot-1-seq',
        stepNumber: 1,
        title: 'Sequence Retrieval & Physicochemical Characterization',
        description: 'Retrieve gold-standard curated amino acid sequences from UniProtKB and calculate molecular mass, theoretical pI, amino acid composition, hydropathy, and aliphatic index.',
        rationale: 'Primary sequence parameters dictate protein solubility, stability, and experimental handling parameters for wet-lab expression.',
        recommendedTools: ['UniProtKB', 'ExPASy ProtParam', 'Biopython'],
        inputFormat: 'UniProt ID (e.g., P04637) or FASTA sequence',
        outputFormat: 'Protein metadata summary, ProtParam report (.txt)',
        codeSnippet: `from Bio import SeqIO
from Bio.SeqUtils.ProtParam import ProteinAnalysis

protein_seq = "MATGSRTSLLLAFALLCLPWLQ..."
analyzed_seq = ProteinAnalysis(protein_seq)

print(f"Molecular Weight: {analyzed_seq.molecular_weight():.2f} Da")
print(f"Theoretical pI: {analyzed_seq.isoelectric_point():.2f}")
print(f"GRAVY (Hydropathicity): {analyzed_seq.gravy():.3f}")
print(f"Instability Index: {analyzed_seq.instability_index():.2f}")`,
        codeLanguage: 'python',
        keyTip: 'An instability index < 40 predicts the protein is biochemically stable in vitro.'
      },
      {
        id: 'prot-2-domains',
        stepNumber: 2,
        title: 'Domain Architecture & Post-Translational Modification (PTM) Prediction',
        description: 'Scan the sequence across Pfam, SMART, and PROSITE to identify functional domains, catalytic active site triads, signal peptides (SignalP), transmembrane helices (TMHMM), and phosphorylation/glycosylation sites (NetPhos).',
        rationale: 'Mapping functional domains defines the boundary coordinates of the protein catalytic core and regulatory regions.',
        recommendedTools: ['InterProScan', 'SignalP 6.0', 'TMHMM 2.0', 'NetPhos 3.1'],
        inputFormat: 'Amino acid sequence (FASTA)',
        outputFormat: 'Domain coordinate table, PTM site predictions (.tsv)',
        keyTip: 'Check if the protein has a signal peptide; if present, cleavage must be considered when modeling mature 3D structures.'
      },
      {
        id: 'prot-3-structure',
        stepNumber: 3,
        title: '3D Structure Modeling & Stereochemical Validation',
        description: 'Retrieve experimental 3D structures from RCSB PDB or generate AI-predicted coordinates using AlphaFold DB, RoseTTAFold, or SWISS-MODEL. Validate stereochemical quality using Ramachandran plots (PROCHECK/SAVES).',
        rationale: 'Accurate 3D coordinates are required for molecular docking and drug design. Residues in disallowed Ramachandran regions indicate structural distortions.',
        recommendedTools: ['AlphaFold DB', 'SWISS-MODEL', 'PROCHECK / SAVES v6.0', 'PyMOL'],
        inputFormat: 'UniProt ID / FASTA sequence / Template PDB ID',
        outputFormat: 'target_protein.pdb, ramachandran_plot.pdf, errat_score.txt',
        codeSnippet: '# Validate in PyMOL: Align template and target model\n# In PyMOL command-line:\nalign alphafold_model, experimental_pdb\nshow cartoon, alphafold_model\nspectrum b, blue_white_red, alphafold_model',
        codeLanguage: 'bash',
        keyTip: 'Ensure > 90% of residues reside in favored regions of the Ramachandran plot and pLDDT confidence scores exceed 70 for binding pocket regions.'
      },
      {
        id: 'prot-4-pocket',
        stepNumber: 4,
        title: 'Active Site & Ligand Binding Pocket Identification',
        description: 'Detect catalytic pockets, allosteric cavities, and hydrophobic clefts on the 3D protein surface using CASTp, DeepSite, or PrankWeb.',
        rationale: 'Knowing the exact Cartesian coordinates (x, y, z center and dimensions) of the binding pocket is mandatory for setting the search grid box in molecular docking.',
        recommendedTools: ['CASTp 3.0', 'PrankWeb', 'DeepSite', 'PyMOL'],
        inputFormat: 'Cleaned target_protein.pdb',
        outputFormat: 'Pocket volume, surface area, and grid box coordinates (center_x, center_y, center_z, size_x, size_y, size_z)',
        keyTip: 'Cross-reference predicted binding pockets with catalytic residues known from UniProtKB functional annotations.'
      },
      {
        id: 'prot-5-docking',
        stepNumber: 5,
        title: 'Molecular Docking & Binding Affinity Calculation',
        description: 'Prepare receptor (remove water, add polar hydrogens, assign Kollman charges) and ligands (energy minimize, assign Gasteiger charges). Execute virtual screening with AutoDock Vina / PyRx and calculate binding affinities (kcal/mol).',
        rationale: 'Quantifies the intermolecular binding energy, electrostatic interactions, and hydrogen bonding patterns between target receptors and small molecules or phytochemical leads.',
        recommendedTools: ['AutoDock Vina', 'PyRx', 'MGLTools', 'OpenBabel', 'Discovery Studio Visualizer'],
        inputFormat: 'receptor.pdbqt, ligand.pdbqt, config.txt',
        outputFormat: 'docked_poses.pdbqt, binding_affinity_log.txt, 2D_interaction_diagram.png',
        codeSnippet: `# AutoDock Vina configuration file (config.txt)
receptor = target_receptor.pdbqt
ligand = lead_compound.pdbqt

center_x = 15.42
center_y = -8.15
center_z = 24.60

size_x = 22.0
size_y = 22.0
size_z = 22.0

exhaustiveness = 32
num_modes = 9
energy_range = 3

# Run Vina
vina --config config.txt --out results_docked.pdbqt --log docking.log`,
        codeLanguage: 'bash',
        keyTip: 'A binding affinity more negative than -7.0 kcal/mol with multiple hydrogen bonds and hydrophobic interactions typically indicates strong lead potential.'
      },
      {
        id: 'prot-6-interactome',
        stepNumber: 6,
        title: 'Protein-Protein Interaction (PPI) & Pathway Network Topology',
        description: 'Map the target protein within the organism interactome using STRING database, evaluate topological parameters (Degree Centrality, Betweenness, Closeness) in Cytoscape, and identify hub-gene clusters with CytoHubba.',
        rationale: 'Proteins do not function in isolation; identifying interaction partners illuminates the molecular cascade, downstream signaling, and potential off-target effects.',
        recommendedTools: ['STRING Database', 'Cytoscape Desktop', 'CytoHubba plugin', 'MCODE'],
        inputFormat: 'Target protein ID + first-shell interactors',
        outputFormat: 'PPI_network.cys, Hub_genes_ranking.csv, Pathway_enrichment_bubble.pdf',
        keyTip: 'Use a high confidence interaction score threshold (STRING score > 0.700) to filter out spurious computational predictions.'
      }
    ]
  },

  // Pathway 4: Proteomics -> Multi-Omics -> Genomics -> Drug Designing
  {
    id: 'multiomics-drug-workflow',
    title: 'Proteomics → Multi-Omics → Genomics → Drug Designing',
    subtitle: 'Translational Bioinformatics Protocol for Target Identification & Precision Lead Optimization',
    category: 'Multi-Omics & Drug Discovery',
    description: 'An advanced multi-layered omics integration framework that bridges genomics variants (GWAS/WGS), transcriptomics (bulk/scRNA-seq), and mass spectrometry proteomics with computational drug design pipelines.',
    estimatedTime: '6 - 10 Hours',
    difficulty: 'Advanced',
    outcome: 'Identify validated multi-omics target proteins, discover allosteric/catalytic binding pockets, design selective lead inhibitors, and evaluate drug-likeness (Lipinski Rule of 5).',
    steps: [
      {
        id: 'mod-1-genomics',
        stepNumber: 1,
        title: 'Genomics & Variant Mining (WGS / GWAS)',
        description: 'Identify disease-associated or trait-associated Single Nucleotide Polymorphisms (SNPs) and structural variants (SVs) using Genome-Wide Association Studies (GWAS) and whole-genome sequencing datasets.',
        rationale: 'Genomic loci provide causal genetic evidence linking a specific gene/protein to a biological phenotype or disease susceptibility.',
        recommendedTools: ['PLINK', 'GATK4', 'NCBI dbSNP / GWAS Catalog', 'Ensembl VEP'],
        inputFormat: 'VCF files, GWAS summary statistics',
        outputFormat: 'Prioritized candidate causal genes, nonsynonymous SNP annotations',
        keyTip: 'Focus on nonsynonymous mutations (missense/nonsense) altering protein coding sequences or eQTL variants impacting expression levels.'
      },
      {
        id: 'mod-2-proteomics',
        stepNumber: 2,
        title: 'Quantitative Mass Spectrometry Proteomics & PTM Profiling',
        description: 'Process tandem mass spectrometry (LC-MS/MS) datasets (label-free quantification / TMT / DIA) with MaxQuant or Proteome Discoverer to quantify actual protein abundances and post-translational modifications.',
        rationale: 'mRNA transcript levels only moderately correlate with active protein abundance (r ~ 0.40 - 0.60) due to translational regulation and protein degradation rates.',
        recommendedTools: ['MaxQuant', 'FragPipe', 'Perseus', 'Spectronaut'],
        inputFormat: 'Raw mass spectrometry files (.raw) + UniProt FASTA database',
        outputFormat: 'proteinGroups.txt, Phospho (STY)Sites.txt, normalized protein intensities',
        keyTip: 'Integrate phosphoproteomics data to identify actively signaling kinase cascades and phosphorylated regulatory nodes.'
      },
      {
        id: 'mod-3-multiomics-integration',
        stepNumber: 3,
        title: 'Multi-Omics Network Integration & Causal Target Prioritization',
        description: 'Integrate genomic variants, transcriptomic DEGs, and proteomic abundance matrices using multi-omics factor analysis (MOFA+), WGCNA co-expression networks, and Open Targets Platform to rank candidate therapeutic targets.',
        rationale: 'Targets supported by convergent multi-omics evidence have a 2-3x higher success rate in clinical development pipelines.',
        recommendedTools: ['MOFA2 (R package)', 'WGCNA', 'Open Targets Platform', 'iOmics'],
        inputFormat: 'Matched sample matrices (Genomics, Transcriptomics, Proteomics)',
        outputFormat: 'Latent factor scores, prioritized therapeutic target ranking table',
        codeSnippet: `library(MOFA2)
# Create MOFA object with multi-omics layers
mofa_obj <- create_mofa(list(RNA = rna_data, Protein = prot_data, Metabolite = met_data))
model_opts <- get_default_model_options(mofa_obj)
train_opts <- get_default_training_options(mofa_obj)
mofa_trained <- run_mofa(mofa_obj, model_options = model_opts, training_options = train_opts)`,
        codeLanguage: 'r',
        keyTip: 'Check target "tractability / druggability" scores on Open Targets to verify target pocket accessibility before committing to drug design.'
      },
      {
        id: 'mod-4-structure-modeling',
        stepNumber: 4,
        title: 'Target Protein Structural Preparation & Mutation Mapping',
        description: 'Construct high-resolution 3D models of the prioritized target (incorporating disease-associated variant mutations) and perform energy minimization in AMBER/CHARMM force fields.',
        rationale: 'Drug binding affinities can change by orders of magnitude in the presence of single point mutations; modeling variant structures prevents resistance.',
        recommendedTools: ['AlphaFold 3', 'PyMOL', 'GROMACS / NAMD', 'Swiss-PdbViewer'],
        inputFormat: 'Wild-type & Mutant protein sequences / PDB models',
        outputFormat: 'Energy-minimized target receptor structure (.pdbqt)',
        keyTip: 'Carry out a short 10-20 ns molecular dynamics (MD) equilibration in GROMACS to allow flexible binding loops to relax.'
      },
      {
        id: 'mod-5-virtual-screening',
        stepNumber: 5,
        title: 'High-Throughput Virtual Screening & Lead Identification',
        description: 'Screen diverse chemical libraries (ZINC20, PubChem, DrugBank, natural phytochemical databases) containing 10,000+ compounds against the target binding pocket using AutoDock Vina / PyRx.',
        rationale: 'Virtual screening narrows millions of chemical candidates down to top-ranked lead candidates at a fraction of wet-lab screening costs.',
        recommendedTools: ['AutoDock Vina', 'ZINC20 Database', 'PyRx', 'RDKit (Python)'],
        inputFormat: 'Receptor grid + Ligand database (SDF / PDBQT)',
        outputFormat: 'Top 50 docked lead poses, binding energy ranking table (kcal/mol)',
        keyTip: 'Use RDKit in Python to pre-filter ligand libraries for Lipinski’s Rule of 5 and PAINS (Pan-Assay Interference Compounds) filters before docking.'
      },
      {
        id: 'mod-6-admet',
        stepNumber: 6,
        title: 'In Silico ADMET & Pharmacokinetic Profiling',
        description: 'Assess Absorption, Distribution, Metabolism, Excretion, and Toxicity (ADMET) properties of top docking leads using SwissADME, pkCSM, and ProTox-3.',
        rationale: 'Over 50% of drug discovery failures in late stages are caused by poor pharmacokinetics (e.g., poor oral bioavailability, hERG cardiac toxicity, hepatotoxicity).',
        recommendedTools: ['SwissADME', 'pkCSM', 'ProTox-3', 'ADMETlab 3.0'],
        inputFormat: 'Lead compound SMILES notation strings',
        outputFormat: 'Bioavailability radar, Cytochrome P450 inhibition profiles, LD50 toxicity predictions',
        keyTip: 'Prioritize leads with high gastrointestinal (GI) absorption, zero BBB permeability (unless targeting CNS), and clean toxicity profiles.'
      }
    ]
  },

  // Pathway 5: Drug Discovery -> Drug Development -> Protein Structure and Protein Analysis
  {
    id: 'drug-discovery-dev-workflow',
    title: 'Drug Discovery → Drug Development Pipeline',
    subtitle: 'From Biological Target Validation to Preclinical Lead Optimization & Molecular Dynamics',
    category: 'Drug Discovery & Development',
    description: 'A structured overview of the modern rational drug design journey: Target Identification & Validation, Hit-to-Lead generation, Lead Optimization, Structure-Activity Relationship (SAR) analysis, and Molecular Dynamics (MD) Simulation.',
    estimatedTime: '5 - 7 Hours',
    difficulty: 'Intermediate',
    outcome: 'Formulate an end-to-end preclinical drug candidate dossier with confirmed target engagement, sub-nanomolar binding simulation, SAR optimization strategy, and ADMET validation.',
    steps: [
      {
        id: 'ddd-1-target-validation',
        stepNumber: 1,
        title: 'Target Identification & Biological Validation',
        description: 'Validate that modulating the proposed protein target (inhibition, activation, or degradation) produces the desired therapeutic effect without severe on-target toxicity.',
        rationale: 'Target failure is the most expensive mistake in drug development. Validation requires genetic knockdown (CRISPR/RNAi), pharmacological tool compounds, and human disease evidence.',
        recommendedTools: ['Open Targets Platform', 'ChEMBL', 'DepMap Portal', 'Pharos'],
        inputFormat: 'Target Gene/Protein Identifier',
        outputFormat: 'Target validation report, safety profile, known benchmark chemical probes',
        keyTip: 'Ensure the target has proven essentiality in the disease model and low expression in vital healthy organs.'
      },
      {
        id: 'ddd-2-hit-identification',
        stepNumber: 2,
        title: 'Hit Identification & Assay Development',
        description: 'Discover chemical starting points ("hits") possessing confirmed affinity (IC50 / Kd < 10 µM) via High-Throughput Screening (HTS), Fragment-Based Drug Discovery (FBDD), or In Silico Virtual Screening.',
        rationale: 'Establishes reproducible chemical scaffolds that specifically bind the target pocket.',
        recommendedTools: ['PubChem', 'ChEMBL', 'BindingDB', 'PyRx'],
        inputFormat: 'Chemical library (SMILES/SDF) + Protein structure (PDB)',
        outputFormat: 'Confirmed hit scaffolds, experimental binding curves, IC50 values',
        keyTip: 'Perform surface plasmon resonance (SPR) or isothermal titration calorimetry (ITC) in vitro to confirm direct biophysical binding.'
      },
      {
        id: 'ddd-3-hit-to-lead',
        stepNumber: 3,
        title: 'Hit-to-Lead (H2L) & Structure-Activity Relationship (SAR)',
        description: 'Synthesize or model chemical analogs by varying functional groups around the core scaffold to establish Structure-Activity Relationships (SAR) and improve potency to nanomolar range (IC50 < 100 nM).',
        rationale: 'Systematic chemical modification reveals which pharmacophore elements are critical for hydrogen bonding, electrostatic attraction, and steric fit within the protein binding pocket.',
        recommendedTools: ['RDKit', 'DataWarrior', 'SeeSAR', 'PyMOL'],
        inputFormat: 'Core scaffold SMILES + Series of analog substitutions',
        outputFormat: 'SAR potency tables, R-group decomposition plots, 3D binding pose overlays',
        keyTip: 'Track ligand efficiency (LE) = binding energy / number of heavy atoms. High LE indicates efficient molecular fit without unnecessary bulk.'
      },
      {
        id: 'ddd-4-lead-opt',
        stepNumber: 4,
        title: 'Lead Optimization & Selectivity Profiling',
        description: 'Fine-tune lead molecules to balance high potency against the primary target while eliminating off-target binding against homologous proteins (kinome selectivity, ion channels).',
        rationale: 'Broad-spectrum off-target binding leads to adverse drug reactions and trial failures.',
        recommendedTools: ['ChEMBL Kinase SAR', 'CATH / InterPro (Homology checks)', 'SwissTargetPrediction'],
        inputFormat: 'Optimized lead molecules',
        outputFormat: 'Selectivity panel matrices, off-target risk assessment',
        keyTip: 'Target non-conserved residue differences at the periphery of the binding pocket to engineer exquisite subtype selectivity.'
      },
      {
        id: 'ddd-5-md-simulations',
        stepNumber: 5,
        title: 'Molecular Dynamics (MD) Simulation & Binding Free Energy (MM-PBSA)',
        description: 'Simulate the dynamic physical movements of the protein-ligand complex over 100 - 500 nanoseconds in explicit water solvent to calculate RMSD, RMSF, hydrogen bond lifespans, and MM-PBSA/GBSA binding free energies.',
        rationale: 'Static molecular docking ignores protein flexibility, water bridges, and entropy. MD simulations verify whether the ligand remains stably locked in the pocket over time.',
        recommendedTools: ['GROMACS', 'NAMD', 'AMBER', 'gmx_MMPBSA'],
        inputFormat: 'Protein-Ligand complex PDB + Topology files (CHARMM36 / AMBER14SB + GAFF2)',
        outputFormat: 'Trajectory files (.xtc, .trr), RMSD/RMSF plots, ΔG binding free energy values (kcal/mol)',
        codeSnippet: `# Standard GROMACS production run
gmx grompp -f md_prod.mdp -c npt.gro -t npt.cpt -p topol.top -o md_100ns.tpr
gmx mdrun -v -deffnm md_100ns -nb gpu

# Analyze Root Mean Square Deviation (RMSD)
gmx rms -s md_100ns.tpr -f md_100ns.xtc -o rmsd_complex.xvg`,
        codeLanguage: 'bash',
        keyTip: 'A stable protein-ligand complex will exhibit an RMSD plateau (< 0.25 nm / 2.5 Å) with continuous key hydrogen bonds maintained throughout the trajectory.'
      },
      {
        id: 'ddd-6-preclinical',
        stepNumber: 6,
        title: 'Preclinical Candidate Selection & Formulation',
        description: 'Complete formal preclinical documentation: in vitro microsomal metabolic stability, plasma protein binding, CYP450 induction, in vivo pharmacokinetic half-life (t1/2), and therapeutic window determination.',
        rationale: 'Provides the definitive data package required for filing an Investigational New Drug (IND) application to regulatory bodies.',
        recommendedTools: ['pkCSM', 'ADMETlab 3.0', 'GraphPad Prism / R'],
        inputFormat: 'Final optimized lead candidate dossier',
        outputFormat: 'Preclinical IND package, pharmacokinetic curves, safety pharmacology report',
        keyTip: 'Ensure favorable oral bioavailability (F > 30%) and a clean Ames mutagenicity test in silico before advancing to animal model studies.'
      }
    ]
  }
];
