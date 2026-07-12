"use client";

import { useEffect, useState } from "react";
import ArrowUpIcon from "@/components/common/icons/ArrowUpIcon";
import ArrowDownIcon from "@/components/common/icons/ArrowDownIcon";
import { smoothScrollToY } from "@/lib/utils/scroll";

/**
 * 화면 우측 하단에 위치하여 최상단 및 최하단으로 부드러운 스크롤을 돕는 플로팅 위젯입니다.
 */
export default function ScrollButtons() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // TypeScript 타입 추론 오류(never)를 방지하기 위해 window 객체를 강제 타입 캐스팅합니다.
    const win = window as unknown as Window;

    // 최적화된 리사이즈 관찰자 (ResizeObserver)
    // 윈도우 resize 이벤트나 스크롤 리스너 없이 DOM 크기 변화만 비동기로 모니터링하여 jank 현상을 방지합니다.
    const observer = new ResizeObserver(() => {
      win.requestAnimationFrame(() => {
        const isScrollable = document.documentElement.scrollHeight > win.innerHeight;
        setIsVisible(isScrollable);
      });
    });

    observer.observe(document.body);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!isVisible) return null;

  const scrollToTop = () => {
    smoothScrollToY(0);
  };

  const scrollToBottom = () => {
    smoothScrollToY(document.documentElement.scrollHeight);
  };

  return (
    <div className="scroll-floating-widget fixed right-6 bottom-6 z-50 flex flex-col gap-2 rounded-2xl border border-neutral-200/50 bg-white/70 p-2 shadow-lg backdrop-blur-md dark:border-neutral-800/50 dark:bg-neutral-950/70">
      <button
        onClick={scrollToTop}
        type="button"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-neutral-100/50 text-neutral-600 transition-all hover:scale-105 hover:bg-neutral-200/80 hover:text-neutral-900 active:scale-95 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:bg-neutral-800/80 dark:hover:text-neutral-50"
        title="위로 이동"
        aria-label="Scroll to top"
      >
        <ArrowUpIcon className="h-4.5 w-4.5" />
      </button>
      <button
        onClick={scrollToBottom}
        type="button"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-neutral-100/50 text-neutral-600 transition-all hover:scale-105 hover:bg-neutral-200/80 hover:text-neutral-900 active:scale-95 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:bg-neutral-800/80 dark:hover:text-neutral-50"
        title="아래로 이동"
        aria-label="Scroll to bottom"
      >
        <ArrowDownIcon className="h-4.5 w-4.5" />
      </button>
    </div>
  );
}
