import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "农历日历查询",
  description: "公历查农历、干支、节气与节日标签（Mock 数据）",
};

/**
 * 根布局
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        <SiteHeader />
        <main className="container mx-auto max-w-4xl px-4 py-6 sm:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
