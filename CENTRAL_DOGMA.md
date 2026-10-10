# Protein-to-Central-Dogma Explorer on the website

Open the **Central Dogma** navigation tab (or `/#central-dogma`). Paste one
protein or multi-entry protein FASTA, or upload a UTF-8 FASTA file. The default
search crosses organisms. To restrict it, choose **Specify organism**, search
NCBI Taxonomy, and select an organism or taxonomic group.

1. Confirm sequence submission to NCBI and click **Analyse proteins**.
2. Keep the returned request IDs. Wait at least one minute and click
   **Check search results**. BLAST queue time is outside this application's control.
3. Select a candidate and click **Retrieve selected candidate’s linked records**.
4. Review Gene & location, Transcript & CDS, Protein & translation, Gene
   structure and Sources & evidence. Retrieve other candidates to include them.
5. Download Excel, evidence/alignment JSON, separate FASTA files and the
   structure SVG/PNG. **Try offline demonstration** uses clearly labelled
   synthetic data and makes no biological database request.

## Scientific interpretation

A protein sequence does not uniquely determine its original DNA or organism.
The application follows reference database links; it does not prove sample
origin, predict novel genes or infer RNA-seq expression. Identical proteins
may have multiple equally supported candidates. Every returned description
is preserved, but a selectable hit-list cap (10–100) makes the search non-exhaustive.

Identity is the best local HSP identity. Coverage is the union of HSP positions,
separately for query and subject. A complete fetched reference protein must
match the complete input sequence before the application labels an exact
full-length match. Ambiguous B/Z/J/X prevent a definitive exact label.

NCBI protein `coded_by` and Entrez links lead to nucleotide and Gene records.
Only CDS features with the exact versioned `protein_id` are translated. Only
full RNA records are called spliced transcripts (in cDNA alphabet, T); genomic
records and genomic slices never become claimed complete mRNA sequences.
Alternative Gene loci and assembly records remain separate. Genomic DNA is
oriented along the annotated gene strand, while exported positions stay
**1-based inclusive on the forward reference**.

Translation records `transl_table`, `codon_start`, partial boundaries, internal
stops, annotated translation, and applied/unresolved `transl_except` annotations.
Supported positional exceptions include Sec/Pyl. Free-text processing annotations
are preserved rather than guessed. Genetic codes were exported from Biopython
1.88; complete CDS initiation and context-dependent terminal stops are handled
separately from ordinary internal codons. A difference from the reference or
input protein remains visible. UTRs inferred from complete transcript/CDS
boundaries and introns inferred from annotated mRNA gaps are labelled inferred.

Missing links, unsupported locations, oversized sequences and service errors
remain visible. The web app fetches at most 30 linked nucleotide records and
1 Mb per complete nucleotide record or explicitly Gene-linked genomic slice.
It retains skipped linked IDs and available coordinates. Large `coded_by`
records without a Gene link may require the Python app for explicit slices.
Excel cells exceeding 30,000 characters are visibly truncated; FASTA and JSON
retain full available sequences. Values beginning with formula characters are
escaped in Excel. Downloaded figures use reference annotation, not generated art.

## Hosting and request handling

The React page uses `/.netlify/functions/central-dogma`. `netlify.toml` builds
with Node 24 and publishes `dist`, with the function under `netlify/functions`.
Netlify Blobs provides a site-scoped cache and atomic shared request pacing.
No model API key, paid Claude account or Streamlit hosting is required.

NCBI contacts are separated by at least 10.1 seconds for BLAST and 360 ms for
E-utilities; one RID is polled no faster than every 60.1 seconds. Each UI batch
submits up to five proteins. The site caps **new searches at 50 per rolling
24 hours** to keep a public educational application below high-volume usage.
Existing RID polling and reference retrieval remain available at that cap.
These batch/size/daily caps are application choices, not NCBI maximum-input claims.

A submission UUID is atomically saved before posting to BLAST. A timeout or
unconfirmed submission is never automatically resubmitted. Only explicit
rate-limit responses known to precede submission are retried. Conditional
Blobs writes without an ETag fail closed; a shared-store failure cannot bypass
pacing. If saving an accepted RID fails, the error includes that RID for resumption.

Public reference responses and completed BLAST reports have a seven-day **reuse
TTL**; stale entries are overwritten on reuse. This is not automatic deletion
of stored Blobs. Submission history and pacing/budget keys also persist; the
site owner can manage them through Netlify. Query-containing BLAST alignments
are cached, so do not send confidential sequences through the public site.
This tab's analysis is held in browser session storage; **Clear analysis session**
clears that tab's saved state. It does not remove NCBI requests or server cache.
Reports include original database retrieval times, cache status, endpoints,
parameters and record accessions/versions, separately from report creation time.

Optional Netlify function environment variable: `NCBI_CONTACT_EMAIL`, an email
owned by the site maintainer, for NCBI tool contact. Keep it server-side. There
is no API key requirement. Netlify hosting usage follows the owner's existing
plan; the feature uses Functions and Blobs.

GitHub Pages builds the UI and offline demo, but **does not run Netlify functions**.
Live searches require the Netlify deployment. The page reports backend availability
and a clear error when a static host returns HTML in place of the API.

## Development and checks

Use Node 24. In Windows Command Prompt, from a clone of this repository:

```bat
npm ci
npm test
npm run check:function
npm run build
npm run dev
```

Vite alone previews UI/offline demo. For a local Netlify function environment:

```bat
npx netlify-cli dev
```

That command uses Netlify's development tooling; follow any local site-link
prompt if needed. The **separate local Python application** is included under
`protein_central_dogma`. Exact Windows commands from the repository root:

```bat
cd protein_central_dogma
py -3 -m venv .venv
".venv\Scripts\python.exe" -m pip install -r requirements.txt
".venv\Scripts\python.exe" -m streamlit run app.py --server.address localhost --server.port 8501 --browser.gatherUsageStats false
```

Virtual environments are created on the user's machine; they are not committed.
For Python tests, install `requirements-dev.txt` and run `.venv\Scripts\python.exe -m pytest`.
`protein_central_dogma/AGENTS.md` and `agent_cli.py` provide Codex's scientific
contract and reusable machine-readable operations. Ruflo MCP tools can track
workflow when installed in the host session. The application does not claim
that a Ruflo swarm or language model is running.

The JavaScript tests exercise biological evidence, rate limits, submission
idempotency/failures, input controls, session recovery, diagrams and FASTA
exports. Tests use synthetic fixtures plus archived public NCBI records:
`NP_000509.1`, `NM_000518.5`, GeneID `3043` (locus-only XML subset), and a
`NC_000011.10:5225464–5227071` genomic slice, retrieved 2026-10-10. These public
fixtures test versioned mapping and negative-strand splicing, without network
requests during tests. They are examples, not a hardcoded species workflow.

References: [BLAST usage guidance](https://blast.ncbi.nlm.nih.gov/doc/blast-help/developerinfo.html),
[BLAST URL API](https://blast.ncbi.nlm.nih.gov/doc/blast-help/urlapi.html),
[NCBI E-utilities](https://www.ncbi.nlm.nih.gov/books/NBK25501/),
[Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/).
