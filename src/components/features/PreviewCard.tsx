import { motion } from "framer-motion";

interface PreviewCardProps {
    children: React.ReactNode;
}

export default function PreviewCard({ children }: PreviewCardProps) {
    return (
        <motion.div
        >
            {children}
        </motion.div>
    );
}
