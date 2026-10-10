"""Small machine-readable interface for Codex/Ruflo-assisted runs."""
import argparse
import json
from pathlib import Path

from explorer.ncbi import NCBI, ServiceError, retrieve_detail
from explorer.reports import bundle
from explorer.sequences import Query, parse_queries

ROOT = Path(__file__).resolve().parent


def main():
    parser = argparse.ArgumentParser(description="Protein-to-Central-Dogma Explorer agent tools")
    parser.add_argument("--email", default="")
    sub = parser.add_subparsers(dest="command", required=True)
    validate = sub.add_parser("validate")
    validate.add_argument("fasta")
    submit = sub.add_parser("submit")
    submit.add_argument("fasta")
    submit.add_argument("--entry", type=int, default=1, help="1-based input entry to submit")
    submit.add_argument("--taxid", type=int)
    submit.add_argument("--database", choices=["refseq_protein", "nr"], default="refseq_protein")
    submit.add_argument("--hits", type=int, choices=range(1, 101), default=30)
    check = sub.add_parser("check")
    check.add_argument("rid")
    retrieve = sub.add_parser("retrieve")
    retrieve.add_argument("rid")
    retrieve.add_argument("accession")
    retrieve.add_argument("--genomic", action="store_true")
    retrieve.add_argument("--out", default="outputs")
    args = parser.parse_args()
    client = NCBI(ROOT / ".cache", args.email)
    try:
        if args.command == "validate":
            print(json.dumps([vars(q) for q in parse_queries(Path(args.fasta).read_text(encoding="utf-8-sig"))], indent=2))
        elif args.command == "submit":
            queries = parse_queries(Path(args.fasta).read_text(encoding="utf-8-sig"))
            if not 1 <= args.entry <= len(queries):
                parser.error("--entry is outside the input range")
            print(json.dumps(client.submit(queries[args.entry - 1], args.database, args.taxid, args.hits), indent=2))
        else:
            if not args.rid.replace("-", "").replace("_", "").isalnum():
                parser.error("Invalid request ID")
            path = ROOT / ".cache" / f"job_{args.rid}.json"
            job = json.loads(path.read_text(encoding="utf-8"))
            if args.command == "check":
                client.poll(job)
                print(json.dumps({k: v for k, v in job.items() if k != "raw_blast"}, indent=2))
            else:
                if job["status"] != "READY":
                    parser.error("Search is not READY. Use check, respecting the one-minute poll interval.")
                if args.accession not in {c["accession"] for c in job["candidates"]}:
                    parser.error("Accession is not among this search's returned candidates")
                detail = retrieve_detail(client, args.accession, job["query"]["sequence"], include_genomic=args.genomic)
                out = Path(args.out)
                out.mkdir(parents=True, exist_ok=True)
                key = f"{job['query']['order']}:{args.accession}"
                result = out / f"{args.rid}_{args.accession}_results.zip"
                result.write_bytes(bundle([Query(**job["query"])], [job], {key: detail}))
                print(json.dumps({"output": str(result.resolve()), "match": detail["match"], "gene_ids": detail["gene_ids"], "warnings": detail["warnings"]}, indent=2))
    except (ServiceError, ValueError, OSError) as exc:
        parser.exit(1, f"Error: {exc}\n")


if __name__ == "__main__":
    main()
