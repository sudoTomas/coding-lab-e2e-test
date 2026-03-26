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
});
