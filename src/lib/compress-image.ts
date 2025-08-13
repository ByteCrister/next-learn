// ==== lib/compress-image.ts ====
export async function compressImageToBase64(file: File): Promise<string> {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context error");
    ctx.drawImage(bitmap, 0, 0);
    return canvas.toDataURL("image/webp", 0.6); // Compress
}