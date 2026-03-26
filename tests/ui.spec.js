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
  });
});
