"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { ExternalLinkInput, useExternalLinkStore } from "@/store/useExternalLinkStore";
import { LinkCategory } from "@/models/ExternalLink";
import { ArrowLeft, Plus, Search, SortAsc, SortDesc, Grid3X3, List } from "lucide-react";
import ExternalLinkList from "@/components/external-links/ExternalLinkList";
import ExternalLinkForm from "@/components/external-links/ExternalLinkForm";

export default function ExternalLinksPage({ subjectId }: { subjectId: string }) {
    const router = useRouter();
    const { addExternalLink, loading, fetchExternalLinks, externalLinks } = useExternalLinkStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<"all" | LinkCategory>("all");
    const [sortBy, setSortBy] = useState<"title" | "category" | "date">("title");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
    const [openForm, setOpenForm] = useState(false);

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    const handleAddLink = async (linkData: ExternalLinkInput) => {
        await addExternalLink(linkData);
        await fetchExternalLinks(subjectId as string);
        setOpenForm(false);
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
                >
                    <div className="flex items-center gap-4">
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.back()}
                                className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </motion.div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">External Links</h1>
                            <p className="text-gray-600 mt-1">Manage your external resources and references</p>
                        </div>
                    </div>
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button
                            onClick={() => setOpenForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                            Add Link
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-lg shadow-sm border p-6 mb-6"
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search links..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="w-full lg:w-48">
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as "all" | LinkCategory)}>
                                    <SelectTrigger className="cursor-pointer">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all" className="cursor-pointer">All Categories</SelectItem>
                                        {categoryOptions.map((cat) => (
                                            <SelectItem key={cat} value={cat} className="cursor-pointer">
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </motion.div>
                        </div>

                        {/* Sort By */}
                        <div className="w-full lg:w-32">
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Select value={sortBy} onValueChange={(value) => setSortBy(value as "title" | "category" | "date")}>
                                    <SelectTrigger className="cursor-pointer">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="title" className="cursor-pointer">Title</SelectItem>
                                        <SelectItem value="category" className="cursor-pointer">Category</SelectItem>
                                        <SelectItem value="date" className="cursor-pointer">Date</SelectItem>
                                    </SelectContent>
                                </Select>
                            </motion.div>
                        </div>

                        {/* Sort Order */}
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                            <Button
                                variant="outline"
                                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                {sortOrder === "asc" ? "Asc" : "Desc"}
                            </Button>
                        </motion.div>

                        {/* View Mode */}
                        <div className="flex border rounded-md">
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Button
                                    variant={viewMode === "list" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                    className="rounded-r-none cursor-pointer"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </motion.div>
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                    className="rounded-l-none cursor-pointer"
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Links List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <ExternalLinkList
                        subjectId={subjectId as string}
                        searchTerm={searchTerm}
                        categoryFilter={categoryFilter}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        viewMode={viewMode}
                    />
                </motion.div>

                {/* Add Link Form */}
                <ExternalLinkForm
                    open={openForm}
                    onOpenChange={setOpenForm}
                    subjectId={subjectId as string}
                    onSubmit={handleAddLink}
                    loading={loading}
                    existingLinks={externalLinks}
                />
            </div>
        </div>
    );
}
