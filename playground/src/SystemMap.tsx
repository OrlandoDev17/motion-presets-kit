import { Fragment } from "react";
import { ROUTES, type RouteId, routeOf, STATIONS } from "./catalogue";

const ROUTE_Y: Record<RouteId, number> = {
	presets: 150,
	components: 285,
	hooks: 395,
};

const STATION_X: Record<string, number> = {
	fade: 200,
	slide: 340,
	scale: 480,
	clipReveal: 620,
	parentVariants: 770,
	TextAnimate: 300,
	Marquee: 520,
	Draggable: 730,
	useCounter: 560,
};

const TRUNK_X = 110;
const LINE_START = 130;
const LINE_END = 1010;
const LABEL_X = 1030;

interface SystemMapProps {
	active: string;
	onSelect: (id: string) => void;
}

export function SystemMap({ active, onSelect }: SystemMapProps) {
	return (
		<figure className="map">
			<div className="map-scroll">
				{/* biome-ignore lint/a11y/useSemanticElements: el SVG del plano no puede ser un <fieldset> */}
				<svg
					viewBox="0 0 1060 440"
					role="group"
					aria-label="Plano de líneas de motion-presets-kit. Cada estación es un preset, componente o hook."
				>
					<title>Plano de líneas de motion-presets-kit</title>
					<line
						x1={TRUNK_X}
						y1={ROUTE_Y.presets}
						x2={TRUNK_X}
						y2={ROUTE_Y.hooks}
						className="map-trunk"
					/>
					{(["presets", "components", "hooks"] as RouteId[]).map((id) => (
						<circle
							key={`ring-${id}`}
							cx={TRUNK_X}
							cy={ROUTE_Y[id]}
							r={11}
							className="map-ring"
						/>
					))}
					<text
						x={TRUNK_X}
						y={ROUTE_Y.components + 4}
						textAnchor="middle"
						className="map-trunk-label"
					>
						R
					</text>

					{ROUTES.map((route) => {
						const y = ROUTE_Y[route.id];
						return (
							<g key={route.id}>
								<line
									x1={LINE_START}
									y1={y}
									x2={LINE_END}
									y2={y}
									className="map-line"
									style={{ stroke: route.tone }}
								/>
								<line
									x1={LINE_END}
									y1={y - 8}
									x2={LINE_END}
									y2={y + 8}
									className="map-line"
									style={{ stroke: route.tone }}
								/>
								<g className="map-route-label">
									<rect
										x={LABEL_X - 168}
										y={y - 34}
										width={24}
										height={20}
										rx={3}
										style={{ fill: route.tone }}
									/>
									<text
										x={LABEL_X - 156}
										y={y - 20}
										textAnchor="middle"
										className="map-route-code"
									>
										{route.code}
									</text>
									<text
										x={LABEL_X - 136}
										y={y - 20}
										textAnchor="start"
										className="map-route-name"
									>
										{route.name.replace(/^Línea . — /, "")}
									</text>
								</g>
							</g>
						);
					})}

					{STATIONS.map((station) => {
						const x = STATION_X[station.id] ?? 0;
						const y = ROUTE_Y[station.route];
						const isActive = station.id === active;
						const tone = routeOf(station.route).tone;
						return (
							<Fragment key={station.id}>
								{/* biome-ignore lint/a11y/useSemanticElements: un <g> de SVG no puede ser un <button> */}
								<g
									className="map-station"
									data-active={isActive}
									role="button"
									tabIndex={0}
									aria-label={`${station.name}, ${routeOf(station.route).name}`}
									onClick={() => onSelect(station.id)}
									onKeyDown={(event) => {
										if (event.key === "Enter" || event.key === " ") {
											event.preventDefault();
											onSelect(station.id);
										}
									}}
								>
									{isActive ? (
										<>
											<line
												x1={x}
												y1={y - 40}
												x2={x}
												y2={y - 10}
												className="map-flag-pole"
											/>
											<path
												d={`M ${x} ${y - 40} L ${x + 22} ${y - 33} L ${x} ${y - 26} Z`}
												style={{ fill: tone }}
											/>
										</>
									) : null}
									<circle
										cx={x}
										cy={y}
										r={isActive ? 10 : 7}
										className="map-node"
										style={{ stroke: tone }}
									/>
									<text
										x={x}
										y={y + 28}
										textAnchor="middle"
										className="map-station-name"
										data-active={isActive}
									>
										{station.name}
									</text>
								</g>
							</Fragment>
						);
					})}
				</svg>
			</div>
			<figcaption className="map-caption">
				<span>
					<b>3 líneas</b> · <b>9 paradas</b>
				</span>
				<span className="map-key">
					<i className="key-node" aria-hidden="true" /> parada
					<i className="key-ring" aria-hidden="true" /> tronco común
					(reducedMotion)
				</span>
			</figcaption>
		</figure>
	);
}
