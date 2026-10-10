import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Crea las cuentas de prueba de test-data/users.ts si no existen
  globalSetup: './helpers/global-setup.ts',
  // El demo es un servidor compartido y lento (2-7 s por página medidos sin
  // carga). Con los valores por defecto los tests fallaban por tiempo, no por
  // defectos de la tienda. Ver reportes/analisis-tests-fragiles.md (caso 4).
  timeout: 60000,          // la guía sugiere 30000; un test con login abre 4-5 páginas
  expect: { timeout: 10000 }, // por defecto 5 s: menos de lo que tarda un formulario
  workers: 2,              // menos carga simultánea sobre el sitio compartido
  retries: 1,
  use: {
    // Grupo 7 - Variante 2: OpenCart Demo de Abstracta
    baseURL: 'http://opencart.abstracta.us',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
});
