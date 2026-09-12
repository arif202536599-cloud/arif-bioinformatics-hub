import React, { useState } from 'react';
import { roadmap2026Steps } from '../../data/researchData';
import { Compass, ArrowRight, CheckCircle2, Sparkles, Cpu, Layers, Dna, FileCheck, ArrowDown } from 'lucide-react';

export const ResearchRoadmap2026: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="rounded-3xl bio-glass border-orange-200 p-6 sm:p-8 mb-8 shadow-xs">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-orange-700">
          <Compass className="w-4 h-4 text-orange-600" />
          <span>Next-Generation Scientific Workflow</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
          Modern Multi-Omics Research Pathway in 2026
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 max-w-3xl leading-relaxed">
          How computational biology, deep learning structural predictions (AlphaFold 3), graph pan-genomics, spatial transcriptomics, and reproducible open science integrate into an end-to-end research methodology in 2026.
        </p>
      </div>

      {/* Interactive Horizontal Roadmap Nodes */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6">
        {roadmap2026Steps.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <React.Fragment key={idx}>
              <button
                onClick={() => setActiveStep(idx)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold flex flex-col items-start min-w-[170px] transition-all duration-200 cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white scale-105 shadow-md shadow-orange-500/20'
                    : 'bg-white text-slate-700 border border-orange-200 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                <span className={`text-[10px] font-mono uppercase font-extrabold ${isActive ? 'text-orange-100' : 'text-orange-700'}`}>
                  {step.step}
                </span>
                <span className="text-xs font-extrabold mt-0.5 line-clamp-1">{step.title}</span>
              </button>
              {idx < roadmap2026Steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-orange-400 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Active Phase Detailed View */}
      <div className="p-6 rounded-2xl bg-white border border-orange-200 shadow-xs animate-fadeIn space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-950 border border-orange-300">
              {roadmap2026Steps[activeStep].step}
            </span>
            <h3 className="text-lg font-extrabold text-slate-900">
              {roadmap2026Steps[activeStep].title}
            </h3>
          </div>
          <span className="text-xs text-orange-800 font-mono font-bold">Phase {activeStep + 1} of 7</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
          {roadmap2026Steps[activeStep].description}
        </p>

        {/* Primary Recommended Tool Stack */}
        <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-900 font-extrabold">Standard 2026 Software & Database Stack:</span>
          <div className="flex flex-wrap gap-1.5">
            {roadmap2026Steps[activeStep].tools.map((tool, tIdx) => (
              <span key={tIdx} className="px-2.5 py-1 rounded-lg bg-white text-orange-950 border border-orange-300 font-mono text-[11px] font-bold shadow-xs">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
