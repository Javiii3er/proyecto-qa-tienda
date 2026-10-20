import { Page, Locator } from '@playwright/test';

export class CategoryPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly menuActivo: Locator;
  readonly productos: Locator;
  readonly paginacion: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('#content h2').first();
    // Elemento del menú lateral de la categoría abierta, por ejemplo "Desktops (13)"
    this.menuActivo = page.locator('a.list-group-item.active').first();
    this.productos = page.locator('.product-thumb');
    this.paginacion = page.locator('#content .col-sm-6.text-right').first();
  }

  async navigate(pathId: number) {
    await this.page.goto(`/index.php?route=product/category&path=${pathId}`, { waitUntil: 'domcontentloaded' });
    await this.heading.waitFor();
  }

  // Número entre paréntesis del menú lateral: "Desktops (13)" -> 13
  async totalSegunMenu(): Promise<number> {
    const texto = await this.menuActivo.innerText();
    return Number(texto.match(/\((\d+)\)/)?.[1] ?? NaN);
  }

  // Total de productos listados: "Showing 1 to 12 of 12 (1 Pages)" -> 12.
  // Si la categoría no muestra productos no hay paginación, y el total es 0.
  async totalListado(): Promise<number> {
    if ((await this.paginacion.count()) === 0) return this.productos.count();
    const texto = await this.paginacion.innerText();
    return Number(texto.match(/of (\d+)/)?.[1] ?? NaN);
  }
}
