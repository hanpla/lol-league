/**
 * dateString을 "MM월 DD일 (요일)" 형식으로 변환합니다.
 */
export const formatMatchDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = daysOfWeek[date.getDay()];
  return `${month}월 ${day}일 (${dayOfWeek})`;
};

/**
 * dateString을 "HH:MM" 형식으로 변환합니다.
 */
export const formatMatchTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};
