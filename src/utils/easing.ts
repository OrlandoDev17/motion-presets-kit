import type { Easing, SpringOptions, Transition } from "motion/react";

/** Curva de easing por defecto de todos los presets. */
export const DEFAULT_EASE: Easing = [0.16, 1, 0.3, 1];

export interface BuildTransitionOptions {
	duration: number;
	delay: number;
	ease: Easing;
	spring?: Omit<SpringOptions, "keyframes">;
	excludeDelay: boolean;
}

/**
 * Construye la transición compartida por los presets.
 * - Si `spring` está definido, sobrescribe `duration` y `ease`.
 * - Si `excludeDelay` es `true`, omite `delay` (compatibilidad con stagger del padre).
 */
export function buildTransition(options: BuildTransitionOptions): Transition {
	const { duration, delay, ease, spring, excludeDelay } = options;

	const base: Transition = spring
		? { type: "spring", ...spring }
		: { duration, ease };

	return excludeDelay ? base : { ...base, delay };
}
