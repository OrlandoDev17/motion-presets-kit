export type RouteId = "presets" | "components" | "hooks";

export interface Route {
	id: RouteId;
	code: string;
	name: string;
	entry: string;
	tone: string;
	note: string;
}

export interface Station {
	id: string;
	name: string;
	route: RouteId;
	journey: string;
	kind: "preset" | "componente" | "hook";
}

export const ROUTES: Route[] = [
	{
		id: "presets",
		code: "P",
		name: "Línea P — Presets",
		entry: "motion-presets-kit/presets",
		tone: "var(--line-p)",
		note: "Funciones puras que retornan Variants de motion.",
	},
	{
		id: "components",
		code: "C",
		name: "Línea C — Componentes",
		entry: "motion-presets-kit/components",
		tone: "var(--line-c)",
		note: "Componentes React listos para usar.",
	},
	{
		id: "hooks",
		code: "H",
		name: "Línea H — Hooks",
		entry: "motion-presets-kit/components",
		tone: "var(--line-h)",
		note: "Hooks que escriben animación en el DOM.",
	},
];

export const STATIONS: Station[] = [
	{
		id: "fade",
		name: "fade",
		route: "presets",
		journey:
			"Aparición con dirección, blur y escala opcionales. El caballo de batalla para entradas.",
		kind: "preset",
	},
	{
		id: "slide",
		name: "slide",
		route: "presets",
		journey: "Desplazamiento puro, sin opacity: solo mueve el eje.",
		kind: "preset",
	},
	{
		id: "scale",
		name: "scale",
		route: "presets",
		journey: "Entrada con zoom: de from a 1 junto con opacity 0 → 1.",
		kind: "preset",
	},
	{
		id: "clipReveal",
		name: "clipReveal",
		route: "presets",
		journey: "Reveal cinematográfico animando clip-path, con escala opcional.",
		kind: "preset",
	},
	{
		id: "parentVariants",
		name: "parentVariants",
		route: "presets",
		journey: "Contenedor para cascada: reparte el stagger entre los hijos.",
		kind: "preset",
	},
	{
		id: "TextAnimate",
		name: "TextAnimate",
		route: "components",
		journey:
			"Anima texto por palabra o letra, preserva el HTML inline y resalta coincidencias.",
		kind: "componente",
	},
	{
		id: "Marquee",
		name: "Marquee",
		route: "components",
		journey: "Scroll infinito en CSS puro con loop sin costuras.",
		kind: "componente",
	},
	{
		id: "Draggable",
		name: "Draggable",
		route: "components",
		journey: "Wrapper de motion.div con ejes, límites, snap y callbacks.",
		kind: "componente",
	},
	{
		id: "useCounter",
		name: "useCounter",
		route: "hooks",
		journey: "Contador animado que escribe el valor formateado en su ref.",
		kind: "hook",
	},
];

export const SHARED_OPTIONS: Array<{
	name: string;
	type: string;
	value: string;
}> = [
	{ name: "duration", type: "number", value: "0.5" },
	{ name: "delay", type: "number", value: "0" },
	{ name: "ease", type: "Easing", value: "[0.16, 1, 0.3, 1]" },
	{ name: "spring", type: "SpringOptions", value: "—" },
	{ name: "excludeDelay", type: "boolean", value: "false" },
	{ name: "reducedMotion", type: "boolean", value: "true" },
];

export const ENTRY_POINTS: Array<{
	entry: string;
	tone: string;
	note: string;
}> = [
	{
		entry: "motion-presets-kit",
		tone: "var(--line-base)",
		note: "Todo: schemas + presets + componentes.",
	},
	{
		entry: "motion-presets-kit/presets",
		tone: "var(--line-p)",
		note: "fade, slide, scale, clipReveal, parentVariants.",
	},
	{
		entry: "motion-presets-kit/components",
		tone: "var(--line-c)",
		note: "TextAnimate, Marquee, Draggable, useCounter.",
	},
];

export function routeOf(id: RouteId): Route {
	const route = ROUTES.find((item) => item.id === id);
	if (!route) throw new Error(`Ruta desconocida: ${id}`);
	return route;
}

export function stationsOf(id: RouteId): Station[] {
	return STATIONS.filter((station) => station.route === id);
}
