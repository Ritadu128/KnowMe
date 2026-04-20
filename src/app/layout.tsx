import type { Metadata } from "next";
import { Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const notoSerifSC = Noto_Serif_SC({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-noto-serif-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "知我 · 自我探索",
  description: "帮助你通过对话慢慢看清自己",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={notoSerifSC.variable}>
      <body>{children}</body>
    </html>
  );
}
