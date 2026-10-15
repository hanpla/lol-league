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

const LIVE_POLL_INTERVAL_MS = 30_000;

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

  // 1. 최초 마운트 시 SWR(Stale-While-Revalidate) 전략으로 백그라운드에서 최신 데이터를 호출하여 화면 최신화
  useEffect(() => {
    let isMounted = true;

    const fetchFreshMatches = async () => {
      try {
        const freshMatches = await getMatches();
        if (isMounted && freshMatches && freshMatches.length > 0) {
          setMatches(freshMatches);
          // 만약 초기 SSR 데이터가 비어있었고 URL 파라미터가 없었다면 실시간 데이터 기준으로 기본 월 갱신
          if (!initialMonthParam && allMatches.length === 0) {
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

  // 진행 중인 라이브 경기 존재 여부 감지
  const hasLiveMatch = useMemo(() => matches.some((match) => match.status === "live"), [matches]);

  // 2. 현재 진행 중인(live) 경기가 있을 경우 30초 간격으로 백그라운드 폴링 수행
  useEffect(() => {
    if (!hasLiveMatch) return;

    let isMounted = true;
    let isFetching = false;

    const pollLiveMatches = async () => {
      // 브라우저 탭이 백그라운드(비활성) 상태일 때는 불필요한 네트워크 호출 방지
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        return;
      }
      if (isFetching) return;
      isFetching = true;

      try {
        const freshMatches = await getMatches();
        if (isMounted && freshMatches && freshMatches.length > 0) {
          setMatches(freshMatches);
        }
      } catch (error) {
        console.error("라이브 경기 정보 폴링 실패:", error);
      } finally {
        isFetching = false;
      }
    };

    const intervalId = setInterval(pollLiveMatches, LIVE_POLL_INTERVAL_MS);

    // 사용자가 다른 탭에서 다시 이 화면으로 돌아왔을 때 즉시 최신 정보 동기화
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        pollLiveMatches();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasLiveMatch]);

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
