"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BatchFormNested from "@/components/batches/nested-batch/BatchFormNested";
import { toast } from "react-toastify";
import { CreateCohortPayload } from "@/types/types.batch";
import { useBreadcrumbStore } from "@/store/useBreadcrumbStore";
import { encodeId } from "@/utils/helpers/IdConversion";
import { useBatchesStore } from "@/store/useBatchesStore";

export default function NewBatchPage() {
    const router = useRouter();
    const { createCohort } = useBatchesStore();
    const [submitting, setSubmitting] = useState(false);
    const { setBreadcrumbs } = useBreadcrumbStore();
    useEffect(() => {
        setBreadcrumbs([
            { label: "Home", href: "/" },
            { label: "Batches", href: "/batches" },
            { label: "Create New Batch", href: "/batches/new" },
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleCreate(payload: CreateCohortPayload) {
        setSubmitting(true);
        try {
            const created = await createCohort(payload);
            toast.success("Batch created");
            router.push(`/batches/${encodeId(encodeURIComponent(created._id))}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to create batch");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="max-w-4xl mx-auto p-6">
            <BatchFormNested mode="create" onSubmit={handleCreate} submitting={submitting} />
        </main>
    );
}
