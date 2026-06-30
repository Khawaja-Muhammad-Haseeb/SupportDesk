"""Ticket endpoints."""
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import get_ticket_service
from app.models.enums import Priority, Status
from app.schemas.ticket import (
    PaginatedTickets,
    StatusUpdate,
    TicketCreate,
    TicketRead,
    TicketUpdate,
)
from app.services.ticket_service import TicketService

router = APIRouter(prefix="/api/tickets", tags=["tickets"])


@router.post("", response_model=TicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(
    payload: TicketCreate,
    service: TicketService = Depends(get_ticket_service),
):
    return service.create_ticket(payload)


@router.get("", response_model=PaginatedTickets)
def list_tickets(
    search: Optional[str] = Query(default=None, description="Search name, email or subject"),
    priority: Optional[Priority] = Query(default=None),
    status: Optional[Status] = Query(default=None),
    sort: str = Query(default="newest", pattern="^(newest|oldest)$"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=8, ge=1, le=100),
    service: TicketService = Depends(get_ticket_service),
):
    return service.list_tickets(
        search=search,
        priority=priority,
        status=status,
        sort=sort,
        page=page,
        limit=limit,
    )


@router.get("/{ticket_id}", response_model=TicketRead)
def get_ticket(
    ticket_id: uuid.UUID,
    service: TicketService = Depends(get_ticket_service),
):
    return service.get_ticket(ticket_id)


@router.patch("/{ticket_id}", response_model=TicketRead)
def update_ticket(
    ticket_id: uuid.UUID,
    payload: TicketUpdate,
    service: TicketService = Depends(get_ticket_service),
):
    return service.update_ticket(ticket_id, payload)


@router.patch("/{ticket_id}/status", response_model=TicketRead)
def update_status(
    ticket_id: uuid.UUID,
    payload: StatusUpdate,
    service: TicketService = Depends(get_ticket_service),
):
    return service.update_status(ticket_id, payload)
