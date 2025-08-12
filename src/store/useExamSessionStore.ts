import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// IAnswer shape as per your model
interface IAnswer {
    questionIndex: number;
    selectedChoiceIndex: number;
    isCorrect?: boolean;
}

interface ExamSessionState {
    participantId: string;
    currentQuestionIndex: number;
    answers: IAnswer[];
    startedAt: string | null;

    setParticipantId: (id: string) => void;
    setCurrentQuestionIndex: (idx: number) => void;
    setAnswers: (answers: IAnswer[]) => void;
    setStartedAt: (date: string | null) => void;
}

export const useExamSessionStore = create(
    persist<ExamSessionState>(
        (set) => ({
            participantId: "",
            currentQuestionIndex: 0,
            answers: [],
            startedAt: null,

            setParticipantId: (id) => set({ participantId: id }),
            setCurrentQuestionIndex: (idx) => set({ currentQuestionIndex: idx }),
            setAnswers: (answers) => set({ answers }),
            setStartedAt: (date) => set({ startedAt: date }),
        }),
        {
            name: "exam-session-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
