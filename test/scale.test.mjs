import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import { scale } from "../dist/presets.js";
import {
	captureWarnings,
	clearReducedMotion,
	setReducedMotion,
} from "./helpers/setup.mjs";

afterEach(() => clearReducedMotion());

describe("scale()", () => {
	test("defaults: from 0.8 con opacity 0 → 1", () => {
		const variants = scale();
		assert.deepEqual(variants.initial, { opacity: 0, scale: 0.8 });
		assert.deepEqual(variants.animate, {
			opacity: 1,
			scale: 1,
			willChange: "transform, opacity",
			transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0 },
		});
	});

	test("from personalizado", () => {
		const variants = scale({ from: 0.5 });
		assert.deepEqual(variants.initial, { opacity: 0, scale: 0.5 });
		assert.equal(variants.animate.scale, 1);
	});

	test("spring sobrescribe duration y ease (CL-006)", () => {
		const variants = scale({ spring: { stiffness: 90 } });
		assert.equal(variants.animate.transition.type, "spring");
		assert.equal(variants.animate.transition.stiffness, 90);
	});

	test("excludeDelay omite el delay", () => {
		const variants = scale({ delay: 0.3, excludeDelay: true });
		assert.equal("delay" in variants.animate.transition, false);
	});

	test("reducedMotion retorna estado final", () => {
		setReducedMotion(true);
		const variants = scale({ from: 0.2 });
		assert.deepEqual(variants.initial, { opacity: 1, scale: 1 });
		assert.deepEqual(variants.animate, { opacity: 1, scale: 1 });
	});

	test("opciones inválidas: warn + valores por defecto (RF-112)", () => {
		const warnings = captureWarnings();
		try {
			const variants = scale({ from: "grande" });
			assert.deepEqual(variants.initial, { opacity: 0, scale: 0.8 });
			assert.equal(warnings.messages.length, 1);
			assert.match(warnings.messages[0], /scale\(\)/);
		} finally {
			warnings.restore();
		}
	});
});
