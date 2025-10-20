"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LinkCategory, IExternalLink } from "@/models/ExternalLink";
import { ExternalLinkInput } from "@/store/useExternalLinkStore";
import { Loader2, Link, Type, FileText, Tag, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface ExternalLinkFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingLink?: IExternalLink | null;
    subjectId?: string;
    onSubmit: (link: ExternalLinkInput) => void;
    loading: boolean;
    existingLinks: IExternalLink[];
}

export default function ExternalLinkForm({ open, onOpenChange, editingLink, subjectId, onSubmit, loading, existingLinks }: ExternalLinkFormProps) {
    const [form, setForm] = useState({
        url: "",
        title: "",
        description: "",
        category: "Other" as LinkCategory,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (editingLink) {
            setForm({
                url: editingLink.url,
                title: editingLink.title,
                description: editingLink.description || "",
                category: editingLink.category,
            });
        } else {
            setForm({
                url: "",
                title: "",
                description: "",
                category: "Other",
            });
        }
        setErrors({});
    }, [editingLink, open]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.url.trim()) newErrors.url = "URL is required";
        else {
            try {
                new URL(form.url);
            } catch {
                newErrors.url = "Invalid URL format";
            }
        }
        if (!form.title.trim()) newErrors.title = "Title is required";
        else {
            const trimmedTitle = form.title.trim();
            const isDuplicate = existingLinks.some(link =>
                link.title.toLowerCase() === trimmedTitle.toLowerCase() &&
                (!editingLink || link._id !== editingLink._id)
            );
            if (isDuplicate) newErrors.title = "Title must be unique";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSubmit({
            url: form.url.trim(),
            title: form.title.trim(),
            description: form.description.trim() || undefined,
            category: form.category,
            subjectId: subjectId || undefined,
        });
        if (!editingLink) {
            setForm({
                url: "",
                title: "",
                description: "",
                category: "Other",
            });
        }
    };

    const categoryOptions: LinkCategory[] = [
        "Article",
        "Blog Post",
        "Video",
        "Podcast",
        "Audio Clip",
        "Tool",
        "Library",
        "Code Repository",
        "Documentation",
        "Tutorial",
        "Webinar",
        "Presentation",
        "Infographic",
        "Dataset",
        "Whitepaper",
        "E-book",
        "Forum Thread",
        "Social Media",
        "Other",
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{editingLink ? "Edit External Link" : "Add External Link"}</DialogTitle>
                    <DialogDescription>
                        {editingLink ? "Update the details of the external link." : "Add a new external link to your resources."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="space-y-2">
                            <Label htmlFor="url" className="flex items-center gap-2 text-sm font-medium">
                                <Link className="h-4 w-4 text-blue-600" />
                                URL *
                            </Label>
                            <div className="relative">
                                <Input
                                    id="url"
                                    type="url"
                                    value={form.url}
                                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                                    placeholder="https://example.com"
                                    className={` transition-colors ${errors.url ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'}`}
                                    required
                                />
                                
                            </div>
                            {errors.url && (
                                <motion.div
                                    className="flex items-center gap-2 text-sm text-red-600"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.url}
                                </motion.div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-2 text-sm font-medium">
                                <Type className="h-4 w-4 text-blue-600" />
                                Title *
                            </Label>
                            <div className="relative">
                                <Input
                                    id="title"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Enter a unique title for your link"
                                    className={` transition-colors ${errors.title ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'}`}
                                    required
                                />
                                
                            </div>
                            {errors.title && (
                                <motion.div
                                    className="flex items-center gap-2 text-sm text-red-600"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.title}
                                </motion.div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category" className="flex items-center gap-2 text-sm font-medium">
                                <Tag className="h-4 w-4 text-blue-600" />
                                Category
                            </Label>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value as LinkCategory })}>
                                    <SelectTrigger className="focus:border-blue-500 cursor-pointer">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryOptions.map((cat) => (
                                            <SelectItem key={cat} value={cat} className="cursor-pointer">
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </motion.div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                                <FileText className="h-4 w-4 text-blue-600" />
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Add a brief description to help others understand this resource..."
                                rows={3}
                                className="resize-none focus:border-blue-500"
                            />
                        </div>
                    </motion.div>
                    <DialogFooter className="mt-8 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="cursor-pointer flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {editingLink ? "Updating..." : "Adding..."}
                                </>
                            ) : (
                                <>
                                    {editingLink ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Update Link
                                        </>
                                    ) : (
                                        <>
                                            <Link className="h-4 w-4 mr-2" />
                                            Add Link
                                        </>
                                    )}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
