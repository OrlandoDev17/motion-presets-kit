# Spec 001 — Core Animations & Presets (motion-presets-kit)

## Contexto y objetivo

Reescritura mejorada de `blaze-motion` (v1 → v2). Librería de animaciones tipada para
`motion/react` que provee helpers funcionales para animaciones de entrada, salida y
transiciones. La API es **variant-returning** (funciones puras que retornan objetos
`Variants`) más componentes de alto nivel para casos complejos.

**Patrón de API:**
```tsx
// Presets son funciones puras → retornan Variants
<motion.div variants={fade({ direction: "up", distance: 50 })}>

// Stagger en padre, hijos con excludeDelay
<motion.div variants={parentVariants({ delayChildren: 0.1 })}>
  <motion.span variants={fade({ excludeDelay: true })} />
</motion.div>

// Componentes para casos complejos
<TextAnimate text="Hello World" by="word" type="slideUp" />
<Marquee speed={20}>...</Marquee>
```

## Usuarios / actores

- **Desarrolladores frontend** que usan React + motion/react y quieren animaciones listas
  para usar sin configurar variants complejas.
- **Bibliotecas de componentes** que necesitan animaciones reutilizables y tipadas.
- **Agentes de IA** que consumen la skill para generar código correcto con la librería.

## Historias de usuario

### HU-01: Fade con dirección
**COMO** desarrollador quiero crear animaciones fade con dirección (up, down, left, right)
**PARA** revelar elementos al entrar al viewport sin escribir variants manualmente

### HU-02: Slide puro
**COMO** desarrollador quiero deslizar elementos desde una dirección
**PARA** crear transiciones de entrada/salida con movimiento

### HU-03: Scale entrance
**COMO** desarrollador quiero animaciones de escala (crecer/desdeñar)
**PARA** crear efectos de aparición con zoom

### HU-04: Stagger children
**COMO** desarrollador quiero animar hijos secuencialmente desde un padre
**PARA** crear listas y grids con animación escalonada

### HU-05: ClipReveal
**COMO** desarrollador quiero revelar elementos con clip-path animado
**PARA** crear efectos de reveal cinematográficos

### HU-06: SplitText reveal
**COMO** desarrollador quiero revelar texto palabra por palabra o letra por letra
**PARA** crear efectos de texto cinematográficos

### HU-07: TextAnimate (componente)
**COMO** desarrollador quiero un componente que anime texto automáticamente
**PARA** implementar efectos de texto sin configuración manual

### HU-08: Marquee
**COMO** desarrollador quiero un scroll infinito de elementos
**PARA** crear carruseles de logos, testimonials o contenido

### HU-09: Counter
**COMO** desarrollador quiero un contador animado de números
**PARA** mostrar estadísticas con efecto de conteo

### HU-10: Drag & Drop
**COMO** desarrollador quiero elementos arrastrables con motion
**PARA** crear interfaces interactivas de drag and drop

## Requisitos funcionales (EARS)

### Paquete y Build

- **RF-001:** EL SISTEMA usa `motion/react` como dependencia (NO `framer-motion`).
- **RF-002:** EL SISTEMA exporta 3 entry points: `index` (todo), `presets` (variantes), `components` (React).
- **RF-003:** EL SISTEMA valida todas las opciones con Zod v4 antes de retornar.
- **RF-004:** EL SISTEMA deriva los tipos públicos de los schemas Zod (nunca hand-written).
- **RF-005:** EL SISTEMA es tree-shakeable: importar `fade` no incluye `slide`.

### Preset — fade() → Variants

