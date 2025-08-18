import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import { TooltipProvider } from "@/components/ui/tooltip";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Next Learn - Study Planner & Roadmap Management",
    template: "%s | Next Learn"
  },
  description: "A user-friendly study planner with organized roadmap management. Plan your learning journey effectively with Next Learn.",
  keywords: ["study planner", "learning roadmap", "education", "study management", "academic planning"],
  authors: [{ name: "Next Learn Team" }],
  creator: "Next Learn",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://next-learn.vercel.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </TooltipProvider>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
        />
      </body>
    </html>
  );
}
