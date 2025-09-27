import type { Config } from "tailwindcss"

const config = {
  theme: {
    extend: {
      fontFamily: {
        logo: ["var(--font-sixtyfour)"],
        heading: ["var(--font-bebas)"],
        body: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
} satisfies Config

export default config
