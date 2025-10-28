"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UpdateBatchPayload } from "@/types/types.batch";
import { useBatches } from "@/hooks/useBatches";
import { toast } from "react-toastify";
import BatchForm from "../BatchForm";

export default function UpdateBatchPage({ batchId }: { batchId: string; }) {
    const router = useRouter();
    const { fetchBatchById, currentBatch, updateBatch } = useBatches();
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBatchById(batchId).catch(() => { }).finally(() => setLoading(false));
    }, [batchId, fetchBatchById]);

    if (loading) return <div className="p-6">Loading...</div>;
    if (!currentBatch) return <div className="p-6 text-red-600">Batch not found.</div>;

    // initial values must follow BatchFormValues: strings only
    const initial = {
        name: currentBatch.name,
        program: currentBatch.program ?? "",
        year: currentBatch.year?.toString() ?? "",
        notes: currentBatch.notes ?? "",
    };

    return (
        <main className="max-w-2xl mx-auto p-6">
            <BatchForm
                mode="update"
                id={currentBatch._id}
                initialValues={initial}
                submitLabel="Update batch"
                submitting={submitting}
                // onSubmit must accept UpdateBatchPayload (discriminated prop ensures correct typing)
                onSubmit={async (payload: UpdateBatchPayload) => {
                    setSubmitting(true);
                    try {
                        await updateBatch(payload);
                        toast.success("Batch updated");
                        router.push(`/batches/${currentBatch._id}`);
                    } catch (err) {
                        toast.error("Failed to update batch");
                        throw err;
                    } finally {
                        setSubmitting(false);
                    }
                }}
            />
        </main>
    );
}
