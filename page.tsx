import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description: "MortgageVerse is an independent Canadian mortgage planning platform.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Numbers first",
    text: "Every calculator is built from the actual formulas lenders and CMHC use — not rounded rules of thumb.",
  },
  {
    title: "No pressure",
    text: "We don't sell mortgages or take referral fees for recommending a product. You can use every calculator without an account.",
  },
  {
    title: "Plain language",
    text: "The learning centre exists because the math only helps if you understand what it means for your decision.",
  },
];

export default function Page() {
  return (
    <>
      <Navbar />
      <PageHeader
        eyebrow="About"
        title="An independent set of tools, built for buyers."
        description="MortgageVerse is not a lender or brokerage. We build calculators and guides — the decision is still yours."
      />
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-card border border-line p-6">
              <h2 className="font-display text-lg font-semibold text-ink-900">{v.title}</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 space-y-5 border-t border-line pt-12 text-[17px] leading-relaxed text-ink-700">
          <p>
            MortgageVerse started as a simple observation: most mortgage calculators online are
            built to generate leads for a specific lender or broker, which means the assumptions
            baked into them are rarely neutral. We built our calculators using the same public
            CMHC premium tiers, stress-test rules, and provincial land transfer tax brackets that
            lenders themselves use — with the sources cited, and the caveats included.
          </p>
          <p>
            We&apos;ll always tell you when a figure is an estimate rather than a precise
            calculation, and we&apos;ll never hide a number to make a scenario look better than
            it is.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
