import { ReactNode } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import ThemeProvider from "@/components/providers/ThemeProvider";
import ScrollButtons from "@/components/match/ScrollButtons";
import "./globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "롤 리그",
  description: "리그 오브 레전드의 대회 일정을 모아놓은 사이트 입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          {children}
          <ScrollButtons />
        </ThemeProvider>
      </body>
    </html>
  );
}
