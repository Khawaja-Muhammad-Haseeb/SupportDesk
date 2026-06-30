"""Unit tests for the urgent-detection logic."""
from app.models.enums import Priority
from app.utils.urgency import detect_urgency


def test_high_priority_is_urgent():
    assert detect_urgency(Priority.HIGH, "Just a normal description here.") is True


def test_description_with_urgent_word_is_urgent():
    assert detect_urgency(Priority.LOW, "This is URGENT please help now.") is True


def test_urgent_word_case_insensitive():
    assert detect_urgency(Priority.MEDIUM, "Marked as Urgent by customer.") is True


def test_non_urgent_low_priority():
    assert detect_urgency(Priority.LOW, "Everything is calm and fine.") is False


def test_non_urgent_medium_priority():
    assert detect_urgency(Priority.MEDIUM, "A normal medium issue.") is False


def test_urgent_substring_does_not_match():
    # "urgently" contains "urgent" but \b word boundary still matches the stem.
    # Words like "insurgent" should NOT trigger urgency.
    assert detect_urgency(Priority.LOW, "There was an insurgent problem.") is False
