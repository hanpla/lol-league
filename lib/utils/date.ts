const KST_TIMEZONE = "Asia/Seoul";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: KST_TIMEZONE,
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
});

const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: KST_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/**
 * dateString을 KST(Asia/Seoul) 기준 "MM월 DD일 (요일)" 형식으로 변환합니다.
 */
export const formatMatchDate = (dateString: string): string => {
  const date = new Date(dateString);
  const parts = dateFormatter.formatToParts(date);
  const month = parts.find((p) => p.type === "month")?.value || "";
  const day = parts.find((p) => p.type === "day")?.value || "";
  const weekday = parts.find((p) => p.type === "weekday")?.value || "";
  return `${month}월 ${day}일 (${weekday})`;
};

/**
 * dateString을 KST(Asia/Seoul) 기준 "HH:MM" 형식으로 변환합니다.
 */
export const formatMatchTime = (dateString: string): string => {
  return timeFormatter.format(new Date(dateString));
};

/**
 * ISO 날짜 문자열에서 KST(Asia/Seoul) 기준 월(1~12)을 추출합니다.
 */
export const getKstMonthFromDate = (dateString: string): number => {
  const date = new Date(dateString);
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).getUTCMonth() + 1;
};

/**
 * KST(UTC+9) 기준 현재 월을 반환합니다.
 */
export const getCurrentKstMonth = (): number => {
  const now = new Date();
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).getUTCMonth() + 1;
};
