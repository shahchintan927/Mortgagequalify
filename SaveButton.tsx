"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export function SaveCalculationButton({
  type,
  label,
  inputSummary,
  resultSummary,
  payload,
}: {
  type: string;
  label: string;
  inputSummary: string;
  resultSummary: string;
  payload?: string;
}) {
  const { user, saveCalculation } = useAuth();
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-navy-900"
      >
        Log in to save this calculation →
      </Link>
    );
  }

  return (
    <button
      onClick={() => {
        saveCalculation({ type, label, inputSummary, resultSummary, payload });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }}
      className="inline-flex items-center gap-2 rounded-lg border border-navy-700 px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-700 hover:text-white"
    >
      {saved ? "Saved to your dashboard ✓" : "Save this calculation"}
    </button>
  );
}
