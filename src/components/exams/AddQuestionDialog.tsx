"use client";

import * as React from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ExamDTO, Question } from "@/types/types.exam";
import { toast } from "react-toastify";
import { useExamStore } from "@/store/useExamStore";
import NextImage from "next/image";
import { motion } from 'framer-motion'
import { FiX } from "react-icons/fi"

// Compress image
export async function compressImage(file: File, maxWidth = 1024, quality = 0.7): Promise<File> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const scale = Math.min(maxWidth / img.width, 1);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject("Canvas context failed");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                if (!blob) return reject("Compression failed");
                resolve(new File([blob], file.name, { type: file.type }));
            }, file.type, quality);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

// Zod schema
export const schema = z.object({
    contents: z.array(
        z.object({
            type: z.enum(["text", "image"]),
            value: z.string().min(1, "Content is required"),
        })
    ).min(1, "At least one content is required"),
    choices: z
        .array(z.object({ text: z.string().min(1, "Choice text required") }))
        .min(2, "At least 2 choices")
        .max(4, "No more than 4 choices allowed"),
    correctIndex: z.coerce.number().min(0),
});

export function AddQuestionDialog({ exam, asChild }: { exam: ExamDTO; asChild?: boolean; children?: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);
    const { update } = useExamStore();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            contents: [{ type: "text", value: "" }],
            choices: [{ text: "" }, { text: "" }],
            correctIndex: 0,
        },
    });

    const { fields: choiceFields, append: appendChoice, remove: removeChoice } = useFieldArray({ control: form.control, name: "choices" });
    const { fields: contentFields, append: appendContent, remove: removeContent } = useFieldArray({ control: form.control, name: "contents" });

    // Handle image upload
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 10MB limit`);
                continue;
            }
            const compressed = await compressImage(file);
            const reader = new FileReader();
            reader.onload = () => {
                appendContent({ type: "image", value: reader.result as string });
            };
            reader.readAsDataURL(compressed);
        }
    };

    const onSubmit = async (values: z.infer<typeof schema>) => {
        const newQ: Question = {
            contents: values.contents,
            choices: values.choices.map((c, idx) => ({ text: c.text, isCorrect: idx === values.correctIndex })),
        };
        const payload = { questions: [...exam.questions, newQ] };
        const isAdded = await update(exam._id, payload);
        if (isAdded) toast.success("Question added");
        setOpen(false);
        form.reset();
    };

    const Trigger = DialogTrigger as React.FC<React.ComponentProps<typeof DialogTrigger>>;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Trigger asChild={asChild}>
                <Button variant="default">Add question</Button>
            </Trigger>
            <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add question</DialogTitle>
                    <DialogDescription>Combine text and images with optional captions.</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    {contentFields.map((field, idx) => (
                        <div key={field.id} className="grid gap-2">
                            {field.type === "text" ? (
                                <>
                                    <Label>Text</Label>
                                    <Input
                                        {...form.register(`contents.${idx}.value` as const)}
                                        placeholder="Enter text"
                                    />
                                </>
                            ) : (
                                <>
                                    <Label>Image</Label>
                                    <div className="relative w-40 h-40 border rounded overflow-hidden">
                                        <NextImage
                                            src={field.value}
                                            alt={`image-${idx}`}
                                            height={150}
                                            width={100}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Polished Remove Button */}
                                        <motion.button
                                            type="button"
                                            onClick={() => removeContent(idx)}
                                            aria-label="Remove image"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="
      absolute top-2 right-2
      p-1
      bg-white/80 hover:bg-white
      text-red-600
      rounded-full
      shadow-md
      focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400
      transition-colors
    "
                                        >
                                            <FiX className="w-4 h-4" aria-hidden="true" />
                                        </motion.button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    <div>
                        <Label>Upload images (max 10MB each)</Label>
                        <Input type="file" accept="image/*" multiple onChange={handleImageUpload} />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <div className="text-sm font-medium">Choices</div>
                        <div className="space-y-2">
                            {choiceFields.map((f, idx) => (
                                <div key={f.id} className="flex items-center gap-2">
                                    <Input placeholder={`Choice ${idx + 1}`} {...form.register(`choices.${idx}.text` as const)} />
                                    <label className="flex items-center gap-1 text-xs">
                                        <input
                                            type="radio"
                                            className="accent-primary"
                                            checked={form.watch("correctIndex") === idx}
                                            onChange={() => form.setValue("correctIndex", idx)}
                                        />
                                        Correct
                                    </label>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeChoice(idx)} disabled={choiceFields.length <= 2}>
                                        ✕
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendChoice({ text: "" })}
                            disabled={choiceFields.length >= 4}
                        >
                            + Add choice
                        </Button>
                        {choiceFields.length >= 4 && (
                            <p className="text-xs text-red-500">Maximum 4 choices allowed.</p>
                        )}
                    </div>

                    <DialogFooter className="mt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Adding…" : "Add question"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
