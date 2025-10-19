import { Page, Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator("#input_search");
    // this.searchButton = page.locator('button[aria-label="Search"]');
    this.searchButton = page.getByRole("button", { name: "Search" });
  }

  async goto() {
    await this.page.goto("/");
    await this.page.waitForLoadState("domcontentloaded");
  }

  async search(term: string) {
    await this.searchInput.fill(term);

    await this.searchButton.click();

    await this.page.waitForLoadState("networkidle");
  }
}
