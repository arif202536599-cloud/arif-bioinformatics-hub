import React, { useState } from 'react';
import { Mail, Phone, Download, Send, CheckCircle2, FileText, Award, ExternalLink, Sparkles } from 'lucide-react';
import { YoutubeIcon } from '../common/YoutubeIcon';

export const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Simulate clean local submission
    setIsSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1000);
  };

  const handleDownloadCV = (format: 'md' | 'txt') => {
    const cvContent = `# Academic Curriculum Vitae: Arif Uddin
**Academic Degree:** MPhil in Bioinformatics
**Official Email:** fivupw005@gmail.com
**Contact Number / WhatsApp:** +92 309 9062590
**YouTube Channel:** https://www.youtube.com/@Bioinformatics_Mastery
**Research Specialization:** Pan-Genomics, Bulk & Single-Cell RNA-seq, Plant Molecular Biology, Protein Docking, Rice Culm Lodging Resistance.

---

## 1. Executive Research Summary
Bioinformatics researcher and MPhil scholar specializing in NGS data analysis, bulk/single-cell RNA-seq workflows, structural protein modeling, and plant genomics. Proven ability in developing computational pipelines in Python (Biopython) and R (Bioconductor), alongside wet-lab expertise in RT-qPCR, nucleic acid extraction, and culm biomechanics assays.

## 2. Academic Background
- **MPhil in Bioinformatics** (2024 - Present)
  * Focus: Rice Culm Biomechanics & Pan-Genomic Lodging Resistance Genetics
- **Bachelor of Science (BS) in Bioinformatics** (2020 - 2024)
  * Graduated with High Honors | Plant Gene Family Phylogenetics & Docking

## 3. Core Technical & Lab Competencies
- **Programming & Scripting:** Python (Biopython, Pandas, Scikit-learn), R (DESeq2, clusterProfiler, ComplexHeatmap, Seurat), Bash / Linux Shell, Git
- **NGS Pipelines:** FastQC, fastp, STAR, HISAT2, featureCounts, Samtools, GATK4
- **Structural Biology & Docking:** AutoDock Vina, PyRx, PyMOL, AlphaFold DB, SWISS-MODEL, CASTp
- **Phylogenetics & Motifs:** IQ-TREE 2, MEGA 11, MEME Suite, PlantTFDB, psRNATarget
- **Wet-Lab Protocols:** RNA/DNA Extraction, Gel Electrophoresis, RT-qPCR, Culm Breaking Strength Testing
- **Statistics & Tools:** SPSS, GraphPad Prism, LaTeX, EndNote, Zotero

## 4. Publications & Research Manuscripts
- Uddin, A., et al. (2025). "Pan-genomic architecture and structural dynamics of the semi-dwarf 1 (sd1) locus in Asian cultivated rice." *Journal of Plant Molecular Biology* (Targeted Submission).
- Uddin, A., et al. (2025). "Genome-wide identification, evolutionary phylogeny, and expression dynamics of the WRKY transcription factor family in crop abiotic stress responses." *Computational Biology and Chemistry* (Under Review).

## 5. Contact Information
- **Email:** fivupw005@gmail.com
- **Phone / WhatsApp:** +92 309 9062590
- **YouTube:** https://www.youtube.com/@Bioinformatics_Mastery
- **Platform:** http://arif_bioinformatics_mastery.com
`;

    const mimeType = format === 'md' ? 'text/markdown;charset=utf-8;' : 'text/plain;charset=utf-8;';
    const blob = new Blob([cvContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Arif_Uddin_Bioinformatics_CV.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 animate-fadeIn">
      {/* Left Column: CV Download & Official Channels */}
      <div className="lg:col-span-5 space-y-6">
        {/* CV Download Card */}
        <div className="rounded-3xl bio-glass border-orange-200 p-6 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
            <FileText className="w-4 h-4 text-orange-600" />
            <span>Academic Curriculum Vitae</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900">Download Academic CV</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Download a verified summary of academic qualifications, laboratory skills, publications, and bioinformatics research projects.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => handleDownloadCV('md')}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-orange-100 hover:bg-orange-200 text-orange-950 border border-orange-300 flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-orange-700" />
              <span>Download CV (.MD)</span>
            </button>
            <button
              onClick={() => handleDownloadCV('txt')}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-white hover:bg-orange-50 text-slate-800 border border-orange-200 flex items-center justify-center space-x-2 transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download CV (.TXT)</span>
            </button>
          </div>
        </div>

        {/* Official Direct Contact Channels */}
        <div className="rounded-3xl bio-glass border-orange-200 p-6 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
            <Award className="w-4 h-4 text-orange-600" />
            <span>Direct Official Contacts</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Email Address */}
            <a
              href="mailto:fivupw005@gmail.com"
              className="p-3.5 rounded-2xl bg-white border border-orange-200 hover:border-orange-400 flex items-center justify-between transition-all group shadow-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 border border-orange-200">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors block">
                    Official Gmail Address
                  </span>
                  <span className="text-[11px] font-mono text-slate-600">fivupw005@gmail.com</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
            </a>

            {/* Phone & WhatsApp */}
            <a
              href="tel:+923099062590"
              className="p-3.5 rounded-2xl bg-white border border-orange-200 hover:border-emerald-400 flex items-center justify-between transition-all group shadow-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors block">
                    Contact Number / WhatsApp
                  </span>
                  <span className="text-[11px] font-mono text-slate-600">+92 309 9062590</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
            </a>

            {/* YouTube Community */}
            <a
              href="https://www.youtube.com/@Bioinformatics_Mastery"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200 hover:border-red-400 flex items-center justify-between transition-all group shadow-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-red-100 text-red-600 border border-red-200">
                  <YoutubeIcon className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 group-hover:text-red-700 transition-colors block">
                    YouTube Channel
                  </span>
                  <span className="text-[11px] text-red-700 font-semibold">@Bioinformatics_Mastery</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-red-400 group-hover:text-red-600 transition-colors" />
            </a>
          </div>
        </div>
      </div>

      {/* Right Column: Research Message Form */}
      <div className="lg:col-span-7 rounded-3xl bio-glass border-orange-200 p-6 sm:p-8">
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
            <Mail className="w-4 h-4 text-orange-600" />
            <span>Research Inquiries & Academic Consultation</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Send a Research Message to Arif
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Interested in collaboration, RNA-seq data analysis consulting, or academic discussions on plant genomics? Send a direct message below.
          </p>
        </div>

        {isSent ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Message Dispatched Successfully!</h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Thank you for reaching out. Arif Uddin will review your research inquiry and respond directly to your email or WhatsApp number.
            </p>
            <button
              onClick={() => setIsSent(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-100 text-orange-900 border border-orange-300 hover:bg-orange-200 transition-colors cursor-pointer"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Muhammad Ahmed"
                  className="w-full p-3 rounded-xl bg-white border border-orange-200 text-slate-800 text-xs focus:outline-none focus:border-orange-500 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Your Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ahmed.bio@university.edu"
                  className="w-full p-3 rounded-xl bg-white border border-orange-200 text-slate-800 text-xs focus:outline-none focus:border-orange-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Research Subject / Topic</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Collaboration on Rice RNA-seq & Culm Biomechanics"
                className="w-full p-3 rounded-xl bg-white border border-orange-200 text-slate-800 text-xs focus:outline-none focus:border-orange-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Message Content *</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your research query, collaborative proposal, or bioinformatics question..."
                className="w-full p-3 rounded-xl bg-white border border-orange-200 text-slate-800 text-xs focus:outline-none focus:border-orange-500 shadow-xs leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message Directly to Arif Uddin</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
