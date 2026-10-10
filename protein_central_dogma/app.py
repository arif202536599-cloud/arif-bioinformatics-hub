from __future__ import annotations

import json
import time
from pathlib import Path

import streamlit as st

from explorer.demo import demo_data
from explorer.ncbi import NCBI, ServiceError, protein_summary, retrieve_detail, retrieve_genomic
from explorer.reports import bundle, fasta_files, structure_figure, workbook
from explorer.sequences import Query, full_sequence_match, parse_queries

ROOT = Path(__file__).resolve().parent
st.set_page_config(page_title="Protein-to-Central-Dogma Explorer", page_icon="🧬", layout="wide")
st.markdown("""<style>
.stApp {background: #f6f9fb;}
h1,h2,h3 {color:#123d50;}
.stButton>button[kind=primary] {background:#087f83; border-color:#087f83;}
[data-testid=stMetric] {background:white;border:1px solid #dce8ed;border-radius:12px;padding:15px;}
</style>""", unsafe_allow_html=True)
st.title("Protein-to-Central-Dogma Explorer")
st.markdown("**Start with a protein. Explore the reference genes, transcripts, and coding sequences that can encode it.**")
st.caption("Reference mapping does not establish the original source of your sample. Identical proteins may have multiple genes or organisms. RNA-seq expression requires separate experimental data.")

for key, value in {"queries": [], "jobs": [], "details": {}, "taxonomy": [], "demo": False}.items():
    if key not in st.session_state:
        st.session_state[key] = value

with st.sidebar:
    st.header("Search settings")
    database_label = st.selectbox("Protein database", ["RefSeq proteins — annotated reference records", "NCBI nr — wider protein coverage"])
    database = "refseq_protein" if database_label.startswith("RefSeq") else "nr"
    hit_limit = st.slider("Returned database hits per query", 10, 100, 30, step=10)
    st.caption("The hit limit caps the search. All returned candidate accessions are kept, including tied hits. Wider searches may contain records without gene links.")
    expect = st.selectbox("E-value cutoff", [1e-5, 1e-3, 0.1, 10.0], format_func=lambda x: f"{x:g}")
    email = st.text_input("NCBI contact email (optional)")
    st.caption("Sequences are sent to NCBI when you submit a live search. Responses and search history are cached locally for seven days; saved jobs remain until deleted.")
    if st.button("Open offline demonstration", width="stretch"):
        queries, jobs, details = demo_data()
        st.session_state.update(queries=queries, jobs=jobs, details=details, demo=True)
    if st.button("Clear this session", width="stretch"):
        st.session_state.update(queries=[], jobs=[], details={}, demo=False)
    st.markdown("[NCBI BLAST](https://blast.ncbi.nlm.nih.gov/) · [NCBI Gene](https://www.ncbi.nlm.nih.gov/gene/)")

client = NCBI(ROOT / ".cache", email=email)

st.subheader("1 · Add your proteins")
mode = st.radio("Input method", ["Paste sequence / FASTA", "Upload protein FASTA"], horizontal=True)
input_text = ""
if mode.startswith("Paste"):
    input_text = st.text_area("Protein sequence or FASTA", height=170, placeholder=">my_protein\nM...", key="protein_text")
else:
    uploaded = st.file_uploader("Protein FASTA", type=["fasta", "fa", "faa", "txt"], max_upload_size=10)
    if uploaded:
        try:
            input_text = uploaded.getvalue().decode("utf-8-sig")
        except UnicodeDecodeError:
            st.error("Upload a UTF-8 text FASTA, not a Word document or compressed file.")

parsed = []
if input_text:
    try:
        parsed = parse_queries(input_text)
        st.caption(f"{len(parsed)} protein(s) · input order preserved")
        st.dataframe([{"Order": q.order, "ID": q.id, "Residues": len(q.sequence)} for q in parsed], hide_index=True, width="stretch")
        if any(set(q.sequence) <= set("ACGTN") for q in parsed):
            st.warning("Some entries use only A/C/G/T/N. Confirm that these are amino-acid sequences rather than nucleotide sequences.")
        if len({q.id for q in parsed}) < len(parsed):
            st.info("Duplicate IDs were found. Entries remain separate and are identified by input order.")
    except ValueError as exc:
        st.error(str(exc))

