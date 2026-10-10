import io
import json

import pytest
from Bio.Seq import Seq
from Bio.SeqFeature import SeqFeature, SimpleLocation, CompoundLocation, BeforePosition
from Bio.SeqRecord import SeqRecord

from explorer.sequences import parse_queries, full_sequence_match, union_length, parse_blast_json, analyse_cds, inferred_utrs
from explorer.ncbi import location_refs, parse_gene_xml, retrieve_detail, retrieve_genomic, ServiceError


def test_input_order_duplicates_and_stop():
    queries = parse_queries(">same\nmaefg*\n>same\nMLP\n")
    assert [q.id for q in queries] == ["same", "same"]
    assert [q.order for q in queries] == [1, 2]
    assert queries[0].sequence == "MAEFG"


@pytest.mark.parametrize("text", ["", ">empty\n", "MA12EF", "MA-EF", "MA*EF", "note\n>x\nMAEF"])
def test_invalid_inputs(text):
    with pytest.raises(ValueError):
        parse_queries(text)


def test_exact_match_requires_entire_sequence():
    assert full_sequence_match("MAEFG", "MAEFG").startswith("Exact full-length")
    assert "fragment" in full_sequence_match("AEF", "MAEFG")
    assert "not an exact" in full_sequence_match("MAEYG", "MAEFG")
    assert "ambiguous" in full_sequence_match("MAX", "MAX")


def test_coverage_does_not_double_count_overlapping_hsps():
    assert union_length([(1, 10), (5, 15), (20, 21)]) == 17
    query = parse_queries("M" * 20)[0]
    hsp = {"query_from": 1, "query_to": 10, "hit_from": 1, "hit_to": 10, "identity": 10, "align_len": 10, "bit_score": 12, "evalue": 1e-8}
    hsp2 = {**hsp, "query_from": 5, "query_to": 15, "hit_from": 5, "hit_to": 15, "identity": 11, "align_len": 11, "bit_score": 13}
    hit = {"len": 20, "description": [{"accession": "A.1", "sciname": "Organism A"}, {"accession": "B.1", "sciname": "Organism B"}], "hsps": [hsp, hsp2]}
    rows = parse_blast_json({"BlastOutput2": [{"report": {"results": {"search": {"query_len": 20, "hits": [hit]}}}}]}, query)
    assert [r["accession"] for r in rows] == ["A.1", "B.1"]
    assert rows[0]["query_coverage_pct"] == 75
    assert rows[0]["subject_coverage_pct"] == 75
    assert rows[0]["verification"].startswith("Not verified")


def cds_record(sequence="AAAATGGCTGAATTTGGTTAAACC"):
    record = SeqRecord(Seq(sequence), id="NM_DEMO.1", annotations={"molecule_type": "mRNA"})
    feature = SeqFeature(SimpleLocation(3, 21, strand=1), type="CDS", qualifiers={"protein_id": ["NP_DEMO.1"], "translation": ["MAEFG"], "db_xref": ["GeneID:123"]})
    record.features = [feature]
    return record, feature


def test_cds_translation_and_utr_boundaries():
    record, feature = cds_record()
    result = analyse_cds(record, feature, "MAEFG", "MAEFG")
    assert result["computed_equals_reference"]
    assert result["complete_cds_validated"]
    assert [(u["start"], u["end"]) for u in inferred_utrs(record, feature)] == [(1, 3), (22, 24)]


def test_negative_strand_spliced_cds():
    # Biological CDS consists of the later reverse-complement exon followed
    # by the earlier reverse-complement exon.
    cds = "ATGGCTGAATTTGGTTAA"
    exon1, exon2 = cds[:6], cds[6:]
    genome = str(Seq(exon2).reverse_complement()) + "CCCC" + str(Seq(exon1).reverse_complement())
    record = SeqRecord(Seq(genome), id="GENOME.1")
    location = CompoundLocation([SimpleLocation(16, 22, strand=-1), SimpleLocation(0, 12, strand=-1)], operator="join")
    feature = SeqFeature(location, type="CDS")
    result = analyse_cds(record, feature, "MAEFG", "MAEFG")
    assert result["cds"] == cds
    assert result["computed_protein"] == "MAEFG"


def test_genetic_code_and_translation_exception_are_visible():
    record = SeqRecord(Seq("ATGTGATAA"), id="MITO.1")
    feature = SeqFeature(SimpleLocation(0, 9, strand=1), type="CDS", qualifiers={"transl_table": ["2"]})
    result = analyse_cds(record, feature, "MW", "MW")
    assert result["computed_protein"] == "MW"
    feature.qualifiers["transl_except"] = ["(pos:4..6,aa:Sec)"]
    result = analyse_cds(record, feature, "MU", "MU")
    assert not result["complete_cds_validated"]
    assert result["computed_protein"] == "MU"
    assert result["computed_equals_reference"]
    assert result["translation_exceptions_applied"][0]["protein_position"] == 2


def test_selenocysteine_and_unresolved_exception():
    record = SeqRecord(Seq("ATGTGATAA"), id="SEC.1")
    feature = SeqFeature(SimpleLocation(0, 9, strand=1), type="CDS", qualifiers={"transl_except": ["(pos:4..6,aa:Sec)"]})
    result = analyse_cds(record, feature, "MU", "MU")
    assert result["computed_protein"] == "MU"
    feature.qualifiers["transl_except"] = ["(pos:5..7,aa:Sec)"]
    result = analyse_cds(record, feature, "MU", "MU")
    assert not result["computed_equals_reference"]
    assert result["translation_exceptions_unresolved"]


