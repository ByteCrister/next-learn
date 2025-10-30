"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    Batch,
    Semester,
    Course,
    CoursePart,
} from "@/types/types.batch";

/**
 * Types that mirror the return shape of useBatchSnapshot functions.
 * Keep these synchronized with hooks/useBatchSnapshot.ts
 */
export type PartSummary = {
    partId: string;
    courseType: CoursePart["courseType"];
    credits: number;
    mid: {
        earned: number;
        max: number;
        totalFromDef?: number | undefined;
        totalUsed?: number | undefined;
    };
    final: {
        earned: number;
        max: number;
        totalFromDef?: number | undefined;
        totalUsed?: number | undefined;
    };
    componentAverages: Record<
        "tt" | "assignments" | "attendance" | "others" | "practical" | "viva",
        number
    >;
    totalEarned: number;
    finalPercent: number;
    grade: string;
    cgpa: number;
    breakdown: {
        mid: { marks: number; max: number };
        final: { marks: number; max: number };
    };
};

export type ComputedSemester = {
    partsSummary: PartSummary[];
    semCgpa: number;
    normalizedPercent: number;
    totalCredits: number;
};

export type SemesterSummary = {
    sem: Semester;
    computed: ComputedSemester;
};

export type ComputedBatch = {
    semSummaries: SemesterSummary[];
    batchCgpa: number;
};

/**
 * exportBatchPdf
 * - Strictly typed
 * - Uses jspdf and jspdf-autotable
 */
