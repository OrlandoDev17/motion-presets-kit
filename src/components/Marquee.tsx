import {
	type CSSProperties,
	memo,
	type ReactNode,
	useEffect,
	useId,
	useMemo,
	useRef,
} from "react";
import {
	marqueeOptionsSchema,
	type ResolvedMarqueeOptions,
} from "../schemas/marquee";
import { shouldReduceMotion } from "../utils/reduced-motion";
import { warn } from "../utils/warn";
import { buildMarqueeKeyframes } from "./marquee-utils";

export interface MarqueeProps {
	children: ReactNode;
	speed?: number;
	direction?: "left" | "right";
	pauseOnHover?: boolean;
	gap?: string;
	className?: string;
	reducedMotion?: boolean;
}

const MASK_STYLE: CSSProperties = {
	maskImage:
		"linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
	WebkitMaskImage:
		"linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
};

const BASE_STYLE: CSSProperties = {
	display: "flex",
	overflow: "hidden",
	width: "100%",
};

/** Marquee con CSS puro (`@keyframes`) y children duplicados para un loop sin costuras. */
export const Marquee = memo(function Marquee({
	children,
	speed = 20,
	direction = "left",
	pauseOnHover = true,
	gap = "2rem",
	className,
	reducedMotion = true,
}: MarqueeProps) {
	const rawId = useId();
	const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
	const duplicateRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = duplicateRef.current;
		if (element) element.inert = true;
	}, []);

	const parsed = marqueeOptionsSchema.safeParse({
		speed,
		direction,
		pauseOnHover,
		gap,
		reducedMotion,
	});
	if (!parsed.success) {
		warn(`Opciones inválidas en Marquee: ${parsed.error.message}`);
	}
	const config: ResolvedMarqueeOptions = parsed.success
		? parsed.data
		: marqueeOptionsSchema.parse({});

	const keyframes = useMemo(
		() =>
			buildMarqueeKeyframes({
				id,
				direction: config.direction,
				gap: config.gap,
				speed: config.speed,
				pauseOnHover: config.pauseOnHover,
			}),
		[id, config.direction, config.gap, config.speed, config.pauseOnHover],
	);

	const paused = shouldReduceMotion(config.reducedMotion);
	const listStyle: CSSProperties = {
		display: "flex",
		alignItems: "center",
		flexShrink: 0,
		minWidth: "100%",
		gap: config.gap,
		...(paused
			? {}
			: {
					animation: `${keyframes.animationName} ${config.speed}s linear infinite`,
					willChange: "transform",
					backfaceVisibility: "hidden",
				}),
	};

	return (
		<>
			<style>{keyframes.css}</style>
			<section
				aria-label="Contenido en desplazamiento continuo"
				className={
					className
						? `${keyframes.trackClassName} ${className}`
						: keyframes.trackClassName
				}
				style={{ ...BASE_STYLE, ...MASK_STYLE }}
			>
				<div className={keyframes.listClassName} style={listStyle}>
					{children}
				</div>
				<div
					ref={duplicateRef}
					className={keyframes.listClassName}
					style={listStyle}
					aria-hidden="true"
				>
					{children}
				</div>
			</section>
		</>
	);
});
