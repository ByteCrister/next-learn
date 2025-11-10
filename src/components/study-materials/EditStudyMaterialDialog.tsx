"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Hash, Link, File, FileText, Presentation, Image as ImageIcon, X, Check, Loader2, Eye, Lock } from "lucide-react";

interface EditStudyMaterialDialogProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editingMaterial: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEditingMaterial: (material: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editForm: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEditForm: (form: any) => void;
    editError: string | null;
    isSaving: boolean;
    editUploading: boolean;
    selectedEditFile: File | null;
    setSelectedEditFile: (file: File | null) => void;
    handleFileTypeEditChange: (value: string) => void;
    handleSaveEdit: () => void;
}

export default function EditStudyMaterialDialog({
    editingMaterial,
    setEditingMaterial,
    editForm,
    setEditForm,
    editError,
    isSaving,
    editUploading,
    selectedEditFile,
    setSelectedEditFile,
    handleFileTypeEditChange,
    handleSaveEdit
}: EditStudyMaterialDialogProps) {
    if (!editingMaterial) return null;

    return (
        <Dialog open={!!editingMaterial} onOpenChange={() => setEditingMaterial(null)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Study Material</DialogTitle>
                    <DialogDescription>Update the details of your study material.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="filename" className="flex items-center gap-2">
                            <File className="h-4 w-4 text-gray-500" />
                            Filename
                        </Label>
                        <Input
                            id="filename"
                            value={editForm.filename}
                            onChange={(e) => {
                                setEditForm({ ...editForm, filename: e.target.value });
                            }}
                        />
                        {editError && (
                            <p className="text-sm text-red-600 mt-1">{editError}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="fileType">File Type</Label>
                        <Select value={editForm.fileTypes?.[0] || ""} onValueChange={handleFileTypeEditChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select file type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pdf" className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-red-500" />
                                    PDF
                                </SelectItem>
                                <SelectItem value="ppt" className="flex items-center gap-2">
                                    <Presentation className="h-4 w-4 text-orange-500" />
                                    PPT
                                </SelectItem>
                                <SelectItem value="image" className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-green-500" />
                                    Image
                                </SelectItem>
                                <SelectItem value="other" className="flex items-center gap-2">
                                    <File className="h-4 w-4 text-gray-500" />
                                    Other (Link)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {editForm.fileTypes?.[0] === "other" ? (
                        <div>
                            <Label htmlFor="url" className="flex items-center gap-2">
                                <Link className="h-4 w-4 text-gray-500" />
                                URL
                            </Label>
                            <div className="relative">
                                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="url"
                                    type="url"
                                    value={editForm.urls?.[0] || ""}
                                    onChange={(e) => setEditForm({ ...editForm, urls: [e.target.value] })}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Label htmlFor="edit-file" className="flex items-center gap-2">
                                <File className="h-4 w-4 text-gray-500" />
                                Select File
                            </Label>
                            <input
                                id="edit-file"
                                type="file"
                                accept={editForm.fileTypes?.[0] === "image" ? "image/*" : editForm.fileTypes?.[0] === "pdf" ? "application/pdf" : "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"}
                                onChange={(e) => setSelectedEditFile(e.target.files ? e.target.files[0] : null)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {selectedEditFile && (
                                <p className="text-sm text-gray-600 mt-1">Selected: {selectedEditFile.name}</p>
                            )}
                        </div>
                    )}
                    <div>
                        <Label htmlFor="description" className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            Description
                        </Label>
                        <div className="relative">
                            <Textarea
                                id="description"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                placeholder="Brief description of the material..."
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="visibility">Visibility</Label>
                        <Select value={editForm.visibility} onValueChange={(value) => setEditForm({ ...editForm, visibility: value as "public" | "private" })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public" className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-blue-500" />
                                    Public
                                </SelectItem>
                                <SelectItem value="private" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-gray-500" />
                                    Private
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-gray-500" />
                            Tags (comma-separated)
                        </Label>
                        <div className="relative">
                            <Input
                                value={(editForm.tags || []).join(", ")}
                                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value.split(",").map(t => {
                                    const trimmed = t.trim();
                                    if (trimmed && !trimmed.startsWith('#')) {
                                        return '#' + trimmed;
                                    }
                                    return trimmed;
                                }).filter(t => t !== '#') })}
                                placeholder="e.g., #pdf, #notes, #chapter1"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" className="cursor-pointer" onClick={() => setEditingMaterial(null)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button className="cursor-pointer" onClick={handleSaveEdit} disabled={isSaving || editUploading}>
                        {(isSaving || editUploading) ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Check className="h-4 w-4 mr-2" />
                        )}
                        {(isSaving || editUploading) ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
