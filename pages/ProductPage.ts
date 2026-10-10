import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly reviewsTab: Locator;
  readonly reviewNameInput: Locator;
  readonly reviewTextInput: Locator;
  readonly submitReviewButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator('#button-cart');
    this.reviewsTab = page.locator('a[href="#tab-review"]');
    this.reviewNameInput = page.locator('#input-name');
    this.reviewTextInput = page.locator('#input-review');
    this.submitReviewButton = page.locator('#button-review');
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async openReviewsTab() {
    // Reintenta el clic hasta que el panel se vea: si se hace clic antes de
    // que el JavaScript de las pestañas termine de cargar, el clic no hace
    // nada (ver reportes/analisis-tests-fragiles.md, caso 5).
    await expect(async () => {
      await this.reviewsTab.click();
      await expect(this.page.locator('#tab-review')).toBeVisible({ timeout: 2000 });
    }).toPass();
  }

  // stars: 1 a 5
  // Sin { force: true }: force desactiva la espera automática de Playwright
  // y el clic fallaba si el panel de reseñas todavía no era visible.
  async rateProduct(stars: number) {
    await this.page.locator(`input[name="rating"][value="${stars}"]`).check();
  }

  async submitReview(nombre: string, texto: string) {
    await this.reviewNameInput.fill(nombre);
    await this.reviewTextInput.fill(texto);
    await this.rateProduct(5);
    await this.submitReviewButton.click();
  }
}
