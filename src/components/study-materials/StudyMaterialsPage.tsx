"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, BookOpen, Search, SortAsc, SortDesc, Grid3X3, List, Eye, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StudyMaterialUpload from "@/components/study-materials/StudyMaterialUpload";
import StudyMaterialList from "@/components/study-materials/StudyMaterialList";
import { FileType } from "@/types/types.studymaterials";
import { decodeId } from "@/utils/helpers/IdConversion";

export default function StudyMaterialsPage({ subjectId }: { subjectId: string }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [visibilityFilter, setVisibilityFilter] = useState<"all" | "public" | "private">("all");

    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [fileTypeFilter, setFileTypeFilter] = useState<"all" | FileType>("all");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");

    if (!subjectId || typeof subjectId !== "string") {
        return <div className="flex justify-center items-center h-screen text-gray-500">Invalid subject ID</div>;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                stiffness: 100,
                damping: 10
            }
        }
    };

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    const handleVisibilityFilter = (filter: "all" | "public" | "private") => {
        setVisibilityFilter(filter);
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header with Back Button */}
                <motion.div variants={itemVariants} className="mb-8">
                    <Link href={`/subjects/${decodeId(encodeURIComponent(subjectId))}`}>
                        <Button variant="outline" className="mb-4 flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Subject
                        </Button>
                    </Link>
                    <motion.h1
                        className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Study Materials
                    </motion.h1>
                    <p className="text-gray-600 text-lg">Manage and access your learning resources</p>
                </motion.div>

                {/* Upload Section */}
                <motion.div variants={itemVariants} className="mb-8">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
                                <Upload className="h-6 w-6 text-indigo-600" />
                                Upload New Material
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StudyMaterialUpload subjectId={subjectId} />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Search and Filters */}
                <motion.div variants={itemVariants} className="mb-6">
                    <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4 items-center">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search study materials..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border-gray-200 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                        <Button
                                            variant={visibilityFilter === "all" ? "default" : "outline"}
                                            size="sm"
                                            className="flex items-center gap-1 cursor-pointer"
                                            onClick={() => handleVisibilityFilter("all")}
                                        >
                                            <BookOpen className="h-4 w-4" />
                                            All Types
                                        </Button>
                                    </motion.div>
                                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                        <Button
                                            variant={visibilityFilter === "public" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleVisibilityFilter("public")}
                                            className="flex items-center gap-1 cursor-pointer"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Public
                                        </Button>
                                    </motion.div>
                                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                        <Button
                                            variant={visibilityFilter === "private" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleVisibilityFilter("private")}
                                            className="flex items-center gap-1 cursor-pointer"
                                        >
                                            <Lock className="h-4 w-4" />
                                            Private
                                        </Button>
                                    </motion.div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Select value={fileTypeFilter} onValueChange={(value) => setFileTypeFilter(value as "all" | FileType)}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue placeholder="File Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="pdf">PDF</SelectItem>
                                            <SelectItem value="ppt">PPT</SelectItem>
                                            <SelectItem value="image">Image</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                            className="flex items-center gap-1 cursor-pointer"
                                        >
                                            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                            {sortOrder === "asc" ? "Asc" : "Desc"}
                                        </Button>
                                    </motion.div>
                                    <div className="flex gap-2 items-center">
                                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                            <Button
                                                variant={viewMode === "list" ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setViewMode("list")}
                                                className="flex items-center gap-1 cursor-pointer"
                                            >
                                                <List className="h-4 w-4" />
                                                List
                                            </Button>
                                        </motion.div>
                                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                            <Button
                                                variant={viewMode === "grid" ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setViewMode("grid")}
                                                className="flex items-center gap-1 cursor-pointer"
                                            >
                                                <Grid3X3 className="h-4 w-4" />
                                                Grid
                                            </Button>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Materials List */}
                <motion.div variants={itemVariants}>
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-6">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <BookOpen className="h-5 w-5" />
                                Your Study Materials
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <StudyMaterialList subjectId={subjectId} searchTerm={searchTerm} visibilityFilter={visibilityFilter} fileTypeFilter={fileTypeFilter} sortBy="filename" sortOrder={sortOrder} viewMode={viewMode} />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
