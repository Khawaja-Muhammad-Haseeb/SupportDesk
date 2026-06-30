"""Urgent-ticket detection.

This logic lives ONLY in the backend. The frontend simply displays the
``is_urgent`` value returned by the API.
"""
import re

from app.models.enums import Priority

_URGENT_WORD = re.compile(r"\burgent\b", re.IGNORECASE)


def detect_urgency(priority: Priority, description: str) -> bool:
    """A ticket is urgent when its priority is HIGH, or its description
    contains the word "urgent" (case-insensitive)."""
    if priority == Priority.HIGH:
        return True
    if description and _URGENT_WORD.search(description):
        return True
    return False
