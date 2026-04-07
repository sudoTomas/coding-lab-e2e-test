"""Tests for scientific calculator module."""
import math
import pytest
from main import (
    add, subtract, multiply, divide,
    power, sqrt,
    sin_deg, cos_deg, tan_deg,
    sin_rad, cos_rad, tan_rad,
    log10, ln, factorial,
    evaluate_expression,
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


# ── Expression evaluator ─────────────────────────────────────────────────────

class TestEvaluateExpression:
    """Tests for the evaluate_expression function."""

    # --- Simple arithmetic ---

    def test_addition(self):
        assert evaluate_expression("2 + 3") == pytest.approx(5.0)

    def test_subtraction(self):
        assert evaluate_expression("10 - 4") == pytest.approx(6.0)

    def test_multiplication(self):
        assert evaluate_expression("3 * 7") == pytest.approx(21.0)

    def test_division(self):
        assert evaluate_expression("10 / 2") == pytest.approx(5.0)

    def test_exponentiation(self):
        assert evaluate_expression("2 ^ 10") == pytest.approx(1024.0)

    # --- Operator precedence ---

    def test_precedence_mul_over_add(self):
        assert evaluate_expression("2 + 3 * 4") == pytest.approx(14.0)

    def test_precedence_div_over_sub(self):
        assert evaluate_expression("10 - 6 / 3") == pytest.approx(8.0)

    def test_precedence_exp_over_mul(self):
        assert evaluate_expression("2 * 3 ^ 2") == pytest.approx(18.0)

    # --- Parentheses ---

    def test_parentheses_basic(self):
        assert evaluate_expression("(2 + 3) * 4") == pytest.approx(20.0)

    def test_nested_parentheses(self):
        assert evaluate_expression("((2 + 3) * (4 - 1))") == pytest.approx(15.0)

    def test_deeply_nested_parentheses(self):
        assert evaluate_expression("(((1 + 2)))") == pytest.approx(3.0)

    # --- Unary minus ---

    def test_unary_minus(self):
        assert evaluate_expression("-5") == pytest.approx(-5.0)

    def test_unary_minus_in_expression(self):
        assert evaluate_expression("3 + -2") == pytest.approx(1.0)

    def test_unary_minus_with_parens(self):
        assert evaluate_expression("-(3 + 2)") == pytest.approx(-5.0)

    # --- Functions ---

    def test_sin_zero(self):
        assert evaluate_expression("sin(0)") == pytest.approx(0.0, abs=1e-9)

    def test_sin_90(self):
        assert evaluate_expression("sin(90)") == pytest.approx(1.0)

    def test_cos_zero(self):
        assert evaluate_expression("cos(0)") == pytest.approx(1.0)

    def test_tan_45(self):
        assert evaluate_expression("tan(45)") == pytest.approx(1.0)

    def test_sqrt_16(self):
        assert evaluate_expression("sqrt(16)") == pytest.approx(4.0)

    def test_log_100(self):
        assert evaluate_expression("log(100)") == pytest.approx(2.0)

    def test_ln_e(self):
        assert evaluate_expression("ln(e)") == pytest.approx(1.0)

    def test_factorial_func(self):
        assert evaluate_expression("factorial(5)") == pytest.approx(120.0)

    def test_power_func(self):
        assert evaluate_expression("power(2, 8)") == pytest.approx(256.0)

    # --- Constants ---

    def test_pi_constant(self):
        assert evaluate_expression("pi") == pytest.approx(math.pi)

    def test_e_constant(self):
        assert evaluate_expression("e") == pytest.approx(math.e)

    def test_constant_in_expression(self):
        assert evaluate_expression("2 * pi") == pytest.approx(2 * math.pi)

    # --- Mixed expressions ---

    def test_mixed_sqrt_and_sin(self):
        assert evaluate_expression("sqrt(16) + sin(0) * 5") == pytest.approx(4.0)

    def test_complex_expression(self):
        # (2 + 3) * sin(45) - sqrt(16) ≈ 5 * 0.7071 - 4 ≈ -0.4645
        result = evaluate_expression("(2 + 3) * sin(45) - sqrt(16)")
        expected = 5 * math.sin(math.radians(45)) - 4
        assert result == pytest.approx(expected)

    def test_nested_functions(self):
        assert evaluate_expression("sqrt(abs(-16))") == pytest.approx(4.0)

    # --- Error cases ---

    def test_empty_expression(self):
        with pytest.raises(ValueError):
            evaluate_expression("")

    def test_whitespace_only(self):
        with pytest.raises(ValueError):
            evaluate_expression("   ")

    def test_invalid_syntax(self):
        with pytest.raises(ValueError):
            evaluate_expression("2 +")

    def test_mismatched_parens(self):
        with pytest.raises(ValueError):
            evaluate_expression("(2 + 3")

    def test_division_by_zero(self):
        with pytest.raises(ZeroDivisionError):
            evaluate_expression("5 / 0")

    def test_sqrt_negative(self):
        with pytest.raises(ValueError):
            evaluate_expression("sqrt(-1)")

    def test_log_negative(self):
        with pytest.raises(ValueError):
            evaluate_expression("log(-5)")

    def test_unknown_function(self):
        with pytest.raises(ValueError):
            evaluate_expression("foo(3)")

    def test_unknown_identifier(self):
        with pytest.raises(ValueError):
            evaluate_expression("xyz + 1")

    def test_unexpected_character(self):
        with pytest.raises(ValueError):
            evaluate_expression("2 & 3")
