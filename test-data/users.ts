// Datos de prueba — ficticios, nunca datos personales reales (sección 13).
// Se usa el dominio reservado example.com: no pertenece a nadie y nunca
// recibe correo.

export type Usuario = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
};

// Cuentas de prueba del Grupo 7, UNA POR NAVEGADOR (la clave es el nombre
// del proyecto en playwright.config.ts). Las crea helpers/global-setup.ts
// antes de cada corrida si todavía no existen.
//
// Por qué una por navegador y no una sola: Chromium y Firefox corren en
// paralelo. Con una sola cuenta, lo que un navegador hacía (p. ej. los
// logins fallidos a propósito) afectaba al otro. Ver
// reportes/analisis-tests-fragiles.md.
//
// REGLA: ningún test debe cambiar la contraseña de estas cuentas.
export const cuentasGrupo: Record<string, Usuario> = {
  chromium: {
    firstName: 'Grupo7',
    lastName: 'Chromium',
    email: 'grupo7.qa.chromium@example.com',
    telephone: '00000000',
    password: 'Grupo7Clave2026!',
  },
  firefox: {
    firstName: 'Grupo7',
    lastName: 'Firefox',
    email: 'grupo7.qa.firefox@example.com',
    telephone: '00000000',
    password: 'Grupo7Clave2026!',
  },
};

// Genera un usuario nuevo y único. Solo para los tests que necesitan una
// cuenta propia (registro válido y cambio de contraseña), para no crear
// usuarios de más en el sitio compartido (sección 13).
// El sufijo aleatorio evita choques cuando dos workers paralelos llaman a
// esta función en el mismo milisegundo.
export const nuevoUsuario = (): Usuario => {
  const id = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    firstName: 'Prueba',
    lastName: `Grupo7_${id.slice(-6)}`,
    email: `grupo7.nuevo.${id}@example.com`,
    telephone: '00000000',
    password: 'ClaveSegura123!',
  };
};

// Página de producto verificada en vivo (Samsung Galaxy Tab 10.1) —
// tiene pestaña de reseñas y botón "Add to Cart" funcionales
export const PRODUCTO_PRUEBA_URL = '/index.php?route=product/product&path=57&product_id=49';

// TODO: agregar más casos representativos según las CE que definan en el
// Plan de Pruebas (ej. contraseñas que no coinciden, formatos de email inválidos)
