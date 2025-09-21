import type { Config } from "tailwindcss"

export default {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6366f1",  // Indigo-500
          dark: "#4f46e5"      // Indigo-600
        },
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" }
    }
  }
} satisfies Partial<Config>
