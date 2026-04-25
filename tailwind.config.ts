import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0b0b12",
        panel: "#10101a",
        figmaPrimary: "#90119b",
        figmaPrimarySoft: "#fdf6fe",
        figmaPrimarySoftAlt: "#fcedfd",
        figmaBorder: "#e6e7ea",
        figmaText: "#181d27",
        figmaMuted: "#6c606c"
      },
      boxShadow: {
        glow: "0 0 32px rgba(144, 17, 155, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
