# Proyecto Final — Aseguramiento de la Calidad del Software (Curso 048)

**Grupo 7** · Variante 2: OpenCart Demo de Abstracta (http://opencart.abstracta.us/)

[![Pruebas Playwright](https://github.com/Javiii3er/proyecto-qa-tienda/actions/workflows/playwright.yml/badge.svg)](https://github.com/Javiii3er/proyecto-qa-tienda/actions/workflows/playwright.yml)

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

La suite tiene 23 pruebas por navegador (46 ejecuciones): 5 smoke, 6 de autenticación,
4 de reseñas y perfil, y 8 de navegación generadas por un **test parametrizado** que recorre
las categorías del catálogo. Desktops y Components están marcadas con `test.fail()` porque
reproducen el defecto conocido DR-005; Playwright las cuenta como fallos *esperados*.

## Integración continua (GitHub Actions)

El workflow [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) ejecuta la
suite completa en Chromium y Firefox **en cada push y pull request a `main`** (también puede
lanzarse a mano desde la pestaña *Actions*). Instala las dependencias con `npm ci`, que respeta
el `.npmrc` (`ignore-scripts=true`), instala los navegadores de forma explícita, verifica los
tipos de TypeScript y guarda el reporte HTML como artefacto descargable de cada ejecución.

## Estructura del repositorio

```
proyecto-qa-tienda/
├── .github/workflows/
│   └── playwright.yml       # integración continua (GitHub Actions)
├── tests/
│   ├── smoke.spec.ts
│   ├── regression-auth.spec.ts
│   ├── regression-reviews.spec.ts
│   └── regression-navegacion.spec.ts   # test parametrizado: 8 categorías
├── pages/
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── AccountPage.ts
│   ├── ProductPage.ts
│   └── CategoryPage.ts
├── fixtures/
│   └── index.ts
├── helpers/
│   ├── auth.ts
│   ├── global-setup.ts      # crea/verifica las cuentas de prueba antes de cada corrida
│   └── red.ts               # bloquea scripts del sitio que se cuelgan y no se usan
├── test-data/
│   └── users.ts             # cuentas de prueba (una por navegador) y datos ficticios
├── reportes/
│   ├── 048_Casos_de_Prueba_Grupo7.xlsx   # 21 casos de prueba manuales
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

## Casos de prueba manuales

Los 21 casos de prueba (F01–F09), elaborados con la plantilla del catedrático, están en
[`reportes/048_Casos_de_Prueba_Grupo7.xlsx`](reportes/048_Casos_de_Prueba_Grupo7.xlsx).
La hoja *Resumen* calcula automáticamente los casos ejecutados, OK, FALLO y BLOQUEADO por
funcionalidad.

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
