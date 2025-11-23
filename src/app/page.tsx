import Home from "@/components/landing/Home";

export const metadata = {
  title: "NextLearn – Study Planner for Students in Bangladesh | Roadmap & Course Management",
  description:
    "NextLearn helps students create effective study plans, manage courses, and build roadmaps. Perfect for university and college students in Bangladesh.",
  alternates: {
    canonical: "https://next-learn-nu-olive.vercel.app",
  },
};

export default function page() {
  return <Home />;
}
