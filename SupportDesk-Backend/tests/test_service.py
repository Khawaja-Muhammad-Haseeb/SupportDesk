"""Service-layer tests."""
import uuid

import pytest

from app.core.exceptions import NotFoundError
from app.models.enums import Priority, Status
from app.schemas.ticket import StatusUpdate, TicketCreate, TicketUpdate
from app.services.ticket_service import TicketService


def _create(service, **overrides):
    data = {
        "customer_name": "Svc User",
        "customer_email": "svc@example.com",
        "subject": "Service subject",
        "description": "A sufficiently long description.",
        "priority": Priority.MEDIUM,
    }
    data.update(overrides)
    return service.create_ticket(TicketCreate(**data))


def test_service_create_sets_urgency(db_session):
    service = TicketService(db_session)
    created = _create(service, priority=Priority.HIGH)
    assert created.is_urgent is True
    assert created.status == Status.OPEN


def test_service_get_not_found(db_session):
    service = TicketService(db_session)
    with pytest.raises(NotFoundError):
        service.get_ticket(uuid.uuid4())


def test_service_update_status(db_session):
    service = TicketService(db_session)
    created = _create(service)
    updated = service.update_status(created.id, StatusUpdate(status=Status.IN_PROGRESS))
    assert updated.status == Status.IN_PROGRESS


def test_service_update_recomputes_urgency(db_session):
    service = TicketService(db_session)
    created = _create(service, priority=Priority.LOW, description="Calm description here.")
    assert created.is_urgent is False
    updated = service.update_ticket(
        created.id, TicketUpdate(description="Now this is urgent and bad.")
    )
    assert updated.is_urgent is True


def test_service_pagination(db_session):
    service = TicketService(db_session)
    for i in range(7):
        _create(service, subject=f"S{i}")
    result = service.list_tickets(page=1, limit=3)
    assert result.total == 7
    assert result.total_pages == 3
    assert len(result.items) == 3
