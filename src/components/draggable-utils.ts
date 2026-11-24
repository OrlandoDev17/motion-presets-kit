import type { RefObject } from "react";
import type { DragConstraints } from "../schemas/draggable";

/** `true` si los límites tienen `top > bottom` o `left > right` (CL-007). */
export function hasInvalidBounds(bounds: DragConstraints): boolean {
	if (
		bounds.top !== undefined &&
		bounds.bottom !== undefined &&
		bounds.top > bounds.bottom
	) {
		return true;
	}
	if (
		bounds.left !== undefined &&
		bounds.right !== undefined &&
		bounds.left > bounds.right
	) {
		return true;
	}
	return false;
}

export type ResolvedDragBounds = "parent" | "document" | DragConstraints | null;

/** Normaliza `bounds` a un valor usable por motion, descartando límites inválidos (CL-007). */
export function resolveDragConstraints(
	bounds: "parent" | "document" | DragConstraints | undefined,
): ResolvedDragBounds {
	if (bounds === undefined) return null;
	if (bounds === "parent" || bounds === "document") return bounds;
	return hasInvalidBounds(bounds) ? null : bounds;
}

/**
 * Traduce `bounds` al prop `dragConstraints` de motion.
 * `"parent"`/`"document"` no son strings válidos en motion: se resuelven a un
 * ref al elemento contenedor (`containerRef`) que motion mide al iniciar el drag.
 */
export function getDragConstraintsProp(
	resolved: ResolvedDragBounds,
	containerRef: RefObject<Element | null>,
): Partial<DragConstraints> | { current: Element | null } | undefined {
	if (resolved === "parent" || resolved === "document") return containerRef;
	return resolved ?? undefined;
}

/** Construye el `modifyTarget` de `dragTransition` que ajusta el destino a la grilla. */
export function buildSnapModifier(
	snapToGrid: [number, number] | undefined,
): ((value: number) => number) | undefined {
	if (!snapToGrid) return undefined;
	const [gridX, gridY] = snapToGrid;
	const grid = gridX === 0 ? gridY : gridY === 0 ? gridX : gridX;
	if (grid === 0) return undefined;
	return (value: number) => Math.round(value / grid) * grid;
}