st.subheader("2 · Choose where to search")
organism_mode = st.radio("Organism", ["Auto-detect / Search across organisms", "Specify organism"], horizontal=True)
selected_taxid = None
if organism_mode == "Specify organism":
    term = st.text_input("Search scientific/common name or taxonomy ID", placeholder="Enter any organism or taxonomic group")
    if st.button("Find organisms"):
        try:
            with st.spinner("Searching NCBI Taxonomy…"):
                st.session_state.taxonomy = client.taxonomy_search(term)
            if not st.session_state.taxonomy:
                st.info("No taxonomy matches. Try a scientific name or taxonomy ID.")
        except (ServiceError, ValueError) as exc:
            st.error(str(exc))
    if st.session_state.taxonomy:
        selected = st.selectbox("Matching organisms / groups", st.session_state.taxonomy, format_func=lambda t: f"{t['name']} · taxid {t['taxid']} · {t['rank']}")
        selected_taxid = selected["taxid"]
else:
    st.caption("Search without an organism restriction. Organisms are reported from database matches; sequence similarity alone does not prove taxonomy.")

selection = []
if parsed:
    selection = st.multiselect("Queries to submit in this batch (maximum 5)", list(range(len(parsed))),
                               default=list(range(min(5, len(parsed)))), format_func=lambda i: f"{parsed[i].order} · {parsed[i].id}")
    if len(parsed) > 5:
        st.info("All input proteins are retained. Submit up to five at a time; choose the remaining entries in later batches. For large analyses, use local BLAST instead of repeated remote searches.")
if st.button("Analyse — submit protein search", type="primary", disabled=not parsed):
    if not selection or len(selection) > 5:
        st.error("Select between one and five proteins for this remote-search batch.")
    elif organism_mode == "Specify organism" and selected_taxid is None:
        st.error("Find and select an organism before submitting.")
    else:
        st.session_state.demo = False
        if st.session_state.queries and [(q.id, q.sequence) for q in st.session_state.queries] != [(q.id, q.sequence) for q in parsed]:
            st.session_state.update(jobs=[], details={})
        st.session_state.queries = parsed
        progress = st.progress(0, text="Submitting searches…")
        for n, i in enumerate(selection):
            q = parsed[i]
            duplicate = next((j for j in st.session_state.jobs if j.get("query", {}).get("order") == q.order and j.get("query", {}).get("sequence") == q.sequence and j.get("database") == database and j.get("taxid") == selected_taxid and j.get("expect") == expect and j.get("hit_limit") == hit_limit and j["status"] not in ("FAILED", "EXPIRED")), None)
            if duplicate:
                st.info(f"Query {q.order}: existing search {duplicate['rid']} retained; no duplicate submission.")
            else:
                try:
                    job = client.submit(q, database, selected_taxid, hit_limit, expect)
                    st.session_state.jobs.append(job)
                    st.success(f"Query {q.order}: submitted · request ID {job['rid']}")
                except ServiceError as exc:
                    st.error(f"Query {q.order}: {exc}")
            progress.progress((n + 1) / len(selection))
        st.info("NCBI searches can take several minutes. Check results below; each request is polled no more than once a minute.")

with st.expander("Resume a saved search"):
    saved = client.saved_jobs()
    if saved:
        chosen = st.selectbox("Saved requests", saved, format_func=lambda j: f"{j['rid']} · {j['query']['id']} · {j['status']}")
        if st.button("Restore saved request"):
            st.session_state.update(queries=[Query(**chosen["query"])], jobs=[chosen], details={}, demo=False)
    else:
        st.caption("Submitted search IDs will appear here. Requests expire on NCBI; cached completed results remain available.")

if st.session_state.demo:
    st.warning("OFFLINE SYNTHETIC DEMO · The identifiers, sequences, and coordinates below are examples, not real database records.")

