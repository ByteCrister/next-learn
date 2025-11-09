"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useStudyMaterialStore } from "@/store/useStudyMaterialStore";
import { FileType } from "@/types/types.studymaterials";
import { FileText, Link, Tag, Eye, EyeOff, Upload, X, File as FileIcon } from "lucide-react";

interface StudyMaterialUploadProps {
    subjectId?: string;
    roadmapId?: string;
}

export default function StudyMaterialUpload({ subjectId, roadmapId }: StudyMaterialUploadProps) {
    const { createStudyMaterial, loadingCrud, studyMaterials } = useStudyMaterialStore();

    const [open, setOpen] = useState(false);
    const [filename, setFilename] = useState("");
    const [urlsText, setUrlsText] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [fileType, setFileType] = useState<FileType>("other");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState<"private" | "public">("private");
    const [tags, setTags] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    const isValidUrl = (url: string): boolean => {
        const urlPattern = /^(https?:\/\/)/i;
        return urlPattern.test(url);
    };

    const uploadFile = async (file: File): Promise<string | null> => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error('Upload error:', error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!filename) return;

        const isUnique = !studyMaterials.some(m => m.filename.toLowerCase() === filename.toLowerCase());
        if (!isUnique) {
            setError("Material name must be unique.");
            return;
        }
        setError(null);

        let finalUrls: string[] = [];
        if (fileType !== "other") {
            for (const file of selectedFiles) {
                const uploadedUrl = await uploadFile(file);
                if (!uploadedUrl) return;
                finalUrls.push(uploadedUrl);
            }
            if (finalUrls.length === 0) return;
        } else {
            finalUrls = urlsText.split('\n').map(u => u.trim()).filter(u => u);
            if (finalUrls.length === 0) return;

            const invalidUrls = finalUrls.filter(url => !isValidUrl(url));
            if (invalidUrls.length > 0) {
                setError("Please enter valid URLs (must start with http:// or https://).");
                return;
            }
        }

        const fileTypes = finalUrls.map(() => fileType);

        await createStudyMaterial({
            subjectId,
            roadmapId,
            filename,
            urls: finalUrls,
            fileTypes,
            tags: tags.split(",").map(t => t.trim()).filter(t => t),
            description,
            visibility,
        });

        // Reset form
        setFilename("");
        setUrlsText("");
        setSelectedFiles([]);
        setFileType("other");
        setDescription("");
        setVisibility("private");
        setTags("");
        setError(null);
        setOpen(false);
    };

    const handleFileTypeChange = (value: FileType) => {
        setFileType(value);
        if (value === "other") {
            setSelectedFiles([]);
        } else {
            setUrlsText("");
            setSelectedFiles([]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <motion.div variants={buttonVariants} whileHover="hover" className="inline-flex">
                    <Button className="cursor-pointer flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Study Material
                    </Button>
                </motion.div>
            </DialogTrigger>
            <DialogContent className="max-h-[70vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Upload Study Material</DialogTitle>
                </DialogHeader>
                <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="space-y-2">
                        <Label htmlFor="filename" className="flex items-center gap-2 text-sm font-medium">
                            <FileText className="h-4 w-4 text-indigo-600" />
                            Filename *
                        </Label>
                        <Input
                            id="filename"
                            value={filename}
                            onChange={(e) => {
                                setFilename(e.target.value);
                                setError(null);
                            }}
                            placeholder="Enter filename"
                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        {error && (
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fileType" className="flex items-center gap-2 text-sm font-medium">
                            <Upload className="h-4 w-4 text-indigo-600" />
                            File Type *
                        </Label>
                        <Select value={fileType} onValueChange={handleFileTypeChange}>
                            <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                                <SelectValue placeholder="Select file type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="ppt">PPT</SelectItem>
                                <SelectItem value="image">Image</SelectItem>
                                <SelectItem value="other">Other (Link)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {fileType === "other" ? (
                        <div className="space-y-2">
                            <Label htmlFor="urls" className="flex items-center gap-2 text-sm font-medium">
                                <Link className="h-4 w-4 text-indigo-600" />
                                URLs *
                            </Label>
                            <Textarea
                                id="urls"
                                value={urlsText}
                                onChange={(e) => setUrlsText(e.target.value)}
                                placeholder="One URL per line&#10;https://example.com/file1.pdf&#10;https://example.com/file2.pdf"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 min-h-[60px]"
                                required
                                title="Each line must be a valid URL starting with http:// or https://"
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="files" className="flex items-center gap-2 text-sm font-medium">
                                <FileIcon className="h-4 w-4 text-indigo-600" />
                                Select Files *
                            </Label>
                            <input
                                id="files"
                                type="file"
                                multiple
                                accept={fileType === "image" ? "image/*" : fileType === "pdf" ? "application/pdf" : "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"}
                                onChange={(e) => setSelectedFiles(e.target.files ? Array.from(e.target.files) : [])}
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required={selectedFiles.length === 0}
                            />
                            {selectedFiles.length > 0 && (
                                <p className="text-sm text-gray-600">Selected: {selectedFiles.map(f => f.name).join(', ')}</p>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                            <FileText className="h-4 w-4 text-indigo-600" />
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the material..."
                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 min-h-[60px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="visibility" className="flex items-center gap-2 text-sm font-medium">
                            {visibility === "public" ? <Eye className="h-4 w-4 text-indigo-600" /> : <EyeOff className="h-4 w-4 text-indigo-600" />}
                            Visibility
                        </Label>
                        <Select value={visibility} onValueChange={(value: "private" | "public") => setVisibility(value)}>
                            <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="private">
                                    <div className="flex items-center gap-2">
                                        <EyeOff className="h-4 w-4" />
                                        Private
                                    </div>
                                </SelectItem>
                                <SelectItem value="public">
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        Public
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags" className="flex items-center gap-2 text-sm font-medium">
                            <Tag className="h-4 w-4 text-indigo-600" />
                            Tags
                        </Label>
                        <Input
                            id="tags"
                            value={tags}
                            onChange={(e) => {
                                const input = e.target.value;
                                const processedTags = input.split(",").map(t => {
                                    const trimmed = t.trim();
                                    if (trimmed && !trimmed.startsWith('#')) {
                                        return '#' + trimmed;
                                    }
                                    return trimmed;
                                }).filter(t => t !== '#');
                                setTags(processedTags.join(", "));
                            }}
                            placeholder="e.g., #pdf, #notes, #chapter1"
                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loadingCrud || uploading || !filename.trim() || (fileType === "other" && !urlsText.trim()) || (fileType !== "other" && selectedFiles.length === 0)}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploading || loadingCrud ? "Uploading..." : "Upload Material"}
                        </Button>
                    </div>
                </motion.form>
            </DialogContent>
        </Dialog>
    );
}
