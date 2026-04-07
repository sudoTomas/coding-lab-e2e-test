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


# ── Expression Evaluator (Recursive Descent Parser) ──────────────────────────

class _Tokenizer:
    """Tokenizes a mathematical expression string."""

    def __init__(self, expr: str) -> None:
        self.expr = expr
        self.pos = 0
        self.tokens: list[tuple[str, str]] = []
        self._tokenize()
        self.pos = 0

    def _tokenize(self) -> None:
        """Convert expression string into a list of (type, value) tokens."""
        i = 0
        s = self.expr
        while i < len(s):
            ch = s[i]
            if ch.isspace():
                i += 1
                continue
            if ch in '()+-*/^':
                self.tokens.append(('OP', ch))
                i += 1
            elif ch == ',':
                self.tokens.append(('COMMA', ','))
                i += 1
            elif ch.isdigit() or ch == '.':
                j = i
                dot_seen = ch == '.'
                while j + 1 < len(s) and (s[j + 1].isdigit() or (s[j + 1] == '.' and not dot_seen)):
                    j += 1
                    if s[j] == '.':
                        dot_seen = True
                self.tokens.append(('NUM', s[i:j + 1]))
                i = j + 1
            elif ch.isalpha() or ch == '_':
                j = i
                while j + 1 < len(s) and (s[j + 1].isalnum() or s[j + 1] == '_'):
                    j += 1
                self.tokens.append(('ID', s[i:j + 1]))
                i = j + 1
            else:
                raise ValueError(f"Unexpected character: '{ch}'")

    def peek(self) -> tuple[str, str] | None:
        """Look at the current token without consuming it."""
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return None

    def consume(self) -> tuple[str, str]:
        """Consume and return the current token."""
        tok = self.tokens[self.pos]
        self.pos += 1
        return tok

    def expect(self, tok_type: str, tok_val: str | None = None) -> tuple[str, str]:
        """Consume a token, raising ValueError if it doesn't match."""
        if self.pos >= len(self.tokens):
            raise ValueError(f"Expected {tok_val or tok_type}, got end of expression")
        tok = self.consume()
        if tok[0] != tok_type or (tok_val is not None and tok[1] != tok_val):
            raise ValueError(f"Expected {tok_val or tok_type}, got '{tok[1]}'")
        return tok


def _safe_log(x: float) -> float:
    if x <= 0:
        raise ValueError("Logarithm is undefined for non-positive numbers")
    return math.log10(x)


def _safe_ln(x: float) -> float:
    if x <= 0:
        raise ValueError("Logarithm is undefined for non-positive numbers")
    return math.log(x)


def _safe_sqrt(x: float) -> float:
    if x < 0:
        raise ValueError("Cannot take square root of a negative number")
    return math.sqrt(x)


def _safe_factorial(x: float) -> float:
    if x != int(x) or x < 0:
        raise ValueError("Factorial is undefined for negative or non-integer values")
    return float(math.factorial(int(x)))


# Supported functions mapping to callables
_FUNCTIONS: dict[str, object] = {
    'sin': lambda x: math.sin(math.radians(x)),
    'cos': lambda x: math.cos(math.radians(x)),
    'tan': lambda x: math.tan(math.radians(x)),
    'log': _safe_log,
    'ln': _safe_ln,
    'sqrt': _safe_sqrt,
    'factorial': _safe_factorial,
    'abs': lambda x: abs(x),
    'power': lambda x, y: math.pow(x, y),
}

# Constants
_CONSTANTS: dict[str, float] = {
    'pi': math.pi,
    'e': math.e,
}


