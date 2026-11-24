export type TextAnimateBy = "word" | "letter";

export type TextAnimateType =
	| "blurIn"
	| "slideUp"
	| "slideDown"
	| "slideLeft"
	| "slideRight"
	| "typeWriter";

export interface TextAnimationParams {
	direction: "up" | "down" | "left" | "right" | "none";
	distance: number;
	blur: number;
}

type TokenKind = "tag" | "text" | "space";

interface Token {
	kind: TokenKind;
	value: string;
}

const TAG_RE = /<[^>]*>/g;
const TOKEN_SOURCE = "<[^>]*>|\\s+|[^<\\s]+";

function tokenize(text: string): Token[] {
	const tokens: Token[] = [];
	const regex = new RegExp(TOKEN_SOURCE, "g");
	let match = regex.exec(text);
	while (match !== null) {
		const value = match[0];
		if (value.startsWith("<")) tokens.push({ kind: "tag", value });
		else if (/^\s+$/.test(value)) tokens.push({ kind: "space", value });
		else tokens.push({ kind: "text", value });
		match = regex.exec(text);
	}
	return tokens;
}

/**
 * Agrupa palabras manteniendo las etiquetas HTML pegadas a la palabra contigua
 * (CL-004). `"<strong>Hello</strong> World"` → `["<strong>Hello</strong>", "World"]`.
 */
function groupWords(tokens: Token[]): string[] {
	const units: string[] = [];
	let pending = "";
	let current: string | null = null;
	const flush = () => {
		if (current !== null) {
			units.push(current);
			current = null;
		}
	};

	for (const token of tokens) {
		if (token.kind === "space") {
			flush();
			continue;
		}
		if (token.kind === "tag") {
			if (current !== null) current += token.value;
			else pending += token.value;
			continue;
		}
		flush();
		current = pending + token.value;
		pending = "";
	}
	flush();
	if (pending) units.push(pending);
	return units;
}

/** Agrupa letras manteniendo las etiquetas pegadas a la primera/última letra. */
function groupLetters(tokens: Token[]): string[] {
	const units: string[] = [];
	let pending = "";

	for (const token of tokens) {
		if (token.kind === "space") {
			for (const char of token.value) units.push(char);
			continue;
		}
		if (token.kind === "tag") {
			if (token.value.startsWith("</") && units.length > 0) {
				const last = units.length - 1;
				units[last] = `${units[last] ?? ""}${token.value}`;
			} else {
				pending += token.value;
			}
			continue;
		}
		const chars = [...token.value];
		chars.forEach((char, index) => {
			units.push((index === 0 ? pending : "") + char);
			pending = "";
		});
	}
	if (pending) units.push(pending);
	return units;
}

/** Divide el texto en palabras o letras, preservando las etiquetas HTML (CL-004). */
export function splitText(text: string, by: TextAnimateBy = "word"): string[] {
	const tokens = tokenize(text);
	return by === "letter" ? groupLetters(tokens) : groupWords(tokens);
}

/**
 * Rangos `[inicio, fin)` de coincidencias (case-insensitive) sobre el texto sin
 * etiquetas. Los índices alinean 1:1 con las unidades de `splitText(..., "letter")`.
 */
export function getHighlightRanges(
	text: string,
	highlights: string[],
): Array<[number, number]> {
	const plain = text.replace(TAG_RE, "");
	const lower = plain.toLowerCase();
	const ranges: Array<[number, number]> = [];

	for (const highlight of highlights) {
		if (!highlight) continue;
		const needle = highlight.toLowerCase();
		let from = 0;
		while (from <= lower.length - needle.length) {
			const index = lower.indexOf(needle, from);
			if (index === -1) break;
			ranges.push([index, index + needle.length]);
			from = index + needle.length;
		}
	}
	return ranges;
}

/** `true` si una palabra (sin etiquetas) contiene alguno de los resaltados. */
export function isWordHighlighted(word: string, highlights: string[]): boolean {
	const plain = word.replace(TAG_RE, "").toLowerCase();
	return highlights.some(
		(highlight) => highlight !== "" && plain.includes(highlight.toLowerCase()),
	);
}

/** Parámetros de `fade()` asociados a cada tipo de animación de texto. */
export function getAnimationParams(
	type: TextAnimateType = "slideUp",
): TextAnimationParams {
	switch (type) {
		case "blurIn":
			return { direction: "none", distance: 0, blur: 8 };
		case "slideDown":
			return { direction: "down", distance: 20, blur: 4 };
		case "slideLeft":
			return { direction: "left", distance: 20, blur: 4 };
		case "slideRight":
			return { direction: "right", distance: 20, blur: 4 };
		case "typeWriter":
			return { direction: "none", distance: 0, blur: 0 };
		default:
			return { direction: "up", distance: 20, blur: 4 };
	}
}
