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
git clone https://github.com/Javiii3er/proyecto-qa-tienda.git
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
│   ├── analisis-tests-fragiles.md
│   ├── defectos.md
│   └── playwright-report/   # último reporte HTML generado
├── evidencias/
├── docs/
│   └── cronograma.md        # reparto de trabajo del grupo
├── .npmrc (ignore-scripts=true)
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## Defectos encontrados

Detalle completo (pasos, resultado esperado/obtenido, severidad, prioridad) en
[`reportes/defectos.md`](reportes/defectos.md); capturas en [`evidencias/`](evidencias/).

| ID | Defecto | Severidad | Issue |
|---|---|---|---|
| DR-001 | La búsqueda con `%` devuelve todo el catálogo | Media | PENDIENTE |
| DR-002 | El teléfono acepta letras y símbolos en el registro | Media | PENDIENTE |
| DR-003 | El registro acepta contraseñas triviales como `1234` | Media | PENDIENTE |
| DR-004 | Nombre y apellido aceptan solo números o etiquetas HTML | Baja | PENDIENTE |
| DR-005 | El contador de "Desktops (13)" no coincide con los 12 productos listados | Baja | PENDIENTE |

## Análisis de estabilidad

Los tests inestables encontrados, su diagnóstico y la corrección aplicada están en
[`reportes/analisis-tests-fragiles.md`](reportes/analisis-tests-fragiles.md).

## Reporte HTML

El último reporte HTML de la suite está en `reportes/playwright-report/`. Para abrirlo:

```bash
npx playwright show-report reportes/playwright-report
```
