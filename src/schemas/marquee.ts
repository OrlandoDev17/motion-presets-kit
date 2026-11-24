import { z } from "zod";

export const marqueeOptionsSchema = z.object({
	speed: z.number().positive().default(20),
	direction: z.enum(["left", "right"]).default("left"),
	pauseOnHover: z.boolean().default(true),
	gap: z.string().default("2rem"),
	reducedMotion: z.boolean().default(true),
});

export type MarqueeOptions = z.input<typeof marqueeOptionsSchema>;
export type ResolvedMarqueeOptions = z.output<typeof marqueeOptionsSchema>;
