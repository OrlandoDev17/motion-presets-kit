# Project Constitution & SDD Rules — motion-presets-kit

## 1. Principios de Código y Calidad

- **Tipado:** Máxima estricticidad TypeScript. `strict: true`, `noUncheckedIndexedAccess: true`, `noFallthroughCasesInSwitch: true`. Prohibido el uso de `any` explícito. Preferir tipos inferidos y genéricos.
- **Manejo de Errores:** Usar `warn()` (console.warn en dev) sin lanzar excepciones. Si el target no existe o las opciones son inválidas, registrar advertencia y fallar silenciosamente. Nunca romper el flujo de la aplicación del usuario.
- **Persistencia y Caché:** Manejar siempre estados de carga, error y sincronización/caché cuando aplique.
- **Formato y Calidad:** Se deben cumplir estrictamente las reglas de linter y formateo antes de considerar una tarea terminada.

## 2. Reglas del Protocolo SDD

1. Ninguna tarea se implementa sin un archivo `spec/NNN-[feature]/spec.md` aprobado.
2. Cada spec debe desglosarse en `plan.md` y `tasks.md`.
3. Está prohibido modificar archivos o componentes fuera del alcance indicado en la tarea activa de `tasks.md`.

## 3. Límites e Invariantes

- **API Funcional Pura:** Las funciones helper no deben mutar estado externo ni depender de efectos colaterales invisibles. Cada llamada debe ser predecible y autocontenido.
- **Tree-shakeable Siempre:** Cada preset y helper se importa por separado. Nunca forzar imports que incluyan módulos no utilizados. Usar subpaths (`motion-presets-kit/core`, `motion-presets-kit/typewriter`, etc.).
- **SSR-Safe:** Todos los helpers deben funcionar en entornos SSR (devolver `undefined` cuando no exista `document`). No asumir entorno de navegador en tiempo de importación.
- **Respetar `prefers-reduced-motion`:** Todos los presets deben honrar esta preferencia por defecto (opción `reducedMotion`, default `true`). En modo reducido, saltar al estado final o mostrar contenido sin animar.
- **Validación con Zod en Runtime:** Cada objeto de opciones se valida antes de usarse. Los tipos públicos se derivan de los schemas (never hand-written).
- **Compatibilidad:** React 18+ y Framer Motion 11+. No usar features de React 19 ni de versiones antiguas de FM.
- **Sin dependencias adicionales:** No instalar librerías externas sin previa consulta y justificación técnica.
