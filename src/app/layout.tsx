import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "AI 时代界面设计的未来 | Visual Essay",
  description: "探索 AI 如何重新定义界面设计，从危机到融合的视觉叙事",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        {/* Fallback: if JS fails to load, make framer-motion hidden content visible */}
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: `
            [style*="opacity:0"], [style*="opacity: 0"] {
              opacity: 1 !important;
              transform: none !important;
            }
          `}} />
        </noscript>
      </head>
      <body
        className={`${cormorant.variable} ${inter.variable} antialiased bg-[#1a1a1a] text-[#f5f5f0]`}
      >
        {children}
      </body>
    </html>
  );
}
