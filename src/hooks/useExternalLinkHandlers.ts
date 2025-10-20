import { useEffect, useState } from "react";
import { useExternalLinkStore } from "@/store/useExternalLinkStore";
import { IExternalLink, LinkCategory } from "@/models/ExternalLink";

interface UseExternalLinkHandlersProps {
    subjectId?: string;
}

export const useExternalLinkHandlers = ({ subjectId }: UseExternalLinkHandlersProps) => {
    const { externalLinks, loading, fetchExternalLinks, editExternalLink, deleteExternalLink, markAsViewed } = useExternalLinkStore();

    const [editingLink, setEditingLink] = useState<IExternalLink | null>(null);
    const [viewingLink, setViewingLink] = useState<IExternalLink | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [openForm, setOpenForm] = useState(false);
    const [viewedExternalLinks, setViewedExternalLinks] = useState<string[]>([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<"all" | LinkCategory>("all");
    const [sortBy, setSortBy] = useState<"title" | "category" | "date">("title");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

    useEffect(() => {
        fetchExternalLinks(subjectId);
    }, [subjectId, fetchExternalLinks]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter, sortBy, sortOrder, viewMode]);

    useEffect(() => {
        const viewed = localStorage.getItem('viewedExternalLinks');
        if (viewed) {
            setViewedExternalLinks(JSON.parse(viewed));
        }
    }, []);

    const filteredLinks = externalLinks.filter(link => {
        const matchesSearch = !searchTerm ||
            link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            link.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "all" || link.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const sortedLinks = [...filteredLinks].sort((a, b) => {
        if (sortBy === "date") {
            const aDate = new Date(a.addedAt);
            const bDate = new Date(b.addedAt);
            return sortOrder === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
        }
        let aVal: string, bVal: string;
        switch (sortBy) {
            case "title":
                aVal = a.title.toLowerCase();
                bVal = b.title.toLowerCase();
                break;
            case "category":
                aVal = a.category;
                bVal = b.category;
                break;
            default:
                return 0;
        }
        if (sortOrder === "asc") {
            return aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
        } else {
            return bVal.localeCompare(aVal, undefined, { numeric: true, sensitivity: 'base' });
        }
    });

    const itemsPerPage = viewMode === "list" ? 3 : 6;
    const totalPages = Math.ceil(sortedLinks.length / itemsPerPage);
    const paginatedLinks = sortedLinks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getPageNumbers = () => {
        const pages = [];
        const delta = 2; // Number of pages to show around current page

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > delta + 2) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - delta);
            const end = Math.min(totalPages - 1, currentPage + delta);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - delta - 1) {
                pages.push('...');
            }

            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handleEdit = (link: IExternalLink) => {
        setEditingLink(link);
        setOpenForm(true);
    };

    const handleView = async (link: IExternalLink) => {
        setViewingLink(link);
        if (link.isNew) {
            await markAsViewed(link._id as string);
        }
        if (!viewedExternalLinks.includes(link._id as string)) {
            const updatedViewed = [...viewedExternalLinks, link._id as string];
            setViewedExternalLinks(updatedViewed);
            localStorage.setItem('viewedExternalLinks', JSON.stringify(updatedViewed));
        }
        window.open(link.url, "_blank");
    };

    const handleShare = async (link: IExternalLink) => {
        const shareUrl = link.url;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: link.title,
                    text: link.description || 'Check out this external link!',
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
        await deleteExternalLink(id);
    };

    const handleFormSubmit = async (linkData: any) => {
        if (editingLink) {
            await editExternalLink((editingLink._id as string), linkData);
            setEditingLink(null);
        }
        setOpenForm(false);
    };

    return {
        externalLinks,
        loading,
        editingLink,
        setEditingLink,
        viewingLink,
        setViewingLink,
        currentPage,
        setCurrentPage,
        openForm,
        setOpenForm,
        viewedExternalLinks,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        viewMode,
        setViewMode,
        filteredLinks,
        sortedLinks,
        paginatedLinks,
        totalPages,
        getPageNumbers,
        handleEdit,
        handleView,
        handleShare,
        handleDelete,
        handleFormSubmit,
    };
};
