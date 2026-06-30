"""Integration tests for the ticket API: CRUD, search, filter, sort, pagination."""
import uuid

import pytest

from tests.conftest import make_payload


def _create(client, **overrides):
    resp = client.post("/api/tickets", json=make_payload(**overrides))
    assert resp.status_code == 201
    return resp.json()


def test_create_and_get_ticket(client):
    created = _create(client)
    ticket_id = created["id"]

    resp = client.get(f"/api/tickets/{ticket_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == ticket_id


def test_create_high_priority_sets_urgent(client):
    created = _create(client, priority="HIGH")
    assert created["isUrgent"] is True


def test_create_urgent_keyword_sets_urgent(client):
    created = _create(client, priority="LOW", description="Please help, this is urgent!")
    assert created["isUrgent"] is True


def test_get_unknown_ticket_returns_404(client):
    resp = client.get(f"/api/tickets/{uuid.uuid4()}")
    assert resp.status_code == 404
    assert resp.json()["error"]["code"] == "not_found"


def test_update_ticket_recomputes_urgency(client):
    created = _create(client, priority="LOW", description="A calm description here.")
    assert created["isUrgent"] is False

    resp = client.patch(f"/api/tickets/{created['id']}", json={"priority": "HIGH"})
    assert resp.status_code == 200
    assert resp.json()["isUrgent"] is True


def test_update_status(client):
    created = _create(client)
    resp = client.patch(f"/api/tickets/{created['id']}/status", json={"status": "RESOLVED"})
    assert resp.status_code == 200
    assert resp.json()["status"] == "RESOLVED"


def test_update_status_invalid_value(client):
    created = _create(client)
    resp = client.patch(f"/api/tickets/{created['id']}/status", json={"status": "DONE"})
    assert resp.status_code == 422


def test_search_by_name_email_subject(client):
    _create(client, customerName="Zoe Alpha", customerEmail="zoe@alpha.com", subject="Login problem")
    _create(client, customerName="Other Person", customerEmail="other@beta.com", subject="Billing")

    by_name = client.get("/api/tickets", params={"search": "zoe"}).json()
    assert by_name["total"] == 1
    assert by_name["items"][0]["customerName"] == "Zoe Alpha"

    by_email = client.get("/api/tickets", params={"search": "ALPHA.COM"}).json()
    assert by_email["total"] == 1

    by_subject = client.get("/api/tickets", params={"search": "billing"}).json()
    assert by_subject["total"] == 1


def test_filter_by_priority_and_status(client):
    _create(client, priority="HIGH")
    _create(client, priority="LOW")
    _create(client, priority="LOW")

    high = client.get("/api/tickets", params={"priority": "HIGH"}).json()
    assert high["total"] == 1

    low = client.get("/api/tickets", params={"priority": "LOW"}).json()
    assert low["total"] == 2

    opened = client.get("/api/tickets", params={"status": "OPEN"}).json()
    assert opened["total"] == 3


def test_sort_newest_oldest(client):
    a = _create(client, subject="First")
    b = _create(client, subject="Second")

    newest = client.get("/api/tickets", params={"sort": "newest"}).json()
    oldest = client.get("/api/tickets", params={"sort": "oldest"}).json()

    assert newest["items"][0]["id"] == b["id"]
    assert oldest["items"][0]["id"] == a["id"]


def test_pagination_metadata(client):
    for i in range(12):
        _create(client, subject=f"Ticket {i}")

    page1 = client.get("/api/tickets", params={"page": 1, "limit": 5}).json()
    assert page1["total"] == 12
    assert page1["limit"] == 5
    assert page1["page"] == 1
    assert page1["totalPages"] == 3
    assert len(page1["items"]) == 5

    page3 = client.get("/api/tickets", params={"page": 3, "limit": 5}).json()
    assert len(page3["items"]) == 2


def test_invalid_uuid_path_returns_422(client):
    resp = client.get("/api/tickets/not-a-uuid")
    assert resp.status_code == 422
