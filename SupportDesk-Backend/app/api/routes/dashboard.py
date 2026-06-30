"""Dashboard statistics endpoint."""
from fastapi import APIRouter, Depends

from app.api.deps import get_ticket_service
from app.schemas.ticket import DashboardStats
from app.services.ticket_service import TicketService

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardStats)
def get_dashboard(service: TicketService = Depends(get_ticket_service)):
    return service.get_dashboard()
