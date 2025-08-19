"use client";

import { FC } from "react";
import { motion, Variants } from "framer-motion";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useRouter } from "next/navigation";
import routeDashboard from "@/utils/helpers/routeDashboard";
import { Button } from "../ui/button";

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        icon: "💡",
        title: "AI‑Powered Insights",
        description:
            "Leverage smart recommendations to optimize your learning path.",
    },
    {
        icon: "📅",
        title: "Smart Scheduling",
        description:
            "Organize your study sessions efficiently with our adaptive calendar.",
    },
    {
        icon: "📊",
        title: "Progress Analytics",
        description:
            "Track every milestone with detailed reports and visualizations.",
    },
    {
        icon: "🔒",
        title: "Secure Cloud Sync",
        description:
            "Your data is encrypted and accessible across all devices.",
    },
    {
        icon: "🎯",
        title: "Goal Tracking",
        description:
            "Set clear goals and achieve them with focused learning tools.",
    },
    {
        icon: "🌐",
        title: "Global Community",
        description:
            "Collaborate and share knowledge with learners worldwide.",
    },
];

// Animation Variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 },
    },
};

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

const Features: FC = () => {
    const router = useRouter();
    const { user } = useDashboardStore();

    const handleClick = () => {
        if (user) {
            routeDashboard();
        } else {
            router.push('/signup');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
            <div className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <motion.section
                    className="text-center mb-16"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
                        variants={fadeInUp}
                    >
                        Powerful Features for Modern Learning
                    </motion.h1>
                    <motion.p
                        className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                        variants={fadeInUp}
                    >
                        Discover how NextLearn transforms your educational journey with
                        cutting edge tools and personalized experiences.
                    </motion.p>
                </motion.section>

                {/* Features Grid */}
                <motion.section
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                            variants={fadeInUp}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.section>

                {/* CTA Section */}
                <motion.section
                    className="text-center"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.h2
                        className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
                        variants={fadeInUp}
                    >
                        Ready to Start Your Learning Journey?
                    </motion.h2>
                    <motion.p
                        className="text-gray-600 dark:text-gray-300 mb-8"
                        variants={fadeInUp}
                    >
                        Join thousands of learners who are already benefiting from our
                        platform.
                    </motion.p>
                    <motion.div
                        variants={fadeInUp}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            asChild
                            size="lg"
                            onClick={handleClick}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <span>
                                {user ? "Learn new things!" : "Get Started Now"}
                            </span>
                        </Button>
                    </motion.div>


                </motion.section>
            </div>
        </div>
    );
};

export default Features;
