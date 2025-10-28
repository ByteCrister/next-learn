// app/batches/new/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateBatchPayload } from "@/types/types.batch";
import { useBatches } from "@/hooks/useBatches";
import { toast } from "react-toastify";
import BatchForm from "../BatchForm";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";

export default function NewBatchPage() {
    const router = useRouter();
    const { createBatch } = useBatches();
    const [submitting, setSubmitting] = useState(false);

    const initial = { name: "", program: "", year: "", notes: "" };
    const { setBreadcrumbs } = useBreadcrumbStore();

    useEffect(() => {
        setBreadcrumbs([
            { label: 'Home', href: '/' },
            { label: 'Batches', href: '/batches' },
            { label: 'Create', href: '/batches/new' },
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleSubmit(values: CreateBatchPayload) {
        setSubmitting(true);
        try {
            toast.success("Batch created");
            const created = await createBatch(values);
            router.push(`/batches/${created._id}`);
        } catch (error: unknown) {
            // use the error so eslint doesn't complain; keep it typed as unknown
            console.error("Create batch failed", error);
            toast.error("Failed to create batch");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="max-w-2xl mx-auto p-6">
            <BatchForm
                initialValues={initial}
                onSubmit={handleSubmit}
                submitLabel="Create batch"
                submitting={submitting}
            />
        </main>
    );
}
