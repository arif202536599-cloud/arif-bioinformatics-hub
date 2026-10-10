from __future__ import annotations

import hashlib
import io
import json
import re
import sqlite3
import threading
import time
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

import requests
from Bio import SeqIO
from Bio.SeqFeature import Location

from .sequences import analyse_cds, feature_rows, full_sequence_match, inferred_utrs, parse_blast_json, qvalue

EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
BLAST = "https://blast.ncbi.nlm.nih.gov/Blast.cgi"
_LOCK = threading.Lock()


class ServiceError(RuntimeError):
    pass


def utcnow():
    return datetime.now(timezone.utc).isoformat()


class NCBI:
    def __init__(self, cache_dir, email=""):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.email = email.strip()
        self.retrievals = []
        self.session = requests.Session()
        self.session.headers["User-Agent"] = "ProteinCentralDogmaExplorer/1.0"
        self.db = self.cache_dir / "records.sqlite3"
        with sqlite3.connect(self.db) as conn:
            conn.execute("CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, body TEXT, fetched REAL)")
            conn.execute("CREATE TABLE IF NOT EXISTS rate (service TEXT PRIMARY KEY, last REAL)")

    def _pace(self, service, interval):
        with _LOCK, sqlite3.connect(self.db, timeout=30) as conn:
            # Serialize separate CLI/UI processes as well as local threads.
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT last FROM rate WHERE service=?", (service,)).fetchone()
            if row:
                delay = interval - (time.time() - row[0])
                if delay > 0:
                    time.sleep(delay)
            conn.execute("INSERT OR REPLACE INTO rate VALUES (?,?)", (service, time.time()))

    def request(self, endpoint, params, *, post=False, cache=True):
        is_blast = endpoint == BLAST
        params = dict(params)
        params["tool"] = "protein_central_dogma_explorer"
        if self.email:
            params["email"] = self.email
        key = hashlib.sha256((endpoint + json.dumps(params, sort_keys=True)).encode()).hexdigest()
        if cache:
            with sqlite3.connect(self.db) as conn:
                saved = conn.execute("SELECT body,fetched FROM cache WHERE key=?", (key,)).fetchone()
            if saved and time.time() - saved[1] < 7 * 86400:
                self._record_retrieval(endpoint, params, saved[1], True)
                return saved[0]
        for attempt in range(3):
            self._pace("blast" if is_blast else "eutils", 10.1 if is_blast else 0.36)
            try:
                response = self.session.post(endpoint, data=params, timeout=(15, 90)) if post else self.session.get(endpoint, params=params, timeout=(15, 90))
                if response.status_code in (429, 500, 502, 503, 504) and not post and attempt < 2:
                    time.sleep(min(10, 2 ** attempt))
                    continue
                response.raise_for_status()
                body = response.text
                if not is_blast and re.search(r"<ERROR>|<Error>|<html", body, re.I):
                    raise ServiceError("NCBI returned an error or HTML page instead of a record. Try again later or check the accession.")
                fetched = time.time()
                self._record_retrieval(endpoint, params, fetched, False)
                if cache:
                    with sqlite3.connect(self.db) as conn:
                        conn.execute("INSERT OR REPLACE INTO cache VALUES (?,?,?)", (key, body, fetched))
                return body
            except requests.RequestException as exc:
                # Never automatically repeat a BLAST submission: it may have succeeded remotely.
                if post or attempt == 2:
                    raise ServiceError(f"NCBI request failed ({type(exc).__name__}). Check your connection and retry. A timed-out BLAST submission may already exist remotely.") from exc
                time.sleep(2 ** attempt)
        raise ServiceError("NCBI request did not complete.")

    def _record_retrieval(self, endpoint, params, fetched, cached):
        # Retain database fetch dates, without putting contact email in reports.
        self.retrievals.append({"endpoint": endpoint,
                                "parameters": {k: v for k, v in params.items() if k not in ("email", "QUERY")},
                                "database_fetched_at": datetime.fromtimestamp(fetched, timezone.utc).isoformat(),
                                "served_from_cache": cached})

    def xml_record(self, endpoint, params):
        try:
            return ET.fromstring(self.request(endpoint, params))
        except ET.ParseError as exc:
            raise ServiceError("NCBI returned malformed XML; try again later.") from exc

    def genbank(self, db, accession, **extra):
        body = self.request(EUTILS + "efetch.fcgi", {"db": db, "id": accession, "rettype": "gbwithparts" if db == "nuccore" else "gp", "retmode": "text", **extra})
        try:
            return SeqIO.read(io.StringIO(body), "genbank")
        except Exception as exc:
            raise ServiceError(f"Cannot parse {db} record {accession}; record may be missing or unavailable.") from exc

    def linked_ids(self, dbfrom, db, accession, linkname=None):
        params = {"dbfrom": dbfrom, "db": db, "id": accession, "retmode": "xml"}
        if linkname:
            params["linkname"] = linkname
        root = self.xml_record(EUTILS + "elink.fcgi", params)
        ids = []
        for links in root.findall(".//LinkSetDb"):
            if links.findtext("DbTo") == db and (not linkname or links.findtext("LinkName") == linkname):
                ids.extend(n.text for n in links.findall("Link/Id") if n.text)
        return list(dict.fromkeys(ids))

    def nucleotide_metadata(self, accession):
        try:
            data = json.loads(self.request(EUTILS + "esummary.fcgi", {"db": "nuccore", "id": accession, "retmode": "json"}))
        except ValueError as exc:
            raise ServiceError("NCBI returned malformed record metadata; try again later.") from exc
        result = data.get("result", {})
        uids = result.get("uids", [])
        return result.get(uids[0], {}) if uids else {}

    def taxonomy_search(self, term):
        term = term.strip()
        if not term:
            return []
        root = self.xml_record(EUTILS + "esearch.fcgi", {"db": "taxonomy", "term": term, "retmax": 20, "retmode": "xml"})
        ids = [n.text for n in root.findall(".//IdList/Id")]
        if not ids:
            return []
        data = self.xml_record(EUTILS + "efetch.fcgi", {"db": "taxonomy", "id": ",".join(ids), "retmode": "xml"})
        return [{"taxid": int(t.findtext("TaxId")), "name": t.findtext("ScientificName"), "rank": t.findtext("Rank")} for t in data.findall("Taxon")]

    def submit(self, query, database="refseq_protein", taxid=None, hit_limit=30, expect=1e-5):
        params = {"CMD": "Put", "PROGRAM": "blastp", "DATABASE": database,
                  "QUERY": f">query_{query.order}\n{query.sequence}", "HITLIST_SIZE": hit_limit,
                  "EXPECT": expect, "FILTER": "L", "FORMAT_TYPE": "JSON2_S", "SHORT_QUERY_ADJUST": "true"}
        if taxid:
            # Standard organism restriction used by NCBI BLAST's submission interface.
            params["ENTREZ_QUERY"] = f"txid{int(taxid)}[ORGN]"
        body = self.request(BLAST, params, post=True, cache=False)
        rid = re.search(r"RID\s*=\s*([A-Z0-9-]+)", body)
        if not rid:
            raise ServiceError("BLAST did not return a request ID. The service may be unavailable or the input was rejected.")
        job = {"rid": rid.group(1), "submitted": time.time(), "last_poll": time.time(),
               "query": vars(query), "database": database, "taxid": taxid,
               "hit_limit": hit_limit, "expect": expect, "status": "WAITING", "candidates": []}
        self.save_job(job)
        return job

    def save_job(self, job):
        rid = job["rid"]
        if not re.fullmatch(r"[A-Za-z0-9_-]+", rid):
            raise ValueError("Invalid BLAST request ID.")
        target = self.cache_dir / f"job_{rid}.json"
        target.write_text(json.dumps(job, indent=2), encoding="utf-8")

    def saved_jobs(self):
        result = []
        for path in sorted(self.cache_dir.glob("job_*.json"), key=lambda p: p.stat().st_mtime, reverse=True):
            try:
                result.append(json.loads(path.read_text(encoding="utf-8")))
            except (OSError, ValueError):
                continue
        return result[:30]

    def poll(self, job):
        if job["status"] in ("READY", "FAILED", "EXPIRED"):
            return job
        remaining = 60.1 - (time.time() - job["last_poll"])
        if remaining > 0:
            return job
        job["last_poll"] = time.time()
        self.save_job(job)
        body = self.request(BLAST, {"CMD": "Get", "RID": job["rid"], "FORMAT_TYPE": "JSON2_S"}, cache=False)
        if re.search(r"Status\s*=\s*WAITING", body):
            return job
        if re.search(r"Status\s*=\s*(FAILED|UNKNOWN)", body):
            job["status"] = "EXPIRED" if "UNKNOWN" in body else "FAILED"
        else:
            try:
                data = json.loads(body)
            except ValueError as exc:
                raise ServiceError("BLAST returned an unrecognised response. Keep the request ID and check later; no new search was submitted.") from exc
            from .sequences import Query
            job["candidates"] = parse_blast_json(data, Query(**job["query"]))
            job["raw_blast"] = data
            job["completed_at"] = utcnow()
            job["status"] = "READY"
        self.save_job(job)
        return job


