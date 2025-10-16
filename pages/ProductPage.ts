import { Page, Locator, expect } from "@playwright/test";

export class ProductPage {
  readonly page: Page;
  readonly productTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.locator("h1.fm-main-title.fm-page-title");
  }

  async waitForPage() {
    await expect(this.productTitle).toBeVisible({ timeout: 10000 });
  }
}
