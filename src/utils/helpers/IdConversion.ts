/**
 * Generate a random alphanumeric string of given length
 */
function generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Encode a plain ID into an obfuscated form
 * @param id - original ID
 * @returns obfuscated ID
 */
export function encodeId(id: string): string {
    if (id.length < 3) return id;

    const segmentLength = Math.ceil(id.length / 3);
    const segment1 = id.slice(0, segmentLength);
    const segment2 = id.slice(segmentLength, segmentLength * 2);
    const segment3 = id.slice(segmentLength * 2);

    const fixedRandomLength = 3; // fixed prefix/suffix length

    const wrapSegment = (segment: string) => {
        const prefix = generateRandomString(fixedRandomLength);
        const suffix = generateRandomString(fixedRandomLength);
        return `${prefix}${segment}${suffix}${segment.length}`;
    };

    const enc1 = wrapSegment(segment1);
    const enc2 = wrapSegment(segment2);
    const enc3 = wrapSegment(segment3);

    // reorder 3-1-2
    return `${enc3}-${enc1}-${enc2}`;
}

/**
 * Decode an encoded ID back to its original form
 * @param encoded - obfuscated ID
 * @returns original ID
 */
export function decodeId(encoded: string): string {
    const parts = encoded.split('-');
    if (parts.length !== 3) return encoded;

    const fixedRandomLength = 3;

    const extractSegment = (str: string) => {
        const lenMatch = str.match(/(\d+)$/);
        if (!lenMatch) return '';
        const len = parseInt(lenMatch[1], 10);

        // fixed prefix + segment + fixed suffix + length digits
        return str.slice(fixedRandomLength, fixedRandomLength + len);
    };

    const segment3 = extractSegment(parts[0]);
    const segment1 = extractSegment(parts[1]);
    const segment2 = extractSegment(parts[2]);

    return segment1 + segment2 + segment3;
}
