export async function GET() {
    const domain = process.env.NEXT_PUBLIC_DOMAIN ?? "https://next-learn-nu-olive.vercel.app";
    const now = new Date().toISOString();
    const routes = ["", "/about", "/features", "/how-to-use"];

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `
  <url>
    <loc>${domain}${r}</loc>
    <lastmod>${now}</lastmod>
  </url>`).join("")}
</urlset>`;

    return new Response(body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
    });
}
