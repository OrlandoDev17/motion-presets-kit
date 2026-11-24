# Changelog

Todas las versiones notables de este proyecto se documentan en este archivo.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es/1.1.0/) y el
versionado se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [0.1.0] - 2026-09-28

### Añadido

- Presets `fade`, `slide`, `scale`, `clipReveal` y `parentVariants`.
- Componentes `TextAnimate`, `Marquee`, `Draggable` y el hook `useCounter`.
- Validación en runtime con Zod y tipos derivados de los schemas.
- 3 entry points tree-shakeable: `.`, `./presets`, `./components`.
- Soporte de `prefers-reduced-motion` y comportamiento SSR-safe.
- Skill para agentes de IA incluida en el paquete, con CLI
  `npx motion-presets-kit add-skill` y pregunta opcional en `postinstall`.

### Corregido

- `Draggable` con `bounds="parent"` / `"document"` ahora restringe de verdad
  (se resuelve a un ref del contenedor; motion no acepta strings).
- `useCounter` expone un `value` reactivo y callbacks estables.
- Tipos compatibles con React 19 (`React.JSX.IntrinsicElements`).
