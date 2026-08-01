import type { MetadataRoute } from "next";
import { articles } from "@/data/learning";
import { posts } from "@/data/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mortgageverse.ca";

const staticRoutes = [
  "",
  "/calculators",
  "/calculators/mortgage-payment",
  "/calculators/affordability",
  "/calculators/cmhc-insurance",
  "/calculators/land-transfer-tax",
  "/calculators/closing-costs",
  "/learning",
  "/blog",
  "/about",
  "/login",
  "/signup",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const learningEntries = articles.map((a) => ({
    url: `${siteUrl}/learning/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const blogEntries = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...learningEntries, ...blogEntries];
}
