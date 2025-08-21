"use client";


// Local animation variants
const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2 },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const values = [
  {
    icon: (
      <ShieldIcon className="w-8 h-8 text-blue-500" />
    ),
    title: "Built for You",
    description:
      "Unlike traditional LMS platforms designed for institutions, NextLearn is crafted specifically for individual learners.",
  },
  {
    icon: (
      <FavoriteIcon className="w-8 h-8 text-purple-500" />
    ),
    title: "Personalized Experience",
    description:
      "Everything adapts to your learning style, pace, and preferences. No unnecessary complexity or distractions.",
  },
  {
    icon: (
      <PeopleIcon className="w-8 h-8 text-green-500" />
    ),
    title: "Your Content, Your Control",
    description:
      "Complete ownership of your learning materials, roadmaps, and progress. You decide how to organize and access everything.",
  },
];

export default function ValuePropositionSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={fadeIn}
          >
            Why
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              NextLearn?
            </span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            variants={fadeIn}
          >
            We&apos;re not just another learning platform. We&apos;re your personal
            learning companion.
          </motion.p>
        </motion.div>

        {/* Value Cards */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {value.icon}
                  </motion.div>
                  <motion.h3
                    className="text-xl font-semibold mb-3"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    {value.title}
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 dark:text-gray-400"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {value.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  {`"Unlike traditional LMS, NextLearn isn't for admins or
                  institutions. It&apos;s built for you, the learner."`}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Your content, your pace, your control.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
