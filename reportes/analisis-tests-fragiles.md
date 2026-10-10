# Análisis de tests frágiles

Proyecto Final · Grupo 7 · Variante 2 (opencart.abstracta.us)
Sección 8 del enunciado: test inestable identificado, diagnosticado y corregido.

**Fecha del análisis:** 1 de octubre de 2026
**Ambiente:** Windows 11 · Playwright 1.63.0 · Chromium y Firefox · 4 workers en paralelo (2 tras corregir el caso 4)

## Resumen

Durante las primeras corridas completas de la suite (30 tests: 15 por navegador)
aparecieron fallos que **no se repetían de forma consistente**: un test pasaba en una
corrida y fallaba en la siguiente, o pasaba en Chromium y fallaba en Firefox, sin que la
aplicación hubiera cambiado. Se identificaron tres causas raíz distintas:

| # | Causa raíz | Tipo (según el enunciado) | Tests afectados |
|---|---|---|---|
| 1 | Todos los tests compartían una sola cuenta y algunos la modificaban | Dependencia de estado entre tests | 4 a 11 tests por corrida |
| 2 | La navegación esperaba a que cargaran todas las imágenes del sitio | Espera inadecuada | 1 test, de forma intermitente |
| 3 | El test navegaba antes de que terminara el envío del formulario | Condición de carrera (falta de espera) | 1 test, de forma intermitente |
| 4 | Timeouts por defecto menores que la lentitud real del servidor | Espera inadecuada (configuración) | Tests distintos en cada corrida |
| 5 | `force: true` desactivaba la espera automática | Locator poco robusto | 1 test, de forma intermitente |

El caso principal es el **#1**. Los casos #2 a #5 aparecieron mientras se verificaba la
corrección del #1.

---

## Caso 1 — Dependencia de estado: la cuenta compartida

### Test y archivo

- `tests/regression-reviews.spec.ts` → **Cambio de contraseña @regression** (origen del problema)
- Afectados: todos los tests que inician sesión mediante el fixture `accountPage`
  (`fixtures/index.ts`) y los de `tests/regression-auth.spec.ts` que usan la cuenta.

### Cómo se manifestaba

**Corrida 1:** 26 pasaron y 4 fallaron, todos en Firefox. En Chromium pasaron los mismos
tests que fallaron en Firefox:

```
✘ [firefox] El ingreso con un usuario válido lleva a la cuenta @smoke
✘ [firefox] El cierre de sesión redirige correctamente @smoke
✘ [firefox] Editar un campo del perfil y verificar persistencia @regression
✘ [firefox] Cambio de contraseña @regression

Error: expect(page).toHaveURL(expected) failed
Expected pattern: /route=account\/account/
Received string:  ".../index.php?route=account/login"
```

**Corrida 2** (sin cambios en el código de esos tests): fallaron 11 tests, ahora en **ambos**
navegadores, e incluso falló "Inicio de sesión con una contraseña incorrecta", que en la
corrida 1 había pasado:

```
Expected substring: "No match for E-Mail Address and/or Password"
Received string:    "Warning: Your account has exceeded allowed number of login
                     attempts. Please try again in 1 hour."
```

### Diagnóstico

Todos los tests usaban **una única cuenta** (`usuarioExistente` en `test-data/users.ts`):

1. El test **Cambio de contraseña** le cambiaba la contraseña a esa cuenta y no la
   restauraba. En la corrida 1 este test terminó primero en Chromium; desde ese momento,
   los tests de Firefox (que corren en paralelo) intentaban entrar con la contraseña
   anterior y quedaban en la página de login. Por eso fallaban "solo en Firefox": no era
   un problema del navegador, sino del **orden de ejecución**.
2. Cada login fallido sumaba un intento fallido para ese email. OpenCart **bloquea el email
   durante 1 hora** al superar el límite de intentos. Entre los fallos anteriores, los
   reintentos (`retries: 1`) y el test de contraseña incorrecta (que falla a propósito en
   cada navegador), la cuenta quedó bloqueada y en la corrida 2 falló todo lo que la usaba.

En resumen: **el resultado de un test dependía de lo que otros tests habían hecho antes**
con la misma cuenta, en el mismo navegador, en el otro navegador o en corridas anteriores.

### Corrección aplicada

1. **Una cuenta fija por navegador** (`cuentasGrupo` en `test-data/users.ts`): Chromium y
   Firefox ya no comparten estado. El fixture `cuenta` (`fixtures/index.ts`) entrega la del
   navegador en que corre el test (`testInfo.project.name`).
2. **Ningún test modifica la contraseña de esas cuentas.** El test de cambio de contraseña
   ahora registra su **propia cuenta nueva**, le cambia la contraseña y verifica que la
   anterior deja de funcionar y la nueva sí (antes solo comprobaba el mensaje de éxito).
