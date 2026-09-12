# 🧬 Arif Bioinformatics Research Hub

[![Deployment Status](https://img.shields.io/badge/Deploy-GitHub%20Pages-f97316?logo=github&style=flat-square)](https://arif202536599-cloud.github.io/arif-bioinformatics-hub/)
[![YouTube Channel](https://img.shields.io/badge/YouTube-@Bioinformatics__Mastery-red?logo=youtube&style=flat-square)](https://www.youtube.com/@Bioinformatics_Mastery)
[![Built for](https://img.shields.io/badge/MPhil-Bioinformatics-ea580c?style=flat-square)](mailto:fivupw005@gmail.com)
[![Stack](https://img.shields.io/badge/React_18-TypeScript-blue?logo=react&style=flat-square)](https://react.dev/)
[![Styling](https://img.shields.io/badge/Tailwind_CSS-Light_Orange_Aesthetic-f97316?logo=tailwindcss&style=flat-square)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

An educational and research platform created by **Arif Uddin** (MPhil in Bioinformatics). Designed to help students master high-throughput bioinformatics, navigate 38+ verified databases, explore 3D protein structures, analyze plant lodging resistance genetics, manage connected users with 1-click Excel export, and integrate responsible AI into biological investigations.

---

## 🌐 Official Website Links & Online Access

* 🔗 **Live Public Hub Link:**  
  **`https://arif202536599-cloud.github.io/arif-bioinformatics-hub/`**
* 🌐 **Custom Domain (Configured):**  
  **`http://arif-bioinformatics-mastery.com`** (via `public/CNAME`)
* 📺 **Official YouTube Channel:**  
  **[Bioinformatics Mastery (@Bioinformatics_Mastery)](https://www.youtube.com/@Bioinformatics_Mastery)**

---

## 🎯 Key Features & Modules

### 1. 3-Line Hamburger Left Table of Contents
* **Left Slide-out Table of Contents:** Click the top-left 3-line hamburger menu (`☰ Contents`) to open a navigation drawer with quick jumping to all hub sections, sub-topics, YouTube channel links, and author contact.

### 2. Connected Users & 1-Click Excel (.CSV) Generation
* **User Subscription Portal:** Students and research colleagues can register and subscribe with their Name, Email, Contact Number, Role, and Institution.
* **Instant Excel Export:** 1-click **Export Excel (.CSV Spreadsheet)** button generates `connected_biohub_users.csv` containing all registered users.
* **Repository Record:** Includes pre-populated `connected_users.csv` directly in the root repository.

### 3. Home Dashboard & Light Orange Aesthetic
* **Modern Light Orange Theme:** Clean scientific interface with warm amber accents, crisp glass cards, and high-contrast typography.
* **Interactive Bio-Utility Toolbox:** Real-time DNA/RNA GC-content calculator, reverse-complement generator (5'→3'), codon translation table, and peptide molecular mass estimator.
* **Dynamic Platform Metrics:** Live tracking of cataloged tools, learning pathways, and connected users.

### 4. Learning Hub (5 Core Interactive Pipelines)
1. **Bulk RNA-seq Transcriptomics:** FASTQ → FastQC → fastp → STAR → featureCounts → DESeq2 → GO/KEGG.
2. **Genome-Wide Gene Family Analysis:** Sequence retrieval → HMMER domain search → MAFFT/IQ-TREE → MEME motifs → Gene structure.
3. **Protein Structural Analysis:** ProtParam → InterProScan → AlphaFold 3D → CASTp pockets → AutoDock Vina → STRING PPI.
4. **Proteomics → Multi-Omics → Drug Design:** LC-MS/MS → MOFA+ factor modeling → Druggable target prioritization → In silico ADMET.
5. **Drug Discovery → Preclinical Pipeline:** Target validation → Hit-to-Lead SAR → 100ns GROMACS MD simulation → Preclinical IND.
* **Daily Bioinformatics Quiz:** 5 randomized multiple-choice questions with instant scoring and explanations.

### 5. Bioinformatics Software & Databases (38+ Tools)
* Verified directory covering NCBI BLAST, GEO, SRA, Ensembl Plants, Gramene, UniProtKB, RCSB PDB, AlphaFold DB, InterPro, Pfam, STRING, KEGG, Reactome, AutoDock Vina, PyRx, PyMOL, Galaxy, FastQC, STAR, DESeq2, and an **R & Bioconductor Masterclass**.

### 6. Protein 3D Explorer
* Interactive WebGL 3D molecular canvas with Three.js.
* Benchmark presets for *Oryza sativa* **OsGA20ox2 (*sd1*)**, *Homo sapiens* **TP53**, *Arabidopsis thaliana* **CLV3**, *SARS-CoV-2* **Spike (RBD)**, and *Oryza sativa* **OsWRKY45**.

### 7. Research Hub & 2026 Roadmap
* **7 Core Pillars of Research Writing:** Guidelines, reviewer traps, and templates.
* **Interactive 2026 Roadmap:** 7-phase modern computational biology methodology.
* **Citation Formatter:** Instant formatting in APA 7th, Nature, Harvard, Vancouver, and IEEE.
* **Literature Review Matrix & Synopsis Builder:** Organize papers and export research synopses.

### 8. Responsible AI for Bioinformatics
* 8 verified AI systems (ChatGPT, Elicit, Consensus, Scite.ai, NotebookLM, AlphaFold, Galaxy AI, Copilot).
* Bioinformatic prompt engineering sandbox and ethical integrity protocols.

---

## 🚀 Local Development Setup

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher

### Installation & Run
```bash
# 1. Clone repository
git clone https://github.com/arif202536599-cloud/arif-bioinformatics-hub.git
cd arif-bioinformatics-hub

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
# Open http://localhost:5173 in browser

# 4. Build production bundle
npm run build
```

---

## 🚢 GitHub Pages Deployment & Custom Domain

### Automated Deployment via GitHub Actions
1. Push your code to the `main` branch.
2. In your repository on GitHub, go to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build and publish the website.

### Custom Domain (`arif-bioinformatics-mastery.com`)
1. The `public/CNAME` file contains your domain: `arif-bioinformatics-mastery.com`.
2. In your DNS provider (e.g. Cloudflare, Namecheap, GoDaddy), point an `A` record or `CNAME` to GitHub Pages IPs:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

---

## 🔒 Security & Privacy Notice

* This repository **does not contain any passwords, tokens, API keys, or secret credentials**.
* All sensitive credentials have been eliminated.
* Demonstrations operate completely client-side in **Guest Demo Mode** using local storage.

---

## 👤 Author & Contact

**Arif Uddin**  
*Bioinformatician | MPhil in Bioinformatics*  
* **Email:** [fivupw005@gmail.com](mailto:fivupw005@gmail.com)  
* **Contact Number / WhatsApp:** [+92 309 9062590](tel:+923099062590)  
* **YouTube Channel:** [Bioinformatics Mastery (@Bioinformatics_Mastery)](https://www.youtube.com/@Bioinformatics_Mastery)  
* **Research Specialization:** RNA-seq Transcriptomics, Pan-Genomics, Plant Lodging Resistance, 3D Molecular Docking, Multi-Omics.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
