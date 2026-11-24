import { z } from "zod";

export const textAnimateOptionsSchema = z.object({
	by: z.enum(["word", "letter"]).default("word"),
	type: z
		.enum([
			"blurIn",
			"slideUp",
			"slideDown",
			"slideLeft",
			"slideRight",
			"typeWriter",
		])
		.default("slideUp"),
	duration: z.number().default(0.4),
	startDelay: z.number().default(0),
	highlight: z.array(z.string()).default([]),
	highlightClassName: z.string().default(""),
	reducedMotion: z.boolean().default(true),
});

export type TextAnimateOptions = z.input<typeof textAnimateOptionsSchema>;
export type ResolvedTextAnimateOptions = z.output<
	typeof textAnimateOptionsSchema
>;
