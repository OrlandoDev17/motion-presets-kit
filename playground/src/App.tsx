import { type CSSProperties, useCallback, useEffect, useState } from "react";
import { CodeBlock } from "./CodeBlock";
import {
	ENTRY_POINTS,
	ROUTES,
	SHARED_OPTIONS,
	STATIONS,
	stationsOf,
} from "./catalogue";
import { DEMO_BY_ID } from "./demos";
import { ReplayProvider, usePlay } from "./replay";
import { Station } from "./Station";
import { SystemMap } from "./SystemMap";

const STORAGE_KEY = "mpk.playground.station";
const FALLBACK_ID = "fade";

function stationIdAt(index: number): string {
	return STATIONS[index]?.id ?? FALLBACK_ID;
}

function readInitial(): string {
	if (typeof window === "undefined") return stationIdAt(0);
	const hash = window.location.hash.replace(/^#/, "");
	if (hash && STATIONS.some((station) => station.id === hash)) return hash;
	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (stored && STATIONS.some((station) => station.id === stored))
		return stored;
	return stationIdAt(0);
}

export function App() {
	return (
		<ReplayProvider>
			<Playground />
		</ReplayProvider>
	);
}

function Playground() {
	const [active, setActive] = useState<string>(readInitial);
	const { replayAll } = usePlay();

	useEffect(() => {
		window.localStorage.setItem(STORAGE_KEY, active);
		window.history.replaceState(null, "", `#${active}`);
	}, [active]);

	const select = useCallback((id: string) => {
		setActive(id);
		const reduce = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		document.getElementById(id)?.scrollIntoView({
			behavior: reduce ? "auto" : "smooth",
			block: "start",
		});
	}, []);

	useEffect(() => {
		const elements = STATIONS.map((station) =>
			document.getElementById(station.id),
		).filter((element): element is HTMLElement => element !== null);
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				const first = visible[0];
				if (first) setActive(first.target.id);
			},
			{ rootMargin: "-45% 0px -45% 0px", threshold: 0 },
		);
		for (const element of elements) observer.observe(element);
		return () => observer.disconnect();
	}, []);

	return (
		<div className="page">
			<header className="cartel">
				<div className="cartel-sign">
					<span className="cartel-kicker">Plano de líneas · motion/react</span>
					<h1>motion-presets-kit</h1>
					<p className="cartel-tag">
						Presets variant-returning, componentes y hooks con defaults
						sensatos. Cada parada trae su <b>demo en vivo</b>, sus{" "}
						<b>defaults reales</b> y el <b>billete</b> (código listo para
						copiar).
					</p>
					<ul className="legend-strip">
						<li>
							<span
								className="swatch"
								style={{ background: "var(--line-p)" }}
							/>
							Presets
						</li>
						<li>
							<span
								className="swatch"
								style={{ background: "var(--line-c)" }}
							/>
							Componentes
						</li>
						<li>
							<span
								className="swatch"
								style={{ background: "var(--line-h)" }}
							/>
							Hooks
						</li>
					</ul>
				</div>
				<div className="cartel-side">
					<CodeBlock
						label="Instalación"
						code="pnpm add motion-presets-kit motion zod"
					/>
					<ul className="entry-list">
						{ENTRY_POINTS.map((entry) => (
							<li key={entry.entry}>
								<span className="swatch" style={{ background: entry.tone }} />
								<span className="entry-path">{entry.entry}</span>
								<span className="entry-note">{entry.note}</span>
							</li>
						))}
					</ul>
				</div>
			</header>

			<section className="map-band" aria-label="Plano de líneas">
				<div className="map-band-head">
					<span className="band-title">Plano de líneas</span>
					<button type="button" className="replay-all" onClick={replayAll}>
						<span className="replay-dot" aria-hidden="true" />
						Reproducir todas las salidas
					</button>
				</div>
				<SystemMap active={active} onSelect={select} />
			</section>

			<div className="layout">
				<aside className="rail">
					<nav className="index" aria-label="Paradas">
						{ROUTES.map((route) => (
							<div className="index-group" key={route.id}>
								<span className="index-route">
									<span
										className="line-tag"
										style={{ background: route.tone } as CSSProperties}
									>
										{route.code}
									</span>
									{route.name.replace(/^Línea . — /, "")}
								</span>
								{stationsOf(route.id).map((station) => (
									<button
										key={station.id}
										type="button"
										className="index-item"
										data-active={active === station.id}
										onClick={() => select(station.id)}
									>
										<span
											className="index-node"
											style={{ borderColor: route.tone } as CSSProperties}
											data-active={active === station.id}
										/>
										{station.name}
									</button>
								))}
							</div>
						))}
					</nav>

					<section className="legend" aria-label="Tronco común">
						<h2 className="legend-title">Tronco común</h2>
						<p className="legend-note">
							Opciones que comparten todos los presets. Omitir una equivale a
							usar su default.
						</p>
						<ul className="legend-list">
							{SHARED_OPTIONS.map((option) => (
								<li key={option.name}>
									<span className="legend-name">{option.name}</span>
									<span className="legend-type">{option.type}</span>
									<span className="legend-value">{option.value}</span>
								</li>
							))}
						</ul>
					</section>
				</aside>

				<main className="line">
					{ROUTES.map((route) => (
						<div className="line-group" key={route.id}>
							<div
								className="line-head"
								style={{ "--tone": route.tone } as CSSProperties}
							>
								<span className="line-tag">{route.code}</span>
								<div className="line-head-body">
									<h2>{route.name.replace(/^Línea . — /, "")}</h2>
									<p>{route.note}</p>
									<code>{route.entry}</code>
								</div>
							</div>
							{stationsOf(route.id).map((station) => {
								const Demo = DEMO_BY_ID[station.id];
								return (
									<Station
										key={station.id}
										station={station}
										active={active === station.id}
									>
										{Demo ? <Demo /> : null}
									</Station>
								);
							})}
						</div>
					))}
				</main>
			</div>

			<footer className="foot">
				<p>
					<b>motion-presets-kit</b> · MIT · React 18+ · motion ^12
				</p>
				<p className="foot-note">
					El playground usa los defaults reales de la librería y respeta{" "}
					<code>prefers-reduced-motion</code>. Arranca con{" "}
					<code className="mono">pnpm playground</code>.
				</p>
			</footer>
		</div>
	);
}
