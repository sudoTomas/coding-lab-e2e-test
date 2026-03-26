# Calculator — Project Instructions

Simple calculator with a Python backend module and a web frontend.

## Tech Stack

- **Frontend**: Static HTML/CSS/JS (`index.html`) — no build tools
- **Backend**: Python 3 (`main.py`) — calculator functions
- **Tests**: pytest (Python) + Playwright (UI)

## Development

Start the dev server:
```bash
python serve.py
```
Opens on http://localhost:3000

## Running Tests

**Python unit tests:**
```bash
python -m pytest test_main.py -v
```

**Playwright UI tests:**
```bash
npm install
npx playwright install --with-deps chromium
npx playwright test
```

The Playwright config auto-starts `serve.py` on port 3000.

## Project Structure

```
index.html              # Calculator web UI (single page, no build step)
serve.py                # Python HTTP server (localhost:3000)
main.py                 # Python calculator functions
test_main.py            # Python unit tests
playwright.config.js    # Playwright test config
tests/ui.spec.js        # Playwright UI tests
package.json            # Node deps (Playwright only)
```

## Code Conventions

- Keep the frontend as a single `index.html` with inline CSS and JS
- Use `data-testid` attributes on all interactive elements for Playwright selectors
- Python functions should have type hints and docstrings
