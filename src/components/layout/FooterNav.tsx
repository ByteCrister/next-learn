import React from "react";
import { motion } from "framer-motion";
import {
    Sparkles,
    Mail,
    Star as IconStar,
    Heart as IconHeart,
    Book as IconBook
} from "lucide-react";

const navLinks = [
    { href: "/features", name: "Features", Icon: IconStar },
    { href: "/about", name: "About", Icon: IconHeart },
    { href: "/how-to-use", name: "How to Use", Icon: IconBook },
];

const FooterNav = () => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <motion.div variants={itemVariants} className="lg:col-span-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                Explore
                <Sparkles className="w-5 h-5 text-blue-600" />

            </h3>
            <div className="grid grid-cols-2 gap-4">
                {navLinks.map((link) => (
                    <motion.a
                        key={link.name}
                        href={link.href}
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group"
                        whileHover={{ scale: 1.05 }}
                    >
                        <link.Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">{link.name}</span>
                    </motion.a>
                ))}
            </div>

            {/* Contact Info */}
            <div className="mt-8 space-y-3">
                <motion.a
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                        <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">sadiqul.islam.shakib21@gmail.com</span>
                </motion.a>
                <motion.a
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                        <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">istiakadil346@gmail.com</span>
                </motion.a>
            </div>
        </motion.div>
    );
};

export default FooterNav;