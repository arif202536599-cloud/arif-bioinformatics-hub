from __future__ import annotations

import io
import re
import warnings
from dataclasses import dataclass

from Bio import SeqIO
from Bio.Seq import Seq
from Bio.SeqFeature import ExactPosition, Location
from Bio.SeqUtils import seq1


@dataclass
class Query:
    order: int
    id: str
    description: str
    sequence: str


def parse_queries(text: str) -> list[Query]:
    text = text.lstrip("\ufeff").strip()
    if not text:
        raise ValueError("Paste a protein sequence or upload a FASTA file first.")
    if ">" in text and not text.startswith(">"):
        raise ValueError("FASTA must start with a > header. Remove text preceding the first header.")
    if not text.startswith(">"):
        text = ">query_1\n" + text
    records = list(SeqIO.parse(io.StringIO(text), "fasta"))
    if not records:
        raise ValueError("No FASTA records were found.")
    result = []
    allowed = set("ACDEFGHIKLMNPQRSTVWYBXZJUO")
    for order, record in enumerate(records, 1):
        sequence = re.sub(r"\s+", "", str(record.seq)).upper()
        # A terminal stop marker is accepted as FASTA formatting, not as a residue.
        sequence = sequence.removesuffix("*")
        if not sequence:
            raise ValueError(f"Entry {order} ({record.id}) has an empty sequence.")
        illegal = set(sequence) - allowed
        if illegal:
            raise ValueError(f"Entry {order}: invalid protein characters {sorted(illegal)}. No gaps, numbers, or internal stops are accepted.")
        if len(sequence) > 10000:
            raise ValueError(f"Entry {order} exceeds the 10,000-residue service guardrail.")
        result.append(Query(order, record.id, record.description, sequence))
    return result


def full_sequence_match(query: str, reference: str) -> str:
    q, r = query.upper(), reference.upper().removesuffix("*")
    if q == r:
        if set(q) & set("XBZJ"):
            return "Identical strings; ambiguous residues prevent a definitive exact match"
        return "Exact full-length reference sequence match"
    if q and q in r:
        return "Exact fragment of reference; not a full-length match"
    return "Similar/different sequence; not an exact full-length match"


def union_length(intervals):
    """Union of BLAST's 1-based inclusive intervals, without double-counting HSPs."""
    merged = []
    for a, b in sorted((min(a, b), max(a, b)) for a, b in intervals):
        if merged and a <= merged[-1][1] + 1:
            merged[-1][1] = max(b, merged[-1][1])
        else:
            merged.append([a, b])
    return sum(b - a + 1 for a, b in merged)


def parse_blast_json(data: dict, query: Query) -> list[dict]:
    if not isinstance(data, dict) or "BlastOutput2" not in data:
        raise ValueError("BLAST response has no supported BlastOutput2 report; it cannot be labelled a completed no-hit search.")
    reports = data.get("BlastOutput2", [])
    if isinstance(reports, dict):
        reports = [reports]
    rows = []
    for item in reports:
        search = item.get("report", {}).get("results", {}).get("search", {})
        if search.get("error"):
            raise ValueError(str(search["error"]))
        qlen = search.get("query_len", len(query.sequence))
        for hit in search.get("hits", []):
            hsps = hit.get("hsps", [])
            if not hsps:
                continue
            best = max(hsps, key=lambda h: h.get("bit_score", 0))
            qcoverage = min(100.0, 100 * union_length([(h["query_from"], h["query_to"]) for h in hsps]) / qlen)
            slen = hit.get("len", 0)
            scoverage = min(100.0, 100 * union_length([(h["hit_from"], h["hit_to"]) for h in hsps]) / slen) if slen else None
            for desc in hit.get("description", []):
                accession = desc.get("accession", "")
                if not accession:
                    parts = desc.get("id", "").split("|")
                    accession = next((p for p in parts if re.match(r"[A-Z]+_?\d+\.\d+$", p)), "")
                rows.append({
                    "query_order": query.order, "query_id": query.id,
                    "accession": accession, "title": desc.get("title", ""),
                    "organism": desc.get("sciname", "Unavailable in search response"),
                    "taxid": desc.get("taxid"), "subject_length": slen,
                    "best_hsp_identity_pct": round(100 * best.get("identity", 0) / max(best.get("align_len", 1), 1), 3),
                    "query_coverage_pct": round(qcoverage, 3),
                    "subject_coverage_pct": round(scoverage, 3) if scoverage is not None else None,
                    "evalue": best.get("evalue"), "bit_score": best.get("bit_score"),
                    "verification": "Not verified against complete reference sequence",
                    "hsps": hsps,
                })
    return rows


def qvalue(feature, name, default=""):
    return feature.qualifiers.get(name, [default])[0]


def feature_rows(feature, parent, accession, kind=None):
    return [{"parent": parent, "accession": accession,
             "feature": kind or feature.type, "part": i,
             "start": int(part.start) + 1, "end": int(part.end),
             "strand": "+" if part.strand == 1 else "-" if part.strand == -1 else "unknown",
             "location": str(part), "partial": not isinstance(part.start, ExactPosition) or not isinstance(part.end, ExactPosition)}
            for i, part in enumerate(feature.location.parts, 1)]


