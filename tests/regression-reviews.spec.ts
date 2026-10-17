import { test, expect } from '../fixtures';
import { ProductPage } from '../pages/ProductPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AccountPage } from '../pages/AccountPage';
import { PRODUCTO_PRUEBA_URL, nuevoUsuario } from '../test-data/users';

/**
 * Regresión de reseñas y perfil — selectores y mensajes verificados en vivo.
 */

test.describe('Regresión - Reseñas y perfil', () => {

  test('Calificar un producto con estrellas @regression', async ({ page }) => {
    const productPage = new ProductPage(page);
    await page.goto(PRODUCTO_PRUEBA_URL, { waitUntil: 'domcontentloaded' });
    await productPage.openReviewsTab();
    await productPage.rateProduct(5);
    await expect(page.locator('input[name="rating"][value="5"]')).toBeChecked();
  });

  test('Enviar una reseña de texto @regression', async ({ page }) => {
    const productPage = new ProductPage(page);
    await page.goto(PRODUCTO_PRUEBA_URL, { waitUntil: 'domcontentloaded' });
    await productPage.openReviewsTab();
    await productPage.submitReview('Grupo 7', 'Reseña de prueba generada automáticamente.');
    // OpenCart no publica la reseña de inmediato: la deja pendiente de aprobación
    await expect(page.locator('.alert-success')).toContainText('submitted to the webmaster for approval');
  });

  test('Editar un campo del perfil y verificar persistencia @regression', async ({ accountPage, page }) => {
    const nuevoTelefono = `555${Date.now().toString().slice(-7)}`;
    await accountPage.goToEditProfile();
    await accountPage.editProfile({ telephone: nuevoTelefono });

    // Volver a abrir el formulario desde la cuenta (como haría un usuario) y
    // confirmar que el valor persistió. Antes se usaba page.goto directo a
    // account/edit, que fallaba de forma intermitente (ver
    // reportes/analisis-tests-fragiles.md, caso 6).
    await accountPage.goToEditProfile();
    await expect(page.locator('#input-telephone')).toHaveValue(nuevoTelefono);
  });

  test('Cambio de contraseña @regression', async ({ page }) => {
    // Este test registra su propia cuenta en vez de usar la del fixture:
    // cambiarle la contraseña a la cuenta compartida rompía a todos los
    // demás tests (ver reportes/analisis-tests-fragiles.md).
    test.slow(); // registro + cambio + 2 logins: el triple del timeout normal
    const usuario = nuevoUsuario();
    const nuevaPassword = 'NuevaClave456!';

    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.register(usuario); // al registrarse queda con sesión iniciada
    await registerPage.expectRegisterSuccess();

    const accountPage = new AccountPage(page);
    await page.getByRole('link', { name: 'Continue' }).click(); // de account/success a la cuenta
    await accountPage.expectToBeLoggedIn();
    await accountPage.goToChangePassword();
    await accountPage.changePassword(nuevaPassword);
    await accountPage.logout();

    // La contraseña anterior ya no debe servir y la nueva sí
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(usuario.email, usuario.password);
    await loginPage.expectLoginError('No match for E-Mail Address and/or Password');

    await loginPage.login(usuario.email, nuevaPassword);
    await accountPage.expectToBeLoggedIn();
  });

});
