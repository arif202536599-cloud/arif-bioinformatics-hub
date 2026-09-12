import React, { useState } from 'react';
import { PathwayStep } from '../../types';
import { 
  CheckCircle2, Circle, Copy, Check, Terminal, FileCode2, 
  Lightbulb, Wrench, BookmarkPlus, Save, Sparkles, MessageSquarePlus 
} from 'lucide-react';
import { useUserData } from '../../context/UserDataContext';

interface PathwayCardProps {
  step: PathwayStep;
  isLast: boolean;
  pathwayTitle?: string;
}

export const PathwayCard: React.FC<PathwayCardProps> = ({ step, isLast, pathwayTitle = 'Bioinformatics Pathway' }) => {
  const { isStepCompleted, toggleStepCompletion, addNote } = useUserData();
  const [copied, setCopied] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [stepNoteText, setStepNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const completed = isStepCompleted(step.id);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveStepNote = () => {
    if (!stepNoteText.trim()) return;

    addNote({
      title: `${pathwayTitle}: Step ${step.stepNumber} - ${step.title}`,
      category: pathwayTitle.includes('RNA-seq') ? 'Transcriptomics' : pathwayTitle.includes('Protein') ? 'Structural Biology' : 'Genomics',
      content: `### Lab & Analysis Notes: ${step.title}\n\n**Step Summary:** ${step.description}\n\n**Researcher Findings & Observations:**\n${stepNoteText}\n\n**Recommended Tool:** ${step.recommendedTools.join(', ')}\n**Input:** ${step.inputFormat} | **Output:** ${step.outputFormat}`,
      tags: [pathwayTitle.split(' ')[0], `Step-${step.stepNumber}`, ...step.recommendedTools.slice(0, 2)],
    });

    setNoteSaved(true);
    setTimeout(() => {
      setNoteSaved(false);
      setShowNoteInput(false);
      setStepNoteText('');
    }, 2000);
  };

  return (
    <div className="relative pl-6 sm:pl-8 pb-8">
      {/* Vertical connection line */}
      {!isLast && (
        <div
          className={`absolute left-[11px] sm:left-[15px] top-8 bottom-0 w-0.5 transition-colors ${
            completed ? 'bg-gradient-to-b from-emerald-500 to-orange-200' : 'bg-orange-200'
          }`}
        />
      )}

      {/* Step Circle / Checkbox icon */}
      <button
        onClick={() => toggleStepCompletion(step.id)}
        className={`absolute left-0 top-0.5 p-1 rounded-full border transition-all duration-200 cursor-pointer ${
          completed
            ? 'bg-emerald-100 border-emerald-500 text-emerald-700 shadow-sm'
            : 'bg-white border-orange-300 text-slate-400 hover:border-orange-500 hover:text-orange-600'
        }`}
        title={completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {completed ? (
          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
        ) : (
          <Circle className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>

      {/* Main Step Card */}
      <div
        className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 border shadow-xs ${
          completed
            ? 'bg-emerald-50/50 border-emerald-300'
            : 'bg-white border-orange-200 hover:border-orange-300'
        }`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-950 border border-orange-300">
              Step {step.stepNumber}
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              {step.title}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="text-xs font-bold px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Add a research note for this step"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-orange-600" />
              <span>{showNoteInput ? 'Close Note' : 'Add Note'}</span>
            </button>

            <button
              onClick={() => toggleStepCompletion(step.id)}
              className={`text-xs font-bold px-3 py-1 rounded-xl border transition-colors cursor-pointer ${
                completed
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-orange-100 text-orange-950 border-orange-300 hover:bg-orange-200'
              }`}
            >
              {completed ? '✓ Completed' : 'Mark Step Complete'}
            </button>
          </div>
        </div>

        {/* Note input box when expanded */}
        {showNoteInput && (
          <div className="mb-4 p-4 rounded-2xl bg-orange-50/80 border border-orange-300 space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-orange-950 flex items-center space-x-1.5">
                <BookmarkPlus className="w-3.5 h-3.5 text-orange-600" />
                <span>Save Note into "Saved Research Notes"</span>
              </span>
              {noteSaved && (
                <span className="text-[11px] font-bold text-emerald-700 flex items-center space-x-1 animate-pulse">
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved to Research Notes!</span>
                </span>
              )}
            </div>
            <textarea
              rows={2}
              value={stepNoteText}
              onChange={(e) => setStepNoteText(e.target.value)}
              placeholder={`Write findings, parameter notes, or experiment results for Step ${step.stepNumber}...`}
              className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 text-xs focus:outline-none focus:border-orange-500 shadow-xs"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveStepNote}
                className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Research Notes</span>
              </button>
            </div>
          </div>
        )}

        {/* Description & Scientific Rationale */}
        <p className="text-slate-800 text-xs sm:text-sm leading-relaxed mb-3 font-medium">
          {step.description}
        </p>
        <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200 text-xs text-slate-800 mb-4 leading-relaxed font-medium">
          <strong className="text-slate-950 font-bold">Scientific Rationale:</strong> {step.rationale}
        </div>

        {/* Tools and I/O specifications */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
          <div className="p-3 rounded-2xl bg-white border border-orange-200 shadow-xs">
            <div className="flex items-center space-x-1.5 text-orange-700 font-bold mb-1">
              <Wrench className="w-3.5 h-3.5" />
              <span>Recommended Tools</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {step.recommendedTools.map((tool, idx) => (
                <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-orange-100 text-orange-950 font-bold border border-orange-300">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-orange-200 shadow-xs">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-extrabold">Input Format</span>
            <p className="text-xs font-mono font-bold text-slate-900 mt-1">{step.inputFormat}</p>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-orange-200 shadow-xs">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-extrabold">Output Format</span>
            <p className="text-xs font-mono font-bold text-slate-900 mt-1">{step.outputFormat}</p>
          </div>
        </div>

        {/* Code / Command Snippet */}
        {step.codeSnippet && (
          <div className="rounded-2xl overflow-hidden border border-orange-200 bg-slate-950 mb-4 shadow-sm">
            <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
              <span className="flex items-center space-x-2 font-mono text-[11px] font-bold text-orange-400">
                {step.codeLanguage === 'r' ? <FileCode2 className="w-3.5 h-3.5 text-blue-400" /> : <Terminal className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{step.codeLanguage?.toUpperCase() || 'COMMAND'}</span>
              </span>
              <button
                onClick={() => handleCopy(step.codeSnippet || '')}
                className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px] font-bold">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3.5 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              <code>{step.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Key Pro Tip */}
        <div className="flex items-start space-x-2.5 text-xs text-amber-950 bg-amber-50 border border-amber-300 p-3 rounded-2xl">
          <Lightbulb className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <strong className="text-amber-950 font-extrabold">Bioinformatics Best Practice: </strong>
            <span className="text-slate-800 font-medium">{step.keyTip}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
