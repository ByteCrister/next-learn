// /app/sitemap.xml/route.ts
import { NextRequest } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN ?? "https://next-learn-nu-olive.vercel.app";

  // List your routes here
  const routes = ["", "/about", "/features", "/how-to-use"];

  // Use only the date part for <lastmod> to reduce unnecessary changes
  const today = new Date().toISOString().split("T")[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes
      .map(
        (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${today}</lastmod>
  </url>`
      )
      .join("")}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}