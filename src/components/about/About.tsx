"use client";

import { FC } from "react";
import { motion, Variants } from "framer-motion";

const team = [
    {
        name: "Education Team",
        role: "Curriculum Design",
        description: "Experts in creating engaging and effective learning content",
    },
    {
        name: "Technology Team",
        role: "Platform Development",
        description: "Innovators building cutting-edge educational technology",
    },
    {
        name: "Support Team",
        role: "Student Success",
        description: "Dedicated to helping learners achieve their goals",
    },
];

interface Value {
    title: string;
    description: string;
}

const values: Value[] = [
    { title: "Accessibility", description: "Making education available to everyone" },
    { title: "Innovation", description: "Constantly improving through technology" },
    { title: "Excellence", description: "Maintaining high standards in everything we do" },
    { title: "Community", description: "Building supportive learning environments" },
    { title: "Personalization", description: "Tailoring experiences to individual needs" },
    { title: "Growth", description: "Fostering continuous learning and development" },
];

// Variants
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            duration: 0.6,
            ease: "easeOut",
        },
    }),
};

const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const About: FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
            <div className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <motion.section
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        About Next-Learn
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Empowering learners worldwide through innovative educational technology and personalized learning experiences.
                    </p>
                </motion.section>

                {/* Mission & Vision */}
                <motion.section
                    className="grid md:grid-cols-2 gap-12 mb-16"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8" variants={fadeUp}>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            To make quality education accessible to everyone, regardless of their background or location. We believe that learning should be personalized, engaging, and effective.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            Through innovative technology and expert-designed content, we&apos;re breaking down barriers to education and creating opportunities for lifelong learning.
                        </p>
                    </motion.div>

                    <motion.div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8" variants={fadeUp}>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            A world where every individual has the tools and resources they need to achieve their educational goals and unlock their full potential.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            We envision a future where learning is not limited by geography, economics, or traditional constraints, but is enhanced by technology and human connection.
                        </p>
                    </motion.div>
                </motion.section>

                {/* Values */}
                <motion.section
                    className="mb-16"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.h2
                        className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
                        variants={fadeUp}
                    >
                        Our Core Values
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value, i) => (
                            <motion.div
                                key={i}
                                className="text-center"
                                variants={fadeUp}
                                custom={i}
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Team */}
                <motion.section
                    className="mb-16"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.h2
                        className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
                        variants={fadeUp}
                    >
                        Meet Our Team
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center"
                                variants={fadeUp}
                                custom={i}
                            >
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {member.name}
                                </h3>
                                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{member.role}</p>
                                <p className="text-gray-600 dark:text-gray-300">{member.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Stats */}
                <motion.section
                    className="bg-blue-600 text-white rounded-lg p-8 text-center"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.h2 className="text-3xl font-bold mb-8" variants={fadeUp}>
                        Our Impact
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { label: "Active Learners", value: "10,000+" },
                            { label: "Courses Available", value: "500+" },
                            { label: "Satisfaction Rate", value: "95%" },
                        ].map((stat, i) => (
                            <motion.div key={i} variants={fadeUp} custom={i}>
                                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                                <div>{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default About;
