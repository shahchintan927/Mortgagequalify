import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#EEF2F9",
          300: "#9DB5D9",
          950: "#08132B",
          900: "#0E1F3C",
          800: "#132A4F",
          700: "#1B3A6B",
          600: "#254B8A",
          500: "#2F5CAB",
        },
        teal: {
          700: "#0A7553",
          600: "#0C8F63",
          500: "#12A876",
        },
        amber: {
          700: "#9C6417",
          600: "#C27F1E",
          500: "#DE9A34",
        },
        paper: "#F5F6F9",
        line: "#E2E6EE",
        ink: {
          900: "#0F1626",
          700: "#333D51",
          600: "#4A5468",
          500: "#616B7E",
          400: "#7C8697",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "ledger-lines":
          "repeating-linear-gradient(to bottom, transparent, transparent 39px, rgba(255,255,255,0.045) 40px)",
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};
export default config;
