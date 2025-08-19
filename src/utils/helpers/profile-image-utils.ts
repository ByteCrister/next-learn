// src/utils/helpers/image-utils.ts
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

const SUPPORTED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

export function isSupportedImageType(mime: string) {
  // Disallow SVG or GIF due to canvas/animation issues
  return SUPPORTED_TYPES.has(mime);
}

export async function readFileAsImageBitmap(file: File): Promise<ImageBitmap> {
  // Prefer createImageBitmap for performance; fallback to HTMLImageElement if needed
  try {
    const ab = await file.arrayBuffer();
    const blob = new Blob([ab], { type: file.type });
    return await createImageBitmap(blob);
  } catch {
    // Fallback
    const url = URL.createObjectURL(file);
    try {
      const img = await loadHTMLImage(url);
      const bitmap = await createImageBitmap(img);
      URL.revokeObjectURL(url);
      return bitmap;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      URL.revokeObjectURL(url);
      throw new Error('Could not decode image. Please choose a different file.');
    }
  }
}

function loadHTMLImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

export function pickTargetMime(opts: {
  prefer: 'image/webp' | 'image/jpeg';
  fallback: 'image/jpeg';
  preserveAlpha: boolean;
}): string {
  const canvas = document.createElement('canvas');
  const canWebp = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  if (opts.preserveAlpha) {
    // PNG preserves alpha; WebP also preserves alpha if supported
    if (canWebp && opts.prefer === 'image/webp') return 'image/webp';
    return 'image/png';
  }
  if (canWebp && opts.prefer === 'image/webp') return 'image/webp';
  return opts.fallback;
}

export function detectHasAlphaByCanvas(bitmap: ImageBitmap): boolean {
  // Fast probe: sample a small downscaled canvas and check alpha channel presence
  const w = Math.min(64, bitmap.width);
  const h = Math.min(64, bitmap.height);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return false;
  ctx.drawImage(bitmap, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
}

export async function drawCompressedToDataUrl(
  bitmap: ImageBitmap,
  opts: { maxEdge: number; quality: number; mime: string }
): Promise<string> {
  const { maxEdge, quality, mime } = opts;

  const scale =
    Math.max(bitmap.width, bitmap.height) > maxEdge
      ? maxEdge / Math.max(bitmap.width, bitmap.height)
      : 1;

  const targetW = Math.round(bitmap.width * scale);
  const targetH = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('Canvas not supported in this browser');

  // High quality resize
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);

  // For PNG, quality parameter is ignored; for WebP/JPEG it's used
  const dataUrl = canvas.toDataURL(mime, quality);

  // Safety: ensure result is under size limit; if not, try smaller quality
  if (!dataUrl.startsWith('data:image/')) {
    throw new Error('Failed to encode image.');
  }

  // If still too large, iteratively reduce quality (for lossy formats)
  if (byteLengthOfDataUrl(dataUrl) > MAX_IMAGE_BYTES && (mime === 'image/webp' || mime === 'image/jpeg')) {
    let q = quality;
    let result = dataUrl;
    while (q > 0.4 && byteLengthOfDataUrl(result) > MAX_IMAGE_BYTES) {
      q -= 0.1;
      const candidate = canvas.toDataURL(mime, q);
      if (!candidate.startsWith('data:image/')) break;
      result = candidate;
    }
    return result;
  }

  return dataUrl;
}

function byteLengthOfDataUrl(dataUrl: string): number {
  // Rough byte length from base64
  const base64 = dataUrl.split(',')[1] || '';
  return Math.ceil((base64.length * 3) / 4);
}
