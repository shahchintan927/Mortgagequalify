import Link from "next/link";

const calculators = [
  {
    href: "/calculators/affordability",
    number: "01",
    title: "Affordability & Stress Test",
    text: "How much you can afford to buy — or whether a refinance qualifies — stress test, CMHC and closing costs included.",
  },
  {
    href: "/calculators/mortgage-payment",
    number: "02",
    title: "Mortgage Payment Comparison",
    text: "Compare up to three mortgage scenarios side by side, with full amortization schedules.",
  },
  {
    href: "/calculators/cmhc-insurance",
    number: "03",
    title: "CMHC Insurance",
    text: "Estimate your mortgage default insurance premium based on your down payment.",
  },
  {
    href: "/calculators/land-transfer-tax",
    number: "04",
    title: "Land Transfer Tax",
    text: "Provincial and municipal land transfer tax, including first-time buyer rebates.",
  },
  {
    href: "/calculators/closing-costs",
    number: "05",
    title: "Closing Costs",
    text: "A full estimate of legal fees, title insurance, inspection and other closing costs.",
  },
];

export default function CalculatorGrid() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-xl">
          <p className="eyebrow">Every stage of the math</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink-900 md:text-4xl">
            Five calculators, one consistent set of numbers.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {calculators.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col justify-between rounded-card border border-line bg-white p-7 transition hover:border-navy-300 hover:shadow-lg"
            >
              <div>
                <span className="figure text-xs text-ink-400">{c.number}</span>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink-900">
                  {c.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{c.text}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 group-hover:gap-2.5 transition-all">
                Calculate now →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
