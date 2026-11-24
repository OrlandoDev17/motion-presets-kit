import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { buildMarqueeKeyframes } from "../dist/components.js";

describe("buildMarqueeKeyframes()", () => {
	test("direction left mueve de 0 a -(100% + gap)", () => {
		const result = buildMarqueeKeyframes({
			id: "abc",
			direction: "left",
			gap: "2rem",
			speed: 20,
			pauseOnHover: false,
		});
		assert.equal(result.animationName, "motion-marquee-abc");
		assert.match(result.css, /@keyframes motion-marquee-abc\{from\{/);
		assert.match(
			result.css,
			/translateX\(0\)\}to\{transform:translateX\(calc\(-100% - 2rem\)\)\}/,
		);
	});

	test("direction right invierte el recorrido", () => {
		const result = buildMarqueeKeyframes({
			id: "x",
			direction: "right",
			gap: "1rem",
			speed: 10,
			pauseOnHover: false,
		});
		assert.match(
			result.css,
			/from\{transform:translateX\(calc\(-100% - 1rem\)\)\}/,
		);
		assert.match(result.css, /to\{transform:translateX\(0\)\}/);
	});

	test("usa la velocidad y el gap en el CSS", () => {
		const result = buildMarqueeKeyframes({
			id: "y",
			direction: "left",
			gap: "3rem",
			speed: 45,
			pauseOnHover: false,
		});
		assert.match(result.css, /animation:motion-marquee-y 45s linear infinite/);
		assert.match(result.css, /gap:3rem/);
	});

	test("pauseOnHover agrega la regla de pausa (CL-002)", () => {
		const withPause = buildMarqueeKeyframes({
			id: "z",
			direction: "left",
			gap: "2rem",
			speed: 20,
			pauseOnHover: true,
		});
		assert.match(
			withPause.css,
			/:hover .motion-marquee-list-z\{animation-play-state:paused\}/,
		);

		const withoutPause = buildMarqueeKeyframes({
			id: "z",
			direction: "left",
			gap: "2rem",
			speed: 20,
			pauseOnHover: false,
		});
		assert.equal(withoutPause.css.includes("animation-play-state"), false);
	});

	test("genera clases únicas por id", () => {
		const a = buildMarqueeKeyframes({
			id: "a",
			direction: "left",
			gap: "2rem",
			speed: 20,
			pauseOnHover: false,
		});
		const b = buildMarqueeKeyframes({
			id: "b",
			direction: "left",
			gap: "2rem",
			speed: 20,
			pauseOnHover: false,
		});
		assert.notEqual(a.listClassName, b.listClassName);
	});
});
