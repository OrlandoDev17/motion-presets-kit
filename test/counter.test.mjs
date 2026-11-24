import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { formatCounterValue } from "../dist/components.js";

describe("formatCounterValue()", () => {
	test("defaults: número entero sin separador de miles adicional", () => {
		assert.equal(formatCounterValue(0), "0");
		assert.equal(formatCounterValue(100), "100");
	});

	test("aplica separador de miles", () => {
		assert.equal(formatCounterValue(1250, { separator: "," }), "1,250");
		assert.equal(formatCounterValue(1234567, { separator: "," }), "1,234,567");
	});

	test("respeta decimales", () => {
		assert.equal(formatCounterValue(1250.5, { decimals: 2 }), "1,250.50");
		assert.equal(formatCounterValue(Math.PI, { decimals: 2 }), "3.14");
	});

	test("prefijo y sufijo", () => {
		assert.equal(
			formatCounterValue(1250, { prefix: "$", suffix: " USD" }),
			"$1,250 USD",
		);
	});

	test("CL-005: negativos con signo", () => {
		assert.equal(formatCounterValue(-1250, { separator: "," }), "-1,250");
		assert.equal(
			formatCounterValue(-1250.5, { decimals: 1, prefix: "$" }),
			"$-1,250.5",
		);
	});

	test("format custom sobrescribe el formateo", () => {
		assert.equal(
			formatCounterValue(1250, {
				format: (value) => `${(value / 1000).toFixed(1)}k`,
			}),
			"1.3k",
		);
	});

	test("separator 'none' desactiva el agrupado", () => {
		assert.equal(formatCounterValue(1234567, { separator: "none" }), "1234567");
	});
});
