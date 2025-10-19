import { Page, Locator, expect } from "@playwright/test";

export class ProductPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly optionSelector: Locator;
  readonly rxSelect: Locator;
  readonly addToCartButton: Locator;
  readonly cartButton: Locator;
  readonly deleteButton: Locator;
  readonly cartTitle: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.locator("h1.fm-main-title.fm-page-title");
    this.optionSelector = page.locator("#input-option808");
    this.rxSelect = page.getByLabel("RX*");
    this.addToCartButton = page.getByRole("button", {
      name: "До кошика До кошика",
    });
    this.cartButton = page.getByRole("button", { name: /cart-icon/i });
    this.deleteButton = page.locator("button:has(i.fas.fa-trash-alt)");
    this.cartTitle = page.getByText("Кошик", { exact: true });
    this.emptyCartMessage = page.getByText("Кошик порожній!");
  }

  async waitForPage() {
    await expect(this.productTitle).toBeVisible({ timeout: 10000 });
  }

  async addToCart() {
    await this.optionSelector.getByText("Naked O3").click();
    await this.rxSelect.selectOption("1803");
    await this.addToCartButton.waitFor({ state: "visible" });
    await this.addToCartButton.click();
    await expect(
      this.page.getByText("Ви додали Квадрокоптер FLYWOO")
    ).toBeVisible({ timeout: 7000 });
    await this.page.locator(".fm-alert-close").click();
  }

  async openCart() {
    await this.cartButton.click();
    await expect(this.cartTitle).toBeVisible({ timeout: 7000 });
  }

  async clearCart() {
    await this.deleteButton.click();
    await expect(this.emptyCartMessage).toBeVisible({ timeout: 7000 });
  }
}
