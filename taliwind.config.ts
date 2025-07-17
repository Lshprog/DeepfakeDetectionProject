// tailwind.config.ts
import { type Config } from "tailwindcss"

export default {
  content: [
    "./app/**/*.{ts,tsx}",   // Next.js App Router
    "./components/**/*.{ts,tsx}"
  ],
  theme: { extend: {} },
  plugins: []
} satisfies Config
