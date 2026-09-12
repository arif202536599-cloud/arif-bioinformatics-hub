import React from 'react';
import { Dna, BookOpen, Database, Atom, FileText, Bot, ArrowRight, UserCheck, Sprout, Layers, Network, Activity, Sparkles, Compass } from 'lucide-react';

interface ProfileHeroProps {
  onNavigate: (tab: string, extraId?: string) => void;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ onNavigate }) => {
  const researchInterests = [
    { label: 'Pan-Genomics & Structural Variations', icon: Dna, color: 'text-orange-950 bg-orange-100/90 border-orange-300 font-bold' },
    { label: 'RNA-seq Transcriptomics & DEG Modeling', icon: Activity, color: 'text-teal-950 bg-teal-100/90 border-teal-300 font-bold' },
    { label: 'Plant & Crop Molecular Genetics', icon: Sprout, color: 'text-emerald-950 bg-emerald-100/90 border-emerald-300 font-bold' },
    { label: 'Protein 3D Structure & Molecular Docking', icon: Atom, color: 'text-sky-950 bg-sky-100/90 border-sky-300 font-bold' },
    { label: 'Network Pharmacology & Target Discovery', icon: Network, color: 'text-purple-950 bg-purple-100/90 border-purple-300 font-bold' },
    { label: 'Multi-Omics Data Integration', icon: Layers, color: 'text-indigo-950 bg-indigo-100/90 border-indigo-300 font-bold' },
    { label: 'Scientific Writing & Reproducible Science', icon: FileText, color: 'text-amber-950 bg-amber-100/90 border-amber-300 font-bold' },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl bio-glass border-orange-200/90 p-6 sm:p-8 lg:p-10 mb-8 shadow-xs">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Profile & Core Mission */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Master Bioinformatics with Arif</span>
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-950 border border-orange-300 font-bold">
              MPhil Bioinformatics Platform
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Arif Bioinformatics <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700">
                Research & Learning Hub
              </span>
            </h1>
            <p className="text-slate-700 text-sm sm:text-base mt-2.5 leading-relaxed font-medium max-w-2xl">
              An interactive computational biology platform created for bioinformatics students and researchers. Master <strong className="text-slate-950 font-bold">RNA-seq pipelines</strong>, explore <strong className="text-slate-950 font-bold">3D protein dynamics</strong>, query <strong className="text-slate-950 font-bold">38+ verified databases</strong>, access the <strong className="text-slate-950 font-bold">Research Helper Advisor</strong>, and apply <strong className="text-slate-950 font-bold">responsible AI in science</strong>.
            </p>
          </div>

          {/* Research Interest Badges */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
              Core Computational & Research Focus Areas:
            </span>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {researchInterests.map((interest, idx) => {
                const Icon = interest.icon;
                return (
                  <span
                    key={idx}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs border ${interest.color} transition-transform hover:scale-105 cursor-default shadow-xs`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-orange-700" />
                    <span>{interest.label}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Quick action jump cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => onNavigate('learning', 'rnaseq-workflow')}
            className="p-4 rounded-2xl bg-white border border-orange-200 hover:border-orange-400 hover:shadow-md cursor-pointer transition-all duration-200 group shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-700 border border-orange-200 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-orange-700">RNA-seq Pipeline</h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 font-medium">
              FASTQ → FastQC → STAR alignment → featureCounts → DESeq2 differential expression.
            </p>
          </div>

          <div
            onClick={() => onNavigate('protein', 'osga20ox2')}
            className="p-4 rounded-2xl bg-white border border-orange-200 hover:border-teal-400 hover:shadow-md cursor-pointer transition-all duration-200 group shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-teal-100 text-teal-700 border border-teal-200 group-hover:scale-110 transition-transform">
                <Atom className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-teal-700">Protein 3D Explorer</h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 font-medium">
              Explore 3D coordinates, Cartoon/Ribbon rendering, and online PDB structure search.
            </p>
          </div>

          <div
            onClick={() => onNavigate('research')}
            className="p-4 rounded-2xl bg-white border border-orange-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all duration-200 group shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-800">Research Helper Advisor</h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 font-medium">
              BS, MPhil & PhD thesis planning, experimental design, and statistical method guidelines.
            </p>
          </div>

          <div
            onClick={() => onNavigate('ai')}
            className="p-4 rounded-2xl bg-white border border-orange-200 hover:border-purple-400 hover:shadow-md cursor-pointer transition-all duration-200 group shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-700">AI Bio Sandbox</h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 font-medium">
              8 AI research tools, prompt engineering templates & ethical verification rules.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
