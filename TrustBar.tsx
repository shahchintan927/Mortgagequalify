const items = [
  "CMHC-aligned formulas",
  "All provinces & territories",
  "Bank of Canada benchmark rate",
  "No signup required to calculate",
];

export default function TrustBar() {
  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-5 text-center text-xs font-medium text-ink-400">
        {items.map((item) => (
          <span key={item} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
