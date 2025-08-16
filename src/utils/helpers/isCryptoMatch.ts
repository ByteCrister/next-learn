// --------------------------------------------------
// isCryptoMatch.ts
// --------------------------------------------------

import { cryptoHash } from "./cryptoHash";

/**
 * Verifies that a given title matches a previously stored hash.
 *
 * @param givenString - The plain‐text title supplied by the user or system.
 * @param hashedString - The hex‐encoded SHA-256 hash to compare against.
 * @returns `true` if the salted hash of `givenString` equals `hashedString`; otherwise `false`.
 */
export default function isCryptoMatch(
  givenString: string,
  hashedString: string
): boolean {
  // Compute the hash of the incoming title and do a direct comparison
  return cryptoHash(givenString) === hashedString;
}
