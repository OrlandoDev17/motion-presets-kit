import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import { clipReveal } from "../dist/presets.js";
import {
	captureWarnings,
	clearReducedMotion,
	setReducedMotion,
} from "./helpers/setup.mjs";

const REVEALED = "inset(0% 0% 0% 0%)";

afterEach(() => clearReducedMotion());

describe("clipReveal()", () => {
	test("defaults: direction up revela desde abajo", () => {
		const variants = clipReveal({ direction: "up" });
		assert.equal(variants.initial.clipPath, "inset(100% 0% 0% 0%)");
		assert.equal(variants.animate.clipPath, REVEALED);
		assert.equal(variants.animate.willChange, "clip-path");
		assert.deepEqual(variants.animate.transition, {
			duration: 0.5,
			ease: [0.16, 1, 0.3, 1],
			delay: 0,
		});
	});

	test("insets por dirección", () => {
		assert.equal(
			clipReveal({ direction: "down" }).initial.clipPath,
			"inset(0% 0% 100% 0%)",
		);
		assert.equal(
			clipReveal({ direction: "left" }).initial.clipPath,
			"inset(0% 100% 0% 0%)",
		);
		assert.equal(
			clipReveal({ direction: "right" }).initial.clipPath,
			"inset(0% 0% 0% 100%)",
		);
	});

	test("scale opcional acompaña al clip", () => {
		const withScale = clipReveal({ direction: "up", scale: 1.2 });
		assert.equal(withScale.initial.scale, 1.2);
		assert.equal(withScale.animate.scale, 1);
		assert.equal(withScale.animate.willChange, "clip-path, transform");

		const withoutScale = clipReveal();
		assert.equal("scale" in withoutScale.initial, false);
		assert.equal("scale" in withoutScale.animate, false);
	});

	test("reducedMotion revela el clip sin animación", () => {
		setReducedMotion(true);
		const variants = clipReveal({ scale: 1.1 });
		assert.equal(variants.initial.clipPath, REVEALED);
		assert.equal(variants.initial.scale, 1);
		assert.equal(variants.animate.clipPath, REVEALED);
	});

	test("opciones inválidas: warn + valores por defecto (RF-112)", () => {
		const warnings = captureWarnings();
		try {
			const variants = clipReveal({ direction: "arriba" });
			assert.equal(variants.initial.clipPath, "inset(100% 0% 0% 0%)");
			assert.equal(warnings.messages.length, 1);
			assert.match(warnings.messages[0], /clipReveal\(\)/);
		} finally {
			warnings.restore();
		}
	});
});
