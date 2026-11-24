import { motion } from "motion/react";
import {
	Draggable,
	Marquee,
	TextAnimate,
	useCounter,
} from "motion-presets-kit/components";
import {
	clipReveal,
	fade,
	parentVariants,
	scale,
	slide,
} from "motion-presets-kit/presets";
import { type ComponentType, useEffect, useRef, useState } from "react";
import type { FieldDescriptor } from "./options";
import { useOptions } from "./options";
import { usePlay } from "./replay";
import { StationBody } from "./Station";

type Direction5 = "up" | "down" | "left" | "right" | "none";
type Direction4 = "up" | "down" | "left" | "right";
type TextType =
	| "blurIn"
	| "slideUp"
	| "slideDown"
	| "slideLeft"
	| "slideRight"
	| "typeWriter";

const CHIPS = ["React", "Next.js", "Vite", "Astro", "Remix", "Solid"];

function literal(value: unknown): string {
	if (typeof value === "string") return JSON.stringify(value);
	return String(value);
}

function optionsLiteral(
	entries: Array<[string, unknown]>,
	defaults: Record<string, unknown>,
): string {
	const parts = entries
		.filter(([key, value]) => !Object.is(value, defaults[key]))
		.map(([key, value]) => `${key}: ${literal(value)}`);
	return parts.length > 0 ? `{ ${parts.join(", ")} }` : "";
}

function parseHighlights(raw: string): string[] {
	return raw
		.split(",")
		.map((item) => item.trim())
		.filter((item) => item.length > 0);
}

/* ---------------------------------------------------------------- fade --- */

type FadeValues = {
	direction: Direction5;
	distance: number;
	blur: number;
	scale: number;
	duration: number;
};

const FADE_DEFAULTS: FadeValues = {
	direction: "up",
	distance: 60,
	blur: 0,
	scale: 1,
	duration: 0.5,
};

const FADE_FIELDS: FieldDescriptor[] = [
	{
		key: "direction",
		label: "direction",
		type: "select",
		defaultValue: "up",
		choices: ["up", "down", "left", "right", "none"],
		hint: "De dónde entra el elemento; none = solo fade.",
	},
	{
		key: "distance",
		label: "distance",
		type: "number",
		defaultValue: 60,
		min: 0,
		max: 200,
		step: 5,
		unit: "px",
	},
	{
		key: "blur",
		label: "blur",
		type: "number",
		defaultValue: 0,
		min: 0,
		max: 20,
		step: 1,
		unit: "px",
		hint: "Con blur > 0 añade filter a la transición.",
	},
	{
		key: "scale",
		label: "scale",
		type: "number",
		defaultValue: 1,
		min: 0.5,
		max: 1.5,
		step: 0.05,
		hint: "Escala inicial junto con el fade.",
	},
	{
		key: "duration",
		label: "duration",
		type: "number",
		defaultValue: 0.5,
		min: 0.1,
		max: 2,
		step: 0.05,
		unit: "s",
		hint: "Del tronco común (base).",
	},
];

function fadeSnippet(value: FadeValues): string {
	const opts = optionsLiteral(
		[
			["direction", value.direction],
			["distance", value.distance],
			["blur", value.blur],
			["scale", value.scale],
			["duration", value.duration],
		],
		FADE_DEFAULTS,
	);
	return [
		'import { motion } from "motion/react";',
		'import { fade } from "motion-presets-kit/presets";',
		"",
		"<motion.div",
		`\tvariants={fade(${opts})}`,
		'\tinitial="initial"',
		'\tanimate="animate"',
		">",
		"\tHola",
		"</motion.div>",
	].join("\n");
}

