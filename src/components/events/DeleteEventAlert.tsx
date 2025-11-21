'use client';
import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmAlertProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

export function DeleteEventAlert({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Delete',
    description = 'Are you sure you want to delete this? This action cannot be undone.',
}: ConfirmAlertProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg">
                <DialogTitle className="text-lg font-semibold text-red-600">{title}</DialogTitle>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2">{description}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <Button type='button' variant="outline" onClick={onClose} className="px-4 py-2 rounded-lg">
                        Cancel
                    </Button>
                    <Button
                        type='button'
                        variant="destructive"
                        onClick={onConfirm} // only call handleDelete
                        className="px-4 py-2 rounded-lg"
                    >
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}