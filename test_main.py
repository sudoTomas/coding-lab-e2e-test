"""Tests for calculator module."""
import pytest
from main import add, subtract, divide


def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0


def test_subtract():
    assert subtract(5, 2) == 3
    assert subtract(0, 0) == 0


def test_divide():
    assert divide(10, 2) == 5.0
    assert divide(7, 2) == 3.5
    assert divide(-6, 3) == -2.0
    assert isinstance(divide(4, 2), float)


def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(1, 0)
