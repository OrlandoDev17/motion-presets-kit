import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import { fade, parentVariants } from "../dist/presets.js";
import {
	captureWarnings,
	clearReducedMotion,
	setReducedMotion,
} from "./helpers/setup.mjs";

afterEach(() => clearReducedMotion());

describe("parentVariants()", () => {
	test("defaults: opacity 0 → 1 con delayChildren como stagger", () => {
		const variants = parentVariants();
		assert.deepEqual(variants.initial, { opacity: 0 });
		assert.equal(variants.animate.opacity, 1);
		assert.equal(typeof variants.animate.transition.delayChildren, "function");
	});

	test("delayChildren y startDelay se calculan con stagger()", () => {
		const variants = parentVariants({ delayChildren: 0.1, startDelay: 0.2 });
		const stagger = variants.animate.transition.delayChildren;
		assert.equal(stagger(0, 3), 0.2);
		assert.ok(Math.abs(stagger(1, 3) - 0.3) < 1e-9);
		assert.ok(Math.abs(stagger(2, 3) - 0.4) < 1e-9);
	});

	test("stagger por defecto inicia en 0", () => {
		const variants = parentVariants();
		assert.equal(variants.animate.transition.delayChildren(0, 2), 0);
	});

	test("CL-001: hijos con excludeDelay heredan el stagger del padre", () => {
		const parent = parentVariants({ delayChildren: 0.1 });
		const childWithDelay = fade();
		const childExcluded = fade({ excludeDelay: true });

		assert.equal("delay" in childWithDelay.animate.transition, true);
		assert.equal("delay" in childExcluded.animate.transition, false);
		assert.equal(typeof parent.animate.transition.delayChildren, "function");
	});

	test("reducedMotion omite el stagger", () => {
		setReducedMotion(true);
		const variants = parentVariants({ delayChildren: 0.1 });
		assert.deepEqual(variants.initial, { opacity: 1 });
		assert.deepEqual(variants.animate, { opacity: 1 });
	});

	test("opciones inválidas: warn + valores por defecto (RF-112)", () => {
		const warnings = captureWarnings();
		try {
			const variants = parentVariants({ delayChildren: "mucho" });
			assert.equal(
				typeof variants.animate.transition.delayChildren,
				"function",
			);
			assert.equal(warnings.messages.length, 1);
			assert.match(warnings.messages[0], /parentVariants\(\)/);
		} finally {
			warnings.restore();
		}
	});
});
