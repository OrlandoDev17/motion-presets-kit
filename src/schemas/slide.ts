import { z } from "zod";
import { basePresetSchema } from "./base";

export const slideOptionsSchema = basePresetSchema.extend({
	direction: z.enum(["up", "down", "left", "right"]).default("right"),
	distance: z.number().default(100),
});

export type SlideOptions = z.input<typeof slideOptionsSchema>;
export type ResolvedSlideOptions = z.output<typeof slideOptionsSchema>;
