"use client";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3 } from "lucide-react";
import { useState } from "react";

export default function AnalyticsCard() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  
  const dataPoints = [
    { x: 0, y: 100, value: 65, day: "Mon" },
    { x: 50, y: 90, value: 72, day: "Tue" },
    { x: 100, y: 75, value: 78, day: "Wed" },
    { x: 150, y: 70, value: 82, day: "Thu" },
    { x: 200, y: 55, value: 88, day: "Fri" },
    { x: 250, y: 45, value: 91, day: "Sat" },
    { x: 300, y: 35, value: 95, day: "Sun" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group"
    >
      <div className="rounded-2xl border-2 border-white/40 bg-white/60 backdrop-blur-xl p-8 space-y-6 shadow-xl hover:shadow-2xl transition-all overflow-hidden ">
        {/* Floating background orb */}
        <motion.div
          className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/10 group-hover:via-purple-400/10 group-hover:to-pink-400/10 transition-all duration-500"
        />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
            >
              <BarChart3 className="w-5 h-5 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900">Performance Trend</h3>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-2 py-2 text-sm font-bold shadow-md ">
            Last 7 days
          </Badge>
        </div>

        {/* Chart Container */}
        <div className="relative z-10 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-xl p-6 border border-white/40">
          <svg viewBox="0 0 300 120" className="w-full h-36">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 0.4 }} />
                <stop offset="50%" style={{ stopColor: 'rgb(147, 51, 234)', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: 'rgb(236, 72, 153)', stopOpacity: 0 }} />
              </linearGradient>
              
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)' }} />
                <stop offset="50%" style={{ stopColor: 'rgb(147, 51, 234)' }} />
                <stop offset="100%" style={{ stopColor: 'rgb(236, 72, 153)' }} />
              </linearGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Grid lines */}
            {[20, 40, 60, 80, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="300"
                y2={y}
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Animated gradient fill */}
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              d="M 0 100 L 50 90 L 100 75 L 150 70 L 200 55 L 250 45 L 300 35 L 300 120 L 0 120 Z"
              fill="url(#grad)"
            />

            {/* Animated line with glow */}
            <motion.polyline
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,100 50,90 100,75 150,70 200,55 250,45 300,35"
              filter="url(#glow)"
            />

            {/* Animated data points */}
            {dataPoints.map((point, i) => (
              <g key={i}>
                <motion.circle
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * i, type: "spring", stiffness: 300 }}
                  cx={point.x}
                  cy={point.y}
                  r={hoveredPoint === i ? "8" : "5"}
                  fill="white"
                  stroke="url(#lineGrad)"
                  strokeWidth="3"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
                />
                
                {/* Pulsing ring on hover */}
                {hoveredPoint === i && (
                  <motion.circle
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    cx={point.x}
                    cy={point.y}
                    r="8"
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="2"
                  />
                )}

                {/* Tooltip on hover */}
                {hoveredPoint === i && (
                  <motion.g
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <rect
                      x={point.x - 25}
                      y={point.y - 40}
                      width="50"
                      height="30"
                      rx="8"
                      fill="rgb(17, 24, 39)"
                      style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
                    />
                    <text
                      x={point.x}
                      y={point.y - 30}
                      textAnchor="middle"
                      fill="white"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {point.day}
                    </text>
                    <text
                      x={point.x}
                      y={point.y - 18}
                      textAnchor="middle"
                      fill="rgb(96, 165, 250)"
                      fontSize="13"
                      fontWeight="bold"
                    >
                      {point.value}%
                    </text>
                  </motion.g>
                )}
              </g>
            ))}
          </svg>

          {/* Day labels */}
          <div className="flex justify-between mt-2 px-1">
            {dataPoints.map((point, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`text-xs font-semibold ${
                  hoveredPoint === i ? 'text-purple-600 scale-110' : 'text-gray-500'
                } transition-all`}
              >
                {point.day}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-2 text-base font-bold shadow-lg">
                <TrendingUp className="w-4 h-4 mr-1 inline" />
                ↑ 15%
              </Badge>
            </motion.div>
            <span className="text-sm font-semibold text-gray-600">Consistent improvement</span>
          </div>

          <motion.div
            className="text-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              85.7%
            </p>
            <p className="text-xs text-gray-500 font-semibold">Average</p>
          </motion.div>
        </div>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        />
      </div>
    </motion.div>
  );
}