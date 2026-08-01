"use client";

import { useMemo, useState } from "react";
import { Field, SelectField, ToggleField } from "@/components/ui/Field";
import { StatRow } from "@/components/ui/StatRow";
import { SaveCalculationButton } from "@/components/calculators/SaveButton";
import { calculateLandTransferTax, formatCurrency, Province } from "@/lib/calculations";

const provinceOptions: { value: Province; label: string }[] = [
  { value: "ON", label: "Ontario (outside Toronto)" },
  { value: "ON-TORONTO", label: "Ontario — City of Toronto" },
  { value: "BC", label: "British Columbia" },
  { value: "AB", label: "Alberta" },
  { value: "SK", label: "Saskatchewan" },
  { value: "MB", label: "Manitoba" },
  { value: "QC", label: "Quebec" },
  { value: "OTHER", label: "Other province / territory" },
];

export default function LandTransferTaxCalculator() {
  const [price, setPrice] = useState("650000");
  const [province, setProvince] = useState<Province>("ON-TORONTO");
  const [firstTime, setFirstTime] = useState(true);

  const result = useMemo(
    () => calculateLandTransferTax(Number(price) || 0, province, firstTime),
    [price, province, firstTime]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="statement-card space-y-5 p-7">
        <h2 className="font-display text-lg font-semibold text-ink-900">Property details</h2>
        <Field label="Purchase price" prefix="$" value={price} onChange={setPrice} />
        <SelectField
          label="Province / municipality"
          value={province}
          onChange={(v) => setProvince(v as Province)}
          options={provinceOptions}
        />
        <ToggleField label="First-time home buyer" checked={firstTime} onChange={setFirstTime} />
      </div>

      <div className="space-y-6">
        <div className="statement-card p-7">
          <p className="eyebrow text-teal-600">Estimated land transfer tax</p>
          <p className="figure mt-2 text-4xl font-semibold text-navy-900">
            {formatCurrency(result.total)}
          </p>
          <div className="mt-6 divide-y divide-line">
            <StatRow label="Provincial tax" value={result.provincial} />
            {result.municipal > 0 && <StatRow label="Municipal tax (Toronto)" value={result.municipal} />}
            {result.rebate > 0 && <StatRow label="First-time buyer rebate" value={-result.rebate} />}
            <StatRow label="Total payable at closing" value={result.total} emphasis />
          </div>
          <div className="mt-6">
            <SaveCalculationButton
              type="Land Transfer Tax"
              label={`${formatCurrency(Number(price), 0)} in ${province}`}
              inputSummary={`Price ${formatCurrency(Number(price), 0)}, ${province}, first-time buyer: ${
                firstTime ? "yes" : "no"
              }`}
              resultSummary={`Total ${formatCurrency(result.total)}`}
            />
          </div>
        </div>

        <div className="statement-card p-7">
          <h3 className="font-display font-semibold text-ink-900">Good to know</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Toronto is the only Canadian city that levies its own municipal land transfer tax on
            top of the provincial one. First-time buyer rebates can offset some or all of the
            provincial (and in Toronto, municipal) tax — up to $4,000 provincially in Ontario,
            up to $4,475 in Toronto, and up to $8,000 in BC.
          </p>
        </div>
      </div>
    </div>
  );
}
