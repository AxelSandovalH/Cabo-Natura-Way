import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = "https://cabonaturalway.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,              lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/shop`,    lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/farmers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/delivery`,lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  // Dynamic product pages
  try {
    const supabase = await createClient();
    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("in_stock", true);

    const productPages: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
      url:             `${SITE_URL}/shop/${p.slug}`,
      lastModified:    new Date(p.updated_at),
      changeFrequency: "weekly",
      priority:        0.8,
    }));

    return [...staticPages, ...productPages];
  } catch {
    return staticPages;
  }
}
