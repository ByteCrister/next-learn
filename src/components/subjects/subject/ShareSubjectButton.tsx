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

interface ShareSubjectButtonProps {
    subjectId: string;
}

export function ShareSubjectButton({ subjectId }: ShareSubjectButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // Split subjectId into 3 parts
        const partLength = Math.ceil(subjectId.length / 3);
        const part1 = subjectId.slice(0, partLength);
        const part2 = subjectId.slice(partLength, partLength * 2);
        const part3 = subjectId.slice(partLength * 2);

        const url = `${window.location.origin}/view-subject/${part1}-${part2}-${part3}`;

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success('Link copied!');

            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy link');
        }
    };


    return (
        <div className="flex justify-end mb-4">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size="icon"
                        variant={copied ? 'secondary' : 'outline'}
                        onClick={handleShare}
                        aria-label="Share subject link"
                    >
                        <motion.div
                            animate={{ scale: copied ? 1.2 : 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <Share2 className="w-5 h-5" />
                        </motion.div>
                    </Button>
                </TooltipTrigger>

                <TooltipContent side="top" align="end">
                    {copied ? 'Copied!' : 'Share subject link'}
                </TooltipContent>
            </Tooltip>
        </div>
    );
}
