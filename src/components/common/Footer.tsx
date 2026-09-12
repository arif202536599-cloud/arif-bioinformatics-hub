import React from 'react';
import { Dna, Mail, Phone, ShieldCheck, ArrowUp, ExternalLink, Users } from 'lucide-react';
import { YoutubeIcon } from './YoutubeIcon';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-orange-200 bg-white/95 text-slate-600 text-xs mt-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Platform Overview & Official Contact */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-orange-100 border border-orange-300 text-orange-600">
                <Dna className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                Arif Bioinformatics Hub
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Curated by <strong className="text-slate-900 font-bold">Arif Uddin</strong> (MPhil Bioinformatics). Engineered for high-throughput sequence analysis, 3D structural biology, 38+ verified databases, and responsible AI integration.
            </p>

            {/* Direct Official Contact Info */}
            <div className="pt-2 space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <a href="mailto:fivupw005@gmail.com" className="font-mono text-orange-950 font-semibold hover:underline">
                  fivupw005@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <a href="tel:+923099062590" className="font-mono text-emerald-950 font-semibold hover:underline">
                  +92 309 9062590
                </a>
              </div>
            </div>

            {/* YouTube Channel Button */}
            <div className="pt-2">
              <a
                href="https://www.youtube.com/@Bioinformatics_Mastery"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs transition-colors shadow-xs"
              >
                <YoutubeIcon className="w-4 h-4 text-red-600" />
                <span>YouTube @Bioinformatics_Mastery</span>
              </a>
            </div>
          </div>

          {/* Col 2: Learning Pathways */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-950 mb-3">
              Learning Pipelines
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button onClick={() => setActiveTab('learning')} className="hover:text-orange-700 transition-colors text-left cursor-pointer">
                  RNA-seq Pipeline (FASTQ → DESeq2)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('learning')} className="hover:text-orange-700 transition-colors text-left cursor-pointer">
                  Genome-Wide Gene Family Analysis
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('learning')} className="hover:text-orange-700 transition-colors text-left cursor-pointer">
                  Protein Structure & Docking (Vina)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('learning')} className="hover:text-orange-700 transition-colors text-left cursor-pointer">
                  Proteomics → Multi-Omics → Drug Design
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('learning')} className="hover:text-orange-700 transition-colors text-left cursor-pointer">
                  Drug Discovery & Preclinical Development
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-950 mb-3">
              Research & Databases
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button onClick={() => setActiveTab('software')} className="hover:text-orange-700 transition-colors text-left cursor-pointer">
                  38+ Bioinformatics Databases
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('protein')} className="hover:text-orange-700 transition-colors text-left cursor-pointer">
                  3D Protein Explorer (OsGA20ox2 / TP53)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('research')} className="hover:text-orange-700 transition-colors text-left cursor-pointer">
                  2026 Research Pathway Roadmap
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('subscribers')} className="hover:text-orange-700 transition-colors text-left cursor-pointer">
                  Connected Users & Excel Export
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ai')} className="hover:text-orange-700 transition-colors text-left cursor-pointer">
                  AI in Bioinformatics & Prompt Sandbox
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Scientific Integrity & Back to Top */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-950 mb-2">
              Scientific Integrity & Ethics
            </h4>
            <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200 text-[11px] text-slate-700 leading-relaxed">
              <div className="flex items-center space-x-1.5 text-orange-800 font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                <span>Responsible AI & Data Security</span>
              </div>
              Always verify AI computational predictions against primary database records (NCBI, UniProt, PDB). Never upload confidential or unpublished patient genomic data to public chatbots.
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 font-mono">Arif Bioinformatics Hub</span>
              <button
                onClick={scrollToTop}
                className="p-1.5 rounded-lg bg-orange-100 border border-orange-200 text-orange-800 hover:bg-orange-200 transition-colors cursor-pointer"
                title="Back to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright and official link */}
        <div className="pt-6 border-t border-orange-200 flex flex-col sm:flex-row items-center justify-between text-slate-700 text-xs font-medium">
          <p>
            © {new Date().getFullYear()} <strong className="text-slate-950 font-bold">Arif Uddin</strong> (MPhil Bioinformatics) • YouTube:{' '}
            <a
              href="https://www.youtube.com/@Bioinformatics_Mastery"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-700 font-bold hover:underline"
            >
              @Bioinformatics_Mastery
            </a>
          </p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-2">
            <span className="text-slate-900 font-bold">Official Domain: </span>
            <a
              href="http://arif_bioinformatics_mastery.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-bold text-orange-800 hover:text-orange-950 hover:underline px-2 py-0.5 rounded bg-orange-100 border border-orange-200"
            >
              arif_bioinformatics_mastery.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
