"""Repository-layer tests."""
from app.models.enums import Priority, Status
from app.models.ticket import Ticket
from app.repositories.ticket_repository import TicketRepository
from app.utils.urgency import detect_urgency


def _make_ticket(**overrides):
    data = {
        "customer_name": "Repo User",
        "customer_email": "repo@example.com",
        "subject": "Repo subject",
        "description": "Repository description text.",
        "priority": Priority.MEDIUM,
        "status": Status.OPEN,
    }
    data.update(overrides)
    ticket = Ticket(**data)
    ticket.is_urgent = detect_urgency(ticket.priority, ticket.description)
    return ticket


def test_create_and_get_by_id(db_session):
    repo = TicketRepository(db_session)
    created = repo.create(_make_ticket())
    fetched = repo.get_by_id(created.id)
    assert fetched is not None
    assert fetched.id == created.id


def test_get_by_email_returns_history(db_session):
    repo = TicketRepository(db_session)
    repo.create(_make_ticket(customer_email="multi@example.com", subject="One"))
    repo.create(_make_ticket(customer_email="multi@example.com", subject="Two"))
    repo.create(_make_ticket(customer_email="other@example.com", subject="Three"))

    history = repo.get_by_email("MULTI@EXAMPLE.COM")  # case insensitive
    assert len(history) == 2


def test_list_with_filters(db_session):
    repo = TicketRepository(db_session)
    repo.create(_make_ticket(priority=Priority.HIGH))
    repo.create(_make_ticket(priority=Priority.LOW))

    items, total = repo.list_tickets(priority=Priority.HIGH)
    assert total == 1
    assert items[0].priority == Priority.HIGH


def test_count_helpers(db_session):
    repo = TicketRepository(db_session)
    repo.create(_make_ticket(priority=Priority.HIGH))  # urgent
    repo.create(_make_ticket(status=Status.RESOLVED))

    assert repo.count_all() == 2
    assert repo.count_by_status(Status.RESOLVED) == 1
    assert repo.count_urgent() == 1
    assert len(repo.recent(5)) == 2
