import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <section className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center pt-24">
        <p className="figure text-sm font-semibold text-teal-600">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink-900">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          The page you&apos;re looking for doesn&apos;t exist, or may have moved.
          Try one of the calculators, or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Back to home
          </Link>
          <Link
            href="/calculators"
            className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-paper"
          >
            View calculators
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
