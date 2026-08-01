"use client";

import { useMemo, useState } from "react";
import { Field, SelectField, ToggleField } from "@/components/ui/Field";
import { SaveCalculationButton } from "@/components/calculators/SaveButton";
import {
  calculateAffordability,
  calculateStressTest,
  estimateClosingCosts,
  formatCurrency,
  formatPercent,
  DownPaymentMode,
  PropertyUse,
  Province,
  MAX_INSURABLE_PRICE,
} from "@/lib/calculations";

type Mode = "purchase" | "refinance";

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

export default function AffordabilityCalculator() {
  const [mode, setMode] = useState<Mode>("purchase");

  const [income, setIncome] = useState("110000");
  const [debts, setDebts] = useState("400");
  const [downPayment, setDownPayment] = useState("80000");
  const [downPaymentMode, setDownPaymentMode] = useState<DownPaymentMode>("insured");
  const [propertyUse, setPropertyUse] = useState<PropertyUse>("principal");
  const [mortgageAmount, setMortgageAmount] = useState("450000");
  const [rate, setRate] = useState("4.79");
  const [amortization, setAmortization] = useState("25");
  const [propertyTaxMonthly, setPropertyTaxMonthly] = useState("350");
  const [heatingMonthly, setHeatingMonthly] = useState("120");
  const [condoFees, setCondoFees] = useState("0");
  const [province, setProvince] = useState<Province>("ON-TORONTO");
  const [firstTime, setFirstTime] = useState(true);
  const [showMath, setShowMath] = useState(false);

  const affordability = useMemo(
    () =>
      calculateAffordability({
        grossAnnualIncome: Number(income) || 0,
        monthlyDebts: Number(debts) || 0,
        downPayment: Number(downPayment) || 0,
        downPaymentMode,
        propertyUse,
        contractRatePct: Number(rate) || 0,
        amortizationYears: Number(amortization) || 25,
        propertyTaxMonthly: Number(propertyTaxMonthly) || 0,
        heatingMonthly: Number(heatingMonthly) || 0,
        condoFeesMonthly: Number(condoFees) || 0,
      }),
    [income, debts, downPayment, downPaymentMode, propertyUse, rate, amortization, propertyTaxMonthly, heatingMonthly, condoFees]
  );

  const refinanceCheck = useMemo(
    () =>
      calculateStressTest({
        grossAnnualIncome: Number(income) || 0,
        monthlyDebts: Number(debts) || 0,
        homePrice: Number(mortgageAmount) || 0,
        downPayment: 0,
        contractRatePct: Number(rate) || 0,
        amortizationYears: Number(amortization) || 25,
        propertyTaxMonthly: Number(propertyTaxMonthly) || 0,
        heatingMonthly: Number(heatingMonthly) || 0,
        condoFeesMonthly: Number(condoFees) || 0,
        propertyUse,
      }),
    [income, debts, mortgageAmount, rate, amortization, propertyTaxMonthly, heatingMonthly, condoFees, propertyUse]
  );

  const closingCosts = useMemo(
    () =>
      mode === "purchase"
        ? estimateClosingCosts({
            homePrice: affordability.maxHomePrice,
            province,
            cmhcPremium: affordability.cmhcPremium,
            includeCmhcTax: affordability.usingInsurance,
            firstTimeBuyer: firstTime,
          })
        : null,
    [mode, affordability, province, firstTime]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-lg border border-line bg-white p-1">
          {(["purchase", "refinance"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-5 py-2 text-sm font-semibold transition ${
                mode === m ? "bg-navy-900 text-white" : "text-ink-600 hover:text-ink-900"
              }`}
            >
              {m === "purchase" ? "Buying a home" : "Refinancing"}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-lg border border-line bg-white p-1">
          {(["principal", "rental"] as PropertyUse[]).map((p) => (
            <button
              key={p}
              onClick={() => setPropertyUse(p)}
              className={`rounded-md px-4 py-2 text-xs font-semibold transition ${
                propertyUse === p ? "bg-navy-50 text-navy-900" : "text-ink-500 hover:text-ink-900"
              }`}
            >
              {p === "principal" ? "Principal residence" : "Rental / investment"}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-6 ${mode === "purchase" ? "lg:grid-cols-[1fr_0.9fr_1.1fr]" : "lg:grid-cols-2"}`}>
        {/* Your financial picture */}
        <div className="statement-card space-y-5 p-7">
          <h2 className="font-display text-lg font-semibold text-ink-900">Your financial picture</h2>
          <Field label="Gross annual household income" prefix="$" value={income} onChange={setIncome} />
          <Field label="Other monthly debt payments" prefix="$" value={debts} onChange={setDebts} />

          {mode === "purchase" ? (
            <>
              <Field label="Available down payment" prefix="$" value={downPayment} onChange={setDownPayment} />
              <div>
                <span className="text-sm font-medium text-ink-700">Down payment size</span>
                <div className="mt-1.5 inline-flex w-full rounded-lg border border-line bg-white p-1">
                  {(
                    [
                      { value: "insured", label: "Less than 20%" },
                      { value: "conventional", label: "20% or more" },
                    ] as { value: DownPaymentMode; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDownPaymentMode(opt.value)}
                      className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition ${
                        downPaymentMode === opt.value
                          ? "bg-navy-900 text-white"
                          : "text-ink-600 hover:text-ink-900"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Field label="Mortgage amount" prefix="$" value={mortgageAmount} onChange={setMortgageAmount} />
          )}

          <Field label="Interest rate" suffix="%" step="0.01" value={rate} onChange={setRate} />
          <Field label="Amortization" suffix="years" value={amortization} onChange={setAmortization} />

          <div className="grid grid-cols-3 gap-3">
            <Field label="Property tax / mo" prefix="$" value={propertyTaxMonthly} onChange={setPropertyTaxMonthly} />
            <Field label="Heating / mo" prefix="$" value={heatingMonthly} onChange={setHeatingMonthly} />
            <Field label="Condo fees / mo" prefix="$" value={condoFees} onChange={setCondoFees} />
          </div>

          {mode === "purchase" && (
            <>
              <SelectField
                label="Province / municipality"
                value={province}
                onChange={(v) => setProvince(v as Province)}
                options={provinceOptions}
              />
              <ToggleField label="First-time home buyer" checked={firstTime} onChange={setFirstTime} />
            </>
          )}
        </div>

        {/* Closing costs — purchase mode only */}
        {mode === "purchase" && closingCosts && (
          <div className="statement-card p-7">
            <h2 className="font-display text-lg font-semibold text-ink-900">Estimated closing costs</h2>
            <p className="mt-1 text-xs text-ink-400">Based on your estimated affordable price, below.</p>

            <p className="figure mt-4 text-2xl font-semibold text-navy-900">
              {formatCurrency(closingCosts.total)}
            </p>

            <div className="mt-4 divide-y divide-line text-sm">
              {closingCosts.items.map((item) => {
                if (item.label === "Land transfer tax") {
                  return (
                    <div key={item.label} className="statement-row flex-col items-start gap-1">
                      <div className="flex w-full items-baseline justify-between">
                        <span className="text-ink-600">Land transfer tax</span>
                        <span className="figure text-ink-900">{formatCurrency(item.amount)}</span>
                      </div>
                      {firstTime && closingCosts.landTransferTax.rebate > 0 && (
                        <span className="text-xs text-teal-600">
                          First-time buyer rebate applied — saved{" "}
                          {formatCurrency(closingCosts.landTransferTax.rebate)}
                        </span>
                      )}
                    </div>
                  );
                }
                return (
                  <div key={item.label} className="statement-row">
                    <span className="text-ink-600">{item.label}</span>
                    <span className="figure text-ink-900">{formatCurrency(item.amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="statement-card p-7">
          {mode === "purchase" ? (
            <>
              <p className="eyebrow text-teal-600">Estimated affordable price</p>
              <p className="figure mt-2 text-4xl font-bold text-navy-900 md:text-5xl">
                {formatCurrency(affordability.maxHomePrice, 0)}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-paper p-4">
                  <p className="text-xs text-ink-400">Total loan amount</p>
                  <p className="figure mt-1 text-2xl font-bold text-navy-900 md:text-3xl">
                    {formatCurrency(affordability.totalLoan, 0)}
                  </p>
                </div>
                <div className="rounded-lg bg-paper p-4">
                  <p className="text-xs text-ink-400">Monthly mortgage payment</p>
                  <p className="figure mt-1 text-2xl font-bold text-navy-900 md:text-3xl">
                    {formatCurrency(affordability.monthlyPayment, 0)}
                  </p>
                </div>
              </div>

              {downPaymentMode === "insured" ? (
                affordability.usingInsurance && (
                  <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
                    <p className="text-ink-700">
                      Down payment is under 20%, so CMHC insurance applies at{" "}
                      {formatPercent(affordability.ltv, 1)} LTV.
                    </p>
                    <p className="figure mt-1 font-semibold text-navy-900">
                      Premium: {formatCurrency(affordability.cmhcPremium)} (added to your loan
                      amount above)
                    </p>
                  </div>
                )
              ) : (
                <div className="mt-5 rounded-lg border border-teal-600/30 bg-teal-600/5 p-4 text-sm text-teal-700">
                  20%+ down payment selected — no mortgage default insurance required.
                </div>
              )}

              {affordability.cappedByPriceLimit && (
                <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-700">
                  Capped at {formatCurrency(MAX_INSURABLE_PRICE, 0)} — CMHC insurance isn&apos;t available
                  above this price. Your income could support more, but you&apos;d need at least
                  20% down to go higher.
                </div>
              )}
              {affordability.cappedByDownPayment && !affordability.cappedByPriceLimit && (
                <div className="mt-3 rounded-lg border border-line bg-paper p-4 text-sm text-ink-600">
                  {downPaymentMode === "insured"
                    ? "Your down payment — not your income — is the limiting factor here, under the minimum down payment rule for this price range."
                    : "Your down payment sets the ceiling here: at 20% down, this is the largest price it supports, even though your income could qualify for more."}
                </div>
              )}

              <button
                onClick={() => setShowMath(!showMath)}
                className="mt-6 text-xs font-semibold text-navy-700 hover:text-navy-900"
              >
                {showMath ? "Hide the math ▲" : "How we calculated this ▼"}
              </button>
              {showMath && (
                <div className="mt-3 space-y-2 rounded-lg bg-paper p-4 text-sm">
                  <div className="statement-row">
                    <span className="text-ink-600">Stress-test qualifying rate</span>
                    <span className="figure text-ink-900">{formatPercent(affordability.qRate, 2)}</span>
                  </div>
                  <div className="statement-row">
                    <span className="text-ink-600">GDS ratio (limit 39%)</span>
                    <span className="figure text-ink-900">{formatPercent(affordability.gdsRatio, 1)}</span>
                  </div>
                  <div className="statement-row">
                    <span className="text-ink-600">
                      TDS ratio (limit {affordability.tdsLimit}% — {downPaymentMode === "insured" ? "insured mortgage" : propertyUse === "rental" ? "conventional, rental" : "conventional, principal residence"})
                    </span>
                    <span className="figure text-ink-900">{formatPercent(affordability.tdsRatio, 1)}</span>
                  </div>
                  <div className="statement-row">
                    <span className="text-ink-600">Binding constraint</span>
                    <span className="figure font-semibold text-navy-900">{affordability.bindingConstraint}</span>
                  </div>
                  <p className="pt-2 text-xs text-ink-500">
                    Whichever ratio is more restrictive sets your ceiling — changes to debts or
                    costs only move the result once they make that ratio the binding one.
                  </p>
                </div>
              )}

              <div className="mt-6">
                <SaveCalculationButton
                  type="Affordability"
                  label={`Income ${formatCurrency(Number(income), 0)}`}
                  inputSummary={`Income ${formatCurrency(Number(income), 0)}, debts $${debts}/mo, down ${formatCurrency(
                    Number(downPayment),
                    0
                  )} (${downPaymentMode === "insured" ? "<20%" : "20%+"})`}
                  resultSummary={`Max price ${formatCurrency(affordability.maxHomePrice, 0)}`}
                />
              </div>
            </>
          ) : (
            <>
              <p className={`eyebrow ${refinanceCheck.passes ? "text-teal-600" : "text-amber-600"}`}>
                {refinanceCheck.passes ? "Likely to qualify" : "Likely would not qualify"}
              </p>
              <p className="figure mt-2 text-4xl font-bold text-navy-900 md:text-5xl">
                {formatCurrency(Number(mortgageAmount) || 0, 0)}
              </p>
              <p className="mt-1 text-sm text-ink-500">Requested mortgage amount</p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-paper p-4">
                  <p className="text-xs text-ink-400">Qualifying monthly payment</p>
                  <p className="figure mt-1 text-2xl font-bold text-navy-900 md:text-3xl">
                    {formatCurrency(refinanceCheck.qualifyingPayment, 0)}
                  </p>
                </div>
                <div className="rounded-lg bg-paper p-4">
                  <p className="text-xs text-ink-400">Qualifying rate</p>
                  <p className="figure mt-1 text-2xl font-bold text-navy-900 md:text-3xl">
                    {formatPercent(refinanceCheck.qRate, 2)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowMath(!showMath)}
                className="mt-6 text-xs font-semibold text-navy-700 hover:text-navy-900"
              >
                {showMath ? "Hide the math ▲" : "How we calculated this ▼"}
              </button>
              {showMath && (
                <div className="mt-3 space-y-2 rounded-lg bg-paper p-4 text-sm">
                  <div className="statement-row">
                    <span className="text-ink-600">GDS ratio (limit 39%)</span>
                    <span className="figure text-ink-900">{formatPercent(refinanceCheck.gdsRatio, 1)}</span>
                  </div>
                  <div className="statement-row">
                    <span className="text-ink-600">
                      TDS ratio (limit {refinanceCheck.tdsLimit}% — refinances aren&apos;t CMHC-insurable, so this uses the conventional {propertyUse === "rental" ? "rental" : "principal residence"} limit)
                    </span>
                    <span className="figure text-ink-900">{formatPercent(refinanceCheck.tdsRatio, 1)}</span>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <SaveCalculationButton
                  type="Refinance"
                  label={`${formatCurrency(Number(mortgageAmount), 0)} refinance`}
                  inputSummary={`Income ${formatCurrency(Number(income), 0)}, mortgage ${formatCurrency(
                    Number(mortgageAmount),
                    0
                  )}`}
                  resultSummary={refinanceCheck.passes ? "Likely to qualify" : "Likely would not qualify"}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
