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
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Mock screenshot area */}
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${demo.color} opacity-20`}></div>
                  </div>
                  <div className="absolute top-4 left-4 right-4">
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
                      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${demo.color} flex items-center justify-center`}>
                      <demo.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">{demo.title}</h3>
