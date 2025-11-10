/**
 * Rearranges a MongoDB ObjectId string by swapping its segments.
 *
 * MongoDB ObjectIds are 24-character hexadecimal strings.
 * This function splits the ID into three equal parts (8 characters each),
 * then rearranges them in the order: second + third + first.
 *
 * @param id - A 24-character MongoDB ObjectId string
 * @returns A rearranged ObjectId string
 * @throws Error if the input is not exactly 24 characters long
 */
export const rearrangeObjectId = (id: string): string => {
  // Validate ObjectId length
  if (id.length !== 24) throw new Error("Invalid ObjectId length");

  const size = 8;

  // Split the ObjectId into three equal parts
  const [first, second, third] = [
    id.slice(0, size),         // First 8 characters
    id.slice(size, size * 2),  // Middle 8 characters
    id.slice(size * 2),        // Last 8 characters
  ];

  // Rearrange the segments: second + third + first
  return `${second}-${third}-${first}`;
};
