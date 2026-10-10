import { ArrowRight, Dna } from 'lucide-react';

export function CentralDogmaConcept() {
  return <details className="cd-panel cd-concept">
    <summary><Dna size={18} /> Understand the central dogma: DNA → RNA → protein</summary>
    <p className="cd-concept-intro">The central dogma describes how sequence information flows between biological molecules. This explorer focuses on the usual gene-expression pathway: a gene is transcribed into RNA, and a protein-coding RNA’s coding sequence is translated into a protein.</p>
    <div className="cd-concept-flow" aria-label="Gene-expression pathway">
      <span>DNA</span><div><small>transcription</small><ArrowRight size={20} /></div><span>RNA</span><div><small>translation of CDS</small><ArrowRight size={20} /></div><span>Protein</span>
    </div>
    <div className="cd-concept-grid">
      <article><span className="cd-concept-number">01 · THE GENE</span><h3>Genomic DNA</h3>
        <p>A gene occupies a region of a chromosome or contig. A reference record can identify its organism, assembly, coordinates and strand. Exons and introns are shown when annotated.</p>
      </article>
      <article><span className="cd-concept-number">02 · THE TRANSCRIPT</span><h3>RNA, mRNA and CDS</h3>
        <p>Transcription produces RNA. In genes with annotated splicing, introns are removed and exons joined. The CDS is the region translated into protein; 5′ and 3′ UTRs belong to the transcript but are not translated.</p>
      </article>
      <article><span className="cd-concept-number">03 · THE PRODUCT</span><h3>Protein</h3>
        <p>Translation reads the CDS in codons to produce an amino-acid sequence. The explorer uses the record’s genetic code and translation annotations, then compares the computed sequence with the reference and your input.</p>
      </article>
    </div>
    <div className="cd-concept-explanation">
      <h3>How can the explorer start from a protein?</h3>
      <p>It searches for matching reference proteins and follows explicit database links to their coding records. This is a database lookup of possible origins. Protein sequence does not encode enough information to recover the original DNA uniquely: different codons, genes and organisms can produce the same protein.</p>
      <dl>
        <div><dt>Reference transcript ≠ RNA-seq</dt><dd>A transcript sequence describes an annotated RNA molecule. RNA-seq measures experimental RNA reads and expression, which require separate data.</dd></div>
        <div><dt>Missing annotation stays unavailable</dt><dd>Some proteins have no linked transcript, GeneID or genomic assembly. Similarity alone cannot fill those gaps.</dd></div>
        <div><dt>Other biological pathways exist</dt><dd>RNA can be copied into RNA or reverse-transcribed into DNA in some systems. The displayed pathway covers reference protein-coding genes, not every information-transfer process.</dd></div>
      </dl>
    </div>
  </details>;
}