def xref_gene_ids(features):
    return list(dict.fromkeys(v.split(":", 1)[1] for f in features for v in f.qualifiers.get("db_xref", []) if v.startswith("GeneID:")))


def protein_summary(record):
    taxids = [v.split(":", 1)[1] for f in record.features for v in f.qualifiers.get("db_xref", []) if v.startswith("taxon:")]
    coded_by = [v for f in record.features for v in f.qualifiers.get("coded_by", [])]
    return {"protein_accession": record.id, "organism": record.annotations.get("organism", "Unavailable"),
            "taxid": taxids[0] if taxids else None,
            "gene_names": list(dict.fromkeys(v for f in record.features for v in f.qualifiers.get("gene", []))),
            "gene_ids": xref_gene_ids(record.features), "coded_by": coded_by,
            "protein_sequence": str(record.seq), "description": record.description}


def parse_gene_xml(xml):
    root = ET.fromstring(xml)
    result = []
    for gene in root.findall(".//Entrezgene"):
        gene_id = gene.findtext("Entrezgene_track-info/Gene-track/Gene-track_geneid")
        refs = gene.find("Entrezgene_gene/Gene-ref")
        name = refs.findtext("Gene-ref_locus", "") if refs is not None else ""
        description = refs.findtext("Gene-ref_desc", "") if refs is not None else ""
        loci = []
        for commentary in gene.findall("Entrezgene_locus/Gene-commentary"):
            type_node = commentary.find("Gene-commentary_type")
            if type_node is None or type_node.attrib.get("value") != "genomic":
                continue
            accession = commentary.findtext("Gene-commentary_accession", "")
            version = commentary.findtext("Gene-commentary_version", "")
            if accession and version:
                accession += "." + version
            for interval in commentary.findall("Gene-commentary_seqs//Seq-interval"):
                start, end = interval.findtext("Seq-interval_from"), interval.findtext("Seq-interval_to")
                if start is None or end is None:
                    continue
                strand_node = interval.find("Seq-interval_strand/Na-strand")
                strand = strand_node.attrib.get("value", "unknown") if strand_node is not None else "unknown"
                loci.append({"gene_id": gene_id, "gene_name": name, "accession": accession,
                             "assembly_label": commentary.findtext("Gene-commentary_label", "Unavailable"),
                             "assembly_accession": "Unavailable unless explicitly linked",
                             "start": int(start) + 1, "end": int(end) + 1,
                             "strand": "+" if strand == "plus" else "-" if strand == "minus" else "unknown",
                             "source": f"https://www.ncbi.nlm.nih.gov/gene/{gene_id}"})
        result.append({"gene_id": gene_id, "gene_name": name, "description": description,
                       "summary": gene.findtext("Entrezgene_summary", ""), "loci": loci})
    return result


