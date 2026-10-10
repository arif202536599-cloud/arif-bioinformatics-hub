# Protein-to-Central-Dogma Explorer

A local application and a reusable Codex agent workspace. Paste a protein
sequence or upload a protein FASTA, search across organisms or choose any
NCBI taxonomic group, inspect candidate proteins, and retrieve explicitly
linked genes, transcripts, CDS, genomic DNA, and reference proteins.

No fixed species is built into the workflow. No OpenAI/Claude API key or
Cognitum account is required. Internet access is required for live NCBI
searches and record retrieval; the synthetic demo works offline after setup.

## Windows: quickest start

1. Install **Python 3.11 or newer** from
   <https://www.python.org/downloads/windows/> if necessary. Include the
   Python launcher / Add Python to PATH during installation.
2. Clone this repository or download its ZIP. Open the `protein_central_dogma`
   subfolder inside your downloaded repository. You may also copy this folder
   into `C:\Users\precision\Ruflo_Project`.
3. Double-click **START_WINDOWS.cmd**. Its first run creates `.venv` and
   installs dependencies; later launches reuse them.
4. Open <http://localhost:8501> if the browser does not open automatically.
5. Keep the terminal open while using the app. Press Ctrl+C to stop it.

The virtual environment is created on your machine, rather than shipped in
the ZIP: virtual environments are platform/path dependent.

Exact Command Prompt commands, if you prefer manual setup:

```bat
cd /d "C:\Users\precision\Ruflo_Project\protein_central_dogma"
py -3 -m venv .venv
".venv\Scripts\python.exe" -m pip install -r requirements.txt
".venv\Scripts\python.exe" -m streamlit run app.py --server.address localhost --server.port 8501 --browser.gatherUsageStats false
```

If `py` is unavailable but `python --version` shows a supported Python 3
version, use `python -m venv .venv` for the second line. All subsequent lines
use the virtual environment interpreter explicitly, so activation is not
required and PowerShell execution policies do not need to be changed.

## First use

1. Select **Open offline demonstration** in the sidebar to explore the UI
   and download a synthetic report. Every demo result is labelled synthetic.
2. For real analysis, paste amino-acid letters or upload a UTF-8 protein FASTA.
   Multiple entries and duplicate identifiers retain their input order.
3. Choose **Auto-detect / Search across organisms**, or use **Specify organism**,
   search NCBI Taxonomy and select the scientific name/taxonomy ID.
4. RefSeq protein is the default search database. Select nr for wider coverage;
   some nr records have no retrievable GeneID or transcript/CDS links.
5. Submit up to five queries per batch. All uploaded entries remain selectable
   for later batches. This small-batch guardrail protects the remote service.
6. Wait at least a minute, then click **Check search results**. Repeat as needed.
   BLAST queue times vary. Existing requests are reused instead of resubmitted.
7. Click **Verify complete reference sequences** to check every returned
   candidate, or select one and click **Retrieve gene, transcript, CDS and
   protein**. Only full reference-sequence equality earns an exact-match label.
8. Review sources, alternative candidates, genomic loci and warnings. Download
   Excel, FASTA, evidence JSON, the gene-structure PNG, or the full results ZIP.

An optional contact email is used in NCBI E-utilities requests. Searches send
query sequences to NCBI. Responses are cached on this computer for seven days.
Saved job files contain the query and search results and remain until removed.
Evidence reports retain the original database fetch dates for cached responses,
separately from the time the report was assembled.
Delete `.cache` while the app is stopped to clear local history/cache. No
API key is stored, and no remote language model receives sequences from this app.

## What the results mean

- **Genomic DNA:** a Gene-linked reference locus slice, oriented 5′→3′ along
  the gene. Locus positions remain on the forward reference coordinates.
- **Transcript:** a linked RNA record, represented in cDNA alphabet (T).
  Its full sequence is not presented as RNA-seq reads or measured expression.
- **CDS:** the coding segments from a matching `protein_id` feature, extracted
  in biological order. Genomic nucleotide records can provide a CDS without
  providing an annotated spliced transcript.
- **Protein:** the complete retrieved database sequence compared with the query.
- **Translation:** computed using `transl_table` and `codon_start`. Annotated
  translations are shown separately. Partial CDS, internal stops, incomplete
  codons and translation exceptions are reported. Explicit codon-position
  `transl_except` recoding (including Sec/Pyl) is applied and recorded. Unsupported
  annotations or textual processing exceptions remain unresolved and visible.
