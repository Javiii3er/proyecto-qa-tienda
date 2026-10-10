import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly myAccountLink: Locator;
  readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[name="search"]');
    this.myAccountLink = page.getByRole('link', { name: 'My Account' });
    this.shoppingCartLink = page.getByRole('link', { name: 'Shopping Cart' });
  }

  async navigate() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  // Ej: 'Desktops', 'Laptops & Notebooks', 'Components', 'Tablets',
  // 'Software', 'Phones & PDAs', 'Cameras', 'MP3 Players' (verificado en vivo)
  async goToCategory(nombreCategoria: string) {
    await this.page.getByRole('link', { name: nombreCategoria, exact: true }).click();
  }
}
