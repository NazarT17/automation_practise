import { Page, Locator, expect } from "@playwright/test";

export class SearchResultsPage {
  readonly page: Page;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    // Всі товари у контейнері
    this.productCards = page.locator(
      ".row.no-gutters.fm-category-products .product-layout"
    );
  }

  async waitForResults() {
    // Чекаємо, поки хоча б один товар стане видимим
    await this.page.waitForSelector(
      ".row.no-gutters.fm-category-products .product-layout",
      { timeout: 15000 }
    );
  }

  async addFirstProductToCart() {
    await this.waitForResults();

    // Знаходимо кнопку "До кошика" у першому товарі
    const addToCartButton = this.productCards
      .first()
      .locator("button.fm-product-btn");

    // Чекаємо, поки кнопка стане видимою
    await expect(addToCartButton).toBeVisible({ timeout: 5000 });

    // Клікаємо на кнопку
    await addToCartButton.click();
  }
}
