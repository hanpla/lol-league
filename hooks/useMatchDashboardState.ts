import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Match } from "@/types/match";
import {
  parseMatchSearchParams,
  filterMatches,
  extractActiveMonths,
  getDefaultMatchMonth,
} from "@/lib/utils/match";
import { getCurrentKstMonth } from "@/lib/utils/date";
import { getMatches } from "@/lib/actions/match";

export const useMatchDashboardState = (allMatches: Match[]) => {
  const searchParams = useSearchParams();

  // KST(UTC+9) 기준 현재 월 및 기본 선택 월(가장 가까운 예정 경기 월) 계산
  const kstMonth = getCurrentKstMonth();
  const defaultMonth = getDefaultMatchMonth(allMatches, kstMonth);

  // URL에서 초기 파라미터 읽어오기
  const initialMonthParam = searchParams.get("month") || undefined;
  const initialLeagueParam = searchParams.get("league") || undefined;

  const { selectedMonth: initMonth, selectedLeague: initLeague } = parseMatchSearchParams(
    initialMonthParam,
    initialLeagueParam,
    defaultMonth,
  );

  // 로컬 React 상태 관리
  const [selectedMonth, setSelectedMonth] = useState<number>(initMonth);
  const [selectedLeague, setSelectedLeague] = useState<string>(initLeague);
  const [matches, setMatches] = useState<Match[]>(allMatches);

  // 초기 SSR 데이터가 비어있을 경우에만 클라이언트 비동기 페칭 수행 (불필요한 중복 호출 방지)
  useEffect(() => {
    if (allMatches.length > 0) return;

    let isMounted = true;

    const fetchFreshMatches = async () => {
      try {
        const freshMatches = await getMatches();
        if (isMounted && freshMatches && freshMatches.length > 0) {
          setMatches(freshMatches);
          if (!initialMonthParam) {
            const freshDefaultMonth = getDefaultMatchMonth(freshMatches, kstMonth);
            setSelectedMonth(freshDefaultMonth);
          }
        }
      } catch (error) {
        console.error("실시간 경기 정보 갱신 실패:", error);
      }
    };

    fetchFreshMatches();

    return () => {
      isMounted = false;
    };
  }, [allMatches.length, initialMonthParam, kstMonth]);

  // 브라우저 뒤로가기/앞으로가기(popstate) 이벤트 감지하여 React 상태 동기화
  useEffect(() => {
    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const m = currentParams.get("month") || undefined;
      const l = currentParams.get("league") || undefined;
      const { selectedMonth: parsedMonth, selectedLeague: parsedLeague } = parseMatchSearchParams(
        m,
        l,
        defaultMonth,
      );
      setSelectedMonth(parsedMonth);
      setSelectedLeague(parsedLeague);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [defaultMonth]);

  // URL 쿼리 스트링 동기화 함수 (브라우저 히스토리 스택에 push)
  const syncUrlParams = (month: number, league: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("month", month.toString());
    if (league !== "all") {
      params.set("league", league);
    } else {
      params.delete("league");
    }
    const queryString = params.toString();
    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    if (window.location.search !== `?${queryString}`) {
      window.history.pushState(null, "", newUrl);
    }
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

  // 클라이언트 단에서 0ms 만에 즉각 필터링 수행 (useMemo 캐싱)
  const filteredMatches = useMemo(
    () => filterMatches(matches, selectedMonth, selectedLeague),
    [matches, selectedMonth, selectedLeague],
  );

  // 경기가 존재하는 월 목록 추출 (useMemo 캐싱)
  const activeMonths = useMemo(() => extractActiveMonths(matches), [matches]);

  // 최초 진입 시 스크롤 작동 조건 계산
  const urlMonthParam = searchParams.get("month");
  const isInitialEntry = !urlMonthParam || parseInt(urlMonthParam, 10) === initMonth;

  return {
    selectedMonth,
    selectedLeague,
    filteredMatches,
    activeMonths,
    isInitialEntry,
    handleMonthSelect,
    handleLeagueSelect,
  };
};
