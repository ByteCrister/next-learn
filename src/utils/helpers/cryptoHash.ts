// --------------------------------------------------
// cryptoHash.ts
// --------------------------------------------------

import crypto from "crypto";

/**
 * Produces a salted SHA-256 hash of a title string.
 *
 * The salt is loaded from the `TITLE_HASH_SALT` environment variable and
 * prepended to the title before hashing. Changing the salt invalidates
 * all previously generated hashes.
 *
 * @param title - The plain‐text title to hash.
 * @throws Error if `TITLE_HASH_SALT` is not defined.
 * @returns A hex‐encoded SHA-256 digest.
 */
export function cryptoHash(title: string): string {
    const salt = process.env.TITLE_HASH_SALT;
    if (!salt) {
        throw new Error(
            "Missing TITLE_HASH_SALT environment variable — cannot hash title safely."
        );
    }

    // Prepend salt to title to prevent dictionary attacks, then hash
    return crypto
        .createHash("sha256")
        .update(salt + title, "utf8")
        .digest("hex");
}