export async function exportBatchPdf(opts: {
    batch: Batch;
    computed: ComputedBatch;
    studentLabel: string;
    studentId: string;
    filename?: string;
}) {
    const { batch, computed, studentLabel, studentId } = opts;
    const filename =
        opts.filename ?? `${batch?.name ?? "batch"}-${studentLabel}.pdf`;

    if (!batch || !computed) return;

    const doc = new jsPDF({
        unit: "pt",
        format: "a4",
    });

    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(batch.name, margin, 60);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const metaLeft = [
        `Program: ${batch.program ?? "—"}`,
        `Year: ${batch.year ?? "—"}`,
        `Batch ID: ${batch._id}`,
    ];
    const metaRight = [
        `Student: ${studentLabel}`,
        `Student ID: ${studentId}`,
        `Batch CGPA: ${computed.batchCgpa.toFixed(2)} / 4.00`,
    ];

    doc.text(metaLeft.join(" | "), margin, 80);
    doc.text(
        metaRight.join(" | "),
        pageWidth - margin - doc.getTextWidth(metaRight.join(" | ")),
        80
    );

    // separator
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(margin, 90, pageWidth - margin, 90);

    let cursorY = 110;

    // Semester summary table
    const semHead = [["#", "Semester", "Start", "End", "Credits", "Sem CGPA", "Normalized %"]];
    const semBody = computed.semSummaries.map((s, idx) => {
        const start = s.sem.startAt ? new Date(s.sem.startAt).toLocaleDateString() : "—";
        const end = s.sem.endAt ? new Date(s.sem.endAt).toLocaleDateString() : "—";
        return [
            String(s.sem.index ?? idx + 1),
            s.sem.name ?? `Semester ${s.sem.index ?? idx + 1}`,
            start,
            end,
            String(s.computed.totalCredits ?? 0),
            (s.computed.semCgpa ?? 0).toFixed(2),
            (s.computed.normalizedPercent ?? 0).toFixed(2) + "%",
        ];
    });

    autoTable(doc, {
        head: semHead,
        body: semBody,
        startY: cursorY,
        margin: { left: margin, right: margin },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [30, 78, 162], textColor: 255 },
        theme: "grid",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cursorY = (doc as any).lastAutoTable?.finalY ?? cursorY + 20;

    // Iterate semesters -> courses -> parts
    for (const s of computed.semSummaries) {
        // Semester title
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        if (cursorY > doc.internal.pageSize.getHeight() - 120) {
            doc.addPage();
            cursorY = margin;
        }
        doc.text(`${s.sem.name} — Summary`, margin, cursorY + 12);
        cursorY += 22;

        // Courses table
        const courses: Course[] = s.sem.courses ?? [];
        const courseHead = [["Code", "Course Name", "Parts", "Credits"]];
        const courseBody = courses.map((c) => {
            const totalCredits = (c.parts ?? []).reduce((acc, p) => acc + (p.credits ?? 0), 0);
            return [
                c.code ?? "—",
                c.name ?? "—",
                String((c.parts ?? []).length),
                String(totalCredits),
            ];
        });

        autoTable(doc, {
            head: courseHead,
            body: courseBody,
            startY: cursorY,
            margin: { left: margin, right: margin },
            styles: { fontSize: 9 },
            headStyles: { fillColor: [60, 136, 199], textColor: 255 },
            theme: "striped",
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cursorY = (doc as any).lastAutoTable?.finalY ?? cursorY + 20;

        // Parts table per course
        for (const course of courses) {
            const parts: CoursePart[] = course.parts ?? [];
            if (parts.length === 0) continue;

            if (cursorY > doc.internal.pageSize.getHeight() - 140) {
                doc.addPage();
                cursorY = margin;
            }

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text(`${course.code ?? ""} ${course.name ?? ""}`, margin, cursorY + 10);
            cursorY += 18;

            const partsHead = [
                [
                    "Part Type",
                    "Credits",
                    "Teachers",
                    "Grade",
                    "CGPA",
                    "Final %",
                    "Mid (earned/max)",
                    "Final (earned/max)",
                ],
            ];

            const partsBody = parts.map((p) => {
                // find part summary in semester computed.partsSummary by partId
                const expectedId = p._id ?? `${p.courseType}-${p.credits}`;
                const found = s.computed.partsSummary.find((ps) => ps.partId === expectedId);

                const grade = found?.grade ?? "—";
                const cgpa = typeof found?.cgpa === "number" ? found.cgpa.toFixed(2) : "—";
                const finalPercent = typeof found?.finalPercent === "number" ? found.finalPercent.toFixed(2) + "%" : "—";
                const midStr = found?.mid ? `${found.mid.earned ?? 0}/${found.mid.max ?? 0}` : "—";
                const finalStr = found?.final ? `${found.final.earned ?? 0}/${found.final.max ?? 0}` : "—";
                const teachers = (p.teachers ?? []).map((t) => t.name).join(", ") || "—";

                return [
                    String(p.courseType ?? "—"),
                    String(p.credits ?? 0),
                    teachers,
                    grade,
                    cgpa,
                    finalPercent,
                    midStr,
                    finalStr,
                ];
            });

            autoTable(doc, {
                head: partsHead,
                body: partsBody,
                startY: cursorY,
                margin: { left: margin, right: margin },
                styles: { fontSize: 8 },
                headStyles: { fillColor: [90, 90, 90], textColor: 255 },
                theme: "grid",
                columnStyles: {
                    2: { cellWidth: 120 },
                    6: { cellWidth: 70 },
                    7: { cellWidth: 70 },
                },
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cursorY = (doc as any).lastAutoTable?.finalY ?? cursorY + 20;
        }

        cursorY += 6;
        if (cursorY > doc.internal.pageSize.getHeight() - 140) {
            doc.addPage();
            cursorY = margin;
        }
    }

    // CGPA timeline
    const timelineHead = [["#", "Semester", "Sem CGPA", "Percent (of 4.00)"]];
    const timelineBody = computed.semSummaries.map((s, idx) => {
        const cg = s.computed.semCgpa ?? 0;
        const pct = ((cg / 4.0) * 100).toFixed(2) + "%";
        return [String(idx + 1), s.sem.name ?? `Sem ${idx + 1}`, cg.toFixed(2), pct];
    });

    autoTable(doc, {
        head: timelineHead,
        body: timelineBody,
        startY: cursorY + 10,
        margin: { left: margin, right: margin, bottom: margin },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [34, 197, 94], textColor: 255 },
    });

    // Footer
    const exportedAt = new Date().toLocaleString();
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Exported at: ${exportedAt}`, margin, doc.internal.pageSize.getHeight() - 30);
    const footerRight = "Generated by your app";
    doc.text(footerRight, pageWidth - margin - doc.getTextWidth(footerRight), doc.internal.pageSize.getHeight() - 30);

    // Save PDF
    doc.save(filename);
}
