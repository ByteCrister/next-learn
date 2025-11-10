export async function GET() {
    const NEXT_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "https://next-learn-nu-olive.vercel.app";
    const body = `User-agent: *
                Allow: /
                Sitemap: ${NEXT_PUBLIC_DOMAIN.replace(/\/$/, "")}/sitemap.xml`;
    return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
