import React, { useState } from 'react';
import { Calculator, Dna, ArrowRightLeft, Cpu, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';

export const QuickToolbox: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'gc' | 'revcomp' | 'translate' | 'peptide'>('gc');
  const [sequenceInput, setSequenceInput] = useState('ATGGCTAGCTCGCCTGAGGCCGCCACTGCCGCTGCGCCGCTGGGGTTCGTGTTCTCGGACGCCGAGCTCGTCCGCGTCCCGGCCGAGTACGTCCGCGCGGCGGTGGCGGGGCGCGGGTTCACCGTGGTGCGCGACGGCGTCGGCCGCTCGGAGCTCGCCGAGGCCTACGAGCGCCTCCTCGACTGCGCGCGCGAG');
  const [copied, setCopied] = useState(false);

  // 1. GC Content calculation
  const cleanSeq = sequenceInput.toUpperCase().replace(/[^ATCGU]/g, '');
  const seqLength = cleanSeq.length;
  const gCount = (cleanSeq.match(/[G]/g) || []).length;
  const cCount = (cleanSeq.match(/[C]/g) || []).length;
  const aCount = (cleanSeq.match(/[A]/g) || []).length;
  const tCount = (cleanSeq.match(/[TU]/g) || []).length;
  const gcPercent = seqLength > 0 ? (((gCount + cCount) / seqLength) * 100).toFixed(2) : '0.00';
  const atPercent = seqLength > 0 ? (((aCount + tCount) / seqLength) * 100).toFixed(2) : '0.00';

  // 2. Reverse Complement
  const complementMap: Record<string, string> = { A: 'T', T: 'A', U: 'A', C: 'G', G: 'C' };
  const revComp = cleanSeq
    .split('')
    .reverse()
    .map(base => complementMap[base] || base)
    .join('');

  // 3. Translation
  const codonTable: Record<string, string> = {
    ATA: 'I', ATC: 'I', ATT: 'I', ATG: 'M (Start)',
    ACA: 'T', ACC: 'T', ACG: 'T', ACT: 'T',
    AAC: 'N', AAT: 'N', AAA: 'K', AAG: 'K',
    AGC: 'S', AGT: 'S', AGA: 'R', AGG: 'R',
    CTA: 'L', CTC: 'L', CTG: 'L', CTT: 'L',
    CCA: 'P', CCC: 'P', CCG: 'P', CCT: 'P',
    CAC: 'H', CAT: 'H', CAA: 'Q', CAG: 'Q',
    CGA: 'R', CGC: 'R', CGG: 'R', CGT: 'R',
    GTA: 'V', GTC: 'V', GTG: 'V', GTT: 'V',
    GCA: 'A', GCC: 'A', GCG: 'A', GCT: 'A',
    GAC: 'D', GAT: 'D', GAA: 'E', GAG: 'E',
    GGA: 'G', GGC: 'G', GGG: 'G', GGT: 'G',
    TCA: 'S', TCC: 'S', TCG: 'S', TCT: 'S',
    TTC: 'F', TTT: 'F', TTA: 'L', TTG: 'L',
    TAC: 'Y', TAT: 'Y', TAA: '* (Stop)', TAG: '* (Stop)',
    TGC: 'C', TGT: 'C', TGA: '* (Stop)', TGG: 'W',
  };

  const codons: string[] = [];
  for (let i = 0; i < cleanSeq.length - 2; i += 3) {
    const codon = cleanSeq.substring(i, i + 3);
    codons.push(codonTable[codon] || '?');
  }
  const translatedPeptide = codons.join('');

  // 4. Peptide mass estimate
  const aaWeights: Record<string, number> = {
    A: 89.09, R: 174.20, N: 132.12, D: 133.10, C: 121.16,
    E: 147.13, Q: 146.15, G: 75.07, H: 155.16, I: 131.18,
    L: 131.18, K: 146.19, M: 149.21, F: 165.19, P: 115.13,
    S: 105.09, T: 119.12, W: 204.23, Y: 181.19, V: 117.15
  };
  const peptideChars = sequenceInput.toUpperCase().replace(/[^ARNDCEQGHILKMFPSTWYV]/g, '');
  const estimatedMass = peptideChars
    .split('')
    .reduce((acc, char) => acc + (aaWeights[char] || 110) - 18.015, 18.015);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadPreset = (type: 'rice_dna' | 'rice_protein' | 'tp53_cds') => {
    if (type === 'rice_dna') {
      setSequenceInput('ATGGCTAGCTCGCCTGAGGCCGCCACTGCCGCTGCGCCGCTGGGGTTCGTGTTCTCGGACGCCGAGCTCGTCCGCGTCCCGGCCGAGTACGTCCGCGCGGCGGTGGCGGGGCGCGGGTTCACCGTGGTGCGCGACGGCGTCGGCCGCTCGGAGCTCGCCGAGGCCTACGAGCGCCTCCTCGACTGCGCGCGCGAG');
      setActiveTool('gc');
    } else if (type === 'rice_protein') {
      setSequenceInput('MASSPEAATAAAPLGFVFSDAELVRVPAEYVRAAVAGRGFTVVRDGVGRSELAEAYERLLDCARELGVRVRVVESGVPVEVARRVAAASARGGAGGGGEVELL');
      setActiveTool('peptide');
    } else {
      setSequenceInput('ATGGAGGAGCCGCAGTCAGATCCTAGCGTCGAGCCCCCTCTGAGTCAGGAAACATTTTCAGACCTATGGAAACTACTTCCTGAAAACAACGTTCTGTCCCCCTTGCCGTCCCAAGCAATGGATGATTTGATGCTGTCCCCGGACGATATTGAACAATGGTTCAC');
      setActiveTool('translate');
    }
  };

  return (
    <div className="rounded-3xl bio-glass border-orange-200/90 p-6 sm:p-8 mb-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-orange-700">
            <Calculator className="w-4 h-4 text-orange-600" />
            <span>Interactive Bio-Utility Suite</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Quick Sequence Analyzer & Calculator
          </h2>
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-600 font-bold mr-1">Presets:</span>
          <button
            onClick={() => loadPreset('rice_dna')}
            className="px-2.5 py-1 rounded-xl bg-white border border-orange-200 hover:border-orange-400 text-slate-800 hover:text-orange-950 font-mono font-semibold transition-all shadow-xs cursor-pointer"
          >
            Plant CDS
          </button>
          <button
            onClick={() => loadPreset('rice_protein')}
            className="px-2.5 py-1 rounded-xl bg-white border border-orange-200 hover:border-orange-400 text-slate-800 hover:text-orange-950 font-mono font-semibold transition-all shadow-xs cursor-pointer"
          >
            Peptide (aa)
          </button>
          <button
            onClick={() => loadPreset('tp53_cds')}
            className="px-2.5 py-1 rounded-xl bg-white border border-orange-200 hover:border-orange-400 text-slate-800 hover:text-orange-950 font-mono font-semibold transition-all shadow-xs cursor-pointer"
          >
            Human TP53
          </button>
        </div>
      </div>

      {/* Tool Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-orange-200 pb-3">
        <button
          onClick={() => setActiveTool('gc')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTool === 'gc'
              ? 'bg-orange-100 text-orange-950 border border-orange-300 shadow-xs'
              : 'text-slate-700 hover:text-slate-950 hover:bg-orange-50'
          }`}
        >
          GC% & Nucleotide Composition
        </button>
        <button
          onClick={() => setActiveTool('revcomp')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTool === 'revcomp'
              ? 'bg-orange-100 text-orange-950 border border-orange-300 shadow-xs'
              : 'text-slate-700 hover:text-slate-950 hover:bg-orange-50'
          }`}
        >
          Reverse Complement (5'→3')
        </button>
        <button
          onClick={() => setActiveTool('translate')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTool === 'translate'
              ? 'bg-orange-100 text-orange-950 border border-orange-300 shadow-xs'
              : 'text-slate-700 hover:text-slate-950 hover:bg-orange-50'
          }`}
        >
          Codon Translation (CDS → AA)
        </button>
        <button
          onClick={() => setActiveTool('peptide')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTool === 'peptide'
              ? 'bg-orange-100 text-orange-950 border border-orange-300 shadow-xs'
              : 'text-slate-700 hover:text-slate-950 hover:bg-orange-50'
          }`}
        >
          Peptide Molecular Mass Estimator
        </button>
      </div>

      {/* Input textarea */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold text-slate-900 mb-1.5 uppercase tracking-wide">
            {activeTool === 'peptide' ? 'Enter Amino Acid Sequence (1-letter code):' : 'Enter Nucleotide Sequence (DNA/RNA):'}
          </label>
          <textarea
            rows={3}
            value={sequenceInput}
            onChange={(e) => setSequenceInput(e.target.value)}
            className="w-full rounded-2xl bg-white border border-orange-200 p-3 text-xs font-mono text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-orange-500 shadow-xs transition-colors uppercase"
            placeholder="Paste your FASTA or raw sequence here..."
          />
        </div>

        {/* Output Panel */}
        <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200">
          {activeTool === 'gc' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-white border border-orange-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600">Total Length</span>
                <p className="text-xl font-extrabold font-mono text-slate-950 mt-0.5">{seqLength} <span className="text-xs font-normal text-slate-500">bp</span></p>
              </div>
              <div className="p-3 rounded-xl bg-orange-100/80 border border-orange-300 shadow-xs">
                <span className="text-[11px] font-bold text-orange-950">GC Content</span>
                <p className="text-xl font-extrabold font-mono text-orange-950 mt-0.5">{gcPercent}%</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100/80 border border-amber-300 shadow-xs">
                <span className="text-[11px] font-bold text-amber-950">AT Content</span>
                <p className="text-xl font-extrabold font-mono text-amber-950 mt-0.5">{atPercent}%</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-orange-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600">Base Counts</span>
                <p className="text-xs font-mono font-bold text-slate-900 mt-1">
                  A:{aCount} | T:{tCount} | G:{gCount} | C:{cCount}
                </p>
              </div>
            </div>
          )}

          {activeTool === 'revcomp' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-orange-950 flex items-center space-x-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-orange-600" />
                  <span>Reverse Complement Sequence (5' → 3')</span>
                </span>
                <button
                  onClick={() => handleCopy(revComp)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white hover:bg-orange-50 text-slate-800 border border-orange-200 flex items-center space-x-1 shadow-xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-white border border-orange-200 font-mono text-xs font-bold text-slate-900 break-all select-all shadow-xs">
                {revComp || 'No valid sequence entered.'}
              </div>
            </div>
          )}

          {activeTool === 'translate' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-emerald-950 flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Translated Protein Sequence (Reading Frame 1)</span>
                </span>
                <button
                  onClick={() => handleCopy(translatedPeptide)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white hover:bg-orange-50 text-slate-800 border border-orange-200 flex items-center space-x-1 shadow-xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-white border border-orange-200 font-mono text-xs font-bold text-slate-900 break-all select-all shadow-xs">
                {translatedPeptide || 'Sequence too short for 3-base codons.'}
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-2">
                Translated {codons.length} amino acid residues. Standard eukaryotic genetic code.
              </p>
            </div>
          )}

          {activeTool === 'peptide' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 shadow-xs">
                <span className="text-[11px] font-bold text-purple-950">Estimated Molecular Weight</span>
                <p className="text-xl font-extrabold font-mono text-purple-950 mt-0.5">
                  {(estimatedMass / 1000).toFixed(2)} <span className="text-xs font-normal">kDa</span>
                </p>
                <span className="text-[10px] text-purple-700 font-mono font-bold">{estimatedMass.toFixed(1)} Da</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-orange-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600">Residue Count</span>
                <p className="text-xl font-extrabold font-mono text-slate-950 mt-0.5">{peptideChars.length} <span className="text-xs font-normal text-slate-500">aa</span></p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-orange-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-600">Theoretical Charge & State</span>
                <p className="text-xs font-mono font-bold text-slate-800 mt-1">
                  Physiological pH ~ 7.0 Standard State
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
