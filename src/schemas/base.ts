import type { Easing, SpringOptions } from "motion/react";
import { z } from "zod";
import { DEFAULT_EASE } from "../utils/easing";

const EASING_NAMES = new Set([
	"linear",
	"easeIn",
	"easeOut",
	"easeInOut",
	"circIn",
	"circOut",
	"circInOut",
	"backIn",
	"backOut",
	"backInOut",
	"anticipate",
]);

/** Valida un `Easing` de motion: nombre, bezier de 4 números o función. */
function isEasing(value: unknown): value is Easing {
	if (typeof value === "function") return true;
	if (typeof value === "string") return EASING_NAMES.has(value);
	return (
		Array.isArray(value) &&
		value.length === 4 &&
		value.every((item) => typeof item === "number")
	);
}

/** Valida un objeto de opciones de spring (sin `keyframes`). */
function isSpringOptions(
	value: unknown,
): value is Omit<SpringOptions, "keyframes"> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Opciones compartidas por todos los presets que retornan variants. */
export const basePresetSchema = z.object({
	duration: z.number().default(0.5),
	delay: z.number().default(0),
	ease: z.custom<Easing>(isEasing).default(DEFAULT_EASE),
	spring: z
		.custom<Omit<SpringOptions, "keyframes">>(isSpringOptions)
		.optional(),
	excludeDelay: z.boolean().default(false),
	reducedMotion: z.boolean().default(true),
});

export type BasePresetOptions = z.input<typeof basePresetSchema>;
export type ResolvedBasePresetOptions = z.output<typeof basePresetSchema>;
