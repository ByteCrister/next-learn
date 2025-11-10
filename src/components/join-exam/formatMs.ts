export function formatMs(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts = [];
  if (h > 0) parts.push(String(h).padStart(2, "0"));
  parts.push(String(m).padStart(2, "0"));
  parts.push(String(s).padStart(2, "0"));
  return parts.join(":");
}