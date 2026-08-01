"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, SelectField } from "@/components/ui/Field";
import { PaymentBreakdownChart } from "@/components/calculators/PaymentBreakdownChart";
import { MultiScenarioBalanceChart } from "@/components/calculators/MultiScenarioBalanceChart";
import { useAuth } from "@/lib/auth";
import { hasUsedFreeAction, markFreeActionUsed } from "@/lib/freeTrial";
import {
  calculatePayment,
  buildAmortizationSchedule,
  buildAnnualSummary,
  calculatePayoffSavings,
  formatCurrency,
  Frequency,
} from "@/lib/calculations";

const freqLabels: Record<Frequency, string> = {
  monthly: "Monthly",
  biweekly: "Biweekly",
  "accelerated-biweekly": "Accelerated biweekly",
  weekly: "Weekly",
};
const paymentsPerYear: Record<Frequency, number> = {
  monthly: 12,
  biweekly: 26,
  "accelerated-biweekly": 26,
  weekly: 52,
};
const SCENARIO_COLORS = ["#1B3A6B", "#12A876", "#DE9A34"];

interface ScenarioInput {
  id: string;
  label: string;
  mortgageAmount: string;
  rate: string;
  amortization: string;
  frequency: Frequency;
}

function newScenario(index: number): ScenarioInput {
  return {
    id: `s-${Date.now()}-${index}`,
    label: `Scenario ${index}`,
    mortgageAmount: "500000",
    rate: "4.79",
    amortization: "25",
    frequency: "monthly",
  };
}

