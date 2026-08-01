export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="bg-navy-950 pb-16 pt-32 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <p className="eyebrow text-teal-500">{eyebrow}</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-white/65">{description}</p>
        )}
      </div>
    </div>
  );
}
