import { Page, Locator, expect } from '@playwright/test';

export class AccountPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly editAccountLink: Locator;
  readonly passwordLink: Locator;
  readonly logoutLink: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h2', { hasText: 'My Account' });
    this.editAccountLink = page.getByRole('link', { name: 'Edit Account' }).first();
    this.passwordLink = page.getByRole('link', { name: 'Password' }).first();
    this.logoutLink = page.getByRole('link', { name: 'Logout' }).first();
    this.successAlert = page.locator('.alert-success');
  }

  async expectToBeLoggedIn() {
    await expect(this.page).toHaveURL(/route=account\/account/);
    await expect(this.heading).toBeVisible();
  }

  async goToEditProfile() {
    await this.editAccountLink.click();
    await expect(this.page).toHaveURL(/route=account\/edit/);
  }

  async goToChangePassword() {
    await this.passwordLink.click();
    await expect(this.page).toHaveURL(/route=account\/password/);
  }

  async editProfile(datos: { firstName?: string; lastName?: string; telephone?: string }) {
    if (datos.firstName) await this.page.locator('#input-firstname').fill(datos.firstName);
    if (datos.lastName) await this.page.locator('#input-lastname').fill(datos.lastName);
    if (datos.telephone) await this.page.locator('#input-telephone').fill(datos.telephone);
    await this.page.getByRole('button', { name: 'Continue' }).click();
    // Esperar la confirmación: sin esto, el test navegaba a otra página
    // mientras el formulario todavía se estaba enviando, y esa navegación
    // interrumpía el guardado (ver reportes/analisis-tests-fragiles.md).
    await expect(this.successAlert).toContainText('successfully updated');
  }

  async changePassword(nuevaPassword: string) {
    await this.page.locator('#input-password').fill(nuevaPassword);
    await this.page.locator('#input-confirm').fill(nuevaPassword);
    await this.page.getByRole('button', { name: 'Continue' }).click();
    // Redirige a account/account con un .alert-success
    await expect(this.successAlert).toContainText('successfully updated');
  }

  async logout() {
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/route=account\/logout/);
  }
}
