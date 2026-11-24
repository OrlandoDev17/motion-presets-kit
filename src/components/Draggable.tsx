import { motion, type PanInfo } from "motion/react";
import { type ReactElement, type ReactNode, useEffect, useRef } from "react";
import {
	type DragConstraints,
	draggableOptionsSchema,
} from "../schemas/draggable";
import { warn } from "../utils/warn";
import {
	buildSnapModifier,
	getDragConstraintsProp,
	hasInvalidBounds,
	resolveDragConstraints,
} from "./draggable-utils";

export interface DraggableProps {
	children?: ReactNode;
	axis?: "x" | "y" | "both";
	bounds?: "parent" | "document" | DragConstraints;
	snapToGrid?: [number, number];
	dragElastic?: number | boolean;
	dragMomentum?: boolean;
	dragControls?: unknown;
	onDragStart?: (event: unknown, info: PanInfo) => void;
	onDrag?: (event: unknown, info: PanInfo) => void;
	onDragEnd?: (event: unknown, info: PanInfo) => void;
	className?: string;
}

/**
 * Wrapper de `motion.div` con drag configurable por eje, límites, snap y callbacks.
 * `bounds` inválidos se descartan con un `warn()` (CL-007).
 */
export function Draggable({
	children,
	axis = "both",
	bounds,
	snapToGrid,
	dragElastic,
	dragMomentum,
	dragControls,
	onDragStart,
	onDrag,
	onDragEnd,
	className,
}: DraggableProps): ReactElement {
	const parsed = draggableOptionsSchema.safeParse({
		axis,
		bounds,
		snapToGrid,
		dragElastic,
		dragMomentum,
	});
	if (!parsed.success) {
		warn(`Opciones inválidas en Draggable: ${parsed.error.message}`);
	}

	const data = parsed.success ? parsed.data : draggableOptionsSchema.parse({});

	if (
		typeof data.bounds === "object" &&
		data.bounds !== null &&
		hasInvalidBounds(data.bounds)
	) {
		warn(
			"bounds inválidos en Draggable (top > bottom o left > right). Se ignoran los límites (CL-007).",
		);
	}

	const resolved = resolveDragConstraints(data.bounds);
	const containerMode =
		resolved === "parent" || resolved === "document" ? resolved : null;

	const elementRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<Element | null>(null);

	useEffect(() => {
		const element = elementRef.current;
		if (!element || containerMode === null) return;
		containerRef.current =
			containerMode === "parent"
				? element.parentElement
				: (element.ownerDocument?.documentElement ?? null);
	}, [containerMode]);

	const drag = data.axis === "both" ? true : (data.axis as "x" | "y");
	const dragConstraints = getDragConstraintsProp(resolved, containerRef);
	const modifyTarget = buildSnapModifier(data.snapToGrid);

	return (
		<motion.div
			ref={elementRef}
			drag={drag}
			dragConstraints={dragConstraints}
			dragElastic={data.dragElastic}
			dragMomentum={data.dragMomentum}
			dragTransition={modifyTarget ? { modifyTarget } : undefined}
			dragControls={dragControls as never}
			onDragStart={onDragStart}
			onDrag={onDrag}
			onDragEnd={onDragEnd}
			className={className}
		>
			{children}
		</motion.div>
	);
}
