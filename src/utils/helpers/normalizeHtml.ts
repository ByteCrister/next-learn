// utils/normalizeHtml.ts
export function normalizeHtml(html: string): string {
    return html.replace(
        /<img([^>]+)>/g,
        (match, attrs) => {
            let styleMatch = "";
            const containerStyleMatch = attrs.match(/containerstyle="([^"]*)"/);
            const wrapperStyleMatch = attrs.match(/wrapperstyle="([^"]*)"/);
            const existingStyleMatch = attrs.match(/style="([^"]*)"/);

            // Merge all styles into one string
            styleMatch = [
                existingStyleMatch?.[1] || "",
                containerStyleMatch?.[1] || "",
                wrapperStyleMatch?.[1] || ""
            ]
                .filter(Boolean)
                .join("; ");

            // Remove non-standard attributes
            const cleanedAttrs = attrs
                .replace(/containerstyle="[^"]*"/, "")
                .replace(/wrapperstyle="[^"]*"/, "")
                .replace(/style="[^"]*"/, "");

            // Return new <img> tag with merged style
            return `<img${cleanedAttrs} style="${styleMatch}">`;
        }
    );
}
