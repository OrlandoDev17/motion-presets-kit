#!/usr/bin/env node
import {
	detectTargets,
	installSkill,
	readPackageVersion,
	SKILL_NAME,
	TOOLS,
} from "./skill.mjs";

const HELP = `
motion-presets-kit ${readPackageVersion()}

Uso:
  motion-presets-kit <comando> [opciones]

Comandos:
  add-skill           Instala la skill de ${SKILL_NAME} para agentes de IA.
  help                Muestra esta ayuda.

Opciones:
  --global            Instala en el directorio de usuario (home).
  --project           Instala en el proyecto actual (por defecto).
  --tool <nombre>     ${Object.keys(TOOLS).join(" | ")} | all (por defecto: all).
  --dir <ruta>        Directorio de skills explícito.
  --force             Sobrescribe una skill ya instalada.

Ejemplos:
  npx motion-presets-kit add-skill
  npx motion-presets-kit add-skill --global
  npx motion-presets-kit add-skill --tool opencode --project
`.trim();

function parseArgs(argv) {
	const options = {
		command: null,
		global: false,
		project: false,
		tool: "all",
		dir: undefined,
		force: false,
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === "add-skill" || arg === "skill" || arg === "init") {
			options.command = "add-skill";
		} else if (arg === "help" || arg === "--help" || arg === "-h") {
			options.command = "help";
		} else if (arg === "--version" || arg === "-v") {
			options.command = "version";
		} else if (arg === "--global" || arg === "-g") {
			options.global = true;
		} else if (arg === "--project") {
			options.project = true;
		} else if (arg === "--force" || arg === "-f") {
			options.force = true;
		} else if (arg === "--tool") {
			options.tool = argv[index + 1] ?? "all";
			index += 1;
		} else if (arg === "--dir") {
			options.dir = argv[index + 1];
			index += 1;
		}
	}
	return options;
}

function run() {
	const options = parseArgs(process.argv.slice(2));

	if (options.command === "version") {
		console.log(readPackageVersion());
		return;
	}
	if (options.command === "help" || options.command === null) {
		console.log(HELP);
		return;
	}

	if (options.tool !== "all" && !(options.tool in TOOLS)) {
		console.error(
			`[${SKILL_NAME}] Herramienta desconocida: ${options.tool}. Usa: ${Object.keys(
				TOOLS,
			).join(", ")} o all.`,
		);
		process.exitCode = 1;
		return;
	}

	const targets = detectTargets({
		global: options.global && !options.project,
		tool: options.tool,
		dir: options.dir,
	});
	const results = installSkill(targets, { force: options.force });

	for (const result of results) {
		if (result.status === "installed") {
			console.log(
				`[${SKILL_NAME}] Skill instalada (${result.tool}): ${result.destination}`,
			);
		} else if (result.status === "exists") {
			console.log(
				`[${SKILL_NAME}] Ya existía (${result.tool}): ${result.destination}. Usa --force para sobrescribir.`,
			);
		} else {
			console.error(
				`[${SKILL_NAME}] Error al instalar (${result.tool}): ${result.error}`,
			);
			process.exitCode = 1;
		}
	}
}

run();
