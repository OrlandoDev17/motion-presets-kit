import { z } from "zod";
import { basePresetSchema } from "./base";

export const fadeOptionsSchema = basePresetSchema.extend({
	direction: z.enum(["up", "down", "left", "right", "none"]).default("up"),
	distance: z.number().default(60),
	blur: z.number().default(0),
	scale: z.number().default(1),
});

export type FadeOptions = z.input<typeof fadeOptionsSchema>;
export type ResolvedFadeOptions = z.output<typeof fadeOptionsSchema>;
