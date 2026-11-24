import type { CounterOptions } from "../schemas/counter";

/** Formatea un número con decimales, separador de miles, prefijo/sufijo y `format` custom (CL-005). */
export function formatCounterValue(
	value: number,
	options: CounterOptions = {},
): string {
	const {
		decimals = 0,
		prefix = "",
		suffix = "",
		separator = ",",
		format,
	} = options;

	if (format) return `${prefix}${format(value)}${suffix}`;

	const fixed = Math.abs(value).toFixed(decimals);
	const [integer = "", fraction] = fixed.split(".");
	const requestGrouped = separator !== "" && separator !== "none";
	const grouped = requestGrouped
		? integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
		: integer;
	const sign = value < 0 ? "-" : "";
	const decimalPart = fraction ? `.${fraction}` : "";

	return `${prefix}${sign}${grouped}${decimalPart}${suffix}`;
}
