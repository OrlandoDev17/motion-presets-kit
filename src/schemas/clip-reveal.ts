import { z } from "zod";
import { basePresetSchema } from "./base";

export const clipRevealOptionsSchema = basePresetSchema.extend({
	direction: z.enum(["up", "down", "left", "right"]).default("up"),
	scale: z.number().optional(),
});

export type ClipRevealOptions = z.input<typeof clipRevealOptionsSchema>;
export type ResolvedClipRevealOptions = z.output<
	typeof clipRevealOptionsSchema
>;