function FadeDemo() {
	const { values, set, reset, changed } = useOptions<FadeValues>(FADE_DEFAULTS);
	const { play, replay } = usePlay();
	return (
		<StationBody
			fields={FADE_FIELDS}
			values={values}
			onChange={set}
			onReset={reset}
			changed={changed}
			onReplay={replay}
			nonce={play}
			span={values.duration}
			spanLabel={`${values.duration.toFixed(2)} s`}
			code={fadeSnippet(values)}
			stage={
				<motion.div
					key={play}
					className="demo-card"
					variants={fade(values)}
					initial="initial"
					animate="animate"
				>
					<span className="demo-card-kicker">Línea P</span>
					<span className="demo-card-title">fade</span>
				</motion.div>
			}
		/>
	);
}

/* --------------------------------------------------------------- slide --- */

type SlideValues = {
	direction: Direction4;
	distance: number;
	duration: number;
};

const SLIDE_DEFAULTS: SlideValues = {
	direction: "right",
	distance: 100,
	duration: 0.5,
};

const SLIDE_FIELDS: FieldDescriptor[] = [
	{
		key: "direction",
		label: "direction",
		type: "select",
		defaultValue: "right",
		choices: ["up", "down", "left", "right"],
	},
	{
		key: "distance",
		label: "distance",
		type: "number",
		defaultValue: 100,
		min: 0,
		max: 300,
		step: 10,
		unit: "px",
	},
	{
		key: "duration",
		label: "duration",
		type: "number",
		defaultValue: 0.5,
		min: 0.1,
		max: 2,
		step: 0.05,
		unit: "s",
	},
];

function slideSnippet(value: SlideValues): string {
	const opts = optionsLiteral(
		[
			["direction", value.direction],
			["distance", value.distance],
			["duration", value.duration],
		],
		SLIDE_DEFAULTS,
	);
	return [
		'import { motion } from "motion/react";',
		'import { slide } from "motion-presets-kit/presets";',
		"",
		"<motion.div",
		`\tvariants={slide(${opts})}`,
		'\tinitial="initial"',
		'\tanimate="animate"',
		">",
		"\tHola",
		"</motion.div>",
	].join("\n");
}

function SlideDemo() {
	const { values, set, reset, changed } =
		useOptions<SlideValues>(SLIDE_DEFAULTS);
	const { play, replay } = usePlay();
	return (
		<StationBody
			fields={SLIDE_FIELDS}
			values={values}
			onChange={set}
			onReset={reset}
			changed={changed}
			onReplay={replay}
			nonce={play}
			span={values.duration}
			spanLabel={`${values.duration.toFixed(2)} s`}
			code={slideSnippet(values)}
			notes={
				<p>
					Sin <code>opacity</code>: el elemento ya es visible y solo se
					desplaza.
				</p>
			}
			stage={
				<motion.div
					key={play}
					className="demo-card"
					variants={slide(values)}
					initial="initial"
					animate="animate"
				>
					<span className="demo-card-kicker">Línea P</span>
					<span className="demo-card-title">slide</span>
				</motion.div>
			}
		/>
	);
}

/* --------------------------------------------------------------- scale --- */

type ScaleValues = { from: number; duration: number };

const SCALE_DEFAULTS: ScaleValues = { from: 0.8, duration: 0.5 };

const SCALE_FIELDS: FieldDescriptor[] = [
	{
		key: "from",
		label: "from",
		type: "number",
		defaultValue: 0.8,
		min: 0,
		max: 1,
		step: 0.05,
		hint: "Escala inicial; anima hasta 1.",
	},
	{
		key: "duration",
		label: "duration",
		type: "number",
		defaultValue: 0.5,
		min: 0.1,
		max: 2,
		step: 0.05,
		unit: "s",
	},
];

function scaleSnippet(value: ScaleValues): string {
	const opts = optionsLiteral(
		[
			["from", value.from],
			["duration", value.duration],
		],
		SCALE_DEFAULTS,
	);
	return [
		'import { motion } from "motion/react";',
		'import { scale } from "motion-presets-kit/presets";',
		"",
		"<motion.div",
		`\tvariants={scale(${opts})}`,
		'\tinitial="initial"',
		'\tanimate="animate"',
		">",
		"\tHola",
		"</motion.div>",
	].join("\n");
}

