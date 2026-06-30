"""Data-access layer for tickets. All DB queries live here."""
import uuid
from typing import List, Optional, Tuple

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.enums import Priority, Status
from app.models.ticket import Ticket


class TicketRepository:
    def __init__(self, db: Session):
        self.db = db

    # --- Reads ---
    def get_by_id(self, ticket_id: uuid.UUID) -> Optional[Ticket]:
        return self.db.get(Ticket, ticket_id)

    def get_by_email(self, email: str) -> List[Ticket]:
        """Retrieve a customer's full ticket history (for future enhancements)."""
        stmt = (
            select(Ticket)
            .where(func.lower(Ticket.customer_email) == email.lower())
            .order_by(Ticket.created_at.desc())
        )
        return list(self.db.scalars(stmt).all())

    def list_tickets(
        self,
        *,
        search: Optional[str] = None,
        priority: Optional[Priority] = None,
        status: Optional[Status] = None,
        sort: str = "newest",
        page: int = 1,
        limit: int = 8,
    ) -> Tuple[List[Ticket], int]:
        """Return a page of tickets plus the total count matching the filters."""
        stmt = select(Ticket)
        count_stmt = select(func.count()).select_from(Ticket)

        conditions = []
        if search:
            pattern = f"%{search.lower()}%"
            conditions.append(
                or_(
                    func.lower(Ticket.customer_name).like(pattern),
                    func.lower(Ticket.customer_email).like(pattern),
                    func.lower(Ticket.subject).like(pattern),
                )
            )
        if priority is not None:
            conditions.append(Ticket.priority == priority)
        if status is not None:
            conditions.append(Ticket.status == status)

        for cond in conditions:
            stmt = stmt.where(cond)
            count_stmt = count_stmt.where(cond)

        order = Ticket.created_at.asc() if sort == "oldest" else Ticket.created_at.desc()
        stmt = stmt.order_by(order)

        total = self.db.scalar(count_stmt) or 0

        offset = (page - 1) * limit
        stmt = stmt.offset(offset).limit(limit)
        items = list(self.db.scalars(stmt).all())
        return items, total

    def count_by_status(self, status: Status) -> int:
        stmt = select(func.count()).select_from(Ticket).where(Ticket.status == status)
        return self.db.scalar(stmt) or 0

    def count_all(self) -> int:
        return self.db.scalar(select(func.count()).select_from(Ticket)) or 0

    def count_urgent(self) -> int:
        stmt = select(func.count()).select_from(Ticket).where(Ticket.is_urgent.is_(True))
        return self.db.scalar(stmt) or 0

    def recent(self, limit: int = 5) -> List[Ticket]:
        stmt = select(Ticket).order_by(Ticket.created_at.desc()).limit(limit)
        return list(self.db.scalars(stmt).all())

    # --- Writes ---
    def create(self, ticket: Ticket) -> Ticket:
        self.db.add(ticket)
        self.db.commit()
        self.db.refresh(ticket)
        return ticket

    def save(self, ticket: Ticket) -> Ticket:
        self.db.add(ticket)
        self.db.commit()
        self.db.refresh(ticket)
        return ticket
