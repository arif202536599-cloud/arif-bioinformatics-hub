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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bio-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-gradient-to-b from-bio-900/90 via-bio-900/80 to-bio-950/95 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 p-6 md:p-8 backdrop-blur-xl">
        {/* Glow ambient background elements */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-lg transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl border border-cyan-500/30 text-cyan-300">
            <Dna className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
              MPhil Bioinformatics Platform
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
              Welcome to Bioinformatics Hub
            </h2>
          </div>
        </div>

        {/* Subtitle & Arif Uddin bio */}
        <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
          Curated by <strong className="text-cyan-300 font-semibold">Arif Uddin</strong>, an MPhil Bioinformatics researcher. This hub is engineered to accelerate bioinformatics education, simplify NGS and RNA-seq workflows, provide instant access to 38+ verified databases, explore 3D protein structures, and provide ethical AI guidance.
        </p>

        {/* Feature Grid Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3">
            <BookOpen className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-slate-200">5 Learning Paths</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">RNA-seq, Gene Families, Docking & Multi-Omics</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3">
            <Database className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-slate-200">38+ Verified Tools</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">BLAST, SRA, AlphaFold, DESeq2, Vina & R</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-3">
            <Atom className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-slate-200">3D Protein Explorer</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Rice GA20ox2 (*sd1*), TP53 & Plant Signaling</p>
            </div>
          </div>
        </div>

        {/* Mode Notice */}
        <div className="mb-6 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-between text-xs text-cyan-200/90">
          <span className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Running in <strong>Guest Demo Mode</strong> — no login or API keys required to explore!</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleSkip}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={handleExplore}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all duration-200 group"
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
