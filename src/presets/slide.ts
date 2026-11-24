import type { TargetAndTransition, Variants } from "motion/react";
import { type SlideOptions, slideOptionsSchema } from "../schemas/slide";
import { buildTransition } from "../utils/easing";
import { shouldReduceMotion } from "../utils/reduced-motion";
import { warn } from "../utils/warn";

const SLIDE_AXIS = {
	up: "y",
	down: "y",
	left: "x",
	right: "x",
} as const;

const SLIDE_SIGN = {
	up: 1,
	down: -1,
	left: 1,
	right: -1,
} as const;

/**
 * Desplazamiento puro (sin `opacity`) desde una dirección.
 * Función pura que retorna `Variants`.
 */
export function slide(options: SlideOptions = {}): Variants {
	const parsed = slideOptionsSchema.safeParse(options);
	if (!parsed.success) {
		warn(
			`Opciones inválidas en slide(): ${parsed.error.message}. Se usarán los valores por defecto.`,
		);
	}
	const opts = parsed.success ? parsed.data : slideOptionsSchema.parse({});

	const {
		direction,
		distance,
		duration,
		delay,
		ease,
		spring,
		excludeDelay,
		reducedMotion,
	} = opts;

	if (shouldReduceMotion(reducedMotion)) {
		return {
			initial: { x: 0, y: 0 },
			animate: { x: 0, y: 0 },
		};
	}

	const transition = buildTransition({
		duration,
		delay,
		ease,
		spring,
		excludeDelay,
	});
	const offset = SLIDE_SIGN[direction] * distance;

	if (SLIDE_AXIS[direction] === "x") {
		return {
			initial: { x: offset } satisfies TargetAndTransition,
			animate: {
				x: 0,
				willChange: "transform",
				transition,
			} satisfies TargetAndTransition,
		};
	}

	return {
		initial: { y: offset } satisfies TargetAndTransition,
		animate: {
			y: 0,
			willChange: "transform",
			transition,
		} satisfies TargetAndTransition,
	};
}
