"use client";

import { Laptop, Calendar, FileText } from "lucide-react";

const demos = [
  {
    icon: Laptop,
    title: "Dashboard Overview",
    description: "Your personalized learning hub with all your roadmaps, materials, and progress at a glance.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Calendar,
    title: "Calendar View",
    description: "Visual timeline of your study sessions, deadlines, and upcoming milestones.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: FileText,
    title: "File Management",
    description: "Drag-and-drop interface for organizing your study materials and resources.",
    color: "from-green-500 to-emerald-500"
  }
];

export default function DemoSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> NextLearn in Action</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Built with modern web technologies for a seamless learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {demos.map((demo, index) => (
            <div key={index} className="group">
