import { test, expect } from '../fixtures';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { PRODUCTO_PRUEBA_URL } from '../test-data/users';

/**
 * Smoke tests — rutas críticas, deben correr en menos de 2 minutos.
 * Selectores verificados en vivo contra opencart.abstracta.us (1/oct/2026).
 */

test.describe('Smoke tests', () => {

  test('La página principal carga con las categorías visibles @smoke', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await expect(page.getByRole('link', { name: 'Desktops', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Laptops & Notebooks', exact: true })).toBeVisible();
  });

  test('La página de login muestra el formulario @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('El ingreso con un usuario válido lleva a la cuenta @smoke', async ({ accountPage }) => {
    // El fixture "accountPage" ya hizo login con la cuenta de este navegador
    await accountPage.expectToBeLoggedIn();
  });

  test('El cierre de sesión redirige correctamente @smoke', async ({ accountPage, page }) => {
    await accountPage.logout();
    await expect(page).toHaveURL(/route=account\/logout/);
  });

  test('La navegación a un producto carga su detalle sin errores @smoke', async ({ page }) => {
    await page.goto(PRODUCTO_PRUEBA_URL, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#button-cart')).toBeVisible();
  });

});
