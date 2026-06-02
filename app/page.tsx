import { getMatches } from "@/lib/actions/match";
import { Match } from "@/types/match";
import Header from "@/components/common/Header";
import MonthTabs from "@/components/match/MonthTabs";
import MatchList from "@/components/match/MatchList";



export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  // Await searchParams in Next.js 15/16
  const { month } = await searchParams;
  
  // Current month is 6 (June 2026)
  const currentMonth = 6;
  const selectedMonth = month ? parseInt(month, 10) : currentMonth;

  // Fetch all matches from Supabase
  let allMatches: Match[] = [];
  try {
    allMatches = await getMatches();
  } catch (error) {
    console.error("Failed to load matches:", error);
  }

  // Filter matches by the selected month
  const filteredMatches = allMatches.filter((match) => {
    const matchDate = new Date(match.scheduled_at);
    // getMonth() is 0-indexed (0 = Jan, 5 = June)
    return matchDate.getMonth() + 1 === selectedMonth;
  });

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-neutral-200 dark:selection:bg-neutral-800 font-sans transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header Component */}
        <Header />

        {/* Month Navigation Tabs Component */}
        <MonthTabs currentMonth={currentMonth} selectedMonth={selectedMonth} />

        {/* Grouped Match List Component */}
        <MatchList matches={filteredMatches} />
      </div>
    </main>
  );
}
