import { BioSoftware } from '../types';

export const softwareDatabaseList: BioSoftware[] = [
  // 1. NCBI BLAST
  {
    id: 'ncbi-blast',
    name: 'NCBI BLAST (Basic Local Alignment Search Tool)',
    category: 'Genomics & Sequence',
    level: 'Beginner',
    purpose: 'Finds regions of local similarity between biological sequences (nucleotide or protein) by comparing query sequences against massive public databases.',
    inputType: 'FASTA sequence, Accession number, or raw nucleotide/amino acid string',
    outputType: 'Pairwise alignments, E-values, Bit scores, Percent identities, Query coverage',
    bestUseCase: 'Identifying unknown genes/proteins, finding homologous sequences across organisms, and mapping functional domains.',
    websiteUrl: 'https://blast.ncbi.nlm.nih.gov/Blast.cgi',
    tags: ['Sequence Alignment', 'Homology Search', 'NCBI', 'FASTA'],
    sampleCommand: 'blastp -query query.fasta -db nr -out results.txt -evalue 1e-5 -outfmt 6'
  },
  // 2. NCBI GEO
  {
    id: 'ncbi-geo',
    name: 'NCBI GEO (Gene Expression Omnibus)',
    category: 'Databases',
    level: 'Beginner',
    purpose: 'Public functional genomics data repository supporting high-throughput gene expression data submissions (microarray, RNA-seq, scRNA-seq, ChIP-seq).',
    inputType: 'GEO Accession (GSE, GSM, GPL, GDS), Gene symbols, or disease/organism keywords',
    outputType: 'Raw FASTQ/SRA links, processed expression count matrices, Series Matrix files',
    bestUseCase: 'Downloading public transcriptomic datasets for meta-analysis, re-analyzing clinical RNA-seq data, or validating experimental biomarkers.',
    websiteUrl: 'https://www.ncbi.nlm.nih.gov/geo/',
    tags: ['Expression Database', 'Microarray', 'RNA-seq', 'Public Datasets']
  },
  // 3. NCBI SRA
  {
    id: 'ncbi-sra',
    name: 'NCBI SRA (Sequence Read Archive)',
    category: 'Databases',
    level: 'Intermediate',
    purpose: 'Largest publicly available repository of high-throughput sequencing data (Illumina, PacBio, Oxford Nanopore).',
    inputType: 'SRA Accession (SRR, SRX, SRP, PRJNA), BioProject ID',
    outputType: '.sra archive files, raw paired/single-end FASTQ reads',
    bestUseCase: 'Fetching raw sequencing reads for de novo assembly, variant calling pipelines, and RNA-seq re-alignment.',
    websiteUrl: 'https://www.ncbi.nlm.nih.gov/sra',
    tags: ['Raw Reads', 'NGS', 'High-Throughput Sequencing', 'FASTQ'],
    sampleCommand: 'fasterq-dump --split-files SRR1234567'
  },
  // 4. Ensembl Plants
  {
    id: 'ensembl-plants',
    name: 'Ensembl Plants',
    category: 'Plant Bioinformatics',
    level: 'Beginner',
    purpose: 'Integrative genome resource for plant species (rice, wheat, Arabidopsis, maize) featuring annotated genomes, variation, and comparative genomics.',
    inputType: 'Gene ID, Genomic Coordinates (Chr:Start-End), BLAST sequence, Species name',
    outputType: 'Genomic GFF3/GTF annotations, CDS/Protein FASTA, synteny maps, variant effect data',
    bestUseCase: 'Exploring gene models, structural variations, orthology, and promoter regions in crop species like Oryza sativa and Triticum aestivum.',
    websiteUrl: 'https://plants.ensembl.org/',
    tags: ['Plant Genomics', 'Genome Browser', 'Annotations', 'Synteny']
  },
  // 5. Gramene
  {
    id: 'gramene',
    name: 'Gramene Database',
    category: 'Plant Bioinformatics',
    level: 'Intermediate',
    purpose: 'Curated open-access comparative genomics and pathway architecture resource specifically tailored for crops and model plant species.',
    inputType: 'Gene symbol, Gramene ID, Plant Reactome pathway term, QTL identifier',
    outputType: 'Plant pathway diagrams, metabolic networks, phylogenetic gene trees, QTL mappings',
    bestUseCase: 'Investigating metabolic pathways, stress-response regulatory networks, and pan-genome syntenic blocks in cereals.',
    websiteUrl: 'https://www.gramene.org/',
    tags: ['Cereal Genomics', 'Plant Reactome', 'Metabolism', 'QTL']
  },
  // 6. UniProt
  {
    id: 'uniprot',
    name: 'UniProtKB (Universal Protein Resource)',
    category: 'Databases',
    level: 'Beginner',
    purpose: 'Comprehensive, high-quality, and freely accessible resource of protein sequence and functional information (Swiss-Prot reviewed & TrEMBL).',
    inputType: 'UniProt Accession (e.g., P04637), Gene name, Protein name, Organism',
    outputType: 'Curated protein summaries, amino acid sequences (.fasta), domain coordinates, PTM sites, 3D structure cross-references',
    bestUseCase: 'Retrieving gold-standard protein sequences, cataloging active site residues, and discovering biochemical functions.',
    websiteUrl: 'https://www.uniprot.org/',
    tags: ['Protein Database', 'Swiss-Prot', 'Functional Annotation', 'PTMs']
  },
  // 7. PDB
  {
    id: 'rcsb-pdb',
    name: 'RCSB PDB (Protein Data Bank)',
    category: 'Structure & Docking',
    level: 'Beginner',
    purpose: 'Global repository of experimentally determined 3D structures of proteins, nucleic acids, and complex biomolecular assemblies (X-ray, Cryo-EM, NMR).',
    inputType: '4-character PDB ID (e.g., 1TUP, 6VXX), UniProt ID, Ligand code, FASTA sequence',
    outputType: '.pdb, .cif atomic coordinate files, electron density maps, ligand interaction diagrams',
    bestUseCase: 'Downloading validated 3D atomic coordinates for molecular docking, molecular dynamics (MD) simulations, and drug target analysis.',
    websiteUrl: 'https://www.rcsb.org/',
    tags: ['3D Structure', 'Cryo-EM', 'X-ray Crystallography', 'Atomic Coordinates']
  },
  // 8. AlphaFold DB
  {
    id: 'alphafold-db',
    name: 'AlphaFold Protein Structure Database',
    category: 'Structure & Docking',
    level: 'Beginner',
    purpose: 'Open-access database created by DeepMind and EMBL-EBI providing highly accurate AI-predicted 3D protein structures for over 200 million proteins.',
    inputType: 'UniProt Accession, Organism name, Gene symbol',
    outputType: 'Predicted 3D structures (.pdb, .cif), per-residue confidence metric (pLDDT score), Predicted Aligned Error (PAE) matrices',
    bestUseCase: 'Obtaining high-confidence 3D models for uncharacterized proteins lacking crystallographic structures (crucial for plant and uncultured organism proteomes).',
    websiteUrl: 'https://alphafold.ebi.ac.uk/',
    tags: ['AI Structure Prediction', 'DeepMind', 'pLDDT', 'Structural Biology']
  },
  // 9. Rosetta
  {
    id: 'rosetta',
    name: 'Rosetta Molecular Modeling Suite',
    category: 'Structure & Docking',
    level: 'Advanced',
    purpose: 'Comprehensive software suite for macromolecular structure modeling, de novo protein design, protein-protein docking, and loop modeling.',
    inputType: '.pdb structure files, FASTA sequence, resfile constraint specifications, symmetry definitions',
    outputType: 'Relaxed/refined .pdb structural ensembles, energy score terms, design sequences',
    bestUseCase: 'De novo protein engineering, high-resolution protein-protein docking, and designing novel biocatalysts or therapeutic peptides.',
    websiteUrl: 'https://www.rosettacommons.org/',
    tags: ['Protein Design', 'De Novo Modeling', 'Energy Optimization', 'Macromolecular Docking']
  },
  // 10. Swiss Model
  {
    id: 'swiss-model',
    name: 'SWISS-MODEL',
    category: 'Structure & Docking',
    level: 'Beginner',
    purpose: 'Automated web-server for comparative/homology modeling of 3D protein structures based on sequence alignment with known homologous templates.',
    inputType: 'Amino acid sequence (FASTA) or UniProt ID',
    outputType: '3D homology model (.pdb), GMQE (Global Model Quality Estimate), QMEAN quality scores',
    bestUseCase: 'Rapidly building reliable 3D structures when experimental homologs exist in the PDB.',
    websiteUrl: 'https://swissmodel.expasy.org/',
    tags: ['Homology Modeling', 'Web Server', 'Template-Based', 'QMEAN']
  },
  // 11. I-TASSER
  {
    id: 'i-tasser',
    name: 'I-TASSER (Iterative Threading ASSEmbly Refinement)',
    category: 'Structure & Docking',
    level: 'Intermediate',
    purpose: 'Hierarchical protein structure modeling and function prediction server using threading and ab initio fragment assembly.',
    inputType: 'Amino acid sequence in FASTA format',
    outputType: 'Top 5 predicted 3D structure models (.pdb), C-score, TM-score, predicted ligand binding sites, EC numbers',
    bestUseCase: 'Modeling challenging targets with low sequence identity to existing PDB structures and predicting binding pockets.',
    websiteUrl: 'https://zhanggroup.org/I-TASSER/',
    tags: ['Threading', 'Structure Prediction', 'Ligand Binding Prediction', 'C-Score']
  },
  // 12. Robetta
  {
    id: 'robetta',
    name: 'Robetta Structure Prediction Server',
    category: 'Structure & Docking',
    level: 'Intermediate',
    purpose: 'Automated protein structure prediction server utilizing RoseTTAFold and traditional Rosetta fragment assembly methods.',
    inputType: 'Amino acid sequence (FASTA)',
    outputType: '3D coordinates (.pdb), per-residue error estimates, domain partition boundaries',
    bestUseCase: 'Deep-learning based rapid tertiary structure modeling and multi-domain protein assembly.',
    websiteUrl: 'https://robetta.bakerlab.org/',
    tags: ['RoseTTAFold', 'Baker Lab', 'Ab Initio', 'Domain Parsing']
  },
  // 13. MODELLER
  {
    id: 'modeller',
    name: 'MODELLER',
    category: 'Structure & Docking',
    level: 'Advanced',
    purpose: 'Command-line tool and Python library for homology or comparative modeling of protein 3D structures by satisfaction of spatial restraints.',
    inputType: 'PIR format sequence alignment, template .pdb coordinate files, Python control script',
    outputType: 'Target .pdb coordinate files, DOPE (Discrete Optimized Protein Energy) assessment scores',
    bestUseCase: 'Custom multi-template homology modeling, loop refinement, and automated batch modeling in Python pipelines.',
    websiteUrl: 'https://salilab.org/modeller/',
    tags: ['Homology Modeling', 'Python Scripting', 'Spatial Restraints', 'DOPE Score']
  },
  // 14. InterPro
  {
    id: 'interpro',
    name: 'InterPro (Protein Families, Domains and Functional Sites)',
    category: 'Databases',
    level: 'Beginner',
    purpose: 'Integrates signatures from 13 member databases (Pfam, PRINTS, SMART, PROSITE, CATH-Gene3D, PANTHER, CDD) to provide functional protein classification.',
    inputType: 'Protein sequence (FASTA) or UniProt ID',
    outputType: 'Domain coordinates, family membership, active site annotations, Gene Ontology (GO) mappings',
    bestUseCase: 'Comprehensive domain identification, classifying uncharacterized sequences, and functional genome annotation.',
    websiteUrl: 'https://www.ebi.ac.uk/interpro/',
    tags: ['Protein Domains', 'Pfam Integration', 'Functional Sites', 'EMBL-EBI']
  },
  // 15. Pfam
  {
    id: 'pfam',
    name: 'Pfam Database',
    category: 'Databases',
    level: 'Intermediate',
    purpose: 'Extensive collection of protein families, each represented by multiple sequence alignments and profile hidden Markov models (HMMs).',
    inputType: 'FASTA sequence or HMM profile query',
    outputType: 'HMMER domain match hits, E-values, domain clan classifications',
    bestUseCase: 'Genome-wide gene family identification (e.g., finding all WRKY, MYB, or NBS-LRR genes in a crop genome).',
    websiteUrl: 'https://www.ebi.ac.uk/interpro/entry/pfam/',
    tags: ['HMM Profile', 'Protein Families', 'HMMER', 'Clans']
  },
  // 16. STRING
  {
    id: 'string-db',
    name: 'STRING (Search Tool for the Retrieval of Interacting Genes/Proteins)',
    category: 'Pathways & Networks',
    level: 'Beginner',
    purpose: 'Database of known and predicted protein-protein interactions (PPI), covering physical and functional associations with confidence scoring.',
    inputType: 'List of gene symbols, UniProt IDs, or organism-specific protein identifiers',
    outputType: 'Interactive network graph, enrichment statistics (GO, KEGG, Reactome), exportable TSV/PNG/SVG/Cytoscape networks',
    bestUseCase: 'Network pharmacology, hub-gene identification, discovering functional partners of target proteins, and multi-omics integration.',
    websiteUrl: 'https://string-db.org/',
    tags: ['PPI Network', 'Protein Interactions', 'Hub Genes', 'Network Pharmacology']
  },
  // 17. KEGG
  {
    id: 'kegg',
    name: 'KEGG (Kyoto Encyclopedia of Genes and Genomes)',
    category: 'Pathways & Networks',
    level: 'Beginner',
    purpose: 'Comprehensive database resource for understanding high-level biological functions and systems from molecular-level information (genomic, chemical, systemic).',
    inputType: 'KEGG Gene ID, EC number, Compound ID (C-number), KO ID (K-number)',
    outputType: 'Curated pathway maps (.png/.kgml), orthology assignments, drug interaction networks',
    bestUseCase: 'Over-representation analysis of differentially expressed genes, metabolic pathway mapping, and drug mechanism elucidation.',
    websiteUrl: 'https://www.genome.jp/kegg/',
    tags: ['Metabolic Pathways', 'KEGG Orthology', 'Pathway Maps', 'Enrichment']
  },
  // 18. Reactome
  {
    id: 'reactome',
    name: 'Reactome Pathway Knowledgebase',
    category: 'Pathways & Networks',
    level: 'Intermediate',
    purpose: 'Peer-reviewed, open-access, open-source curated database of biological pathways spanning human, model organisms, and plants (Plant Reactome).',
    inputType: 'Gene list, Uniprot IDs, Ensembl IDs, expression count matrix with identifiers',
    outputType: 'Interactive pathway hierarchy browser, Voronoi pathway overviews, reaction participant diagrams',
    bestUseCase: 'Multi-omics pathway enrichment, identifying upstream triggers and downstream biological cascades in disease or stress conditions.',
    websiteUrl: 'https://reactome.org/',
    tags: ['Pathway Database', 'Biochemical Reactions', 'Over-Representation', 'Open Access']
  },
  // 19. DAVID
  {
    id: 'david',
    name: 'DAVID (Database for Annotation, Visualization and Integrated Discovery)',
    category: 'Pathways & Networks',
    level: 'Beginner',
    purpose: 'High-throughput functional annotation tool that provides biological meaning and functional clustering for large gene lists.',
    inputType: 'List of gene identifiers (Entrez, Ensembl, UniProt, RefSeq) + background gene list',
    outputType: 'Functional annotation clusters, GO enrichment tables, KEGG pathway associations with Fisher exact p-values (FDR/Bonferroni)',
    bestUseCase: 'Clustering hundreds of RNA-seq DEGs into cohesive biological themes and over-represented Gene Ontology categories.',
    websiteUrl: 'https://david.ncifcrf.gov/',
    tags: ['Gene Enrichment', 'Functional Clustering', 'DEG Analysis', 'GO Analysis']
  },
  // 20. g:Profiler
  {
    id: 'gprofiler',
    name: 'g:Profiler (g:GOSt, g:Convert, g:Orth)',
    category: 'Pathways & Networks',
    level: 'Beginner',
    purpose: 'Fast, frequently updated web server and API for functional enrichment analysis of gene lists, identifier conversion, and orthology search.',
    inputType: 'List of gene symbols, Ensembl IDs, or ordered rank list of genes',
    outputType: 'Interactive Manhattan-style enrichment plots, detailed GO/KEGG/Reactome tables, exportable CSV/GEM for EnrichmentMap',
    bestUseCase: 'Rapid pathway enrichment of ranked gene lists from RNA-seq and converting obscure gene identifiers across multiple species.',
    websiteUrl: 'https://biit.cs.ut.ee/gprofiler/gost',
    tags: ['Enrichment Analysis', 'ID Conversion', 'Orthology', 'Ranked Lists']
  },
  // 21. Cytoscape
  {
    id: 'cytoscape',
    name: 'Cytoscape Desktop',
    category: 'Pathways & Networks',
    level: 'Intermediate',
    purpose: 'Premier open-source desktop software platform for visualizing complex biomolecular interaction networks and integrating them with gene expression profiles.',
    inputType: 'Interaction networks (SIF, TSV, CSV, STRING query), node and edge attribute tables',
    outputType: 'High-resolution publication-quality network diagrams, topological analysis (degree, betweenness centrality, closeness)',
    bestUseCase: 'Visualizing STRING networks, identifying key bottleneck and hub genes with CytoHubba, and creating publication figures.',
    websiteUrl: 'https://cytoscape.org/',
    tags: ['Network Visualization', 'Hub Genes', 'CytoHubba', 'Topology Analysis']
  },
  // 22. Galaxy
  {
    id: 'galaxy-project',
    name: 'Galaxy Platform',
    category: 'Genomics & Sequence',
    level: 'Beginner',
    purpose: 'Web-based, accessible platform for data-intensive biomedical research that enables reproducible bioinformatics analysis without command-line requirements.',
    inputType: 'Raw FASTQ reads, FASTA, BAM, GFF/GTF, tabular data uploaded or fetched directly from SRA/GEO',
    outputType: 'Reproducible workflow histories, multi-step analysis results, charts, and downloadable files',
    bestUseCase: 'Running complete NGS pipelines (FastQC → Trimming → Alignment → Differential Expression) with complete reproducibility and zero local installation.',
    websiteUrl: 'https://usegalaxy.org/',
    tags: ['GUI Bioinformatics', 'Reproducible Workflows', 'Cloud Computing', 'No-Code']
  },
  // 23. FastQC
  {
    id: 'fastqc',
    name: 'FastQC',
    category: 'Transcriptomics & RNA-seq',
    level: 'Beginner',
    purpose: 'Quality control tool for high throughput sequencing data, providing an overview of whether raw data has any problems before alignment.',
    inputType: 'FASTQ, SAM, or BAM files (gzip compressed supported)',
    outputType: 'Interactive HTML report and summary text file with per-base quality scores, GC content, adapter contamination, and sequence duplication',
    bestUseCase: 'First mandatory step in any RNA-seq, WGS, or ChIP-seq pipeline to diagnose sequencing errors and adapter carryover.',
    websiteUrl: 'https://www.bioinformatics.babraham.ac.uk/projects/fastqc/',
    tags: ['Quality Control', 'NGS', 'FASTQ', 'Per-base Quality'],
    sampleCommand: 'fastqc sample_R1.fastq.gz sample_R2.fastq.gz -o qc_reports/'
  },
  // 24. MultiQC
  {
    id: 'multiqc',
    name: 'MultiQC',
    category: 'Transcriptomics & RNA-seq',
    level: 'Beginner',
    purpose: 'Aggregates bioinformatics results across many samples and multiple software tools into a single comprehensive, interactive HTML report.',
    inputType: 'Output directories/logs from FastQC, Cutadapt, STAR, HISAT2, featureCounts, Salmon, Kallisto, etc.',
    outputType: 'Single interactive HTML summary report (.html) and data matrices (.tsv)',
    bestUseCase: 'Summarizing QC metrics across 20+ RNA-seq samples simultaneously to spot batch effects and sample outliers.',
    websiteUrl: 'https://multiqc.info/',
    tags: ['QC Aggregation', 'Reporting', 'Batch QC', 'Interactive HTML'],
    sampleCommand: 'multiqc . -o multiqc_report/'
  },
  // 25. STAR
  {
    id: 'star-aligner',
    name: 'STAR (Spliced Transcripts Alignment to a Reference)',
    category: 'Transcriptomics & RNA-seq',
    level: 'Advanced',
    purpose: 'Ultra-fast, splice-aware RNA-seq aligner capable of mapping millions of reads per minute to reference genomes using sequential maximum mappable seed search.',
    inputType: 'Paired-end or single-end FASTQ reads + Reference Genome FASTA & GTF/GFF3 annotations',
    outputType: 'Sorted/unsorted BAM alignment files, splice junction tables (SJ.out.tab), unmapped reads',
    bestUseCase: 'Gold-standard splice-aware alignment of eukaryotic RNA-seq reads for differential expression and novel splice junction discovery.',
    websiteUrl: 'https://github.com/alexdobin/STAR',
    tags: ['Splice-Aware Aligner', 'RNA-seq Alignment', 'BAM', 'High Performance'],
    sampleCommand: 'STAR --genomeDir genome_index/ --readFilesIn R1.fq.gz R2.fq.gz --readFilesCommand zcat --outSAMtype BAM SortedByCoordinate'
  },
  // 26. HISAT2
  {
    id: 'hisat2',
    name: 'HISAT2 (Hierarchical Indexing for Spliced Alignment of Transcripts 2)',
    category: 'Transcriptomics & RNA-seq',
    level: 'Intermediate',
    purpose: 'Fast and memory-efficient splice-aware aligner based on the Hierarchical Graph Ferragina-Manzini (HGFM) index.',
    inputType: 'FASTQ reads + HGFM index built from reference genome and known splice sites/exons',
    outputType: 'SAM/BAM alignment files with alignment statistics',
    bestUseCase: 'Aligning RNA-seq reads when computational RAM is limited (uses ~8 GB RAM compared to STAR’s ~32 GB).',
    websiteUrl: 'http://daehwankimlab.me/hisat2/',
    tags: ['Memory Efficient', 'Splice-Aware', 'Low RAM', 'RNA-seq']
  },
  // 27. featureCounts
  {
    id: 'featurecounts',
    name: 'featureCounts (Subread package)',
    category: 'Transcriptomics & RNA-seq',
    level: 'Intermediate',
    purpose: 'Ultra-fast and memory-efficient read quantification program that assigns mapped reads (SAM/BAM) to genomic features (genes, exons, promoters).',
    inputType: 'Coordinate-sorted BAM files + Reference annotation file (.gtf or .gff3)',
    outputType: 'Raw gene count matrix text file (genes x samples) and summary assignment statistics table',
    bestUseCase: 'Generating integer count matrices from BAM files ready for input into DESeq2 or edgeR.',
    websiteUrl: 'https://subread.sourceforge.net/',
    tags: ['Read Counting', 'Quantification', 'Count Matrix', 'BAM to Counts'],
    sampleCommand: 'featureCounts -T 8 -p -a annotation.gtf -o counts.txt sample1.bam sample2.bam'
  },
  // 28. DESeq2
  {
    id: 'deseq2',
    name: 'DESeq2 (Bioconductor R package)',
    category: 'Transcriptomics & RNA-seq',
    level: 'Intermediate',
    purpose: 'Statistical package for differential gene expression analysis based on the negative binomial generalized linear model with shrinkage estimation for dispersions and fold changes.',
    inputType: 'Raw un-normalized integer count matrix + Experimental design / sample metadata dataframe',
    outputType: 'Log2 Fold Changes, Wald test p-values, Benjamini-Hochberg Adjusted p-values (padj / FDR), normalized count matrix',
    bestUseCase: 'Statistical discovery of significantly up- and down-regulated genes between experimental conditions, genotypes, or stress treatments.',
    websiteUrl: 'https://bioconductor.org/packages/release/bioc/html/DESeq2.html',
    tags: ['Differential Expression', 'R Bioconductor', 'Negative Binomial', 'FDR/p-adj'],
    sampleCommand: 'dds <- DESeqDataSetFromMatrix(countData = counts, colData = coldata, design = ~ condition)\ndds <- DESeq(dds)\nres <- results(dds)'
  },
  // 29. MEME Suite
  {
    id: 'meme-suite',
    name: 'MEME Suite (Motif-based Sequence Analysis Tools)',
    category: 'Genomics & Sequence',
    level: 'Intermediate',
    purpose: 'Collection of web and command-line tools for discovering novel de novo sequence motifs and scanning biological sequences for known transcription factor motifs.',
    inputType: 'FASTA nucleotide/protein sequences (promoter sequences, ChIP-seq peaks, or homologous protein families)',
    outputType: 'Position Weight Matrices (PWMs), sequence logos, motif E-values, motif distribution locations',
    bestUseCase: 'Discovering conserved promoter motifs in co-expressed gene clusters and identifying conserved protein sequence motifs in gene family studies.',
    websiteUrl: 'https://meme-suite.org/meme/',
    tags: ['Motif Discovery', 'Sequence Logos', 'Transcription Factors', 'Promoter Analysis']
  },
  // 30. MEGA
  {
    id: 'mega-software',
    name: 'MEGA (Molecular Evolutionary Genetics Analysis)',
    category: 'Phylogenetics',
    level: 'Beginner',
    purpose: 'User-friendly desktop software for conducting statistical analyses of molecular evolution, sequence alignment, and constructing phylogenetic trees.',
    inputType: 'FASTA, NEXUS, MEGA (.meg), or Clustal sequence files (nucleotide or protein)',
    outputType: 'Phylogenetic trees (Newick, .nwk, .png), evolutionary distance matrices, bootstrap consensus trees',
    bestUseCase: 'Building Neighbor-Joining (NJ) and Maximum Likelihood (ML) phylogenetic trees for gene family evolutionary studies with visual tree editing.',
    websiteUrl: 'https://www.megasoftware.net/',
    tags: ['Phylogenetic Trees', 'Neighbor-Joining', 'Molecular Evolution', 'GUI']
  },
  // 31. IQ-TREE
  {
    id: 'iq-tree',
    name: 'IQ-TREE 2',
    category: 'Phylogenetics',
    level: 'Advanced',
    purpose: 'Fast and versatile phylogenomic software platform using Maximum Likelihood, automated best-fit evolutionary model selection (ModelFinder), and ultrafast bootstrap (UFBoot).',
    inputType: 'Multiple sequence alignment file (FASTA, PHYLIP, NEXUS)',
    outputType: 'Maximum-likelihood tree file (.treefile), model selection log (.iqtree), branch support values',
    bestUseCase: 'Rigorous, publication-grade phylogenetic reconstruction for large multi-gene or phylogenomic datasets with reliable statistical branch support.',
    websiteUrl: 'http://www.iqtree.org/',
    tags: ['Maximum Likelihood', 'ModelFinder', 'Ultrafast Bootstrap', 'Phylogenomics'],
    sampleCommand: 'iqtree2 -s alignment.fasta -m MFP -B 1000 -T AUTO'
  },
  // 32. PlantTFDB
  {
    id: 'planttfdb',
    name: 'PlantTFDB (Plant Transcription Factor Database)',
    category: 'Plant Bioinformatics',
    level: 'Beginner',
    purpose: 'Comprehensive database cataloging plant transcription factors across 160+ green plant species, categorized into 58 transcription factor families.',
    inputType: 'Species selection, Gene ID, protein FASTA sequence, or TF family name (e.g., WRKY, NAC, bZIP, AP2/ERF)',
    outputType: 'TF classification, domain architectures, binding motif PWMs, predicted target genes',
    bestUseCase: 'Identifying, classifying, and annotating transcription factors in plant genomes (rice, wheat, Arabidopsis) and extracting promoter binding preferences.',
    websiteUrl: 'http://planttfdb.gao-lab.org/',
    tags: ['Plant Transcription Factors', 'Gene Regulation', 'WRKY', 'TF Families']
  },
  // 33. psRNATarget
  {
    id: 'psrnatarget',
    name: 'psRNATarget (Plant Small RNA Target Analysis Server)',
    category: 'Plant Bioinformatics',
    level: 'Intermediate',
    purpose: 'Predicts plant microRNA (miRNA) and small interfering RNA (siRNA) target genes using specialized scoring algorithms that account for plant-specific pairing rules.',
    inputType: 'miRNA sequence (FASTA) and target transcript/cDNA sequences (or select pre-loaded crop transcriptomes)',
    outputType: 'Predicted target transcripts, cleavage vs translational inhibition classification, hybridization energy (UPE), expectation scores',
    bestUseCase: 'Elucidating post-transcriptional gene silencing mechanisms, miRNA regulatory networks in plant development and abiotic stress responses.',
    websiteUrl: 'https://www.zhaolab.org/psRNATarget/',
    tags: ['miRNA Targets', 'Plant Regulatory RNAs', 'Post-Transcriptional', 'Gene Silencing']
  },
  // 34. AutoDock Vina
  {
    id: 'autodock-vina',
    name: 'AutoDock Vina',
    category: 'Structure & Docking',
    level: 'Intermediate',
    purpose: 'Open-source molecular docking program that calculates binding affinity between small-molecule ligands and macromolecular receptor targets.',
    inputType: 'Receptor structure (.pdbqt) + Ligand structure (.pdbqt) + Grid box coordinates config file',
    outputType: 'Docked ligand conformation poses (.pdbqt) with predicted binding affinities (kcal/mol)',
    bestUseCase: 'Virtual screening of phytochemical compounds, evaluating drug-target interactions, and identifying binding orientations.',
    websiteUrl: 'https://vina.scripps.edu/',
    tags: ['Molecular Docking', 'Virtual Screening', 'Binding Energy', 'kcal/mol'],
    sampleCommand: 'vina --receptor receptor.pdbqt --ligand ligand.pdbqt --config config.txt --out docked.pdbqt'
  },
  // 35. PyRx
  {
    id: 'pyrx-docking',
    name: 'PyRx Virtual Screening Tool',
    category: 'Structure & Docking',
    level: 'Beginner',
    purpose: 'Virtual screening software platform with a graphical user interface for computational drug discovery, integrating AutoDock 4 and AutoDock Vina.',
    inputType: 'Protein structures (PDB) and chemical libraries (SDF, SMILES, PDB)',
    outputType: 'Energy-minimized 3D ligand structures, automated grid box configuration, docking binding affinities table',
    bestUseCase: 'Screening chemical libraries against disease targets without requiring command-line syntax.',
    websiteUrl: 'https://pyrx.sourceforge.io/',
    tags: ['GUI Docking', 'Virtual Screening', 'AutoDock GUI', 'Drug Discovery']
  },
  // 36. PyMOL
  {
    id: 'pymol-visualizer',
    name: 'PyMOL Molecular Graphics System',
    category: 'Structure & Docking',
    level: 'Beginner',
    purpose: 'User-sponsored molecular visualization system on an open-source foundation, celebrated for creating high-resolution 3D structural graphics for publication.',
    inputType: '.pdb, .cif, .mol2, .sdf molecular structure and trajectory files',
    outputType: 'Publication-quality ray-traced images (.png), 3D session files (.pse), molecular surface models, distance measurements',
    bestUseCase: 'Visualizing active sites, mapping mutations onto 3D structures, measuring hydrogen bonds, and preparing high-impact journal figures.',
    websiteUrl: 'https://pymol.org/',
    tags: ['3D Visualization', 'Ray Tracing', 'Molecular Graphics', 'Journal Figures']
  },
  // 37. Biopython
  {
    id: 'biopython',
    name: 'Biopython',
    category: 'Programming & CLI',
    level: 'Intermediate',
    purpose: 'Freely available collection of Python modules for computational molecular biology, providing parsers for major bioinformatics file formats and database APIs.',
    inputType: 'Python code scripts reading FASTA, GenBank, PDB, BLAST XML, Clustal, Phred files',
    outputType: 'Parsed sequence objects, translation data, automated NCBI Entrez records, structural hierarchy objects',
    bestUseCase: 'Writing automated scripts to process thousands of FASTA files, calculating GC content, translating codons, and building custom pipeline wrappers.',
    websiteUrl: 'https://biopython.org/',
    tags: ['Python Library', 'SeqIO', 'Entrez API', 'Automation'],
    sampleCommand: 'from Bio import SeqIO\nfor record in SeqIO.parse("genes.fasta", "fasta"):\n    print(record.id, len(record.seq))'
  },
  // 38. R in Bioinformatics
  {
    id: 'r-bioinformatics',
    name: 'R & Bioconductor for Bioinformatics',
    category: 'Programming & CLI',
    level: 'Intermediate',
    purpose: 'The world’s primary statistical computing environment and ecosystem of 2,000+ specialized open-source biological packages for high-throughput genomic data analysis.',
    inputType: 'Count matrices, microarray matrices, VCF files, metadata tables, single-cell Seurat objects',
    outputType: 'Volcano plots, heatmaps, PCA plots, statistical differential expression tables, GSEA enrichment curves',
    bestUseCase: 'End-to-end RNA-seq statistical modeling (DESeq2, edgeR), pathway enrichment (clusterProfiler), single-cell analysis (Seurat, SingleCellExperiment), and publication graphics (ggplot2, ComplexHeatmap).',
    websiteUrl: 'https://www.bioconductor.org/',
    tags: ['R Bioconductor', 'DESeq2', 'clusterProfiler', 'ggplot2', 'Statistical Genomics'],
    sampleCommand: '# Install BiocManager\nif (!require("BiocManager", quietly = TRUE))\n    install.packages("BiocManager")\nBiocManager::install(c("DESeq2", "clusterProfiler", "ComplexHeatmap"))'
  }
];

