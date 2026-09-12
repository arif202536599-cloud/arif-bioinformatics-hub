import React, { useState } from 'react';
import { rBioinformaticsPurposes } from '../../data/softwareData';
import { Code2, Terminal, Copy, Check, FileCode2, BarChart2, Layers, Cpu, Compass, BookOpen } from 'lucide-react';

export const RBioinformaticsGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const sampleRScripts = [
    {
      title: '1. RNA-seq Differential Expression Pipeline (DESeq2)',
      code: `# Complete Reproducible DESeq2 Workflow
if (!requireNamespace("BiocManager", quietly = TRUE))
    install.packages("BiocManager")
BiocManager::install(c("DESeq2", "EnhancedVolcano", "pheatmap"))

library(DESeq2)
library(EnhancedVolcano)

# Load count matrix and sample metadata
counts <- as.matrix(read.table("gene_counts.txt", header=TRUE, row.names=1, sep="\\t"))
coldata <- read.csv("sample_metadata.csv", row.names=1)

# Construct DESeqDataSet
dds <- DESeqDataSetFromMatrix(countData = counts, colData = coldata, design = ~ condition)

# Filter low counts (< 10 reads in >= 3 samples)
keep <- rowSums(counts(dds) >= 10) >= 3
dds <- dds[keep, ]

# Run Negative Binomial GLM
dds <- DESeq(dds)
res <- results(dds, contrast=c("condition", "Treated", "Control"))

# Shrink log2 fold changes using apeglm
res_lfc <- lfcShrink(dds, coef="condition_Treated_vs_Control", type="apeglm")

# Generate Publication Volcano Plot
EnhancedVolcano(res_lfc,
    lab = rownames(res_lfc),
    x = 'log2FoldChange',
    y = 'padj',
    pCutoff = 0.05,
    FCcutoff = 1.0,
    pointSize = 2.0,
    labSize = 4.0,
    title = 'Differential Expression: Volcano Plot',
    subtitle = 'DESeq2 padj < 0.05 & |log2FC| >= 1.0')`
    },
    {
      title: '2. Functional Pathway Enrichment (clusterProfiler)',
      code: `# Gene Ontology & KEGG Pathway Enrichment Analysis
BiocManager::install(c("clusterProfiler", "org.Hs.eg.db", "pathview"))

library(clusterProfiler)
library(org.Hs.eg.db)

# Extract significant DEG IDs
sig_genes <- rownames(subset(res, padj < 0.05 & abs(log2FoldChange) > 1.0))

# 1. Gene Ontology Over-Representation Analysis (Biological Process)
ego_bp <- enrichGO(
    gene          = sig_genes,
    OrgDb         = org.Hs.eg.db,
    keyType       = 'SYMBOL',
    ont           = "BP",
    pAdjustMethod = "BH",
    pvalueCutoff  = 0.01,
    qvalueCutoff  = 0.05
)

# Plot interactive dotplot
dotplot(ego_bp, showCategory = 15, title = "Enriched Biological Processes (GO)")

# 2. Gene-Concept Network Plot (Cnetplot)
cnetplot(ego_bp, categorySize="pvalue", foldChange=res$log2FoldChange)`
    },
    {
      title: '3. Annotated Heatmap with ComplexHeatmap',
      code: `# Multi-Layered Publication Heatmap with ComplexHeatmap
library(ComplexHeatmap)
library(circlize)

# Normalized Z-score expression matrix of top 50 DEGs
top_genes <- head(order(res$padj), 50)
mat <- counts(dds, normalized=TRUE)[top_genes, ]
mat_scaled <- t(scale(t(log2(mat + 1))))

# Column annotations (Treatment + Replicate)
col_annot <- HeatmapAnnotation(
    Condition = coldata$condition,
    col = list(Condition = c("Control" = "#0d9488", "Treated" = "#ea580c"))
)

# Generate Publication Heatmap
Heatmap(mat_scaled,
    name = "Z-Score",
    top_annotation = col_annot,
    show_row_names = TRUE,
    row_names_gp = gpar(fontsize = 8),
    col = colorRamp2(c(-2, 0, 2), c("#1e3a8a", "#ffffff", "#dc2626")),
    column_title = "Top Differentially Expressed Genes Matrix")`
    },
    {
      title: '4. Single-Cell RNA-seq Analysis (Seurat v5)',
      code: `# Single-Cell Transcriptomics with Seurat v5
install.packages("Seurat")
library(Seurat)

# Load 10X Genomics CellRanger counts
sc.data <- Read10X(data.dir = "filtered_feature_bc_matrix/")
sc_obj <- CreateSeuratObject(counts = sc.data, project = "SingleCellHub", min.cells = 3, min.features = 200)

# QC & Filtering
sc_obj[["percent.mt"]] <- PercentageFeatureSet(sc_obj, pattern = "^MT-")
sc_obj <- subset(sc_obj, subset = nFeature_RNA > 200 & nFeature_RNA < 2500 & percent.mt < 5)

# Normalization & High-Variable Feature Selection
sc_obj <- NormalizeData(sc_obj)
sc_obj <- FindVariableFeatures(sc_obj, selection.method = "vst", nfeatures = 2000)

# Dimensional Reduction & UMAP Clustering
sc_obj <- ScaleData(sc_obj)
sc_obj <- RunPCA(sc_obj, features = VariableFeatures(object = sc_obj))
sc_obj <- FindNeighbors(sc_obj, dims = 1:15)
sc_obj <- FindClusters(sc_obj, resolution = 0.5)
sc_obj <- RunUMAP(sc_obj, dims = 1:15)

# Visualize Cell Clusters
DimPlot(sc_obj, reduction = "umap", label = TRUE, pt.size = 0.5)`
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl bio-glass border-orange-200 p-6 sm:p-8 mt-10 shadow-xs">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-orange-700">
          <Code2 className="w-4 h-4 text-orange-600" />
          <span>Specialized Comprehensive Guide</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
          How to Use R in Bioinformatics & For Which Purposes
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-medium mt-2 max-w-3xl leading-relaxed">
          R is the international gold standard in statistical genomics. Powered by the <strong className="text-orange-950 font-bold">Bioconductor</strong> project (2,000+ packages), R provides rigorous statistical modeling for high-throughput sequencing data, negative binomial distributions, pathway enrichment, and publication graphics.
        </p>
      </div>

      {/* 5 Primary Purposes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {rBioinformaticsPurposes.map((purpose, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white border border-orange-200 flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-5 h-5 rounded-lg bg-orange-100 text-orange-950 border border-orange-300 flex items-center justify-center text-xs font-mono font-extrabold">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900">{purpose.title}</h3>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed mb-3">
                {purpose.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-orange-200">
              <div className="flex flex-wrap gap-1">
                {purpose.packages.map((pkg, pIdx) => (
                  <span
                    key={pIdx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-orange-50 text-orange-950 font-bold border border-orange-200"
                  >
                    {pkg}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                <strong className="text-slate-900 font-bold">Outputs:</strong> {purpose.commonPlots}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Script Viewer */}
      <div className="rounded-2xl bg-slate-950 border border-orange-200 overflow-hidden shadow-sm">
        {/* Tab Headers */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900 p-2 gap-2">
          <div className="flex flex-wrap gap-1">
            {sampleRScripts.map((script, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === idx
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {script.title.split(' ')[1]} {script.title.split(' ')[2]}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleCopy(sampleRScripts[activeTab].code)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 flex items-center space-x-1.5 text-xs font-bold transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy R Script'}</span>
          </button>
        </div>

        {/* Code Body */}
        <div className="p-4 overflow-x-auto">
          <div className="text-xs font-extrabold text-orange-400 mb-2 font-mono">
            # {sampleRScripts[activeTab].title}
          </div>
          <pre className="text-xs font-mono text-emerald-300 leading-relaxed">
            <code>{sampleRScripts[activeTab].code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
