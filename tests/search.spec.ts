import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { ProductPage } from "../pages/ProductPage";

test("Search FPV drone and add first product to cart", async ({ page }) => {
  const home = new HomePage(page);
  const results = new SearchResultsPage(page);
  const product = new ProductPage(page);

  await home.goto();

  await home.search("FPV drone");

  await results.waitForResults();

  await results.addFirstProductToCart();

  await product.waitForPage();

  await product.addToCart();

  await product.openCart();

  await product.clearCart();
});
