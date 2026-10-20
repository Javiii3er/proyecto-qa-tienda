import { test, expect } from '../fixtures';
import { CategoryPage } from '../pages/CategoryPage';

/**
 * Regresión de navegación por categorías (F08, caso TC-N01) — test parametrizado.
 * Un mismo test se ejecuta una vez por cada categoría de la lista: verifica que la
 * página cargue con su título y que el contador del menú lateral coincida con la
 * cantidad de productos listados.
 *
 * Desktops y Components incumplen la regla (defecto DR-005): su contador incluye
 * productos de las subcategorías que el listado no muestra. Se marcan con
 * test.fail(): se espera que fallen, y si el sitio llegara a corregirse Playwright
 * lo reportaría para quitar la marca.
 */

type Categoria = { nombre: string; path: number; defecto?: string };

const CATEGORIAS: Categoria[] = [
  { nombre: 'Desktops', path: 20, defecto: 'DR-005: el menú dice 13 y se listan 12' },
  { nombre: 'Laptops & Notebooks', path: 18 },
  { nombre: 'Components', path: 25, defecto: 'DR-005: el menú dice 2 y no se lista ninguno' },
  { nombre: 'Tablets', path: 57 },
  { nombre: 'Software', path: 17 },
  { nombre: 'Phones & PDAs', path: 24 },
  { nombre: 'Cameras', path: 33 },
  { nombre: 'MP3 Players', path: 34 },
];

test.describe('Regresión - Navegación por categorías', () => {
  for (const categoria of CATEGORIAS) {
    test(`La categoría ${categoria.nombre} carga y su contador coincide con el listado @regression`, async ({ page }) => {
      if (categoria.defecto) {
        test.fail(true, `Defecto conocido ${categoria.defecto}`);
      }
      const categoryPage = new CategoryPage(page);
      await categoryPage.navigate(categoria.path);
      await expect(categoryPage.heading).toHaveText(categoria.nombre);

      const segunMenu = await categoryPage.totalSegunMenu();
      const listado = await categoryPage.totalListado();
      expect(listado, `El menú indica ${segunMenu} productos y se listan ${listado}`).toBe(segunMenu);
    });
  }
});
