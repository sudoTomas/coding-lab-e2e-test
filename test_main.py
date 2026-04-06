"""Tests for scientific calculator module."""
import math
import pytest
from main import (
    add, subtract, multiply, divide,
    power, sqrt,
    sin_deg, cos_deg, tan_deg,
    sin_rad, cos_rad, tan_rad,
    log10, ln, factorial,
)


# ── Basic arithmetic ──────────────────────────────────────────────────────────

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0.1, 0.2) == pytest.approx(0.3)


def test_subtract():
    assert subtract(5, 2) == 3
    assert subtract(0, 0) == 0
    assert subtract(-3, -1) == -2


def test_multiply():
    assert multiply(3, 4) == 12
    assert multiply(-2, 5) == -10
    assert multiply(0, 999) == 0
    assert multiply(0.5, 4) == pytest.approx(2.0)


def test_divide():
    assert divide(10, 2) == 5
    assert divide(7, 2) == pytest.approx(3.5)
    assert divide(-9, 3) == -3


def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        divide(5, 0)


# ── Power & roots ─────────────────────────────────────────────────────────────

def test_power():
    assert power(2, 10) == pytest.approx(1024.0)
    assert power(3, 0) == pytest.approx(1.0)
    assert power(4, 0.5) == pytest.approx(2.0)
    assert power(2, -1) == pytest.approx(0.5)


def test_sqrt():
    assert sqrt(16) == pytest.approx(4.0)
    assert sqrt(2) == pytest.approx(math.sqrt(2))
    assert sqrt(0) == pytest.approx(0.0)


def test_sqrt_negative():
    with pytest.raises(ValueError):
        sqrt(-1)


# ── Trigonometry (degrees) ────────────────────────────────────────────────────

def test_sin_deg():
    assert sin_deg(0) == pytest.approx(0.0)
    assert sin_deg(30) == pytest.approx(0.5)
    assert sin_deg(90) == pytest.approx(1.0)
    assert sin_deg(180) == pytest.approx(0.0, abs=1e-9)
    assert sin_deg(-90) == pytest.approx(-1.0)


def test_cos_deg():
    assert cos_deg(0) == pytest.approx(1.0)
    assert cos_deg(60) == pytest.approx(0.5)
    assert cos_deg(90) == pytest.approx(0.0, abs=1e-9)
    assert cos_deg(180) == pytest.approx(-1.0)


def test_tan_deg():
    assert tan_deg(0) == pytest.approx(0.0)
    assert tan_deg(45) == pytest.approx(1.0)
    assert tan_deg(-45) == pytest.approx(-1.0)


# ── Trigonometry (radians) ────────────────────────────────────────────────────

def test_sin_rad():
    assert sin_rad(0) == pytest.approx(0.0)
    assert sin_rad(math.pi / 6) == pytest.approx(0.5)
    assert sin_rad(math.pi / 2) == pytest.approx(1.0)


def test_cos_rad():
    assert cos_rad(0) == pytest.approx(1.0)
    assert cos_rad(math.pi / 3) == pytest.approx(0.5)
    assert cos_rad(math.pi) == pytest.approx(-1.0)


def test_tan_rad():
    assert tan_rad(0) == pytest.approx(0.0)
    assert tan_rad(math.pi / 4) == pytest.approx(1.0)


# ── Logarithms ────────────────────────────────────────────────────────────────

def test_log10():
    assert log10(100) == pytest.approx(2.0)
    assert log10(1) == pytest.approx(0.0)
    assert log10(1000) == pytest.approx(3.0)


def test_log10_invalid():
    with pytest.raises(ValueError):
        log10(0)
    with pytest.raises(ValueError):
        log10(-5)


def test_ln():
    assert ln(math.e) == pytest.approx(1.0)
    assert ln(1) == pytest.approx(0.0)
    assert ln(math.e ** 3) == pytest.approx(3.0)


def test_ln_invalid():
    with pytest.raises(ValueError):
        ln(0)
    with pytest.raises(ValueError):
        ln(-1)


# ── Factorial ─────────────────────────────────────────────────────────────────

def test_factorial():
    assert factorial(0) == 1
    assert factorial(1) == 1
    assert factorial(5) == 120
    assert factorial(10) == 3628800


def test_factorial_invalid():
    with pytest.raises(ValueError):
        factorial(-1)
    with pytest.raises(ValueError):
        factorial(2.5)
