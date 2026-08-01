import { formatCurrency } from "@/lib/calculations";

export function StatRow({
  label,
  value,
  emphasis,
  isCurrency = true,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
  isCurrency?: boolean;
}) {
  return (
    <div className="statement-row">
      <span className={`text-sm ${emphasis ? "font-semibold text-ink-900" : "text-ink-600"}`}>
        {label}
      </span>
      <span className={`figure ${emphasis ? "text-lg font-semibold text-navy-800" : "text-sm text-ink-900"}`}>
        {isCurrency ? formatCurrency(value, value < 1000 ? 2 : 0) : value.toFixed(2)}
      </span>
    </div>
  );
}
