# Tasks 001 — Core Animations & Presets (motion-presets-kit)

> **Estado Sincronización Jira:** Gestionado únicamente de forma local

## Fase 1 — Configuración base

- [x] **T-1: Configuración del paquete**
  Modificar `package.json` (peerDeps: `motion`, `react`, `react-dom`, `zod`; scripts: `build`, `test`, `typecheck`, `lint`, `playground`; exports map con 3 entry points) y crear `tsconfig.json` (strict + verbatimModuleSyntax), `tsup.config.ts` (3 entries, ESM+CJS+DTS) y `biome.json`.
  *Criterio:* `pnpm install` exitoso; `pnpm build` genera `dist/index.js`, `dist/presets.js`, `dist/components.js` + tipos.

- [x] **T-2: Utilidades compartidas**
  Crear `src/utils/warn.ts` (warn con prefijo, off en producción), `src/utils/easing.ts` (`DEFAULT_EASE = [0.16, 1, 0.3, 1]`, `buildTransition()` con soporte spring/excludeDelay) y `src/utils/reduced-motion.ts` (`shouldReduceMotion()` con guard SSR).
  *Criterio:* `buildTransition` retorna spring si definido, omite delay si `excludeDelay`. `pnpm typecheck` pasa.

## Fase 2 — Presets variant-returning

- [x] **T-3: Implementar fade()**
  Crear `src/schemas/fade.ts` (`fadeOptionsSchema`: direction, distance, blur, scale + base) y `src/presets/fade.ts` (`fade(options?): Variants` con `{ initial, animate }`, offsets por dirección, will-change).
  *Criterio:* `fade()` default retorna initial `{opacity: 0, y: 60}` y animate con transición duration 0.5. `blur > 0` anima filter (RF-021).

- [x] **T-4: Implementar slide()**
  Crear `src/schemas/slide.ts` y `src/presets/slide.ts` — variante de desplazamiento puro (x/y según dirección, sin opacity, distance default 100).
  *Criterio:* `slide({direction: "right"})` retorna initial `{x: -100}` (entra desde la izquierda hacia la derecha). Sin `opacity` en variants (RF-034).

- [x] **T-5: Implementar scale()**
  Crear `src/schemas/scale.ts` y `src/presets/scale.ts` — escala inicial `from` (default 0.8) → 1 con opacity 0→1.
  *Criterio:* `scale({from: 0.5})` retorna initial `{opacity: 0, scale: 0.5}`, animate `{opacity: 1, scale: 1}`.

- [x] **T-6: Implementar clipReveal()**
  Crear `src/schemas/clip-reveal.ts` y `src/presets/clip-reveal.ts` — `clipPath` animado con map de insets por dirección + scale opcional.
  *Criterio:* `clipReveal({direction: "up"})` retorna initial `clipPath: "inset(100% 0% 0% 0%)"`, animate `clipPath: "inset(0% 0% 0% 0%)"`.

- [x] **T-7: Implementar parentVariants()**
  Crear `src/schemas/parent-variants.ts` y `src/presets/parent-variants.ts` — usa `stagger()` de motion/react con `delayChildren` y `startDelay`.
  *Criterio:* retorna `{initial: {opacity: 0}, animate: {opacity: 1, transition: {delayChildren: stagger(...)}}}` (RF-065).

- [x] **T-8: Barrels de presets y entrada principal**
  Crear `src/presets/index.ts` (re-exporta los 5 presets + sus tipos y schemas) y `src/index.ts` (re-exporta schemas + presets; components se agregan en T-15).
  *Criterio:* `import { fade } from "./presets"` funciona; tree-shaking intacto (chunks separados).

## Fase 3 — Tests de presets

- [x] **T-9: Tests de fade y slide**
  Crear `test/fade.test.mjs` y `test/slide.test.mjs` — defaults exactos, todas las direcciones, spring override (CL-006), excludeDelay, reducedMotion (mock matchMedia), opciones inválidas → warn + defaults (RF-112).
  *Criterio:* `pnpm test` pasa; cubre CL-006.

- [x] **T-10: Tests de scale y clipReveal**
  Crear `test/scale.test.mjs` y `test/clip-reveal.test.mjs` — from custom, clip-path por dirección, scale opcional, reducedMotion.
  *Criterio:* `pnpm test` pasa.

