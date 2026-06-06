"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Match } from "@/types/match";
import MonthTabs from "./MonthTabs";
import LeagueTabs from "./LeagueTabs";
import MatchList from "./MatchList";
import { parseMatchSearchParams, filterMatches } from "@/lib/utils/match";

interface MatchDashboardProps {
  allMatches: Match[];
}

export default function MatchDashboard({ allMatches }: MatchDashboardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 최초 접속 시 서버 측의 SWR 백그라운드 캐시 갱신(수백ms) 시간을 고려해 2초 뒤 1회 자동 새로고침(refresh) 수행
  useEffect(() => {
    const timer = setTimeout(() => {
      router.refresh();
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  // KST(UTC+9) 기준 현재 월 계산 (초기 렌더링 대입용)
  const now = new Date();
  const kstMonth = new Date(now.getTime() + 9 * 60 * 60 * 1000).getUTCMonth() + 1;

  // URL에서 초기 파라미터 읽어오기
  const initialMonthParam = searchParams.get("month") || undefined;
  const initialLeagueParam = searchParams.get("league") || undefined;

  const { selectedMonth: initMonth, selectedLeague: initLeague } = parseMatchSearchParams(
    initialMonthParam,
    initialLeagueParam,
    kstMonth,
  );

  // 로컬 React 상태 관리 (서버 요청 없이 즉각 리렌더링)
  const [selectedMonth, setSelectedMonth] = useState<number>(initMonth);
  const [selectedLeague, setSelectedLeague] = useState<string>(initLeague);

  // URL 쿼리 스트링 동기화 함수 (Next.js 서버 패치를 유발하지 않고 주소창만 업데이트)
  const syncUrlParams = (month: number, league: string) => {
    const params = new URLSearchParams();
    params.set("month", month.toString());
    if (league !== "all") {
      params.set("league", league);
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
  };

  // 월 탭 변경 핸들러
  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    syncUrlParams(month, selectedLeague);
  };

  // 리그 탭 변경 핸들러
  const handleLeagueSelect = (league: string) => {
    setSelectedLeague(league);
    syncUrlParams(selectedMonth, league);
  };

  // 클라이언트 단에서 0ms 만에 즉각 필터링 수행
  const filteredMatches = filterMatches(allMatches, selectedMonth, selectedLeague);

  // 최초 진입 시 스크롤 작동 조건 계산
  // month 파라미터가 URL에 존재하지 않을 때 or 현재 달(6월)을 보고 있을 때 스크롤 타겟팅 허용
  const urlMonthParam = searchParams.get("month");
  const isInitialEntry = !urlMonthParam || parseInt(urlMonthParam, 10) === kstMonth;

  return (
    <>
      {/* Month Navigation Tabs Component */}
      <MonthTabs
        selectedMonth={selectedMonth}
        selectedLeague={selectedLeague}
        onMonthSelect={handleMonthSelect}
      />

      {/* League Filtering Tabs Component */}
      <LeagueTabs
        selectedMonth={selectedMonth}
        selectedLeague={selectedLeague}
        onLeagueSelect={handleLeagueSelect}
      />

      {/* Grouped Match List Component */}
      <MatchList matches={filteredMatches} isInitialEntry={isInitialEntry} />
    </>
  );
}
