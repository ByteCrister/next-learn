"use client";

import * as React from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ExamDTO, Question } from "@/types/types.exam";
import { toast } from "react-toastify";
import { useExamStore } from "@/store/useExamStore";
import NextImage from "next/image";
import { compressImage, schema } from "./AddQuestionDialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "@/components/ui/alert-dialog";

interface UpdateQuestionDialogProps {
    exam: ExamDTO;
    questionIndex: number;
    open: boolean;
    onClose: () => void;
}

export function UpdateQuestionDialog({ exam, questionIndex, open, onClose }: UpdateQuestionDialogProps) {
    const { update, deleteQuestion } = useExamStore();
    // Get the question safely
    const question = exam.questions[questionIndex];

    // Initialize the form with either the question values or empty defaults
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            contents: question?.contents || [{ type: "text", value: "" }],
            choices: question?.choices.map(c => ({ text: c.text })) || [{ text: "" }, { text: "" }],
            correctIndex: question?.choices.findIndex(c => c.isCorrect) ?? 0,
        },
    });

    // If the question does not exist (deleted), return null early
    const { fields: choiceFields, append: appendChoice, remove: removeChoice } = useFieldArray({ control: form.control, name: "choices" });
    const { fields: contentFields, append: appendContent } = useFieldArray({ control: form.control, name: "contents" });

    const [deleteOpen, setDeleteOpen] = React.useState(false);

    if (!question) return null;

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
                appendContent({ type: "image", value: reader.result as string, caption: "" });
            };
            reader.readAsDataURL(compressed);
        }
    };

    const onSubmit = async (values: z.infer<typeof schema>) => {
        const updatedQuestion: Question = {
            contents: values.contents,
            choices: values.choices.map((c, idx) => ({ text: c.text, isCorrect: idx === values.correctIndex })),
        };

        const updatedQuestions = [...exam.questions];
        updatedQuestions[questionIndex] = updatedQuestion;

        await update(exam._id, { questions: updatedQuestions });
        toast.success("Question updated");
        onClose();
    };

    const handleDelete = async () => {
        await deleteQuestion(exam._id, questionIndex);
        toast.success("Question deleted");
        setDeleteOpen(false);
        onClose();
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Update question</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        {contentFields.map((field, idx) => (
                            <div key={field.id} className="grid gap-2">
                                {field.type === "text" ? (
                                    <>
                                        <Label>Text</Label>
                                        <Input {...form.register(`contents.${idx}.value` as const)} placeholder="Enter text" />
                                    </>
                                ) : (
                                    <>
                                        <Label>Image</Label>
                                        <div className="relative w-40 h-40 border rounded overflow-hidden">
                                            <NextImage src={field.value} alt={`image-${idx}`} height={150} width={100} className="w-full h-full object-cover" />
                                        </div>
                                        <Input {...form.register(`contents.${idx}.caption` as const)} placeholder="Optional caption" />
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
                            <Button type="button" variant="outline" size="sm" onClick={() => appendChoice({ text: "" })}>
                                + Add choice
                            </Button>
                        </div>

                        <DialogFooter className="mt-2 flex justify-between items-center w-full">
                            {/* Delete button on the left */}
                            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button type="button" variant="destructive" size="sm">Delete</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to delete this question?</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            {/* Cancel + Update buttons on the right */}
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? "Updating…" : "Update question"}
                                </Button>
                            </div>
                        </DialogFooter>

                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
