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
import { encodeId } from '@/utils/helpers/IdConversion';

interface ShareNoteButtonProps {
    subjectId: string;
    noteId: string;
}

export function ShareNoteButton({ subjectId, noteId }: ShareNoteButtonProps) {
    const [copied, setCopied] = useState(false);

    const generateUrl = () => {
        const encodedSubjectId = encodeId(encodeURIComponent(subjectId));
        const encodedNoteId = encodeId(encodeURIComponent(noteId));
        return `${window.location.origin}/view-subject/notes/${encodedSubjectId}/${encodedNoteId}`;
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
        const text = `Check out this note: ${url}`;
        console.log('Share event: Twitter', { subjectId, noteId, url });
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleShareFacebook = () => {
        const url = generateUrl();
        console.log('Share event: Facebook', { subjectId, noteId, url });
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };

    const handleShareWhatsApp = () => {
        const url = generateUrl();
        const text = `Check out this note: ${url}`;
        console.log('Share event: WhatsApp', { subjectId, noteId, url });
        window.open(`https://api.whatsapp.com/send/?text=${encodeURIComponent(text)}&type=custom_url&app_absent=0`, '_blank');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                    aria-label="Share note"
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
                <DropdownMenuItem onClick={handleShareWhatsApp}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share on WhatsApp
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
