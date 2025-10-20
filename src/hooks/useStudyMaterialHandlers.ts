import { useEffect, useState } from "react";
import { useStudyMaterialStore } from "@/store/useStudyMaterialStore";
import { StudyMaterial, FileType } from "@/types/types.studymaterials";

interface EditFormType {
    filename: string;
    urls: string[];
    description: string;
    fileTypes: FileType[];
    visibility: "public" | "private";
    tags: string[];
}

interface UseStudyMaterialHandlersProps {
    subjectId?: string;
    roadmapId?: string;
}

export const useStudyMaterialHandlers = ({ subjectId, roadmapId }: UseStudyMaterialHandlersProps) => {
    const { studyMaterials, loading, fetchStudyMaterials, deleteStudyMaterial, updateStudyMaterial } = useStudyMaterialStore();

    const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null);
    const [viewingMaterial, setViewingMaterial] = useState<StudyMaterial | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [editUploading, setEditUploading] = useState(false);
    const [selectedEditFile, setSelectedEditFile] = useState<File | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [editForm, setEditForm] = useState<EditFormType>({
        filename: "",
        urls: [""],
        description: "",
        fileTypes: [],
        visibility: "public",
        tags: []
    });
    const [editError, setEditError] = useState<string | null>(null);
    const [viewedMaterials, setViewedMaterials] = useState<string[]>([]);

    useEffect(() => {
        fetchStudyMaterials(subjectId, roadmapId);
    }, [subjectId, roadmapId, fetchStudyMaterials]);

    useEffect(() => {
        const viewed = localStorage.getItem('viewedStudyMaterials');
        if (viewed) {
            setViewedMaterials(JSON.parse(viewed));
        }
    }, []);

    const handleEdit = (material: StudyMaterial) => {
        setEditingMaterial(material);
        setSelectedEditFile(null);
        setEditError(null);
        setEditForm({
            filename: material.filename,
            urls: material.urls,
            description: material.description || "",
            fileTypes: material.fileTypes,
            visibility: material.visibility as "public" | "private",
            tags: material.tags || []
        });
    };

    const uploadEditFile = async (file: File): Promise<string | null> => {
        setEditUploading(true);
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
            setEditUploading(false);
        }
    };

    const isValidUrl = (url: string): boolean => {
        const urlPattern = /^(https?:\/\/)/i;
        return urlPattern.test(url);
    };

    const handleFileTypeEditChange = (value: FileType) => {
        setEditForm({ ...editForm, fileTypes: [value] });
        if (value === "other") {
            setSelectedEditFile(null);
        } else {
            setEditForm(prev => ({ ...prev, urls: [""] }));
            setSelectedEditFile(null);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingMaterial) return;
        const isUnique = !studyMaterials.some(m => m._id !== editingMaterial._id && m.filename.toLowerCase() === editForm.filename.toLowerCase());
        if (!isUnique) {
            setEditError("Material name must be unique.");
            return;
        }
        setEditError(null);
        setIsSaving(true);
        try {
            let finalUrls = editForm.urls || [];
            if (editForm.fileTypes?.[0] !== "other" && selectedEditFile) {
                const uploadedUrl = await uploadEditFile(selectedEditFile);
                if (!uploadedUrl) return;
                finalUrls = [uploadedUrl];
                setEditForm({ ...editForm, urls: finalUrls });
            } else if (editForm.fileTypes?.[0] === "other") {
                if (!editForm.urls?.[0]) {
                    setEditError("Please enter a URL for other file type.");
                    return;
                }
                if (!isValidUrl(editForm.urls[0])) {
                    setEditError("Please enter a valid URL (must start with http:// or https://).");
                    return;
                }
                finalUrls = [editForm.urls[0]];
            }

            await updateStudyMaterial(editingMaterial._id, { ...editForm, urls: finalUrls });
            setEditingMaterial(null);
            setSelectedEditFile(null);
            fetchStudyMaterials(subjectId, roadmapId);
        } catch (error) {
            // Handle error silently or with toast if needed
        } finally {
            setIsSaving(false);
        }
    };

    const handleView = (material: StudyMaterial) => {
        setViewingMaterial(material);
        if (!viewedMaterials.includes(material._id)) {
            const updatedViewed = [...viewedMaterials, material._id];
            setViewedMaterials(updatedViewed);
            localStorage.setItem('viewedStudyMaterials', JSON.stringify(updatedViewed));
        }
    };

    const handleShare = async (material: StudyMaterial) => {
        const shareUrl = material.urls?.[0] || window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: material.filename,
                    text: material.description || 'Check out this study material!',
                    url: shareUrl,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Link copied to clipboard!');
            }).catch(() => {
                alert('Sharing not supported on this device.');
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteStudyMaterial(id);
            fetchStudyMaterials(subjectId, roadmapId);
        } catch (error) {
            console.error("Failed to delete study material:", error);
        }
    };

    return {
        studyMaterials,
        loading,
        editingMaterial,
        setEditingMaterial,
        viewingMaterial,
        setViewingMaterial,
        isSaving,
        editUploading,
        selectedEditFile,
        setSelectedEditFile,
        currentPage,
        setCurrentPage,
        editForm,
        setEditForm,
        editError,
        viewedMaterials,
        handleEdit,
        uploadEditFile,
        handleFileTypeEditChange,
        handleSaveEdit,
        handleView,
        handleShare,
        handleDelete
    };
};
