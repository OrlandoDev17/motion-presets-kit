import type { Variants } from "motion/react";
import { type ScaleOptions, scaleOptionsSchema } from "../schemas/scale";
import { buildTransition } from "../utils/easing";
import { shouldReduceMotion } from "../utils/reduced-motion";
import { warn } from "../utils/warn";

/**
 * Entrada con escala (`from` → `1`) junto con `opacity: 0 → 1`.
 * Función pura que retorna `Variants`.
 */
export function scale(options: ScaleOptions = {}): Variants {
	const parsed = scaleOptionsSchema.safeParse(options);
	if (!parsed.success) {
		warn(
			`Opciones inválidas en scale(): ${parsed.error.message}. Se usarán los valores por defecto.`,
		);
	}
	const opts = parsed.success ? parsed.data : scaleOptionsSchema.parse({});

	const { from, duration, delay, ease, spring, excludeDelay, reducedMotion } =
		opts;

	if (shouldReduceMotion(reducedMotion)) {
		return {
			initial: { opacity: 1, scale: 1 },
			animate: { opacity: 1, scale: 1 },
		};
	}

	const transition = buildTransition({
		duration,
		delay,
		ease,
		spring,
		excludeDelay,
	});

	return {
		initial: { opacity: 0, scale: from },
		animate: {
			opacity: 1,
			scale: 1,
			willChange: "transform, opacity",
			transition,
		},
	};
}
