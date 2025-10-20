import { CourseRoadmapDTO, SubjectDTO } from '@/types/types.view.subject';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function OverviewSection({ subject, roadmap }: { subject: SubjectDTO; roadmap: CourseRoadmapDTO | null }) {
    const stats = [
        { label: "Subject code", value: subject.code, accent: "indigo" },
        { label: "Chapters", value: String(roadmap?.chapters?.length ?? 0), accent: "violet" },
        { label: "Roadmap", value: roadmap ? "Available" : "Not available", accent: roadmap ? "emerald" : "zinc" },
    ] as const;

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                        <Card className="group border-white/10 bg-white/5 transition-all hover:shadow-lg hover:shadow-indigo-500/10 dark:bg-zinc-900/40">
                            <CardContent className="p-5">
                                <div className="text-muted-foreground text-xs uppercase tracking-wide">{s.label}</div>
                                <div className="mt-2 text-lg font-semibold">
                                    <span
                                        className={
                                            s.accent === "indigo"
                                                ? "text-indigo-600 dark:text-indigo-300"
                                                : s.accent === "violet"
                                                    ? "text-violet-600 dark:text-violet-300"
                                                    : s.accent === "emerald"
                                                        ? "text-emerald-600 dark:text-emerald-300"
                                                        : "text-zinc-600 dark:text-zinc-300"
                                        }
                                    >
                                        {s.value}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {roadmap?.description ? (
                <Card className="border-white/10 bg-white/5 dark:bg-zinc-900/40">
                    <CardHeader>
                        <CardTitle className="text-base">Roadmap overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <p className="text-muted-foreground">{roadmap.description}</p>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    );
}