def location_refs(expression):
    # Protein records encode explicit nucleotide links as GenBank remote locations.
    loc = Location.fromstring(expression)
    return list(dict.fromkeys(part.ref for part in loc.parts if part.ref))


def retrieve_detail(client, accession, query_sequence, *, include_genomic=False):
    retrieval_start = len(getattr(client, "retrievals", []))
    protein = client.genbank("protein", accession)
    summary = protein_summary(protein)
    detail = {**summary, "query_sequence": query_sequence,
              "match": full_sequence_match(query_sequence, summary["protein_sequence"]),
              "transcripts": [], "genes": [], "genomic": [], "warnings": [], "retrieved_at": utcnow(),
              "sources": [{"record": protein.id, "url": f"https://www.ncbi.nlm.nih.gov/protein/{protein.id}"}]}
    detail["protein_features"] = [{"feature": f.type, "location": str(f.location),
                                    "coordinate_context": "protein residues", "qualifiers": f.qualifiers}
                                   for f in protein.features if f.type not in ("source", "CDS")]
    nucleotide_ids = []
    coded_spans = {}
    for expression in summary["coded_by"]:
        try:
            loc = Location.fromstring(expression)
            nucleotide_ids.extend(location_refs(expression))
            for ref in location_refs(expression):
                parts = [p for p in loc.parts if p.ref == ref]
                coded_spans[ref] = (min(int(p.start) for p in parts) + 1, max(int(p.end) for p in parts))
        except Exception:
            detail["warnings"].append(f"Could not resolve coded_by location: {expression}")
    try:
        nucleotide_ids.extend(client.linked_ids("protein", "nuccore", accession, "protein_nuccore_mrna"))
    except (ServiceError, ET.ParseError) as exc:
        detail["warnings"].append(f"Transcript link retrieval failed: {exc}")
    nucleotide_ids = list(dict.fromkeys(nucleotide_ids))
    if len(nucleotide_ids) > 30:
        detail["warnings"].append("More than 30 linked nucleotide records; this retrieval is capped at 30. Remaining linked IDs are retained in the report.")
    detail["linked_nucleotide_ids"] = nucleotide_ids
    gene_ids = list(summary["gene_ids"])
    seen_cds = set()
    for nuc_id in nucleotide_ids[:30]:
        try:
            metadata = client.nucleotide_metadata(nuc_id) if hasattr(client, "nucleotide_metadata") else {}
            sliced = False
            if int(metadata.get("slen", 0)) > 1000000:
                if nuc_id not in coded_spans:
                    detail["warnings"].append(f"{nuc_id}: nucleotide record exceeds 1 Mb and no explicit coded_by span is available; full download skipped.")
                    continue
                start, end = coded_spans[nuc_id]
                if end - start + 1 > 1000000:
                    detail["warnings"].append(f"{nuc_id}: coded_by region exceeds the 1 Mb retrieval guardrail.")
                    continue
                record = client.genbank("nuccore", nuc_id, seq_start=start, seq_stop=end, strand=1)
                sliced = True
            else:
                record = client.genbank("nuccore", nuc_id)
            matches = [f for f in record.features if f.type == "CDS" and qvalue(f, "protein_id") == protein.id]
            # Versions are intentionally not stripped: mismatched versions are not a proven link.
            if not matches:
                detail["warnings"].append(f"{record.id}: no CDS explicitly links to protein accession {protein.id}.")
                continue
            for cds in matches:
                cds_key = (record.id, str(cds.location))
                if cds_key in seen_cds:
                    continue
                seen_cds.add(cds_key)
                gene_ids.extend(xref_gene_ids([cds]))
                check = analyse_cds(record, cds, summary["protein_sequence"], query_sequence)
                if not check["computed_equals_reference"]:
                    detail["warnings"].append(f"{record.id}: computed CDS translation differs from the full reference protein. Review translation exceptions, processing annotations and reference versions; no correction is invented.")
                molecule = str(record.annotations.get("molecule_type", "")).lower()
                is_transcript = "rna" in molecule and "dna" not in molecule
                transcript = {"accession": record.id, "molecule_type": molecule,
                              "is_transcript": is_transcript,
                              "transcript_sequence": str(record.seq) if is_transcript and not sliced else "",
                              "gene_ids": xref_gene_ids([cds]), "gene_name": qvalue(cds, "gene"),
                              "cds_location": str(cds.location), "translation": check,
                              "features": feature_rows(cds, record.id, record.id),
                              "utrs": inferred_utrs(record, cds) if is_transcript and not sliced else [],
                              "source": f"https://www.ncbi.nlm.nih.gov/nuccore/{record.id}"}
                if not is_transcript:
                    detail["warnings"].append(f"{record.id} is a genomic/DNA record. Its CDS is available, but its complete sequence is not labelled mRNA.")
                if sliced:
                    detail["warnings"].append(f"{record.id}: only the explicitly linked coding region was fetched; a complete transcript is not claimed. Feature positions here are relative to the fetched slice.")
                if is_transcript:
                    for f in record.features:
                        if f.type == "exon":
                            transcript["features"].extend(feature_rows(f, record.id, record.id))
                detail["transcripts"].append(transcript)
                detail["sources"].append({"record": record.id, "url": transcript["source"]})
        except (ServiceError, ValueError, TypeError) as exc:
            detail["warnings"].append(f"Nucleotide record {nuc_id}: {exc}")
    try:
        gene_ids.extend(client.linked_ids("protein", "gene", accession))
    except (ServiceError, ET.ParseError) as exc:
        detail["warnings"].append(f"Gene links unavailable: {exc}")
    gene_ids = list(dict.fromkeys(gene_ids))
    detail["gene_ids"] = gene_ids
    for gene_id in gene_ids:
        try:
            xml = client.request(EUTILS + "efetch.fcgi", {"db": "gene", "id": gene_id, "retmode": "xml"})
            detail["genes"].extend(parse_gene_xml(xml))
            detail["sources"].append({"record": f"GeneID:{gene_id}", "url": f"https://www.ncbi.nlm.nih.gov/gene/{gene_id}"})
        except (ServiceError, ET.ParseError) as exc:
            detail["warnings"].append(f"Gene {gene_id}: {exc}")
    if not gene_ids:
        detail["warnings"].append("No explicitly linked GeneID was found; a genomic locus cannot be assigned from protein similarity alone.")
    if not detail["transcripts"]:
        detail["warnings"].append("No retrievable CDS explicitly linked to this protein was found. Transcript/CDS sequences are unavailable.")
    if include_genomic:
        retrieve_genomic(client, detail)
    detail["record_retrievals"] = getattr(client, "retrievals", [])[retrieval_start:]
    return detail


