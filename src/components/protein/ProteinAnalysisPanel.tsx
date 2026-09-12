import React from 'react';
import { ProteinProfile } from '../../types';
import { MolViewer3D } from './MolViewer3D';
import { ChecklistDownloader } from './ChecklistDownloader';
import { Atom, ExternalLink, Dna, Layers, ShieldAlert, Sparkles, Activity, CheckCircle2, ArrowUpRight, Compass, Info } from 'lucide-react';

interface ProteinAnalysisPanelProps {
  protein: ProteinProfile;
}

export const ProteinAnalysisPanel: React.FC<ProteinAnalysisPanelProps> = ({ protein }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Target Status Banner */}
      <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 flex items-center justify-between text-xs text-slate-800 shadow-xs">
        <div className="flex items-center space-x-2.5">
          <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
          <span className="font-medium">
            <strong className="text-slate-950 font-bold">Target Structural Model Loaded:</strong> Visualizing 3D fold geometry, secondary structure elements, conserved catalytic domains, and physicochemical parameters.
          </span>
        </div>
      </div>

      {/* Main Grid: 3D Visualizer + Physicochemical Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Structure Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <MolViewer3D protein={protein} />
          <ChecklistDownloader protein={protein} />
        </div>

        {/* Right Column: Physicochemical & Functional Properties in SHARP BLACK/DARK */}
        <div className="lg:col-span-5 space-y-4">
          {/* Header Card */}
          <div className="p-6 rounded-3xl bio-glass border-orange-200 space-y-4 shadow-xs">
            <div>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-950 font-bold border border-orange-300">
                {protein.organism}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950 mt-2">
                {protein.name}
              </h3>
              <p className="text-xs font-mono text-orange-800 font-bold mt-1">
                Gene Symbol: <span className="text-slate-950 font-extrabold">{protein.geneSymbol}</span> • UniProt: <span className="text-slate-950 font-extrabold">{protein.uniprotId}</span>
              </p>
            </div>

            {/* Metrics Grid with Sharp Dark / Black Text */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-orange-200 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-orange-200 shadow-xs">
                <span className="text-[10px] text-slate-600 uppercase font-extrabold block">Length</span>
                <span className="text-base font-mono font-extrabold text-slate-950 block mt-0.5">{protein.length} aa</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-orange-200 shadow-xs">
                <span className="text-[10px] text-slate-600 uppercase font-extrabold block">Molecular Weight</span>
                <span className="text-base font-mono font-extrabold text-slate-950 block mt-0.5">{protein.molecularWeight}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-orange-200 shadow-xs">
                <span className="text-[10px] text-slate-600 uppercase font-extrabold block">Theoretical pI</span>
                <span className="text-base font-mono font-extrabold text-slate-950 block mt-0.5">{protein.isoelectricPoint}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-orange-200 shadow-xs">
                <span className="text-[10px] text-slate-600 uppercase font-extrabold block">PDB Structure</span>
                <span className="text-base font-mono font-extrabold text-slate-950 block mt-0.5">{protein.pdbId || 'AlphaFold DB'}</span>
              </div>
            </div>

            {/* Predicted Subcellular Localization in Bold Sharp Dark */}
            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs">
              <span className="text-[10px] text-slate-600 uppercase font-extrabold block mb-1">Predicted Subcellular Localization</span>
              <span className="text-slate-950 font-extrabold block text-xs leading-snug">{protein.predictedLocalization}</span>
            </div>
          </div>

          {/* Biological Function Summary */}
          <div className="p-6 rounded-3xl bio-glass border-orange-200 shadow-xs space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
              Biological Function & Phenotype
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {protein.functionSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Domain Architecture Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bio-glass border-orange-200 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-700 block">
              Domain Architecture & Pfam Coordinates
            </span>
            <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
              Conserved Catalytic & Structural Domains (1 — {protein.length} aa)
            </h4>
          </div>
        </div>

        {/* Visual Domain Bar */}
        <div className="space-y-2">
          <div className="relative w-full h-8 rounded-2xl bg-orange-100 overflow-hidden flex items-center p-1 border border-orange-300">
            {protein.domains.map((domain, idx) => {
              const startPercent = (domain.start / protein.length) * 100;
              const widthPercent = ((domain.end - domain.start) / protein.length) * 100;

              return (
                <div
                  key={idx}
                  style={{ left: `${startPercent}%`, width: `${widthPercent}%` }}
                  className="absolute h-6 rounded-xl flex items-center justify-center text-[10px] font-mono font-bold text-white px-2 shadow-xs truncate bg-gradient-to-r from-orange-500 to-amber-500 hover:scale-105 transition-transform"
                  title={`${domain.name} (${domain.start}-${domain.end} aa): ${domain.description}`}
                >
                  <span className="truncate">{domain.name}</span>
                </div>
              );
            })}
          </div>

          {/* Domain Coordinates Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {protein.domains.map((domain, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white border border-orange-200 text-xs shadow-xs">
                <div className="flex items-center justify-between font-bold text-slate-950">
                  <span>{domain.name}</span>
                  <span className="text-[11px] font-mono font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-lg border border-orange-200">
                    {domain.start} — {domain.end} aa
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">{domain.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
