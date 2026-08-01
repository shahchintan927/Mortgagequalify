"use client";

// Tracks "first one is free, then create an account" gates for anonymous
// visitors (printing, amortization export). This is a client-side nudge
// only — there's no server enforcing it, so it's trivially reset by
// clearing browser storage or using a private window. That's an accepted
// limitation of the current front-end-only demo; a real gate needs a
// server-side check once real auth/a database is wired up.

const PREFIX = "mv_trial_";

export function hasUsedFreeAction(key: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(PREFIX + key) === "1";
}

export function markFreeActionUsed(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFIX + key, "1");
}
