"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            variants={fadeIn}
          >
            Take Control of Your Learning Today
          </motion.h2>
          
          <motion.p 
            className="text-xl text-blue-100 mb-8"
            variants={fadeIn}
          >
            Create your first roadmap in minutes. No credit card required. 
            Forever free for students.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            variants={fadeIn}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/user-signup">
                  Sign Up Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center text-blue-100"
            variants={staggerContainer}
          >
            {["No credit card required", "Forever free for students", "Cancel anytime"].map((text, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-2"
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
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
}
