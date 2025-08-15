import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {/* tes couleurs, animations, etc. */} },
  plugins: [
    require("@tailwindcss/forms"),
    typography
  ],
};

export default config;