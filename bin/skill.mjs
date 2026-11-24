import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const PACKAGE_ROOT = resolve(HERE, "..");
export const SKILL_NAME = "motion-presets-kit";
export const SKILL_SOURCE = join(
	PACKAGE_ROOT,
	"skill",
	SKILL_NAME,
	"SKILL.md",
);

/** Raíces por herramienta: proyecto y global. */
export const TOOLS = {
	opencode: { projectRoot: ".opencode", globalRoot: join(".config", "opencode") },
	claude: { projectRoot: ".claude", globalRoot: ".claude" },
	agents: { projectRoot: ".agents", globalRoot: ".agents" },
};

export function readPackageVersion() {
	try {
		const pkg = JSON.parse(
			readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8"),
		);
		return pkg.version ?? "0.0.0";
	} catch {
		return "0.0.0";
	}
}

/**
 * Resuelve los directorios de skills donde instalar.
 * Con `dir` se usa ese directorio; si no, auto-detecta las herramientas
 * existentes (opencode, claude, agents) y cae en opencode si no hay ninguna.
 */
export function detectTargets({ global = false, tool = "all", dir } = {}) {
	if (dir) return [{ tool: "custom", dir: resolve(dir) }];

	const names = tool === "all" ? Object.keys(TOOLS) : [tool];
	const all = names.map((name) => {
		const root = global
			? join(homedir(), TOOLS[name].globalRoot)
			: resolve(process.cwd(), TOOLS[name].projectRoot);
		return { tool: name, root, dir: join(root, "skills") };
	});

	const existing = all.filter((target) => existsSync(target.root));
	if (existing.length > 0) {
		return existing.map(({ tool: name, dir: skillsDir }) => ({
			tool: name,
			dir: skillsDir,
		}));
	}
	if (tool !== "all") {
		return all.map(({ tool: name, dir: skillsDir }) => ({
			tool: name,
			dir: skillsDir,
		}));
	}
	return [{ tool: names[0], dir: all[0].dir }];
}

/**
 * Copia la skill a cada directorio destino.
 * Devuelve un resultado por destino con el estado de la operación.
 */
export function installSkill(targets, { force = false } = {}) {
	return targets.map((target) => {
		const destination = join(target.dir, SKILL_NAME, "SKILL.md");
		try {
			if (existsSync(destination) && !force) {
				return { ...target, destination, status: "exists" };
			}
			mkdirSync(join(target.dir, SKILL_NAME), { recursive: true });
			copyFileSync(SKILL_SOURCE, destination);
			return { ...target, destination, status: "installed" };
		} catch (error) {
			return {
				...target,
				destination,
				status: "error",
				error: error instanceof Error ? error.message : String(error),
			};
		}
	});
}
