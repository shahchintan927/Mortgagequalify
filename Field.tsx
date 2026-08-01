"use client";

interface FieldProps {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  type?: string;
  step?: string;
  hint?: string;
}

export function Field({ label, value, onChange, prefix, suffix, type = "number", step, hint }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-700">{label}</span>
      <div className="mt-1.5 flex items-center overflow-hidden rounded-lg border border-line bg-white focus-within:border-navy-500">
        {prefix && <span className="pl-3 text-sm text-ink-400">{prefix}</span>}
        <input
          type={type}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-2.5 font-mono text-sm text-ink-900 outline-none"
        />
        {suffix && <span className="pr-3 text-sm text-ink-400">{suffix}</span>}
      </div>
      {hint && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-navy-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-line bg-white px-3 py-2.5">
      <span className="text-sm font-medium text-ink-700">{label}</span>
      <span
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-navy-700" : "bg-line"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </label>
  );
}
