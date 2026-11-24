import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		presets: "src/presets/index.ts",
		components: "src/components/index.ts",
	},
	format: ["esm", "cjs"],
	dts: true,
	sourcemap: true,
	clean: true,
	treeshake: true,
	minify: false,
	target: "es2020",
	outDir: "dist",
	external: ["motion", "motion/react", "react", "react-dom", "zod"],
});
