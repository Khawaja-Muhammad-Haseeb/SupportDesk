"""Shared API dependencies."""
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.ticket_service import TicketService


def get_ticket_service(db: Session = Depends(get_db)) -> TicketService:
    return TicketService(db)
