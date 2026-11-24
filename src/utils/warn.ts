const PREFIX = "[motion-presets-kit]";

function isProduction(): boolean {
	return (
		typeof process !== "undefined" &&
		!!process.env &&
		process.env.NODE_ENV === "production"
	);
}

/** Aviso de desarrollo con prefijo de la librería (se silencia en producción). */
export function warn(message: string): void {
	if (isProduction()) return;
	if (typeof console !== "undefined" && typeof console.warn === "function") {
		console.warn(`${PREFIX} ${message}`);
	}
}