def test_negative_strand_translation_exception():
    record = SeqRecord(Seq("TTATCACAT"), id="SEC_MINUS.1")
    feature = SeqFeature(SimpleLocation(0, 9, strand=-1), type="CDS", qualifiers={"transl_except": ["(pos:complement(4..6),aa:Sec)"]})
    assert analyse_cds(record, feature, "MU", "MU")["computed_protein"] == "MU"


def test_partial_cds_and_codon_start():
    record = SeqRecord(Seq("AATGGCTTAA"), id="PARTIAL.1")
    feature = SeqFeature(SimpleLocation(BeforePosition(0), 10, strand=1), type="CDS", qualifiers={"codon_start": ["2"]})
    result = analyse_cds(record, feature, "MA", "MA")
    assert result["computed_protein"] == "MA"
    assert result["partial"]
    assert not result["complete_cds_validated"]


def test_trailing_incomplete_codon_does_not_pass_complete_cds_check():
    record = SeqRecord(Seq("ATGGCTTAAA"), id="INCOMPLETE.1")
    feature = SeqFeature(SimpleLocation(0, 10, strand=1), type="CDS")
    result = analyse_cds(record, feature, "MA", "MA")
    assert result["computed_protein"] == "MA"
    assert not result["complete_cds_validated"]


def test_unknown_genomic_strand_does_not_claim_gene_orientation():
    record = SeqRecord(Seq("ATG"), id="NC_UNKNOWN.1", features=[])
    client = MockClient()
    client.genbank = lambda *args, **kwargs: record
    detail = {"genes": [{"loci": [{"gene_id": "123", "accession": "NC_UNKNOWN.1", "start": 1, "end": 3, "strand": "unknown", "assembly_accession": "Unavailable"}]}],
              "genomic": [], "transcripts": [], "protein_accession": "NP_DEMO.1", "warnings": [], "sources": []}
    retrieve_genomic(client, detail)
    assert detail["genomic"][0]["orientation"] == "forward reference; gene orientation unavailable"
    assert detail["warnings"]


def test_remote_coded_by_locations():
    assert location_refs("complement(join(NC_TEST.1:2..6,NC_TEST.1:9..12))") == ["NC_TEST.1"]


GENE_XML = '''<Entrezgene-Set><Entrezgene>
<Entrezgene_track-info><Gene-track><Gene-track_geneid>123</Gene-track_geneid></Gene-track></Entrezgene_track-info>
<Entrezgene_gene><Gene-ref><Gene-ref_locus>DEMO</Gene-ref_locus></Gene-ref></Entrezgene_gene>
<Entrezgene_locus><Gene-commentary><Gene-commentary_type value="genomic">1</Gene-commentary_type>
<Gene-commentary_label>Assembly label</Gene-commentary_label><Gene-commentary_accession>NC_TEST</Gene-commentary_accession><Gene-commentary_version>2</Gene-commentary_version>
<Gene-commentary_seqs><Seq-loc><Seq-loc_int><Seq-interval><Seq-interval_from>100</Seq-interval_from><Seq-interval_to>120</Seq-interval_to><Seq-interval_strand><Na-strand value="minus">2</Na-strand></Seq-interval_strand></Seq-interval></Seq-loc_int></Seq-loc></Gene-commentary_seqs>
</Gene-commentary></Entrezgene_locus></Entrezgene></Entrezgene-Set>'''


def test_gene_coordinates_are_one_based_and_versioned():
    locus = parse_gene_xml(GENE_XML)[0]["loci"][0]
    assert (locus["start"], locus["end"], locus["strand"]) == (101, 121, "-")
    assert locus["accession"] == "NC_TEST.2"
    assert locus["assembly_label"] == "Assembly label"


class MockClient:
    def __init__(self, missing=False, genomic_transcript=False):
        self.missing = missing
        self.genomic_transcript = genomic_transcript

    def genbank(self, db, accession, **kwargs):
        if db == "protein":
            p = SeqRecord(Seq("MAEFG"), id="NP_DEMO.1", annotations={"organism": "Mock species"})
            p.features = [SeqFeature(SimpleLocation(0, 5), type="CDS", qualifiers={"coded_by": ["NM_DEMO.1:4..21"], "db_xref": ["GeneID:123"]})]
            return p
        if self.missing:
            raise ServiceError("Record missing")
        record, feature = cds_record()
        if self.genomic_transcript:
            record.annotations["molecule_type"] = "DNA"
        # Same protein ID occurs in an alternative transcript link: preserve both.
        if accession == "SECOND":
            record.id = "NM_ALTERNATIVE.1"
        return record

    def linked_ids(self, dbfrom, db, accession, linkname=None):
        return ["SECOND"] if db == "nuccore" else ["123"]

    def request(self, endpoint, params):
        return GENE_XML


def test_preserves_explicit_alternative_transcripts():
    detail = retrieve_detail(MockClient(), "NP_DEMO.1", "MAEFG")
    assert len(detail["transcripts"]) == 2
    assert detail["gene_ids"] == ["123"]
    assert all(t["translation"]["computed_equals_reference"] for t in detail["transcripts"])


def test_missing_transcripts_are_not_fabricated():
    detail = retrieve_detail(MockClient(missing=True), "NP_DEMO.1", "MAEFG")
    assert detail["transcripts"] == []
    assert detail["warnings"]


def test_dna_record_is_not_labelled_as_mrna():
    detail = retrieve_detail(MockClient(genomic_transcript=True), "NP_DEMO.1", "MAEFG")
    assert not detail["transcripts"][0]["is_transcript"]
    assert not detail["transcripts"][0]["transcript_sequence"]
