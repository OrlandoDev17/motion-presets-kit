import { z } from "zod";

export const dragConstraintsSchema = z.object({
	top: z.number().optional(),
	right: z.number().optional(),
	bottom: z.number().optional(),
	left: z.number().optional(),
});

export const draggableOptionsSchema = z.object({
	axis: z.enum(["x", "y", "both"]).default("both"),
	bounds: z
		.union([z.literal("parent"), z.literal("document"), dragConstraintsSchema])
		.optional(),
	snapToGrid: z.tuple([z.number(), z.number()]).optional(),
	dragElastic: z.union([z.number(), z.boolean()]).optional(),
	dragMomentum: z.boolean().optional(),
});

export type DraggableOptions = z.input<typeof draggableOptionsSchema>;
export type ResolvedDraggableOptions = z.output<typeof draggableOptionsSchema>;
export type DragConstraints = z.infer<typeof dragConstraintsSchema>;
