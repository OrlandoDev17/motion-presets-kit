import type { TargetAndTransition, Variants } from "motion/react";
import {
	type ClipRevealOptions,
	clipRevealOptionsSchema,
} from "../schemas/clip-reveal";
import { buildTransition } from "../utils/easing";
import { shouldReduceMotion } from "../utils/reduced-motion";
import { warn } from "../utils/warn";

const REVEALED_CLIP = "inset(0% 0% 0% 0%)";

const CLIP_INSETS = {
	up: "inset(100% 0% 0% 0%)",
	down: "inset(0% 0% 100% 0%)",
	left: "inset(0% 100% 0% 0%)",
	right: "inset(0% 0% 0% 100%)",
} as const;

/**
 * Reveal cinematográfico animando `clipPath` (con escala opcional).
 * Función pura que retorna `Variants`.
 */
export function clipReveal(options: ClipRevealOptions = {}): Variants {
	const parsed = clipRevealOptionsSchema.safeParse(options);
	if (!parsed.success) {
		warn(
			`Opciones inválidas en clipReveal(): ${parsed.error.message}. Se usarán los valores por defecto.`,
		);
	}
	const opts = parsed.success ? parsed.data : clipRevealOptionsSchema.parse({});

	const {
		direction,
		scale,
		duration,
		delay,
		ease,
		spring,
		excludeDelay,
		reducedMotion,
	} = opts;
	const hasScale = scale !== undefined;

	if (shouldReduceMotion(reducedMotion)) {
		const final: TargetAndTransition = { clipPath: REVEALED_CLIP };
		if (hasScale) final.scale = 1;
		return { initial: final, animate: final };
	}

	const transition = buildTransition({
		duration,
		delay,
		ease,
		spring,
		excludeDelay,
	});

	const initial: TargetAndTransition = { clipPath: CLIP_INSETS[direction] };
	if (hasScale) initial.scale = scale;

	const animate: TargetAndTransition = {
		clipPath: REVEALED_CLIP,
		willChange: hasScale ? "clip-path, transform" : "clip-path",
		transition,
	};
	if (hasScale) animate.scale = 1;

	return { initial, animate };
}
