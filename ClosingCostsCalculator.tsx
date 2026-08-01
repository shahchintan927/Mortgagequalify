"use client";

import { useMemo, useState } from "react";
import { Field, SelectField, ToggleField } from "@/components/ui/Field";
import { SaveCalculationButton } from "@/components/calculators/SaveButton";
import {
  calculateCMHC,
  estimateClosingCosts,
  formatCurrency,
  Province,
} from "@/lib/calculations";

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

export default function ClosingCostsCalculator() {
  const [price, setPrice] = useState("650000");
  const [downPayment, setDownPayment] = useState("130000");
  const [province, setProvince] = useState<Province>("ON-TORONTO");
  const [isInsured, setIsInsured] = useState(false);

  const cmhc = useMemo(
    () => calculateCMHC(Number(price) || 0, Number(downPayment) || 0),
    [price, downPayment]
  );

  const result = useMemo(
    () =>
      estimateClosingCosts({
        homePrice: Number(price) || 0,
        province,
        cmhcPremium: isInsured && cmhc.insurable ? cmhc.premium : 0,
        includeCmhcTax: isInsured && cmhc.insurable,
      }),
    [price, province, isInsured, cmhc]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="statement-card space-y-5 p-7">
        <h2 className="font-display text-lg font-semibold text-ink-900">Purchase details</h2>
        <Field label="Purchase price" prefix="$" value={price} onChange={setPrice} />
        <Field label="Down payment" prefix="$" value={downPayment} onChange={setDownPayment} />
        <SelectField
          label="Province / municipality"
          value={province}
          onChange={(v) => setProvince(v as Province)}
          options={provinceOptions}
        />
        <ToggleField
          label="Mortgage is CMHC insured (< 20% down)"
          checked={isInsured}
          onChange={setIsInsured}
        />
      </div>

      <div className="space-y-6">
        <div className="statement-card p-7">
          <p className="eyebrow text-teal-600">Estimated total closing costs</p>
          <p className="figure mt-2 text-4xl font-semibold text-navy-900">
            {formatCurrency(result.total)}
          </p>
          <p className="mt-1 text-xs text-ink-400">
            {((result.total / (Number(price) || 1)) * 100).toFixed(1)}% of purchase price
          </p>

          <div className="mt-6 divide-y divide-line">
            {result.items.map((item) => (
              <div key={item.label} className="statement-row">
                <span className="text-sm text-ink-600">{item.label}</span>
                <span className="figure text-sm text-ink-900">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <SaveCalculationButton
              type="Closing Costs"
              label={`${formatCurrency(Number(price), 0)} in ${province}`}
              inputSummary={`Price ${formatCurrency(Number(price), 0)}, ${province}`}
              resultSummary={`Est. total ${formatCurrency(result.total)}`}
            />
          </div>
        </div>

        <div className="statement-card p-7">
          <h3 className="font-display font-semibold text-ink-900">Rule of thumb</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Budget 1.5%–4% of your purchase price for closing costs, on top of your down
            payment. Land transfer tax is usually the largest single line item — use the land
            transfer tax calculator to model it precisely for your city.
          </p>
        </div>
      </div>
    </div>
  );
}
