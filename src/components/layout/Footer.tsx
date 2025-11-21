"use client";
import React from "react";
import { motion } from "framer-motion";
import FooterStats from "./FooterStats";
import FooterBrand from "./FooterBrand";
import FooterNav from "./FooterNav";
import FooterNewsletter from "./FooterNewsletter";
import FooterSocial from "./FooterSocial";
import FooterCopyright from "./FooterCopyright";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 via-blue-200 to-blue-50 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246 / 0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating Gradient Orbs */}
      <motion.div
        className="absolute -top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats Section */}
        <FooterStats />

        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16"
        >
          {/* Brand Section */}
          <FooterBrand />

          {/* Navigation Links */}
          <FooterNav />

          {/* Newsletter */}
          <FooterNewsletter />
        </motion.div>

        {/* Premium Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative h-px mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row justify-between items-center gap-8"
        >
          {/* Social Icons */}
          <FooterSocial />

          {/* Copyright */}
          <FooterCopyright />
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;