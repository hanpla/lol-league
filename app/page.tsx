import { getMatches } from "@/lib/actions/match";
import Header from "@/components/common/Header";
import MatchDashboard from "@/components/match/MatchDashboard";
import MatchDashboardSkeleton from "@/components/match/MatchDashboardSkeleton";
import { Suspense } from "react";

// Server Component wrapper that fetches all matches from the API
async function MatchDashboardContainer() {
  // Fetch matches from the server (5 minutes cached via "use cache")
  const allMatches = await getMatches();

  return <MatchDashboard allMatches={allMatches} />;
}

export default async function Home() {
  return (
    <main className="min-h-screen bg-neutral-50 font-sans text-neutral-900 transition-colors duration-300 selection:bg-neutral-200 dark:bg-neutral-950 dark:text-neutral-100 dark:selection:bg-neutral-800">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header Component (statically pre-rendered) */}
        <Header />

        {/* Dynamic content wrapped in Suspense */}
        <Suspense fallback={<MatchDashboardSkeleton />}>
          <MatchDashboardContainer />
        </Suspense>
      </div>
    </main>
  );
}
