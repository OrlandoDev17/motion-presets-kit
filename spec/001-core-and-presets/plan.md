# Plan de Arquitectura 001 — Core Animations & Presets (motion-presets-kit)

> **Decisiones de dudas abiertas (spec 001):**
> - **D-001:** `motion.create()` cacheado en un `Map` por tag (patrón blaze-motion, evita recrear componentes por render).
> - **D-002:** Marquee con **CSS puro** (`@keyframes` dinámicos) — mejor performance para loops infinitos y menos JS en bundle.
> - **D-003:** Draggable como **componente wrapper** de `motion.div`.
> - **D-004:** Counter como **hook** `useCounter(ref, options)`.

## 1. Módulos y Archivos Afectados

### Configuración del paquete

| Archivo | Acción | Descripción |
|---|---|---|
| `package.json` | [MODIFICAR] | peerDeps (`motion`, `react`, `react-dom`, `zod`), scripts (`build`, `test`, `typecheck`, `lint`, `playground`), exports map (`.`, `./presets`, `./components`) |
| `tsconfig.json` | [CREAR] | `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `moduleResolution: Bundler` |
| `tsup.config.ts` | [CREAR] | 3 entry points (index, presets, components), ESM + CJS + DTS |
| `biome.json` | [CREAR] | Linter/formatter (mismo setup que blaze-motion) |

### Utilidades compartidas

| Archivo | Acción | Descripción |
|---|---|---|
| `src/utils/warn.ts` | [CREAR] | `warn(msg)` con prefijo `[motion-presets-kit]`, silenciado en producción |
| `src/utils/easing.ts` | [CREAR] | `DEFAULT_EASE = [0.16, 1, 0.3, 1]` + `buildTransition(options)` compartido |
| `src/utils/reduced-motion.ts` | [CREAR] | `shouldReduceMotion()` — `matchMedia` con guard SSR |

### Schemas (Zod v4)

| Archivo | Acción |
|---|---|
| `src/schemas/fade.ts` | [CREAR] — `fadeOptionsSchema` + `FadeOptions` |
| `src/schemas/slide.ts` | [CREAR] — `slideOptionsSchema` + `SlideOptions` |
| `src/schemas/scale.ts` | [CREAR] — `scaleOptionsSchema` + `ScaleOptions` |
| `src/schemas/clip-reveal.ts` | [CREAR] — `clipRevealOptionsSchema` + `ClipRevealOptions` |
| `src/schemas/parent-variants.ts` | [CREAR] — `parentVariantsSchema` + `ParentVariantsOptions` |
| `src/schemas/text-animate.ts` | [CREAR] — `textAnimateOptionsSchema` |
| `src/schemas/marquee.ts` | [CREAR] — `marqueeOptionsSchema` |
| `src/schemas/draggable.ts` | [CREAR] — `draggableOptionsSchema` |
| `src/schemas/counter.ts` | [CREAR] — `counterOptionsSchema` |
| `src/schemas/index.ts` | [CREAR] — barrel de schemas |

### Presets (funciones puras → Variants)

| Archivo | Acción |
|---|---|
| `src/presets/fade.ts` | [CREAR] — `fade(options?): Variants` |
| `src/presets/slide.ts` | [CREAR] — `slide(options?): Variants` |
| `src/presets/scale.ts` | [CREAR] — `scale(options?): Variants` |
| `src/presets/clip-reveal.ts` | [CREAR] — `clipReveal(options?): Variants` |
| `src/presets/parent-variants.ts` | [CREAR] — `parentVariants(options?): Variants` |
| `src/presets/index.ts` | [CREAR] — barrel de presets |

### Componentes y hooks (React)

| Archivo | Acción |
|---|---|
| `src/components/TextAnimate.tsx` | [CREAR] — split de texto + variants + `motion.create()` cacheado |
| `src/components/Marquee.tsx` | [CREAR] — CSS puro `@keyframes` con `useId()` |
| `src/components/Draggable.tsx` | [CREAR] — wrapper de `motion.div` con drag props |
| `src/components/hooks/useCounter.ts` | [CREAR] — hook contador con `useMotionValue` + `useTransform` |
| `src/components/index.ts` | [CREAR] — barrel de components |

### Entrada principal y tests

| Archivo | Acción |
|---|---|
| `src/index.ts` | [CREAR] — barrel principal (re-exporta schemas + presets + components) |
| `test/fade.test.mjs` | [CREAR] |
| `test/slide.test.mjs` | [CREAR] |
| `test/scale.test.mjs` | [CREAR] |
| `test/clip-reveal.test.mjs` | [CREAR] |
| `test/parent-variants.test.mjs` | [CREAR] |
| `test/text-animate.test.mjs` | [CREAR] — lógica pura de split + highlight ranges |
| `test/marquee.test.mjs` | [CREAR] — generación de keyframes CSS |
| `test/counter.test.mjs` | [CREAR] — formateo de números |
| `test/draggable.test.mjs` | [CREAR] — validación de bounds |

### Playground y docs

| Archivo | Acción |
|---|---|
| `playground/` | [CREAR] — Vite + React, demo de todos los presets |
| `README.md` | [CREAR] — instalación, API, ejemplos, casos límite documentados |

## 2. Diagrama o Flujo de Datos

### Flujo de un preset variant-returning

```
Usuario (JSX)
    │
    ▼
