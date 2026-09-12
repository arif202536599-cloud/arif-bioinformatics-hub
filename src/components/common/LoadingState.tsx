import React from 'react';
import { Dna } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading Bioinformatics Modules...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px] text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <Dna className="w-8 h-8 text-teal-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="text-sm font-medium text-slate-300 font-mono tracking-wide">{message}</p>
      <p className="text-xs text-slate-500 mt-2">Connecting sequence repositories & local cache</p>
    </div>
  );
};
