/**
 * `true` cuando el usuario prefiere movimiento reducido y la opción está activa.
 * Devuelve `false` en entornos sin `window.matchMedia` (SSR, Node).
 */
export function shouldReduceMotion(reducedMotion = true): boolean {
	if (!reducedMotion) return false;
	if (
		typeof window === "undefined" ||
		typeof window.matchMedia !== "function"
	) {
		return false;
	}
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
