'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';
import { Share2, Twitter, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ShareSubjectButtonProps {
    subjectId: string;
}

export function ShareSubjectButton({ subjectId }: ShareSubjectButtonProps) {
    const [copied, setCopied] = useState(false);

    const generateUrl = () => {
        const partLength = Math.ceil(subjectId.length / 3);
        const part1 = subjectId.slice(0, partLength);
        const part2 = subjectId.slice(partLength, partLength * 2);
        const part3 = subjectId.slice(partLength * 2);
        return `${window.location.origin}/view-subject/${part1}-${part2}-${part3}`;
    };

    const handleCopyLink = async () => {
        const url = generateUrl();
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success('Link copied!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    const handleShareTwitter = () => {
        const url = generateUrl();
        const text = `Check out this subject: ${url}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleShareFacebook = () => {
        const url = generateUrl();
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                    aria-label="Share subject"
                    className="hover:bg-indigo-50 dark:hover:bg-gray-800"
                >
                    <motion.div
                        animate={{ scale: copied ? 1.2 : 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        <Share2 className="w-5 h-5" />
                    </motion.div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleCopyLink}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareTwitter}>
                    <Twitter className="w-4 h-4 mr-2" />
                    Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareFacebook}>
                    <Facebook className="w-4 h-4 mr-2" />
                    Share on Facebook
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