- [x] **T-11: Tests de parentVariants**
  Crear `test/parent-variants.test.mjs` — stagger calculado, startDelay, interacción con excludeDelay de hijos (CL-001).
  *Criterio:* `pnpm test` pasa; cubre CL-001.

## Fase 4 — Componentes y hooks

- [x] **T-12: Componente TextAnimate**
  Crear `src/schemas/text-animate.ts` y `src/components/TextAnimate.tsx` — split word/letter en spans inline, 6 tipos de animación (blurIn, slideUp/Down/Left/Right, typeWriter), highlight con rangos case-insensitive, `motion.create()` cacheado en Map, `whileInView` + `viewport={{ once: true }}`.
  *Criterio:* `<TextAnimate text="Hello" by="word" />` renderiza 2 spans animados. `pnpm typecheck` pasa. CL-004 (HTML preservado).

- [x] **T-13: Componente Marquee**
  Crear `src/schemas/marquee.ts` y `src/components/Marquee.tsx` — CSS puro con `@keyframes` dinámicos (IDs únicos con `useId()`), duplicación de children, pauseOnHover, mask-image para fade en bordes, memoizado.
  *Criterio:* `<Marquee speed={20}>…</Marquee>` genera loop infinito sin costuras. CL-002 (1 hijo duplicado).

- [x] **T-14: Componente Draggable**
  Crear `src/schemas/draggable.ts` y `src/components/Draggable.tsx` — wrapper de `motion.div` con axis, bounds ("parent"|"document"|objeto), snapToGrid, dragElastic, dragMomentum, callbacks onDrag*, dragControls.
  *Criterio:* bounds inválidos → warn + sin bounds (CL-007). `pnpm typecheck` pasa.

- [x] **T-15: Hook useCounter**
  Crear `src/schemas/counter.ts` y `src/components/hooks/useCounter.ts` — `useMotionValue(from)` + animate a `to`, formateo (separator miles, decimals, prefix/suffix, format custom), escribe en `ref.current.textContent`, retorna `{ value, start, reset }`, reducedMotion → valor final directo.
  *Criterio:* formateo: `counter 1250 → "1,250"`; negativos con signo (CL-005); `pnpm typecheck` pasa.

- [x] **T-16: Barrel de components y index final**
  Crear `src/components/index.ts` (TextAnimate, Marquee, Draggable, useCounter) y completar `src/index.ts` con el barrel de components.
  *Criterio:* `import { TextAnimate } from "motion-presets-kit/components"` funciona; entry `presets` no incluye componentes (RNF-005).

## Fase 5 — Tests de componentes y hooks

- [x] **T-17: Tests de TextAnimate y Marquee**
  Crear `test/text-animate.test.mjs` (lógica pura de split: words/letters, highlight ranges, tipos → params de fade) y `test/marquee.test.mjs` (generación de keyframes CSS por dirección/speed).
  *Criterio:* `pnpm test` pasa; cubre CL-002 y CL-004.

- [x] **T-18: Tests de useCounter y Draggable**
  Crear `test/counter.test.mjs` (formateo: separator, decimals, prefix/suffix, negativos CL-005, format custom) y `test/draggable.test.mjs` (validación de bounds CL-007).
  *Criterio:* `pnpm test` pasa.

## Fase 6 — Playground, docs y verificación

- [x] **T-19: Playground Vite + React**
  Crear `playground/` (Vite + React, workspace pnpm) con demo de: fade/slide/scale/clipReveal con controles, stagger con parentVariants, TextAnimate (todos los tipos y by), Marquee, useCounter, Draggable.
  *Criterio:* `pnpm playground` levanta sin errores; cada preset demostrado.

- [x] **T-20: README y verificación final**
  Crear `README.md` (instalación, API completa con ejemplos, tabla de opciones, casos límite documentados: CL-001 excludeDelay, CL-003 border-radius, CL-008 SSR) y ejecutar verificación completa: `pnpm build && pnpm typecheck && pnpm test && pnpm lint`.
  *Criterio:* Todos los comandos pasan; chunks separados en `dist/` (tree-shaking verificado); checklist de la spec 001 completo.
