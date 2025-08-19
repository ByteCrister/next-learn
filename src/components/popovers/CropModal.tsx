'use client';
import React, { useState, useCallback } from 'react';
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

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2">
            <div className="bg-white rounded-lg w-full max-w-[400px] max-h-[90vh] flex flex-col overflow-hidden">
                {/* Cropper container */}
                <div className="relative w-full flex-shrink-0 h-[60vw] sm:h-[300px] md:h-[400px] bg-gray-100">
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

                {/* Buttons */}
                <div className="p-4 flex justify-end gap-2 border-t">
                    <Button variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </div>
        </div>
    );
}
