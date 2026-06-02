import { Match } from "@/types/match";
import { formatMatchDate } from "@/lib/utils/date";
import MatchCard from "./MatchCard";

interface MatchListProps {
  matches: Match[];
}

export default function MatchList({ matches }: MatchListProps) {
  // Group matches by date
  const groupedMatches: { [date: string]: Match[] } = {};
  matches.forEach((match) => {
    const dateKey = formatMatchDate(match.scheduled_at);
    if (!groupedMatches[dateKey]) {
      groupedMatches[dateKey] = [];
    }
    groupedMatches[dateKey].push(match);
  });

  // Sort dates
  const sortedDates = Object.keys(groupedMatches).sort((a, b) => {
    const dateA = new Date(groupedMatches[a][0].scheduled_at);
    const dateB = new Date(groupedMatches[b][0].scheduled_at);
    return dateA.getTime() - dateB.getTime();
  });

  if (matches.length === 0) {
    return (
      <div className="text-center py-20 border border-neutral-200 dark:border-neutral-900/40 bg-white dark:bg-neutral-900/10 rounded-2xl shadow-sm dark:shadow-none transition-colors duration-300">
        <span className="text-neutral-400 dark:text-neutral-600 text-3xl mb-3 block">📅</span>
        <h3 className="text-base font-bold text-neutral-700 dark:text-neutral-400">등록된 경기 일정이 없습니다</h3>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">다른 월의 경기 일정을 확인해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sortedDates.map((dateStr) => {
        const matchesOnDate = groupedMatches[dateStr];
        const leagueName = matchesOnDate[0].league?.name || "대회 일정";

        return (
          <div key={dateStr} className="space-y-4">
            {/* Date Header & League Name */}
            <div className="text-center">
              <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase">
                {leagueName}
              </span>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
                {dateStr}
              </h2>
            </div>

            {/* Matches List */}
            <div className="space-y-3">
              {matchesOnDate.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
