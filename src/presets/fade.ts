import type { TargetAndTransition, Variants } from "motion/react";
import { type FadeOptions, fadeOptionsSchema } from "../schemas/fade";
import { buildTransition } from "../utils/easing";
import { shouldReduceMotion } from "../utils/reduced-motion";
import { warn } from "../utils/warn";

const FADE_OFFSETS = {
	up: (distance: number) => ({ y: distance }),
	down: (distance: number) => ({ y: -distance }),
	left: (distance: number) => ({ x: distance }),
	right: (distance: number) => ({ x: -distance }),
	none: () => ({}),
} as const;

/**
 * Fade de entrada con dirección, blur y escala opcionales.
 * Función pura que retorna `Variants` para usar en `motion`/`motion/react`.
 */
export function fade(options: FadeOptions = {}): Variants {
	const parsed = fadeOptionsSchema.safeParse(options);
	if (!parsed.success) {
		warn(
			`Opciones inválidas en fade(): ${parsed.error.message}. Se usarán los valores por defecto.`,
		);
	}
	const opts = parsed.success ? parsed.data : fadeOptionsSchema.parse({});

	const {
		direction,
		distance,
		duration,
		delay,
		ease,
		spring,
		excludeDelay,
		blur,
		scale,
		reducedMotion,
	} = opts;

	if (shouldReduceMotion(reducedMotion)) {
		return {
			initial: { opacity: 1, x: 0, y: 0 },
			animate: { opacity: 1, x: 0, y: 0 },
		};
	}

	const transition = buildTransition({
		duration,
		delay,
		ease,
		spring,
		excludeDelay,
	});
	const hasBlur = blur > 0;

	const initial: TargetAndTransition = {
		opacity: 0,
		...FADE_OFFSETS[direction](distance),
	};
	if (scale !== 1) initial.scale = scale;
	if (hasBlur) initial.filter = `blur(${blur}px)`;

	const animate: TargetAndTransition = {
		opacity: 1,
		x: 0,
		y: 0,
		willChange: hasBlur ? "transform, opacity, filter" : "transform, opacity",
		transition,
	};
	if (scale !== 1) animate.scale = 1;
	if (hasBlur) animate.filter = "blur(0px)";

	return { initial, animate };
}
