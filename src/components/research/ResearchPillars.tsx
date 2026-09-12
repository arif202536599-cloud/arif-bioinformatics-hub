import React, { useState } from 'react';
import { researchPillars } from '../../data/researchData';
import { BookOpen, CheckCircle2, AlertTriangle, FileCode2, Copy, Check, ChevronRight } from 'lucide-react';

export const ResearchPillars: React.FC = () => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>(researchPillars[0].id);
  const [copied, setCopied] = useState(false);

  const activePillar = researchPillars.find(p => p.id === selectedPillarId) || researchPillars[0];

  const handleCopyTemplate = (tmpl: string) => {
    navigator.clipboard.writeText(tmpl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="mb-4">
        <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-orange-700">
          <BookOpen className="w-4 h-4 text-orange-600" />
          <span>BS, MPhil & PhD Scientific Writing Masterclass</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
          The 7 Core Pillars of Scientific Research Writing
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 max-w-3xl leading-relaxed">
          Master the exact anatomy of publication-grade manuscripts. Explore structural goals, critical best practices, common reviewer traps, and copyable blueprint templates for each section.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pillar Navigation List */}
        <div className="lg:col-span-4 space-y-2">
          {researchPillars.map((pillar) => {
            const isSelected = activePillar.id === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setSelectedPillarId(pillar.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-orange-100 border-orange-400 text-orange-950 scale-[1.02]'
                    : 'bg-white border-orange-200 text-slate-700 hover:text-slate-950 hover:bg-orange-50'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-mono uppercase font-extrabold block ${isSelected ? 'text-orange-900' : 'text-orange-700'}`}>{pillar.section}</span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">{pillar.title}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-orange-700 translate-x-1' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Column: Selected Pillar Deep-Dive */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bio-glass border-orange-200 space-y-6 shadow-xs">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-950 font-bold border border-orange-300">
                {activePillar.section}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              {activePillar.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1 leading-relaxed">
              {activePillar.subtitle}
            </p>
          </div>

          {/* Key Guidelines & Reviewer Traps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-orange-200 shadow-xs space-y-2">
              <div className="flex items-center space-x-2 text-emerald-950 font-extrabold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Essential Structural Standards</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                {activePillar.bestPractices.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <div className="flex items-center space-x-2 text-rose-950 font-extrabold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Common Reviewer Rejection Traps</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                {activePillar.commonMistakes.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyable Structural Template */}
          <div className="rounded-2xl bg-slate-950 border border-orange-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
              <span className="font-mono text-orange-400 font-bold">
                {activePillar.section.toUpperCase()}_MANUSCRIPT_BLUEPRINT.MD
              </span>
              <button
                onClick={() => handleCopyTemplate(activePillar.sampleTemplate)}
                className="flex items-center space-x-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                <span className="text-[11px] font-bold">{copied ? 'Copied!' : 'Copy Template'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {activePillar.sampleTemplate}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
