---
version: 1
slug: "playground"
primary_target: "playground"
related_targets: []
---

# Superficie — Playground (motion-presets-kit)

## Scope y modo

Escaparate y referencia viva para desarrolladores que evalúan motion-presets-kit.
Modo **Read** (comprensión y navegación) con carácter **Experience**: la propia demo
demuestra el motion. Audiencia: devs frontend que llegan desde README/npm/GitHub y
necesitan entender la API, ver los defaults reales, ajustar opciones y copiar el
snippet. Audiencia secundaria: agentes de IA.

## Direction contract

**THESIS:** El playground es el plano de sistema de la librería: rutas = categorías,
estaciones = cada preset/componente, transbordos = opciones compartidas. Refusa la
cuadrícula de tarjetas iguales con icono+título+texto del demo de librería.

**OWN-WORLD:** Lenguaje de diagrama de transporte público. Fondo tinta azul-noche
(#0d1b2a); rutas en colores planos saturados (amarillo señal, cian, coral, verde)
con casing hairline; estaciones como ticks y transbordos como anillos; leyenda tipo
panel de andén en papel calicó; tipografía de señalización (Overpass / Overpass Mono,
con fallback system). Esmaltado vectorial: sin gradientes ni glass.

**STORY:** El visitante ve el mapa completo → entiende las dos rutas (presets,
componentes) y sus estaciones → elige una estación → ajusta opciones y ve la demo →
copia el snippet → sabe qué importar.

**FIRST VIEWPORT:** Lienzo de plano a pantalla completa: la marca en un cartel de
estación, la ruta de presets y la de componentes cruzando el lienzo con sus estaciones
rotuladas, una leyenda de la API, y el "panel de salidas" de la primera estación con
demo en vivo y defaults visibles.

**FORM:** Plano de sistema (candidata 6 de 7, orden por resonancia); seed key
27da976c. Elevaciones nombradas: espina de tiempo (labanotation), ajuste seco con
sobrepaso (depot blind), banderín de parada persistente (cutting bench), paradas
enlazables (orizuru), scrub sincronizado (mesophotic), margen de notas honestas
(ice press).

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
