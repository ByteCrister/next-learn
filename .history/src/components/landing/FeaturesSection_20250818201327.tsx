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