- **UTRs/introns:** annotation-backed where present. Transcript-end UTRs and
  genomic mRNA exon gaps may be inferred and are labelled as inferred.
- **Assembly:** Gene record assembly labels and explicit `Assembly:` links are
  reported where available. A contig accession is not an assembly accession.

Protein sequence cannot uniquely reconstruct the original DNA. Exact proteins
can occur in multiple genes, transcripts, strains, and species. This app finds
reference-supported candidates, not experimental proof of sample origin.

The search has a selectable hit-list cap. Every returned candidate/description
is retained, including tied matches, but the app does not guarantee retrieval
of every possible match in the entire database. Identity describes the best
scoring local HSP; query/subject coverage uses the union of all HSP intervals.
Those quantities are not a global full-sequence comparison.

Missing transcript links, uncertain protein versions, or absent gene/assembly
records remain unavailable. Genomic fetches are capped at 1 Mb per locus and
nucleotide-link retrieval at 30 records per selection; skipped records are
reported. This version does not predict novel genes from an unannotated genome,
recover original sample-specific DNA, or analyse RNA-seq expression.

## Codex and Ruflo

`AGENTS.md` supplies the scientific and operational instructions for Codex.
`agent_cli.py` exposes validated tools without requiring another model API.
Launch Codex inside this folder:

```bat
cd /d "C:\Users\precision\Ruflo_Project\protein_central_dogma"
codex
```

In Codex, use `/mcp` to check that Ruflo is connected. If it has not already
been registered in your Codex configuration, run this **outside Codex**:

```bat
codex mcp add ruflo -- cmd /c npx -y ruflo@latest mcp start
codex mcp list
```

Suggested instruction to Codex:

> Read AGENTS.md. Validate my protein FASTA, submit one search with agent_cli.py,
> respect NCBI polling intervals, and show me the candidates before retrieving
> a chosen gene. Use available Ruflo tools to track the workflow. Preserve all
> ambiguous evidence and do not claim a unique gene of origin from similarity.

The application itself does not launch a Ruflo swarm. Ruflo's optional tools
are used in the host Codex session when connected; `AGENTS.md` does not register
a new Ruflo runtime agent or activate Claude-specific plugins/hooks in Codex.

CLI commands (replace REQUEST_ID and ACCESSION with actual returned values):

```bat
".venv\Scripts\python.exe" agent_cli.py validate examples\query.fasta
".venv\Scripts\python.exe" agent_cli.py submit examples\query.fasta --entry 1
".venv\Scripts\python.exe" agent_cli.py check REQUEST_ID
".venv\Scripts\python.exe" agent_cli.py retrieve REQUEST_ID ACCESSION --genomic --out outputs
```

## Tests

```bat
".venv\Scripts\python.exe" -m pip install -r requirements-dev.txt
".venv\Scripts\python.exe" -m pytest -q
```

Tests cover order/duplicates, invalid input, full versus fragment matches,
overlapping HSP coverage, tied descriptions, CDS translation, negative-strand
splicing, genetic codes, partial CDS, exceptions, explicit alternative
transcripts, missing records, Excel/ZIP exports, and Streamlit application flows.
See `VALIDATION.md` for actual verification performed on this release.

Linux/WSL: `bash START_LINUX.sh` or use the equivalent `.venv/bin/python`
commands. The Windows launcher is included but was not executed in this Linux
build environment.

## Primary documentation

- NCBI BLAST Common URL API:
  <https://blast.ncbi.nlm.nih.gov/doc/blast-help/urlapi.html>
- NCBI BLAST developer usage guidelines:
  <https://blast.ncbi.nlm.nih.gov/doc/blast-help/developerinfo.html>
- NCBI E-utilities:
  <https://www.ncbi.nlm.nih.gov/books/NBK25497/>
- NCBI Gene and Protein:
  <https://www.ncbi.nlm.nih.gov/gene/> · <https://www.ncbi.nlm.nih.gov/protein/>
- INSDC feature annotation and translation qualifiers:
  <https://www.insdc.org/submitting-standards/feature-table/>
- Codex MCP:
  <https://developers.openai.com/codex/mcp>
- Ruflo:
  <https://github.com/ruvnet/ruflo>

Version 1.0 · Research assistance, with explicit evidence and availability limits.
