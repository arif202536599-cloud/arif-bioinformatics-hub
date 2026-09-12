import React from 'react';
import { User, GraduationCap, BookOpen, Dna, Sprout, Award, FileText, Mail, Phone, Sparkles } from 'lucide-react';

export const ProfileDetails: React.FC = () => {
  const educationTimeline = [
    {
      degree: 'MPhil in Bioinformatics',
      institution: 'Bioinformatics Research Division',
      period: '2024 — Present',
      focus: 'Pan-Genomics, Rice Lodging Biomechanics & RNA-seq Multi-Omics',
      details: 'Conducting advanced computational research on Gibberellin 20-oxidase (sd1) regulatory networks, secondary cell wall cellulose/lignin biosynthesis, and molecular docking.'
    },
    {
      degree: 'Bachelor of Science (BS) in Bioinformatics',
      institution: 'Faculty of Biological & Computational Sciences',
      period: '2020 — 2024',
      focus: 'Genomics, Computational Biology & Statistical Programming',
      details: 'Graduated with high honors. Completed comprehensive thesis on plant gene family evolutionary dynamics and in silico molecular docking.'
    }
  ];

  const publicationPlaceholders = [
    {
      title: 'Pan-genomic architecture and structural dynamics of the semi-dwarf 1 (sd1) locus in Asian cultivated rice',
      authors: 'Uddin, A., et al.',
      journal: 'Journal of Plant Molecular Biology',
      year: '2025',
      doi: '10.1016/j.jpmb.2025.04.012',
      type: 'Original Research (In Preparation / Thesis Dissertation)',
      status: 'Targeted Submission'
    },
    {
      title: 'Genome-wide identification, evolutionary phylogeny, and expression dynamics of the WRKY transcription factor family in crop abiotic stress responses',
      authors: 'Uddin, A., et al.',
      journal: 'Computational Biology and Chemistry',
      year: '2025',
      doi: '10.1016/j.compbiolchem.2025.108201',
      type: 'Research Article (Under Review)',
      status: 'Under Review'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Profile Bio Card */}
      <div className="rounded-3xl bio-glass border-orange-200 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-teal-500 p-0.5 shrink-0 shadow-lg shadow-orange-500/15">
              <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl text-orange-600 font-mono">
                AU
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300 font-bold">
                  Researcher Profile
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Arif Uddin
              </h2>
              <p className="text-xs sm:text-sm text-orange-700 font-mono font-bold">
                MPhil Bioinformatics Researcher • Computational Biology Educator
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600">
                <span className="flex items-center space-x-1 font-mono">
                  <Mail className="w-3.5 h-3.5 text-orange-600" />
                  <span>fivupw005@gmail.com</span>
                </span>
                <span className="flex items-center space-x-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+92 309 9062590</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-orange-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
          <p>
            Welcome to my bioinformatics research hub. As an MPhil Bioinformatics researcher, my work is dedicated to resolving complex biological questions across <strong className="text-slate-900">pan-genomics</strong>, <strong className="text-slate-900">bulk and single-cell RNA-seq transcriptomics</strong>, <strong className="text-slate-900">plant molecular biology</strong>, <strong className="text-slate-900">protein 3D structural analysis</strong>, and <strong className="text-slate-900">network pharmacology</strong>.
          </p>
          <p>
            My current investigation focuses on the genetic determinants of <strong className="text-orange-700 font-semibold">rice culm lodging resistance</strong>, exploring how mutations in <strong className="text-orange-700 font-semibold">Gibberellin 20-oxidase (sd1)</strong> and secondary cell wall cellulose/lignin synthesis pathways regulate stem mechanical strength and crop yield stability.
          </p>
        </div>
      </div>

      {/* Academic Timeline */}
      <div className="rounded-3xl bio-glass border-orange-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
          <GraduationCap className="w-4 h-4 text-orange-600" />
          <span>Academic Background & Qualifications</span>
        </div>

        <div className="space-y-6">
          {educationTimeline.map((item, idx) => (
            <div key={idx} className="relative pl-6 sm:pl-8 border-l-2 border-orange-200 space-y-2">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-100 border-2 border-orange-500" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="text-base font-bold text-slate-900">{item.degree}</h4>
                <span className="text-xs font-mono text-orange-900 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-300 font-bold">
                  {item.period}
                </span>
              </div>
              <p className="text-xs font-bold text-orange-700">{item.institution} — {item.focus}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{item.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Publications & Research Synopses Placeholders */}
      <div className="rounded-3xl bio-glass border-orange-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
          <BookOpen className="w-4 h-4 text-orange-600" />
          <span>Research Publications & Working Manuscripts</span>
        </div>

        <div className="space-y-4">
          {publicationPlaceholders.map((pub, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-orange-200 space-y-2 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-900 border border-orange-300 font-bold">
                  {pub.type}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                  {pub.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">{pub.title}</h4>
              <p className="text-xs text-slate-600">{pub.authors} ({pub.year}). <em>{pub.journal}</em>.</p>
              <div className="text-[11px] font-mono text-slate-500">
                DOI: <span className="text-orange-700 font-semibold">{pub.doi}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
