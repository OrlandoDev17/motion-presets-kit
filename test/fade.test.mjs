import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import { fade } from "../dist/presets.js";
import {
	captureWarnings,
	clearReducedMotion,
	setReducedMotion,
} from "./helpers/setup.mjs";

afterEach(() => clearReducedMotion());

describe("fade()", () => {
	test("defaults: initial {opacity: 0, y: 60} y transición duration 0.5", () => {
		const variants = fade();
		assert.deepEqual(variants.initial, { opacity: 0, y: 60 });
		assert.equal(variants.animate.opacity, 1);
		assert.equal(variants.animate.x, 0);
		assert.equal(variants.animate.y, 0);
		assert.deepEqual(variants.animate.transition, {
			duration: 0.5,
			ease: [0.16, 1, 0.3, 1],
			delay: 0,
		});
		assert.equal(variants.animate.willChange, "transform, opacity");
	});

	test("respeta cada dirección", () => {
		assert.deepEqual(fade({ direction: "up" }).initial, { opacity: 0, y: 60 });
		assert.deepEqual(fade({ direction: "down" }).initial, {
			opacity: 0,
			y: -60,
		});
		assert.deepEqual(fade({ direction: "left" }).initial, {
			opacity: 0,
			x: 60,
		});
		assert.deepEqual(fade({ direction: "right" }).initial, {
			opacity: 0,
			x: -60,
		});
		assert.deepEqual(fade({ direction: "none" }).initial, { opacity: 0 });
	});

	test("distance y scale personalizados", () => {
		const variants = fade({ direction: "up", distance: 10, scale: 1.2 });
		assert.deepEqual(variants.initial, { opacity: 0, y: 10, scale: 1.2 });
		assert.equal(variants.animate.scale, 1);
	});

	test("blur > 0 anima filter (RF-021)", () => {
		const variants = fade({ blur: 8 });
		assert.equal(variants.initial.filter, "blur(8px)");
		assert.equal(variants.animate.filter, "blur(0px)");
		assert.equal(variants.animate.willChange, "transform, opacity, filter");
	});

	test("sin blur no incluye filter (RF-021)", () => {
		const variants = fade();
		assert.equal("filter" in variants.initial, false);
		assert.equal("filter" in variants.animate, false);
	});

	test("spring sobrescribe duration y ease (CL-006)", () => {
		const variants = fade({
			spring: { stiffness: 120, damping: 14 },
			duration: 9,
			ease: "linear",
		});
		assert.equal(variants.animate.transition.type, "spring");
		assert.equal(variants.animate.transition.stiffness, 120);
		assert.equal(variants.animate.transition.damping, 14);
		assert.equal("duration" in variants.animate.transition, false);
		assert.equal("ease" in variants.animate.transition, false);
	});

	test("excludeDelay omite el delay propio", () => {
		const withDelay = fade({ delay: 0.4 });
		assert.equal(withDelay.animate.transition.delay, 0.4);

		const excluded = fade({ delay: 0.4, excludeDelay: true });
		assert.equal("delay" in excluded.animate.transition, false);
	});

	test("reducedMotion retorna estado final sin animación", () => {
		setReducedMotion(true);
		const variants = fade({ distance: 100, blur: 8, scale: 0.5 });
		assert.deepEqual(variants.initial, { opacity: 1, x: 0, y: 0 });
		assert.deepEqual(variants.animate, { opacity: 1, x: 0, y: 0 });
	});

	test("reducedMotion: false ignora prefers-reduced-motion", () => {
		setReducedMotion(true);
		const variants = fade({ reducedMotion: false });
		assert.deepEqual(variants.initial, { opacity: 0, y: 60 });
	});

	test("opciones inválidas: warn + valores por defecto (RF-112)", () => {
		const warnings = captureWarnings();
		try {
			const variants = fade({ duration: "no-numero", direction: "diagonal" });
			assert.deepEqual(variants.initial, { opacity: 0, y: 60 });
			assert.equal(warnings.messages.length, 1);
			assert.match(warnings.messages[0], /fade\(\)/);
		} finally {
			warnings.restore();
		}
	});

	test("es una función pura: no comparte referencias entre llamadas", () => {
		const first = fade();
		const second = fade();
		assert.notEqual(first.initial, second.initial);
		assert.deepEqual(first, second);
	});
});
