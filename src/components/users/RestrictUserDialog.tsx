"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { addDays, formatISO } from "date-fns";
import { useUsersStore } from "@/store/useUsersStore";
import { RestrictionType } from "@/types/types.users";

export function RestrictUserDialog({
    userId,
    restrictionIndex,
    onOpenChange,
}: {
    userId: string | null;
    restrictionIndex: number;
    onOpenChange: (open: boolean) => void;
}) {
    const open = Boolean(userId);
    const { patchRestriction } = useUsersStore();

    const [type, setType] = useState<"temporary" | "permanent">("temporary");
    const [reason, setReason] = useState("");
    const [expiresAt, setExpiresAt] = useState(formatISO(addDays(new Date(), 7)));

    // Reset fields when dialog opens
    useEffect(() => {
        if (open) {
            setType("temporary");
            setReason("");
            setExpiresAt(formatISO(addDays(new Date(), 7)));
        }
    }, [open]);

    const submit = async () => {
        if (!userId) return;
        const ok = await patchRestriction({
            userId,
            restrictionIndex,
            updates: {
                type,
                reason,
                expiresAt: type === "temporary" ? expiresAt : undefined,
            },
        });
        if (ok) onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        Add Restriction
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Type */}
                    <div className="space-y-1.5">
                        <Label className="text-gray-700 dark:text-gray-300">Type</Label>
                        <Select value={type} onValueChange={(v: RestrictionType) => setType(v)}>
                            <SelectTrigger className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-800">
                                <SelectItem value="temporary">Temporary</SelectItem>
                                <SelectItem value="permanent">Permanent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Expires at */}
                    {type === "temporary" && (
                        <div className="space-y-1.5">
                            <Label className="text-gray-700 dark:text-gray-300">Expires At</Label>
                            <Input
                                type="datetime-local"
                                value={expiresAt.slice(0, 16)}
                                onChange={(e) => setExpiresAt(new Date(e.target.value).toISOString())}
                                className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    )}

                    {/* Reason */}
                    <div className="space-y-1.5">
                        <Label className="text-gray-700 dark:text-gray-300">Reason</Label>
                        <Input
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason for restriction"
                            className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex justify-end">
                        <Button
                            onClick={submit}
                            className="bg-rose-600 hover:bg-rose-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Restrict
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
