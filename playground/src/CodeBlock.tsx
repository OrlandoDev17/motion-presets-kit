import { useCallback, useMemo, useState } from "react";

type TokenKind = "comment" | "string" | "keyword" | "tag" | "number" | "plain";

interface Token {
	text: string;
	kind: TokenKind;
	start: number;
}

const TOKEN_RE =
	/(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b(?:import|from|export|const|let|function|return|new|true|false|default|type|interface|async|await)\b)|(<\/?[A-Za-z][\w.]*)|(\b\d+(?:\.\d+)?\b)/g;

function tokenize(code: string): Token[] {
	const tokens: Token[] = [];
	let last = 0;
	let match = TOKEN_RE.exec(code);
	while (match !== null) {
		if (match.index > last) {
			tokens.push({
				text: code.slice(last, match.index),
				kind: "plain",
				start: last,
			});
		}
		const kind: TokenKind = match[1]
			? "comment"
			: match[2]
				? "string"
				: match[3]
					? "keyword"
					: match[4]
						? "tag"
						: match[5]
							? "number"
							: "plain";
		tokens.push({ text: match[0], kind, start: match.index });
		last = match.index + match[0].length;
		match = TOKEN_RE.exec(code);
	}
	if (last < code.length) {
		tokens.push({ text: code.slice(last), kind: "plain", start: last });
	}
	return tokens;
}

interface CodeBlockProps {
	code: string;
	label?: string;
}

export function CodeBlock({
	code,
	label = "Billete · código de uso",
}: CodeBlockProps) {
	const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
	const tokens = useMemo(() => tokenize(code), [code]);

	const copy = useCallback(async () => {
		try {
			if (!navigator.clipboard) throw new Error("clipboard no disponible");
			await navigator.clipboard.writeText(code);
			setStatus("copied");
			window.setTimeout(() => setStatus("idle"), 1600);
		} catch {
			setStatus("error");
			window.setTimeout(() => setStatus("idle"), 1600);
		}
	}, [code]);

	return (
		<div className="code">
			<div className="code-head">
				<span className="code-label">{label}</span>
				<button
					type="button"
					className="copy-button"
					data-status={status}
					onClick={copy}
				>
					{status === "copied"
						? "Copiado"
						: status === "error"
							? "No se pudo"
							: "Copiar"}
				</button>
			</div>
			<pre className="code-body">
				<code>
					{tokens.map((token) => (
						<span
							key={`${token.start}-${token.kind}`}
							className={`tok tok-${token.kind}`}
						>
							{token.text}
						</span>
					))}
				</code>
			</pre>
		</div>
	);
}
