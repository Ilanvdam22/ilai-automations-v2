import type { MetadataRoute } from "next";

const base = "https://www.ilaiautomations.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/diensten", "/proces", "/over", "/faq", "/contact", "/outreach-policy"].map(
    (path) => ({
      url: `${base}${path}`,
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
    })
  );
}
