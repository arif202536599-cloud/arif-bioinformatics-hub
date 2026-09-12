import React, { useState } from 'react';
import { citationStyles } from '../../data/researchData';
import { BookMarked, Copy, Check, Sparkles, FileText, ArrowRight } from 'lucide-react';

export const CitationFormatter: React.FC = () => {
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(0);
  const [authors, setAuthors] = useState('Smith, J. A., Johnson, K. L., & Williams, R. T.');
  const [year, setYear] = useState('2024');
  const [title, setTitle] = useState('Genome-wide transcriptomic profiling and structural dynamics of stress-responsive regulatory pathways');
  const [journal, setJournal] = useState('Journal of Computational Biology');
  const [volume, setVolume] = useState('31');
  const [issue, setIssue] = useState('4');
  const [pages, setPages] = useState('312-328');
  const [doi, setDoi] = useState('10.1089/cmb.2024.0112');
  const [copied, setCopied] = useState(false);

  // Formatted output generator
  const currentStyle = citationStyles[selectedStyleIndex];

  const generateDynamicCitation = () => {
    switch (currentStyle.style) {
      case 'APA 7th Edition':
        return `${authors} (${year}). ${title}. ${journal}, ${volume}(${issue}), ${pages}. https://doi.org/${doi}`;
      case 'Nature Style':
        return `1. ${authors} ${title}. ${journal.replace('Journal of', 'J.')} ${volume}, ${pages} (${year}).`;
      case 'Harvard Style':
        return `${authors} (${year}) '${title}', ${journal}, ${volume}(${issue}), pp. ${pages}. doi: ${doi}.`;
      case 'Vancouver Style':
        return `1. ${authors.replace(/[.,&]/g, '')}. ${title}. ${journal.replace('Journal of', 'J')}. ${year};${volume}(${issue}):${pages}. doi: ${doi}.`;
      case 'IEEE Style':
        return `[1] ${authors}, "${title}," ${journal}, vol. ${volume}, no. ${issue}, pp. ${pages}, ${year}, doi: ${doi}.`;
      default:
        return `${authors} (${year}). ${title}. ${journal}.`;
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl bio-glass border-orange-200 p-6 sm:p-8 mb-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-orange-700">
            <BookMarked className="w-4 h-4 text-orange-600" />
            <span>Academic Reference & Citation Suite</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Citation Style Master & Reference Formatter
          </h2>
        </div>
      </div>

      {/* Citation Style Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-orange-200 pb-3">
        {citationStyles.map((style, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedStyleIndex(idx)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              selectedStyleIndex === idx
                ? 'bg-orange-100 text-orange-950 border border-orange-300 shadow-xs'
                : 'text-slate-700 hover:text-slate-950 hover:bg-orange-50'
            }`}
          >
            {style.style}
          </button>
        ))}
      </div>

      {/* Form Fields for Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 text-xs">
        <div>
          <label className="block text-[11px] font-extrabold text-slate-900 mb-1 uppercase">Authors:</label>
          <input
            type="text"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
          />
        </div>
        <div>
          <label className="block text-[11px] font-extrabold text-slate-900 mb-1 uppercase">Publication Year:</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs font-mono"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-extrabold text-slate-900 mb-1 uppercase">Article / Chapter Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
          />
        </div>
        <div>
          <label className="block text-[11px] font-extrabold text-slate-900 mb-1 uppercase">Journal Name:</label>
          <input
            type="text"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
          />
        </div>
        <div>
          <label className="block text-[11px] font-extrabold text-slate-900 mb-1 uppercase">Volume & Issue:</label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Vol"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-1/2 p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs font-mono"
            />
            <input
              type="text"
              placeholder="Issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-1/2 p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs font-mono"
            />
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-extrabold text-slate-900 mb-1 uppercase">Page Numbers:</label>
          <input
            type="text"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-extrabold text-slate-900 mb-1 uppercase">DOI Identifier:</label>
          <input
            type="text"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs font-mono"
          />
        </div>
      </div>

      {/* Formatted Output Box */}
      <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-orange-950 uppercase">
            Formatted Reference ({currentStyle.style}):
          </span>
          <button
            onClick={() => handleCopy(generateDynamicCitation())}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-100 text-slate-800 border border-orange-200 flex items-center space-x-1.5 text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            <span>{copied ? 'Copied!' : 'Copy Reference'}</span>
          </button>
        </div>

        <p className="text-xs font-serif text-slate-950 font-bold p-3 rounded-xl bg-white border border-orange-200 leading-relaxed select-all shadow-xs">
          {generateDynamicCitation()}
        </p>
      </div>
    </div>
  );
};
