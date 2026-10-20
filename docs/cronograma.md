# Cronograma y reparto de trabajo — Grupo 7

Proyecto Final · Aseguramiento de la Calidad del Software (048) · Variante 2 (opencart.abstracta.us)
**Entrega: sábado 24 de octubre de 2026, 9:00 (Canvas).**

Integrantes: **Javier** Rivera (J) · **Karla** Rodríguez (K)

El cronograma detallado (WBS, con Gantt y porcentaje de cumplimiento) está en el documento
*Cronograma WBS* del equipo. Este archivo resume el reparto y los entregables.

---

## Requisitos que más puntos cuestan si se olvidan

| Requisito | Si falta |
|---|---|
| **Video individual** de pruebas manuales (uno de Javier, uno de Karla) | **−5 pts** |
| Tests automatizados que ejecutan y pasan | −2 pts |
| Marco teórico y conclusiones personales en el documento | −2 pts |
| Mínimo 10 commits, repartidos en las 4 semanas | −1 pt |
| Cada defecto con su GitHub Issue | −0.5 pts por defecto |

---

## Reparto

| Tarea | Responsable | Estado |
|---|---|---|
| Configuración del proyecto, Page Objects, smoke y regresión | J | ✅ |
| Repositorio, defectos DR-001 a DR-005 y evidencias | J | ✅ |
| Análisis de tests inestables | J | ✅ |
| Diseño de los 21 casos de prueba (F01–F09) | J | ✅ |
| Documentos de trabajo en grupo (Acta, WBS, Metodología, Política) | J | ✅ |
| Issues #4 y #5 | J | Pendiente |
| Ejecución de casos F01–F05 y **video individual** | J | 18–20 oct |
| Ejecución de casos F06–F09 y **video individual** | K | 18–20 oct |
| Test parametrizado, GitHub Actions y axe-core (bonos) | J | 18–22 oct |
| Reuniones 1, 2 y 3 con minuta y foto | J y K | 17, 20 y 23 oct |
| Documento formal | J | 18–23 oct |
| **Conclusiones individuales** | J y K (cada uno la suya) | antes del 23 oct |
| Carta reflexiva del grupo | J y K | 23 oct |
| Entrega en Canvas | J | 24 oct, 9:00 |

## Commits

| Semana | Quién | Commit |
|---|---|---|
| 2 | J | 5 commits: estructura, Page Objects, tests, defectos y evidencias, reporte HTML |
| 3 | J | Mensajes verificados en los tests; casos de prueba manuales |
| 4 | J | GitHub Actions; test parametrizado; axe-core; resultados de los casos; enlaces de los Issues; reporte HTML final |
| 4 | K | Cronograma y evidencias de los casos F06–F09 |

## Recordatorios éticos (sección 13)

- No crear usuarios de más: la suite usa una cuenta fija por navegador (`test-data/users.ts`)
  y solo crea cuentas nuevas en los tests de registro y cambio de contraseña.
- No saturar el sitio con reseñas: correr la suite completa solo cuando haga falta;
  para el día a día, `npm run test:smoke`.
- Datos siempre ficticios (dominio `example.com`).
