import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/eudr",
    "/plm",
    "/battery-passport",
    "/providers",
    "/finder",
    "/resources/regulations",
    "/resources/regulations/eudr",
    "/resources/regulations/battery-passport",
    "/resources/blog",
    "/resources/blog/eudr-software-questions-to-ask-providers",
    "/resources/blog/fashion-plm-software-questions-to-ask-providers",
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/finder" ? 0.6 : 0.9,
  }));
}
