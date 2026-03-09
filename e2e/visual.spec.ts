import { test, expect } from "@playwright/test";

test.describe("Visual regression — /test-ui", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test-ui");
    // Wait for fonts and styles to settle
    await page.waitForLoadState("networkidle");
  });

  test("full page snapshot", async ({ page }) => {
    await expect(page).toHaveScreenshot("full-page.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test("sidebar has glass and purple gradient on active item", async ({ page }) => {
    const sidebar = page.locator("aside");
    await expect(sidebar).toHaveScreenshot("sidebar.png", {
      maxDiffPixelRatio: 0.02,
    });
  });

  test("stat cards snapshot", async ({ page }) => {
    const cards = page.getByTestId("section-cards");
    await expect(cards).toHaveScreenshot("stat-cards.png", {
      maxDiffPixelRatio: 0.02,
    });
  });

  test("color palette snapshot", async ({ page }) => {
    const colors = page.getByTestId("section-colors");
    await expect(colors).toHaveScreenshot("colors.png", {
      maxDiffPixelRatio: 0.02,
    });
  });

  test("typography snapshot", async ({ page }) => {
    const typography = page.getByTestId("section-typography");
    await expect(typography).toHaveScreenshot("typography.png", {
      maxDiffPixelRatio: 0.02,
    });
  });

  test("buttons snapshot", async ({ page }) => {
    const buttons = page.getByTestId("section-buttons");
    await expect(buttons).toHaveScreenshot("buttons.png", {
      maxDiffPixelRatio: 0.02,
    });
  });
});
