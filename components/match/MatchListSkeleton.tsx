// 1. 공통 뼈대 스타일을 담당하는 기본 스켈레톤 펄스 컴포넌트
const SkeletonPulse = ({ className }: { className?: string }) => {
  return (
    <div className={`dark:bg-neutral-850/60 animate-pulse bg-neutral-200 ${className || ""}`} />
  );
};

// 2. 둥근 이미지(팀 로고 등)용 스켈레톤
const SkeletonCircle = ({ className }: { className?: string }) => {
  return <SkeletonPulse className={`shrink-0 rounded-full ${className || ""}`} />;
};

// 3. 텍스트 바 형태용 스켈레톤
const SkeletonBar = ({ className }: { className?: string }) => {
  return <SkeletonPulse className={`rounded ${className || ""}`} />;
};

// 4. 일반 모서리가 둥근 박스(스코어보드, 배지 등)용 스켈레톤
const SkeletonBox = ({ className }: { className?: string }) => {
  return <SkeletonPulse className={`rounded-lg ${className || ""}`} />;
};

const SKELETON_CARDS = [1, 2, 3];

export default function MatchListSkeleton() {
  // 3개의 카드 형태의 로딩 스켈레톤을 렌더링합니다.
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        {/* Date Header Skeleton */}
        <div className="flex justify-center">
          <SkeletonBar className="h-6 w-32" />
        </div>

        {/* Matches List Skeleton */}
        <div className="space-y-3">
          {SKELETON_CARDS.map((i) => (
            <div
              key={i}
              className="relative flex items-center justify-between gap-4 overflow-hidden rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm dark:border-neutral-900 dark:bg-neutral-900/20 dark:shadow-none"
            >
              {/* Time & Status Block */}
              <div className="flex w-16 shrink-0 flex-col items-start gap-1.5 sm:w-20">
                <SkeletonBar className="h-2 w-8" />
                <SkeletonBar className="h-4.5 w-12" />
                <SkeletonBox className="h-4.5 w-10" />
              </div>

              {/* Mobile/Tablet Matchup (Vertical layout) */}
              <div className="flex flex-1 flex-col gap-2.5 lg:hidden">
                <div className="flex items-center gap-2.5">
                  <SkeletonCircle className="h-8 w-8" />
                  <SkeletonBar className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2.5">
                  <SkeletonCircle className="h-8 w-8" />
                  <SkeletonBar className="h-4 w-20" />
                </div>
              </div>

              {/* Desktop Matchup (Horizontal layout) */}
              <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
                {/* Team 1 */}
                <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
                  <SkeletonBar className="h-4 w-28" />
                  <SkeletonCircle className="h-8 w-8" />
                </div>

                {/* Score spacer */}
                <SkeletonBox className="h-8 w-16 shrink-0" />

                {/* Team 2 */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <SkeletonCircle className="h-8 w-8" />
                  <SkeletonBar className="h-4 w-28" />
                </div>
              </div>

              {/* Stage details */}
              <div className="hidden w-20 shrink-0 items-center justify-end sm:flex lg:w-24">
                <SkeletonBar className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
