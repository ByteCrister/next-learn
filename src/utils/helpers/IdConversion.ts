/**
 * Generate a random alphanumeric string of a given length.
 * Used to obfuscate segments so IDs are not easily guessable.
 *
 * @param length - Number of random characters to generate
 * @returns Random alphanumeric string
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
 * Encode a plain ID into an obfuscated form.
 *
 * Process:
 * 1. Split the original ID into 3 segments (roughly equal length).
 * 2. Wrap each segment with:
 *    - A random prefix (fixed length)
 *    - The segment itself
 *    - A random suffix (fixed length)
 *    - A delimiter (`|`) followed by the segment length
 * 3. Reorder the segments (3 → 1 → 2) to further obfuscate.
 *
 * @param id - Original ID string
 * @returns Encoded/obfuscated ID string
 */
export function encodeId(id: string): string {
    if (id.length < 3) return id; // Too short to split meaningfully

    const segmentLength = Math.ceil(id.length / 3);
    const segment1 = id.slice(0, segmentLength);
    const segment2 = id.slice(segmentLength, segmentLength * 2);
    const segment3 = id.slice(segmentLength * 2);

    const fixedRandomLength = 3; // Prefix/suffix length

    /**
     * Wrap a segment with random prefix/suffix and store its length.
     * The `|` delimiter ensures decoding is unambiguous even if suffix contains digits.
     */
    const wrapSegment = (segment: string) => {
        const prefix = generateRandomString(fixedRandomLength);
        const suffix = generateRandomString(fixedRandomLength);
        return `${prefix}${segment}${suffix}|${segment.length}`;
    };

    const enc1 = wrapSegment(segment1);
    const enc2 = wrapSegment(segment2);
    const enc3 = wrapSegment(segment3);

    // Reorder segments: 3 - 1 - 2
    return `${enc3}-${enc1}-${enc2}`;
}

/**
 * Decode an encoded ID back to its original form.
 *
 * Process:
 * 1. Split the encoded string into 3 parts (based on `-` separator).
 * 2. For each part:
 *    - Split at the `|` delimiter to separate the wrapped segment from its length.
 *    - Remove the random prefix/suffix using the known fixed length.
 *    - Extract the original segment using the stored length.
 * 3. Reorder back to original sequence (1 → 2 → 3).
 *
 * @param encoded - Encoded/obfuscated ID string
 * @returns Decoded/original ID string
 */
export function decodeId(encoded: string): string {
    const parts = encoded.split('-');
    if (parts.length !== 3) return encoded; // Invalid format

    const fixedRandomLength = 3;

    const extractSegment = (str: string) => {
        const [core, lenStr] = str.split('|');
        if (!lenStr) return ''; // Missing length info
        const len = parseInt(lenStr, 10);
        if (isNaN(len)) return ''; // Invalid length

        // core = prefix(3) + segment(len) + suffix(3)
        return core.slice(fixedRandomLength, fixedRandomLength + len);
    };

    const segment3 = extractSegment(parts[0]);
    const segment1 = extractSegment(parts[1]);
    const segment2 = extractSegment(parts[2]);

    return segment1 + segment2 + segment3;
}