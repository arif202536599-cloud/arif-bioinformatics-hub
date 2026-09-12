import React from 'react';
import { ToolCategory, ToolLevel } from '../../types';
import { Search, Filter, Bookmark, X, Database } from 'lucide-react';
import { useUserData } from '../../context/UserDataContext';

interface ToolFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ToolCategory;
  setSelectedCategory: (cat: ToolCategory) => void;
  selectedLevel: ToolLevel;
  setSelectedLevel: (lvl: ToolLevel) => void;
  showOnlyBookmarked: boolean;
  setShowOnlyBookmarked: (val: boolean) => void;
  totalCount: number;
  filteredCount: number;
}

const categories: ToolCategory[] = [
  'All',
  'Genomics & Sequence',
  'Transcriptomics & RNA-seq',
  'Structure & Docking',
  'Phylogenetics',
  'Databases',
  'Pathways & Networks',
  'Plant Bioinformatics',
  'Programming & CLI',
];

const levels: ToolLevel[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const ToolFilterBar: React.FC<ToolFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLevel,
  setSelectedLevel,
  showOnlyBookmarked,
  setShowOnlyBookmarked,
  totalCount,
  filteredCount,
}) => {
  const { bookmarkedTools } = useUserData();

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setShowOnlyBookmarked(false);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedLevel !== 'All' || showOnlyBookmarked;

  return (
    <div className="p-6 rounded-3xl bio-glass border-orange-200 space-y-5 mb-8 shadow-xs">
      {/* Top Search Input & Bookmarks Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-orange-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 38+ verified tools (e.g. BLAST, AlphaFold, DESeq2, Vina, FastQC)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-orange-200 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 shadow-xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bookmarks Toggle & Clear Filter Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-1.5 transition-colors border shadow-xs cursor-pointer ${
              showOnlyBookmarked
                ? 'bg-amber-100 text-amber-950 border-amber-300'
                : 'bg-white text-slate-700 border-orange-200 hover:border-orange-300 hover:bg-orange-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarked ? 'fill-amber-600 text-amber-600' : 'text-slate-400'}`} />
            <span>Bookmarked ({bookmarkedTools.length})</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 hover:border-rose-300 transition-colors flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div>
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900 block mb-2">
          Filter by Research Domain:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs scale-[1.02]'
                    : 'bg-white text-slate-700 border border-orange-200 hover:border-orange-300 hover:bg-orange-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Filter & Result Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-orange-200 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-900 font-extrabold">Difficulty Level:</span>
          <div className="flex items-center space-x-1">
            {levels.map((lvl) => {
              const isSelected = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-orange-100 text-orange-950 border border-orange-300'
                      : 'bg-white text-slate-600 border border-orange-200 hover:bg-orange-50'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-slate-600 font-mono text-[11px] font-bold">
          Showing <strong className="text-orange-700 font-extrabold">{filteredCount}</strong> of {totalCount} software & databases
        </div>
      </div>
    </div>
  );
};
