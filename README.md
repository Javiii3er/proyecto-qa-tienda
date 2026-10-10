# Proyecto Final — Aseguramiento de la Calidad del Software (Curso 048)

**Grupo 7** · Variante 2: OpenCart Demo de Abstracta (http://opencart.abstracta.us/)

## Integrantes

| Nombre | Carné |
|---|---|
| Javier José Luis Rivera Pérez | 1790-22-10552|
| Karla Waleska Rodríguez Arévalo | 1790-22-9763|

## Descripción

Suite de pruebas manuales y automatizadas (Playwright + TypeScript) sobre la tienda
OpenCart de práctica asignada al grupo, aplicando Page Object Model, fixtures
reutilizables, evidencias automáticas y ejecución multi-navegador (Chromium y Firefox).

## Instalación

```bash
git clone <url-del-repo>
cd proyecto-qa-tienda
npm install          # respeta .npmrc (ignore-scripts=true)
npx playwright install   # instalación explícita de navegadores
```

## Ejecución

```bash
npx playwright test --grep "@smoke"        # solo smoke tests
npx playwright test --grep "@regression"   # solo regression tests
npx playwright test --project=firefox      # solo en Firefox
npx playwright show-report                 # reporte HTML comparativo
```

## Estructura del repositorio

```
proyecto-qa-tienda/
├── tests/
│   ├── smoke.spec.ts
│   ├── regression-auth.spec.ts
│   └── regression-reviews.spec.ts
├── pages/
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── AccountPage.ts
│   └── ProductPage.ts
├── fixtures/
│   └── index.ts
├── helpers/
│   ├── auth.ts
│   └── global-setup.ts      # crea/verifica las cuentas de prueba antes de cada corrida
├── test-data/
│   └── users.ts             # cuentas de prueba (una por navegador) y datos ficticios
├── reportes/
│   └── analisis-tests-fragiles.md
├── evidencias/
├── docs/
│   └── cronograma.md        # reparto de trabajo del grupo
├── .npmrc (ignore-scripts=true)
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## Defectos encontrados

<!-- TODO: completar con cada defecto y su enlace al GitHub Issue, ej.: -->
<!-- - DR-001: [título breve] — https://github.com/usuario/repo/issues/1 -->