function ScaleDemo() {
	const { values, set, reset, changed } =
		useOptions<ScaleValues>(SCALE_DEFAULTS);
	const { play, replay } = usePlay();
	return (
		<StationBody
			fields={SCALE_FIELDS}
			values={values}
			onChange={set}
			onReset={reset}
			changed={changed}
			onReplay={replay}
			nonce={play}
			span={values.duration}
			spanLabel={`${values.duration.toFixed(2)} s`}
			code={scaleSnippet(values)}
			stage={
				<motion.div
					key={play}
					className="demo-card"
					variants={scale(values)}
					initial="initial"
					animate="animate"
				>
					<span className="demo-card-kicker">Línea P</span>
					<span className="demo-card-title">scale</span>
				</motion.div>
			}
		/>
	);
}

/* ---------------------------------------------------------- clipReveal --- */

type ClipValues = {
	direction: Direction4;
	scale: number | undefined;
	duration: number;
};

const CLIP_DEFAULTS: ClipValues = {
	direction: "up",
	scale: undefined,
	duration: 0.5,
};

const CLIP_FIELDS: FieldDescriptor[] = [
	{
		key: "direction",
		label: "direction",
		type: "select",
		defaultValue: "up",
		choices: ["up", "down", "left", "right"],
	},
	{
		key: "scale",
		label: "scale",
		type: "number",
		defaultValue: undefined,
		optional: true,
		step: 0.1,
		hint: "Opcional: escala inicial junto con el clip.",
	},
	{
		key: "duration",
		label: "duration",
		type: "number",
		defaultValue: 0.5,
		min: 0.1,
		max: 2,
		step: 0.05,
		unit: "s",
	},
];

function clipSnippet(value: ClipValues): string {
	const opts = optionsLiteral(
		[
			["direction", value.direction],
			["scale", value.scale],
			["duration", value.duration],
		],
		CLIP_DEFAULTS,
	);
	return [
		'import { motion } from "motion/react";',
		'import { clipReveal } from "motion-presets-kit/presets";',
		"",
		"<motion.div",
		`\tvariants={clipReveal(${opts})}`,
		'\tinitial="initial"',
		'\tanimate="animate"',
		">",
		"\tHola",
		"</motion.div>",
	].join("\n");
}

function ClipRevealDemo() {
	const { values, set, reset, changed } = useOptions<ClipValues>(CLIP_DEFAULTS);
	const { play, replay } = usePlay();
	return (
		<StationBody
			fields={CLIP_FIELDS}
			values={values}
			onChange={set}
			onReset={reset}
			changed={changed}
			onReplay={replay}
			nonce={play}
			span={values.duration}
			spanLabel={`${values.duration.toFixed(2)} s`}
			code={clipSnippet(values)}
			notes={
				<p>
					Con <code>border-radius</code> el <code>clip-path</code> se superpone
					al radio: limitación conocida.
				</p>
			}
			stage={
				<motion.div
					key={play}
					className="demo-card"
					variants={clipReveal(values)}
					initial="initial"
					animate="animate"
				>
					<span className="demo-card-kicker">Línea P</span>
					<span className="demo-card-title">clipReveal</span>
				</motion.div>
			}
		/>
	);
}

/* ------------------------------------------------------- parentVariants --- */

type ParentValues = { delayChildren: number; startDelay: number };

const PARENT_DEFAULTS: ParentValues = { delayChildren: 0.12, startDelay: 0 };
const PARENT_LIB_DEFAULTS: ParentValues = { delayChildren: 0, startDelay: 0 };

