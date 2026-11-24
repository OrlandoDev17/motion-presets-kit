# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Desarrolladores frontend que evalúan librerías de animación para React y deciden
si adoptan motion-presets-kit. Llegan al playground desde el README, npm o GitHub
con una tarea concreta: comprobar si los presets y componentes hacen lo que
necesitan y entender rápido cómo se usan. Audiencia secundaria: agentes de IA que
consumen la documentación para generar código correcto con la librería.

## Product Purpose

motion-presets-kit es un set tipado y validado en runtime de helpers y presets
para `motion/react` que entrega animaciones de entrada, salida y transición con
defaults sensatos. El playground existe para demostrar en vivo cada preset y
componente, exponer sus valores por defecto reales y mostrar el código exacto de
uso. Éxito = un desarrollador entiende el valor y la API en minutos y sabe qué
importar y cómo llamarlo.

## Positioning

API variant-returning: funciones puras que retornan `Variants` de motion, con
opciones validadas por Zod y defaults sensatos. A diferencia de wrappers
declarativos, se compone directamente con `motion.*` y es tree-shakeable con 3
entry points. El playground es la única demo oficial y la referencia viva de esa
API.

## Operating Context

- Se ejecuta en local con `pnpm playground` (Vite).
- Cada helper y componente tiene opciones con defaults documentados en el README
  y en los schemas Zod.
- El playground sirve tanto para decidir la adopción como para copiar ejemplos.
- La librería respeta `prefers-reduced-motion`; los tests corren con node:test.

## Capabilities and Constraints

- Presets: `fade`, `slide`, `scale`, `clipReveal`, `parentVariants`.
- Componentes y hooks: `TextAnimate`, `Marquee`, `Draggable`, `useCounter`.
- Entry points: `motion-presets-kit`, `motion-presets-kit/presets`,
  `motion-presets-kit/components`.
- Restricciones: sin dependencias adicionales no consultadas; React 18+;
  `motion` ^12; TypeScript estricto; UI del playground en español.
- El playground no debe volverse un wrapper declarativo: la API es funcional.

## Brand Commitments

Nombre: motion-presets-kit. Voz de documentación en español, código en inglés.
La identidad visual actual (fondo oscuro + morado) es provisional, no vinculante.

## Evidence on Hand

Código fuente en `src/` (presets, components, schemas), README con ejemplos,
tests en `test/` y spec en `spec/001-core-and-presets/`. No hay logos, capturas
ni testimonios; no inventarlos.

## Product Principles

1. La demo ES la documentación: cada opción y su default se ven, no se describen.
2. Cero fricción para copiar: cada ejemplo se puede llevar tal cual al código.
3. Honestidad con el comportamiento real: la demo usa los defaults reales.
4. Accesible y respetuoso con `prefers-reduced-motion` por defecto.
5. Ligero y sin dependencias añadidas.

## Accessibility & Inclusion

Debe honrar `prefers-reduced-motion`. Contraste adecuado y controles navegables
por teclado.
