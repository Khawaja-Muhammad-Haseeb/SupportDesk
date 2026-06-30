"""Business logic for tickets, sitting between the API and the repository."""
import math
import uuid
from typing import Optional

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.core.logging import get_logger
from app.models.enums import Priority, Status
from app.models.ticket import Ticket
from app.repositories.ticket_repository import TicketRepository
from app.schemas.ticket import (
    DashboardStats,
    PaginatedTickets,
    StatusUpdate,
    TicketCreate,
    TicketRead,
    TicketUpdate,
)
from app.utils.urgency import detect_urgency

logger = get_logger("supportdesk.service")


class TicketService:
    def __init__(self, db: Session):
        self.repo = TicketRepository(db)

    def _get_or_404(self, ticket_id: uuid.UUID) -> Ticket:
        ticket = self.repo.get_by_id(ticket_id)
        if ticket is None:
            raise NotFoundError(f"Ticket {ticket_id} not found.")
        return ticket

    def create_ticket(self, payload: TicketCreate) -> TicketRead:
        ticket = Ticket(
            customer_name=payload.customer_name,
            customer_email=payload.customer_email,
            subject=payload.subject,
            description=payload.description,
            priority=payload.priority,
            status=Status.OPEN,
        )
        # Urgency is always computed server-side, never trusted from the client.
        ticket.is_urgent = detect_urgency(ticket.priority, ticket.description)
        created = self.repo.create(ticket)
        logger.info("Created ticket %s (urgent=%s)", created.id, created.is_urgent)
        return TicketRead.model_validate(created)

    def get_ticket(self, ticket_id: uuid.UUID) -> TicketRead:
        return TicketRead.model_validate(self._get_or_404(ticket_id))

    def list_tickets(
        self,
        *,
        search: Optional[str] = None,
        priority: Optional[Priority] = None,
        status: Optional[Status] = None,
        sort: str = "newest",
        page: int = 1,
        limit: int = 8,
    ) -> PaginatedTickets:
        items, total = self.repo.list_tickets(
            search=search,
            priority=priority,
            status=status,
            sort=sort,
            page=page,
            limit=limit,
        )
        total_pages = max(1, math.ceil(total / limit)) if total else 0
        return PaginatedTickets(
            items=[TicketRead.model_validate(t) for t in items],
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
        )

    def update_ticket(self, ticket_id: uuid.UUID, payload: TicketUpdate) -> TicketRead:
        ticket = self._get_or_404(ticket_id)
        data = payload.model_dump(exclude_unset=True)

        for field, value in data.items():
            setattr(ticket, field, value)

        # Recompute urgency whenever priority or description may have changed.
        ticket.is_urgent = detect_urgency(ticket.priority, ticket.description)
        updated = self.repo.save(ticket)
        logger.info("Updated ticket %s", updated.id)
        return TicketRead.model_validate(updated)

    def update_status(self, ticket_id: uuid.UUID, payload: StatusUpdate) -> TicketRead:
        ticket = self._get_or_404(ticket_id)
        ticket.status = payload.status
        updated = self.repo.save(ticket)
        logger.info("Updated ticket %s status -> %s", updated.id, updated.status.value)
        return TicketRead.model_validate(updated)

    def get_dashboard(self) -> DashboardStats:
        return DashboardStats(
            total=self.repo.count_all(),
            open=self.repo.count_by_status(Status.OPEN),
            in_progress=self.repo.count_by_status(Status.IN_PROGRESS),
            resolved=self.repo.count_by_status(Status.RESOLVED),
            urgent=self.repo.count_urgent(),
            recent_tickets=[TicketRead.model_validate(t) for t in self.repo.recent(5)],
        )
