import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Match } from "@/types/match";
import { parseMatchSearchParams, filterMatches, extractActiveMonths } from "@/lib/utils/match";
import { getCurrentKstMonth } from "@/lib/utils/date";

export function useMatchDashboardState(allMatches: Match[]) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // KST(UTC+9) 기준 현재 월 계산
  const kstMonth = getCurrentKstMonth();

  // URL에서 초기 파라미터 읽어오기
  const initialMonthParam = searchParams.get("month") || undefined;
  const initialLeagueParam = searchParams.get("league") || undefined;

  const { selectedMonth: initMonth, selectedLeague: initLeague } = parseMatchSearchParams(
    initialMonthParam,
    initialLeagueParam,
    kstMonth,
  );

  // 로컬 React 상태 관리
  const [selectedMonth, setSelectedMonth] = useState<number>(initMonth);
  const [selectedLeague, setSelectedLeague] = useState<string>(initLeague);

  // 최초 접속 시 서버 측의 SWR 백그라운드 캐시 갱신(수백ms) 시간을 고려해
  // 2초 뒤에 1차 새로고침, 4초 뒤에 2차 새로고침(한 번 더)을 자동 수행하여 최신 데이터가 더 안전하게 반영되도록 합니다.
  useEffect(() => {
    const timer1 = setTimeout(() => {
      router.refresh();
    }, 2000);

    const timer2 = setTimeout(() => {
      router.refresh();
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [router]);

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

  // 경기가 존재하는 월 목록 추출
  const activeMonths = extractActiveMonths(allMatches);

  // 최초 진입 시 스크롤 작동 조건 계산
  const urlMonthParam = searchParams.get("month");
  const isInitialEntry = !urlMonthParam || parseInt(urlMonthParam, 10) === kstMonth;

  return {
    selectedMonth,
    selectedLeague,
    filteredMatches,
    activeMonths,
    isInitialEntry,
    handleMonthSelect,
    handleLeagueSelect,
  };
}
