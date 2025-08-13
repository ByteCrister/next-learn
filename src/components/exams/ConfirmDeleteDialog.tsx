"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useExamStore } from "@/store/useExamStore";

interface ConfirmDeleteDialogProps {
    examId: string;
    children?: React.ReactNode;
    asChild?: boolean;
    onConfirm?: () => Promise<void> | void;
}

export function ConfirmDeleteDialog({
    examId,
    children,
    asChild,
    onConfirm,
}: ConfirmDeleteDialogProps) {
    const [open, setOpen] = React.useState(false);
    const { remove } = useExamStore();
    const router = useRouter();

    const handleDelete = async () => {
        if (onConfirm) {
            await onConfirm();
        } else {
            await remove(examId);
            toast.success("Exam deleted");
            router.push("/exams");
        }
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild={asChild}>
                {children ?? <Button variant="destructive">Delete</Button>}
            </AlertDialogTrigger>

            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold text-red-700">Delete this exam?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-muted-foreground">
                        This action cannot be undone. All questions, settings, and results
                        for this exam will be permanently removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-end gap-2">
                    <AlertDialogCancel className="bg-gray-200 text-gray-900 hover:bg-gray-300">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                    >
                        Yes, delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    );
}
