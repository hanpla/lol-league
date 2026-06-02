import { getMatches } from "@/lib/actions/match";
import { Match } from "@/types/match";
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

  // Current month is 6 (June 2026)
  const currentMonth = 6;
  const { selectedMonth, selectedLeague } = parseMatchSearchParams(month, league, currentMonth);

  let allMatches: Match[] = [];
  try {
    allMatches = await getMatches();
  } catch (error) {
    console.error("Failed to load matches:", error);
  }

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
