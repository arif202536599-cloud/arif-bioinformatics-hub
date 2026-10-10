"""Synthetic offline fixtures: these are not real database evidence."""
from .sequences import Query


def demo_data():
    query = Query(1, "DEMO_PROTEIN", "Synthetic offline demonstration", "MAEFG")
    detail = {
        "protein_accession": "DEMO_PROTEIN.1", "organism": "Synthetic demonstration (not a species)",
        "taxid": None, "gene_names": ["DEMO_GENE"], "gene_ids": ["DEMO_GENE"],
        "protein_sequence": "MAEFG", "query_sequence": "MAEFG",
        "match": "Exact full-length reference sequence match", "retrieved_at": "Synthetic demo; no database retrieval",
        "description": "Synthetic example only", "coded_by": ["DEMO_TRANSCRIPT.1:4..21"],
        "sources": [{"record": "Synthetic fixture", "url": "No public database record"}],
        "warnings": ["SYNTHETIC DEMO: do not use these sequences, identifiers, or coordinates for research."],
        "transcripts": [{"accession": "DEMO_TRANSCRIPT.1", "molecule_type": "mrna", "is_transcript": True,
                         "transcript_sequence": "AAAATGGCTGAATTTGGTTAAACC", "gene_ids": ["DEMO_GENE"],
                         "gene_name": "DEMO_GENE", "cds_location": "4..21", "source": "Synthetic fixture",
                         "features": [{"parent": "DEMO_TRANSCRIPT.1", "accession": "DEMO_TRANSCRIPT.1", "feature": "CDS", "part": 1, "start": 4, "end": 21, "strand": "+", "partial": False}],
                         "utrs": [{"feature": "5prime UTR", "start": 1, "end": 3, "strand": "+", "evidence": "Synthetic annotated boundary"}, {"feature": "3prime UTR", "start": 22, "end": 24, "strand": "+", "evidence": "Synthetic annotated boundary"}],
                         "translation": {"cds": "ATGGCTGAATTTGGTTAA", "computed_protein": "MAEFG", "annotated_protein": "MAEFG", "genetic_code": 1, "codon_start": 1, "partial": False, "complete_cds_validated": True, "computed_equals_reference": True, "computed_equals_query": True, "annotated_equals_reference": True, "reference_query_match": "Exact full-length reference sequence match", "notes": []}}],
        "genes": [{"gene_id": "DEMO_GENE", "gene_name": "DEMO_GENE", "description": "Synthetic", "summary": "Synthetic", "loci": [{"gene_id": "DEMO_GENE", "gene_name": "DEMO_GENE", "accession": "DEMO_CONTIG.1", "start": 101, "end": 130, "strand": "+", "assembly_label": "Synthetic", "assembly_accession": "Synthetic", "source": "Synthetic fixture"}]}],
        "genomic": [{"gene_id": "DEMO_GENE", "accession": "DEMO_CONTIG.1", "start": 101, "end": 130, "strand": "+", "assembly_label": "Synthetic", "assembly_accession": "Synthetic", "chromosome": "Synthetic contig", "orientation": "gene 5prime to 3prime", "sequence": "AAAATGGCTGTCCAGGAATTTGGTTAAACC", "features": [
            {"parent": "DEMO_TRANSCRIPT.1", "accession": "DEMO_CONTIG.1", "feature": "exon", "start": 101, "end": 109, "strand": "+", "evidence": "Synthetic"},
            {"parent": "DEMO_TRANSCRIPT.1", "accession": "DEMO_CONTIG.1", "feature": "exon", "start": 116, "end": 130, "strand": "+", "evidence": "Synthetic"},
            {"parent": "DEMO_TRANSCRIPT.1", "accession": "DEMO_CONTIG.1", "feature": "intron", "start": 110, "end": 115, "strand": "+", "evidence": "Synthetic"},
            {"parent": "DEMO_TRANSCRIPT.1", "accession": "DEMO_CONTIG.1", "feature": "CDS", "start": 104, "end": 109, "strand": "+", "evidence": "Synthetic"},
            {"parent": "DEMO_TRANSCRIPT.1", "accession": "DEMO_CONTIG.1", "feature": "CDS", "start": 116, "end": 127, "strand": "+", "evidence": "Synthetic"},
        ]}],
    }
    candidate = {"query_order": 1, "query_id": query.id, "accession": detail["protein_accession"], "organism": detail["organism"], "taxid": None, "title": "Synthetic offline example", "subject_length": 5, "best_hsp_identity_pct": 100, "query_coverage_pct": 100, "subject_coverage_pct": 100, "evalue": 0, "bit_score": 0, "verification": "Exact full-length reference sequence match", "hsps": []}
    job = {"rid": "DEMO", "query": vars(query), "status": "READY", "candidates": [candidate], "database": "Synthetic fixture", "submitted": 0, "last_poll": 0, "hit_limit": 1}
    return [query], [job], {"1:DEMO_PROTEIN.1": detail}
