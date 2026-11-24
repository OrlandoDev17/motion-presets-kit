import { type HTMLMotionProps, motion } from "motion/react";
import type * as React from "react";
import { type ElementType, type ReactElement, useMemo } from "react";
import { fade } from "../presets/fade";
import { parentVariants } from "../presets/parent-variants";
import {
	type ResolvedTextAnimateOptions,
	textAnimateOptionsSchema,
} from "../schemas/text-animate";
import { warn } from "../utils/warn";
import {
	getAnimationParams,
	getHighlightRanges,
	isWordHighlighted,
	splitText,
	type TextAnimateBy,
	type TextAnimateType,
} from "./text-animate-utils";

type IntrinsicTag = keyof React.JSX.IntrinsicElements;

const componentCache = new Map<string, ElementType>();

function getMotionComponent(tag: IntrinsicTag): ElementType {
	const key = String(tag);
	let component = componentCache.get(key);
	if (!component) {
		component = motion.create(tag) as ElementType;
		componentCache.set(key, component);
	}
	return component;
}

const SPAN_STYLE = { display: "inline-block", whiteSpace: "pre-wrap" } as const;
const WORD_STYLE = { ...SPAN_STYLE, marginRight: "0.25em" } as const;

export interface TextAnimateProps extends HTMLMotionProps<"p"> {
	text: string;
	as?: IntrinsicTag;
	by?: TextAnimateBy;
	type?: TextAnimateType;
	duration?: number;
	startDelay?: number;
	highlight?: string[];
	highlightClassName?: string;
	reducedMotion?: boolean;
}

/**
 * Anima texto dividiéndolo en palabras o letras. Preserva el HTML inline (CL-004),
 * resalta coincidencias (case-insensitive) y anima al entrar en viewport.
 *
 * ADVERTENCIA: el HTML inline se inyecta con `dangerouslySetInnerHTML`. No pases
 * como `text` contenido no confiable sin sanitizarlo antes (riesgo de XSS).
 */
export function TextAnimate({
	text,
	as = "p",
	by = "word",
	type = "slideUp",
	duration = 0.4,
	startDelay = 0,
	highlight = [],
	highlightClassName = "",
	reducedMotion = true,
	...props
}: TextAnimateProps): ReactElement {
	const parsed = textAnimateOptionsSchema.safeParse({
		by,
		type,
		duration,
		startDelay,
		highlight,
		highlightClassName,
		reducedMotion,
	});
	if (!parsed.success) {
		warn(`Opciones inválidas en TextAnimate: ${parsed.error.message}`);
	}
	const config: ResolvedTextAnimateOptions = parsed.success
		? parsed.data
		: textAnimateOptionsSchema.parse({});

	const MotionWrapper = useMemo(() => getMotionComponent(as), [as]);
	const units = useMemo(() => splitText(text, config.by), [text, config.by]);
	const ranges = useMemo(
		() =>
			config.by === "letter" ? getHighlightRanges(text, config.highlight) : [],
		[text, config.by, config.highlight],
	);
	const animationParams = useMemo(
		() => getAnimationParams(config.type),
		[config.type],
	);

	const parent = useMemo(
		() =>
			parentVariants({
				delayChildren:
					config.type === "typeWriter" && config.by === "letter" ? 0.05 : 0.08,
				startDelay: config.startDelay,
				reducedMotion: config.reducedMotion,
			}),
		[config.type, config.by, config.startDelay, config.reducedMotion],
	);

	const child = useMemo(
		() =>
			fade({
				...animationParams,
				excludeDelay: true,
				duration: config.type === "typeWriter" ? 0.05 : config.duration,
				reducedMotion: config.reducedMotion,
			}),
		[animationParams, config.type, config.duration, config.reducedMotion],
	);

	const isWord = config.by === "word";
	const itemStyle = isWord ? WORD_STYLE : SPAN_STYLE;

	return (
		<MotionWrapper
			variants={parent}
			initial="initial"
			whileInView="animate"
			viewport={{ once: true }}
			{...props}
		>
			{units.map((unit, index) => {
				const highlighted = isWord
					? isWordHighlighted(unit, config.highlight)
					: ranges.some(([start, end]) => index >= start && index < end);
				const hasHtml = /<[^>]*>/.test(unit);
				const key = `${index}-${unit}`;
				return (
					<motion.span
						key={key}
						variants={child}
						className={highlighted ? config.highlightClassName : undefined}
						style={itemStyle}
						{...(hasHtml
							? { dangerouslySetInnerHTML: { __html: unit } }
							: { children: unit === "" ? "\u00A0" : unit })}
					/>
				);
			})}
		</MotionWrapper>
	);
}