def retrieve_genomic(client, detail):
    seen = set()
    for gene in detail["genes"]:
        for locus in gene["loci"]:
            key = (locus["accession"], locus["start"], locus["end"], locus["strand"])
            if not locus["accession"] or key in seen:
                continue
            seen.add(key)
            if locus["end"] - locus["start"] + 1 > 1000000:
                detail["warnings"].append(f"{locus['accession']}: locus exceeds 1 Mb; genomic sequence fetch skipped. Coordinates and source are retained.")
                continue
            try:
                # Fetch the forward chromosome slice so all feature positions can be
                # converted back to the assembly coordinates without strand ambiguity.
                record = client.genbank("nuccore", locus["accession"], seq_start=locus["start"], seq_stop=locus["end"], strand=1)
                seq = str(record.seq.reverse_complement() if locus["strand"] == "-" else record.seq)
                orientation = "gene 5prime to 3prime" if locus["strand"] in ("+", "-") else "forward reference; gene orientation unavailable"
                if locus["strand"] not in ("+", "-"):
                    detail["warnings"].append(f"{locus['accession']}: gene strand is unavailable; genomic sequence is in forward reference orientation.")
                features = []
                expected_transcripts = {t["accession"] for t in detail["transcripts"] if t["is_transcript"]}
                for feature in record.features:
                    same_gene = locus["gene_id"] in xref_gene_ids([feature])
                    same_product = qvalue(feature, "protein_id") == detail["protein_accession"]
                    same_transcript = qvalue(feature, "transcript_id") in expected_transcripts
                    if not (same_gene or same_product or same_transcript):
                        continue
                    if feature.type not in ("gene", "mRNA", "CDS", "exon", "intron", "5'UTR", "3'UTR"):
                        continue
                    parent = qvalue(feature, "transcript_id") or qvalue(feature, "protein_id") or locus["gene_id"]
                    rows = feature_rows(feature, parent, locus["accession"])
                    for row in rows:
                        row["start"] += locus["start"] - 1
                        row["end"] += locus["start"] - 1
                        row["evidence"] = "Annotated genomic feature"
                    features.extend(rows)
                    if feature.type == "mRNA":
                        # Gaps between exons on this transcript's genomic location are
                        # inferred introns. Do not combine different isoforms.
                        parts = sorted(feature.location.parts, key=lambda p: int(p.start))
                        for left, right in zip(parts, parts[1:]):
                            if int(right.start) > int(left.end):
                                features.append({"parent": parent, "accession": locus["accession"], "feature": "intron",
                                                 "start": int(left.end) + locus["start"], "end": int(right.start) + locus["start"] - 1,
                                                 "strand": rows[0]["strand"], "evidence": "Inferred from this annotated mRNA's exon gaps"})
                source = next((f for f in record.features if f.type == "source"), None)
                chromosome = qvalue(source, "chromosome") if source else ""
                assemblies = list(dict.fromkeys(x for x in record.dbxrefs if x.startswith("Assembly:")))
                detail["genomic"].append({**locus, "sequence": seq, "orientation": orientation,
                                          "chromosome": chromosome or "Unavailable; contig accession shown",
                                          "assembly_accession": "; ".join(assemblies) or locus["assembly_accession"],
                                          "features": features})
                detail["sources"].append({"record": f"{locus['accession']}:{locus['start']}-{locus['end']}",
                                          "url": f"https://www.ncbi.nlm.nih.gov/nuccore/{locus['accession']}?from={locus['start']}&to={locus['end']}"})
            except (ServiceError, ValueError) as exc:
                detail["warnings"].append(f"Genomic slice {locus['accession']}: {exc}")
    detail["retrieved_at"] = utcnow()
    return detail
