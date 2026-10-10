import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { loginAs } from '../helpers/auth';
import { cuentasGrupo, Usuario } from '../test-data/users';

type AppFixtures = {
  loginPage: LoginPage;
  cuenta: Usuario; // cuenta de prueba del navegador en que corre el test
  accountPage: AccountPage; // ya autenticado con `cuenta`
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(loginPage);
  },

  // Cada navegador (proyecto) usa su propia cuenta, para que los tests de
  // Chromium y Firefox que corren en paralelo no se afecten entre sí.
  cuenta: async ({}, use, testInfo) => {
    const cuenta = cuentasGrupo[testInfo.project.name];
    if (!cuenta) {
      throw new Error(`No hay cuenta de prueba para el proyecto "${testInfo.project.name}" en test-data/users.ts`);
    }
    await use(cuenta);
  },

  accountPage: async ({ page, cuenta }, use) => {
    await loginAs(page, cuenta.email, cuenta.password);
    const accountPage = new AccountPage(page);
    await accountPage.expectToBeLoggedIn();
    await use(accountPage);
  },
});

export { expect } from '@playwright/test';
