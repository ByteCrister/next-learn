import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import { Inter, Sora } from 'next/font/google'

export const metadata: Metadata = {
  title: "Next Learn",
  description: "A user friendly study planner with organized roadmap management.",
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
