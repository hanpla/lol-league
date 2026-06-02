import { getMatches } from "@/lib/actions/match";
import { Match } from "@/types/match";
import Header from "@/components/common/Header";
import MonthTabs from "@/components/match/MonthTabs";
import LeagueTabs from "@/components/match/LeagueTabs";
import MatchList from "@/components/match/MatchList";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; league?: string }>;
}) {
  // Await searchParams in Next.js 15/16
  const { month, league } = await searchParams;

  // Current month is 6 (June 2026)
  const currentMonth = 6;
  const selectedMonth = month ? parseInt(month, 10) : currentMonth;
  const selectedLeague = league || "all";

  // Fetch all matches from Supabase
  let allMatches: Match[] = [];
  try {
    allMatches = await getMatches();
  } catch (error) {
    console.error("Failed to load matches:", error);
  }

  // Filter matches by the selected month AND league
  const filteredMatches = allMatches.filter((match) => {
    const matchDate = new Date(match.scheduled_at);
    // getMonth() is 0-indexed (0 = Jan, 5 = June)
    const matchesMonth = matchDate.getMonth() + 1 === selectedMonth;
    const matchesLeague =
      selectedLeague === "all" || match.league?.code === selectedLeague;
    return matchesMonth && matchesLeague;
  });

  return (
    <main className="min-h-screen bg-neutral-50 font-sans text-neutral-900 transition-colors duration-300 selection:bg-neutral-200 dark:bg-neutral-950 dark:text-neutral-100 dark:selection:bg-neutral-800">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header Component */}
        <Header />

        {/* Month Navigation Tabs Component */}
        <MonthTabs
          currentMonth={currentMonth}
          selectedMonth={selectedMonth}
          selectedLeague={selectedLeague}
        />

        {/* League Filtering Tabs Component */}
        <LeagueTabs
          selectedMonth={selectedMonth}
          selectedLeague={selectedLeague}
        />

        {/* Grouped Match List Component */}
        <MatchList matches={filteredMatches} />
      </div>
    </main>
  );
}
