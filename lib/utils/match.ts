import { Match } from "@/types/match";

/**
 * 1. 쿼리 스트링 파라미터를 읽어 선택된 월과 리그 코드를 파싱합니다.
 */
export const parseMatchSearchParams = (
  month: string | undefined,
  league: string | undefined,
  currentMonth: number = 6,
) => {
  const selectedMonth = month ? parseInt(month, 10) : currentMonth;
  const selectedLeague = league || "all";
  return { selectedMonth, selectedLeague };
};

/**
 * 2. 전체 경기 목록에서 선택된 월 및 리그 조건에 맞는 경기만 필터링합니다.
 */
export const filterMatches = (
  matches: Match[],
  selectedMonth: number,
  selectedLeague: string,
): Match[] => {
  return matches.filter((match) => {
    // Extract month directly from ISO string (e.g. "2026-04-01..." -> month index 5 to 7 is "04")
    const matchesMonth = parseInt(match.scheduled_at.slice(5, 7), 10) === selectedMonth;
    const matchesLeague = selectedLeague === "all" || match.league?.code === selectedLeague;
    return matchesMonth && matchesLeague;
  });
};
