import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Database, Atom, FileText, Bot, ArrowRight, CornerDownLeft } from 'lucide-react';
import { softwareDatabaseList } from '../../data/softwareData';
import { learningPathways } from '../../data/learningPathsData';
import { demoProteins } from '../../data/proteinDemoData';
import { aiBioinformaticsTools } from '../../data/aiData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, extraId?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose(); // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTools = softwareDatabaseList.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.purpose.toLowerCase().includes(query.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 4);

  const filteredPaths = learningPathways.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredProteins = demoProteins.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.geneSymbol.toLowerCase().includes(query.toLowerCase()) ||
    p.organism.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredAI = aiBioinformaticsTools.filter(a =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.tagline.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-bio-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-bio-900 border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-bio-950/60">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search software, databases, learning paths, proteins, or AI tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 ml-2 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-4 divide-y divide-slate-800/60">
          {/* Software & Databases */}
          {filteredTools.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
                <Database className="w-3.5 h-3.5" />
                <span>Software & Databases</span>
              </div>
              <div className="space-y-1">
                {filteredTools.map(tool => (
                  <div
                    key={tool.id}
                    onClick={() => {
                      onNavigate('software', tool.id);
                      onClose();
                    }}
                    className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/70 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-200 group-hover:text-cyan-300">{tool.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">{tool.category}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{tool.purpose}</p>
                    </div>
                    <CornerDownLeft className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Paths */}
          {filteredPaths.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Learning Pathways</span>
              </div>
              <div className="space-y-1">
                {filteredPaths.map(path => (
                  <div
                    key={path.id}
                    onClick={() => {
                      onNavigate('learning', path.id);
                      onClose();
                    }}
                    className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/70 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="text-sm font-medium text-slate-200 group-hover:text-teal-300">{path.title}</span>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{path.subtitle}</p>
                    </div>
                    <CornerDownLeft className="w-4 h-4 text-slate-600 group-hover:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proteins */}
          {filteredProteins.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                <Atom className="w-3.5 h-3.5" />
                <span>Protein 3D Explorer</span>
              </div>
              <div className="space-y-1">
                {filteredProteins.map(prot => (
                  <div
                    key={prot.id}
                    onClick={() => {
                      onNavigate('protein', prot.id);
                      onClose();
                    }}
                    className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/70 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-200 group-hover:text-emerald-300">{prot.name}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">({prot.geneSymbol})</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{prot.organism}</p>
                    </div>
                    <CornerDownLeft className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Tools */}
          {filteredAI.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
                <Bot className="w-3.5 h-3.5" />
                <span>AI for Bioinformatics</span>
              </div>
              <div className="space-y-1">
                {filteredAI.map(ai => (
                  <div
                    key={ai.id}
                    onClick={() => {
                      onNavigate('ai', ai.id);
                      onClose();
                    }}
                    className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/70 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="text-sm font-medium text-slate-200 group-hover:text-purple-300">{ai.name}</span>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{ai.tagline}</p>
                    </div>
                    <CornerDownLeft className="w-4 h-4 text-slate-600 group-hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredTools.length === 0 && filteredPaths.length === 0 && filteredProteins.length === 0 && filteredAI.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm">No exact matches found for "{query}".</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for keywords like "RNA-seq", "BLAST", "Lodging", "Docking", "DESeq2", or "AlphaFold".</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-bio-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search 38+ tools, 5 learning paths & 3D protein structures</span>
          <div className="flex items-center space-x-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">↵</kbd>
            <span>to select</span>
          </div>
        </div>
      </div>
    </div>
  );
};
