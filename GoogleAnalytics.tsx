import Script from "next/script";

/**
 * Google Analytics 4 loader. Set NEXT_PUBLIC_GA_ID in your environment
 * (see .env.local.example) to your GA4 Measurement ID (G-XXXXXXXXXX).
 * Renders nothing if the ID isn't configured, so it's safe in every
 * environment including local dev.
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  );
}
