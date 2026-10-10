# Release verification

Verified on 2026-10-10 with Python 3.12.14 on Linux, in the project's
own `.venv`. The Windows launcher has not been executed on Windows.

## Automated checks

`python -m pytest -q`: **34 passed in 2.42 seconds**.

Checks include input validation and ordering, duplicate IDs, full versus
fragment matches, preservation of alternative hit descriptions, HSP coverage,
standard and mitochondrial translation, negative-strand splicing, explicit
selenocysteine recoding, unresolved translation exceptions, incomplete CDS,
alternative transcript links, missing records, unknown genomic strand,
cache provenance, persistent service pacing, submission timeouts, polling
intervals, malformed service responses, Excel/FASTA/PNG/ZIP exports, and
Streamlit input/demo/submission/poll/candidate interactions.

Streamlit UI checks use its official `AppTest` widget runner with synthetic
service responses. They are not screenshots from a real browser. A Chromium
browser could not be installed in this build environment.

`python -m compileall -q app.py agent_cli.py explorer`: passed.
The CLI successfully validated `examples/query.fasta`.

A real Streamlit server started on 127.0.0.1:8501. Its health endpoint
returned HTTP 200 `ok`, and its application HTML returned HTTP 200.

## Live public database checks

NCBI Taxonomy search for `Arabidopsis thaliana` returned taxid 3702.
This was a validation query; no organism is fixed in the application's
analysis workflow.

An explicitly selected public protein reference, **NP_000509.1**, was retrieved
to verify the detailed mapping pipeline:

- Full reference sequence matched the 147-residue example query.
- Organism: Homo sapiens, taxid 9606.
- Explicit GeneID: 3043, HBB.
- Linked transcript: NM_000518.5.
- Computed CDS translation matched the full reference protein.
- Four explicitly linked reference loci were preserved:
  NC_000011.10:5225464–5227071 (minus),
  NG_000007.3:70545–72152 (plus),
  NG_059281.1:5001–6608 (plus), and
  NC_060935.1:5284832–5286439 (minus).
- Explicit assembly links were present for the chromosome records:
  GCF_000001405.40 and GCF_009914755.1.
- Genomic retrieval, Excel/FASTA/JSON exports and gene-structure figure
  generation succeeded. The generated figure was visually inspected.
- Cached responses retain their original database fetch dates.

A single live, unrestricted BLASTp RefSeq search was accepted by NCBI
(RID CM2306ZA014). It remained **WAITING** at the last permitted check during
this build. Therefore live submission and waiting/polling responses are
confirmed; completed live BLAST output was not obtained. Parsing, candidate
display, query/subject coverage and the ready/no-hit cases are verified with
synthetic supported-format responses. No redundant live search was submitted.

## What is not verified

- Windows-specific dependency installation and launcher execution.
- Completed live BLAST output for this build's queued search.
- Exhaustive coverage of every annotation convention, taxon or genetic-code
  exception in the public databases.
- Ruflo workflow execution: no Ruflo MCP tools were exposed in the build
  session. The supplied instructions let a host Codex session use connected
  Ruflo tools, without pretending the app itself runs a swarm.

Unavailable links and unsupported annotations remain visible in the results.
No original sample DNA or RNA-seq expression was inferred from a protein.
