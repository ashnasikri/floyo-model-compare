import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0d0b11",
        violet: "#AF7FF4",
        "violet-dim": "#8a5fd4",
        "open-green": "#7dd8b0",
        "closed-orange": "#ffaa5c",
        surface: "#1a1625",
        "surface-2": "#221d30",
        border: "#2e2840",
        muted: "#6b6480",
        "text-main": "#e8e3f0",
        "text-sub": "#a89fc0",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
