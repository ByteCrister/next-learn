"use client";

import React, { useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator as UiSeparator } from "@/components/ui/separator";
import {
    Map as MapIcon,
    FileText as DescriptionIcon,
    Trash as TrashIcon,
} from "lucide-react";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PopoverClose } from "@radix-ui/react-popover";

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

const roadmapSchema = z.object({
    roadmapTitle: z.string().min(3, "Title must be at least 3 characters"),
    roadmapDescription: z
        .string()
        .min(10, "Description must be at least 10 characters"),
});
type RoadmapForm = z.infer<typeof roadmapSchema>;

interface RoadmapInfoCardProps {
    roadmapTitle: string;
    setRoadmapTitle: (v: string) => void;
    roadmapDescription: string;
    setRoadmapDescription: (v: string) => void;
    handleRoadmapSave: () => void;
    loading: boolean;
    showDelete?: boolean;
    onDeleteRoadmap?: () => void;
    loadingDelete?: boolean;
}

export default function RoadmapInfoCard({
    roadmapTitle,
    setRoadmapTitle,
    roadmapDescription,
    setRoadmapDescription,
    handleRoadmapSave,
    loading,
    showDelete = false,
    onDeleteRoadmap,
    loadingDelete = false,
}: RoadmapInfoCardProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RoadmapForm>({
        resolver: zodResolver(roadmapSchema),
        defaultValues: { roadmapTitle, roadmapDescription },
    });

    // Keep form in sync when parent props change
    useEffect(() => {
        reset({ roadmapTitle, roadmapDescription });
    }, [roadmapTitle, roadmapDescription, reset]);

    const onSubmit = (data: RoadmapForm) => {
        setRoadmapTitle(data.roadmapTitle);
        setRoadmapDescription(data.roadmapDescription);
        handleRoadmapSave();
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-lg mx-auto"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="bg-white/20 backdrop-blur-lg ring-1 ring-white/30 shadow rounded-2xl overflow-hidden">
                    <CardHeader className="px-8 pt-6 text-center">
                        <CardTitle className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                            Roadmap Info
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="px-8 space-y-6">
                        {/* Title Field */}
                        <div>
                            <label
                                htmlFor="roadmap-title"
                                className="flex items-center text-sm font-medium text-gray-700 mb-2"
                            >
                                <MapIcon className="mr-2 h-5 w-5 text-purple-400" strokeWidth={1.5} />
                                Title
                            </label>
                            <Input
                                id="roadmap-title"
                                placeholder="Enter roadmap title"
                                {...register("roadmapTitle")}
                                onChange={(e) => setRoadmapTitle(e.target.value)}
                                className={`
                  w-full
                  bg-white/60 backdrop-blur-sm
                  border-2 border-transparent
                  focus:border-purple-500
                  rounded-md
                  transition
                  ${errors.roadmapTitle ? "border-red-400" : ""}
                `}
                            />
                            {errors.roadmapTitle && (
                                <p className="mt-1 text-sm text-red-500">{errors.roadmapTitle.message}</p>
                            )}
                        </div>

                        <UiSeparator className="my-4" />

                        {/* Description Field */}
                        <div>
                            <label
                                htmlFor="roadmap-description"
                                className="flex items-center text-sm font-medium text-gray-700 mb-2"
                            >
                                <DescriptionIcon className="mr-2 h-5 w-5 text-purple-400" strokeWidth={1.5} />
                                Description
                            </label>
                            <Textarea
                                id="roadmap-description"
                                rows={4}
                                placeholder="Write a detailed roadmap description"
                                {...register("roadmapDescription")}
                                onChange={(e) => setRoadmapDescription(e.target.value)}
                                className={`
                  w-full
                  bg-white/60 backdrop-blur-sm
                  border-2 border-transparent
                  focus:border-purple-500
                  rounded-md
                  transition
                  resize-none
                  ${errors.roadmapDescription ? "border-red-400" : ""}
                `}
                            />
                            {errors.roadmapDescription && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.roadmapDescription.message}
                                </p>
                            )}
                        </div>
                    </CardContent>

                    <UiSeparator />

                    <CardFooter className="px-8 pb-6 flex flex-col gap-3">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition text-white"
                        >
                            {loading ? "Saving…" : "Save Info"}
                        </Button>

                        {showDelete && onDeleteRoadmap && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        disabled={loadingDelete}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <TrashIcon className="h-4 w-4" />{" "}
                                        {loadingDelete ? "Deleting…" : "Delete Roadmap"}
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent align="end" className="w-72 p-4">
                                    <h4 className="text-sm font-semibold text-red-600 select-none">
                                        Confirm Deletion
                                    </h4>
                                    <p className="mt-1 text-sm text-gray-700">
                                        This action cannot be undone. Are you sure you want to delete
                                        this roadmap?
                                    </p>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <PopoverClose asChild>
                                            <Button variant="outline" size="sm">
                                                Cancel
                                            </Button>
                                        </PopoverClose>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={onDeleteRoadmap}
                                            disabled={loadingDelete}
                                        >
                                            {loadingDelete ? "Deleting…" : "Delete"}
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </CardFooter>
                </Card>
            </form>
        </motion.div>
    );
}