fade({ direction: "up", distance: 50 })
    │
    ▼
┌─────────────────────────────────────────────┐
│ 1. fadeOptionsSchema.parse(options)  (Zod) │
│    ├─ ok → opciones con defaults aplicados │
│    └─ error → warn() + defaults totales    │
├─────────────────────────────────────────────┤
│ 2. shouldReduceMotion()                    │
│    ├─ true → variants estado final         │
│    └─ false → continuar                    │
├─────────────────────────────────────────────┤
│ 3. buildTransition(options)                │
│    ├─ spring → { type: "spring", ... }     │
│    └─ si no → { duration, ease, delay? }   │
├─────────────────────────────────────────────┤
│ 4. Construir offsets por dirección         │
│    { up: {y: distance}, down: {y: -d}, … } │
└─────────────────────────────────────────────┘
    │
    ▼
{ initial: { opacity: 0, ...offsets },
  animate: { opacity: 1, x: 0, y: 0, transition } }
    │
    ▼
<motion.div variants={...} initial="initial" whileInView="animate" />
```

### Flujo de stagger (parentVariants + hijos)

```
<motion.div variants={parentVariants({ delayChildren: 0.1 })}
            initial="initial" whileInView="animate">
  <motion.span variants={fade({ excludeDelay: true })} />  ← sin delay propio
  <motion.span variants={fade({ excludeDelay: true })} />  ← hereda stagger
</motion.div>

parentVariants() → { initial: {opacity: 0},
                     animate: {opacity: 1,
                               transition: { delayChildren:
                                 stagger(0.1, { startDelay }) } } }
```

### Flujo de componentes

```
TextAnimate: text → split (word|letter) → highlight ranges → spans + variants → whileInView
Marquee:     props → useId() → @keyframes CSS inyectado → duplica children → loop
useCounter:  ref + options → useMotionValue(from) → animate(to) → useTransform(format) → textContent
Draggable:   props validados → spread sobre motion.div (drag, dragConstraints, …)
```

## 3. Modelo de Datos / Esquemas / Contratos

### Contratos TypeScript (públicos)

```typescript
import type { Variants, Transition, Easing, SpringOptions } from "motion/react";

// ---- Base compartida por todos los presets variant-returning ----
interface BasePresetOptions {
  duration?: number;                         // default 0.5
  delay?: number;                            // default 0
  ease?: Easing;                             // default [0.16, 1, 0.3, 1]
  spring?: Omit<SpringOptions, "keyframes">; // sobrescribe duration+ease
  excludeDelay?: boolean;                    // default false (compat stagger)
  reducedMotion?: boolean;                   // default true
}

interface FadeOptions extends BasePresetOptions {
  direction?: "up" | "down" | "left" | "right" | "none"; // default "up"
  distance?: number;    // default 60
  blur?: number;        // default 0 (px)
  scale?: number;       // default 1
}

interface SlideOptions extends BasePresetOptions {
  direction?: "up" | "down" | "left" | "right"; // default "right"
  distance?: number;    // default 100
}

interface ScaleOptions extends BasePresetOptions {
  from?: number;        // default 0.8
}

interface ClipRevealOptions extends BasePresetOptions {
  direction?: "up" | "down" | "left" | "right"; // default "up"
  scale?: number;       // opcional
}

interface ParentVariantsOptions {
  delayChildren?: number; // default 0
  startDelay?: number;    // default 0
}

// ---- Contratos de retorno (funciones puras) ----
declare function fade(options?: FadeOptions): Variants;
declare function slide(options?: SlideOptions): Variants;
declare function scale(options?: ScaleOptions): Variants;
declare function clipReveal(options?: ClipRevealOptions): Variants;
declare function parentVariants(options?: ParentVariantsOptions): Variants;
```

### Contratos de componentes y hooks

```typescript
import type { ReactNode, RefObject } from "react";
import type { HTMLMotionProps } from "motion/react";

