import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,md,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#08090D",
        surface: "#111318",
        border: "#1E2130",
        lime: {
          DEFAULT: "#C8F04B",
          hover: "#A8D130",
        },
        text: {
          primary: "#F0F2F7",
          muted: "#7A8099",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#B8BCCC",
            "--tw-prose-headings": "#F0F2F7",
            "--tw-prose-links": "#C8F04B",
            "--tw-prose-bold": "#F0F2F7",
            "--tw-prose-code": "#C8F04B",
            "--tw-prose-pre-bg": "#111318",
            "--tw-prose-pre-code": "#F0F2F7",
            "--tw-prose-quotes": "#7A8099",
            "--tw-prose-quote-borders": "#1E2130",
            maxWidth: "none",
          },
        },
      },
    },
  },
  plugins: [
    typography,
    // Hide scrollbar utility for overflowing filter tab rows
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function ({ addUtilities }: any) {
      addUtilities({
        ".scrollbar-none": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      });
    },
  ],
};

export default config;
