import { animate, useMotionValue, useMotionValueEvent } from "motion/react";
import {
	type RefObject,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	type CounterOptions,
	counterOptionsSchema,
} from "../../schemas/counter";
import { shouldReduceMotion } from "../../utils/reduced-motion";
import { warn } from "../../utils/warn";
import { formatCounterValue } from "../counter-utils";

export interface UseCounterResult {
	value: number;
	start: () => void;
	reset: () => void;
}

/**
 * Contador animado que escribe el valor formateado en `ref.current.textContent`
 * y expone el valor actual de forma reactiva.
 * Con `reducedMotion` activo muestra el valor final directamente (RF-095).
 */
export function useCounter(
	ref: RefObject<HTMLElement | null>,
	options: CounterOptions = {},
): UseCounterResult {
	const parsed = counterOptionsSchema.safeParse(options);
	if (!parsed.success) {
		warn(`Opciones inválidas en useCounter: ${parsed.error.message}`);
	}
	const config = parsed.success ? parsed.data : counterOptionsSchema.parse({});
	const { from, to, duration, reducedMotion } = config;

	const formatOptions = useMemo(
		() => ({
			decimals: config.decimals,
			prefix: config.prefix,
			suffix: config.suffix,
			separator: config.separator,
			format: config.format,
		}),
		[
			config.decimals,
			config.prefix,
			config.suffix,
			config.separator,
			config.format,
		],
	);

	const motionValue = useMotionValue(from);
	const [value, setValue] = useState(from);

	const writeValue = useCallback(
		(next: number) => {
			const element = ref.current;
			if (element) {
				element.textContent = formatCounterValue(next, formatOptions);
			}
		},
		[ref, formatOptions],
	);

	useMotionValueEvent(motionValue, "change", (latest) => {
		setValue(latest);
		writeValue(latest);
	});

	useEffect(() => {
		if (shouldReduceMotion(reducedMotion)) {
			motionValue.set(to);
			setValue(to);
			writeValue(to);
		}
	}, [motionValue, to, reducedMotion, writeValue]);

	const start = useCallback(() => {
		if (shouldReduceMotion(reducedMotion)) {
			motionValue.set(to);
			setValue(to);
			writeValue(to);
			return;
		}
		motionValue.set(from);
		setValue(from);
		animate(motionValue, to, {
			duration,
			ease: [0.16, 1, 0.3, 1],
		});
	}, [motionValue, from, to, duration, reducedMotion, writeValue]);

	const reset = useCallback(() => {
		motionValue.set(from);
		setValue(from);
		writeValue(from);
	}, [motionValue, from, writeValue]);

	return { value, start, reset };
}
