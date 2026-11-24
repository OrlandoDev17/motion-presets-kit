import { useCallback, useRef, useState } from "react";

export type OptionValue = string | number | boolean | undefined;

export type OptionMap = Record<string, OptionValue>;

export interface FieldDescriptor {
	key: string;
	label: string;
	type: "select" | "number" | "toggle" | "text";
	defaultValue: OptionValue;
	choices?: readonly string[];
	min?: number;
	max?: number;
	step?: number;
	unit?: string;
	hint?: string;
	optional?: boolean;
}

export interface OptionsApi<T extends OptionMap> {
	values: T;
	set: (key: string, value: OptionValue) => void;
	reset: () => void;
	changed: boolean;
}

export function useOptions<T extends OptionMap>(defaults: T): OptionsApi<T> {
	const [values, setValues] = useState<T>(defaults);
	const defaultsRef = useRef(defaults);

	const set = useCallback((key: string, value: OptionValue) => {
		setValues((prev) => ({ ...prev, [key]: value }) as T);
	}, []);

	const reset = useCallback(() => setValues(defaultsRef.current), []);

	const changed = (Object.keys(defaults) as string[]).some(
		(key) => values[key] !== defaults[key],
	);

	return { values, set, reset, changed };
}

export function formatValue(value: OptionValue): string {
	if (value === undefined) return "—";
	if (typeof value === "boolean") return value ? "true" : "false";
	if (typeof value === "string") return value === "" ? '""' : value;
	return String(value);
}

interface OptionsPanelProps {
	fields: FieldDescriptor[];
	values: OptionMap;
	onChange: (key: string, value: OptionValue) => void;
	onReset: () => void;
	changed: boolean;
}

export function OptionsPanel({
	fields,
	values,
	onChange,
	onReset,
	changed,
}: OptionsPanelProps) {
	return (
		<div className="panel-console">
			<div className="console-head">
				<span className="console-title">Panel de control</span>
				<button
					type="button"
					className="ghost-button"
					onClick={onReset}
					disabled={!changed}
					title="Volver a los valores por defecto de la librería"
				>
					{changed ? "Volver a defaults" : "En defaults"}
				</button>
			</div>
			<div className="console-grid">
				{fields.map((field) => (
					<OptionControl
						key={field.key}
						field={field}
						value={values[field.key]}
						onChange={onChange}
					/>
				))}
			</div>
		</div>
	);
}

interface OptionControlProps {
	field: FieldDescriptor;
	value: OptionValue;
	onChange: (key: string, value: OptionValue) => void;
}

function OptionControl({ field, value, onChange }: OptionControlProps) {
	const isDefault = value === field.defaultValue;
	const controlId = `opt-${field.key}`;

	return (
		<div className={`opt ${isDefault ? "is-default" : "is-changed"}`}>
			<div className="opt-head">
				<label htmlFor={controlId} className="opt-label">
					{field.label}
				</label>
				<span
					className="opt-default"
					title={`Por defecto: ${formatValue(field.defaultValue)}`}
				>
					def.&nbsp;{formatValue(field.defaultValue)}
				</span>
			</div>
			{renderControl(field, value, onChange, controlId)}
			{field.hint ? <p className="opt-hint">{field.hint}</p> : null}
		</div>
	);
}

function renderControl(
	field: FieldDescriptor,
	value: OptionValue,
	onChange: (key: string, value: OptionValue) => void,
	controlId: string,
) {
	switch (field.type) {
		case "select":
			return (
				<select
					id={controlId}
					className="control"
					value={String(value ?? "")}
					onChange={(event) => onChange(field.key, event.target.value)}
				>
					{(field.choices ?? []).map((choice) => (
						<option key={choice} value={choice}>
							{choice}
						</option>
					))}
				</select>
			);
		case "toggle":
			return (
				<label className="switch">
					<input
						id={controlId}
						type="checkbox"
						checked={Boolean(value)}
						onChange={(event) => onChange(field.key, event.target.checked)}
					/>
					<span className="switch-track" aria-hidden="true">
						<span className="switch-thumb" />
					</span>
					<span className="switch-text">{value ? "on" : "off"}</span>
				</label>
			);
		case "text":
			return (
				<input
					id={controlId}
					className="control"
					type="text"
					value={String(value ?? "")}
					placeholder="—"
					onChange={(event) => onChange(field.key, event.target.value)}
				/>
			);
		default:
			return renderNumber(field, value, onChange, controlId);
	}
}

function renderNumber(
	field: FieldDescriptor,
	value: OptionValue,
	onChange: (key: string, value: OptionValue) => void,
	controlId: string,
) {
	const hasRange = field.min !== undefined && field.max !== undefined;
	const current = typeof value === "number" ? value : 0;

	if (field.optional) {
		const enabled = value !== undefined;
		return (
			<div className="opt-optional">
				<label className="switch">
					<input
						type="checkbox"
						checked={enabled}
						onChange={(event) =>
							onChange(
								field.key,
								event.target.checked
									? typeof field.defaultValue === "number"
										? field.defaultValue
										: 1.1
									: undefined,
							)
						}
					/>
					<span className="switch-track" aria-hidden="true">
						<span className="switch-thumb" />
					</span>
					<span className="switch-text">{enabled ? "activo" : "sin usar"}</span>
				</label>
				<div className="number-row">
					<input
						id={controlId}
						className="control"
						type="number"
						value={current}
						step={field.step ?? 0.1}
						disabled={!enabled}
						onChange={(event) =>
							onChange(field.key, Number(event.target.value))
						}
					/>
					{field.unit ? <span className="unit">{field.unit}</span> : null}
				</div>
			</div>
		);
	}

	return (
		<div className="number-row">
			{hasRange ? (
				<input
					className="slider"
					type="range"
					min={field.min}
					max={field.max}
					step={field.step ?? 1}
					value={current}
					onChange={(event) => onChange(field.key, Number(event.target.value))}
					aria-label={field.label}
				/>
			) : null}
			<input
				id={controlId}
				className="control"
				type="number"
				value={current}
				step={field.step ?? 0.1}
				onChange={(event) => onChange(field.key, Number(event.target.value))}
			/>
			{field.unit ? <span className="unit">{field.unit}</span> : null}
		</div>
	);
}
