import { test, expect } from '../fixtures';
import { RegisterPage } from '../pages/RegisterPage';
import { nuevoUsuario } from '../test-data/users';

/**
 * Regresión de autenticación — selectores y mensajes verificados en vivo.
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
    // Los campos no tienen validación del navegador (atributo required): el
    // formulario llega al servidor, que responde con el mismo mensaje genérico
    await expect(loginPage.page).toHaveURL(/route=account\/login/);
    await loginPage.expectLoginError('No match for E-Mail Address and/or Password');
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
