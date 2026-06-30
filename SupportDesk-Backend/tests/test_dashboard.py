"""Dashboard statistics tests."""
from tests.conftest import make_payload


def _create(client, **overrides):
    return client.post("/api/tickets", json=make_payload(**overrides)).json()


def test_dashboard_counts(client):
    _create(client, priority="HIGH")  # urgent + open
    _create(client, priority="LOW")
    t = _create(client, priority="MEDIUM")
    client.patch(f"/api/tickets/{t['id']}/status", json={"status": "RESOLVED"})

    stats = client.get("/api/dashboard").json()
    assert stats["total"] == 3
    assert stats["open"] == 2
    assert stats["resolved"] == 1
    assert stats["inProgress"] == 0
    assert stats["urgent"] == 1
    assert len(stats["recentTickets"]) == 3


def test_dashboard_empty(client):
    stats = client.get("/api/dashboard").json()
    assert stats["total"] == 0
    assert stats["urgent"] == 0
    assert stats["recentTickets"] == []
