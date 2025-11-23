'use client';
import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Cropper, { Area } from 'react-easy-crop';
import { Button } from '../ui/button';
import getCroppedImg from '@/utils/helpers/getCroppedImg';

interface CropModalProps {
    imageSrc: string;
    onCancel: () => void;
    onSave: (croppedDataUrl: string) => void;
}

export default function CropModal({ imageSrc, onCancel, onSave }: CropModalProps) {
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!croppedAreaPixels) return;
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onSave(croppedImage);
    };

    return createPortal(

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2">
            <div
                className="bg-white rounded-lg w-full max-w-[400px] mx-auto flex flex-col overflow-auto"
                style={{
                    // Prefer the dynamic small-viewport height when available, fallback to 100vh.
                    // Subtract a bit of space to respect padding and controls.
                    maxHeight: 'calc(min(100svh, 100vh) - 2rem)',
                    // Add safe-area padding for devices with notches/home indicators
                    paddingBottom: 'env(safe-area-inset-bottom)',
                }}
            >
                {/* Cropper container: responsive and allowed to shrink on small viewports */}
                <div
                    className="relative w-full flex-shrink-0 bg-gray-100 flex items-center justify-center"
                    style={{
                        // Keep the cropper responsive: use viewport width but cap height for large screens.
                        height: 'min(60vw, 400px)',
                        maxHeight: 'calc(min(100svh, 100vh) - 8rem)',
                    }}
                >
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        minZoom={1}
                        maxZoom={3}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        objectFit="contain"
                    />
                </div>

                {/* Zoom slider (optional) */}
                <div className="px-4 pt-3">
                    <label className="block text-xs text-slate-600 mb-2">Zoom</label>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full"
                    />
                </div>

                {/* Buttons: pinned at bottom of modal's content area but modal itself can scroll */}
                <div className="p-4 flex justify-end gap-2 border-t bg-white sticky bottom-0">
                    <Button variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </div>
        </div>,
        document.body
    )

}
