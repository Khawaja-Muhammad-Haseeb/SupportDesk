"""Pydantic v2 schemas. JSON is camelCase to match the React frontend."""
import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from pydantic.alias_generators import to_camel

from app.models.enums import Priority, Status


class CamelModel(BaseModel):
    """Base model that serializes/accepts camelCase while keeping snake_case
    field names internally."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class TicketCreate(CamelModel):
    customer_name: str = Field(..., min_length=1, max_length=255)
    customer_email: EmailStr
    subject: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=10)
    priority: Priority

    @field_validator("customer_name", "subject")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field must not be blank.")
        return v.strip()

    @field_validator("description")
    @classmethod
    def description_min_length(cls, v: str) -> str:
        stripped = v.strip()
        if len(stripped) < 10:
            raise ValueError("Description must be at least 10 characters.")
        return stripped


class TicketUpdate(CamelModel):
    """Partial update. Any omitted field is left unchanged."""

    customer_name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    customer_email: Optional[EmailStr] = None
    subject: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, min_length=10)
    priority: Optional[Priority] = None
    status: Optional[Status] = None

    @field_validator("description")
    @classmethod
    def description_min_length(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        stripped = v.strip()
        if len(stripped) < 10:
            raise ValueError("Description must be at least 10 characters.")
        return stripped


class StatusUpdate(CamelModel):
    status: Status


class TicketRead(CamelModel):
    id: uuid.UUID
    customer_name: str
    customer_email: str
    subject: str
    description: str
    priority: Priority
    status: Status
    is_urgent: bool
    created_at: datetime
    updated_at: datetime


class PaginatedTickets(CamelModel):
    items: List[TicketRead]
    total: int
    page: int
    limit: int
    total_pages: int


class DashboardStats(CamelModel):
    total: int
    open: int
    in_progress: int
    resolved: int
    urgent: int
    recent_tickets: List[TicketRead]