- **RF-010:** EL SISTEMA expone `fade(options?): Variants` como función pura.
- **RF-011:** EL SISTEMA acepta `direction: "up" | "down" | "left" | "right" | "none"` (default `"up"`).
- **RF-012:** EL SISTEMA acepta `distance: number` (default `60`) — px de desplazamiento.
- **RF-013:** EL SISTEMA acepta `duration: number` (default `0.5`).
- **RF-014:** EL SISTEMA acepta `delay: number` (default `0`).
- **RF-015:** EL SISTEMA acepta `ease: EasingFunction` (default `[0.16, 1, 0.3, 1]`).
- **RF-016:** EL SISTEMA acepta `spring: SpringOptions` — si se define, sobrescribe duration+ease.
- **RF-017:** EL SISTEMA acepta `blur: number` (default `0`) — px de blur inicial.
- **RF-018:** EL SISTEMA acepta `scale: number` (default `1`) — escala inicial.
- **RF-019:** EL SISTEMA acepta `excludeDelay: boolean` (default `false`) — excluye delay propio (para stagger).
- **RF-020:** EL SISTEMA retorna `{ initial: {...}, animate: {...} }` con `will-change: transform, opacity`.
- **RF-021:** SI `blur > 0`, ENTONCES EL SISTEMA anima `filter: "blur(Xpx)" → "blur(0px)"`.

### Preset — slide() → Variants

- **RF-030:** EL SISTEMA expone `slide(options?): Variants` como función pura.
- **RF-031:** EL SISTEMA acepta `direction: "up" | "down" | "left" | "right"` (default `"right"`).
- **RF-032:** EL SISTEMA acepta `distance: number` (default `100`).
- **RF-033:** EL SISTEMA acepta `duration`, `delay`, `ease`, `spring`, `excludeDelay` — mismos que fade.
- **RF-034:** EL SISTEMA retorna variants con `x` o `y` según dirección (sin `opacity`).

### Preset — scale() → Variants

- **RF-040:** EL SISTEMA expone `scale(options?): Variants` como función pura.
- **RF-041:** EL SISTEMA acepta `from: number` (default `0.8`) — escala inicial.
- **RF-042:** EL SISTEMA acepta `duration`, `delay`, `ease`, `spring`, `excludeDelay` — mismos que fade.
- **RF-043:** EL SISTEMA retorna variants con `scale` de `from` a `1` + `opacity: 0 → 1`.

### Preset — clipReveal() → Variants

- **RF-050:** EL SISTEMA expone `clipReveal(options?): Variants` como función pura.
- **RF-051:** EL SISTEMA acepta `direction: "up" | "down" | "left" | "right"` (default `"up"`).
- **RF-052:** EL SISTEMA acepta `scale: number` (opcional) — escala inicial junto con clip.
- **RF-053:** EL SISTEMA acepta `duration`, `delay`, `ease`, `spring`, `excludeDelay`.
- **RF-054:** EL SISTEMA retorna variants con `clipPath` animado de `inset(...)` a `inset(0)`.

### Preset — parentVariants() → Variants

- **RF-060:** EL SISTEMA expone `parentVariants(options?): Variants` como función pura.
- **RF-061:** EL SISTEMA acepta `delayChildren: number` (default `0`) — intervalo stagger.
- **RF-062:** EL SISTEMA acepta `startDelay: number` (default `0`) — delay antes del primer hijo.
- **RF-063:** EL SISTEMA usa `stagger()` de `motion/react` internamente.
- **RF-064:** EL SISTEMA retorna variants con `transition: { delayChildren: stagger(...) }`.
- **RF-065:** EL SISTEMA retorna `{ initial: { opacity: 0 }, animate: { opacity: 1, transition } }`.

### Component — TextAnimate

- **RF-070:** EL SISTEMA expone `<TextAnimate>` como componente React.
- **RF-071:** EL SISTEMA acepta `text: string` (requerido).
- **RF-072:** EL SISTEMA acepta `as: keyof JSX.IntrinsicElements` (default `"p"`).
- **RF-073:** EL SISTEMA acepta `by: "word" | "letter"` (default `"word"`).
- **RF-074:** EL SISTEMA acepta `type: "blurIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "typeWriter"` (default `"slideUp"`).
- **RF-075:** EL SISTEMA acepta `duration`, `startDelay`, `highlight: string[]`, `highlightClassName`.
- **RF-076:** EL SISTEMA divide el texto en `<span>` inline y anima con variants.
- **RF-077:** EL SISTEMA usa `whileInView` con `viewport={{ once: true }}` por defecto.
- **RF-078:** EL SISTEMA cachea motion components con `motion.create()` para performance.