export const rBioinformaticsPurposes = [
  {
    title: 'Differential Gene Expression Analysis',
    packages: ['DESeq2', 'edgeR', 'limma-voom'],
    description: 'Statistical modeling using negative binomial distribution and linear models to detect significant transcriptional changes across treatments, genotypes, or disease states.',
    commonPlots: 'Volcano Plots, MA Plots, Dispersion Estimates, PCA Sample Clustering'
  },
  {
    title: 'Functional Pathway & Gene Set Enrichment',
    packages: ['clusterProfiler', 'fgsea', 'pathview', 'DOSE'],
    description: 'Translates long lists of differentially expressed genes into biological meaning through Over-Representation Analysis (ORA) and Gene Set Enrichment Analysis (GSEA) across GO, KEGG, and Reactome.',
    commonPlots: 'Dot Plots, Ridge Plots, GSEA Running Score Curves, Cnetplots (Gene-Concept Networks)'
  },
  {
    title: 'Single-Cell & Spatial Transcriptomics',
    packages: ['Seurat', 'SingleCellExperiment', 'monocle3', 'scran'],
    description: 'Deconstructs cellular heterogeneity in single-cell RNA-seq datasets through quality filtering, normalization, dimensional reduction (UMAP/t-SNE), clustering, and pseudotime trajectory inference.',
    commonPlots: 'UMAP Feature Plots, Violin Plots, Cell-Type Proportion Barplots, Trajectory Trees'
  },
  {
    title: 'High-Impact Scientific Data Visualization',
    packages: ['ggplot2', 'ComplexHeatmap', 'pheatmap', 'circlize', 'EnhancedVolcano'],
    description: 'Generates publication-ready vector figures with custom color palettes, hierarchical clustering annotations, genomic circos plots, and interactive widgets.',
    commonPlots: 'Annotated Heatmaps, Circos Genomic Maps, Multi-Panel Figures, Correlation Matrix Plots'
  },
  {
    title: 'Phylogenetics & Evolutionary Genomics',
    packages: ['ape', 'ggtree', 'phangorn', 'treeio'],
    description: 'Manipulates phylogenetic trees, ancestral state reconstruction, molecular dating, and plotting multi-layered evolutionary trees with metadata annotations.',
    commonPlots: 'Circular Phylogenetic Trees, Tree Heatmap Overlays, Bootstrap Value Annotations'
  }
];