jobs = st.session_state.jobs
if jobs:
    st.subheader("3 · Search progress and candidates")
    if st.button("Check search results", disabled=st.session_state.demo):
        progress = st.progress(0)
        for i, job in enumerate(jobs):
            try:
                client.poll(job)
            except (ServiceError, ValueError) as exc:
                st.error(f"{job['rid']}: {exc}")
            progress.progress((i + 1) / len(jobs))
    st.dataframe([{"Query order": j["query"]["order"], "Query": j["query"]["id"], "Request ID": j["rid"], "Status": j["status"], "Candidates": len(j["candidates"]), "Seconds until next allowed check": max(0, round(61 - (time.time() - j.get("last_poll", 0)))) if j["status"] == "WAITING" else 0} for j in jobs], hide_index=True, width="stretch")
    candidates = [(j, c) for j in jobs for c in j.get("candidates", [])]
    if any(j["status"] == "READY" and not j["candidates"] for j in jobs):
        st.info("A completed query has no returned hits at the selected cutoff. This does not prove that no coding gene exists.")
    if candidates:
        st.dataframe([{k: v for k, v in c.items() if k != "hsps"} for _, c in candidates], hide_index=True, width="stretch")
        st.caption("Identity is for the best scoring HSP. Query/subject coverage combines HSP intervals without double-counting overlaps. An alignment candidate is not yet a verified full-sequence match.")
        if st.button("Verify complete reference sequences for returned candidates", disabled=st.session_state.demo):
            progress = st.progress(0)
            for i, (job, candidate) in enumerate(candidates):
                try:
                    record = client.genbank("protein", candidate["accession"])
                    summary = protein_summary(record)
                    candidate["verification"] = full_sequence_match(job["query"]["sequence"], str(record.seq))
                    candidate["organism"] = summary["organism"]
                    candidate["taxid"] = summary["taxid"]
                    candidate["reference_accession_version"] = record.id
                except ServiceError as exc:
                    candidate["verification"] = f"Verification unavailable: {exc}"
                progress.progress((i + 1) / len(candidates))
            for job in jobs:
                client.save_job(job)
            st.rerun()
        selected_index = st.selectbox("Select a candidate to retrieve linked records", range(len(candidates)),
                                     format_func=lambda i: f"Query {candidates[i][1]['query_order']} · {candidates[i][1]['accession']} · {candidates[i][1]['organism']}")
        job, candidate = candidates[selected_index]
        key = f"{candidate['query_order']}:{candidate['accession']}"
        include_genomic = st.checkbox("Retrieve linked genomic DNA and annotated gene structure", value=True)
        if st.button("Retrieve gene, transcript, CDS and protein", type="primary", disabled=st.session_state.demo):
            try:
                with st.spinner("Following explicit database links and checking translation…"):
                    detail = retrieve_detail(client, candidate["accession"], job["query"]["sequence"], include_genomic=include_genomic)
                    st.session_state.details[key] = detail
                    candidate["verification"] = detail["match"]
                    candidate["organism"] = detail["organism"]
                    candidate["taxid"] = detail["taxid"]
                    client.save_job(job)
            except (ServiceError, ValueError) as exc:
                st.error(str(exc))
        with st.expander("Protein search alignment"):
            for h in candidate.get("hsps", []):
                st.caption(f"Query {h['query_from']}–{h['query_to']} · subject {h['hit_from']}–{h['hit_to']} · E-value {h.get('evalue')} · bit score {h.get('bit_score')}")
                st.code(f"Query    {h.get('qseq', '')}\n         {h.get('midline', '')}\nSubject  {h.get('hseq', '')}", language=None)

        detail = st.session_state.details.get(key)
        if detail:
            st.subheader("4 · Reference-based central dogma")
            st.markdown("**Genomic DNA → transcript/mRNA → translation of its CDS → protein**")
            columns = st.columns(3)
            columns[0].metric("Reference protein", detail["protein_accession"])
            columns[1].metric("Protein length", f"{len(detail['protein_sequence'])} aa")
            columns[2].metric("Explicitly linked genes", len(detail["gene_ids"]))
            st.write(f"**Organism:** {detail['organism']} · **Taxonomy ID:** {detail.get('taxid') or 'Unavailable'}")
            st.info(detail["match"])
            for warning in detail["warnings"]:
                st.warning(warning)
            tabs = st.tabs(["Gene & location", "Transcript & CDS", "Protein & translation", "Structure", "Evidence"])
            with tabs[0]:
                if detail["genes"]:
                    st.dataframe([{k: v for k, v in g.items() if k != "loci"} for g in detail["genes"]], hide_index=True, width="stretch")
                loci = [l for gene in detail["genes"] for l in gene["loci"]]
                if loci:
                    st.dataframe(loci, hide_index=True, width="stretch")
                else:
                    st.info("Gene coordinates are unavailable in explicitly linked records.")
                for genome in detail.get("genomic", []):
                    st.write(f"**{genome['accession']}:{genome['start']}–{genome['end']} · strand {genome['strand']}**")
                    st.caption(f"Assembly: {genome['assembly_label']} · accession: {genome['assembly_accession']} · chromosome: {genome['chromosome']} · sequence orientation: {genome['orientation']}.")
                    st.code(genome["sequence"], language=None)
            with tabs[1]:
                if not detail["transcripts"]:
                    st.info("No retrievable transcript/CDS was explicitly linked to the selected protein.")
                for transcript in detail["transcripts"]:
                    st.markdown(f"**{transcript['accession']} · {transcript['molecule_type']}**")
                    if transcript["transcript_sequence"]:
                        st.caption("Reference spliced transcript in cDNA alphabet (T). This is not RNA-seq data.")
                        st.code(transcript["transcript_sequence"], language=None)
                    st.caption(f"CDS location: {transcript['cds_location']} · numeric exports use 1-based inclusive coordinates")
                    st.code(transcript["translation"]["cds"], language=None)
                    st.dataframe(transcript["features"] + transcript["utrs"], hide_index=True, width="stretch")
            with tabs[2]:
                st.caption("Retrieved full reference protein")
                st.code(detail["protein_sequence"], language=None)
                if detail.get("protein_features"):
                    st.caption("Database protein features and processing annotations, where recorded")
                    st.dataframe(detail["protein_features"], hide_index=True, width="stretch")
                for transcript in detail["transcripts"]:
                    st.markdown(f"**Translation check: {transcript['accession']}**")
                    check = transcript["translation"]
                    st.json({k: v for k, v in check.items() if k not in ("cds", "computed_protein", "annotated_protein")})
                    st.caption("Computed CDS translation")
                    st.code(check["computed_protein"], language=None)
                    if check["annotated_protein"]:
                        st.caption("Database-annotated translation (may include documented exceptions)")
                        st.code(check["annotated_protein"], language=None)
            with tabs[3]:
                png = structure_figure(detail)
                st.image(png)
                st.download_button("Download gene-structure PNG", png, "gene_structure.png", "image/png")
            with tabs[4]:
                st.write(f"Report retrieval time: {detail['retrieved_at']}. Record responses may be cached for up to seven days.")
                for source in detail["sources"]:
                    if source["url"].startswith("https://www.ncbi.nlm.nih.gov/"):
                        st.link_button(source["record"], source["url"])
                    else:
                        st.write(source)
                st.json({"protein_coded_by": detail.get("coded_by", []), "linked_nucleotide_ids": detail.get("linked_nucleotide_ids", [])})
                if detail.get("record_retrievals"):
                    st.dataframe(detail["record_retrievals"], hide_index=True, width="stretch")

if st.session_state.jobs:
    st.subheader("5 · Download your results")
    st.caption("Reports include every returned candidate, all retrieved selections, methods, sources and warnings. Retrieve additional candidates to include their detailed sequences.")
    queries, jobs, details = st.session_state.queries, st.session_state.jobs, st.session_state.details
    st.download_button("Download Excel report", workbook(queries, jobs, details), "protein_central_dogma_report.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    if details:
        st.download_button("Download complete results ZIP", bundle(queries, jobs, details), "central_dogma_results.zip", "application/zip")
        for name, text in fasta_files(details).items():
            if text:
                st.download_button(f"Download {name}", text, name, "text/plain", key="download_" + name)
        st.download_button("Download evidence JSON", json.dumps(details, indent=2), "details.json", "application/json")
