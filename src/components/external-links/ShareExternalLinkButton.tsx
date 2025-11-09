'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';
import { Share2, Copy, Mail, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { encodeId } from '@/utils/helpers/IdConversion';

interface ShareExternalLinkButtonProps {
    subjectId: string;
    externalLinkId: string;
    title: string;
}

export function ShareExternalLinkButton({ subjectId, externalLinkId, title }: ShareExternalLinkButtonProps) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateShareUrl = () => {
        const encodedSubjectId = encodeURIComponent(encodeId(subjectId));
        const encodedExternalLinkId = encodeURIComponent(encodeId(externalLinkId));
        return `${window.location.origin}/view-subject/external-links/${encodedSubjectId}/${encodedExternalLinkId}`;
    };

    const handleNativeShare = async () => {
        const shareUrl = generateShareUrl();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Check out this external link: ${title}`,
                    text: `I found this interesting external link: ${title}`,
                    url: shareUrl,
                });
                setOpen(false);
                console.log('Share event: native share', { subjectId, externalLinkId, shareUrl });
            } catch {
                // User cancelled or error occurred
                console.log('Native share cancelled or failed');
            }
        }
    };

    const handleCopyLink = async () => {
        const shareUrl = generateShareUrl();
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            console.log('Share event: copy link', { subjectId, externalLinkId, shareUrl });
            setTimeout(() => setCopied(false), 2000);
            setOpen(false);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    const handleEmailShare = () => {
        const shareUrl = generateShareUrl();
        const subject = encodeURIComponent(`Check out this external link: ${title}`);
        const body = encodeURIComponent(`I found this interesting external link: ${title}\n\n${shareUrl}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
        setOpen(false);
    };

    const handleWhatsAppShare = () => {
        const shareUrl = generateShareUrl();
        const text = encodeURIComponent(`Check out this external link: ${title} - ${shareUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            variant="outline"
                            aria-label="Share external link"
                            className="hover:bg-green-50 dark:hover:bg-gray-800"
                        >
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share</TooltipContent>
                </Tooltip>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share External Link</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Share &ldquo;{title}&rdquo; with others
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            onClick={handleCopyLink}
                            className="flex flex-col items-center gap-2 h-auto py-4"
                        >
                            <motion.div
                                animate={{ scale: copied ? 1.2 : 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                <Copy className="w-5 h-5" />
                            </motion.div>
                            <span className="text-xs">Copy Link</span>
                        </Button>
                        {'share' in navigator ? (
                            <Button
                                variant="outline"
                                onClick={handleNativeShare}
                                className="flex flex-col items-center gap-2 h-auto py-4"
                            >
                                <Share2 className="w-5 h-5" />
                                <span className="text-xs">Share</span>
                            </Button>
                        ) : null}
                        <Button
                            variant="outline"
                            onClick={handleEmailShare}
                            className="flex flex-col items-center gap-2 h-auto py-4"
                        >
                            <Mail className="w-5 h-5" />
                            <span className="text-xs">Email</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleWhatsAppShare}
                            className="flex flex-col items-center gap-2 h-auto py-4"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-xs">WhatsApp</span>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