class _Parser:
    """Recursive descent parser for mathematical expressions.

    Grammar:
        expr       → term (('+' | '-') term)*
        term       → exponent (('*' | '/') exponent)*
        exponent   → unary ('^' exponent)?      (right-associative)
        unary      → '-' unary | primary
        primary    → NUMBER | CONSTANT | func '(' args ')' | '(' expr ')'
    """

    def __init__(self, tokenizer: _Tokenizer) -> None:
        self.tok = tokenizer

    def parse(self) -> float:
        """Parse the full expression and return result."""
        result = self._expr()
        if self.tok.peek() is not None:
            raise ValueError(f"Unexpected token: '{self.tok.peek()[1]}'")
        return result

    def _expr(self) -> float:
        """Parse addition and subtraction (lowest precedence)."""
        left = self._term()
        while self.tok.peek() and self.tok.peek()[0] == 'OP' and self.tok.peek()[1] in ('+', '-'):
            op = self.tok.consume()[1]
            right = self._term()
            if op == '+':
                left = left + right
            else:
                left = left - right
        return left

    def _term(self) -> float:
        """Parse multiplication and division."""
        left = self._exponent()
        while self.tok.peek() and self.tok.peek()[0] == 'OP' and self.tok.peek()[1] in ('*', '/'):
            op = self.tok.consume()[1]
            right = self._exponent()
            if op == '*':
                left = left * right
            else:
                if right == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                left = left / right
        return left

    def _exponent(self) -> float:
        """Parse exponentiation (right-associative)."""
        base = self._unary()
        if self.tok.peek() and self.tok.peek()[0] == 'OP' and self.tok.peek()[1] == '^':
            self.tok.consume()
            exp = self._exponent()  # right-associative via recursion
            base = math.pow(base, exp)
        return base

    def _unary(self) -> float:
        """Parse unary minus."""
        if self.tok.peek() and self.tok.peek()[0] == 'OP' and self.tok.peek()[1] == '-':
            self.tok.consume()
            return -self._unary()
        return self._primary()

    def _primary(self) -> float:
        """Parse numbers, constants, function calls, and parenthesized expressions."""
        tok = self.tok.peek()
        if tok is None:
            raise ValueError("Unexpected end of expression")

        # Number literal
        if tok[0] == 'NUM':
            self.tok.consume()
            return float(tok[1])

        # Identifier: constant or function call
        if tok[0] == 'ID':
            name = tok[1].lower()
            self.tok.consume()

            # Check for function call
            if self.tok.peek() and self.tok.peek()[0] == 'OP' and self.tok.peek()[1] == '(':
                if name not in _FUNCTIONS:
                    raise ValueError(f"Unknown function: '{name}'")
                self.tok.consume()  # consume '('
                args = [self._expr()]
                while self.tok.peek() and self.tok.peek()[0] == 'COMMA':
                    self.tok.consume()
                    args.append(self._expr())
                self.tok.expect('OP', ')')
                try:
                    return float(_FUNCTIONS[name](*args))
                except TypeError:
                    raise ValueError(f"Wrong number of arguments for '{name}'")

            # Constant
            if name in _CONSTANTS:
                return _CONSTANTS[name]

            raise ValueError(f"Unknown identifier: '{name}'")

        # Parenthesized expression
        if tok[0] == 'OP' and tok[1] == '(':
            self.tok.consume()
            result = self._expr()
            self.tok.expect('OP', ')')
            return result

        raise ValueError(f"Unexpected token: '{tok[1]}'")


def evaluate_expression(expr: str) -> float:
    """Evaluate a mathematical expression string safely.

    Supports arithmetic (+, -, *, /, ^), parentheses, functions
    (sin, cos, tan, log, ln, sqrt, factorial, abs, power), and
    constants (pi, e). Trigonometric functions use degrees.

    Args:
        expr: The expression string to evaluate.

    Returns:
        The numeric result as a float.

    Raises:
        ValueError: If the expression is invalid or contains domain errors.
        ZeroDivisionError: If division by zero occurs.
    """
    if not expr or not expr.strip():
        raise ValueError("Empty expression")
    tokenizer = _Tokenizer(expr.strip())
    parser = _Parser(tokenizer)
    result = parser.parse()
    if not math.isfinite(result):
        raise ValueError("Result is not finite")
    return result


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
