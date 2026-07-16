import MatchListSkeleton from "./MatchListSkeleton";

// 공통 뼈대 스타일을 담당하는 기본 스켈레톤 펄스 컴포넌트
const SkeletonPulse = ({ className }: { className?: string }) => {
  return (
    <div className={`dark:bg-neutral-850/60 animate-pulse bg-neutral-200 ${className || ""}`} />
  );
};

const SKELETON_MONTHS = Array.from({ length: 12 }, (_, i) => i);
const SKELETON_LEAGUES = [1, 2, 3];

export default function MatchDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Month Navigation Tabs Skeleton */}
      <section className="mb-6">
        <div className="flex flex-wrap justify-center gap-1 rounded-xl border border-neutral-200 bg-neutral-200/30 p-1.5 sm:grid sm:grid-cols-6 md:grid-cols-12 dark:border-neutral-800 dark:bg-neutral-900/40">
          {SKELETON_MONTHS.map((i) => (
            <SkeletonPulse key={i} className="h-9 rounded-lg" />
          ))}
        </div>
      </section>

      {/* League Filtering Tabs Skeleton */}
      <section className="mb-8 flex flex-wrap justify-center gap-2">
        {SKELETON_LEAGUES.map((i) => (
          <SkeletonPulse key={i} className="h-7 w-16 rounded-full" />
        ))}
      </section>

      {/* Grouped Match List Skeleton */}
      <MatchListSkeleton />
    </div>
  );
}
