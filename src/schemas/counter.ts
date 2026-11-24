import { z } from "zod";

export const counterOptionsSchema = z.object({
	from: z.number().default(0),
	to: z.number().default(100),
	decimals: z.number().int().min(0).default(0),
	prefix: z.string().default(""),
	suffix: z.string().default(""),
	separator: z.string().default(","),
	format: z
		.custom<(value: number) => string>(
			(value): value is (value: number) => string =>
				typeof value === "function",
		)
		.optional(),
	duration: z.number().default(1),
	reducedMotion: z.boolean().default(true),
});

export type CounterOptions = z.input<typeof counterOptionsSchema>;
export type ResolvedCounterOptions = z.output<typeof counterOptionsSchema>;
