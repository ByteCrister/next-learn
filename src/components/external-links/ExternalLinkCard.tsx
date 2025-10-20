"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { IExternalLink } from "@/models/ExternalLink";
import { Edit, Trash, ExternalLink as ExternalLinkIcon, Eye, Sparkles, Share } from "lucide-react";

interface ExternalLinkCardProps {
    link: IExternalLink;
    viewedExternalLinks: string[];
    onView: (link: IExternalLink) => void;
    onEdit: (link: IExternalLink) => void;
    onShare: (link: IExternalLink) => void;
    onDelete: (id: string) => void;
    buttonVariants: any;
    index: number;
}

export default function ExternalLinkCard({ link, viewedExternalLinks, onView, onEdit, onShare, onDelete, buttonVariants, index }: ExternalLinkCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group overflow-hidden rounded-xl border border-gray-200/60 shadow-sm hover:shadow-xl transition-all duration-300 bg-white hover:bg-blue-100"
            whileHover={{ y: -4, scale: 1.02 }}
        >
            <Card className="border-0 h-full bg-transparent">
                <CardHeader className="pb-4 pt-6 px-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-bold truncate flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                                    <ExternalLinkIcon className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="truncate">{link.title}</span>
                                {new Date(link.addedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && !viewedExternalLinks.includes(link._id as string) && (
                                    <Badge variant="destructive" className="text-xs animate-pulse">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        New
                                    </Badge>
                                )}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                                    {link.category}
                                </Badge>
                            </div>
                        </div>
                        <TooltipProvider>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
                                                onClick={() => onView(link)}
                                                aria-label="Open link"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>View Link</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors cursor-pointer"
                                                onClick={() => onEdit(link)}
                                                aria-label="Edit link"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>Edit Link</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-colors cursor-pointer"
                                                onClick={() => onShare(link)}
                                                aria-label="Share link"
                                            >
                                                <Share className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>Share Link</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-9 w-9 p-0 rounded-full hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer"
                                                        aria-label="Delete link"
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Link</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to permanently delete "{link.title}"? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-red-600 hover:bg-red-700 cursor-pointer"
                                                            onClick={() => onDelete((link._id as string))}
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete Link</TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </div>
                </CardHeader>
                <CardContent className="pt-0 pb-6 px-6">
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">{link.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Added {new Date(link.addedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Active</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
