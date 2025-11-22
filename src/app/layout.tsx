import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { Inter, Sora } from 'next/font/google'
import "../lib/cron/scheduler";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })

export const metadata: Metadata = {
  title: {
    default: "NextLearn - Study Planner & Roadmap Management",
    template: "%s | NextLearn"
  },
  description:
    "A user-friendly study planner with organized roadmap management. Plan your learning journey effectively with Next Learn.",
  keywords: [
    "study planner",
    "learning roadmap",
    "education",
    "study management",
    "academic planning",
    "Sadiqul Islam Shakib",
    "Md. Istiak Hussain Adil",
    "NEUB",
    "North East University Bangladesh"
  ],
  authors: [
    { name: "Sadiqul Islam Shakib", url: "https://www.linkedin.com/in/sadiqul-islam-shakib" },
    { name: "Md. Istiak Hussain Adil", url: "https://www.linkedin.com/in/istiak-adil-755361329" }
  ],
  creator: "Next Learn",

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico"
  },

  manifest: "/site.webmanifest",

  metadataBase: new URL("https://next-learn-nu-olive.vercel.app"),

  openGraph: {
    title: "Next Learn - Study Planner & Roadmap Management",
    description: "A user-friendly study planner with organized roadmap management.",
    url: "https://next-learn-nu-olive.vercel.app",
    siteName: "Next Learn",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NextLearn - Study Planner"
      }
    ],
    locale: "en_US",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "NextLearn - Study Planner",
    description: "A user-friendly study planner with organized roadmap management.",
    images: ["/og-image.jpg"]
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};


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
