"""Scientific calculator module."""
import math


def add(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b


def subtract(a: float, b: float) -> float:
    """Subtract b from a."""
    return a - b


def multiply(a: float, b: float) -> float:
    """Multiply two numbers."""
    return a * b


def divide(a: float, b: float) -> float:
    """Divide a by b.

    Raises:
        ZeroDivisionError: If b is zero.
    """
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero")
    return a / b


def power(base: float, exp: float) -> float:
    """Raise base to the power of exp."""
    return math.pow(base, exp)


def sqrt(x: float) -> float:
    """Square root of x.

    Raises:
        ValueError: If x is negative.
    """
    if x < 0:
        raise ValueError("Cannot take square root of a negative number")
    return math.sqrt(x)


def sin_deg(x: float) -> float:
    """Sine of x given in degrees."""
    return math.sin(math.radians(x))


def cos_deg(x: float) -> float:
    """Cosine of x given in degrees."""
    return math.cos(math.radians(x))


def tan_deg(x: float) -> float:
    """Tangent of x given in degrees.

    Raises:
        ValueError: If tangent is undefined at the given angle (e.g. 90°, 270°).
    """
    result = math.tan(math.radians(x))
    if not math.isfinite(result):
        raise ValueError("Tangent is undefined at this angle")
    return result


def sin_rad(x: float) -> float:
    """Sine of x given in radians."""
    return math.sin(x)


def cos_rad(x: float) -> float:
    """Cosine of x given in radians."""
    return math.cos(x)


def tan_rad(x: float) -> float:
    """Tangent of x given in radians.

    Raises:
        ValueError: If tangent is undefined at the given angle.
    """
    result = math.tan(x)
    if not math.isfinite(result):
        raise ValueError("Tangent is undefined at this angle")
    return result


def log10(x: float) -> float:
    """Base-10 logarithm of x.

    Raises:
        ValueError: If x is not positive.
    """
    if x <= 0:
        raise ValueError("Logarithm is undefined for non-positive numbers")
    return math.log10(x)


def ln(x: float) -> float:
    """Natural logarithm of x.

    Raises:
        ValueError: If x is not positive.
    """
    if x <= 0:
        raise ValueError("Logarithm is undefined for non-positive numbers")
    return math.log(x)


def factorial(n: float) -> int:
    """Factorial of non-negative integer n.

    Raises:
        ValueError: If n is negative or not an integer.
    """
    if n != int(n) or n < 0:
        raise ValueError("Factorial is undefined for negative or non-integer values")
    return math.factorial(int(n))


if __name__ == "__main__":
    print(f"2 + 3 = {add(2, 3)}")
    print(f"5 - 2 = {subtract(5, 2)}")
    print(f"3 × 4 = {multiply(3, 4)}")
    print(f"10 ÷ 2 = {divide(10, 2)}")
    print(f"2 ^ 8 = {power(2, 8)}")
    print(f"√16 = {sqrt(16)}")
    print(f"sin(30°) = {sin_deg(30)}")
    print(f"cos(60°) = {cos_deg(60)}")
    print(f"log(100) = {log10(100)}")
    print(f"ln(e) = {ln(math.e)}")
    print(f"5! = {factorial(5)}")
