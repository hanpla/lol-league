"use client";

import { useEffect, useRef } from "react";
import { Match } from "@/types/match";
import { formatMatchDate } from "@/lib/utils/date";
import { smoothScrollTo } from "@/lib/utils/scroll";
import MatchCard from "./MatchCard";

interface MatchListProps {
  matches: Match[];
  isInitialEntry?: boolean;
}

export default function MatchList({ matches, isInitialEntry = false }: MatchListProps) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Group matches by date in linear O(N) time (input matches are already pre-sorted by scheduled_at ascending)
  const groupedMatches: { dateStr: string; matchesOnDate: Match[] }[] = [];
  matches.forEach((match) => {
    const dateStr = formatMatchDate(match.scheduled_at);
    const lastGroup = groupedMatches[groupedMatches.length - 1];
    if (lastGroup && lastGroup.dateStr === dateStr) {
      lastGroup.matchesOnDate.push(match);
    } else {
      groupedMatches.push({ dateStr, matchesOnDate: [match] });
    }
  });

  // 오늘 날짜와 가장 가까운 날짜 그룹의 인덱스를 계산합니다.
  let targetIndex = -1;
  if (groupedMatches.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let minDiff = Infinity;

    groupedMatches.forEach((group, index) => {
      const matchDate = new Date(group.matchesOnDate[0].scheduled_at);
      matchDate.setHours(0, 0, 0, 0);

      const diff = Math.abs(today.getTime() - matchDate.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        targetIndex = index;
      }
    });
  }

  // 컴포넌트 마운트 시 지정된 targetIndex 요소로 스크롤을 내립니다 (최초 진입 시 딱 1회만 동작).
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (
      isInitialEntry &&
      !hasScrolledRef.current &&
      targetIndex !== -1 &&
      itemRefs.current[targetIndex]
    ) {
      hasScrolledRef.current = true; // 최초 1회 실행 완료 마킹
      // 조금의 브라우저 레이아웃 계산 여유를 주기 위해 setTimeout 활용
      const timer = setTimeout(() => {
        const targetElement = itemRefs.current[targetIndex];
        if (targetElement) {
          smoothScrollTo(targetElement, 600); // 600ms 동안 감속 곡선으로 부드럽게 스크롤
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [targetIndex, isInitialEntry]);

  if (matches.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white py-20 text-center shadow-sm transition-colors duration-300 dark:border-neutral-900/40 dark:bg-neutral-900/10 dark:shadow-none">
        <h3 className="text-base font-bold text-neutral-700 dark:text-neutral-400">
          등록된 경기 일정이 없습니다
        </h3>
        <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
          다른 월의 경기 일정을 확인해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {groupedMatches.map(({ dateStr, matchesOnDate }, index) => {
        return (
          <div
            key={dateStr}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="scroll-mt-20 space-y-4"
          >
            {/* Date Header */}
            <div className="text-center">
              <h2
                className="mt-0.5 text-lg font-bold text-neutral-800 dark:text-neutral-200"
                suppressHydrationWarning
              >
                {dateStr}
              </h2>
            </div>

            {/* Matches List */}
            <div className="space-y-3">
              {matchesOnDate.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
