// src/utils/signature.ts
import crypto from "crypto";

export function canonicalizeQuery(params: Record<string, string>): string {
  const keys = Object.keys(params).sort();
  return keys.map((k) => `${k}=${encodeURIComponent(params[k])}`).join("&");
}

export function verifyHmacSig(
  params: Record<string, string>,
  providedSig: string,
  secret: string
): boolean {
  const canonical = canonicalizeQuery(params);
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(canonical)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(providedSig));
}

export function isFresh(tsMs: number, skewMs = 2 * 60 * 1000): boolean {
  const now = Date.now();
  return Math.abs(now - tsMs) <= skewMs;
}
