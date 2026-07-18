import { ReactNode } from "react";
import type { Metadata } from "next";
import ThemeProvider from "@/components/providers/ThemeProvider";
import ScrollButtons from "@/components/match/ScrollButtons";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "롤 리그 대회 일정",
  description: "리그 오브 레전드의 대회 일정을 모아놓은 사이트 입니다.",
  verification: {
    google: "XdNWEY6QgvSgWWTcXJVBmzQnbxnn-5lc5mwJqOFPDJs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" className="antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          {children}
          <ScrollButtons />
        </ThemeProvider>
      </body>
    </html>
  );
}
