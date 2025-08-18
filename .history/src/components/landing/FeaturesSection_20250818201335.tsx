"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Folder, Link2, Calendar } from "lucide-react";

const features = [
  {
    icon: Map,
    title: "Roadmap Builder",
    description: "Create personalized course plans with milestones, topics, and deadlines.",
    color: "text-blue-500"
  },
  {
    icon: Folder,
    title: "Study Materials",
    description: "Upload PDFs, notes, and slides. Keep everything organized in one place.",
    color: "text-green-500"
  },
  {
    icon: Link2,
    title: "External Resources",
    description: "Bookmark YouTube videos, Google Drive links, and articles.",
    color: "text-purple-500"
  },
  {
    icon: Calendar,
    title: "Integrated Calendar",
    description: "Track study sessions, deadlines, and classes with a built-in calendar.",
    color: "text-orange-500"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Stay Organized</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Powerful features designed specifically for self-learners who want to take control of their education.
          </p>
        </div>

