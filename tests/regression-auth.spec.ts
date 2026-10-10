import { test, expect } from '../fixtures';
import { RegisterPage } from '../pages/RegisterPage';
import { nuevoUsuario } from '../test-data/users';

/**
 * Regresión de autenticación — selectores verificados en vivo.
 * NOTA sobre el test 4 (campos vacíos): no confirmamos en vivo si OpenCart
 * bloquea el submit con validación HTML5 del navegador o si deja pasar la
 * petición al servidor. Verifiquen esto al correrlo y ajusten la aserción
 * si hace falta (puede que el test deba revisar validez del campo en vez
 * de un mensaje de error del servidor).
 *
 * NOTA sobre los logins fallidos: OpenCart cuenta los intentos fallidos por
 * email y lo bloquea 1 hora al pasar el límite (un login exitoso reinicia el
 * contador). Por eso el email inexistente es único en cada corrida: nunca
 * tiene un login exitoso que reinicie su contador.
 */

test.describe('Regresión - Autenticación', () => {

  test('Inicio de sesión con credenciales válidas @regression', async ({ cuenta, loginPage, page }) => {
    await loginPage.login(cuenta.email, cuenta.password);
    await expect(page).toHaveURL(/route=account\/account/);
  });

  test('Inicio de sesión con un email incorrecto @regression', async ({ loginPage }) => {
    const emailInexistente = nuevoUsuario().email; // único: nunca se registra
    await loginPage.login(emailInexistente, 'ClaveSegura123!');
    await loginPage.expectLoginError('No match for E-Mail Address and/or Password');
  });

  test('Inicio de sesión con una contraseña incorrecta @regression', async ({ cuenta, loginPage }) => {
    await loginPage.login(cuenta.email, 'contraseña-incorrecta');
    await loginPage.expectLoginError('No match for E-Mail Address and/or Password');
  });

  test('Inicio de sesión con campos vacíos @regression', async ({ loginPage }) => {
    await loginPage.login('', '');
    // TODO: confirmar si aparece el mismo mensaje de error del servidor
    // o si el navegador bloquea el envío por los campos requeridos.
    await expect(loginPage.page).toHaveURL(/route=account\/login/);
  });

  test('Registro de un usuario válido @regression', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.register(nuevoUsuario());
    await registerPage.expectRegisterSuccess();
  });

  test('Registro con un email ya utilizado @regression', async ({ cuenta, page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.register({
      firstName: 'Prueba',
      lastName: 'Duplicado',
      email: cuenta.email, // ya registrada (helpers/global-setup.ts)
      telephone: '00000000',
      password: 'OtraClave123!',
    });
    await registerPage.expectRegisterError('E-Mail Address is already registered');
  });

});