### Component — Marquee

- **RF-080:** EL SISTEMA expone `<Marquee>` como componente React.
- **RF-081:** EL SISTEMA acepta `children: ReactNode` (requerido).
- **RF-082:** EL SISTEMA acepta `speed: number` (default `20`) — segundos por vuelta.
- **RF-083:** EL SISTEMA acepta `direction: "left" | "right"` (default `"left"`).
- **RF-084:** EL SISTEMA acepta `pauseOnHover: boolean` (default `true`).
- **RF-085:** EL SISTEMA acepta `gap: string` (default `"2rem"`).
- **RF-086:** EL SISTEMA implementa CSS puro con `@keyframes` dinámicos (NO motion/react).
- **RF-087:** EL SISTEMA duplica children para loop infinito sin costuras.
- **RF-088:** EL SISTEMA usa `mask-image` con gradiente para fade-out en bordes.

### Hook — useCounter

- **RF-090:** EL SISTEMA expone `useCounter(ref, options?)` como hook de React.
- **RF-091:** EL SISTEMA acepta `from: number` (default `0`), `to: number` (default `100`).
- **RF-092:** EL SISTEMA acepta `decimals`, `prefix`, `suffix`, `separator`, `format`.
- **RF-093:** EL SISTEMA escribe el valor formateado en `ref.current.textContent`.
- **RF-094:** EL SISTEMA retorna `{ value, start, reset }` para control programático.
- **RF-095:** SI `reducedMotion: true`, ENTONCES EL SISTEMA muestra el valor final directamente.

### Component — Draggable

- **RF-100:** EL SISTEMA expone `<Draggable>` como componente React wrapper de `motion.div`.
- **RF-101:** EL SISTEMA acepta `axis: "x" | "y" | "both"` (default `"both"`).
- **RF-102:** EL SISTEMA acepta `bounds: "parent" | "document" | Constraints`.
- **RF-103:** EL SISTEMA acepta `snapToGrid: [number, number]` (opcional).
- **RF-104:** EL SISTEMA acepta `onDragEnd`, `onDrag`, `onDragStart` callbacks.
- **RF-105:** EL SISTEMA soporta `dragElastic` y `dragMomentum`.
- **RF-106:** EL SISTEMA acepta `dragControls` para manipulación programática.

### Validación y Schemas

- **RF-110:** EL SISTEMA exporta schemas Zod: `fadeOptionsSchema`, `slideOptionsSchema`, `scaleOptionsSchema`, `clipRevealOptionsSchema`, `parentVariantsSchema`, `textAnimateOptionsSchema`, `marqueeOptionsSchema`, `counterOptionsSchema`, `draggableOptionsSchema`.
- **RF-111:** EL SISTEMA valida opciones con `.parse()` antes de retornar variants.
- **RF-112:** SI la validación falla, ENTONCES EL SISTEMA emite `warn()` y retorna variants por defecto.

### Reduced Motion

- **RF-120:** EL SISTEMA acepta `reducedMotion: boolean` (default `true`) en todos los presets.
- **RF-121:** MIENTRAS `reducedMotion: true` y `prefers-reduced-motion: reduce`, EL SISTEMA retorna variants con estado final (sin animación).
- **RF-122:** Para variant-returning, EL SISTEMA retorna `{ initial: {estado final}, animate: {estado final} }`.

## Requisitos no funcionales

- **RNF-001:** TypeScript estricto (`strict: true`, `noUncheckedIndexedAccess: true`, `verbatimModuleSyntax: true`).
- **RNF-002:** Bundle size mínimo: presets < 2KB min+gz, components < 3KB min+gz.
- **RNF-003:** Compatible con React 18+ y `motion/react` ^12.
- **RNF-004:** SSR-safe: los presets funcionan en SSR (retornan variants estáticas).
- **RNF-005:** Tree-shakeable: importar `fade` no incluye `slide` ni componentes.
- **RNF-006:** Validación con Zod v4 en runtime.
- **RNF-007:** Tests con `node:test` cubriendo happy paths y edge cases.
- **RNF-008:** Peer dependencies: `react`, `react-dom`, `motion`, `zod`.
- **RNF-009:** Seguir el estilo de código de `blaze-motion` (variables en inglés, comentarios en español).

