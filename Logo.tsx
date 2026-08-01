export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" fill="#0E1F3C" />
      {/* ascending bars = growth / equity */}
      <rect x="9" y="22" width="4.5" height="10" rx="1" fill="#12A876" />
      <rect x="16" y="17" width="4.5" height="15" rx="1" fill="#5C86C9" />
      <rect x="23" y="12" width="4.5" height="20" rx="1" fill="#E2E6EE" />
      {/* roofline stroke tying the bars together as a home silhouette */}
      <path
        d="M7.5 15L20 7L32.5 15"
        stroke="#E2E6EE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span
        className={`font-display text-lg font-semibold tracking-tight ${
          dark ? "text-white" : "text-ink-900"
        }`}
      >
        MortgageVerse
      </span>
    </span>
  );
}
