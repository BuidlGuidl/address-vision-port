import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("has correct title and welcome message", async ({ page }) => {
    await expect(page).toHaveTitle(/address\.vision/);
    await expect(page.getByText("Welcome to address.vision!")).toBeVisible();
    await expect(
      page.getByText("To get started, enter an Ethereum address or ENS name in the search bar above."),
    ).toBeVisible();
  });

  test("search bar is visible and functional", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter an Ethereum address or ENS name to get started");
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeFocused();
  });

  test("can search for an Ethereum address", async ({ page }) => {
    const testAddress = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"; // vitalik.eth
    const searchInput = page.getByPlaceholder("Enter an Ethereum address or ENS name to get started");

    await searchInput.fill(testAddress);

    // Check if URL changed to address page
    await expect(page).toHaveURL(`http://localhost:3000/vitalik.eth`); // uses ENS name in URLs
  });

  test("can search for an ENS name", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter an Ethereum address or ENS name to get started");

    await searchInput.fill("vitalik.eth");

    // Check if URL changed to ENS page
    await expect(page).toHaveURL(`http://localhost:3000/vitalik.eth`);
  });

  test("previous searches are displayed", async ({ page }) => {
    const testAddress = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
    const searchInput = page.getByPlaceholder("Enter an Ethereum address or ENS name to get started");

    await searchInput.fill(testAddress);

    // Wait for navigation to complete and page to load
    await expect(page).toHaveURL(`http://localhost:3000/vitalik.eth`);

    // Go back to home page
    await page.goto("http://localhost:3000");

    // Check if previous searches section exists
    await expect(page.getByText("Previous Searches")).toBeVisible();
    await expect(page.getByText("vitalik.eth")).toBeVisible();
  });
});