3. **`helpers/global-setup.ts`** (configurado como `globalSetup`): antes de cada corrida
   verifica que las cuentas existen (las registra si no) y que pueden iniciar sesión. Si
   una cuenta está bloqueada, la corrida se detiene con un mensaje claro en vez de producir
   muchos fallos confusos.
4. El test de email incorrecto usa un **email inexistente distinto en cada corrida**: como
   ese email nunca tiene un login exitoso, sus intentos fallidos se acumularían hasta
   bloquearse.

Se descartó la alternativa de "registrar una cuenta nueva en cada test" (que se probó y
también funcionaba) porque creaba unas 16 cuentas por corrida en un sitio compartido con
otros grupos, contra lo que pide la sección 13 del enunciado.

---

## Caso 2 — Espera inadecuada: el evento `load`

### Test y archivo

- `tests/smoke.spec.ts` → **La página principal carga con las categorías visibles @smoke** (Firefox)
- El problema afectaba a todos los `page.goto` del proyecto.

### Cómo se manifestaba

```
Error: page.goto: Test timeout of 30000ms exceeded.
  - navigating to "http://opencart.abstracta.us/", waiting until "load"
```

### Diagnóstico

`page.goto` espera por defecto el evento `load`, que se dispara cuando terminan de
descargarse **todas** las imágenes. Al medir la página principal: el HTML estaba listo a
los ~4.6 s, pero `load` llegaba a los ~7.7 s porque los banners y logos de marcas tardaban
de 3 a 5 s cada uno. Con 4 workers en paralelo contra un servidor lento, esa espera llegaba
a superar los 30 s del timeout.

### Corrección aplicada

Todas las navegaciones usan `{ waitUntil: 'domcontentloaded' }` (explicado en
`helpers/auth.ts`). Ningún test necesita las imágenes, y las aserciones de Playwright
(`toBeVisible`, `toHaveURL`, etc.) ya esperan automáticamente a que cada elemento aparezca.

---

## Caso 3 — Condición de carrera al editar el perfil

### Test y archivo

- `tests/regression-reviews.spec.ts` → **Editar un campo del perfil y verificar persistencia @regression**
- Método `editProfile` en `pages/AccountPage.ts`

### Cómo se manifestaba

Fallaba de forma intermitente por timeout (`Test timeout of 30000ms exceeded.`). La traza
de Playwright (`trace.zip`) mostró que la navegación a `account/edit`, inmediatamente
después de pulsar **Continue**, tardó más de 21 s y nunca terminó.

### Diagnóstico

`editProfile` hacía clic en **Continue** y terminaba de inmediato, sin esperar la respuesta
del servidor. El test pasaba enseguida a `page.goto('/index.php?route=account/edit')`
**mientras el formulario todavía se estaba enviando**. Esa navegación interrumpía el envío:
en el mejor caso el test esperaba de más, y en el peor el teléfono ni siquiera se guardaba.
Si el servidor respondía rápido el test pasaba; si no, fallaba.

### Corrección aplicada

`editProfile` ahora espera el mensaje de confirmación del sitio (`.alert-success` con
"successfully updated") antes de terminar, igual que ya hacía `changePassword`. Así el test
solo continúa cuando el cambio está guardado.

---

## Caso 4 — Timeouts calibrados para un servidor más rápido que el real

### Cómo se manifestaba

Con los casos 1 a 3 ya corregidos, una corrida dio 4 fallos, todos en Firefox y en tests
distintos a los de corridas anteriores:

```
Error: page.goto: Test timeout of 30000ms exceeded.
  - navigating to ".../index.php?route=product/product...", waiting until "domcontentloaded"

Error: expect(locator).toBeVisible() failed
Locator: locator('.alert-danger')
Error: element(s) not found
```

### Diagnóstico

Esta vez no llegaba a tiempo ni siquiera el HTML. Se midió el sitio sin ninguna otra
carga nuestra: **de 2 a 7 s por página** (6 peticiones con `curl`). Un test que inicia
sesión abre 4 o 5 páginas, así que puede pasar de 30 s sin que haya ningún error. Además, con
4 workers en paralelo las peticiones se acumulaban en el servidor y cada página tardaba
todavía más. El `expect` por defecto (5 s) también era menor que lo que el sitio tarda en
responder a un formulario, y por eso a veces "no aparecía" el mensaje de error.

No es un defecto de la tienda (las páginas sí cargan, solo que lento), sino una
configuración de tiempos que no correspondía al ambiente real.

### Corrección aplicada (`playwright.config.ts`)

