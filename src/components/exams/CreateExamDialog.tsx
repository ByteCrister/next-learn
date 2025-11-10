"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useExamStore } from "@/store/useExamStore";
import { v4 as uuidv4 } from "uuid";
import { useDashboardStore } from "@/store/useDashboardStore";
import { FiType, FiFileText, FiHash } from "react-icons/fi"
import { Variants, motion } from "framer-motion";
export function generateShortUUID() {
    return uuidv4().replace(/-/g, "").slice(0, 10).toUpperCase();
}

const schema = z.object({
    title: z.string().min(2, "Title is required"),
    description: z.string().optional(),
    subjectCode: z.string().min(6, "Subject code is required"),
    examCode: z.string().min(10, "Exam code is required"),
});

export function CreateExamDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);
    const { create } = useExamStore();
    const { updateCounts } = useDashboardStore();

    const fadeIn: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" }
        })
    }

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            description: "",
            subjectCode: "",
            examCode: "",
        },
    });

    // Generate UUID when dialog opens
    React.useEffect(() => {
        if (open) {
            form.setValue("examCode", generateShortUUID());
        }
    }, [open, form]);

    const onSubmit = async (values: z.infer<typeof schema>) => {
        const isNew = await create(values);
        if (isNew) {
            updateCounts('examCount', '+')
            toast.success("Exam created");
            setOpen(false);
            form.reset({
                title: "",
                description: "",
                subjectCode: "",
                examCode: "",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create exam</DialogTitle>
                    <DialogDescription>
                        Provide the basics. You can enrich details later.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid gap-5 py-1"
                >
                    {/** Title */}
                    <motion.div
                        className="grid gap-2"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                    >
                        <Label
                            htmlFor="title"
                            className="flex items-center gap-2 font-semibold text-sm text-slate-700 dark:text-slate-200"
                        >
                            <FiType className="h-4 w-4 text-blue-500" />
                            Title
                        </Label>
                        <Input
                            id="title"
                            placeholder="Enter exam title"
                            {...form.register("title")}
                            className="focus:ring-2 focus:ring-blue-500/50"
                        />
                        {form.formState.errors.title && (
                            <p className="text-xs text-red-500">
                                {form.formState.errors.title.message}
                            </p>
                        )}
                    </motion.div>

                    {/** Description */}
                    <motion.div
                        className="grid gap-2"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                    >
                        <Label
                            htmlFor="description"
                            className="flex items-center gap-2 font-semibold text-sm text-slate-700 dark:text-slate-200"
                        >
                            <FiFileText className="h-4 w-4 text-blue-500" />
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            rows={3}
                            placeholder="Short exam description"
                            {...form.register("description")}
                            className="focus:ring-2 focus:ring-blue-500/50"
                        />
                    </motion.div>

                    {/** Codes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div
                            className="grid gap-2"
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                            custom={2}
                        >
                            <Label
                                htmlFor="subjectCode"
                                className="flex items-center gap-2 font-semibold text-sm text-slate-700 dark:text-slate-200"
                            >
                                <FiHash className="h-4 w-4 text-blue-500" />
                                Subject code
                            </Label>
                            <Input
                                id="subjectCode"
                                placeholder="e.g. MATH101"
                                {...form.register("subjectCode")}
                                className="focus:ring-2 focus:ring-blue-500/50"
                            />
                            {form.formState.errors.subjectCode && (
                                <p className="text-xs text-red-500">
                                    {form.formState.errors.subjectCode.message}
                                </p>
                            )}
                        </motion.div>

                        <motion.div
                            className="grid gap-2"
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                            custom={3}
                        >
                            <Label
                                htmlFor="examCode"
                                className="flex items-center gap-2 font-semibold text-sm text-slate-700 dark:text-slate-200"
                            >
                                <FiHash className="h-4 w-4 text-blue-500" />
                                Exam code
                            </Label>
                            <Input
                                id="examCode"
                                readOnly
                                {...form.register("examCode")}
                                className="bg-slate-50 dark:bg-slate-800"
                            />
                            {form.formState.errors.examCode && (
                                <p className="text-xs text-red-500">
                                    {form.formState.errors.examCode.message}
                                </p>
                            )}
                        </motion.div>
                    </div>

                    {/** Footer */}
                    <DialogFooter className="mt-4 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="
      rounded-md
      border-slate-300 dark:border-slate-600
      text-slate-700 dark:text-slate-200
      hover:bg-slate-100 dark:hover:bg-slate-800
      transition-all duration-300 ease-out
      hover:shadow-sm hover:scale-[1.02]
      active:scale-[0.98]
    "
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                            className="
      rounded-md
      bg-gradient-to-r from-blue-600 to-blue-500
      dark:from-blue-500 dark:to-blue-400
      text-white
      shadow-sm
      transition-all duration-300 ease-out
      hover:from-blue-500 hover:to-blue-400
      dark:hover:from-blue-400 dark:hover:to-blue-300
      hover:shadow-md hover:scale-[1.03]
      active:scale-[0.98]
      disabled:opacity-60 disabled:cursor-not-allowed
    "
                        >
                            {form.formState.isSubmitting ? "Creating…" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
