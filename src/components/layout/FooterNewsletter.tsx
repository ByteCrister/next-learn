"use client";

import React from "react";
import { motion } from "framer-motion";

const FooterNewsletter = () => {

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
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Stay in the Loop 🚀
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                Join 10,000+ learners receiving weekly insights, study tips, and exclusive resources.
            </p>


            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                No spam, ever. Unsubscribe anytime with one click.
            </p>
        </motion.div>
    );
};

export default FooterNewsletter;