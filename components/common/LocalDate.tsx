"use client";

import { useSyncExternalStore } from "react";
import { formatMatchDate } from "@/lib/utils/date";

const emptySubscribe = () => () => {};

export default function LocalDate({ dateString }: { dateString: string }) {
  // 마운트 완료 여부를 안전하게 검사하는 리액트 19 표준 Store 패턴
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isMounted) {
    return (
      <span className="dark:bg-neutral-850 inline-block h-4 w-24 animate-pulse rounded bg-neutral-200" />
    );
  }

  return <span>{formatMatchDate(dateString)}</span>;
}
