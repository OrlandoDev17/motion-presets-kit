import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
	getAnimationParams,
	getHighlightRanges,
	isWordHighlighted,
	splitText,
} from "../dist/components.js";

describe("splitText()", () => {
	test("divide por palabras", () => {
		assert.deepEqual(splitText("Hello World", "word"), ["Hello", "World"]);
	});

	test("divide por letras", () => {
		assert.deepEqual(splitText("Hi", "letter"), ["H", "i"]);
	});

	test("colapsa espacios múltiples entre palabras", () => {
		assert.deepEqual(splitText("Hello   World", "word"), ["Hello", "World"]);
	});

	test("CL-004: preserva HTML pegado a la palabra", () => {
		assert.deepEqual(splitText("<strong>Hello</strong> World", "word"), [
			"<strong>Hello</strong>",
			"World",
		]);
	});

	test("CL-004: preserva HTML al dividir por letras", () => {
		assert.deepEqual(splitText("<b>Hi</b>", "letter"), ["<b>H", "i</b>"]);
	});
});

describe("getHighlightRanges() (CL-004)", () => {
	test("encuentra coincidencias case-insensitive", () => {
		const ranges = getHighlightRanges("Hello World", ["world"]);
		assert.deepEqual(ranges, [[6, 11]]);
	});

	test("ignora las etiquetas al calcular índices", () => {
		const ranges = getHighlightRanges("<b>Hello</b> World", ["World"]);
		assert.deepEqual(ranges, [[6, 11]]);
	});

	test("soporta múltiples coincidencias y términos", () => {
		const ranges = getHighlightRanges("abc abc", ["abc", "bc"]);
		assert.deepEqual(ranges, [
			[0, 3],
			[4, 7],
			[1, 3],
			[5, 7],
		]);
	});

	test("sin highlight retorna lista vacía", () => {
		assert.deepEqual(getHighlightRanges("Hello", []), []);
	});
});

describe("isWordHighlighted()", () => {
	test("detecta el término dentro de la palabra (case-insensitive)", () => {
		assert.equal(isWordHighlighted("<b>Hello</b>", ["hello"]), true);
		assert.equal(isWordHighlighted("World", ["hello"]), false);
	});
});

describe("getAnimationParams()", () => {
	test("mapea cada tipo a parámetros de fade()", () => {
		assert.deepEqual(getAnimationParams("blurIn"), {
			direction: "none",
			distance: 0,
			blur: 8,
		});
		assert.deepEqual(getAnimationParams("slideUp"), {
			direction: "up",
			distance: 20,
			blur: 4,
		});
		assert.deepEqual(getAnimationParams("slideDown").direction, "down");
		assert.deepEqual(getAnimationParams("slideLeft").direction, "left");
		assert.deepEqual(getAnimationParams("slideRight").direction, "right");
		assert.deepEqual(getAnimationParams("typeWriter"), {
			direction: "none",
			distance: 0,
			blur: 0,
		});
	});
});
