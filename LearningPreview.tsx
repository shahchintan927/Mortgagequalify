import Link from "next/link";
import { articles } from "@/data/learning";

export default function LearningPreview() {
  const featured = articles.slice(0, 3);
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="eyebrow">Learning centre</p>
            <h2 className="mt-3 text-3xl font-semibold text-ink-900 md:text-4xl">
              Understand the &quot;why,&quot; not just the number.
            </h2>
          </div>
          <Link href="/learning" className="text-sm font-medium text-navy-700 hover:text-navy-900">
            View all guides →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featured.map((a) => (
            <Link
              key={a.slug}
              href={`/learning/${a.slug}`}
              className="group rounded-card border border-line p-6 hover:border-navy-300 hover:shadow-lg"
            >
              <span className="eyebrow text-teal-600">{a.category}</span>
              <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink-900">
                {a.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{a.summary}</p>
              <p className="mt-4 text-xs text-ink-400">{a.readMins} min read</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
