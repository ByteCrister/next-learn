"use client";

import React, { useState } from "react";
import { FiTrash2, FiAlertTriangle, FiX, FiCheck } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
    children: React.ReactNode;
    batchName?: string;
    onConfirm: () => Promise<void> | void;
};

export default function DeleteBatchAlert({ children, batchName = "this batch", onConfirm }: Props) {
    const [loading, setLoading] = useState(false);

    async function handleConfirm() {
        try {
            setLoading(true);
            await onConfirm();
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div>{children}</div>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-lg rounded-2xl p-6 bg-white shadow-lg">
                <AlertDialogHeader className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-sm">
                            <FiTrash2 className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                            Delete <span className="font-medium text-rose-600">{batchName}</span>?
                        </AlertDialogTitle>

                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                            This will soft-delete the batch. Records remain recoverable only if you implement a restore endpoint on the
                            server. This action cannot be undone from the UI.
                        </p>

                        <div className="mt-3 inline-flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                            <FiAlertTriangle className="w-4 h-4" />
                            <span>Soft delete only — implement server restore to recover data</span>
                        </div>
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-6 flex items-center justify-end gap-3">
                    <AlertDialogCancel asChild>
                        <Button variant="ghost" className="inline-flex items-center gap-2 px-4 py-2">
                            <FiX className="w-4 h-4 text-muted-foreground" />
                            Cancel
                        </Button>
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <Button
                            onClick={handleConfirm}
                            disabled={loading}
                            className={
                                "inline-flex items-center gap-2 px-4 py-2 rounded-md shadow-sm " +
                                (loading
                                    ? "bg-rose-700 text-white hover:bg-rose-700/95 focus-visible:ring-2 focus-visible:ring-rose-300/60"
                                    : "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-2 focus-visible:ring-rose-300/50")
                            }
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="w-4 h-4 animate-spin text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        aria-hidden
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    Deleting…
                                </>
                            ) : (
                                <>
                                    <FiCheck className="w-4 h-4" />
                                    Delete
                                </>
                            )}
                        </Button>
                    </AlertDialogAction>

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