## Casos límite y Clarificaciones

### CL-001: excludeDelay en hijos con stagger
**Cuándo:** Un hijo usa `fade()` dentro de un `parentVariants()` sin `excludeDelay: true`.
**Comportamiento:** El delay propio de `fade()` sobrescribe el stagger del padre. El usuario debe usar `excludeDelay: true` en hijos. Documentado en README.

### CL-002: Marquee con un solo hijo
**Cuándo:** `<Marquee>` tiene un solo hijo.
**Comportamiento:** El hijo se duplica internamente, funciona normalmente (loop con 2 items visuales).

### CL-003: ClipReveal con border-radius
**Cuándo:** El elemento tiene `border-radius`.
**Comportamiento:** El clip-path se superpone al border-radius. Limitación conocida, documentada.

### CL-004: TextAnimate con HTML en texto
**Cuándo:** El prop `text` contiene HTML (`<strong>`, `<a>`, etc.).
**Comportamiento:** El componente separa por palabras/letras pero preserva el HTML inline. Los tags se mantienen en su posición original.

### CL-005: Counter con valores negativos
**Cuándo:** `from` o `to` son negativos.
**Comportamiento:** Funciona correctamente, el formateo maneja negativos con signo.

### CL-006: fade() con spring y duration simultáneamente
**Cuándo:** Se pasan `spring` y `duration`/`ease` juntos.
**Comportamiento:** `spring` tiene prioridad, `duration` y `ease` se ignoran.

### CL-007: Draggable con bounds inválidos
**Cuándo:** `bounds` tiene `top > bottom` o `left > right`.
**Comportamiento:** Zod rechaza la opción, `warn()` y se usan bounds por defecto.

### CL-008: SSR con motion/react
**Cuándo:** El código se ejecuta en servidor (Next.js SSR, Astro, etc.).
**Comportamiento:** Los presets retornan variants válidas que funcionan sin `window`. Los componentes usan `whileInView` que se activa solo en cliente.

### CL-009: Reducir motion en Typewriter
**Cuándo:** `reducedMotion: true` y `prefers-reduced-motion: reduce`.
**Comportamiento:** `<TextAnimate>` muestra el texto completo sin animación. `<Marquee>` no reproduce la animación.

## Fuera de alcance

- **Zoom animation** (core): No se implementa en esta spec.
- **Layout animations** (AnimatePresence, layout prop): Se maneja directamente con motion.
- **Gestures** (tap, hover, focus): Se usan directamente de motion.
- **Parallax**: Mejor implementar con GSAP (ver gsap-presets-kit).
- **SSR hydration**: La librería no maneja hidratación, solo retorna variants estáticas.

## Criterios de finalización

- [ ] Todos los schemas Zod validan correctamente las opciones de cada preset.
- [ ] Presets variant-returning (fade, slide, scale, clipReveal, parentVariants) funcionan.
- [ ] Componentes (TextAnimate, Marquee) funcionan con motion/react.
- [ ] Hook useCounter funciona correctamente.
- [ ] Componente Draggable funciona con todas las opciones.
- [ ] `excludeDelay` funciona correctamente con parentVariants.
- [ ] `reducedMotion` funciona en cada preset/componente.
- [ ] Tests cubren happy paths y los 9 casos límite definidos.
- [ ] `pnpm typecheck` pasa sin errores.
- [ ] `pnpm test` pasa todos los tests.
- [ ] README actualizado con ejemplos de uso.

## Dudas abiertas

- **D-001:** ¿Usar `motion.create()` cacheado para TextAnimate o recrear en cada render?
- **D-002:** ¿Marquee debe ser CSS puro (como en blaze-motion) o usar motion/react?
- **D-003:** ¿Draggable debe ser un componente wrapper o un hook useDraggable?
- **D-004:** ¿Counter debe ser hook o componente TextAnimate con tipo "counter"?
