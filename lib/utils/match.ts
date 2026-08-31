import { Match } from "@/types/match";
import { getCurrentKstMonth, formatMatchDate } from "./date";

/**
 * 1. 쿼리 스트링 파라미터를 읽어 선택된 월과 리그 코드를 파싱합니다.
 */
export const parseMatchSearchParams = (
  month: string | undefined,
  league: string | undefined,
  defaultMonth: number = getCurrentKstMonth(),
) => {
  const selectedMonth = month ? parseInt(month, 10) : defaultMonth;
  const selectedLeague = league || "all";
  return { selectedMonth, selectedLeague };
};

/**
 * 2. 전체 경기 목록을 바탕으로 기본으로 표시할 월을 계산합니다.
 * - 오늘(00:00:00) 이후 예정된 경기 중 가장 가까운 다음 경기의 월을 반환합니다.
 * - 앞으로의 미래 경기가 없다면 가장 최근(마지막) 경기 그룹의 월을 반환합니다.
 * - 경기 데이터가 전혀 없다면 KST 기준 현재 월을 반환합니다.
 */
export const getDefaultMatchMonth = (
  matches: Match[],
  fallbackMonth: number = getCurrentKstMonth(),
  referenceDate: Date = new Date(),
): number => {
  if (!matches || matches.length === 0) {
    return fallbackMonth;
  }

  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  ).getTime();

  // 오늘 이후(오늘 포함) 가장 가까운 다음 경기 탐색
  const upcomingMatch = matches.find((match) => {
    const matchDate = new Date(match.scheduled_at);
    const matchDay = new Date(
      matchDate.getFullYear(),
      matchDate.getMonth(),
      matchDate.getDate(),
    ).getTime();
    return matchDay >= today;
  });

  if (upcomingMatch) {
    return new Date(upcomingMatch.scheduled_at).getMonth() + 1;
  }

  // 미래 경기가 없다면 가장 마지막(최신) 과거 경기의 월 반환
  const lastMatch = matches[matches.length - 1];
  if (lastMatch) {
    return new Date(lastMatch.scheduled_at).getMonth() + 1;
  }

  return fallbackMonth;
};

/**
 * 3. 전체 경기 목록에서 선택된 월 및 리그 조건에 맞는 경기만 필터링합니다.
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

/**
 * 4. 전체 매치 목록에서 경기가 있는 월 목록을 중복 없이 추출합니다.
 */
export const extractActiveMonths = (matches: Match[]): number[] => {
  const months = matches.map((match) => parseInt(match.scheduled_at.slice(5, 7), 10));
  return Array.from(new Set(months)).sort((a, b) => a - b);
};

/**
 * 5. 경기 목록을 날짜별(dateStr)로 그룹화합니다.
 */
export const groupMatchesByDate = (
  matches: Match[],
): { dateStr: string; matchesOnDate: Match[] }[] => {
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
  return groupedMatches;
};

/**
 * 6. 오늘 날짜를 기준으로 포커스(스크롤)해야 할 날짜 그룹의 인덱스를 계산합니다.
 * - 오늘 당일 경기 그룹이 있다면 해당 인덱스를 반환합니다.
 * - 오늘 당일 경기가 없다면 오늘 이후(미래)로 예정된 가장 가까운 다음 경기 그룹의 인덱스를 반환합니다.
 * - 오늘 이후 경기가 없다면(모두 과거 경기), 가장 최근(마지막) 경기 그룹의 인덱스를 반환합니다.
 */
export const findTargetMatchGroupIndex = (
  groupedMatches: { dateStr: string; matchesOnDate: Match[] }[],
  referenceDate: Date = new Date(),
): number => {
  if (groupedMatches.length === 0) return -1;

  const today = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  ).getTime();

  // 1. 오늘 당일 경기 그룹 찾기
  const todayIndex = groupedMatches.findIndex((group) => {
    const matchDate = new Date(group.matchesOnDate[0].scheduled_at);
    const matchDay = new Date(
      matchDate.getFullYear(),
      matchDate.getMonth(),
      matchDate.getDate(),
    ).getTime();
    return matchDay === today;
  });
  if (todayIndex !== -1) return todayIndex;

  // 2. 오늘 이후(미래)로 예정된 가장 가까운 다음 경기 그룹 찾기
  const nextUpcomingIndex = groupedMatches.findIndex((group) => {
    const matchDate = new Date(group.matchesOnDate[0].scheduled_at);
    const matchDay = new Date(
      matchDate.getFullYear(),
      matchDate.getMonth(),
      matchDate.getDate(),
    ).getTime();
    return matchDay > today;
  });
  if (nextUpcomingIndex !== -1) return nextUpcomingIndex;

  // 3. 오늘 이후 경기가 없다면(모두 과거 경기), 가장 최근(마지막) 경기 그룹 반환
  return groupedMatches.length - 1;
};
