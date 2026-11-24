export interface MarqueeKeyframesOptions {
	id: string;
	direction: "left" | "right";
	gap: string;
	speed: number;
	pauseOnHover: boolean;
}

export interface MarqueeKeyframes {
	animationName: string;
	listClassName: string;
	trackClassName: string;
	css: string;
}

/** Genera los `@keyframes` y clases CSS del marquee (una función pura, sin React). */
export function buildMarqueeKeyframes(
	options: MarqueeKeyframesOptions,
): MarqueeKeyframes {
	const { id, direction, gap, speed, pauseOnHover } = options;
	const animationName = `motion-marquee-${id}`;
	const listClassName = `motion-marquee-list-${id}`;
	const trackClassName = `motion-marquee-track-${id}`;

	const from = direction === "left" ? "0" : `calc(-100% - ${gap})`;
	const to = direction === "left" ? `calc(-100% - ${gap})` : "0";

	const css = [
		`@keyframes ${animationName}{from{transform:translateX(${from})}to{transform:translateX(${to})}}`,
		`.${listClassName}{display:flex;align-items:center;flex-shrink:0;min-width:100%;gap:${gap};animation:${animationName} ${speed}s linear infinite;will-change:transform;backface-visibility:hidden}`,
		`.${trackClassName}{display:flex;gap:${gap}}`,
		pauseOnHover
			? `.${trackClassName}:hover .${listClassName}{animation-play-state:paused}`
			: "",
	]
		.filter(Boolean)
		.join("");

	return { animationName, listClassName, trackClassName, css };
}
