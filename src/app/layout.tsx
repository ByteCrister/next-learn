import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { Inter, Sora } from 'next/font/google'
import "../lib/cron/scheduler";

export const metadata: Metadata = {
  title: {
    default: "Next Learn - Study Planner & Roadmap Management",
    template: "%s | Next Learn"
  },
  description: "A user-friendly study planner with organized roadmap management. Plan your learning journey effectively with Next Learn.",
  keywords: ["study planner", "learning roadmap", "education", "study management", "academic planning"],
  authors: [{ name: "Next Learn Team" }],
  creator: "Next Learn",
  metadataBase: new URL("https://next-learn.vercel.app"),
  openGraph: {
    title: "Next Learn - Study Planner & Roadmap Management",
    description: "A user-friendly study planner with organized roadmap management.",
    url: "https://next-learn.vercel.app",
    siteName: "Next Learn",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Next Learn - Study Planner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next Learn - Study Planner",
    description: "A user-friendly study planner with organized roadmap management.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
