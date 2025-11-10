
function escapeXml(s: string) {
    return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export async function GET() {
    const NEXT_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "https://next-learn-nu-olive.vercel.app";
    const routes = ["/", "/features", "/about", "/how-to-use"];
    const now = new Date().toISOString();

    const urlEntries = routes
        .map((r) => {
            const loc = `${NEXT_PUBLIC_DOMAIN.replace(/\/$/, "")}${r}`; // normalize
            return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${now}</lastmod>
  </url>`;
        })
        .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    return new Response(sitemap, {
        status: 200,
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
    });
}
