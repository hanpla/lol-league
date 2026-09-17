import { ReactNode } from "react";
import type { Metadata } from "next";
import ThemeProvider from "@/components/providers/ThemeProvider";
import ScrollButtons from "@/components/match/ScrollButtons";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

const SITE_URL = "https://lol-league.vercel.app";
const SITE_TITLE = "LCK 일정 & 롤 대회 일정 · 경기 결과 | LOL League Hub";
const SITE_DESCRIPTION =
  "LCK(롤챔스), MSI, EWC 등 2026 리그 오브 레전드 주요 대회 일정과 실시간 경기 결과, 대진표, 경기 시간을 가장 빠르고 깔끔하게 확인하세요.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | LOL League Hub",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "LCK 일정",
    "롤 대회 일정",
    "LCK 경기 일정",
    "롤 경기 일정",
    "2026 LCK",
    "LCK 스프링",
    "LCK 서머",
    "롤 대진표",
    "롤 경기 시간",
    "MSI 일정",
    "EWC 롤 일정",
    "롤 e스포츠 일정",
    "LOL 대회 일정",
    "LOL League Hub",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "LOL League Hub",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
