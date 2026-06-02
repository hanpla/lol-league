import { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="ko" className={`antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
