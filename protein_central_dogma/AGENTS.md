# Protein-to-Central-Dogma Explorer

You are the coding and analysis assistant for this application. Use the
machine-readable commands in `agent_cli.py` and the browser application to
support the user. There is no fixed species. No OpenAI or Claude API key is
required for biological searches.

## Scientific contract
- Preserve query order and duplicate entries.
- Never reconstruct a claimed original DNA sequence by reverse translation.
- Protein similarity does not establish a unique gene, organism, or sample origin.
- Label exact matches only after complete reference-sequence equality.
- Preserve all returned candidates, including tied hits; describe hit-list caps.
- Follow explicit accession-version, coded_by, GeneID and Entrez links.
- Distinguish transcript/cDNA, CDS, genomic DNA and protein. Do not call a
  genomic nucleotide record a transcript.
- Keep incomplete, unavailable and ambiguous evidence visible.
- Translation must record genetic code, codon_start, partial features, stops
  and translation exceptions. Do not silently apply or ignore exceptions.
- Annotated translations and computed translations are separate evidence.
- All exported numeric coordinates are 1-based inclusive. Include strand,
  assembly labels/accessions where explicitly available, sources and dates.
- Never invent RNA-seq expression. It requires separate experimental data.

## Operations
- Run tests with `.venv/Scripts/python.exe -m pytest` on Windows or
  `.venv/bin/python -m pytest` on Linux.
- Remote BLAST batches are limited to five per UI submission; this is an app
  resource guardrail, not a claim about NCBI's maximum supported input size.
- Keep at least 10 seconds between BLAST requests and 60 seconds between
  polls of one RID. Do not bypass the rate limiter or repeatedly resubmit.
- `.cache` stores responses and request history locally. Never publish it or
  include the user's query proteins in a source archive without permission.
- Tests use synthetic fixtures unless a test is explicitly labelled live.
- Use Ruflo MCP workflow or memory tools only when they are actually
  available in the host session. Discover their schemas first; do not invent
  names or claim that agents were launched based on a settings file.
- This application does not automatically run Ruflo swarms. Codex can use
  the CLI while Ruflo tools assist workflow tracking in the host session.

## CLI examples
`python agent_cli.py validate query.fasta`
`python agent_cli.py submit query.fasta --entry 1`
`python agent_cli.py check REQUEST_ID`
`python agent_cli.py retrieve REQUEST_ID ACCESSION --genomic --out outputs`

When asked to analyse a file, validate first, submit only if no suitable
existing RID exists, respect polling intervals, show candidates, and retrieve
the user's selected candidate(s). Report source-linked findings and limits.