const PARENT_FIELDS: FieldDescriptor[] = [
	{
		key: "delayChildren",
		label: "delayChildren",
		type: "number",
		defaultValue: 0,
		min: 0,
		max: 0.4,
		step: 0.01,
		unit: "s",
		hint: "Intervalo entre hijos; 0 = todos a la vez.",
	},
	{
		key: "startDelay",
		label: "startDelay",
		type: "number",
		defaultValue: 0,
		min: 0,
		max: 1,
		step: 0.05,
		unit: "s",
	},
];

function parentSnippet(value: ParentValues): string {
	const opts = optionsLiteral(
		[
			["delayChildren", value.delayChildren],
			["startDelay", value.startDelay],
		],
		PARENT_LIB_DEFAULTS,
	);
	return [
		'import { motion } from "motion/react";',
		'import { fade, parentVariants } from "motion-presets-kit/presets";',
		"",
		"<motion.ul",
		`\tvariants={parentVariants(${opts})}`,
		'\tinitial="initial"',
		'\tanimate="animate"',
		">",
		"\t{items.map((item) => (",
		"\t\t<motion.li",
		"\t\t\tkey={item}",
		'\t\t\tvariants={fade({ direction: "right", excludeDelay: true })}',
		"\t\t>",
		"\t\t\t{item}",
		"\t\t</motion.li>",
		"\t))}",
		"</motion.ul>",
	].join("\n");
}

function ParentVariantsDemo() {
	const { values, set, reset, changed } =
		useOptions<ParentValues>(PARENT_DEFAULTS);
	const { play, replay } = usePlay();
	const items = ["Uno", "Dos", "Tres", "Cuatro", "Cinco"];
	return (
		<StationBody
			fields={PARENT_FIELDS}
			values={values}
			onChange={set}
			onReset={reset}
			changed={changed}
			onReplay={replay}
			nonce={play}
			span={Math.max(values.startDelay + values.delayChildren * 5 + 0.5, 1)}
			spanLabel={`${values.delayChildren.toFixed(2)} s / hijo`}
			code={parentSnippet(values)}
			notes={
				<p>
					Los hijos usan <code>excludeDelay: true</code> para heredar el stagger
					del padre y no imponer su propio delay.
				</p>
			}
			stage={
				<ul key={play} className="stagger-list">
					<motion.ul
						className="stagger-inner"
						variants={parentVariants({
							delayChildren: values.delayChildren,
							startDelay: values.startDelay,
						})}
						initial="initial"
						animate="animate"
					>
						{items.map((item) => (
							<motion.li
								key={item}
								className="stagger-item"
								variants={fade({ direction: "right", excludeDelay: true })}
							>
								{item}
							</motion.li>
						))}
					</motion.ul>
				</ul>
			}
		/>
	);
}

/* ---------------------------------------------------------- TextAnimate --- */

type TextValues = {
	text: string;
	by: "word" | "letter";
	type: TextType;
	duration: number;
	startDelay: number;
	highlight: string;
};

const TEXT_DEFAULTS: TextValues = {
	text: "Motion presets kit <strong>typed</strong> con motion/react",
	by: "word",
	type: "slideUp",
	duration: 0.4,
	startDelay: 0,
	highlight: "typed",
};

const TEXT_FIELDS: FieldDescriptor[] = [
	{
		key: "text",
		label: "text",
		type: "text",
		defaultValue: "Motion presets kit <strong>typed</strong> con motion/react",
		hint: "Acepta HTML inline: se preserva (CL-004).",
	},
	{
		key: "by",
		label: "by",
		type: "select",
		defaultValue: "word",
		choices: ["word", "letter"],
	},
	{
		key: "type",
		label: "type",
		type: "select",
		defaultValue: "slideUp",
		choices: [
			"blurIn",
			"slideUp",
			"slideDown",
			"slideLeft",
			"slideRight",
			"typeWriter",
		],
	},
	{
		key: "duration",
		label: "duration",
		type: "number",
		defaultValue: 0.4,
		min: 0.1,
		max: 1,
		step: 0.05,
		unit: "s",
	},
	{
		key: "startDelay",
		label: "startDelay",
		type: "number",
		defaultValue: 0,
		min: 0,
		max: 1,
		step: 0.05,
		unit: "s",
	},
	{
		key: "highlight",
		label: "highlight",
		type: "text",
		defaultValue: "",
		hint: "Palabras separadas por comas (case-insensitive).",
	},
];

