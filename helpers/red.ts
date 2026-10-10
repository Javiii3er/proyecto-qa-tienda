import { BrowserContext } from '@playwright/test';

/**
 * Bloquea los scripts del selector de fechas (moment.js y
 * bootstrap-datetimepicker) que cargan las páginas de registro y de edición
 * de perfil.
 *
 * Por qué: el servidor demo deja colgadas con frecuencia las descargas de
 * moment.min.js (medido: más de 30 s sin terminar). Como el script está en el
 * <head>, la página no termina de construirse y el test agota su tiempo.
 * Ningún test usa campos de fecha, así que bloquearlos no cambia lo que se
 * prueba. Ver reportes/analisis-tests-fragiles.md (caso 6).
 */
export async function bloquearScriptsDeFecha(context: BrowserContext) {
  await context.route(/datetimepicker/, (route) => route.abort());
}
