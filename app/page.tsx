import { getMatches } from "@/lib/actions/match";
import Header from "@/components/common/Header";
import MonthTabs from "@/components/match/MonthTabs";
import LeagueTabs from "@/components/match/LeagueTabs";
import MatchList from "@/components/match/MatchList";
import MatchDashboardSkeleton from "@/components/match/MatchDashboardSkeleton";
import { Suspense } from "react";
import { parseMatchSearchParams, filterMatches } from "@/lib/utils/match";

interface SearchParamsProps {
  searchParams: Promise<{ month?: string; league?: string }>;
}

// Server Component that consumes the searchParams promise and loads tabs and matches
async function MatchDashboardContainer({ searchParams }: SearchParamsProps) {
  const { month, league } = await searchParams;

  // KST(UTC+9) 기준 현재 월 계산 (서버가 UTC 환경이어도 한국 시간 기준으로 정확히 동작)
  const now = new Date();
  const kstMonth = new Date(now.getTime() + 9 * 60 * 60 * 1000).getUTCMonth() + 1;
  const currentMonth = kstMonth;
  const { selectedMonth, selectedLeague } = parseMatchSearchParams(month, league, currentMonth);

  // Fetch matches from the server (exceptions will bubble up to app/error.tsx)
  const allMatches = await getMatches();

  // Filter matches by the selected month AND league
  const filteredMatches = filterMatches(allMatches, selectedMonth, selectedLeague);

  return (
    <>
      {/* Month Navigation Tabs Component */}
      <MonthTabs
        currentMonth={currentMonth}
        selectedMonth={selectedMonth}
        selectedLeague={selectedLeague}
      />

      {/* League Filtering Tabs Component */}
      <LeagueTabs selectedMonth={selectedMonth} selectedLeague={selectedLeague} />

      {/* Grouped Match List Component */}
      <MatchList matches={filteredMatches} />
    </>
  );
}

export default async function Home({ searchParams }: SearchParamsProps) {
  return (
    <main className="min-h-screen bg-neutral-50 font-sans text-neutral-900 transition-colors duration-300 selection:bg-neutral-200 dark:bg-neutral-950 dark:text-neutral-100 dark:selection:bg-neutral-800">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header Component (statically pre-rendered) */}
        <Header />

        {/* Dynamic content wrapped in Suspense */}
        <Suspense fallback={<MatchDashboardSkeleton />}>
          <MatchDashboardContainer searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
