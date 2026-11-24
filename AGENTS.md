# AGENTS.md — motion-presets-kit

## Proyecto

motion-presets-kit es un set tipado de helpers y presets para Framer Motion que facilita
crear animaciones de entrada, salida y transiciones con valores por defecto sensatos.
Incluye un core de animaciones básicas (fade, slide, zoom, scale) y presets especiales
como SplitText, Typewriter, Marquee, Counter, Parallax, ClipReveal y Drag & Drop.
Cada opción se valida con TypeScript y los presets son tree-shakeables.

## Comandos

- Ejecutar playground: `pnpm playground`
- Tests: `pnpm test`
- Lint/formato: `pnpm lint`
- Build: `pnpm build`
- Typecheck: `pnpm typecheck`

## Estilo y convenciones

- **Código (variables, funciones, archivos):** inglés
- **Documentación, commits y comentarios:** español
- **Estructura:** seguir la misma arquitectura que gsap-presets-kit (core/, presets/, schemas/)
- **Tests:** node:test (mismo setup que el proyecto hermano)

## Reglas

- Lee `docs/constitution.md` y la spec activa (`spec/NNN-.../spec.md`) antes de tocar o analizar código.
- Si la tarea incluye cambios visuales o componentes UI, lee obligatoriamente `DESIGN.md`.
- No instales dependencias adicionales sin consultar previamente.
- La API principal debe ser funcional y composable, no declarativa (evitar componentes wrapper).
- Mantener compatibilidad con React 18+ y Framer Motion 11+.
- Respeta `prefers-reduced-motion` por defecto en todos los presets.
- Los schemas de validación deben cubrir todas las opciones de cada preset.

## Al terminar cualquier tarea

- Ejecutar la suite de pruebas (`pnpm test`) para garantizar que no hay regresiones.
- Verificar calidad de código y tipos (`pnpm typecheck`).