function textSnippet(value: TextValues): string {
	const highlights = parseHighlights(value.highlight);
	const attrs = [
		`text=${JSON.stringify(value.text)}`,
		value.by !== "word" ? `by=${JSON.stringify(value.by)}` : "",
		value.type !== "slideUp" ? `type=${JSON.stringify(value.type)}` : "",
		value.duration !== 0.4 ? `duration={${value.duration}}` : "",
		value.startDelay !== 0 ? `startDelay={${value.startDelay}}` : "",
		highlights.length > 0
			? `highlight={[${highlights.map((item) => JSON.stringify(item)).join(", ")}]}`
			: "",
		highlights.length > 0 ? 'highlightClassName="tk-hl"' : "",
	].filter((item) => item.length > 0);
	return [
		'import { TextAnimate } from "motion-presets-kit/components";',
		"",
		"<TextAnimate",
		...attrs.map((attr) => `\t${attr}`),
		"/>",
	].join("\n");
}

function TextAnimateDemo() {
	const { values, set, reset, changed } = useOptions<TextValues>(TEXT_DEFAULTS);
	const { play, replay } = usePlay();
	return (
		<StationBody
			fields={TEXT_FIELDS}
			values={values}
			onChange={set}
			onReset={reset}
			changed={changed}
			onReplay={replay}
			nonce={play}
			span={values.startDelay + values.duration * 3}
			spanLabel={`${values.duration.toFixed(2)} s / unidad`}
			code={textSnippet(values)}
			notes={
				<p>
					Anima con <code>whileInView</code> (<code>once: true</code>): vuelve a
					entrar reproduciendo de nuevo.
				</p>
			}
			stage={
				<TextAnimate
					key={play}
					className="ta-stage"
					text={values.text}
					by={values.by}
					type={values.type}
					duration={values.duration}
					startDelay={values.startDelay}
					highlight={parseHighlights(values.highlight)}
					highlightClassName="tk-hl"
				/>
			}
		/>
	);
}

/* -------------------------------------------------------------- Marquee --- */

type MarqueeValues = {
	speed: number;
	direction: "left" | "right";
	pauseOnHover: boolean;
	gap: string;
};

const MARQUEE_DEFAULTS: MarqueeValues = {
	speed: 20,
	direction: "left",
	pauseOnHover: true,
	gap: "2rem",
};

const MARQUEE_FIELDS: FieldDescriptor[] = [
	{
		key: "speed",
		label: "speed",
		type: "number",
		defaultValue: 20,
		min: 5,
		max: 60,
		step: 1,
		unit: "s/vuelta",
	},
	{
		key: "direction",
		label: "direction",
		type: "select",
		defaultValue: "left",
		choices: ["left", "right"],
	},
	{
		key: "pauseOnHover",
		label: "pauseOnHover",
		type: "toggle",
		defaultValue: true,
	},
	{
		key: "gap",
		label: "gap",
		type: "text",
		defaultValue: "2rem",
	},
];

function marqueeSnippet(value: MarqueeValues): string {
	const attrs = [
		value.speed !== 20 ? `speed={${value.speed}}` : "",
		value.direction !== "left"
			? `direction=${JSON.stringify(value.direction)}`
			: "",
		value.pauseOnHover !== true ? `pauseOnHover={${value.pauseOnHover}}` : "",
		value.gap !== "2rem" ? `gap=${JSON.stringify(value.gap)}` : "",
	].filter((item) => item.length > 0);
	return [
		'import { Marquee } from "motion-presets-kit/components";',
		"",
		`<Marquee${attrs.length > 0 ? ` ${attrs.join(" ")}` : ""}>`,
		"\t<span>Logo 1</span>",
		"\t<span>Logo 2</span>",
		"</Marquee>",
	].join("\n");
}

