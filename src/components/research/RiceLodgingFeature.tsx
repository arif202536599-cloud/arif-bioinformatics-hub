import React from 'react';
import { Sprout, Dna, Activity, ArrowRight, ShieldCheck, Layers, Sparkles, BookOpen } from 'lucide-react';

export const RiceLodgingFeature: React.FC<{ onExploreProtein?: () => void }> = ({ onExploreProtein }) => {
  return (
    <div className="rounded-3xl bio-glass border-emerald-800/60 p-6 sm:p-8 mb-10 shadow-2xl shadow-emerald-950/20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono font-bold flex items-center space-x-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>Arif Uddin • Specialized MPhil Research Focus</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
            Genetics of Rice Culm Lodging Resistance & Stem Biomechanics
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Stem lodging (bending or breaking of culms under wind and heavy grain load) causes 10–25% annual rice yield losses worldwide. Our research investigates the genetic architecture and transcriptional regulatory cascades controlling <strong className="text-emerald-300">culm mechanical strength</strong>, <strong className="text-emerald-300">gibberellin 20-oxidase (sd1)</strong> modulation, and <strong className="text-emerald-300">secondary cell wall lignin/cellulose deposition</strong>.
          </p>

          {/* 3 Core Genetic Mechanisms */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-bio-950/90 border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 block mb-1">1. GA Signaling & sd1</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Loss of GA20ox2 function suppresses cell elongation, generating sturdy, compact basal internodes.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-bio-950/90 border border-slate-800">
              <span className="text-xs font-bold text-cyan-400 block mb-1">2. Secondary Cell Wall</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Upregulation of Cellulose Synthase (*CesA*) and Lignin pathway (*PAL, C4H, CAD*) elevates breaking strength.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-bio-950/90 border border-slate-800">
              <span className="text-xs font-bold text-teal-400 block mb-1">3. Pan-Genomic SVs</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Mining structural variants and promoter cis-elements across 3,000+ rice genomes to guide breeding.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onExploreProtein && (
          <div className="lg:self-center shrink-0">
            <button
              onClick={onExploreProtein}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all group"
            >
              <span>Explore OsGA20ox2 3D Model</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