// ---- TextAnimate ----
interface TextAnimateProps extends HTMLMotionProps<any> {
  text: string;                              // requerido
  as?: keyof JSX.IntrinsicElements;          // default "p"
  by?: "word" | "letter";                    // default "word"
  type?: "blurIn" | "slideUp" | "slideDown"
       | "slideLeft" | "slideRight" | "typeWriter"; // default "slideUp"
  duration?: number;                         // default 0.4
  startDelay?: number;                       // default 0
  highlight?: string[];                      // default []
  highlightClassName?: string;
}

// ---- Marquee ----
interface MarqueeProps {
  children: ReactNode;                       // requerido
  speed?: number;                            // default 20 (segundos/vuelta)
  direction?: "left" | "right";              // default "left"
  pauseOnHover?: boolean;                    // default true
  gap?: string;                              // default "2rem"
  className?: string;
}

// ---- Draggable ----
interface DraggableProps extends HTMLMotionProps<"div"> {
  axis?: "x" | "y" | "both";                 // default "both"
  bounds?: "parent" | "document" | { top?: number; right?: number; bottom?: number; left?: number };
  snapToGrid?: [number, number];
  dragElastic?: number | boolean;
  dragMomentum?: boolean;
  onDragStart?: (event: unknown, info: PanInfo) => void;
  onDrag?: (event: unknown, info: PanInfo) => void;
  onDragEnd?: (event: unknown, info: PanInfo) => void;
}

// ---- useCounter ----
interface CounterOptions {
  from?: number;            // default 0
  to?: number;              // default 100
  decimals?: number;        // default 0
  prefix?: string;          // default ""
  suffix?: string;          // default ""
  separator?: string;       // default ","
  format?: (value: number) => string; // sobrescribe formateo
  duration?: number;        // default 1
}

declare function useCounter(
  ref: RefObject<HTMLElement | null>,
  options?: CounterOptions,
): { value: number; start: () => void; reset: () => void };
```

### Contratos internos (utilidades)

```typescript
// src/utils/easing.ts
const DEFAULT_EASE: Easing = [0.16, 1, 0.3, 1];

function buildTransition(options: {
  duration: number; delay: number; ease: Easing;
  spring?: SpringOptions; excludeDelay: boolean;
}): Transition;
// spring definido → { type: "spring", ...spring }
// excludeDelay → omite delay (compat stagger del padre)

// src/utils/reduced-motion.ts
function shouldReduceMotion(reducedMotion: boolean): boolean;
// true solo si reducedMotion && matchMedia("(prefers-reduced-motion: reduce)")
// guard SSR: typeof window === "undefined" → false

// src/utils/warn.ts
function warn(message: string): void; // console.warn con prefijo, off en producción
```

### Map de entry points (package.json exports)

```json
{
  ".":          { "import": "./dist/index.js",      "require": "./dist/index.cjs" },
  "./presets":  { "import": "./dist/presets.js",    "require": "./dist/presets.cjs" },
  "./components": { "import": "./dist/components.js", "require": "./dist/components.cjs" }
}
```

## 4. Estrategia de Testing

### Unitarios (node:test, `test/**/*.test.mjs`)

Los presets son funciones puras → testeables sin DOM ni React:

| Test | Cobertura |
|---|---|
| `fade.test.mjs` | defaults exactos, cada dirección, blur, scale, spring override (CL-006), excludeDelay, reducedMotion, opciones inválidas → warn + defaults |
| `slide.test.mjs` | defaults, 4 direcciones, distance custom, sin opacity en variants |
| `scale.test.mjs` | from custom, opacity 0→1, spring |
| `clip-reveal.test.mjs` | 4 direcciones → clip-path inicial correcto, scale opcional |
| `parent-variants.test.mjs` | stagger delayChildren, startDelay, **CL-001 (excludeDelay)** |
| `text-animate.test.mjs` | lógica pura extraída: split words/letters, highlight ranges case-insensitive (CL-004) |
| `marquee.test.mjs` | lógica pura: generación de @keyframes, dirección, speed (CL-002) |
| `counter.test.mjs` | formateo: separador miles, decimals, prefix/suffix, negativos (CL-005), format custom |
| `draggable.test.mjs` | validación de bounds inválidos → defaults (CL-007) |

**Patrón:** importar desde `dist/` tras `pnpm build` (mismo setup que gsap-presets-kit: `pnpm test` ejecuta build primero).

**Reduced motion (CL-009):** mock de `matchMedia` con `--experimental-test-module-mocks`.

### Integración / E2E

- **Playground** Vite + React (`playground/`) como verificación visual manual de todos los presets, components y hooks.
- Verificación de tree-shaking: `pnpm build && ls dist/` — confirmar chunks separados por entry point.
- Comando de verificación final: `pnpm build && pnpm typecheck && pnpm test`.
