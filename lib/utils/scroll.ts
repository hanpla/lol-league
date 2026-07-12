/**
 * easeOutCubic 감속 곡선 공식
 */
const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

/**
 * 프레임 단위로 Y 좌표를 부드럽게 보간하여 이동시키는 공통 애니메이션 헬퍼 함수입니다.
 */
const animateScroll = (targetTop: number, duration: number): void => {
  const root = document.scrollingElement ?? document.documentElement;
  const startTop = root.scrollTop;
  const distance = targetTop - startTop;

  // 이동할 거리가 극도로 미미한 경우 애니메이션 없이 즉시 이동
  if (Math.abs(distance) <= 1) {
    root.scrollTop = targetTop;
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

  animateScroll(targetTop, duration);
};

/**
 * 특정 Y 좌표 위치로 부드럽게 감속 스크롤하는 유틸 함수입니다.
 * @param targetTop 목표 Y 좌표
 * @param duration 애니메이션 시간 (기본값: 500ms)
 */
export const smoothScrollToY = (targetTop: number, duration = 500): void => {
  animateScroll(targetTop, duration);
};
