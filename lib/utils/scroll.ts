/**
 * easeOutCubic 감속 곡선 공식
 */
const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

/**
 * 특정 DOM 요소를 화면의 중앙(block: center)으로 부드럽게 스크롤하는 유틸 함수입니다.
 * @param element 스크롤 대상 HTML 요소
 * @param duration 애니메이션 시간 (기본값: 500ms)
 * @param offset 오프셋 보정값 (헤더 높이 등 차감용)
 */
export const smoothScrollTo = (element: HTMLElement, duration = 500, offset = 0): void => {
  const root = document.scrollingElement ?? document.documentElement;
  const startTop = root.scrollTop;

  // 대상 요소의 뷰포트 내 상대 좌표 획득
  const elementRect = element.getBoundingClientRect();
  const absoluteElementTop = startTop + elementRect.top;

  // 요소가 뷰포트 중앙에 위치하도록 목표 스크롤 Y 좌표 계산
  const targetTop = absoluteElementTop - window.innerHeight / 2 + element.clientHeight / 2 - offset;

  const distance = targetTop - startTop;

  // 이동할 거리가 극도로 미미한 경우 스크롤 건너뜀
  if (Math.abs(distance) <= 1) {
    return;
  }

  const startTime = performance.now();

  const step = (currentTime: number): void => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easedProgress = easeOutCubic(progress);

    root.scrollTop = startTop + distance * easedProgress;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};
