"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useBatches } from "@/hooks/useBatches";
import BatchFormNested from "@/components/batches/BatchFormNested";
import { toast } from "react-toastify";
import { UpdateBatchPayload } from "@/types/types.batch";
import { encodeId } from "@/utils/helpers/IdConversion";

export default function UpdateBatchPage({ batchId }: { batchId: string }) {
    const router = useRouter();
    const { fetchBatchById, currentBatch, updateBatch } = useBatches();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!batchId) return;
        fetchBatchById(batchId).catch(console.error).finally(() => setLoading(false));
    }, [batchId, fetchBatchById]);

    if (loading) return <div>Loading…</div>;
    if (!currentBatch) return <div>Batch not found</div>;

    // Map currentBatch to the form's initialValues shape (BatchNestedFormValues)
    const initialValues = {
        name: currentBatch.name,
        program: currentBatch.program ?? "",
        year: currentBatch.year ? String(currentBatch.year) : "",
        notes: currentBatch.notes ?? "",
        semesters: currentBatch.semesters.map((s) => ({
            _uid: s._id ?? uuidv4(),
            name: s.name,
            index: s.index,
            startAt: s.startAt ?? "",
            endAt: s.endAt ?? "",
            notes: s.notes ?? "",
            courses: (s.courses ?? []).map((c) => ({
                _uid: c._id ?? uuidv4(),
                courseId: c.courseId ?? "",
                code: c.code ?? "",
                name: c.name ?? "",
                notes: c.notes ?? "",
                parts: (c.parts ?? []).map((p) => ({
                    _uid: p._id ?? uuidv4(),
                    courseType: p.courseType,
                    credits: p.credits,
                    notes: p.notes ?? "",
                    teachers: (p.teachers ?? []).map((t) => ({ _uid: t._id ?? uuidv4(), name: t.name, designation: t.designation ?? "", notes: t.notes ?? "" })),
                    examDefinitions: (p.examDefinitions ?? []).map((ed) => ({
                        _uid: ed._id ?? uuidv4(),
                        examType: ed.examType,
                        condition: ed.condition,
                        totalMarks: ed.totalMarks,
                        components: (ed.components ?? []).map((comp) => ({ _uid: uuidv4(), name: comp.name, maxMarks: comp.maxMarks })),
                    })),
                })),
            })),
        })),
    };

    async function handleUpdate(payload: UpdateBatchPayload) {
        setSubmitting(true);
        try {
            await updateBatch({ ...payload, _id: batchId });
            toast.success("Batch updated");
            router.push(`/batches/${encodeId(encodeURIComponent(batchId))}`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update batch");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="max-w-4xl mx-auto p-6">
            <BatchFormNested mode="update" id={batchId} initialValues={initialValues} onSubmit={handleUpdate} submitting={submitting} />
        </main>
    );
}