def analyse_cds(record, feature, reference: str, query: str):
    dna = str(feature.extract(record.seq)).upper()
    offset = int(qvalue(feature, "codon_start", "1")) - 1
    table = int(qvalue(feature, "transl_table", "1"))
    coding = dna[offset:]
    notes = []
    partial = any(not isinstance(p.start, ExactPosition) or not isinstance(p.end, ExactPosition) for p in feature.location.parts)
    if partial:
        notes.append("Partial/fuzzy CDS boundaries are annotated.")
    if offset:
        notes.append(f"codon_start={offset + 1}: first {offset} nucleotide(s) are excluded from translation.")
    if len(coding) % 3:
        notes.append("Incomplete terminal codon; excluded from computed translation.")
    usable = coding[:len(coding) - len(coding) % 3]
    strict = False
    try:
        translated = str(Seq(usable).translate(table=table, cds=True))
        strict = True
    except Exception:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            translated = str(Seq(usable).translate(table=table))
        notes.append("CDS does not pass complete-CDS start/stop validation; basic translation shown.")
    exceptions = feature.qualifiers.get("transl_except", [])
    exception_notes = feature.qualifiers.get("exception", [])
    applied, unresolved = [], []
    # Iterating the feature location follows the same strand and exon order
    # as feature.extract(), including codons spanning an exon junction.
    positions = list(feature.location)[offset:offset + len(usable)]
    residues = list(translated)
    for exception in exceptions:
        try:
            match = re.fullmatch(r"\(pos:(.+),aa:([^,()]+)\)", exception.strip())
            if not match:
                raise ValueError("unrecognised syntax")
            location = Location.fromstring(match.group(1))
            if any(p.ref or not isinstance(p.start, ExactPosition) or not isinstance(p.end, ExactPosition) for p in location.parts):
                raise ValueError("remote or uncertain exception position")
            if any(positions.count(p) != 1 for p in location):
                raise ValueError("position is absent or maps to multiple CDS residues")
            indexes = sorted(positions.index(p) for p in location)
            if len(indexes) != 3 or indexes != list(range(indexes[0], indexes[0] + 3)) or indexes[0] % 3:
                raise ValueError("position does not map to one complete CDS codon")
            amino = match.group(2).strip()
            residue = {"sec": "U", "pyl": "O", "term": "*"}.get(amino.lower())
            if residue is None:
                residue = seq1(amino, undef_code="?")
            if len(residue) != 1 or residue == "?":
                raise ValueError("unsupported amino-acid annotation")
            codon = indexes[0] // 3
            if codon >= len(residues):
                raise ValueError("exception is outside translated residues")
            residues[codon] = residue
            applied.append({"annotation": exception, "protein_position": codon + 1, "residue": residue})
        except (ValueError, TypeError) as exc:
            unresolved.append(exception)
            notes.append(f"Unresolved transl_except {exception}: {exc}; no recoding was invented.")
    translated = "".join(residues).removesuffix("*")
    if applied:
        notes.append("Applied explicit codon-position transl_except annotations; see translation_exceptions_applied.")
    if exception_notes:
        notes.append("Processing/translation exception annotated: " + "; ".join(exception_notes) + ". This text alone cannot define additional recoding; annotated translation is shown separately.")
    if "*" in translated:
        notes.append("Computed translation contains an internal stop.")
    annotated = qvalue(feature, "translation")
    return {"cds": dna, "computed_protein": translated, "annotated_protein": annotated,
            "genetic_code": table, "codon_start": offset + 1, "partial": partial,
            "translation_exceptions_applied": applied, "translation_exceptions_unresolved": unresolved,
            "complete_cds_validated": strict and not partial and not exceptions and not exception_notes and len(coding) % 3 == 0,
            "computed_equals_reference": translated == reference,
            "computed_equals_query": translated == query,
            "annotated_equals_reference": annotated == reference if annotated else None,
            "reference_query_match": full_sequence_match(query, reference),
            "notes": notes}


def inferred_utrs(record, cds_feature):
    """UTRs inferred from a *single chosen annotated transcript CDS*, never genomic spans."""
    parts = cds_feature.location.parts
    if any(p.strand != 1 for p in parts):
        return []
    start = min(int(p.start) for p in parts)
    end = max(int(p.end) for p in parts)
    result = []
    if start and isinstance(parts[0].start, ExactPosition):
        result.append({"feature": "5prime UTR", "start": 1, "end": start, "strand": "+", "evidence": "Inferred from transcript and selected CDS boundaries"})
    if end < len(record.seq) and isinstance(parts[-1].end, ExactPosition):
        result.append({"feature": "3prime UTR", "start": end + 1, "end": len(record.seq), "strand": "+", "evidence": "Inferred from transcript and selected CDS boundaries"})
    return result