function MarqueeDemo() {
	const { values, set, reset, changed } =
		useOptions<MarqueeValues>(MARQUEE_DEFAULTS);
	const { play, replay } = usePlay();
	return (
		<StationBody
			fields={MARQUEE_FIELDS}
			values={values}
			onChange={set}
			onReset={reset}
			changed={changed}
			onReplay={replay}
			nonce={play}
			span={values.speed}
			spanLabel={`${values.speed} s / vuelta`}
			code={marqueeSnippet(values)}
			notes={
				<p>
					CSS puro con <code>@keyframes</code> y children duplicados: loop sin
					costuras. Respeta reduced-motion.
				</p>
			}
			stage={
				<Marquee
					key={play}
					className="marquee-stage"
					speed={values.speed}
					direction={values.direction}
					pauseOnHover={values.pauseOnHover}
					gap={values.gap}
				>
					{CHIPS.map((name) => (
						<span className="chip" key={name}>
							{name}
						</span>
					))}
				</Marquee>
			}
		/>
	);
}

/* ------------------------------------------------------------ Draggable --- */

type DraggableValues = {
	axis: "x" | "y" | "both";
	bounds: "libre" | "parent" | "document";
	snap: boolean;
	grid: number;
};

const DRAGGABLE_DEFAULTS: DraggableValues = {
	axis: "both",
	bounds: "libre",
	snap: false,
	grid: 20,
};

const DRAGGABLE_FIELDS: FieldDescriptor[] = [
	{
		key: "axis",
		label: "axis",
		type: "select",
		defaultValue: "both",
		choices: ["x", "y", "both"],
	},
	{
		key: "bounds",
		label: "bounds",
		type: "select",
		defaultValue: "libre",
		choices: ["libre", "parent", "document"],
		hint: "libre = sin límites (undefined).",
	},
	{
		key: "snap",
		label: "snapToGrid",
		type: "toggle",
		defaultValue: false,
	},
	{
		key: "grid",
		label: "grid",
		type: "number",
		defaultValue: 20,
		min: 5,
		max: 60,
		step: 5,
		unit: "px",
	},
];

function draggableSnippet(value: DraggableValues): string {
	const attrs = [
		value.axis !== "both" ? `axis=${JSON.stringify(value.axis)}` : "",
		value.bounds !== "libre" ? `bounds=${JSON.stringify(value.bounds)}` : "",
		value.snap ? `snapToGrid={[${value.grid}, ${value.grid}]}` : "",
	].filter((item) => item.length > 0);
	return [
		'import { Draggable } from "motion-presets-kit/components";',
		"",
		`<Draggable${attrs.length > 0 ? ` ${attrs.join(" ")}` : ""}>`,
		"\t<div>Arrastráme</div>",
		"</Draggable>",
	].join("\n");
}

function DraggableDemo() {
	const { values, set, reset, changed } =
		useOptions<DraggableValues>(DRAGGABLE_DEFAULTS);
	const { play, replay } = usePlay();
	const [last, setLast] = useState("—");
	const bounds = values.bounds === "libre" ? undefined : values.bounds;
	return (
		<StationBody
			fields={DRAGGABLE_FIELDS}
			values={values}
			onChange={set}
			onReset={reset}
			changed={changed}
			onReplay={replay}
			nonce={play}
			span={1}
			spanLabel="libre"
			code={draggableSnippet(values)}
			notes={
				<p>
					Último punto: <b className="mono">{last}</b>. Con límites inválidos se
					emite <code>warn()</code> y se ignoran (CL-007).
				</p>
			}
			stage={
				<div className="drag-area">
					<Draggable
						key={play}
						className="drag-token"
						axis={values.axis}
						bounds={bounds}
						snapToGrid={values.snap ? [values.grid, values.grid] : undefined}
						dragElastic={0.2}
						onDragEnd={(_event, info) =>
							setLast(
								`x=${Math.round(info.point.x)} y=${Math.round(info.point.y)}`,
							)
						}
					>
						<span className="demo-card-kicker">Línea C</span>
						<span className="demo-card-title">drag</span>
					</Draggable>
				</div>
			}
		/>
	);
}

