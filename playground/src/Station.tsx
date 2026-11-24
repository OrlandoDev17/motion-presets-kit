import type { CSSProperties, ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";
import { routeOf, type Station as StationMeta } from "./catalogue";
import {
	type FieldDescriptor,
	type OptionMap,
	OptionsPanel,
	type OptionValue,
} from "./options";

interface StationProps {
	station: StationMeta;
	active: boolean;
	children: ReactNode;
}

export function Station({ station, active, children }: StationProps) {
	const route = routeOf(station.route);
	return (
		<section
			className="station"
			id={station.id}
			data-station-id={station.id}
			data-active={active}
			style={{ "--tone": route.tone } as CSSProperties}
		>
			<div className="station-rail" aria-hidden="true">
				<span className="station-node" />
			</div>
			<div className="station-main">
				<header className="station-head">
					<div className="station-title">
						<span className="line-tag">{route.code}</span>
						<h2>{station.name}</h2>
						<span className="station-kind">{station.kind}</span>
						{active ? <span className="here">estás aquí</span> : null}
					</div>
					<p className="station-journey">{station.journey}</p>
					<code className="station-entry">import · {route.entry}</code>
				</header>
				{children}
			</div>
		</section>
	);
}

interface StationBodyProps {
	fields: FieldDescriptor[];
	values: OptionMap;
	onChange: (key: string, value: OptionValue) => void;
	onReset: () => void;
	changed: boolean;
	onReplay: () => void;
	nonce: number;
	replayLabel?: string;
	span: number;
	spanLabel: string;
	code: string;
	stage: ReactNode;
	notes?: ReactNode;
}

export function StationBody({
	fields,
	values,
	onChange,
	onReset,
	changed,
	onReplay,
	nonce,
	replayLabel = "Reproducir salida",
	span,
	spanLabel,
	code,
	stage,
	notes,
}: StationBodyProps) {
	return (
		<div className="platform-body">
			<div className="stage">
				<div className="stage-canvas">{stage}</div>
				<div className="stage-bar">
					<button type="button" className="replay-button" onClick={onReplay}>
						<span className="replay-dot" aria-hidden="true" />
						{replayLabel}
					</button>
					<Timeline nonce={nonce} span={span} spanLabel={spanLabel} />
				</div>
			</div>
			<div className="console-col">
				<OptionsPanel
					fields={fields}
					values={values}
					onChange={onChange}
					onReset={onReset}
					changed={changed}
				/>
				{notes ? (
					<aside className="notes">
						<span className="notes-title">Notas de servicio</span>
						{notes}
					</aside>
				) : null}
				<CodeBlock code={code} />
			</div>
		</div>
	);
}

interface TimelineProps {
	nonce: number;
	span: number;
	spanLabel: string;
}

function Timeline({ nonce, span, spanLabel }: TimelineProps) {
	const step = span <= 1 ? 0.25 : span <= 3 ? 0.5 : 5;
	const ticks: number[] = [];
	for (let tick = 0; tick <= span + 1e-6; tick += step) {
		ticks.push(Number(tick.toFixed(2)));
	}
	return (
		<div className="timeline">
			<span className="timeline-axis" aria-hidden="true">
				t
			</span>
			<div className="timeline-track">
				<span
					key={nonce}
					className="timeline-playhead"
					style={{ animationDuration: `${span}s` }}
				/>
				{ticks.map((tick) => (
					<span
						key={tick}
						className="timeline-tick"
						style={{ left: `${(tick / span) * 100}%` }}
					>
						{tick === 0 ? "" : tick}
					</span>
				))}
			</div>
			<span className="timeline-span">{spanLabel}</span>
		</div>
	);
}
