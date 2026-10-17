# Reporte de defectos

Proyecto Final · Grupo 7 · Variante 2 (opencart.abstracta.us)
Plantilla de la sección 7 del enunciado. Cada defecto tiene su GitHub Issue; el estado
aquí debe coincidir con el del Issue.

**Ambiente común:** https://opencart.abstracta.us · Chromium (Playwright 1.63.0) y Chrome ·
Windows 11 · 9 de octubre de 2026

Evidencias en [`evidencias/`](../evidencias/).

| ID | Título | Funcionalidad | Severidad | Prioridad | Descubierto por | Issue |
|---|---|---|---|---|---|---|
| DR-001 | La búsqueda con `%` devuelve todo el catálogo | F08 | Media | P3 | Javier Rivera | PENDIENTE |
| DR-002 | El teléfono acepta letras y símbolos en el registro | F01 / F09 | Media | P2 | Javier Rivera | PENDIENTE |
| DR-003 | El registro acepta contraseñas triviales como `1234` | F01 / F05 | Media | P2 | Javier Rivera | PENDIENTE |
| DR-004 | Nombre y apellido aceptan solo números o etiquetas HTML | F01 / F09 | Baja | P3 | Javier Rivera | PENDIENTE |
| DR-005 | El contador de "Desktops (13)" no coincide con los 12 productos listados | F08 | Baja | P3 | Javier Rivera | PENDIENTE |

---

## DR-001 — La búsqueda con `%` devuelve todo el catálogo

| Campo | Valor |
|---|---|
| ID | DR-001 |
| Fecha | 09/10/2026 |
| Descubierto por | Javier Rivera |
| Funcionalidad | F08 — Navegación y búsqueda de productos |
| Caso de prueba origen | TC-N04 (caracteres especiales en campos de texto libre) |
| Tipo | Exploratorio |
| Severidad | Media |
| Prioridad | P3 |
| Ambiente | https://opencart.abstracta.us · Chromium · Windows 11 |
| Evidencia | `evidencias/DR-001-busqueda-porcentaje.png` |
| Estado | Abierto |
| Enlace al Issue | PENDIENTE |

**Pasos para reproducir**
1. Ir a https://opencart.abstracta.us
2. Escribir `%` en el buscador del encabezado.
3. Presionar Enter o el botón de la lupa.

**Resultado esperado:** el sistema trata `%` como texto literal y muestra "There is no
product that matches the search criteria." (ningún producto contiene `%` en su nombre).

