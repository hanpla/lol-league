import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Match } from "@/types/match";
import { parseMatchSearchParams, filterMatches, extractActiveMonths } from "@/lib/utils/match";
import { getCurrentKstMonth } from "@/lib/utils/date";
import { getMatches } from "@/lib/actions/match";

export const useMatchDashboardState = (allMatches: Match[]) => {
  const searchParams = useSearchParams();

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
  const [matches, setMatches] = useState<Match[]>(allMatches);

  // 최초 접속 시, 서버 측 SWR 캐시 갱신 반영을 위해 브라우저 마운트 직후 
  // getMatches 서버 액션을 비동기로 직접 호출하여 데이터를 최신화합니다.
  // 이 방식은 router.refresh()와 달리 URL 쿼리나 히스토리를 전혀 방해하지 않습니다.
  useEffect(() => {
    let isMounted = true;

    const fetchFreshMatches = async () => {
      try {
        const freshMatches = await getMatches();
        if (isMounted && freshMatches && freshMatches.length > 0) {
          setMatches(freshMatches);
        }
      } catch (error) {
        console.error("실시간 경기 정보 갱신 실패:", error);
      }
    };

    fetchFreshMatches();

    return () => {
      isMounted = false;
    };
  }, []);

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
  const filteredMatches = filterMatches(matches, selectedMonth, selectedLeague);

  // 경기가 존재하는 월 목록 추출
  const activeMonths = extractActiveMonths(matches);

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
