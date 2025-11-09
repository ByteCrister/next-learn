import { useMemo } from "react";

interface UseNoteCalculationsProps {
    content?: string;
}

export const useNoteCalculations = ({ content }: UseNoteCalculationsProps) => {
    const calculateReadingTime = useMemo(() => {
        if (!content) return 0;
        const wordsPerMinute = 200;
        const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    }, [content]);

    const wordCount = useMemo(() => {
        if (!content) return 0;
        return content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
    }, [content]);

    return {
        calculateReadingTime,
        wordCount
    };
};
