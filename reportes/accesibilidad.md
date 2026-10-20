# Pruebas de accesibilidad con axe-core

Proyecto Final · Grupo 7 · Variante 2 (opencart.abstracta.us)
Bono del enunciado (sección 6.3): *"Pruebas de accesibilidad con axe-core"*.

**Fecha del escaneo:** 19 de octubre de 2026
**Herramienta:** [`@axe-core/playwright`](https://playwright.dev/docs/accessibility-testing) 4.14 · Chromium
**Normas evaluadas:** WCAG 2.0 nivel A y AA (`wcag2a`, `wcag2aa`)
**Test:** [`tests/accesibilidad.spec.ts`](../tests/accesibilidad.spec.ts) · etiqueta `@a11y`

```bash
npx playwright test --grep "@a11y"
```

## Resultado

Las 5 páginas analizadas incumplen reglas de accesibilidad:

| Regla | Impacto | Qué significa | Inicio | Login | Registro | Producto | Búsqueda |
|---|---|---|---|---|---|---|---|
| `button-name` | Crítico | Botones sin texto accesible (p. ej. la lupa del buscador o los botones con solo un ícono): un lector de pantalla no puede anunciar qué hacen | 9 | 1 | 1 | 3 | 5 |
| `color-contrast` | Serio | Texto con contraste insuficiente respecto a su fondo (difícil de leer para personas con baja visión) | 20 | 22 | 23 | 10 | 11 |
| `link-name` | Serio | Enlaces sin texto (solo ícono) | 1 | 2 | 2 | 2 | 2 |
| `link-in-text-block` | Serio | Enlaces dentro de un texto que se distinguen solo por el color | 1 | 1 | 2 | 1 | 1 |
| `label` | Crítico | Un campo del formulario sin etiqueta asociada | — | — | 1 | — | — |
| `select-name` | Crítico | Una lista desplegable sin nombre accesible | — | — | — | — | 1 |

*(Los números son la cantidad de elementos que incumplen cada regla.)*

## Cómo funciona el test

1. Es un **test parametrizado**: el mismo test se ejecuta con cada una de las 5 páginas.
2. Analiza cada página con axe-core y **adjunta el resultado completo** (elementos, selectores y
   cómo corregirlos) al reporte HTML de Playwright, como `axe-<página>.json`.
3. Como el equipo no tiene acceso al código de la tienda, los problemas encontrados se registran
   como **línea base**. El test **falla solo si aparece una regla incumplida nueva**: funciona como
   prueba de **regresión de accesibilidad**.
4. Se ejecuta **solo en Chromium**: axe analiza el HTML de la página, que es el mismo en ambos
   navegadores, y así se evita duplicar las peticiones al sitio compartido (sección 13).

## Recomendaciones para el equipo de desarrollo de la tienda

- Agregar `aria-label` (o texto oculto para lectores de pantalla) a los botones y enlaces que
  solo muestran un ícono, como el botón de búsqueda y los botones de la tarjeta de producto.
- Ajustar los colores del texto gris claro para cumplir un contraste mínimo de 4.5:1.
- Asociar cada campo de formulario y cada lista desplegable con una etiqueta (`<label for>`).
- Subrayar los enlaces que aparecen dentro de párrafos, para que no dependan solo del color.
