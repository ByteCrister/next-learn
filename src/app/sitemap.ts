import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const domain =
    process.env.NEXT_PUBLIC_DOMAIN?.replace(/\/$/, "") ||
    "https://next-learn-nu-olive.vercel.app";

  const routes = [
    { path: "/", priority: 1.0 },
    { path: "/about", priority: 0.8 },
    { path: "/features", priority: 0.9 },
    { path: "/how-to-use", priority: 0.85 },
  ];

  return routes.map((route) => ({
    url: `${domain}${route.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
