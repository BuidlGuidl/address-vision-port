import { expect, test } from "@playwright/test";

test.describe("Address Page", () => {
  const testAddress = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"; // vitalik.eth

  test.beforeEach(async ({ page }) => {
    await page.goto(`http://localhost:3000/${testAddress}`);
  });

  test("displays address information correctly", async ({ page }) => {
    // Check if address card is visible
    await expect(page.getByText(testAddress.slice(0, 6))).toBeVisible();

    // Check if main components are visible
    await expect(page.getByRole("button", { name: "Blockscan" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Etherscan" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Zerion" })).toBeVisible();
  });

  test("external links work correctly", async ({ page, context }) => {
    // Listen for new pages (popup windows)
    const pagePromise = context.waitForEvent("page");

    // Click Blockscan button
    await page.getByRole("button", { name: "Blockscan" }).click();

    // Handle new page
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    expect(newPage.url()).toContain("blockscan.com/address/" + testAddress);
  });

  test("theme switcher works", async ({ page }) => {
    // Get theme toggle
    const themeToggle = page.locator("#theme-toggle");

    // Check initial theme
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");

    // Toggle theme
    await themeToggle.click();

    // Check if theme changed
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});
