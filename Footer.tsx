import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const columns = [
  {
    title: "Calculators",
    links: [
      { href: "/calculators/affordability", label: "Affordability & Stress Test" },
      { href: "/calculators/mortgage-payment", label: "Payment Comparison" },
      { href: "/calculators/cmhc-insurance", label: "CMHC Insurance" },
      { href: "/calculators/land-transfer-tax", label: "Land Transfer Tax" },
      { href: "/calculators/closing-costs", label: "Closing Costs" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/learning", label: "Learning Centre" },
      { href: "/blog", label: "Blog" },
      { href: "/about", label: "About us" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Create an account" },
      { href: "/dashboard", label: "My dashboard" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white no-print">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Canada&apos;s independent mortgage planning platform — calculators,
              guidance and tools to help you buy with confidence.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-white/50">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/75 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} MortgageVerse. All rights reserved.</p>
          <p className="max-w-2xl">
            MortgageVerse is not a mortgage lender or broker. All calculators
            provide estimates for planning purposes only and do not
            constitute financial advice or a loan commitment.
          </p>
        </div>
      </div>
    </footer>
  );
}
