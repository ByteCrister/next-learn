"use client";

import { FC } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { Users, Target, Eye, Award, Sparkles, TrendingUp, Heart, Lightbulb, Star, Linkedin, Github, Mail } from "lucide-react";
import Image from "next/image";

const team = [
    {
        name: "Sadiqul Islam Shakib",
        role: "Next.js Full‑Stack Developer",
        shortRole: "Frontend, API design, cloud deployment",
        description: "Full‑stack engineer building scalable, maintainable web applications with a focus on fast, accessible UIs and robust backend integrations. Currently a CSE student at North East University Bangladesh, Batch: Summer 2022.",
        expertise: ["Next.js", "Node.js", "TypeScript", "Cloud Deployment", "Performance Optimization"],
        achievements: ["Delivered 10+ end‑to‑end web platforms", "Led production launches and CI/CD pipelines"],
        location: "Sylhet, Bangladesh",
        color: "from-indigo-500 to-purple-500",
        image: "/images/shakib.jpg",
        socials: {
            linkedin: "https://www.linkedin.com/in/sadiqul-islam-shakib",
            github: "https://github.com/ByteCrister",
            email: "sadiqul.islam.shakib21@gamil.com"
        }
    },
    {
        name: "Md. Istiak Hussain Adil",
        role: "Next.js Full‑Stack Developer",
        shortRole: "UI/UX engineering, frontend architecture",
        description: "Full‑stack developer specializing in high‑performance interfaces, modern frontend architectures, and delightful user experiences. Currently a CSE student at North East University Bangladesh, Batch: Summer 2022.",
        expertise: ["Next.js", "TypeScript", "UI/UX Engineering", "Accessibility", "Client Performance"],
        achievements: ["30+ production‑level interfaces delivered", "Improved LCP and CLS across multiple projects"],
        location: "Sylhet, Bangladesh",
        color: "from-blue-500 to-cyan-500",
        image: "/images/Adil.jpg",
        socials: {
            linkedin: "https://www.linkedin.com/in/istiak-adil-755361329/",
            github: "https://github.com/IstiakAdil14",
            email: "istiakadil346@gmail.com"
        }
    }
];


interface Value {
    title: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    gradient: string;
}

const values: Value[] = [
    { title: "Accessibility", description: "Breaking down barriers to make world-class education available to everyone, everywhere", icon: Users, gradient: "from-blue-500 to-cyan-500" },
    { title: "Innovation", description: "Pioneering the future of learning with AI-powered personalization and cutting-edge technology", icon: Lightbulb, gradient: "from-purple-500 to-pink-500" },
    { title: "Excellence", description: "Delivering premium educational experiences that exceed expectations at every touchpoint", icon: Award, gradient: "from-amber-500 to-orange-500" },
    { title: "Community", description: "Fostering vibrant learning communities where collaboration and support drive success", icon: Heart, gradient: "from-red-500 to-rose-500" },
    { title: "Personalization", description: "Crafting unique learning journeys that adapt to individual goals, pace, and preferences", icon: Sparkles, gradient: "from-teal-500 to-emerald-500" },
    { title: "Growth", description: "Empowering continuous transformation through lifelong learning and skill development", icon: TrendingUp, gradient: "from-indigo-500 to-blue-500" },
];


// Enhanced Variants
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.08,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};


