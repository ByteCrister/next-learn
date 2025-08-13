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

function generateShortUUID() {
    return uuidv4().replace(/-/g, "").slice(0, 10).toUpperCase();
}

const schema = z.object({
    title: z.string().min(2, "Title is required"),
    description: z.string().optional(),
    subjectCode: z.string().min(6, "Subject code is required"),
    examCode: z.string().min(1, "Exam code is required"),
});

export function CreateExamDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);
    const { create } = useExamStore();

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
        await create(values);
        toast.success("Exam created");
        setOpen(false);
        form.reset({
            title: "",
            description: "",
            subjectCode: "",
            examCode: "",
        });
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...form.register("title")} />
                        {form.formState.errors.title && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.title.message}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            rows={3}
                            {...form.register("description")}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="subjectCode">Subject code</Label>
                            <Input id="subjectCode" {...form.register("subjectCode")} />
                            {form.formState.errors.subjectCode && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.subjectCode.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="examCode">Exam code</Label>
                            <Input id="examCode" {...form.register("examCode")} disabled />
                            {form.formState.errors.examCode && (
                                <p className="text-sm text-destructive">
                                    {form.formState.errors.examCode.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Creating…" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
