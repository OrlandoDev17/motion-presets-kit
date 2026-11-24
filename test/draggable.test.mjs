import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
	buildSnapModifier,
	getDragConstraintsProp,
	hasInvalidBounds,
	resolveDragConstraints,
} from "../dist/components.js";

describe("hasInvalidBounds() (CL-007)", () => {
	test("detecta top > bottom", () => {
		assert.equal(hasInvalidBounds({ top: 100, bottom: 0 }), true);
	});

	test("detecta left > right", () => {
		assert.equal(hasInvalidBounds({ left: 50, right: 10 }), true);
	});

	test("acepta límites válidos o parciales", () => {
		assert.equal(hasInvalidBounds({ top: 0, bottom: 100 }), false);
		assert.equal(hasInvalidBounds({ left: 0 }), false);
		assert.equal(hasInvalidBounds({}), false);
	});
});

describe("resolveDragConstraints() (CL-007)", () => {
	test("pasa los literales 'parent' y 'document'", () => {
		assert.equal(resolveDragConstraints("parent"), "parent");
		assert.equal(resolveDragConstraints("document"), "document");
	});

	test("undefined → null", () => {
		assert.equal(resolveDragConstraints(undefined), null);
	});

	test("objeto válido se conserva", () => {
		const bounds = { top: -50, left: -50, right: 50, bottom: 50 };
		assert.deepEqual(resolveDragConstraints(bounds), bounds);
	});

	test("bounds inválidos → null (se ignoran)", () => {
		assert.equal(resolveDragConstraints({ top: 100, bottom: 0 }), null);
		assert.equal(resolveDragConstraints({ left: 100, right: 0 }), null);
	});
});

describe("getDragConstraintsProp()", () => {
	const containerRef = { current: { nodeType: 1 } };

	test("'parent' y 'document' se resuelven al ref del contenedor", () => {
		assert.equal(getDragConstraintsProp("parent", containerRef), containerRef);
		assert.equal(
			getDragConstraintsProp("document", containerRef),
			containerRef,
		);
	});

	test("bounds objeto se pasan tal cual", () => {
		const bounds = { top: 0, left: 0, right: 100, bottom: 100 };
		assert.equal(getDragConstraintsProp(bounds, containerRef), bounds);
	});

	test("null se convierte en undefined (sin límites)", () => {
		assert.equal(getDragConstraintsProp(null, containerRef), undefined);
	});
});

describe("buildSnapModifier()", () => {
	test("undefined sin snapToGrid", () => {
		assert.equal(buildSnapModifier(undefined), undefined);
	});

	test("ajusta el destino al múltiplo de la grilla", () => {
		const modifier = buildSnapModifier([50, 50]);
		assert.equal(modifier?.(123), 100);
		assert.equal(modifier?.(126), 150);
	});

	test("grilla [0, 0] desactiva el snap", () => {
		assert.equal(buildSnapModifier([0, 0]), undefined);
	});
});
