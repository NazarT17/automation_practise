import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { ProductPage } from "../pages/ProductPage";

test("Search FPV drone and add first product to cart @ui", async ({ page }) => {
  const home = new HomePage(page);
  const results = new SearchResultsPage(page);
  const product = new ProductPage(page);

  await home.goto();

  await home.search("FPV drone");

  await results.waitForResults();

  await results.selectFirstProduct();

  await product.waitForPage();

  await product.addToCart();

  await product.openCart();

  await product.clearCart();
});

test("DEMO - UI Failure Test (DELETE AFTER DEMO) @ui", async ({ page }) => {
  const home = new HomePage(page);

  await test.step("Navigate to home page", async () => {
    await home.goto();
    await page.waitForLoadState("domcontentloaded");
  });

  await test.step("This step will fail to capture screenshot", async () => {
    // Search for something
    await home.search("FPV drone");

    // Wait a moment to see the page state
    await page.waitForTimeout(1000);

    // This will intentionally fail to trigger screenshot capture
    await expect(page.locator("body")).toContainText(
      "This text does not exist on the page"
    );
  });
});
