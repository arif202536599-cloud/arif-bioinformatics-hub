import json
import sqlite3
from unittest.mock import Mock

import pytest
import requests

from explorer.ncbi import BLAST, EUTILS, NCBI, ServiceError
from explorer.sequences import parse_queries, parse_blast_json


def response(body):
    return Mock(status_code=200, text=body, raise_for_status=Mock())


def test_cache_retains_original_fetch_date_and_avoids_request(tmp_path, monkeypatch):
    client = NCBI(tmp_path, email="contact@example.org")
    monkeypatch.setattr(client, "_pace", Mock())
    client.session.get = Mock(return_value=response("record"))
    assert client.request(EUTILS + "efetch.fcgi", {"id": "X"}) == "record"
    assert client.request(EUTILS + "efetch.fcgi", {"id": "X"}) == "record"
    assert client.session.get.call_count == 1
    assert client.retrievals[1]["served_from_cache"]
    assert client.retrievals[0]["database_fetched_at"] == client.retrievals[1]["database_fetched_at"]
    assert "email" not in client.retrievals[0]["parameters"]


def test_rate_limit_persists_between_clients(tmp_path, monkeypatch):
    monkeypatch.setattr("explorer.ncbi.time.time", lambda: 100.0)
    sleep = Mock()
    monkeypatch.setattr("explorer.ncbi.time.sleep", sleep)
    NCBI(tmp_path)._pace("blast", 10.1)
    NCBI(tmp_path)._pace("blast", 10.1)
    sleep.assert_called_once_with(pytest.approx(10.1))


def test_timed_out_submission_is_not_retried(tmp_path, monkeypatch):
    client = NCBI(tmp_path)
    monkeypatch.setattr(client, "_pace", Mock())
    client.session.post = Mock(side_effect=requests.Timeout())
    with pytest.raises(ServiceError, match="may already exist"):
        client.submit(parse_queries("MAEFG")[0])
    assert client.session.post.call_count == 1
    assert client.saved_jobs() == []


def test_submission_organism_restriction_and_saved_order(tmp_path, monkeypatch):
    client = NCBI(tmp_path)
    request = Mock(return_value="RID = TEST123\nRTOE = 10")
    monkeypatch.setattr(client, "request", request)
    q = parse_queries(">one\nMAEFG\n>two\nMLP")[1]
    job = client.submit(q, taxid=3702)
    assert request.call_args.args[1]["ENTREZ_QUERY"] == "txid3702[ORGN]"
    assert client.saved_jobs()[0]["query"]["order"] == 2
    assert job["status"] == "WAITING"


def test_poll_waits_a_minute_and_understands_whitespace(tmp_path, monkeypatch):
    client = NCBI(tmp_path)
    monkeypatch.setattr("explorer.ncbi.time.time", lambda: 100.0)
    request = Mock(return_value="Status  =  WAITING")
    monkeypatch.setattr(client, "request", request)
    job = {"rid": "TEST123", "last_poll": 70.0, "status": "WAITING"}
    client.poll(job)
    request.assert_not_called()
    job["last_poll"] = 0
    assert client.poll(job)["status"] == "WAITING"
    assert job["last_poll"] == 100
    request.assert_called_once()


def test_invalid_service_payload_is_not_reported_as_no_hits(tmp_path, monkeypatch):
    client = NCBI(tmp_path)
    monkeypatch.setattr(client, "request", lambda *args, **kwargs: "<broken")
    with pytest.raises(ServiceError, match="malformed XML"):
        client.taxonomy_search("any organism")
    with pytest.raises(ValueError, match="BlastOutput2"):
        parse_blast_json({"error": "unavailable"}, parse_queries("MAEFG")[0])


def test_successful_no_hit_search_is_distinct_from_service_error(tmp_path, monkeypatch):
    client = NCBI(tmp_path)
    monkeypatch.setattr("explorer.ncbi.time.time", lambda: 100.0)
    monkeypatch.setattr(client, "request", lambda *args, **kwargs: json.dumps({"BlastOutput2": [{"report": {"results": {"search": {"hits": []}}}}]}))
    job = {"rid": "TEST123", "last_poll": 0, "status": "WAITING", "query": vars(parse_queries("MAEFG")[0])}
    assert client.poll(job)["status"] == "READY"
    assert job["candidates"] == []
