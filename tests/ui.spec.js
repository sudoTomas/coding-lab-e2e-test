// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Calculator UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page loads with calculator visible", async ({ page }) => {
    await expect(page.getByTestId("calculator")).toBeVisible();
    await expect(page.getByTestId("display")).toBeVisible();
    await expect(page.getByTestId("value")).toHaveText("0");
  });

  test("all number buttons render", async ({ page }) => {
    for (const n of ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
      await expect(page.getByTestId(`btn-${n}`)).toBeVisible();
    }
  });

  test("all operator buttons render", async ({ page }) => {
    await expect(page.getByTestId("btn-add")).toBeVisible();
    await expect(page.getByTestId("btn-subtract")).toBeVisible();
    await expect(page.getByTestId("btn-multiply")).toBeVisible();
    await expect(page.getByTestId("btn-divide")).toBeVisible();
    await expect(page.getByTestId("btn-equals")).toBeVisible();
    await expect(page.getByTestId("btn-clear")).toBeVisible();
  });

  test("backspace button is visible", async ({ page }) => {
    await expect(page.getByTestId("btn-backspace")).toBeVisible();
  });

  test("backspace button deletes last digit", async ({ page }) => {
    await page.getByTestId("btn-4").click();
    await page.getByTestId("btn-2").click();
    await page.getByTestId("btn-backspace").click();
    await expect(page.getByTestId("value")).toHaveText("4");
  });

  test("backspace button on single digit resets to zero", async ({ page }) => {
    await page.getByTestId("btn-7").click();
    await page.getByTestId("btn-backspace").click();
    await expect(page.getByTestId("value")).toHaveText("0");
  });

  test("backspace button on multi-digit number removes one digit at a time", async ({ page }) => {
    await page.getByTestId("btn-1").click();
    await page.getByTestId("btn-2").click();
    await page.getByTestId("btn-3").click();
    await page.getByTestId("btn-backspace").click();
    await expect(page.getByTestId("value")).toHaveText("12");
    await page.getByTestId("btn-backspace").click();
    await expect(page.getByTestId("value")).toHaveText("1");
    await page.getByTestId("btn-backspace").click();
    await expect(page.getByTestId("value")).toHaveText("0");
  });

  test("clicking digits updates display", async ({ page }) => {
    await page.getByTestId("btn-4").click();
    await page.getByTestId("btn-2").click();
    await expect(page.getByTestId("value")).toHaveText("42");
  });

  test("addition works", async ({ page }) => {
    await page.getByTestId("btn-2").click();
    await page.getByTestId("btn-add").click();
    await page.getByTestId("btn-3").click();
    await page.getByTestId("btn-equals").click();
    await expect(page.getByTestId("value")).toHaveText("5");
  });

  test("subtraction works", async ({ page }) => {
    await page.getByTestId("btn-9").click();
    await page.getByTestId("btn-subtract").click();
    await page.getByTestId("btn-4").click();
    await page.getByTestId("btn-equals").click();
    await expect(page.getByTestId("value")).toHaveText("5");
  });

  test("multiplication works", async ({ page }) => {
    await page.getByTestId("btn-6").click();
    await page.getByTestId("btn-multiply").click();
    await page.getByTestId("btn-7").click();
    await page.getByTestId("btn-equals").click();
    await expect(page.getByTestId("value")).toHaveText("42");
  });

  test("division works", async ({ page }) => {
    await page.getByTestId("btn-8").click();
    await page.getByTestId("btn-divide").click();
    await page.getByTestId("btn-2").click();
    await page.getByTestId("btn-equals").click();
    await expect(page.getByTestId("value")).toHaveText("4");
  });

  test("clear resets display", async ({ page }) => {
    await page.getByTestId("btn-5").click();
    await page.getByTestId("btn-clear").click();
    await expect(page.getByTestId("value")).toHaveText("0");
    await expect(page.getByTestId("expression")).toHaveText("");
  });

  test("division by zero shows error", async ({ page }) => {
    await page.getByTestId("btn-5").click();
    await page.getByTestId("btn-divide").click();
    await page.getByTestId("btn-0").click();
    await page.getByTestId("btn-equals").click();
    await expect(page.getByTestId("value")).toHaveText("Error");
  });

  test("expression shows during operation", async ({ page }) => {
    await page.getByTestId("btn-3").click();
    await page.getByTestId("btn-add").click();
    await expect(page.getByTestId("expression")).toContainText("3");
    await expect(page.getByTestId("expression")).toContainText("+");
  });

  // Keyboard support tests
  test.describe("Keyboard support", () => {
    test("keyboard digits update display", async ({ page }) => {
      await page.keyboard.press("4");
      await page.keyboard.press("2");
      await expect(page.getByTestId("value")).toHaveText("42");
    });

    test("keyboard addition", async ({ page }) => {
      await page.keyboard.press("7");
      await page.keyboard.press("+");
      await page.keyboard.press("3");
      await page.keyboard.press("Enter");
      await expect(page.getByTestId("value")).toHaveText("10");
    });

    test("keyboard subtraction", async ({ page }) => {
      await page.keyboard.press("9");
      await page.keyboard.press("-");
      await page.keyboard.press("4");
      await page.keyboard.press("Enter");
      await expect(page.getByTestId("value")).toHaveText("5");
    });

    test("keyboard multiplication", async ({ page }) => {
      await page.keyboard.press("6");
      await page.keyboard.press("*");
      await page.keyboard.press("7");
      await page.keyboard.press("Enter");
      await expect(page.getByTestId("value")).toHaveText("42");
    });

    test("keyboard division", async ({ page }) => {
      await page.keyboard.press("8");
      await page.keyboard.press("/");
      await page.keyboard.press("2");
      await page.keyboard.press("Enter");
      await expect(page.getByTestId("value")).toHaveText("4");
    });

    test("keyboard Escape clears display", async ({ page }) => {
      await page.keyboard.press("5");
      await page.keyboard.press("Escape");
      await expect(page.getByTestId("value")).toHaveText("0");
    });

    test("keyboard equals sign triggers calculation", async ({ page }) => {
      await page.keyboard.press("3");
      await page.keyboard.press("+");
      await page.keyboard.press("4");
      await page.keyboard.press("=");
      await expect(page.getByTestId("value")).toHaveText("7");
    });

    test("keyboard decimal input", async ({ page }) => {
      await page.keyboard.press("1");
      await page.keyboard.press(".");
      await page.keyboard.press("5");
      await expect(page.getByTestId("value")).toHaveText("1.5");
    });

    test("keyboard percent key applies percent", async ({ page }) => {
      await page.keyboard.press("2");
      await page.keyboard.press("0");
      await page.keyboard.press("0");
      await page.keyboard.press("%");
      await expect(page.getByTestId("value")).toHaveText("2");
    });

    test("Backspace deletes last digit", async ({ page }) => {
      await page.keyboard.press("4");
      await page.keyboard.press("2");
      await page.keyboard.press("Backspace");
      await expect(page.getByTestId("value")).toHaveText("4");
    });

    test("Backspace on single digit resets to zero", async ({ page }) => {
      await page.keyboard.press("7");
      await page.keyboard.press("Backspace");
      await expect(page.getByTestId("value")).toHaveText("0");
    });

    test("Backspace on negated single digit resets to zero, not bare minus", async ({ page }) => {
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-sign").click(); // −5
      await page.keyboard.press("Backspace");
      await expect(page.getByTestId("value")).toHaveText("0");
    });
  });

  // History panel tests
  test.describe("History panel", () => {
    test("history panel is visible", async ({ page }) => {
      await expect(page.getByTestId("history-panel")).toBeVisible();
    });

    test("history list is visible", async ({ page }) => {
      await expect(page.getByTestId("history-list")).toBeVisible();
    });

    test("clear history button is visible", async ({ page }) => {
      await expect(page.getByTestId("btn-clear-history")).toBeVisible();
    });

    test("shows empty message initially", async ({ page }) => {
      await expect(page.getByTestId("history-empty")).toBeVisible();
      await expect(page.getByTestId("history-empty")).toHaveText("No history yet");
    });

    test("shows calculation in history after equals", async ({ page }) => {
      await page.getByTestId("btn-3").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-equals").click();
      await expect(page.getByTestId("history-item-0")).toBeVisible();
      await expect(page.getByTestId("history-result-0")).toHaveText("8");
    });

    test("history expression contains operands and operator", async ({ page }) => {
      await page.getByTestId("btn-4").click();
      await page.getByTestId("btn-multiply").click();
      await page.getByTestId("btn-6").click();
      await page.getByTestId("btn-equals").click();
      await expect(page.getByTestId("history-expression-0")).toContainText("4");
      await expect(page.getByTestId("history-expression-0")).toContainText("6");
    });

    test("newest calculation appears at top of history", async ({ page }) => {
      // First calculation: 2 + 3 = 5
      await page.getByTestId("btn-2").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-3").click();
      await page.getByTestId("btn-equals").click();

      // Second calculation: 9 - 1 = 8
      await page.getByTestId("btn-9").click();
      await page.getByTestId("btn-subtract").click();
      await page.getByTestId("btn-1").click();
      await page.getByTestId("btn-equals").click();

      // Most recent (9-1=8) should be at index 0
      await expect(page.getByTestId("history-result-0")).toHaveText("8");
      // First calculation (2+3=5) should be at index 1
      await expect(page.getByTestId("history-result-1")).toHaveText("5");
    });

    test("history keeps at most 5 entries", async ({ page }) => {
      const calculations = [
        ["btn-1", "btn-add", "btn-1"],
        ["btn-2", "btn-add", "btn-2"],
        ["btn-3", "btn-add", "btn-3"],
        ["btn-4", "btn-add", "btn-4"],
        ["btn-5", "btn-add", "btn-5"],
        ["btn-6", "btn-add", "btn-6"],
      ];

      for (const [a, op, b] of calculations) {
        await page.getByTestId("btn-clear").click();
        await page.getByTestId(a).click();
        await page.getByTestId(op).click();
        await page.getByTestId(b).click();
        await page.getByTestId("btn-equals").click();
      }

      // Should have exactly 5 history items (indices 0-4)
      await expect(page.getByTestId("history-item-0")).toBeVisible();
      await expect(page.getByTestId("history-item-4")).toBeVisible();
      await expect(page.getByTestId("history-item-5")).not.toBeAttached();
    });

    test("clear history button removes all entries", async ({ page }) => {
      await page.getByTestId("btn-2").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-3").click();
      await page.getByTestId("btn-equals").click();
      await expect(page.getByTestId("history-item-0")).toBeVisible();

      await page.getByTestId("btn-clear-history").click();
      await expect(page.getByTestId("history-empty")).toBeVisible();
      await expect(page.getByTestId("history-empty")).toHaveText("No history yet");
    });

    test("history works with keyboard input", async ({ page }) => {
      await page.keyboard.press("5");
      await page.keyboard.press("+");
      await page.keyboard.press("5");
      await page.keyboard.press("Enter");
      await expect(page.getByTestId("history-item-0")).toBeVisible();
      await expect(page.getByTestId("history-result-0")).toHaveText("10");
    });

    // Percentage display tests
    test("shows 100% for the most recent calculation", async ({ page }) => {
      // 5 × 4 = 20
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-multiply").click();
      await page.getByTestId("btn-4").click();
      await page.getByTestId("btn-equals").click();
      await expect(page.getByTestId("history-percentage-0")).toHaveText("100%");
    });

    test("shows correct percentage for older history items relative to latest", async ({ page }) => {
      // First calculation: 2 + 3 = 5
      await page.getByTestId("btn-2").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-3").click();
      await page.getByTestId("btn-equals").click();

      // Second (latest) calculation: 5 + 5 = 10
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-equals").click();

      // Latest result (10) → 100%
      await expect(page.getByTestId("history-percentage-0")).toHaveText("100%");
      // Previous result (5) is 50% of 10
      await expect(page.getByTestId("history-percentage-1")).toHaveText("50%");
    });

    test("shows no percentage when latest result is zero", async ({ page }) => {
      // 5 - 5 = 0 (latest result is zero, cannot compute percentage)
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-subtract").click();
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-equals").click();
      await expect(page.getByTestId("history-percentage-0")).toHaveText("");
    });

    test("shows no percentage when latest result is an error", async ({ page }) => {
      // 5 ÷ 0 = Error
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-divide").click();
      await page.getByTestId("btn-0").click();
      await page.getByTestId("btn-equals").click();
      await expect(page.getByTestId("history-percentage-0")).toHaveText("");
    });

    test("percentage updates when a new calculation is added", async ({ page }) => {
      // First: 5 + 5 = 10
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-equals").click();
      // Only one entry, latest is 100%
      await expect(page.getByTestId("history-percentage-0")).toHaveText("100%");

      // Second: 4 × 5 = 20 (new latest)
      await page.getByTestId("btn-4").click();
      await page.getByTestId("btn-multiply").click();
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-equals").click();

      // New latest (20) → 100%; old result (10) → 50% of 20
      await expect(page.getByTestId("history-percentage-0")).toHaveText("100%");
      await expect(page.getByTestId("history-percentage-1")).toHaveText("50%");
    });

    test("shows no percentage for an older history item that is an error", async ({ page }) => {
      // First: 5 ÷ 0 = Error
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-divide").click();
      await page.getByTestId("btn-0").click();
      await page.getByTestId("btn-equals").click();

      // Second (latest): 3 + 0 = 3
      await page.getByTestId("btn-3").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-0").click();
      await page.getByTestId("btn-equals").click();

      // Latest result (3) → 100%
      await expect(page.getByTestId("history-percentage-0")).toHaveText("100%");
      // Older Error result → no percentage
      await expect(page.getByTestId("history-percentage-1")).toHaveText("");
    });

    test("shows decimal percentage for non-integer results", async ({ page }) => {
      // First: 1 + 0 = 1
      await page.getByTestId("btn-1").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-0").click();
      await page.getByTestId("btn-equals").click();

      // Second (latest): 3 + 0 = 3
      await page.getByTestId("btn-3").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-0").click();
      await page.getByTestId("btn-equals").click();

      // Latest result (3) → 100%
      await expect(page.getByTestId("history-percentage-0")).toHaveText("100%");
      // Prior result (1) is 33.33% of 3
      await expect(page.getByTestId("history-percentage-1")).toHaveText("33.33%");
    });

    test("shows no percentage when latest result is negative", async ({ page }) => {
      // First: 3 + 0 = 3
      await page.getByTestId("btn-3").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-0").click();
      await page.getByTestId("btn-equals").click();

      // Second (latest): 5 - 8 = -3
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-subtract").click();
      await page.getByTestId("btn-8").click();
      await page.getByTestId("btn-equals").click();

      // Latest result is -3 (negative) → no percentage shown
      await expect(page.getByTestId("history-percentage-0")).toHaveText("");
      // Older result (3) → no percentage shown (latest is invalid)
      await expect(page.getByTestId("history-percentage-1")).toHaveText("");
    });

    test("shows 0% for an older history item with a zero result", async ({ page }) => {
      // First: 5 - 5 = 0
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-subtract").click();
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-equals").click();

      // Second (latest): 5 + 5 = 10
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-equals").click();

      // Latest result (10) → 100%
      await expect(page.getByTestId("history-percentage-0")).toHaveText("100%");
      // Older result (0) → 0% of 10
      await expect(page.getByTestId("history-percentage-1")).toHaveText("0%");
    });

    // Tooltip tests
    test("tooltip is not visible before hovering history item", async ({ page }) => {
      await page.getByTestId("btn-4").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-equals").click();
      await expect(page.getByTestId("history-tooltip-0")).not.toBeVisible();
    });

    test("tooltip shows full expression on hover", async ({ page }) => {
      await page.getByTestId("btn-4").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-5").click();
      await page.getByTestId("btn-equals").click();
      await page.getByTestId("history-item-0").hover();
      await expect(page.getByTestId("history-tooltip-0")).toBeVisible();
      await expect(page.getByTestId("history-tooltip-0")).toContainText("+");
    });

    test("tooltip contains the same text as the history expression", async ({ page }) => {
      await page.getByTestId("btn-7").click();
      await page.getByTestId("btn-multiply").click();
      await page.getByTestId("btn-3").click();
      await page.getByTestId("btn-equals").click();
      const exprText = await page.getByTestId("history-expression-0").textContent();
      await page.getByTestId("history-item-0").hover();
      await expect(page.getByTestId("history-tooltip-0")).toHaveText(exprText);
    });

    test("tooltip works for older history items (index 1)", async ({ page }) => {
      // First calculation
      await page.getByTestId("btn-2").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-3").click();
      await page.getByTestId("btn-equals").click();
      // Second calculation pushes the first to index 1
      await page.getByTestId("btn-7").click();
      await page.getByTestId("btn-multiply").click();
      await page.getByTestId("btn-2").click();
      await page.getByTestId("btn-equals").click();

      const exprText = await page.getByTestId("history-expression-1").textContent();
      await page.getByTestId("history-item-1").hover();
      await expect(page.getByTestId("history-tooltip-1")).toBeVisible();
      await expect(page.getByTestId("history-tooltip-1")).toHaveText(exprText);
    });

    test("tooltip shows on keyboard focus within history item", async ({ page }) => {
      await page.getByTestId("btn-6").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-4").click();
      await page.getByTestId("btn-equals").click();
      await page.getByTestId("history-item-0").focus();
      await expect(page.getByTestId("history-tooltip-0")).toBeVisible();
    });
  });

  // Theme switcher tests
  test.describe("Theme Switcher", () => {
    // Emulate dark color scheme so theme defaults are consistent across all theme tests
    test.use({ colorScheme: "dark" });

    test("theme switcher is visible", async ({ page }) => {
      await expect(page.getByTestId("theme-switcher")).toBeVisible();
    });

    test("all four theme buttons are visible", async ({ page }) => {
      await expect(page.getByTestId("theme-btn-dark")).toBeVisible();
      await expect(page.getByTestId("theme-btn-light")).toBeVisible();
      await expect(page.getByTestId("theme-btn-ocean")).toBeVisible();
      await expect(page.getByTestId("theme-btn-sunset")).toBeVisible();
    });

    test("dark theme button is active by default", async ({ page }) => {
      await expect(page.getByTestId("theme-btn-dark")).toHaveClass(/active/);
      await expect(page.locator("body")).toHaveClass(/theme-dark/);
    });

    test("clicking light theme applies theme-light class to body", async ({ page }) => {
      await page.getByTestId("theme-btn-light").click();
      await expect(page.locator("body")).toHaveClass(/theme-light/);
    });

    test("clicking light theme marks its button as active", async ({ page }) => {
      await page.getByTestId("theme-btn-light").click();
      await expect(page.getByTestId("theme-btn-light")).toHaveClass(/active/);
      await expect(page.getByTestId("theme-btn-dark")).not.toHaveClass(/active/);
    });

    test("clicking ocean theme applies theme-ocean class to body", async ({ page }) => {
      await page.getByTestId("theme-btn-ocean").click();
      await expect(page.locator("body")).toHaveClass(/theme-ocean/);
    });

    test("clicking ocean theme marks its button as active", async ({ page }) => {
      await page.getByTestId("theme-btn-ocean").click();
      await expect(page.getByTestId("theme-btn-ocean")).toHaveClass(/active/);
      await expect(page.getByTestId("theme-btn-dark")).not.toHaveClass(/active/);
    });

    test("clicking sunset theme applies theme-sunset class to body", async ({ page }) => {
      await page.getByTestId("theme-btn-sunset").click();
      await expect(page.locator("body")).toHaveClass(/theme-sunset/);
    });

    test("clicking sunset theme marks its button as active", async ({ page }) => {
      await page.getByTestId("theme-btn-sunset").click();
      await expect(page.getByTestId("theme-btn-sunset")).toHaveClass(/active/);
      await expect(page.getByTestId("theme-btn-dark")).not.toHaveClass(/active/);
    });

    test("switching back to dark removes other theme classes from body", async ({ page }) => {
      await page.getByTestId("theme-btn-light").click();
      await expect(page.locator("body")).toHaveClass(/theme-light/);
      await page.getByTestId("theme-btn-dark").click();
      await expect(page.locator("body")).not.toHaveClass(/theme-light/);
      await expect(page.locator("body")).toHaveClass(/theme-dark/);
      await expect(page.getByTestId("theme-btn-dark")).toHaveClass(/active/);
    });

    test("only one theme button is active at a time", async ({ page }) => {
      await page.getByTestId("theme-btn-ocean").click();
      const activeDots = await page.locator(".theme-dot.active").count();
      expect(activeDots).toBe(1);
    });

    test("theme choice is saved to localStorage", async ({ page }) => {
      await page.getByTestId("theme-btn-ocean").click();
      const stored = await page.evaluate(() => localStorage.getItem("calc-theme"));
      expect(stored).toBe("ocean");
    });

    test("saved theme is restored after page reload", async ({ page }) => {
      await page.getByTestId("theme-btn-sunset").click();
      await page.reload();
      await expect(page.locator("body")).toHaveClass(/theme-sunset/);
      await expect(page.getByTestId("theme-btn-sunset")).toHaveClass(/active/);
    });

    test("calculator still works correctly after switching theme", async ({ page }) => {
      await page.getByTestId("theme-btn-light").click();
      await page.getByTestId("btn-4").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-3").click();
      await page.getByTestId("btn-equals").click();
      await expect(page.getByTestId("value")).toHaveText("7");
    });

    // prefers-color-scheme default tests
    test.describe("System color scheme preference", () => {
      test("defaults to light theme when system prefers light and no saved theme", async ({ page }) => {
        // Override to light color scheme, clear storage, reload so JS re-runs with light preference
        await page.emulateMedia({ colorScheme: "light" });
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await expect(page.getByTestId("theme-btn-light")).toHaveClass(/active/);
        await expect(page.locator("body")).toHaveClass(/theme-light/);
      });

      test("defaults to dark theme when system prefers dark and no saved theme", async ({ page }) => {
        // Already using dark color scheme from parent test.use; clear storage and reload
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await expect(page.getByTestId("theme-btn-dark")).toHaveClass(/active/);
        await expect(page.locator("body")).toHaveClass(/theme-dark/);
      });

      test("saved theme overrides system color scheme preference", async ({ page }) => {
        // Even with dark system preference, a saved theme should take precedence
        await page.evaluate(() => localStorage.setItem("calc-theme", "ocean"));
        await page.reload();
        await expect(page.getByTestId("theme-btn-ocean")).toHaveClass(/active/);
        await expect(page.locator("body")).toHaveClass(/theme-ocean/);
      });
    });

    // Keyboard navigation tests
    test.describe("Keyboard navigation", () => {
      test("theme dots container has radiogroup role", async ({ page }) => {
        await expect(page.locator(".theme-dots")).toHaveAttribute("role", "radiogroup");
      });

      test("theme dot buttons have radio role and aria-checked attributes", async ({ page }) => {
        await expect(page.getByTestId("theme-btn-dark")).toHaveAttribute("role", "radio");
        await expect(page.getByTestId("theme-btn-dark")).toHaveAttribute("aria-checked", "true");
        await expect(page.getByTestId("theme-btn-light")).toHaveAttribute("aria-checked", "false");
        await expect(page.getByTestId("theme-btn-ocean")).toHaveAttribute("aria-checked", "false");
        await expect(page.getByTestId("theme-btn-sunset")).toHaveAttribute("aria-checked", "false");
      });

      test("clicking a theme updates aria-checked correctly", async ({ page }) => {
        await page.getByTestId("theme-btn-ocean").click();
        await expect(page.getByTestId("theme-btn-ocean")).toHaveAttribute("aria-checked", "true");
        await expect(page.getByTestId("theme-btn-dark")).toHaveAttribute("aria-checked", "false");
      });

      test("ArrowRight moves to next theme", async ({ page }) => {
        // Dark is active; ArrowRight should move to light
        await page.getByTestId("theme-btn-dark").focus();
        await page.keyboard.press("ArrowRight");
        await expect(page.getByTestId("theme-btn-light")).toHaveClass(/active/);
        await expect(page.locator("body")).toHaveClass(/theme-light/);
      });

      test("ArrowLeft moves to previous theme", async ({ page }) => {
        // Switch to light first, then ArrowLeft should move back to dark
        await page.getByTestId("theme-btn-light").click();
        await page.getByTestId("theme-btn-light").focus();
        await page.keyboard.press("ArrowLeft");
        await expect(page.getByTestId("theme-btn-dark")).toHaveClass(/active/);
        await expect(page.locator("body")).toHaveClass(/theme-dark/);
      });

      test("ArrowRight wraps around from last theme to first", async ({ page }) => {
        await page.getByTestId("theme-btn-sunset").click();
        await page.getByTestId("theme-btn-sunset").focus();
        await page.keyboard.press("ArrowRight");
        await expect(page.getByTestId("theme-btn-dark")).toHaveClass(/active/);
      });

      test("ArrowLeft wraps around from first theme to last", async ({ page }) => {
        // Dark is first; ArrowLeft should wrap to sunset (last)
        await page.getByTestId("theme-btn-dark").focus();
        await page.keyboard.press("ArrowLeft");
        await expect(page.getByTestId("theme-btn-sunset")).toHaveClass(/active/);
      });

      test("ArrowDown moves to next theme", async ({ page }) => {
        await page.getByTestId("theme-btn-dark").focus();
        await page.keyboard.press("ArrowDown");
        await expect(page.getByTestId("theme-btn-light")).toHaveClass(/active/);
      });

      test("ArrowUp moves to previous theme", async ({ page }) => {
        await page.getByTestId("theme-btn-light").click();
        await page.getByTestId("theme-btn-light").focus();
        await page.keyboard.press("ArrowUp");
        await expect(page.getByTestId("theme-btn-dark")).toHaveClass(/active/);
      });
    });
  });

  // Font Size Switcher tests
  test.describe("Font Size Switcher", () => {
    test.beforeEach(async ({ page }) => {
      // Start each test with a clean font-size key so stored value never bleeds between tests
      await page.evaluate(() => localStorage.removeItem("calc-font-size"));
      await page.reload();
    });

    // --- Visibility and structure ---

    test("font size switcher is visible", async ({ page }) => {
      await expect(page.getByTestId("font-size-switcher")).toBeVisible();
    });

    test("all three font size buttons are visible", async ({ page }) => {
      await expect(page.getByTestId("font-size-btn-small")).toBeVisible();
      await expect(page.getByTestId("font-size-btn-medium")).toBeVisible();
      await expect(page.getByTestId("font-size-btn-large")).toBeVisible();
    });

    test("font size options container has radiogroup role", async ({ page }) => {
      await expect(page.locator(".font-size-options")).toHaveAttribute("role", "radiogroup");
    });

    test("font size buttons have radio role", async ({ page }) => {
      await expect(page.getByTestId("font-size-btn-small")).toHaveAttribute("role", "radio");
      await expect(page.getByTestId("font-size-btn-medium")).toHaveAttribute("role", "radio");
      await expect(page.getByTestId("font-size-btn-large")).toHaveAttribute("role", "radio");
    });

    // --- Default state ---

    test("medium is the default active font size", async ({ page }) => {
      await expect(page.getByTestId("font-size-btn-medium")).toHaveClass(/active/);
      await expect(page.locator("body")).toHaveClass(/font-size-medium/);
    });

    test("medium button has aria-checked true by default", async ({ page }) => {
      await expect(page.getByTestId("font-size-btn-medium")).toHaveAttribute("aria-checked", "true");
      await expect(page.getByTestId("font-size-btn-small")).toHaveAttribute("aria-checked", "false");
      await expect(page.getByTestId("font-size-btn-large")).toHaveAttribute("aria-checked", "false");
    });

    // --- Clicking ---

    test("clicking small applies font-size-small class to body", async ({ page }) => {
      await page.getByTestId("font-size-btn-small").click();
      await expect(page.locator("body")).toHaveClass(/font-size-small/);
    });

    test("clicking small marks its button as active and deactivates others", async ({ page }) => {
      await page.getByTestId("font-size-btn-small").click();
      await expect(page.getByTestId("font-size-btn-small")).toHaveClass(/active/);
      await expect(page.getByTestId("font-size-btn-medium")).not.toHaveClass(/active/);
      await expect(page.getByTestId("font-size-btn-large")).not.toHaveClass(/active/);
    });

    test("clicking large applies font-size-large class to body", async ({ page }) => {
      await page.getByTestId("font-size-btn-large").click();
      await expect(page.locator("body")).toHaveClass(/font-size-large/);
    });

    test("clicking large marks its button as active and deactivates others", async ({ page }) => {
      await page.getByTestId("font-size-btn-large").click();
      await expect(page.getByTestId("font-size-btn-large")).toHaveClass(/active/);
      await expect(page.getByTestId("font-size-btn-medium")).not.toHaveClass(/active/);
      await expect(page.getByTestId("font-size-btn-small")).not.toHaveClass(/active/);
    });

    test("only one font size button is active at a time", async ({ page }) => {
      await page.getByTestId("font-size-btn-large").click();
      const activeBtns = await page.locator(".font-size-btn.active").count();
      expect(activeBtns).toBe(1);
    });

    test("clicking a font size updates aria-checked correctly", async ({ page }) => {
      await page.getByTestId("font-size-btn-large").click();
      await expect(page.getByTestId("font-size-btn-large")).toHaveAttribute("aria-checked", "true");
      await expect(page.getByTestId("font-size-btn-medium")).toHaveAttribute("aria-checked", "false");
      await expect(page.getByTestId("font-size-btn-small")).toHaveAttribute("aria-checked", "false");
    });

    // --- CSS custom property values ---

    test("small size sets --display-font-size to 28px", async ({ page }) => {
      await page.getByTestId("font-size-btn-small").click();
      const value = await page.evaluate(() =>
        getComputedStyle(document.body).getPropertyValue("--display-font-size").trim()
      );
      expect(value).toBe("28px");
    });

    test("medium size sets --display-font-size to 36px", async ({ page }) => {
      const value = await page.evaluate(() =>
        getComputedStyle(document.body).getPropertyValue("--display-font-size").trim()
      );
      expect(value).toBe("36px");
    });

    test("large size sets --display-font-size to 44px", async ({ page }) => {
      await page.getByTestId("font-size-btn-large").click();
      const value = await page.evaluate(() =>
        getComputedStyle(document.body).getPropertyValue("--display-font-size").trim()
      );
      expect(value).toBe("44px");
    });

    test("small size sets --btn-font-size to 15px", async ({ page }) => {
      await page.getByTestId("font-size-btn-small").click();
      const value = await page.evaluate(() =>
        getComputedStyle(document.body).getPropertyValue("--btn-font-size").trim()
      );
      expect(value).toBe("15px");
    });

    test("large size sets --btn-font-size to 21px", async ({ page }) => {
      await page.getByTestId("font-size-btn-large").click();
      const value = await page.evaluate(() =>
        getComputedStyle(document.body).getPropertyValue("--btn-font-size").trim()
      );
      expect(value).toBe("21px");
    });

    // --- localStorage persistence ---

    test("font size choice is saved to localStorage", async ({ page }) => {
      await page.getByTestId("font-size-btn-large").click();
      const stored = await page.evaluate(() => localStorage.getItem("calc-font-size"));
      expect(stored).toBe("large");
    });

    test("saved font size is restored after page reload", async ({ page }) => {
      await page.getByTestId("font-size-btn-small").click();
      await page.reload();
      await expect(page.locator("body")).toHaveClass(/font-size-small/);
      await expect(page.getByTestId("font-size-btn-small")).toHaveClass(/active/);
    });

    test("medium is used when no font size is saved in localStorage", async ({ page }) => {
      // beforeEach already cleared the key and reloaded
      await expect(page.locator("body")).toHaveClass(/font-size-medium/);
    });

    // --- Keyboard navigation (roving tabindex) ---

    test("ArrowRight moves from medium to large", async ({ page }) => {
      await page.getByTestId("font-size-btn-medium").focus();
      await page.keyboard.press("ArrowRight");
      await expect(page.getByTestId("font-size-btn-large")).toHaveClass(/active/);
      await expect(page.locator("body")).toHaveClass(/font-size-large/);
    });

    test("ArrowRight moves from small to medium", async ({ page }) => {
      await page.getByTestId("font-size-btn-small").click();
      await page.getByTestId("font-size-btn-small").focus();
      await page.keyboard.press("ArrowRight");
      await expect(page.getByTestId("font-size-btn-medium")).toHaveClass(/active/);
    });

    test("ArrowRight wraps from large to small", async ({ page }) => {
      await page.getByTestId("font-size-btn-large").click();
      await page.getByTestId("font-size-btn-large").focus();
      await page.keyboard.press("ArrowRight");
      await expect(page.getByTestId("font-size-btn-small")).toHaveClass(/active/);
    });

    test("ArrowLeft moves from medium to small", async ({ page }) => {
      await page.getByTestId("font-size-btn-medium").focus();
      await page.keyboard.press("ArrowLeft");
      await expect(page.getByTestId("font-size-btn-small")).toHaveClass(/active/);
      await expect(page.locator("body")).toHaveClass(/font-size-small/);
    });

    test("ArrowLeft wraps from small to large", async ({ page }) => {
      await page.getByTestId("font-size-btn-small").click();
      await page.getByTestId("font-size-btn-small").focus();
      await page.keyboard.press("ArrowLeft");
      await expect(page.getByTestId("font-size-btn-large")).toHaveClass(/active/);
    });

    test("ArrowDown moves to next font size", async ({ page }) => {
      await page.getByTestId("font-size-btn-medium").focus();
      await page.keyboard.press("ArrowDown");
      await expect(page.getByTestId("font-size-btn-large")).toHaveClass(/active/);
    });

    test("ArrowUp moves to previous font size", async ({ page }) => {
      await page.getByTestId("font-size-btn-medium").focus();
      await page.keyboard.press("ArrowUp");
      await expect(page.getByTestId("font-size-btn-small")).toHaveClass(/active/);
    });

    // --- Non-interference ---

    test("font size and theme are independent", async ({ page }) => {
      await page.getByTestId("font-size-btn-large").click();
      await page.getByTestId("theme-btn-ocean").click();
      await expect(page.locator("body")).toHaveClass(/font-size-large/);
      await expect(page.locator("body")).toHaveClass(/theme-ocean/);
    });

    test("calculator still works correctly after changing font size", async ({ page }) => {
      await page.getByTestId("font-size-btn-large").click();
      await page.getByTestId("btn-4").click();
      await page.getByTestId("btn-add").click();
      await page.getByTestId("btn-3").click();
      await page.getByTestId("btn-equals").click();
      await expect(page.getByTestId("value")).toHaveText("7");
    });
  });
});
