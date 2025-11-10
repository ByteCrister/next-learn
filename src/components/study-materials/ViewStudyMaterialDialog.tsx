"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ExternalLink, FileText, Presentation, Image as ImageIcon, File } from "lucide-react";

interface ViewStudyMaterialDialogProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    viewingMaterial: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setViewingMaterial: (material: any) => void;
}

const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
        case "pdf":
            return <FileText className="h-4 w-4 text-red-500" />;
        case "ppt":
            return <Presentation className="h-4 w-4 text-orange-500" />;
        case "image":
            return <ImageIcon className="h-4 w-4 text-green-500" />;
        case "other":
        default:
            return <File className="h-4 w-4 text-gray-500" />;
    }
};

export default function ViewStudyMaterialDialog({ viewingMaterial, setViewingMaterial }: ViewStudyMaterialDialogProps) {
    if (!viewingMaterial) return null;

    return (
        <Dialog open={!!viewingMaterial} onOpenChange={() => setViewingMaterial(null)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {getFileTypeIcon(viewingMaterial.fileTypes?.[0] || "other")}
                        {viewingMaterial.filename}
                    </DialogTitle>
                    <DialogDescription>
                        {viewingMaterial.description || "No description provided."}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{viewingMaterial.fileTypes?.[0] || "other"}</Badge>
                        <Badge variant={viewingMaterial.visibility === "public" ? "default" : "outline"}>
                            {viewingMaterial.visibility}
                        </Badge>
                    </div>
                    {viewingMaterial.tags && viewingMaterial.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {viewingMaterial.tags.map((tag: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <div>
                        <Label className="text-sm font-medium">Files</Label>
                        <div className="space-y-2 mt-2">
                            {viewingMaterial.urls?.map((url: string, index: number) => (
                                <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                                    {viewingMaterial.fileTypes && getFileTypeIcon(viewingMaterial.fileTypes[index] || "other")}
                                    <span className="text-sm flex-1">File {index + 1}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(url, "_blank")}
                                        className="flex items-center gap-1 cursor-pointer"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">
                        Uploaded {viewingMaterial ? new Date(viewingMaterial.uploadedAt).toLocaleDateString() : ""}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
