// components/ShareButton.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Check } from "lucide-react";
import clsx from "clsx";

interface ShareButtonProps {
    onShare: () => void;
    isEditable: boolean;
    className?: string;
}

export function ShareButton({
    onShare,
    isEditable,
    className,
}: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleClick = () => {
        onShare();
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
    };

    return (
        <motion.button
            onClick={handleClick}
            disabled={!isEditable}
            className={clsx(
                "relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-gray-300",
                "bg-white text-gray-800 font-medium text-xs shadow-sm transition-all",
                {
                    "hover:shadow-md hover:border-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-300":
                        isEditable,
                    "opacity-50 cursor-not-allowed": !isEditable,
                },
                className
            )}
            whileHover={isEditable ? { scale: 1.02 } : undefined}
            whileTap={isEditable ? { scale: 0.98 } : undefined}
        >
            {/* Animated Icon with fade/scale */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={copied ? "check" : "share"}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="flex-shrink-0"
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                    ) : (
                        <Share2 className="w-4 h-4 text-gray-700" />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Label with fade transition */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={copied ? "copied" : "share"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={copied ? "text-green-600" : "text-gray-800"}
                >
                    {copied ? "Copied!" : "Share"}
                </motion.span>
            </AnimatePresence>
        </motion.button>
    );
}
