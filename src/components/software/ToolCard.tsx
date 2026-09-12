import React, { useState } from 'react';
import { BioSoftware } from '../../types';
import { ExternalLink, Bookmark, Check, Copy, Terminal, Tag, Award, ArrowUpRight } from 'lucide-react';
import { useUserData } from '../../context/UserDataContext';

interface ToolCardProps {
  tool: BioSoftware;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { isToolBookmarked, toggleBookmarkTool } = useUserData();
  const [copied, setCopied] = useState(false);
  const bookmarked = isToolBookmarked(tool.id);

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold';
      case 'Intermediate':
        return 'bg-orange-100 text-orange-950 border-orange-300 font-bold';
      case 'Advanced':
        return 'bg-purple-100 text-purple-950 border-purple-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 font-bold';
    }
  };

  return (
    <div className="rounded-3xl bio-glass border-orange-200/90 hover:border-orange-400 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 group shadow-xs">
      <div>
        {/* Top Header: Category, Level & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-950 font-bold border border-orange-300">
              {tool.category}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg border ${getLevelColor(tool.level)}`}>
              {tool.level}
            </span>
          </div>

          <button
            onClick={() => toggleBookmarkTool(tool.id)}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer shadow-xs ${
              bookmarked
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-white text-slate-400 border-orange-200 hover:text-orange-600 hover:border-orange-300'
            }`}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark tool for research notes'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>
        </div>

        {/* Tool Name & Purpose */}
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-orange-700 transition-colors">
          {tool.name}
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1.5 leading-relaxed">
          {tool.purpose}
        </p>

        {/* Input / Output Format Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3.5 p-3 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block">Input Format</span>
            <span className="text-slate-900 font-mono font-bold text-[11px] line-clamp-1">{tool.inputType}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold block">Output Format</span>
            <span className="text-orange-900 font-mono font-bold text-[11px] line-clamp-1">{tool.outputType}</span>
          </div>
        </div>

        {/* Best Use Case */}
        <div className="mt-3 text-xs text-slate-700 font-medium">
          <strong className="text-slate-950 font-bold">Best Use Case: </strong>
          <span className="leading-relaxed">{tool.bestUseCase}</span>
        </div>

        {/* Sample Command if available */}
        {tool.sampleCommand && (
          <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono text-emerald-300 shadow-xs">
            <div className="flex items-center space-x-2 truncate mr-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate text-[11px] font-bold">{tool.sampleCommand}</span>
            </div>
            <button
              onClick={() => handleCopyCommand(tool.sampleCommand || '')}
              className="p-1 rounded text-slate-400 hover:text-white shrink-0 cursor-pointer"
              title="Copy sample command"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {tool.tags.map((tag, idx) => (
            <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white text-slate-700 font-medium border border-orange-200">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Link Action */}
      <div className="mt-5 pt-3 border-t border-orange-200 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-mono font-bold">
          Verified Pipeline Tool
        </span>
        <a
          href={tool.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-orange-700 hover:text-orange-900 flex items-center space-x-1 group-hover:translate-x-0.5 transition-all"
        >
          <span>Official Resource</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-orange-600" />
        </a>
      </div>
    </div>
  );
};
