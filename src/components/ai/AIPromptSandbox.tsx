import React, { useState } from 'react';
import { bioPromptTemplates } from '../../data/aiData';
import { Sparkles, Terminal, Copy, Check, RefreshCw, Send, HelpCircle } from 'lucide-react';

export const AIPromptSandbox: React.FC = () => {
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [promptText, setPromptText] = useState(bioPromptTemplates[0].template);
  const [copied, setCopied] = useState(false);

  const handleSelectTemplate = (idx: number) => {
    setSelectedTemplateIndex(idx);
    setPromptText(bioPromptTemplates[idx].template);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl bio-glass border-orange-200 p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-orange-700">
          <Terminal className="w-4 h-4 text-orange-600" />
          <span>Interactive Prompt Engineering Workbench</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
          Bioinformatics AI Prompt Sandbox & Generator
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 max-w-3xl leading-relaxed">
          High-performance, domain-specific prompt engineering templates designed to elicit hallucination-free, mathematically sound R scripts, docking parameters, and manuscript outlines from LLMs.
        </p>
      </div>

      {/* Template Selector Pills */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-orange-200 pb-3">
        {bioPromptTemplates.map((t, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectTemplate(idx)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              selectedTemplateIndex === idx
                ? 'bg-orange-100 text-orange-950 border border-orange-400 shadow-xs scale-105'
                : 'bg-white text-slate-700 border border-orange-200 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Interactive Editor & Generator Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-800 font-extrabold">
            Category: <strong className="text-orange-700">{bioPromptTemplates[selectedTemplateIndex].category}</strong>
          </span>
          <button
            onClick={() => setPromptText(bioPromptTemplates[selectedTemplateIndex].template)}
            className="text-slate-600 hover:text-orange-950 flex items-center space-x-1 cursor-pointer font-bold"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Template</span>
          </button>
        </div>

        {/* Text Area */}
        <textarea
          rows={6}
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          className="w-full p-4 rounded-2xl bg-white border border-orange-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-orange-500 shadow-xs leading-relaxed"
          placeholder="Craft your bioinformatic AI prompt..."
        />

        {/* Bottom Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <p className="text-[11px] text-slate-600 font-medium">
            💡 Pro-Tip: Include exact bioconductor package versions and target species for 100% reproducible scripts.
          </p>

          <button
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center justify-center space-x-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Prompt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
