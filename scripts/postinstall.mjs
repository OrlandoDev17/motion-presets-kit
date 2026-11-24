#!/usr/bin/env node
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import {
	detectTargets,
	installSkill,
	PACKAGE_ROOT,
	SKILL_NAME,
} from "../bin/skill.mjs";

const PROMPT_TIMEOUT_MS = 10_000;

function note(message) {
	if (process.env.MOTION_PRESETS_KIT_DEBUG) {
		console.log(`[${SKILL_NAME}] ${message}`);
	}
}

async function ask(question) {
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	return new Promise((resolveAnswer) => {
		const timer = setTimeout(() => {
			resolveAnswer("");
			rl.close();
		}, PROMPT_TIMEOUT_MS);
		rl.question(question, (reply) => {
			clearTimeout(timer);
			resolveAnswer(reply.trim());
			rl.close();
		});
	});
}

async function main() {
	if (process.env.MOTION_PRESETS_KIT_SKIP_SKILL) {
		return note("omitida por MOTION_PRESETS_KIT_SKIP_SKILL");
	}
	if (process.env.CI) return note("omitida en CI");
	if (process.env.npm_config_global === "true") {
		return note("omitida en instalación global");
	}

	const initCwd = process.env.INIT_CWD
		? resolve(process.env.INIT_CWD)
		: process.cwd();
	if (initCwd === PACKAGE_ROOT) return note("omitida en el repo de la librería");

	if (!process.stdin.isTTY || !process.stdout.isTTY) {
		console.log(
			`[${SKILL_NAME}] ¿Usas agentes de IA? Instala la skill con: npx motion-presets-kit add-skill`,
		);
		return;
	}

	const answer = await ask(
		`[${SKILL_NAME}] ¿Instalar la skill para tu agente de IA (opencode/Claude/agents)? [y/N] `,
	);
	if (!/^y(es)?$/i.test(answer)) {
		console.log(
			`[${SKILL_NAME}] Puedes instalarla después con: npx motion-presets-kit add-skill`,
		);
		return;
	}

	const targets = detectTargets({ tool: "all" });
	const results = installSkill(targets);
	for (const result of results) {
		const suffix = result.status === "exists" ? "ya existía" : "instalada";
		console.log(`[${SKILL_NAME}] Skill ${suffix}: ${result.destination}`);
	}
}

main().catch((error) => {
	note(`postinstall omitido: ${error instanceof Error ? error.message : error}`);
});
