import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NODE_ENV === "production"
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://shiftbox.uk"

  if (!isProd) {
    // Block all crawlers on staging/preview/dev
    return {
      rules: [{ userAgent: "*", disallow: ["/"] }],
      sitemap: `${site}/sitemap.xml`,
    }
  }

  // Production: allow the site, keep admin/api out
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/(admin)", "/api"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
  }
}
