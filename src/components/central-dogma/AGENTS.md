# Central Dogma web page

The scientific contract in `../../../protein_central_dogma/AGENTS.md` applies
here. Browser code must never infer a gene/species from similarity alone,
reverse-translate a claimed original genome, fabricate links, or label a
partial alignment exact. Preserve input order and all returned candidates.

Use `shared` for deterministic biological evidence and `server` for supported
NCBI calls. Keep pacing and submission idempotency in the server-side shared
store; no direct unpaced browser BLAST calls. Keep synthetic demonstrations
clearly labelled. Do not put credentials or language-model keys in this UI.

Run `npm test`, `npm run check:function` and `npm run build` from the repository
root. Check the deployed backend and actual page before claiming publication
works. GitHub Pages alone cannot run the backend. Use available Ruflo MCP
workflow tools only if they are genuinely available, and inspect schemas first.
