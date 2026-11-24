import { z } from "zod";

export const parentVariantsSchema = z.object({
	delayChildren: z.number().default(0),
	startDelay: z.number().default(0),
	reducedMotion: z.boolean().default(true),
});

export type ParentVariantsOptions = z.input<typeof parentVariantsSchema>;
export type ResolvedParentVariantsOptions = z.output<
	typeof parentVariantsSchema
>;
