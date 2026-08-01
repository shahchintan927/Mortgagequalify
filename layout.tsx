import type { Metadata } from "next";
import { Libre_Franklin, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const display = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mortgageverse.ca";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MortgageVerse | Canadian Mortgage Calculators & Planning Tools",
    template: "%s | MortgageVerse",
  },
  description:
    "Free Canadian mortgage calculators for payments, affordability, CMHC insurance, the stress test, land transfer tax and closing costs — plus guides to help you buy with confidence.",
  keywords: [
    "mortgage calculator canada",
    "CMHC insurance calculator",
    "mortgage stress test",
    "land transfer tax calculator",
    "closing cost calculator",
    "canadian mortgage rates",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: "MortgageVerse",
    title: "MortgageVerse | Canadian Mortgage Calculators & Planning Tools",
    description:
      "Free Canadian mortgage calculators and guides — payments, affordability, CMHC insurance, stress test, land transfer tax and closing costs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MortgageVerse | Canadian Mortgage Calculators",
    description:
      "Free Canadian mortgage calculators and guides to help you buy with confidence.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
