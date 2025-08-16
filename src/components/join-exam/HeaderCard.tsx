import { ExamDTO } from "@/types/types.exam";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { HiClock } from "react-icons/hi";

export function HeaderCard({ exam }: { exam: ExamDTO }) {
    return (
        <Card className="rounded-2xl bg-gradient-to-r from-white/90 to-slate-50/80 backdrop-blur-md border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-4">
                    <span className="text-2xl font-semibold text-gray-800">{exam.title}</span>
                    <div className="flex items-center gap-2">
                        {exam.subjectCode && (
                            <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {exam.subjectCode}
                            </Badge>
                        )}
                        {exam.examCode && (
                            <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                                Code: {exam.examCode}
                            </Badge>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {exam.description && (
                    <p className="text-base text-gray-600 leading-relaxed">{exam.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-sm">
                    {exam.scheduledStartAt ? (
                        <Badge className="bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1">
                            <HiClock className="h-4 w-4" />
                            Starts: {new Date(exam.scheduledStartAt).toLocaleString()}
                        </Badge>
                    ) : (
                        <Badge className="bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1">
                            <HiClock className="h-4 w-4" />
                            Starts: Anytime
                        </Badge>
                    )}

                    {!exam.isTimed && exam.durationMinutes ? (
                        <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                            Duration: {exam.durationMinutes}m
                        </Badge>
                    ) : (
                        <Badge className="bg-slate-100 text-slate-800 border border-slate-300">
                            Unlimited time
                        </Badge>
                    )}

                    {exam.allowLateSubmissions && exam.lateWindowMinutes ? (
                        <Badge className="bg-amber-50 text-amber-700 border border-amber-200">
                            Late window: +{exam.lateWindowMinutes}m
                        </Badge>
                    ) : null}

                    {exam.autoSubmitOnEnd ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Auto-submit enabled
                        </Badge>
                    ) : (
                        <Badge className="bg-slate-50 text-slate-700 border border-slate-200">
                            Manual submit
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}