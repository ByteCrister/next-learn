"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { ExamDTO, ExamResultDTO } from "@/types/types.exam";
import Image from "next/image";

interface ResultDetailDialogProps {
    exam: ExamDTO;
    result: ExamResultDTO | null;
    open: boolean;
    onClose: () => void;
}

export function ResultDetailDialog({ exam, result, open, onClose }: ResultDetailDialogProps) {
    if (!result) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Result Details</DialogTitle>
                    <DialogDescription>
                        {result.participantEmail} • Score: {result.score}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {exam.questions.map((q, idx) => {
                        const ans = result.answers.find((a) => a.questionIndex === idx);
                        const isCorrect = ans?.isCorrect;

                        return (
                            <div key={idx} className="rounded-md border p-3">
                                <div className="font-medium mb-2">
                                    Q{idx + 1}:
                                    <div className="mt-1 space-y-2">
                                        {q.contents?.map((c, ci) =>
                                            c.type === "text" ? (
                                                <p key={ci}>{c.value}</p>
                                            ) : (
                                                <Image
                                                    key={ci}
                                                    height={100}
                                                    width={100}
                                                    src={c.value}
                                                    alt={`Question ${idx + 1} image`}
                                                    className="max-h-48 rounded border"
                                                />
                                            )
                                        )}
                                    </div>
                                </div>

                                <ul className="space-y-1 mt-2">
                                    {q.choices.map((choice, i) => {
                                        const isSelected = ans?.selectedChoiceIndex === i;
                                        const isChoiceCorrect = choice.isCorrect === true;

                                        return (
                                            <li
                                                key={i}
                                                className={`px-2 py-1 rounded text-sm flex items-center
                          ${isSelected
                                                        ? (isCorrect
                                                            ? "bg-green-100 border border-green-400"
                                                            : "bg-red-100 border border-red-400")
                                                        : "bg-muted"}
                        `}
                                            >
                                                <span>{choice.text}</span>
                                                {isChoiceCorrect && (
                                                    <span className="ml-2 text-xs text-green-600">(Correct)</span>
                                                )}
                                                {isSelected && !isCorrect && (
                                                    <span className="ml-2 text-xs text-red-600">(Your answer)</span>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>

                                <Separator className="my-2" />
                            </div>
                        );
                    })}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
