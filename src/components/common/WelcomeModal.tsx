import React, { useState, useEffect } from 'react';
import { Dna, Compass, Sparkles, BookOpen, Database, Atom, ArrowRight, X } from 'lucide-react';

interface WelcomeModalProps {
  onExplore: () => void;
}

const MODAL_STORAGE_KEY = 'arif_bio_welcome_seen';

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onExplore }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem(MODAL_STORAGE_KEY);
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleExplore = () => {
    localStorage.setItem(MODAL_STORAGE_KEY, 'true');
    setIsOpen(false);
    onExplore();
  };

  const handleSkip = () => {
    localStorage.setItem(MODAL_STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        aria-describedby="welcome-description"
        className="relative w-full max-w-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-white border border-orange-200 shadow-2xl p-6 md:p-8 font-sans text-base leading-relaxed text-slate-900"
      >
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 text-slate-800 hover:text-slate-950 hover:bg-orange-100 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center space-x-3 mb-4 pr-8">
          <div className="hidden sm:block p-3 bg-orange-50 rounded-xl border border-orange-200 text-orange-800">
            <Dna className="w-7 h-7" />
          </div>
          <div>
            <span className="inline-block text-sm font-semibold text-slate-900 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
              MPhil Bioinformatics Platform
            </span>
            <h2 id="welcome-title" className="text-2xl md:text-3xl font-bold leading-tight text-slate-950 mt-3">
              Welcome to Bioinformatics Hub
            </h2>
          </div>
        </div>

        {/* Subtitle & Arif Uddin bio */}
        <p id="welcome-description" className="text-slate-800 text-base leading-7 mb-6">
          Curated by <strong className="text-slate-950 font-bold">Arif Uddin</strong>, an MPhil Bioinformatics researcher. This hub is engineered to accelerate bioinformatics education, simplify NGS and RNA-seq workflows, provide instant access to 38+ verified databases, explore 3D protein structures, and provide ethical AI guidance.
        </p>

        {/* Feature Grid Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-start space-x-3">
            <BookOpen className="w-5 h-5 text-teal-800 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-slate-950">5 Learning Paths</h4>
              <p className="text-sm leading-6 text-slate-800 mt-1">RNA-seq, Gene Families, Docking & Multi-Omics</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-start space-x-3">
            <Database className="w-5 h-5 text-cyan-800 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-slate-950">38+ Verified Tools</h4>
              <p className="text-sm leading-6 text-slate-800 mt-1">BLAST, SRA, AlphaFold, DESeq2, Vina & R</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-start space-x-3">
            <Atom className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-slate-950">3D Protein Explorer</h4>
              <p className="text-sm leading-6 text-slate-800 mt-1">Rice GA20ox2 (*sd1*), TP53 & Plant Signaling</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-start space-x-3">
            <Dna className="w-5 h-5 text-teal-800 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-slate-950">Central Dogma Explorer</h4>
              <p className="text-sm leading-6 text-slate-800 mt-1">Protein FASTA → reference genes, RNA, CDS & genomic DNA</p>
            </div>
          </div>
        </div>

        {/* Mode Notice */}
        <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between text-sm leading-6 text-slate-900">
          <span className="flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-teal-800 shrink-0 mt-1" />
            <span>Running in <strong>Guest Demo Mode</strong> — no login or API keys required to explore!</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleSkip}
            className="w-full sm:w-auto px-5 py-3 rounded-xl text-base font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
          >
            Skip for now
          </button>
          <button
            onClick={handleExplore}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-base font-bold text-slate-950 bg-orange-200 hover:bg-orange-300 border border-orange-300 shadow-sm flex items-center justify-center space-x-2 transition-colors duration-200 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
          >
            <Compass className="w-4 h-4 text-slate-950 group-hover:rotate-45 transition-transform" />
            <span>Explore Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
