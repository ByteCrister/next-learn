"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useRouter } from "next/navigation";
import routeDashboard from "@/utils/helpers/routeDashboard";

// Variants
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

const CTASection: FC = () => {
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
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            variants={fadeInUp}
          >
            Take Control of Your Learning Today
          </motion.h2>

          <motion.p
            className="text-xl text-blue-100 mb-8"
            variants={fadeInUp}
          >
            Create your first roadmap in minutes. No credit card required.
            Forever free for students.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            variants={fadeInUp}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleClick}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                  {user ? 'Make your life more easier' : 'Sign Up Free'}
                  <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature List */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center text-blue-100"
            variants={containerVariants}
          >
            {[
              "No credit card required",
              "Forever free for students",
              "Cancel anytime",
            ].map((text, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.25 }}
              >
                <Check className="w-4 h-4" />
                <span>{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
