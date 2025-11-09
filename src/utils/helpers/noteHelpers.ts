/**
 * Calculate reading time based on content
 * @param content - HTML content string
 * @param wordsPerMinute - Reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
    if (!content) return 0;
    const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

/**
 * Calculate word count from HTML content
 * @param content - HTML content string
 * @returns Number of words
 */
export function calculateWordCount(content: string): number {
    if (!content) return 0;
    return content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
}

/**
 * Extract headings from HTML content for table of contents
 * @param content - HTML content string
 * @returns Array of heading objects with level and text
 */
export function extractHeadings(content: string): Array<{ level: number; text: string; id: string }> {
    if (!content) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

    return Array.from(headings).map((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || '';
        const id = `heading-${index}`;
        heading.id = id; // Add ID for anchor links
        return { level, text, id };
    });
}
