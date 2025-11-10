import { CourseRoadmapDTO, SubjectDTO } from "@/types/types.view.subject";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

// ---------- Header components ----------
export default function HeaderView({ subject, roadmap }: { subject: SubjectDTO; roadmap: CourseRoadmapDTO | null }) {
    const chaptersCount = roadmap?.chapters?.length ?? 0;

    return (
        <Card className="relative overflow-hidden border border-white/10 bg-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md dark:bg-zinc-900/40">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -top-16 h-40 bg-gradient-to-b from-indigo-500/20 to-transparent"
            />
            <CardHeader className="relative">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                        <CardTitle className="text-balance text-2xl font-semibold tracking-[-0.01em] md:text-3xl">
                            {subject.title}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="bg-indigo-500/15 text-indigo-600 ring-1 ring-indigo-500/20 dark:text-indigo-300">
                                {subject.code}
                            </Badge>
                            <Badge variant="outline" className="border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300">
                                {chaptersCount} {chaptersCount === 1 ? "Chapter" : "Chapters"}
                            </Badge>
                            <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                                {roadmap ? "Roadmap included" : "No roadmap yet"}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="secondary"
                                    className="group border-white/10 bg-white/10 hover:bg-white/20 dark:bg-zinc-800/60"
                                >
                                    <span className="mr-1.5 inline-block transition-transform group-hover:-translate-y-0.5">✨</span>
                                    Quick look
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-xs">
                                Peek at Overview, Roadmap, and Chapters with smooth transitions.
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {subject.description ? (
                    <>
                        <Separator className="my-4" />
                        <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                            {subject.description}
                        </p>
                    </>
                ) : null}
            </CardHeader>
        </Card>
    );
}