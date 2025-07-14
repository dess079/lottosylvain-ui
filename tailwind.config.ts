import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {/* tes couleurs, animations, etc. */} },
  plugins: [require("@tailwindcss/forms")],
};
export default config;