import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const domain = process.env.NEXT_PUBLIC_DOMAIN ?? "https://next-learn-nu-olive.vercel.app";
    const routes = ["", "/about", "/features", "/how-to-use"];

    return routes.map((r) => ({ url: `${domain}${r}`, lastModified: new Date() }))
}