# MortgageVerse

A full Canadian mortgage planning platform: six calculators, a learning
centre, a blog, accounts, and an admin dashboard — built with Next.js 15,
TypeScript, Tailwind CSS and Recharts.

## What's included

- **Homepage** with a live interactive mini-calculator in the hero
- **Six calculators**: Mortgage Payment, Affordability, CMHC Insurance,
  Stress Test, Land Transfer Tax, Closing Costs — each with real Canadian
  formulas, interactive charts, and a "save to dashboard" button
- **Learning Centre** — 6 in-depth guides
- **Blog** — 4 posts with tags and dates
- **User accounts** — signup/login, saved calculations per user
- **Admin dashboard** — user list, saved calculations, usage chart
- **SEO** — per-page metadata, Open Graph tags, `sitemap.xml`, `robots.txt`,
  JSON-LD structured data on the homepage
- **Google Analytics 4** — wired up, just needs your Measurement ID
- **Custom logo & navy/blue brand system**

## ⚠️ Important: accounts are a front-end demo

Per your choice, user accounts and the admin dashboard are built as a fully
working **front-end demo** — real signup/login/save/admin flows — but data
is stored in the browser's `localStorage`, not a real database. There is no
password hashing and no server-side session. This is fine for demoing the
product or for your own use, but **do not treat it as secure or launch it
as-is with real user data.**

Demo accounts (seeded automatically on first load):
- User: `jordan@example.com` / `password123`
- Admin: `admin@mortgageverse.ca` / `admin123`

### Moving to a real backend later

When you're ready, replace `src/lib/auth.tsx` with real auth — e.g.
[NextAuth.js](https://authjs.dev), [Supabase Auth](https://supabase.com/auth),
or [Clerk](https://clerk.com) — plus a real database (Postgres via Supabase/
Neon, or similar) for saved calculations and the admin dashboard. The rest
of the app (all calculators, content, SEO) doesn't need to change.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX        # your GA4 Measurement ID
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
```

Both are optional for local development — the site works without them,
just without live analytics and with a placeholder canonical URL.

## Deploy to a hosting site

**Vercel (recommended, made by the Next.js team):**
1. Push this folder to a GitHub repo (or run `npx vercel` from inside it).
2. Import the repo at vercel.com → it auto-detects Next.js → add your env
   vars → Deploy.

**Netlify:**
1. Push to GitHub.
2. New site from Git → build command `npm run build` → Netlify's Next.js
   runtime plugin handles the rest automatically.

**Any Node host (Railway, Render, a VPS, etc.):**
```bash
npm install
npm run build
npm run start
```

## Project structure

```
src/
  app/                    routes (App Router)
    calculators/[...]     the 6 calculator pages
    learning/[slug]       learning centre + articles
    blog/[slug]           blog + posts
    login, signup         auth pages
    dashboard             user's saved calculations
    admin                 admin panel (users, usage, saved calcs)
    sitemap.ts, robots.ts SEO
  components/
    calculators/          calculator UI + charts + save button
    ui/                   shared form fields, page header, etc.
  lib/
    calculations.ts       all mortgage math (documented, pure functions)
    auth.tsx              demo auth context (localStorage-backed)
  data/
    learning.ts, blog.ts  article/post content
```

## A note on accuracy

All formulas (CMHC premium tiers, stress test, land transfer tax brackets,
closing cost estimates) are modelled on publicly published rules and are
intended for **planning purposes only** — not financial, legal or tax
advice. Rates and brackets change; verify current figures with a licensed
mortgage professional before making a decision. This is disclosed in the
footer of every page.
