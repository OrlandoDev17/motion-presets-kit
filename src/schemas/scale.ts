import { z } from "zod";
import { basePresetSchema } from "./base";

export const scaleOptionsSchema = basePresetSchema.extend({
	from: z.number().default(0.8),
});

export type ScaleOptions = z.input<typeof scaleOptionsSchema>;
export type ResolvedScaleOptions = z.output<typeof scaleOptionsSchema>;
