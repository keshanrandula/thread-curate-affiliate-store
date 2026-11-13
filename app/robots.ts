import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const baseUrl = siteUrl.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/login",
          "/go",
          "/go/",
          "/go/*",
          "/api/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/shop",
          "/category/*",
          "/product/*",
          "/about",
          "/contact",
          "/disclosure",
          "/privacy",
        ],
        disallow: [
          "/admin*",
          "/login",
          "/go*",
          "/api*",
        ],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: [
          "/admin*",
          "/login",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
