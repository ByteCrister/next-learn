"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { AlertCircleIcon } from "lucide-react";

export default function ImageSizeAlert({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: (b: boolean) => void;
}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex gap-2 text-destructive items-center">
                        <AlertCircleIcon className="w-5 h-5" />
                        Image too large
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        File exceeds <strong>50MB</strong>. Please pick something lighter.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Okay</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
