"""Backend validation tests (frontend validation is never trusted)."""
from tests.conftest import make_payload


def test_missing_customer_name(client):
    resp = client.post("/api/tickets", json=make_payload(customerName=""))
    assert resp.status_code == 422


def test_invalid_email(client):
    resp = client.post("/api/tickets", json=make_payload(customerEmail="not-an-email"))
    assert resp.status_code == 422


def test_description_too_short(client):
    resp = client.post("/api/tickets", json=make_payload(description="short"))
    assert resp.status_code == 422


def test_invalid_priority(client):
    resp = client.post("/api/tickets", json=make_payload(priority="CRITICAL"))
    assert resp.status_code == 422


def test_missing_subject(client):
    payload = make_payload()
    del payload["subject"]
    resp = client.post("/api/tickets", json=payload)
    assert resp.status_code == 422


def test_valid_payload_succeeds(client):
    resp = client.post("/api/tickets", json=make_payload())
    assert resp.status_code == 201
    body = resp.json()
    assert body["customerName"] == "Test User"
    assert body["status"] == "OPEN"


def test_error_response_shape(client):
    resp = client.post("/api/tickets", json=make_payload(customerEmail="bad"))
    body = resp.json()
    assert "error" in body
    assert body["error"]["code"] == "unprocessable_entity"
