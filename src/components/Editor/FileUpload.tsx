// ==== components/FileUpload.tsx ====
"use client";
import { compressImageToBase64 } from "@/lib/compress-image";
import { useRef } from "react";

export default function FileUpload({ onUpload }: { onUpload: (base64: string, name: string) => void }) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const base64 = await compressImageToBase64(file);
                    onUpload(base64, file.name);
                }}
            />
            <button onClick={() => inputRef.current?.click()} className="bg-gray-200 px-3 py-1 rounded">Upload Image</button>
        </>
    );
}