// hooks/useBatchSnapshot.ts
"use client";

import {
    Batch,
    CoursePart,
    CourseResult,
    ResultComponent,
    Semester,
} from "@/types/types.batch";

// expanded to match RESULT_COMPONENT_NAME enum
const COMPONENT_NAMES = [
    "tt",
    "assignments",
    "attendance",
    "others",
    "practical",
    "viva",
] as const;
type ComponentName = (typeof COMPONENT_NAMES)[number];

const useBatchSnapshot = () => {
    /* helpers */

    function buildExamDefMap(part: CoursePart) {
        const map = new Map<string, number>();
        for (const ed of part.examDefinitions || []) {
            const examType = ed.examType;
            for (const c of ed.components || []) {
                map.set(`${examType}::${c.name}`, c.maxMarks ?? 0);
            }
        }
        return map;
    }

    function findResultForStudent(
        results: CourseResult[] | undefined,
        studentId: string,
        examType: string
    ): CourseResult | undefined {
        if (!Array.isArray(results)) return undefined;
        return results.find(
            (r) =>
                String(r?.student ?? "") === String(studentId) &&
                r.examType === examType
        );
    }

    /**
     * Sum components for a CourseResult.
     * - earned prefers component.marks then component.maxMarks (server quirk)
     * - trueMax prefers exam definition value when present (>0), otherwise falls back to component.maxMarks or 0
     * Returns { marks, maxMarks } where marks is sum of earned and maxMarks is sum of trueMax values
     */
    function sumComponentsForResult(
        components?: ResultComponent[],
        examDefMap?: Map<string, number>,
        examType?: string
    ) {
        if (!Array.isArray(components) || components.length === 0)
            return { marks: 0, maxMarks: 0 };
        let marks = 0;
        let maxMarks = 0;

        for (const c of components) {
            const name = String(c.name);
            const defKey = examType ? `${examType}::${name}` : undefined;
            const defMax = defKey && examDefMap ? examDefMap.get(defKey) : undefined;

            const earned =
                typeof c.marks === "number"
                    ? c.marks
                    : typeof c.maxMarks === "number"
                        ? c.maxMarks
                        : undefined;
            const trueMax =
                typeof defMax === "number" && defMax > 0
                    ? defMax
                    : typeof c.maxMarks === "number"
                        ? c.maxMarks
                        : 0;

            if (typeof earned === "number") marks += earned;
            maxMarks += trueMax;
        }

        return { marks, maxMarks };
    }

    /**
     * Read earned value for a specific component name.
     * Priority:
     *  1) recorded result component.marks
     *  2) recorded result component.maxMarks (server quirk)
     *  3) examDefinitions value from examDefMap for the given examType (fallback when result missing)
     *  4) undefined
     *
     * Note: examDefMap and examType are optional; when provided they are only used as fallback.
     */
    function getComponentEarnedWithDefs(
        result: CourseResult | undefined,
        componentName: ComponentName,
        examDefMap?: Map<string, number>,
        examType?: string
    ): number | undefined {
        if (result && Array.isArray(result.components)) {
            const comp = result.components.find(
                (c) => String(c.name) === componentName
            );
            if (comp) {
                if (typeof comp.marks === "number") return comp.marks;
                if (typeof comp.maxMarks === "number") return comp.maxMarks;
            }
        }

        if (examType && examDefMap) {
            const defKey = `${examType}::${componentName}`;
            const defVal = examDefMap.get(defKey);
            if (typeof defVal === "number" && defVal > 0) return defVal;
        }

        return undefined;
    }

    function percentToLetter(percent: number) {
        if (percent >= 80) return "A+";
        if (percent >= 75) return "A";
        if (percent >= 70) return "A-";
        if (percent >= 65) return "B+";
        if (percent >= 60) return "B";
        if (percent >= 55) return "B-";
        if (percent >= 50) return "C+";
        if (percent >= 45) return "C";
        if (percent >= 40) return "D";
        return "F";
    }

    function percentToCgpa(percent: number) {
        if (percent >= 80) return 4.0;
        if (percent >= 60) return 3.0 + (percent - 60) / 20;
        if (percent >= 40) return 2.0 + (percent - 40) / 20;
        return Math.max(0, (percent / 40) * 2.0);
    }

    /* main summarizer implementing requested rules */
    function summarizePartForStudent(part: CoursePart, studentId: string) {
        const examDefMap = buildExamDefMap(part);

        const midResult = findResultForStudent(part.results, studentId, "mid");
        const finalResult = findResultForStudent(part.results, studentId, "final");

        const midSum = sumComponentsForResult(
            midResult?.components,
            examDefMap,
            "mid"
        );
        const finalSum = sumComponentsForResult(
            finalResult?.components,
            examDefMap,
            "final"
        );

        function findExamTotalFromDefs(examType: string) {
            const ed = (part.examDefinitions || []).find(
                (e) => e.examType === examType
            );
            return ed?.totalMarks;
        }

        const midTotalFromDef = findExamTotalFromDefs("mid");
        const finalTotalFromDef = findExamTotalFromDefs("final");

        const midTotal =
            typeof midTotalFromDef === "number"
                ? midTotalFromDef
                : typeof midResult?.total === "number"
                    ? midResult!.total!
                    : midSum.maxMarks;

        const finalTotal =
            typeof finalTotalFromDef === "number"
                ? finalTotalFromDef
                : typeof finalResult?.total === "number"
                    ? finalResult!.total!
                    : finalSum.maxMarks;

        // component averages now handle the full enum set
        const componentAverages: Record<ComponentName, number> = {
            tt: 0,
            assignments: 0,
            attendance: 0,
            others: 0,
            practical: 0,
            viva: 0,
        };

        for (const name of COMPONENT_NAMES) {
            const midEarned = getComponentEarnedWithDefs(
                midResult,
                name,
                examDefMap,
                "mid"
            );
            const finalEarned = getComponentEarnedWithDefs(
                finalResult,
                name,
                examDefMap,
                "final"
            );

            if (typeof midEarned === "number" && typeof finalEarned === "number") {
                componentAverages[name] = (midEarned + finalEarned) / 2;
            } else if (typeof finalEarned === "number") {
                // when both not present, prefer final if available (per your "Else you just sum final + other" guidance)
                componentAverages[name] = finalEarned;
            } else if (typeof midEarned === "number") {
                componentAverages[name] = midEarned;
            } else {
                componentAverages[name] = 0;
            }
        }

        // sum up component averages (now includes others/practical/viva)
        const totalComponentAvg = COMPONENT_NAMES.reduce(
            (acc, n) => acc + (componentAverages[n] || 0),
            0
        );

        // total earned as per formula:
        // midTotal + finalTotal + sum(all component averages)
        const totalEarned = (midTotal ?? 0) + (finalTotal ?? 0) + totalComponentAvg;

        // finalPercent clamped to [0,100]
        const finalPercent = Math.max(0, Math.min(100, totalEarned));

        const grade = percentToLetter(finalPercent);
        const cgpa = percentToCgpa(finalPercent);

        return {
            partId: part._id ?? `${part.courseType}-{part.credits}`,
            courseType: part.courseType,
            credits: part.credits ?? 0,
            mid: {
                earned: midSum.marks,
                max: midSum.maxMarks,
                totalFromDef: midTotalFromDef,
                totalUsed: midTotal,
            },
            final: {
                earned: finalSum.marks,
                max: finalSum.maxMarks,
                totalFromDef: finalTotalFromDef,
                totalUsed: finalTotal,
            },
            componentAverages,
            totalEarned,
            finalPercent,
            grade,
            cgpa,
            breakdown: {
                mid: { marks: midSum.marks, max: midSum.maxMarks },
                final: { marks: finalSum.marks, max: finalSum.maxMarks },
            },
        };
    }

    /* Semester computation */
    function computeSemesterForStudent(semester: Semester, studentId: string) {
        const partsSummary: ReturnType<typeof summarizePartForStudent>[] = [];

        for (const course of semester.courses || []) {
            for (const p of course.parts || []) {
                partsSummary.push(summarizePartForStudent(p, studentId));
            }
        }

        let totalWeighted = 0;
        let totalCredits = 0;
        for (const s of partsSummary) {
            totalWeighted += (s.cgpa || 0) * (s.credits || 0);
            totalCredits += s.credits || 0;
        }
        const semCgpa =
            totalCredits > 0
                ? Math.round((totalWeighted / totalCredits) * 100) / 100
                : 0;

        let totalPercentWeighted = 0;
        for (const s of partsSummary) {
            totalPercentWeighted += (s.finalPercent ?? 0) * (s.credits || 0);
        }
        const normalizedPercent =
            totalCredits > 0 ? totalPercentWeighted / totalCredits : 0;

        return {
            partsSummary,
            semCgpa,
            normalizedPercent: Math.round(normalizedPercent * 100) / 100,
            totalCredits,
        };
    }

    /* Batch computation */
    function computeBatchForStudent(batch: Batch, studentId: string) {
        const semSummaries = (batch.semesters || []).map((sem) => ({
            sem,
            computed: computeSemesterForStudent(sem, studentId),
        }));

        let sumWeightedSemCgpa = 0;
        let sumSemCredits = 0;
        for (const s of semSummaries) {
            const c = s.computed.totalCredits || 0;
            const cg = s.computed.semCgpa || 0;
            if (c > 0) {
                sumWeightedSemCgpa += cg * c;
                sumSemCredits += c;
            }
        }
        const batchCgpa =
            sumSemCredits > 0
                ? Math.round((sumWeightedSemCgpa / sumSemCredits) * 100) / 100
                : 0;

        return { semSummaries, batchCgpa };
    }

    return {
        buildExamDefMap,
        sumComponentsForResult,
        percentToLetter,
        percentToCgpa,
        summarizePartForStudent,
        computeSemesterForStudent,
        computeBatchForStudent,
    };
};

export default useBatchSnapshot;
