import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { afterEach, describe, test } from "node:test";
import { fileURLToPath } from "node:url";
import {
	detectTargets,
	installSkill,
	SKILL_NAME,
	SKILL_SOURCE,
} from "../bin/skill.mjs";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(TEST_DIR, "..", "bin", "cli.mjs");

const tempDirs = [];
function makeTempDir() {
	const dir = mkdtempSync(join(tmpdir(), "mpk-skill-"));
	tempDirs.push(dir);
	return dir;
}

afterEach(() => {
	while (tempDirs.length > 0) {
		rmSync(tempDirs.pop(), { recursive: true, force: true });
	}
});

describe("detectTargets()", () => {
	test("con --dir usa ese directorio", () => {
		const dir = makeTempDir();
		const targets = detectTargets({ dir });
		assert.equal(targets.length, 1);
		assert.equal(targets[0].tool, "custom");
		assert.equal(targets[0].dir, resolve(dir));
	});

	test("con --tool usa solo esa herramienta", () => {
		const targets = detectTargets({ tool: "opencode" });
		assert.equal(targets.length, 1);
		assert.equal(targets[0].tool, "opencode");
	});
});

describe("installSkill()", () => {
	test("copia SKILL.md y evita sobrescribir sin --force", () => {
		const dir = makeTempDir();
		const targets = [{ tool: "custom", dir }];

		assert.equal(existsSync(SKILL_SOURCE), true);
		const first = installSkill(targets);
		const destination = join(dir, SKILL_NAME, "SKILL.md");
		assert.equal(first[0].status, "installed");
		assert.equal(existsSync(destination), true);

		const content = readFileSync(destination, "utf8");
		assert.match(content, /name: motion-presets-kit/);

		const second = installSkill(targets);
		assert.equal(second[0].status, "exists");

		const forced = installSkill(targets, { force: true });
		assert.equal(forced[0].status, "installed");
	});
});

describe("CLI", () => {
	test("add-skill --dir instala la skill", () => {
		const dir = makeTempDir();
		const output = execFileSync(
			process.execPath,
			[CLI_PATH, "add-skill", "--dir", dir, "--force"],
			{ encoding: "utf8" },
		);
		assert.match(output, /Skill instalada/);
		assert.equal(existsSync(join(dir, SKILL_NAME, "SKILL.md")), true);
	});

	test("--version imprime la versión del package", () => {
		const output = execFileSync(process.execPath, [CLI_PATH, "--version"], {
			encoding: "utf8",
		}).trim();
		assert.match(output, /^\d+\.\d+\.\d+/);
	});

	test("--help describe el comando add-skill", () => {
		const output = execFileSync(process.execPath, [CLI_PATH, "--help"], {
			encoding: "utf8",
		});
		assert.match(output, /add-skill/);
	});
});
