/**
 * Restores the original MongoDB ObjectId from a rearranged format.
 *
 * Assumes the rearranged ID was split into three segments using hyphens ("-"),
 * and originally rearranged in the order: second + first + third.
 * This function reverses that transformation by reordering the segments as:
 * second + third + first → first + second + third.
 *
 * @param rearrangedId - A hyphen-separated string with three segments
 * @returns The restored 24-character ObjectId string
 * @throws Error if the format is invalid or the result is not 24 characters
 */
export const restoreOriginalObjectId = (rearrangedId: string): string => {
    // Split the rearranged ID into three segments
    const segments = rearrangedId.split('-');
    if (segments.length !== 3) throw new Error("Invalid ID format");

    const [second, third, first] = segments;

    // Reconstruct the original ObjectId: second + third + first
    const restored = `${first}${second}${third}`;

    // Validate the final length
    if (restored.length !== 24) throw new Error("Resulting ID is not a valid ObjectId");

    return restored;
};
