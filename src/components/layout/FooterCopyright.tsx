import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const FooterCopyright = () => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <>
            {/* Copyright */}
            <motion.p
                variants={itemVariants}
                className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 font-medium"
            >
                © {new Date().getFullYear()} Next Learn. Crafted with
                <motion.span
                    animate={{
                        scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                </motion.span>
                for ambitious learners
            </motion.p>

            {/* Legal Links */}
            <motion.div variants={itemVariants} className="flex gap-6 text-sm font-medium">
                <a href="#privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group">
                    Privacy
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                </a>
                <a href="#terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group">
                    Terms
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                </a>
                <a href="#cookies" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group">
                    Cookies
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                </a>
            </motion.div>
        </>
    );
};

export default FooterCopyright;