export async function GET() {
  const baseUrl = "https://next-learn-nu-olive.vercel.app";

  // Static routes
  const routes = ["", "/about", "/features", "/how-to-use"];


  // Build XML sitemap string
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  ${routes
      .map(
        (route) => `
    <url>
      <loc>${baseUrl}${route}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>`
      )
      .join("")}
</urlset>`;

  return new Response(sitemapXml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}