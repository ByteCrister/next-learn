"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useUsersStore } from "@/store/useUsersStore";
import { HiUserGroup, HiChartBar } from "react-icons/hi";

type Point = { x: string; y: number };

function toSeries(arr: { _id: number; count: number; minDate: string; maxDate: string }[]): Point[] {
  return (arr || []).map((b) => ({
    x: `${format(new Date(b.minDate), "MMM d")}–${format(new Date(b.maxDate), "MMM d")}`,
    y: b.count,
  }));
}

export function ChartsPanel() {
  const { aggregates, aggregatesState } = useUsersStore();

  if (aggregatesState.loading) {
    return <ChartsSkeleton />;
  }

  const users = toSeries(aggregates?.stats.users || []);
  const exams = toSeries(aggregates?.stats.exam || []);
  const materials = toSeries(aggregates?.stats.material || []);

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Users over time */}
      <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-900/20 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-md">
            <HiUserGroup className="h-5 w-5" />
          </div>
          <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Users over time
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={users}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="x" tick={{ fill: "var(--tw-prose-body)" }} />
              <YAxis tick={{ fill: "var(--tw-prose-body)" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(17, 24, 39, 0.85)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "0.5rem",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke="url(#usersGradient)"
                strokeWidth={3}
                dot={false}
              />
              <defs>
                <linearGradient id="usersGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Exams vs Materials */}
      <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-white/5 dark:from-neutral-900/40 dark:to-neutral-900/20 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-md">
            <HiChartBar className="h-5 w-5" />
          </div>
          <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Exams vs Materials
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={materials.map((m, i) => ({
                x: m.x,
                materials: m.y,
                exams: exams[i]?.y ?? 0,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="x" tick={{ fill: "var(--tw-prose-body)" }} />
              <YAxis tick={{ fill: "var(--tw-prose-body)" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(17, 24, 39, 0.85)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "0.5rem",
                  color: "#fff",
                }}
              />
              <Bar dataKey="materials" fill="url(#materialsGradient)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="exams" fill="url(#examsGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="materialsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
                <linearGradient id="examsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[0, 1].map((i) => (
        <Card
          key={i}
          className="border-white/10 bg-white/[0.03] backdrop-blur-xl animate-pulse"
        >
          <CardHeader>
            <div className="h-4 w-40 bg-white/10 rounded" />
          </CardHeader>
          <CardContent className="h-72">
            <div className="h-full w-full rounded bg-white/5" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
