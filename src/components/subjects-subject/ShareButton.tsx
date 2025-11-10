"use client";

import { encodeId } from "@/utils/helpers/IdConversion";
import { motion } from "framer-motion";
import { FaShareAlt } from "react-icons/fa";

interface ShareButtonProps {
    SubjectId: string; // URL to share
    className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ SubjectId, className }) => {
    const encodedSubjectId = encodeId(SubjectId)
    const url = `${window.location.origin}/view-subject/${encodedSubjectId}`;
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Check this out",
                    url,
                });
                console.log("Shared successfully!");
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(url);
                alert("Link copied to clipboard!");
            } catch (err) {
                console.error("Copy failed:", err);
            }
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className={`w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 rounded-lg 
                bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow hover:shadow-lg 
                transition-all text-sm md:text-base font-semibold ${className || ""}`}
        >
            <FaShareAlt /> Share
        </motion.button>
    );
};

export default ShareButton;
