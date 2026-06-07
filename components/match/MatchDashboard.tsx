"use client";

import { Match } from "@/types/match";
import MonthTabs from "./MonthTabs";
import LeagueTabs from "./LeagueTabs";
import MatchList from "./MatchList";
import { useMatchDashboardState } from "@/hooks/useMatchDashboardState";

interface MatchDashboardProps {
  allMatches: Match[];
}

export default function MatchDashboard({ allMatches }: MatchDashboardProps) {
  const {
    selectedMonth,
    selectedLeague,
    filteredMatches,
    activeMonths,
    isInitialEntry,
    handleMonthSelect,
    handleLeagueSelect,
  } = useMatchDashboardState(allMatches);

  return (
    <>
      {/* Month Navigation Tabs Component */}
      <MonthTabs
        selectedMonth={selectedMonth}
        selectedLeague={selectedLeague}
        onMonthSelect={handleMonthSelect}
        activeMonths={activeMonths}
      />

      {/* League Filtering Tabs Component */}
      <LeagueTabs
        selectedMonth={selectedMonth}
        selectedLeague={selectedLeague}
        onLeagueSelect={handleLeagueSelect}
      />

      {/* Grouped Match List Component */}
      <MatchList matches={filteredMatches} isInitialEntry={isInitialEntry} />
    </>
  );
}
