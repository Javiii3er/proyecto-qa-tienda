import { test, expect } from '../fixtures';
import AxeBuilder from '@axe-core/playwright';

/**
 * Pruebas de accesibilidad con axe-core (bono del enunciado, sección 6.3).
 * Escanea las páginas principales contra las reglas WCAG 2.0 A y AA.
 *
 * El sitio de práctica ya tiene problemas de accesibilidad que no podemos corregir
 * (no tenemos su código). Se registran como LÍNEA BASE: el test adjunta al reporte
 * el resultado completo de cada página y falla solo si aparece una regla incumplida
 * NUEVA, es decir, funciona como prueba de regresión de accesibilidad.
 * Detalle de los hallazgos: reportes/accesibilidad.md
 */

type Pagina = { nombre: string; url: string; conocidas: string[] };

// Reglas incumplidas encontradas en el escaneo del 19/10/2026
const COMUNES = ['button-name', 'color-contrast', 'link-in-text-block', 'link-name'];
const PAGINAS: Pagina[] = [
  { nombre: 'Inicio', url: '/', conocidas: COMUNES },
  { nombre: 'Login', url: '/index.php?route=account/login', conocidas: COMUNES },
  { nombre: 'Registro', url: '/index.php?route=account/register', conocidas: [...COMUNES, 'label'] },
  { nombre: 'Producto', url: '/index.php?route=product/product&product_id=49', conocidas: COMUNES },
  { nombre: 'Búsqueda', url: '/index.php?route=product/search&search=iPhone', conocidas: [...COMUNES, 'select-name'] },
];

test.describe('Accesibilidad (axe-core, WCAG 2.0 A y AA)', () => {
  for (const pagina of PAGINAS) {
    test(`La página ${pagina.nombre} no tiene problemas de accesibilidad nuevos @a11y`, async ({ page, browserName }, testInfo) => {
      // axe analiza el HTML de la página: basta con un navegador y se evita
      // duplicar las peticiones al sitio compartido.
      test.skip(browserName !== 'chromium', 'El análisis de accesibilidad se ejecuta solo en Chromium');

      await page.goto(pagina.url, { waitUntil: 'domcontentloaded' });
      await page.locator('footer').waitFor();
      const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

      // Evidencia: el resultado completo queda adjunto en el reporte HTML
      await testInfo.attach(`axe-${pagina.nombre}.json`, {
        body: JSON.stringify(resultado.violations, null, 2),
        contentType: 'application/json',
      });
      const resumen = resultado.violations.map((v) => `${v.id} [${v.impact}] ${v.nodes.length} elementos`);
      testInfo.annotations.push({ type: 'Problemas conocidos', description: resumen.join(' · ') || 'ninguno' });

      const nuevas = resultado.violations.map((v) => v.id).filter((id) => !pagina.conocidas.includes(id));
      expect(nuevas, `Reglas WCAG incumplidas que no estaban en la línea base: ${nuevas.join(', ')}`).toEqual([]);
    });
  }
});
