import React from "react";
import { motion } from "framer-motion";
import {
    Twitter,
    Linkedin,
    Facebook,
    AtSign,
    Instagram,
    Music2
} from "lucide-react";

const socialIcons = [
    {
        name: "Twitter",
        href: "https://twitter.com",
        icon: Twitter,
        color: "from-blue-400 to-blue-600",
        hoverColor: "hover:shadow-blue-500/50",
    },
    {
        name: "LinkedIn",
        href: "https://linkedin.com",
        icon: Linkedin,
        color: "from-blue-600 to-blue-800",
        hoverColor: "hover:shadow-blue-700/50",
    },
    {
        name: "Facebook",
        href: "https://facebook.com",
        icon: Facebook,
        color: "from-blue-500 to-blue-700",
        hoverColor: "hover:shadow-blue-600/50",
    },
    {
        name: "Threads",
        href: "https://threads.net",
        icon: AtSign,
        color: "from-gray-700 to-gray-900 dark:from-gray-300 dark:to-white",
        hoverColor: "hover:shadow-gray-700/50 dark:hover:shadow-white/50",
    },
    {
        name: "Instagram",
        href: "https://instagram.com",
        icon: Instagram,
        color: "from-pink-500 via-purple-500 to-orange-500",
        hoverColor: "hover:shadow-pink-500/50",
    },
    {
        name: "TikTok",
        href: "https://tiktok.com",
        icon: Music2,
        color: "from-gray-800 to-black dark:from-white dark:to-gray-200",
        hoverColor: "hover:shadow-gray-800/50 dark:hover:shadow-white/50",
    },
];

const FooterSocial = () => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <motion.div variants={itemVariants} className="flex gap-3">
            {socialIcons.map((social) => (
                <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="relative group"
                    whileHover={{ y: -5, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${social.color} rounded-xl blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />
                    <div className={`relative p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg ${social.hoverColor} hover:shadow-2xl transition-all duration-300`}>
                        <social.icon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                </motion.a>
            ))}
        </motion.div>
    );
};

export default FooterSocial;
