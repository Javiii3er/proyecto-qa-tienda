import { Page, Locator, expect } from '@playwright/test';

export type DatosRegistro = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
};

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly telephoneInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmInput: Locator;
  readonly agreeCheckbox: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#input-firstname');
    this.lastNameInput = page.locator('#input-lastname');
    this.emailInput = page.locator('#input-email');
    this.telephoneInput = page.locator('#input-telephone');
    this.passwordInput = page.locator('#input-password');
    this.confirmInput = page.locator('#input-confirm');
    this.agreeCheckbox = page.locator('input[name="agree"]');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.errorMessage = page.locator('.alert-danger');
  }

  async navigate() {
    await this.page.goto('/index.php?route=account/register', { waitUntil: 'domcontentloaded' });
  }

  async register(datos: DatosRegistro) {
    await this.firstNameInput.fill(datos.firstName);
    await this.lastNameInput.fill(datos.lastName);
    await this.emailInput.fill(datos.email);
    await this.telephoneInput.fill(datos.telephone);
    await this.passwordInput.fill(datos.password);
    await this.confirmInput.fill(datos.password);
    await this.agreeCheckbox.check();
    await this.continueButton.click();
  }

  async expectRegisterSuccess() {
    await expect(this.page).toHaveURL(/route=account\/success/);
  }

  async expectRegisterError(expectedText: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }
}
