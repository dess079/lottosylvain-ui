import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {/* tes couleurs, animations, etc. */} },
  plugins: [require("@tailwindcss/forms")],
};
export default config;