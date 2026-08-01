"use client";

import { useMemo, useState } from "react";
import { Field } from "@/components/ui/Field";
import { StatRow } from "@/components/ui/StatRow";
import { SaveCalculationButton } from "@/components/calculators/SaveButton";
import { calculateCMHC, minimumDownPayment, formatCurrency, formatPercent } from "@/lib/calculations";

export default function CMHCCalculator() {
  const [homePrice, setHomePrice] = useState("550000");
  const [downPayment, setDownPayment] = useState("40000");

  const price = Number(homePrice) || 0;
  const down = Number(downPayment) || 0;
  const minDown = minimumDownPayment(price);
  const result = useMemo(() => calculateCMHC(price, down), [price, down]);

  const meetsMinimum = down >= minDown;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="statement-card space-y-5 p-7">
        <h2 className="font-display text-lg font-semibold text-ink-900">Purchase details</h2>
        <Field label="Home price" prefix="$" value={homePrice} onChange={setHomePrice} />
        <Field label="Down payment" prefix="$" value={downPayment} onChange={setDownPayment} />

        <div className="rounded-lg bg-paper p-4 text-sm">
          <p className="text-ink-600">
            Minimum required down payment for this price:{" "}
            <span className="figure font-semibold text-ink-900">{formatCurrency(minDown)}</span>
          </p>
          {!meetsMinimum && (
            <p className="mt-2 text-amber-600">
              Your down payment is below the federal minimum for this home price.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="statement-card p-7">
          <p className="eyebrow text-teal-600">
            {result.insurable ? "Estimated CMHC premium" : "Not insurable"}
          </p>
          <p className="figure mt-2 text-4xl font-semibold text-navy-900">
            {result.insurable ? formatCurrency(result.premium) : "—"}
          </p>
          <div className="mt-6 divide-y divide-line">
            <StatRow label="Loan amount" value={result.loanAmount} />
            <StatRow label="Loan-to-value (LTV)" value={result.ltv} isCurrency={false} />
            <StatRow
              label="Premium rate"
              value={result.premiumRate ? result.premiumRate * 100 : 0}
              isCurrency={false}
            />
            <StatRow
              label="Premium (added to loan)"
              value={result.insurable ? result.loanAmount + result.premium : result.loanAmount}
              emphasis
            />
          </div>
          {!result.insurable && (
            <p className="mt-4 text-sm text-ink-600">
              Loans with an LTV above 95%, or homes priced above $1.5M, are not eligible for
              CMHC insurance — you&apos;d need a larger down payment.
            </p>
          )}
          <div className="mt-6">
            <SaveCalculationButton
              type="CMHC Insurance"
              label={`${formatCurrency(price, 0)} home, ${formatPercent(100 - result.ltv, 1)} down`}
              inputSummary={`Price ${formatCurrency(price, 0)}, down ${formatCurrency(down, 0)}`}
              resultSummary={
                result.insurable ? `Premium ${formatCurrency(result.premium)}` : "Not insurable"
              }
            />
          </div>
        </div>

        <div className="statement-card p-7">
          <h3 className="font-display font-semibold text-ink-900">Premium rate tiers</h3>
          <div className="mt-3 divide-y divide-line text-sm">
            {[
              ["Up to 65% LTV", "0.60%"],
              ["65.01% – 75%", "1.70%"],
              ["75.01% – 80%", "2.40%"],
              ["80.01% – 85%", "2.80%"],
              ["85.01% – 90%", "3.10%"],
              ["90.01% – 95%", "4.00%"],
            ].map(([tier, r]) => (
              <div key={tier} className="statement-row">
                <span className="text-ink-600">{tier}</span>
                <span className="figure text-ink-900">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
