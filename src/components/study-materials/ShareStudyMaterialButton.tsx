'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { encodeId } from '@/utils/helpers/IdConversion';

interface ShareStudyMaterialButtonProps {
    subjectId: string;
    studyMaterialId: string;
}

export function ShareStudyMaterialButton({ subjectId, studyMaterialId }: ShareStudyMaterialButtonProps) {
    const [copied, setCopied] = useState(false);

    const generateUrl = () => {
        const encodedSubjectId = encodeURIComponent(encodeId(subjectId));
        const encodedStudyMaterialId = encodeURIComponent(encodeId(studyMaterialId));
        return `${window.location.origin}/view-subject/study-material/${encodedSubjectId}/${encodedStudyMaterialId}`;
    };

    const handleShare = async () => {
        const url = generateUrl();
        const title = 'Check out this study material';

        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url,
                });
                console.log('Share event: native share', { subjectId, studyMaterialId, url });
            } catch (error) {
                // User cancelled or error occurred, fall back to clipboard
                console.log('Native share failed, falling back to clipboard');
                await handleCopyLink();
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            await handleCopyLink();
        }
    };

    const handleCopyLink = async () => {
        const url = generateUrl();
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success('Link copied!');
            console.log('Share event: copy link', { subjectId, studyMaterialId, url });
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                    onClick={handleShare}
                    aria-label="Share study material"
                    className="hover:bg-indigo-50 dark:hover:bg-gray-800"
                >
                    <motion.div
                        animate={{ scale: copied ? 1.2 : 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <Share2 className="w-5 h-5" />
                    </motion.div>
                </Button>
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
        </Tooltip>
    );
}