const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const About: FC = () => {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    return (
        <article className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950 overflow-hidden">

            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.4, 1],
                        x: [-100, 100, -100],
                        y: [-50, 50, -50],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="container mx-auto px-4 py-20 max-w-7xl relative z-10">

                {/* Hero Section */}
                <motion.header
                    className="text-center mb-10 relative"
                    initial="hidden"
                    animate="visible"
                    style={{ opacity, scale }}
                    variants={fadeUp}
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-block mb-8"
                    >
                        <span className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold tracking-wider shadow-lg shadow-blue-500/50">
                            ✨ ABOUT NEXT-LEARN
                        </span>
                    </motion.div>

                    <motion.h1
                        className="text-5xl md:text-7xl font-black mb-8 leading-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                            Revolutionizing
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Digital Education
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        We&apos;re on a mission to democratize learning through
                        <span className="font-semibold text-blue-600 dark:text-blue-400"> innovative technology </span>
                        and create a future where education knows no boundaries.
                    </motion.p>

                </motion.header>


                {/* Team Section with Premium Design */}
                <motion.section
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-150px" }}
                    aria-labelledby="team-heading"
                    className="mb-16"
                >
                    <motion.div className="text-center mb-10" variants={fadeUp}>
                        <h2 id="team-heading" className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                            Meet the <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Visionaries</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            The passionate leaders revolutionizing the future of education
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                className="group relative bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 border border-gray-200 dark:border-gray-700"
                                variants={fadeUp}
                                custom={i}
                                whileHover={{ y: -12, scale: 1.02 }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                                {/* Photo Header */}
                                <div className="relative h-90 overflow-hidden">
                                    {/* Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-90`}></div>

                                    {/* Background Image */}
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover mix-blend-overlay opacity-80 group-hover:scale-110 transition-transform duration-700"
                                        style={{ objectFit: 'cover' }} // optional but recommended
                                        priority={true} // optional: if you want this image to load eagerly
                                    />

                                    {/* Gradient Overlay on top */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-800 via-transparent to-transparent"></div>

                                    {/* Social Media Links - Top Right */}
                                    <div className="absolute top-6 right-6 flex gap-3">
                                        {member.socials.linkedin && (
                                            <a
                                                href={member.socials.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg hover:scale-110"
                                                aria-label="LinkedIn Profile"
                                            >
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {member.socials.github && (
                                            <a
                                                href={member.socials.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg hover:scale-110"
                                                aria-label="GitHub Profile"
                                            >
                                                <Github className="w-5 h-5" />
                                            </a>
                                        )}
                                        {member.socials.email && (
                                            <a
                                                href={`mailto:${member.socials.email}`}
                                                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all duration-300 shadow-lg hover:scale-110"
                                                aria-label="Email"
                                            >
                                                <Mail className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>

                                    {/* Floating Photo Badge */}
                                    <div className="absolute -bottom-16 left-10">
                                        <div className="relative">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${member.color} rounded-3xl blur-xl opacity-60`}></div>
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                width={128} // 32rem = 128px
                                                height={128}
                                                className="relative rounded-3xl object-cover border-4 border-white dark:border-gray-800 shadow-2xl group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 px-10 pb-10 relative z-10">
                                    <div className="mb-2">
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            {member.name}
                                        </h3>
                                        <p className={`text-lg font-semibold bg-gradient-to-r ${member.color} bg-clip-text text-transparent mb-1`}>
                                            {member.role}
                                        </p>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                                        {member.description}
                                    </p>

                                    <div className="mb-6">
                                        <div className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                                            Expertise
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {member.expertise.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-300"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Award className="w-5 h-5 text-yellow-500" />
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">
                                                    {member.achievements}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
                {/* Mission & Vision with Premium Design */}
                <motion.section
                    className="grid lg:grid-cols-2 gap-8 mb-8"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-150px" }}
                    aria-labelledby="mission-vision-heading"
                >
                    <motion.div
                        className="group relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-[2.5rem] shadow-2xl p-8 text-white overflow-hidden hover:scale-[1.02] transition-transform duration-500"
                        variants={scaleIn}
                    >
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -ml-36 -mb-36 group-hover:scale-110 transition-transform duration-700"></div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-sm group-hover:rotate-12 transition-transform duration-500">
                                <Target className="w-10 h-10" />
                            </div>
                            <h2 className="text-4xl font-black mb-6">Our Mission</h2>
                            <div className="w-20 h-1 bg-white/50 mb-8"></div>
                            <p className="text-blue-50 mb-6 leading-relaxed text-lg">
                                To democratize access to world-class education by leveraging cutting-edge technology, making learning personalized, engaging, and effective for every individual, regardless of their background or location.
                            </p>

                            <div className="mt-8 flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30"></div>
                                    ))}
                                </div>
                                <span className="text-sm text-blue-100">Trusted by thousands worldwide</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="group relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[2.5rem] shadow-2xl p-12 text-white overflow-hidden hover:scale-[1.02] transition-transform duration-500"
                        variants={scaleIn}
                    >
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mt-48 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-36 -mb-36 group-hover:scale-110 transition-transform duration-700"></div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-sm group-hover:rotate-12 transition-transform duration-500">
                                <Eye className="w-10 h-10" />
                            </div>
                            <h2 className="text-4xl font-black mb-6">Our Vision</h2>
                            <div className="w-20 h-1 bg-white/50 mb-8"></div>
                            <p className="text-indigo-50 mb-6 leading-relaxed text-lg">
                                A world where every individual has immediate access to the tools, resources, and support they need to achieve their educational aspirations and unlock their true potential.
                            </p>

                            <div className="mt-8 flex items-center gap-3">
                                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                                <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                                <span className="ml-2 text-sm text-indigo-100">Rated 4.9/5.0</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.section>

                {/* Core Values with Premium Cards */}
                <motion.section
                    className="mb-1"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-150px" }}
                    aria-labelledby="values-heading"
                >
                    <motion.div className="text-center mb-16" variants={fadeUp}>
                        <h2 id="values-heading" className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                            Our Core <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Values</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            The fundamental principles that guide every decision we make
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, i) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={i}
                                    className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 overflow-hidden"
                                    variants={fadeUp}
                                    custom={i}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                    <div className="relative z-10">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                            {value.description}
                                        </p>

                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.section>



            </div>
        </article>
    );
};

export default About;