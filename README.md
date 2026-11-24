# motion-presets-kit

Set tipado y validado en runtime de helpers para [`motion/react`](https://motion.dev) que facilita crear animaciones de entrada, salida y transiciones con valores por defecto sensatos.

- **API variant-returning**: funciones puras que retornan `Variants` de motion.
- **Validación con Zod** de todas las opciones (los tipos se derivan de los schemas).
- **Tree-shakeable**: 3 entry points (`.`, `./presets`, `./components`).
- **SSR-safe** y respeta `prefers-reduced-motion` por defecto.

## Instalación

```bash
pnpm add motion-presets-kit motion zod react react-dom
```

`react`, `react-dom`, `motion` y `zod` son peer dependencies.

## Skill para agentes de IA

El paquete incluye una skill (`skill/motion-presets-kit/SKILL.md`) para que
asistentes como opencode, Claude o agentes compatibles conozcan la API completa.
Al terminar la instalación se pregunta si deseas instalarla (solo en terminal
interactiva; en CI se omite). También puedes instalarla en cualquier momento:

```bash
npx motion-presets-kit add-skill            # auto-detecta .opencode, .claude, .agents
npx motion-presets-kit add-skill --global   # instala en tu HOME
npx motion-presets-kit add-skill --tool opencode --project
```

Para omitir la pregunta usa `MOTION_PRESETS_KIT_SKIP_SKILL=1`.

## Uso rápido

```tsx
import { motion } from "motion/react";
import { fade, parentVariants } from "motion-presets-kit/presets";

export function Hero() {
	return (
		<motion.div variants={parentVariants({ delayChildren: 0.12 })}>
			<motion.h1 variants={fade({ direction: "up" })}>Hola</motion.h1>
			<motion.p variants={fade({ direction: "up", excludeDelay: true })}>
				Motion presets kit
			</motion.p>
		</motion.div>
	);
}
```

```tsx
import { TextAnimate, Marquee, useCounter, Draggable } from "motion-presets-kit/components";
```

## Entry points

| Import | Contenido |
|---|---|
| `motion-presets-kit` | schemas + presets + componentes |
| `motion-presets-kit/presets` | `fade`, `slide`, `scale`, `clipReveal`, `parentVariants` |
| `motion-presets-kit/components` | `TextAnimate`, `Marquee`, `Draggable`, `useCounter` |

## Presets

Todos los presets aceptan: `duration` (0.5), `delay` (0), `ease` (`[0.16, 1, 0.3, 1]`), `spring`, `excludeDelay` (false) y `reducedMotion` (true).

### `fade(options?)`

`direction` (`"up" | "down" | "left" | "right" | "none"`, default `"up"`), `distance` (60), `blur` (0), `scale` (1).

```tsx
<motion.div variants={fade({ direction: "left", distance: 40, blur: 8 })} />
```

### `slide(options?)`

Desplazamiento puro, **sin `opacity`**. `direction` (default `"right"`), `distance` (100).

```tsx
<motion.div variants={slide({ direction: "right" })} />
// initial: { x: -100 } → animate: { x: 0 }
```

### `scale(options?)`

`from` (0.8) → `1` junto con `opacity: 0 → 1`.

```tsx
<motion.div variants={scale({ from: 0.5 })} />
```

### `clipReveal(options?)`

Anima `clipPath` con insets por dirección y `scale` opcional.

```tsx
<motion.div variants={clipReveal({ direction: "up", scale: 1.1 })} />
// initial: { clipPath: "inset(100% 0% 0% 0%)" } → animate: { clipPath: "inset(0% 0% 0% 0%)" }
```

### `parentVariants(options?)`

Contenedor para stagger: `delayChildren` (0) y `startDelay` (0).

```tsx
<motion.div variants={parentVariants({ delayChildren: 0.1 })} initial="initial" whileInView="animate">
	<motion.span variants={fade({ excludeDelay: true })} />
	<motion.span variants={fade({ excludeDelay: true })} />
</motion.div>
```

## Componentes y hooks

### `<TextAnimate>`

`text` (requerido), `as` (`"p"`), `by` (`"word" | "letter"`), `type` (`blurIn | slideUp | slideDown | slideLeft | slideRight | typeWriter`), `duration`, `startDelay`, `highlight: string[]`, `highlightClassName`.

```tsx
<TextAnimate text="Hola <strong>mundo</strong>" by="letter" type="blurIn" highlight={["mundo"]} />
```

El HTML inline se inyecta con `dangerouslySetInnerHTML`; sanitiza `text` si viene de input no confiable.

### `<Marquee>`

CSS puro con `@keyframes` dinámicos. `children` (requerido), `speed` (20 s/vuelta), `direction` (`"left"`), `pauseOnHover` (true), `gap` (`"2rem"`).

```tsx
<Marquee speed={30} direction="right" gap="1.5rem">
	<span>Logo 1</span>
	<span>Logo 2</span>
</Marquee>
```

### `<Draggable>`

Wrapper de `motion.div`. `axis` (`"both"`), `bounds` (`"parent" | "document" | {top,right,bottom,left}`), `snapToGrid: [number, number]`, `dragElastic`, `dragMomentum`, `dragControls`, `onDragStart`/`onDrag`/`onDragEnd`.

```tsx
<Draggable axis="x" bounds="parent" snapToGrid={[20, 20]}>
	<div>Arrastrame</div>
</Draggable>
```

Con `bounds="parent"` el elemento queda restringido a su contenedor; el contenedor debería poder medirse (`position: relative`).

### `useCounter(ref, options?)`

`from` (0), `to` (100), `decimals` (0), `prefix`, `suffix`, `separator` (","), `format`, `duration` (1). Escribe el valor formateado en `ref.current.textContent` y retorna `{ value, start, reset }`.

```tsx
const ref = useRef<HTMLSpanElement>(null);
const { start, reset } = useCounter(ref, { to: 1250, separator: ",", suffix: " px" });
return <span ref={ref} />;
```

## Casos límite documentados

- **CL-001 — `excludeDelay` con stagger**: un hijo con `delay` propio sobrescribe el stagger del padre. Usa siempre `excludeDelay: true` en los hijos dentro de `parentVariants()`.
- **CL-003 — ClipReveal con `border-radius`**: el `clip-path` se superpone al radio del borde; es una limitación conocida del `clip-path`.
- **CL-005 — Counter con negativos**: el formateo preserva el signo (`-1,250`).
- **CL-007 — Draggable con bounds inválidos**: si `top > bottom` o `left > right`, se emite un `warn()` y se ignoran los límites.
- **CL-008 — SSR**: los presets retornan variants estáticas (sin `window`). Los componentes usan `whileInView`, que se activa solo en el cliente.
- **CL-009 — Reduced motion**: con `prefers-reduced-motion: reduce` (y `reducedMotion: true`, por defecto), los presets saltan al estado final, `TextAnimate` muestra el texto sin animar y `Marquee` no reproduce el loop.

## Desarrollo

```bash
pnpm playground   # demo Vite de todos los presets/componentes
pnpm test         # build + tests con node:test
pnpm typecheck
pnpm lint
pnpm build
```
