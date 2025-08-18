"use client";

import { CheckCircle, UserPlus, LayoutDashboard, Target } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your account instantly with just your email.",
    step: 1
  },
  {
    icon: LayoutDashboard,
    title: "Build Your Roadmap",
    description: "Add milestones, upload files, and link resources to create your personalized learning path.",
    step: 2
  },
  {
    icon: Target,
    title: "Stay on Track",
    description: "Manage everything with your personalized dashboard and never miss a deadline.",
    step: 3
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started in
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 3 Simple Steps</span>
          </h2>
