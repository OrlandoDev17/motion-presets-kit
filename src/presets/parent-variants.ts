import { stagger, type Variants } from "motion/react";
import {
	type ParentVariantsOptions,
	parentVariantsSchema,
} from "../schemas/parent-variants";
import { shouldReduceMotion } from "../utils/reduced-motion";
import { warn } from "../utils/warn";

/**
 * Variants para el contenedor padre: anima hijos en cascada con `stagger()`.
 * Los hijos deben usar `excludeDelay: true` para heredar el stagger (CL-001).
 */
export function parentVariants(options: ParentVariantsOptions = {}): Variants {
	const parsed = parentVariantsSchema.safeParse(options);
	if (!parsed.success) {
		warn(
			`Opciones inválidas en parentVariants(): ${parsed.error.message}. Se usarán los valores por defecto.`,
		);
	}
	const opts = parsed.success ? parsed.data : parentVariantsSchema.parse({});

	const { delayChildren, startDelay, reducedMotion } = opts;

	if (shouldReduceMotion(reducedMotion)) {
		return {
			initial: { opacity: 1 },
			animate: { opacity: 1 },
		};
	}

	return {
		initial: { opacity: 0 },
		animate: {
			opacity: 1,
			transition: {
				delayChildren: stagger(delayChildren, { startDelay }),
			},
		},
	};
}
