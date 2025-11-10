import { useCallback } from "react";
import { toast } from "react-toastify";

export const useNoteActions = () => {
    const handleShare = useCallback(async (title?: string) => {
        const shareData = {
            title: title || 'Shared Note',
            text: 'Check out this note!',
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            } catch (error) {
                toast.error('Failed to copy link');
            }
        }
    }, []);

    const handleDownload = useCallback((content?: string, title?: string) => {
        if (!content) return;

        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title || 'note'}.html`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Note downloaded successfully!');
    }, []);

    return {
        handleShare,
        handleDownload
    };
};
