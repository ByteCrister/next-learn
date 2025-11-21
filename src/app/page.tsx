import Home from "@/components/landing/Home";

export const metadata = {
  title: "NextLearn | Study Planning & Course Management Platform",
  description:
    "Next Learn is a study planning and course management app built with Next.js, React and MongoDB. Create roadmaps, take timed assessments with auto-grading, and organise study routines.",
  authors: [{ name: "ByteCrister" }, { name: "Adil" }],
  keywords: [
    "Next.js",
    "React",
    "TypeScript",
    "MongoDB",
    "study planner",
    "course management",
    "roadmaps",
    "exams",
    "education",
    "learning"
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false
  },
  openGraph: {
    title: "Next Learn | Study Planning & Course Management Platform",
    description:
      "Next Learn — organise study materials, design hierarchical roadmaps, take timed exams with automatic grading, and manage study schedules in one place.",
    url: "https://next-learn-nu-olive.vercel.app/",
    siteName: "Next Learn",
    images: [
      {
        url: "https://next-learn-nu-olive.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Next Learn — Study Planning and Course Management"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Next Learn | Study Planning & Course Management Platform",
    description:
      "Next Learn — organise study materials, design hierarchical roadmaps, take timed exams with automatic grading, and manage study schedules in one place.",
    images: ["https://next-learn-nu-olive.vercel.app/og-image.png"]
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  },
  alternates: {
    canonical: "https://next-learn-nu-olive.vercel.app/"
  }
};

export default function page() {
  return <Home />;
}
