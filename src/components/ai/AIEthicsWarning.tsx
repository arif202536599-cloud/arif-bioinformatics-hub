import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Lock, FileWarning, Sparkles } from 'lucide-react';

export const AIEthicsWarning: React.FC = () => {
  return (
    <div className="rounded-3xl bg-orange-50/90 border border-orange-300 p-6 sm:p-8 mb-8 shadow-xs">
      <div className="flex items-start space-x-4">
        <div className="p-3 rounded-2xl bg-orange-100 border border-orange-300 text-orange-700 shrink-0">
          <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-lg bg-orange-200 text-orange-950 font-extrabold border border-orange-300">
              Mandatory Research Ethics Protocol
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Responsible AI Usage & Biological Data Privacy Guidelines
          </h3>

          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            <strong className="text-slate-950 font-extrabold">Always verify AI outputs against official databases (NCBI, UniProt, PDB, Ensembl), original peer-reviewed papers, and your academic supervisor’s guidance.</strong> AI systems are probabilistic models and can hallucinate non-existent citations, incorrect gene annotations, or buggy Bio-APIs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-orange-200 shadow-xs">
              <div className="flex items-center space-x-1.5 text-orange-700 font-extrabold mb-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero Private Data</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Never upload confidential patient genomes, unpublished sequences, or proprietary chemical structures to public AI chats.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-orange-200 shadow-xs">
              <div className="flex items-center space-x-1.5 text-orange-700 font-extrabold mb-1">
                <FileWarning className="w-3.5 h-3.5" />
                <span>Verify Real Citations</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Verify every AI-suggested DOI in PubMed, Crossref, or Europe PMC before including it in your thesis or manuscript.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-orange-200 shadow-xs">
              <div className="flex items-center space-x-1.5 text-orange-700 font-extrabold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Code Debugging Only</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Use AI as an interactive tutor and code generator; keep biological interpretation strictly grounded in empirical data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
