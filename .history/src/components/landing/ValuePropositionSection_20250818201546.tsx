"use client";

import { Shield, Heart, Users } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Built for You",
    description: "Unlike traditional LMS platforms designed for institutions, NextLearn is crafted specifically for individual learners."
  },
  {
    icon: Heart,
    title: "Personalized Experience",
    description: "Everything adapts to your learning style, pace, and preferences. No unnecessary complexity or distractions."
  },
  {
    icon: Users,
    title: "Your Content, Your Control",
    description: "Complete ownership of your learning materials, roadmaps, and progress. You decide how to organize and access everything."
  }
];

export default function ValuePropositionSection() {
  return (
