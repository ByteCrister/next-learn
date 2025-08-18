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
