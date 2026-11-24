import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import { slide } from "../dist/presets.js";
import {
	captureWarnings,
	clearReducedMotion,
	setReducedMotion,
} from "./helpers/setup.mjs";

afterEach(() => clearReducedMotion());

describe("slide()", () => {
	test("defaults: direction right con distance 100 y sin opacity (RF-034)", () => {
		const variants = slide();
		assert.deepEqual(variants.initial, { x: -100 });
		assert.deepEqual(variants.animate, {
			x: 0,
			willChange: "transform",
			transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0 },
		});
	});

	test("no incluye opacity en ningún variant (RF-034)", () => {
		const variants = slide();
		assert.equal("opacity" in variants.initial, false);
		assert.equal("opacity" in variants.animate, false);
	});

	test("respeta cada dirección", () => {
		assert.deepEqual(slide({ direction: "right" }).initial, { x: -100 });
		assert.deepEqual(slide({ direction: "left" }).initial, { x: 100 });
		assert.deepEqual(slide({ direction: "up" }).initial, { y: 100 });
		assert.deepEqual(slide({ direction: "down" }).initial, { y: -100 });
		assert.deepEqual(slide({ direction: "up" }).animate.y, 0);
	});

	test("distance personalizada", () => {
		assert.deepEqual(slide({ direction: "up", distance: 30 }).initial, {
			y: 30,
		});
	});

	test("spring y excludeDelay se propagan", () => {
		const variants = slide({ spring: { stiffness: 200 }, delay: 1 });
		assert.equal(variants.animate.transition.type, "spring");
		assert.equal(variants.animate.transition.stiffness, 200);
		assert.equal(variants.animate.transition.delay, 1);

		const excluded = slide({ delay: 1, excludeDelay: true });
		assert.equal("delay" in excluded.animate.transition, false);
	});

	test("reducedMotion retorna posición final", () => {
		setReducedMotion(true);
		const variants = slide({ distance: 200 });
		assert.deepEqual(variants.initial, { x: 0, y: 0 });
		assert.deepEqual(variants.animate, { x: 0, y: 0 });
	});

	test("opciones inválidas: warn + valores por defecto (RF-112)", () => {
		const warnings = captureWarnings();
		try {
			const variants = slide({ distance: null });
			assert.deepEqual(variants.initial, { x: -100 });
			assert.equal(warnings.messages.length, 1);
			assert.match(warnings.messages[0], /slide\(\)/);
		} finally {
			warnings.restore();
		}
	});
});
