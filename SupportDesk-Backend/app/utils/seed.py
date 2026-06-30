"""Seed initial ticket data so the app is populated on first run.

Only inserts when the tickets table is empty, so it is safe to call on every
startup. Urgency is computed through the same backend logic used at runtime.
"""
from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.models.enums import Priority, Status
from app.models.ticket import Ticket
from app.utils.urgency import detect_urgency

logger = get_logger("supportdesk.seed")


def _dt(value: str) -> datetime:
    return datetime.fromisoformat(value).replace(tzinfo=timezone.utc)


SEED_TICKETS = [
    {"customer_name": "Alice Johnson", "customer_email": "alice.johnson@example.com", "subject": "Cannot login to my account", "description": "I have been trying to log in since yesterday but keep getting an 'Invalid credentials' error. I have tried resetting my password twice but the issue persists.", "priority": Priority.HIGH, "status": Status.OPEN, "created_at": "2026-06-28T09:15:00", "updated_at": "2026-06-28T09:15:00"},
    {"customer_name": "Bob Martinez", "customer_email": "bob.martinez@techcorp.com", "subject": "Billing charge not matching invoice", "description": "My last invoice shows $199 but I was charged $249. This is urgent, please review and issue a refund for the difference.", "priority": Priority.HIGH, "status": Status.IN_PROGRESS, "created_at": "2026-06-27T14:30:00", "updated_at": "2026-06-28T10:00:00"},
    {"customer_name": "Carol White", "customer_email": "carol.white@gmail.com", "subject": "Feature request: dark mode", "description": "It would be great to have a dark mode option in the settings. Many users have requested this on the community forum.", "priority": Priority.LOW, "status": Status.OPEN, "created_at": "2026-06-26T11:00:00", "updated_at": "2026-06-26T11:00:00"},
    {"customer_name": "David Lee", "customer_email": "david.lee@enterprise.io", "subject": "Data export failing for large datasets", "description": "When exporting datasets larger than 10,000 rows, the export fails silently and returns an empty file. This is blocking our monthly reporting.", "priority": Priority.HIGH, "status": Status.IN_PROGRESS, "created_at": "2026-06-25T08:45:00", "updated_at": "2026-06-27T16:20:00"},
    {"customer_name": "Emma Davis", "customer_email": "emma.davis@startup.co", "subject": "Integration with Slack not working", "description": "The Slack integration stopped sending notifications after the last update. Our team relies on these alerts heavily.", "priority": Priority.MEDIUM, "status": Status.OPEN, "created_at": "2026-06-24T13:20:00", "updated_at": "2026-06-24T13:20:00"},
    {"customer_name": "Frank Brown", "customer_email": "frank.brown@consulting.com", "subject": "Password reset email not received", "description": "I requested a password reset 3 hours ago but never received the email. I checked spam and it's not there either.", "priority": Priority.MEDIUM, "status": Status.RESOLVED, "created_at": "2026-06-23T10:10:00", "updated_at": "2026-06-23T11:30:00"},
    {"customer_name": "Grace Kim", "customer_email": "grace.kim@design.studio", "subject": "Upload limit too restrictive", "description": "The 5MB file upload limit is too restrictive for our design files. Can this be increased to at least 25MB for Pro users?", "priority": Priority.LOW, "status": Status.OPEN, "created_at": "2026-06-22T15:00:00", "updated_at": "2026-06-22T15:00:00"},
    {"customer_name": "Henry Wilson", "customer_email": "henry.wilson@retailco.com", "subject": "API rate limit exceeded unexpectedly", "description": "Our application is hitting API rate limits even though we are well within our plan's quota according to the dashboard.", "priority": Priority.HIGH, "status": Status.IN_PROGRESS, "created_at": "2026-06-21T09:00:00", "updated_at": "2026-06-22T14:00:00"},
    {"customer_name": "Iris Chen", "customer_email": "iris.chen@fintech.app", "subject": "Two-factor authentication not working on iOS", "description": "2FA codes are not being accepted on the iOS app version 3.2.1. The same codes work fine on the web version.", "priority": Priority.MEDIUM, "status": Status.OPEN, "created_at": "2026-06-20T16:45:00", "updated_at": "2026-06-20T16:45:00"},
    {"customer_name": "Jake Thompson", "customer_email": "jake.t@mediahouse.net", "subject": "Reports not generating correctly", "description": "Monthly reports show incorrect totals. The sum column appears to be off by a factor of 10 for some line items.", "priority": Priority.HIGH, "status": Status.RESOLVED, "created_at": "2026-06-19T11:30:00", "updated_at": "2026-06-20T09:00:00"},
    {"customer_name": "Karen Smith", "customer_email": "karen.smith@healthco.org", "subject": "Account suspended without reason", "description": "My account was suspended this morning without any prior notice or email explanation. This is urgent, I need immediate access restored.", "priority": Priority.HIGH, "status": Status.IN_PROGRESS, "created_at": "2026-06-18T07:30:00", "updated_at": "2026-06-18T09:00:00"},
    {"customer_name": "Liam Garcia", "customer_email": "liam.garcia@agency.com", "subject": "Search results not relevant", "description": "The internal search function returns irrelevant results. Searching for 'invoice' shows results about profile settings.", "priority": Priority.LOW, "status": Status.OPEN, "created_at": "2026-06-17T14:10:00", "updated_at": "2026-06-17T14:10:00"},
    {"customer_name": "Mia Rodriguez", "customer_email": "mia.r@nonprofit.org", "subject": "Cannot delete old team members", "description": "When I try to remove former employees from the team, the delete button appears but clicking it does nothing.", "priority": Priority.MEDIUM, "status": Status.RESOLVED, "created_at": "2026-06-16T10:00:00", "updated_at": "2026-06-17T11:00:00"},
    {"customer_name": "Noah Anderson", "customer_email": "noah.a@saas.io", "subject": "Webhook delivery failing intermittently", "description": "Our webhook endpoint receives about 70% of events but the rest are silently dropped. No errors in our logs.", "priority": Priority.HIGH, "status": Status.OPEN, "created_at": "2026-06-15T13:00:00", "updated_at": "2026-06-15T13:00:00"},
    {"customer_name": "Olivia Taylor", "customer_email": "olivia.t@ecommerce.shop", "subject": "CSV import not accepting format", "description": "The CSV import wizard rejects my file saying 'invalid format' even though I followed the template exactly.", "priority": Priority.MEDIUM, "status": Status.IN_PROGRESS, "created_at": "2026-06-14T09:30:00", "updated_at": "2026-06-15T10:00:00"},
    {"customer_name": "Peter Jackson", "customer_email": "peter.j@logistics.co", "subject": "Mobile app crashes on startup", "description": "After installing the latest update (v4.1), the Android app crashes immediately on launch. Tried reinstalling twice.", "priority": Priority.HIGH, "status": Status.OPEN, "created_at": "2026-06-13T08:00:00", "updated_at": "2026-06-13T08:00:00"},
    {"customer_name": "Quinn Parker", "customer_email": "quinn.p@education.edu", "subject": "Email notifications going to spam", "description": "All system emails are landing in spam folders for our organization. Our IT has whitelisted the domain but the issue continues.", "priority": Priority.MEDIUM, "status": Status.RESOLVED, "created_at": "2026-06-12T15:20:00", "updated_at": "2026-06-13T09:00:00"},
    {"customer_name": "Rachel Evans", "customer_email": "rachel.e@photography.co", "subject": "Timezone display incorrect", "description": "All event times display in UTC regardless of my account timezone setting (set to US/Eastern). This causes scheduling confusion.", "priority": Priority.LOW, "status": Status.RESOLVED, "created_at": "2026-06-11T12:00:00", "updated_at": "2026-06-12T10:00:00"},
    {"customer_name": "Sam Mitchell", "customer_email": "sam.m@manufacturing.com", "subject": "Permission settings not saving", "description": "Every time I update team member permissions and save, the settings revert to defaults after page refresh.", "priority": Priority.MEDIUM, "status": Status.IN_PROGRESS, "created_at": "2026-06-10T11:15:00", "updated_at": "2026-06-11T14:00:00"},
    {"customer_name": "Tina Foster", "customer_email": "tina.f@marketing.agency", "subject": "Dashboard widgets not loading", "description": "Three of five dashboard widgets show a loading spinner indefinitely. The issue started after this morning's maintenance window.", "priority": Priority.HIGH, "status": Status.OPEN, "created_at": "2026-06-09T07:45:00", "updated_at": "2026-06-09T07:45:00"},
]


def seed_if_empty(db: Session) -> int:
    existing = db.scalar(select(func.count()).select_from(Ticket)) or 0
    if existing > 0:
        logger.info("Seed skipped: %d tickets already present.", existing)
        return 0

    created = 0
    for data in SEED_TICKETS:
        ticket = Ticket(
            customer_name=data["customer_name"],
            customer_email=data["customer_email"],
            subject=data["subject"],
            description=data["description"],
            priority=data["priority"],
            status=data["status"],
            created_at=_dt(data["created_at"]),
            updated_at=_dt(data["updated_at"]),
        )
        ticket.is_urgent = detect_urgency(ticket.priority, ticket.description)
        db.add(ticket)
        created += 1

    db.commit()
    logger.info("Seeded %d tickets.", created)
    return created