| Ajuste | Antes | Después | Motivo |
|---|---|---|---|
| `timeout` | 30000 | 60000 | Un test con login abre 4-5 páginas de 2-7 s cada una |
| `expect.timeout` | 5000 (por defecto) | 10000 | Respuesta de formularios mayor a 5 s |
| `workers` | 4 (automático) | 2 | Menos peticiones simultáneas al sitio compartido (sección 13) |

`retries: 1` se mantiene como pide la guía, pero la verificación se hizo con
`--retries=0` para que no ocultara nada.

---

## Caso 5 — `force: true` desactivaba la espera automática

### Test y archivo

- `tests/regression-reviews.spec.ts` → **Calificar un producto con estrellas @regression** (Firefox)
- Métodos `openReviewsTab` y `rateProduct` en `pages/ProductPage.ts`

### Cómo se manifestaba

```
Error: locator.check: Element is not visible
  - locator resolved to <input value="5" type="radio" name="rating"/>
>    await this.page.locator(`input[name="rating"][value="${stars}"]`).check({ force: true });
```

### Diagnóstico

`rateProduct` marcaba la estrella con `check({ force: true })`. La opción `force`
**desactiva las comprobaciones automáticas** de Playwright (esperar a que el elemento sea
visible, estable y habilitado). Si el panel de reseñas aún no se había mostrado, el clic
se intentaba igual y fallaba. Apareció después de la corrección del caso 2: al no esperar
las imágenes, el test llega antes a la pestaña, a veces antes de que el JavaScript de las
pestañas termine de inicializarse, y entonces el clic en "Reviews" no hace nada.

### Corrección aplicada

1. Se quitó `force: true`: `check()` ahora espera a que la estrella sea visible.
2. `openReviewsTab` reintenta el clic en la pestaña hasta que el panel `#tab-review` es
   visible (`expect(...).toPass()`), en vez de suponer que un solo clic siempre funciona.

---

## Verificación

Todas las corridas se hicieron **sin reintentos** (`--retries=0`), para que un reintento
no ocultara un fallo intermitente.

| Etapa | Corridas consecutivas | Resultado |
|---|---|---|
| Antes de corregir | 2 | 4 y 11 fallos |
| Tras corregir el caso 1 | 2 | 1 fallo en cada una (casos 3 y 2) |
| Tras corregir el caso 2 (el 3 aún sin corregir) | 3 | 1 fallo (caso 3), 0, 0 |
| Tras corregir el caso 3 | 1 | 4 fallos (caso 4) — se detuvo la serie |
| Tras corregir el caso 4 | 1 | 1 fallo (caso 5) — se detuvo la serie |
| Tras corregir el caso 5 | 3 | 1, 1 y 2 fallos (ver "Fallos restantes") |
| Corrida oficial del 9/oct, con `retries: 1` | 1 | PENDIENTE |

### Fallos restantes: causa externa al proyecto

Después de las cinco correcciones, ningún fallo volvió a repetirse en el mismo test, y
los que se pudieron analizar no venían del código de la suite:

- **Corrida 1** (página principal) y **corrida 2** (`account/edit`): la traza mostró que el
  HTML llegó en menos de 3 s, pero el servidor **nunca respondió** la petición de un archivo
  estático. En la corrida 2 fue `moment.min.js` (estado `-1`, sin respuesta). Ese script
  está en el `<head>`, así que la página no termina de construirse y `page.goto` agota los
  60 s.
- **Corrida 3**: 2 fallos (`element(s) not found` y `net::ERR_ABORTED`). Sus evidencias se
  perdieron antes de analizarlas, así que **no tienen diagnóstico**.
- El 9 de octubre el sitio estuvo especialmente inestable: peticiones de 9, 18 y más de 60 s
  medidas con `curl`, y conexiones cortadas (`ERR_CONNECTION_RESET`). La preparación de
  cuentas (`helpers/global-setup.ts`) falló 3 veces seguidas por eso, y se le agregaron
  reintentos y una espera de 60 s por página.

Estos fallos no se pueden corregir desde la suite, porque dependen del servidor compartido.
Para eso se mantiene `retries: 1`, como pide la guía: un fallo puntual del servidor se
reintenta, mientras que un error real del test fallaría en los dos intentos.

## Lecciones

- **Cada test debe poder correr solo, en cualquier orden y en paralelo.** Si un test
  modifica datos (contraseña, perfil), esos datos deben ser suyos.
- Un fallo que aparece "solo en un navegador" no siempre es un problema del navegador:
  puede ser el orden en que corrieron los tests.
- Los reintentos (`retries`) **ocultan** la inestabilidad; para diagnosticar hay que correr
  con `--retries=0` y varias veces seguidas.
- La traza (`trace: 'retain-on-failure'`) fue la herramienta clave para el caso 3: mostró
  exactamente qué paso se quedó esperando.
