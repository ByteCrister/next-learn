"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Clock, FileText, Zap, PenTool } from "lucide-react";
import { useState } from "react";
import SectionHeading from "./SectionHeading";
import AnalyticsCard from "./AnalyticsCard";
import HistoryTimeline from "./HistoryTimeline";
import MetricCard from "./MetricCard";

function ExamFeatureCard({ icon, title, desc, metric }: { icon: React.ReactNode; title: string; desc: string; metric: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05, z: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group cursor-pointer"
    >
      <div className="h-full border-2 border-white/40 bg-white/60 backdrop-blur-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all rounded-2xl">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-pink-400/0 to-blue-400/0 group-hover:from-purple-400/20 group-hover:via-pink-400/20 group-hover:to-blue-400/20 transition-all duration-500"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        {/* Floating orb */}
        <motion.div
          className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="p-8 relative z-10" style={{ transform: "translateZ(20px)" }}>
          <div className="space-y-6">
            {/* Icon with glow effect */}
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative inline-block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                {icon}
              </div>
            </motion.div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                {title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {desc}
              </p>
            </div>

            {/* Metric Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-2 text-sm font-bold shadow-lg rounded-full">
                {metric}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          style={{ transform: "translateZ(30px)" }}
        />
      </div>
    </motion.div>
  );
}

export default function ExamsSection() {
  return (
    <section className="space-y-10 max-w-7xl mx-auto px-2 py-16">
      <SectionHeading
        icon={<PenTool className="w-8 h-8" />}
        title="Exams & assessments"
        subtitle="Take interactive exams with instant feedback, track your progress over time, and join collaborative assessments."
      />

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl" />
        <Tabs defaultValue="interactive" className="relative">
          <TabsList className="grid grid-cols-3 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="interactive" className="data-[state=active]:bg-background">
              Interactive
            </TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="interactive" className="mt-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              <ExamFeatureCard
                icon={<Clock className="w-8 h-8 " />}
                title="Flexible timing"
                desc="Timed or untimed modes for different learning contexts"
                metric="95% completion"
              />
              <ExamFeatureCard
                icon={<FileText className="w-8 h-8" />}
                title="Rich questions"
                desc="MCQ, fill-in-blank, code, essay, and matching"
                metric="5 types"
              />
              <ExamFeatureCard
                icon={<Zap className="w-8 h-8" />}
                title="Auto-grading"
                desc="Instant feedback with detailed explanations"
                metric="< 1s response"
              />
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-8">
            <div className="grid md:grid-cols-2 gap-6">
              <AnalyticsCard />
              <div className="space-y-4">
                <MetricCard label="Average Score" value="87.5%" trend="+12%" />
                <MetricCard label="Topics Mastered" value="24/30" trend="+3" />
                <MetricCard label="Study Streak" value="14 days" trend="🔥" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-8">
            <HistoryTimeline />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}