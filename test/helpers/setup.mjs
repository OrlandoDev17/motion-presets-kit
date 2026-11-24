/**
 * Utilidades compartidas por los tests.
 * Los presets leen `prefers-reduced-motion` desde `globalThis.window` en tiempo de
 * llamada, por lo que basta con inyectar un stub de `matchMedia` en los tests.
 */

export function setReducedMotion(value) {
	globalThis.window = {
		matchMedia: (query) => ({
			matches: Boolean(value) && String(query).includes("reduce"),
			media: String(query),
			addEventListener() {},
			removeEventListener() {},
		}),
	};
}

export function clearReducedMotion() {
	delete globalThis.window;
}

/** Captura `console.warn` para verificar avisos de validación. */
export function captureWarnings() {
	const original = console.warn;
	const messages = [];
	console.warn = (...args) => {
		messages.push(args.map(String).join(" "));
	};
	return {
		messages,
		restore() {
			console.warn = original;
		},
	};
}