/* ---------------------------------------------------------- useCounter --- */

type CounterValues = {
	from: number;
	to: number;
	decimals: number;
	prefix: string;
	suffix: string;
	separator: string;
	duration: number;
};

const COUNTER_DEFAULTS: CounterValues = {
	from: 0,
	to: 100,
	decimals: 0,
	prefix: "",
	suffix: "",
	separator: ",",
	duration: 1,
};

const COUNTER_FIELDS: FieldDescriptor[] = [
	{ key: "from", label: "from", type: "number", defaultValue: 0, step: 1 },
	{ key: "to", label: "to", type: "number", defaultValue: 100, step: 1 },
	{
		key: "decimals",
		label: "decimals",
		type: "number",
		defaultValue: 0,
		min: 0,
		max: 4,
		step: 1,
	},
	{ key: "prefix", label: "prefix", type: "text", defaultValue: "" },
	{ key: "suffix", label: "suffix", type: "text", defaultValue: "" },
	{ key: "separator", label: "separator", type: "text", defaultValue: "," },
	{
		key: "duration",
		label: "duration",
		type: "number",
		defaultValue: 1,
		min: 0.2,
		max: 3,
		step: 0.1,
		unit: "s",
	},
];

function counterSnippet(value: CounterValues): string {
	const opts = optionsLiteral(
		[
			["from", value.from],
			["to", value.to],
			["decimals", value.decimals],
			["prefix", value.prefix],
			["suffix", value.suffix],
			["separator", value.separator],
			["duration", value.duration],
		],
		COUNTER_DEFAULTS,
	);
	return [
		'import { useRef } from "react";',
		'import { useCounter } from "motion-presets-kit/components";',
		"",
		"const ref = useRef<HTMLSpanElement>(null);",
		`const { start, reset } = useCounter(ref${opts ? `, ${opts}` : ""});`,
		"",
		"<span ref={ref} />",
		"",
		"<button onClick={start}>Start</button>",
		"<button onClick={reset}>Reset</button>",
	].join("\n");
}

function CounterDemo() {
	const { values, set, reset, changed } =
		useOptions<CounterValues>(COUNTER_DEFAULTS);
	const ref = useRef<HTMLSpanElement>(null);
	const { play, replay } = usePlay();
	const counter = useCounter(ref, values);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reinicia el contador al reproducir
	useEffect(() => {
		counter.start();
	}, [play]);

	return (
		<StationBody
			fields={COUNTER_FIELDS}
			values={values}
			onChange={set}
			onReset={reset}
			changed={changed}
			onReplay={replay}
			nonce={play}
			span={values.duration}
			spanLabel={`${values.duration.toFixed(1)} s`}
			code={counterSnippet(values)}
			notes={
				<p>
					Escribe el valor formateado en <code>ref.current.textContent</code>.
					Preserva el signo con negativos (CL-005).
				</p>
			}
			stage={<span className="counter-value" ref={ref} />}
		/>
	);
}

export const DEMO_BY_ID: Record<string, ComponentType> = {
	fade: FadeDemo,
	slide: SlideDemo,
	scale: ScaleDemo,
	clipReveal: ClipRevealDemo,
	parentVariants: ParentVariantsDemo,
	TextAnimate: TextAnimateDemo,
	Marquee: MarqueeDemo,
	Draggable: DraggableDemo,
	useCounter: CounterDemo,
};
