import { Page } from '@playwright/test';

// NOTA (aplica a todos los page.goto del proyecto): se navega con
// waitUntil 'domcontentloaded' en vez del 'load' por defecto. 'load' espera
// a que terminen TODAS las imágenes (banners y logos tardan 3-5 s cada una
// en este sitio) y con varios workers en paralelo superaba los 30 s del
// timeout. Las aserciones de Playwright ya esperan a que cada elemento
// aparezca, así que las imágenes no hacen falta.
export async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/index.php?route=account/login', { waitUntil: 'domcontentloaded' });
  await page.locator('#input-email').fill(email);
  await page.locator('#input-password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}