**Resultado obtenido:** se muestran los 19 productos del catálogo ("Showing 1 to 15 of 19
(2 Pages)"). El carácter `%` se interpreta como comodín de la consulta a la base de datos
en vez de como texto.

---

## DR-002 — El teléfono acepta letras y símbolos en el registro

| Campo | Valor |
|---|---|
| ID | DR-002 |
| Fecha | 09/10/2026 |
| Descubierto por | Javier Rivera |
| Funcionalidad | F01 — Registro de usuario / F09 — Validaciones |
| Caso de prueba origen | TC-N04 (caracteres especiales en campos de texto libre) |
| Tipo | Exploratorio |
| Severidad | Media |
| Prioridad | P2 |
| Ambiente | https://opencart.abstracta.us · Chromium · Windows 11 |
| Evidencia | `evidencias/DR-002-DR-003-telefono-y-contrasena.png` |
| Estado | Abierto |
| Enlace al Issue | PENDIENTE |

**Pasos para reproducir**
1. Ir a https://opencart.abstracta.us/index.php?route=account/register
2. Llenar First Name `Prueba`, Last Name `Grupo7`, E-Mail `grupo7.evidencia@example.com`.
3. Escribir `abc-xyz` en Telephone.
4. Escribir `1234` en Password y `9999` en Password Confirm (distinta a propósito, para que
   no se cree la cuenta y se vean todas las validaciones).
5. Marcar "Privacy Policy" y hacer clic en Continue.

**Resultado esperado:** un mensaje de error junto a Telephone indicando que solo admite
números (y, opcionalmente, `+`, espacios o guiones).

**Resultado obtenido:** el campo Telephone no muestra ningún error. El único error es el de
la confirmación de contraseña, lo que indica que `abc-xyz` se acepta como teléfono válido
(OpenCart solo valida la longitud, de 3 a 32 caracteres).

---

## DR-003 — El registro acepta contraseñas triviales como `1234`

| Campo | Valor |
|---|---|
| ID | DR-003 |
| Fecha | 09/10/2026 |
| Descubierto por | Javier Rivera |
| Funcionalidad | F01 — Registro de usuario / F05 — Cambio de contraseña |
| Caso de prueba origen | TC-R01 (registro válido) — análisis de valores en la frontera de la contraseña |
| Tipo | Exploratorio |
| Severidad | Media |
| Prioridad | P2 |
| Ambiente | https://opencart.abstracta.us · Chromium · Windows 11 |
| Evidencia | `evidencias/DR-002-DR-003-telefono-y-contrasena.png` |
| Estado | Abierto |
| Enlace al Issue | PENDIENTE |

**Pasos para reproducir**
1. Seguir los pasos 1 a 5 de DR-002 (Password `1234`, Password Confirm `9999`).

**Resultado esperado:** un mensaje junto a Password indicando los requisitos mínimos de
seguridad (por ejemplo, al menos 8 caracteres, con letras y números).

**Resultado obtenido:** Password no muestra ningún error con `1234` (4 dígitos
consecutivos); solo se rechaza la confirmación. El sistema acepta como válidas contraseñas
de 4 caracteres sin ningún requisito de complejidad, lo que expone las cuentas a ataques de
adivinación.

---

## DR-004 — Nombre y apellido aceptan solo números o etiquetas HTML

| Campo | Valor |
|---|---|
| ID | DR-004 |
| Fecha | 09/10/2026 |
| Descubierto por | Javier Rivera |
| Funcionalidad | F01 — Registro de usuario / F09 — Validaciones |
| Caso de prueba origen | TC-N04 (caracteres especiales en campos de texto libre) |
| Tipo | Exploratorio |
| Severidad | Baja |
| Prioridad | P3 |
| Ambiente | https://opencart.abstracta.us · Chromium · Windows 11 |
| Evidencia | `evidencias/DR-004-nombre-numeros-simbolos.png` |
| Estado | Abierto |
| Enlace al Issue | PENDIENTE |

**Pasos para reproducir**
1. Ir a https://opencart.abstracta.us/index.php?route=account/register
2. Escribir `12345` en First Name y `<b>@@@</b>` en Last Name.
3. E-Mail `grupo7.evidencia@example.com`, Telephone `00000000`.
4. Password `Clave123!`, Password Confirm `Distinta123!` (distinta a propósito).
5. Marcar "Privacy Policy" y hacer clic en Continue.

**Resultado esperado:** mensajes de error en First Name y Last Name indicando que deben
contener letras (un nombre no puede ser solo números ni contener etiquetas HTML).

**Resultado obtenido:** ni First Name ni Last Name muestran error; solo aparece el de la
confirmación de contraseña. El sistema acepta nombres formados solo por números y
apellidos con etiquetas HTML y símbolos.

---

## DR-005 — El contador de "Desktops (13)" no coincide con los 12 productos listados

| Campo | Valor |
|---|---|
| ID | DR-005 |
| Fecha | 09/10/2026 |
| Descubierto por | Javier Rivera |
| Funcionalidad | F08 — Navegación y búsqueda de productos |
| Caso de prueba origen | TC-N01 (navegar por las categorías del menú) |
| Tipo | Exploratorio |
| Severidad | Baja |
| Prioridad | P3 |
| Ambiente | https://opencart.abstracta.us · Chromium · Windows 11 |
| Evidencia | `evidencias/DR-005-contador-desktops.png` |
| Estado | Abierto |
| Enlace al Issue | PENDIENTE |

**Pasos para reproducir**
1. Ir a https://opencart.abstracta.us
2. En el menú superior, abrir Desktops → "Show All Desktops".
3. Comparar el contador del menú lateral con la cantidad de productos listados.

**Resultado esperado:** el contador del menú lateral coincide con la cantidad de productos
que se muestran en la categoría.

**Resultado obtenido:** el menú lateral dice "Desktops (13)", pero la categoría muestra 12
productos ("Showing 1 to 12 of 12 (1 Pages)"). El cliente ve un número de productos que no
puede encontrar.

---

## Cómo crear cada Issue en GitHub

En el repositorio: **Issues → New issue**.

- **Título:** `DR-00X: <título del defecto>` (por ejemplo, `DR-001: La búsqueda con % devuelve todo el catálogo`).
- **Descripción:** copiar la sección del defecto desde la tabla de campos hasta el final
  (pasos, esperado, obtenido) y **arrastrar la captura** de `evidencias/` al cuadro de texto.
- **Labels:** `bug` y la severidad (crear las etiquetas `severidad: media` y `severidad: baja`).
- Al crearlo, copiar la URL del Issue en la columna "Issue" de este archivo y en el README.
