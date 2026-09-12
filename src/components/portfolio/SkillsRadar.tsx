import React from 'react';
import { Terminal, Code2, Dna, Activity, Atom, TestTube, BarChart3, FileText, Users, Award } from 'lucide-react';

export const SkillsRadar: React.FC = () => {
  const dryLabSkills = [
    { name: 'Python (Biopython, Pandas, SciPy, Scikit-learn)', level: 92, icon: Terminal, color: 'from-cyan-500 to-blue-500' },
    { name: 'R & Bioconductor (DESeq2, clusterProfiler, ggplot2)', level: 95, icon: Code2, color: 'from-teal-500 to-cyan-500' },
    { name: 'RNA-seq & NGS Pipelines (STAR, fastp, featureCounts)', level: 90, icon: Activity, color: 'from-emerald-500 to-teal-500' },
    { name: 'Structural Modeling & Docking (Vina, PyRx, AlphaFold, PyMOL)', level: 88, icon: Atom, color: 'from-sky-500 to-indigo-500' },
    { name: 'Phylogenetics & Comparative Genomics (IQ-TREE, MEGA, MEME)', level: 85, icon: Dna, color: 'from-purple-500 to-pink-500' },
    { name: 'SPSS & Statistical Modeling', level: 86, icon: BarChart3, color: 'from-amber-500 to-orange-500' },
  ];

  const wetLabAndAcademicSkills = [
    { name: 'RT-qPCR & Gene Expression Quantification', level: 88, icon: TestTube, color: 'from-emerald-500 to-cyan-500' },
    { name: 'RNA / DNA Extraction & Quality Assessment (Nanodrop/Gel)', level: 90, icon: Dna, color: 'from-teal-500 to-emerald-500' },
    { name: 'Plant Molecular Biology & Culm Biomechanics Assays', level: 92, icon: Activity, color: 'from-cyan-500 to-teal-500' },
    { name: 'Scientific Manuscript Writing & Reference Management', level: 94, icon: FileText, color: 'from-blue-500 to-indigo-500' },
    { name: 'Bioinformatics Mentorship & Workshop Teaching', level: 89, icon: Users, color: 'from-purple-500 to-teal-500' },
  ];

  return (
    <div className="rounded-3xl bio-glass border-slate-800 p-6 sm:p-8 space-y-8">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
          <Award className="w-4 h-4" />
          <span>Core Competencies</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
          Technical & Laboratory Skills Matrix
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Bridging high-throughput computational genomics (Dry Lab) with rigorous molecular biology protocols (Wet Lab).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dry Lab Skills */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Computational & Dry-Lab Proficiency</span>
          </h4>

          <div className="space-y-3.5">
            {dryLabSkills.map((skill, idx) => {
              const Icon = skill.icon;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium flex items-center space-x-2">
                      <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{skill.name}</span>
                    </span>
                    <span className="font-mono text-cyan-400 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wet Lab & Academic Skills */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-2 border-b border-slate-800 pb-2">
            <TestTube className="w-4 h-4 text-emerald-400" />
            <span>Wet-Lab & Academic Research Proficiency</span>
          </h4>

          <div className="space-y-3.5">
            {wetLabAndAcademicSkills.map((skill, idx) => {
              const Icon = skill.icon;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium flex items-center space-x-2">
                      <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{skill.name}</span>
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
