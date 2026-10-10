import { chromium, Browser, FullConfig } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { cuentasGrupo, Usuario } from '../test-data/users';
import { bloquearScriptsDeFecha } from './red';

/**
 * Se ejecuta una vez antes de toda la suite (globalSetup en
 * playwright.config.ts). Garantiza que las cuentas de test-data/users.ts
 * existen y pueden iniciar sesión:
 *  - Si la cuenta no existe, la registra.
 *  - Si ya existe ("already registered"), no hace nada.
 *  - Si no puede iniciar sesión, detiene la corrida con un mensaje claro en
 *    vez de dejar que fallen muchos tests con un error confuso.
 */
const ESPERA_MS = 60000; // el sitio demo a veces tarda más de 30 s en responder
const INTENTOS = 3;

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL;
  const browser = await chromium.launch();

  try {
    for (const [proyecto, cuenta] of Object.entries(cuentasGrupo)) {
      // Reintentos: un fallo puntual del servidor no debe detener toda la
      // suite. Solo si falla las 3 veces se informa el error.
      for (let intento = 1; ; intento++) {
        try {
          await prepararCuenta(browser, baseURL, proyecto, cuenta);
          break;
        } catch (error) {
          if (intento === INTENTOS) throw error;
          console.log(`Preparando cuenta de "${proyecto}": intento ${intento} falló, reintentando...`);
        }
      }
    }
  } finally {
    await browser.close();
  }
}

async function prepararCuenta(
  browser: Browser,
  baseURL: string | undefined,
  proyecto: string,
  cuenta: Usuario,
) {
  // Contexto nuevo para registrar: OpenCart no deja registrar si ya hay una
  // sesión iniciada.
  const registro = await browser.newContext({ baseURL });
  registro.setDefaultTimeout(ESPERA_MS);
  await bloquearScriptsDeFecha(registro);
  const registerPage = new RegisterPage(await registro.newPage());
  await registerPage.navigate();
  await registerPage.register(cuenta);
  // Esperar la respuesta: página de éxito (cuenta nueva) o error (ya existía)
  await registerPage.page
    .locator('#content h1:has-text("Your Account Has Been Created"), .alert-danger')
    .first()
    .waitFor();
  await registro.close();

  const login = await browser.newContext({ baseURL });
  login.setDefaultTimeout(ESPERA_MS);
  await bloquearScriptsDeFecha(login);
  const loginPage = new LoginPage(await login.newPage());
  await loginPage.navigate();
  await loginPage.login(cuenta.email, cuenta.password);
  // Esperar la respuesta: la página de la cuenta o un mensaje de error
  await loginPage.page
    .locator('h2:has-text("My Account"), .alert-danger')
    .first()
    .waitFor();
  const url = loginPage.page.url();
  const error = await loginPage.errorMessage.textContent().catch(() => null);
  await login.close();

  if (!/route=account\/account/.test(url)) {
    throw new Error(
      `La cuenta de prueba de "${proyecto}" (${cuenta.email}) no puede ` +
      `iniciar sesión. Mensaje del sitio: ${error?.trim() ?? '(ninguno)'}`
    );
  }
}
