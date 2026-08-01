import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-paper py-24">
      <div className="mx-auto max-w-5xl rounded-card bg-navy-900 px-10 py-16 text-center text-white">
        <h2 className="text-3xl font-semibold md:text-4xl">
          Create a free account to save your numbers.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/65">
          Track every calculation across sessions, revisit them from any
          device, and pick up your mortgage planning right where you left off.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-teal-600 px-6 py-3.5 text-sm font-semibold hover:bg-teal-500"
          >
            Create free account
          </Link>
          <Link
            href="/calculators/mortgage-payment"
            className="rounded-lg border border-white/25 px-6 py-3.5 text-sm font-semibold hover:bg-white/10"
          >
            Try a calculator first
          </Link>
        </div>
      </div>
    </section>
  );
}
