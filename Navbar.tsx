"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/lib/auth";

const calcLinks = [
  { href: "/calculators/affordability", label: "Affordability & Stress Test" },
  { href: "/calculators/mortgage-payment", label: "Payment Comparison" },
  { href: "/calculators/cmhc-insurance", label: "CMHC Insurance" },
  { href: "/calculators/land-transfer-tax", label: "Land Transfer Tax" },
  { href: "/calculators/closing-costs", label: "Closing Costs" },
];

const navLinks = [
  { href: "/learning", label: "Learning Centre" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-line bg-white/90 backdrop-blur no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link href="/" aria-label="MortgageVerse home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setCalcOpen(true)}
            onMouseLeave={() => setCalcOpen(false)}
          >
            <button
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-paper hover:text-ink-900"
              aria-expanded={calcOpen}
            >
              Calculators
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            {calcOpen && (
              <div className="absolute left-0 top-full w-64 rounded-card border border-line bg-white p-2 shadow-lg">
                {calcLinks.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="block rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-paper hover:text-navy-700"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-paper hover:text-ink-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-paper"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-paper"
              >
                {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={logout}
                className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-paper"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="text-2xl md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="space-y-1 border-t border-line bg-white px-6 pb-6 pt-4 md:hidden">
          <p className="eyebrow px-1 pb-1 pt-2">Calculators</p>
          {calcLinks.map((c) => (
            <Link key={c.href} href={c.href} className="block rounded-lg px-2 py-2 text-ink-700">
              {c.label}
            </Link>
          ))}
          <div className="hairline my-2" />
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="block rounded-lg px-2 py-2 text-ink-700">
              {l.label}
            </Link>
          ))}
          <div className="hairline my-2" />
          {user ? (
            <>
              <Link href="/dashboard" className="block rounded-lg px-2 py-2 text-ink-700">
                My dashboard
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="block rounded-lg px-2 py-2 text-ink-700">
                  Admin
                </Link>
              )}
              <button onClick={logout} className="block w-full rounded-lg px-2 py-2 text-left text-ink-700">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block rounded-lg px-2 py-2 text-ink-700">
                Log in
              </Link>
              <Link href="/signup" className="block rounded-lg bg-navy-900 px-2 py-2 text-white">
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
