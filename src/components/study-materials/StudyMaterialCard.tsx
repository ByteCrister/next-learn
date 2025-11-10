"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { FileType } from "@/types/types.studymaterials";
import { ExternalLink, Edit, Trash, Eye, Lock, FileText, Presentation, Image as ImageIcon, File, Sparkles } from "lucide-react";
import { ShareStudyMaterialButton } from "./ShareStudyMaterialButton";

interface StudyMaterialCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    material: any;
    viewedMaterials: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onView: (material: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onEdit: (material: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onShare: (material: any) => void;
    onDelete: (id: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buttonVariants: any;
}

const getFileTypeIcon = (fileType: FileType) => {
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

const getFileTypeTheme = (fileType: FileType) => {
    switch (fileType) {
        case "pdf":
            return "border-red-200 bg-red-50 hover:bg-red-100";
        case "ppt":
            return "border-orange-200 bg-orange-50 hover:bg-orange-100";
        case "image":
            return "border-green-200 bg-green-50 hover:bg-green-100";
        case "other":
        default:
            return "border-gray-200 bg-gray-50 hover:bg-gray-100";
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function StudyMaterialCard({ material, viewedMaterials, onView, onEdit, onShare, onDelete, buttonVariants }: StudyMaterialCardProps) {
    return (
        <motion.div
            key={material._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
        >
            <Card className={`border-0 h-full ${getFileTypeTheme(material.fileTypes?.[0] || "other")}`}>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <CardTitle className="text-lg font-semibold truncate flex items-center gap-2">
                                {getFileTypeIcon(material.fileTypes?.[0] || "other")}
                                {material.filename}
                                {new Date(material.uploadedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && !viewedMaterials.includes(material._id) && (
                                    <Badge variant="destructive" className="text-xs">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        New
                                    </Badge>
                                )}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                <span className="capitalize">{material.fileTypes?.[0] || "other"}</span>
                                {material.visibility === "public" ? (
                                    <Eye className="h-3 w-3 ml-2" />
                                ) : (
                                    <Lock className="h-3 w-3 ml-2" />
                                )}
                            </div>
                        </div>
                        <TooltipProvider>
                            <div className="flex gap-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 cursor-pointer"
                                                onClick={() => onView(material)}
                                                disabled={!material.urls?.length}
                                                aria-label="Open material"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>View</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 rounded-full hover:bg-blue-50 cursor-pointer"
                                                onClick={() => onEdit(material)}
                                                aria-label="Edit material"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>Edit</TooltipContent>
                                </Tooltip>
                                {material.visibility === "public" && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                                <ShareStudyMaterialButton
                                                    subjectId={material.subjectId}
                                                    studyMaterialId={material._id}
                                                />
                                            </motion.div>
                                        </TooltipTrigger>
                                        <TooltipContent>Share</TooltipContent>
                                    </Tooltip>
                                )}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 rounded-full hover:bg-red-50 cursor-pointer"
                                                        aria-label="Delete material"
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete &quot;{material.filename}&quot;? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-red-600 hover:bg-red-700"
                                                            onClick={() => {
                                                                onDelete(material._id);
                                                            }}
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete</TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{material.fileTypes?.[0] || "other"}</Badge>
                        <Badge variant={material.visibility === "public" ? "default" : "outline"} className="text-xs">
                            {material.visibility}
                        </Badge>
                    </div>
                    {material.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {material.tags.map((tag: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">Uploaded {new Date(material.uploadedAt).toLocaleDateString()}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
}