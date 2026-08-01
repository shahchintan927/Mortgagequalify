"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { calculatePayment, formatCurrency } from "@/lib/calculations";

export default function Hero() {
  const [price, setPrice] = useState(650000);
  const [down, setDown] = useState(130000);
  const [rate, setRate] = useState(4.79);

  const monthly = useMemo(() => {
    const principal = Math.max(price - down, 0);
    return calculatePayment(principal, rate, 25, "monthly");
  }, [price, down, rate]);

  return (
    <section className="relative overflow-hidden bg-navy-950 pt-36 pb-24 text-white">
      <div className="pointer-events-none absolute inset-0 bg-ledger-lines opacity-60" />
      <div className="pointer-events-none absolute -right-32 top-24 h-96 w-96 rounded-full bg-teal-600/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="eyebrow text-teal-500">Canadian mortgage tools, built to be trusted</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
            Know your numbers before you sign anything.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/65">
            Five calculators, real Canadian rules, and a learning centre that
            explains the &quot;why&quot; — so every offer you make is one you
            actually understand.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/calculators/affordability"
              className="rounded-lg bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-teal-500"
            >
              Start calculating
            </Link>
            <Link
              href="/learning"
              className="rounded-lg border border-white/25 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Explore the learning centre
            </Link>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            <div>
              <dt className="text-xs text-white/45">Calculators</dt>
              <dd className="mt-1 text-2xl font-semibold font-mono">05</dd>
            </div>
            <div>
              <dt className="text-xs text-white/45">Guides &amp; articles</dt>
              <dd className="mt-1 text-2xl font-semibold font-mono">40+</dd>
            </div>
            <div>
              <dt className="text-xs text-white/45">Provinces covered</dt>
              <dd className="mt-1 text-2xl font-semibold font-mono">All</dd>
            </div>
          </dl>
        </div>

        <div className="statement-card bg-white p-7 text-ink-900">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Estimated payment</h2>
            <span className="eyebrow text-teal-600">Live preview</span>
          </div>

          <div className="mt-6 space-y-5">
            <RangeField
              label="Home price"
              value={price}
              onChange={setPrice}
              min={150000}
              max={2000000}
              step={5000}
              format={(v) => formatCurrency(v)}
            />
            <RangeField
              label="Down payment"
              value={down}
              onChange={setDown}
              min={0}
              max={price}
              step={5000}
              format={(v) => formatCurrency(v)}
            />
            <RangeField
              label="Interest rate"
              value={rate}
              onChange={setRate}
              min={2}
              max={8}
              step={0.01}
              format={(v) => `${v.toFixed(2)}%`}
            />
          </div>

          <div className="mt-7 rounded-xl bg-navy-950 p-6 text-white">
            <p className="text-xs text-white/50">Estimated monthly payment · 25-yr amortization</p>
            <p className="figure mt-1 text-4xl font-semibold text-teal-500">
              {formatCurrency(monthly, 0)}
            </p>
          </div>

          <Link
            href="/calculators/mortgage-payment"
            className="mt-4 block text-center text-sm font-medium text-navy-700 hover:text-navy-900"
          >
            Get the full breakdown →
          </Link>
        </div>
      </div>
    </section>
  );
}

function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-600">{label}</span>
        <span className="figure font-semibold text-ink-900">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-navy-700"
      />
    </div>
  );
}
