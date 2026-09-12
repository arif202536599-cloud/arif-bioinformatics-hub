import React, { useState } from 'react';
import { AIToolInfo } from '../../types';
import { Bot, ExternalLink, Copy, Check, ShieldAlert, Sparkles, ArrowUpRight, Terminal, AlertTriangle } from 'lucide-react';

interface AICardProps {
  tool: AIToolInfo;
}

export const AICard: React.FC<AICardProps> = ({ tool }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(tool.examplePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl bio-glass border-orange-200/90 hover:border-orange-400 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 group shadow-xs">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-950 font-bold border border-orange-300">
            {tool.category}
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
            tool.cautionLevel === 'High'
              ? 'bg-rose-100 text-rose-950 border-rose-300'
              : tool.cautionLevel === 'Medium'
              ? 'bg-amber-100 text-amber-950 border-amber-300'
              : 'bg-emerald-100 text-emerald-950 border-emerald-300'
          }`}>
            Caution: {tool.cautionLevel}
          </span>
        </div>

        {/* Name & Tagline */}
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-orange-700 transition-colors">
          {tool.name}
        </h3>
        <p className="text-xs text-orange-800 font-bold mt-0.5">
          {tool.tagline}
        </p>

        {/* Key Features */}
        <div className="mt-3.5 space-y-1.5">
          <span className="text-[10px] text-slate-500 uppercase font-extrabold block">Key Capabilities:</span>
          <ul className="space-y-1">
            {tool.keyFeatures.map((feat, idx) => (
              <li key={idx} className="text-xs text-slate-800 font-medium flex items-start space-x-1.5 leading-relaxed">
                <span className="text-orange-600 font-bold">•</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Bioinformatic Use */}
        <div className="mt-3.5 p-3 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs">
          <strong className="text-slate-950 font-bold">Recommended Use: </strong>
          <span className="text-slate-700 font-medium">{tool.recommendedUse}</span>
        </div>

        {/* Example Prompt Box with Copy */}
        <div className="mt-3.5 rounded-2xl bg-slate-950 border border-orange-200 overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px]">
            <span className="text-orange-400 font-mono font-bold flex items-center space-x-1.5">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span>Bioinformatics Benchmark Prompt</span>
            </span>
            <button
              onClick={handleCopyPrompt}
              className="text-slate-300 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span className="text-[10px] font-bold">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="p-3 text-[11px] font-mono text-emerald-300 leading-relaxed line-clamp-3">
            "{tool.examplePrompt}"
          </p>
        </div>

        {/* Limitations Alert */}
        <div className="mt-3 flex items-start space-x-2 text-[11px] text-slate-600 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span><strong className="text-slate-900 font-bold">Known Limit:</strong> {tool.limitations}</span>
        </div>
      </div>

      {/* Official Link */}
      <div className="mt-5 pt-3 border-t border-orange-200">
        <a
          href={tool.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white hover:bg-orange-50 text-orange-950 border border-orange-200 hover:border-orange-400 flex items-center justify-center space-x-1.5 transition-all shadow-xs group/btn"
        >
          <span>Open {tool.name.split(' ')[0]}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-orange-600 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};