export default function MortgagePaymentComparison() {
  const { user, saveCalculation } = useAuth();
  const router = useRouter();

  const [scenarios, setScenarios] = useState<ScenarioInput[]>([
    { ...newScenario(1), rate: "4.79", frequency: "monthly" },
    { ...newScenario(2), rate: "5.29", frequency: "accelerated-biweekly" },
  ]);
  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null);
  const [gateMessage, setGateMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function updateScenario(id: string, patch: Partial<ScenarioInput>) {
    setScenarios((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function addScenario() {
    if (scenarios.length >= 3) return;
    setScenarios((prev) => [...prev, newScenario(prev.length + 1)]);
  }

  function removeScenario(id: string) {
    if (scenarios.length <= 1) return;
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  }

  const results = useMemo(
    () =>
      scenarios.map((s) => {
        const principal = Number(s.mortgageAmount) || 0;
        const rate = Number(s.rate) || 0;
        const years = Number(s.amortization) || 1;
        const payment = calculatePayment(principal, rate, years, s.frequency);
        const schedule = buildAmortizationSchedule(principal, rate, years, s.frequency);
        const totalPaid = schedule.reduce((sum, r) => sum + r.payment, 0);
        const totalInterest = schedule.reduce((sum, r) => sum + r.interest, 0);
        const annual = buildAnnualSummary(schedule, paymentsPerYear[s.frequency]);
        const payoff =
          s.frequency === "accelerated-biweekly"
            ? calculatePayoffSavings(principal, rate, years, s.frequency)
            : null;
        return { scenario: s, principal, payment, schedule, annual, totalPaid, totalInterest, payoff };
      }),
    [scenarios]
  );

  function handlePrintComparison() {
    if (!user) {
      if (hasUsedFreeAction("print-comparison")) {
        setGateMessage(
          "You've used your free print. Create a free account to print unlimited comparisons."
        );
        return;
      }
      markFreeActionUsed("print-comparison");
    }
    setGateMessage(null);
    window.print();
  }

  function handlePrintSchedule(scenarioId: string) {
    if (!user) {
      if (hasUsedFreeAction("print-schedule")) {
        setGateMessage(
          "You've used your free amortization schedule. Create a free account to unlock unlimited schedules."
        );
        return;
      }
      markFreeActionUsed("print-schedule");
    }
    setExpandedSchedule(scenarioId);
    setGateMessage(null);
    setTimeout(() => window.print(), 50);
  }

  function handleSave() {
    if (!user) return;
    const payload = JSON.stringify(
      results.map((r) => ({
        label: r.scenario.label,
        mortgageAmount: r.principal,
        rate: r.scenario.rate,
        amortization: r.scenario.amortization,
        frequency: r.scenario.frequency,
        payment: r.payment,
        totalPaid: r.totalPaid,
        totalInterest: r.totalInterest,
      }))
    );
    saveCalculation({
      type: "Payment Comparison",
      label: `${results.length} scenario${results.length > 1 ? "s" : ""} compared`,
      inputSummary: results
        .map((r) => `${r.scenario.label}: ${formatCurrency(r.principal, 0)} @ ${r.scenario.rate}%`)
        .join(" · "),
      resultSummary: results.map((r) => formatCurrency(r.payment)).join(" vs "),
      payload,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-8">
      {/* Scenario inputs */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((s, i) => (
          <div key={s.id} className="statement-card space-y-4 p-6">
            <div className="flex items-center justify-between">
              <input
                value={s.label}
                onChange={(e) => updateScenario(s.id, { label: e.target.value })}
                className="w-2/3 border-b border-transparent bg-transparent font-display text-lg font-semibold text-ink-900 outline-none focus:border-navy-500"
              />
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: SCENARIO_COLORS[i % SCENARIO_COLORS.length] }}
              />
              {scenarios.length > 1 && (
                <button
                  onClick={() => removeScenario(s.id)}
                  className="text-xs font-medium text-ink-400 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            <Field
              label="Mortgage amount"
              prefix="$"
              value={s.mortgageAmount}
              onChange={(v) => updateScenario(s.id, { mortgageAmount: v })}
            />
            <Field
              label="Interest rate"
              suffix="%"
              step="0.01"
              value={s.rate}
              onChange={(v) => updateScenario(s.id, { rate: v })}
            />
            <Field
              label="Amortization"
              suffix="years"
              value={s.amortization}
              onChange={(v) => updateScenario(s.id, { amortization: v })}
            />
            <SelectField
              label="Payment frequency"
              value={s.frequency}
              onChange={(v) => updateScenario(s.id, { frequency: v as Frequency })}
              options={Object.entries(freqLabels).map(([value, label]) => ({ value, label }))}
            />
          </div>
        ))}

        {scenarios.length < 3 && (
          <button
            onClick={addScenario}
            className="flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-line text-ink-400 hover:border-navy-300 hover:text-navy-700"
          >
            <span className="text-2xl">+</span>
            <span className="text-sm font-medium">Add a scenario to compare</span>
          </button>
        )}
      </div>

      {/* Comparison table */}
      <div className="statement-card overflow-x-auto p-7">
        <h2 className="font-display text-lg font-semibold text-ink-900">Side-by-side comparison</h2>
        <table className="mt-4 w-full min-w-[480px] text-sm">
          <thead>
            <tr className="text-left text-xs text-ink-400">
              <th className="py-2 pr-4 font-medium">Scenario</th>
              <th className="py-2 pr-4 font-medium">Payment</th>
              <th className="py-2 pr-4 font-medium">Total interest</th>
              <th className="py-2 pr-4 font-medium">Total paid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {results.map((r, i) => (
              <tr key={r.scenario.id}>
                <td className="py-3 pr-4">
                  <span
                    className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle"
                    style={{ backgroundColor: SCENARIO_COLORS[i % SCENARIO_COLORS.length] }}
                  />
                  <span className="font-medium text-ink-900">{r.scenario.label}</span>
                </td>
                <td className="figure py-3 pr-4 text-base font-bold text-navy-900">
                  {formatCurrency(r.payment)}
                  <span className="ml-1 text-xs font-normal text-ink-400">
                    /{freqLabels[r.scenario.frequency].toLowerCase()}
                  </span>
                </td>
                <td className="figure py-3 pr-4 text-ink-900">{formatCurrency(r.totalInterest)}</td>
                <td className="figure py-3 pr-4 text-ink-900">{formatCurrency(r.totalPaid)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Early payoff callouts */}
      {results.some((r) => r.payoff) && (
        <div className="grid gap-4 md:grid-cols-2">
          {results
            .filter((r) => r.payoff)
            .map((r) => (
              <div key={r.scenario.id} className="rounded-card border border-teal-600/30 bg-teal-600/5 p-6">
                <p className="text-sm font-semibold text-teal-700">
                  {r.scenario.label} — accelerated biweekly
                </p>
                <p className="mt-1 text-sm text-ink-700">
                  Paying accelerated biweekly pays this mortgage off{" "}
                  <span className="font-semibold">{r.payoff!.yearsSaved.toFixed(1)} years earlier</span>{" "}
                  than monthly, saving{" "}
                  <span className="figure font-semibold text-teal-700">
                    {formatCurrency(r.payoff!.interestSaved)}
                  </span>{" "}
                  in interest.
                </p>
              </div>
            ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="statement-card space-y-6 p-7">
          <h3 className="font-display font-semibold text-ink-900">Principal vs. interest</h3>
          {results.map((r) => (
            <div key={r.scenario.id}>
              <p className="text-xs font-medium text-ink-500">{r.scenario.label}</p>
              <PaymentBreakdownChart principal={r.principal} interest={r.totalInterest} />
            </div>
          ))}
        </div>
        <div className="statement-card p-7">
          <h3 className="font-display font-semibold text-ink-900">Remaining balance over time</h3>
          <MultiScenarioBalanceChart
            scenarios={results.map((r) => ({
              label: r.scenario.label,
              rows: r.schedule,
              paymentsPerYear: paymentsPerYear[r.scenario.frequency],
              startingBalance: r.principal,
            }))}
          />
        </div>
      </div>

      {/* Amortization schedules */}
      <div className="space-y-4">
        {results.map((r) => (
          <div key={r.scenario.id} className="statement-card p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display font-semibold text-ink-900">
                {r.scenario.label} — amortization schedule
              </h3>
              <button
                onClick={() => handlePrintSchedule(r.scenario.id)}
                className="no-print rounded-lg border border-line px-4 py-2 text-xs font-semibold text-ink-700 hover:bg-paper"
              >
                {user ? "Print schedule" : "Create schedule & print (1 free)"}
              </button>
            </div>

            {expandedSchedule === r.scenario.id && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="text-left text-xs text-ink-400">
                      <th className="py-2 pr-4 font-medium">Year</th>
                      <th className="py-2 pr-4 font-medium">Payments</th>
                      <th className="py-2 pr-4 font-medium">Interest</th>
                      <th className="py-2 pr-4 font-medium">Principal</th>
                      <th className="py-2 pr-4 font-medium">Ending balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {r.annual.map((row) => (
                      <tr key={row.year}>
                        <td className="py-2 pr-4 text-ink-700">{row.year}</td>
                        <td className="figure py-2 pr-4 text-ink-900">{formatCurrency(row.totalPayments)}</td>
                        <td className="figure py-2 pr-4 text-ink-900">{formatCurrency(row.totalInterest)}</td>
                        <td className="figure py-2 pr-4 text-ink-900">{formatCurrency(row.totalPrincipal)}</td>
                        <td className="figure py-2 pr-4 text-ink-900">{formatCurrency(row.endingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="no-print statement-card flex flex-wrap items-center gap-4 p-6">
        <button
          onClick={handlePrintComparison}
          className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
        >
          {user ? "Print comparison" : "Print comparison (1 free)"}
        </button>

        {user ? (
          <button
            onClick={handleSave}
            className="rounded-lg border border-navy-700 px-5 py-2.5 text-sm font-semibold text-navy-700 hover:bg-navy-700 hover:text-white"
          >
            {saved ? "Saved to your dashboard ✓" : "Save this comparison"}
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="text-sm font-medium text-navy-700 hover:text-navy-900"
          >
            Log in to save this comparison →
          </button>
        )}

        {gateMessage && (
          <p className="w-full text-sm text-amber-700">
            {gateMessage}{" "}
            <a href="/signup" className="font-semibold underline">
              Create a free account
            </a>
          </p>
        )}
      </div>

      <p className="no-print text-xs text-ink-400">
        Printing and amortization exports are a one-time free preview for
        visitors who aren&apos;t logged in — this is a front-end nudge, not a
        hard security limit. Create a free account for unlimited use, and to
        save comparisons to your dashboard.
      </p>
    </div>
  );
}
