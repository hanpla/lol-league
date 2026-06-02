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
      <div className="rounded-2xl border border-neutral-200 bg-white py-20 text-center shadow-sm transition-colors duration-300 dark:border-neutral-900/40 dark:bg-neutral-900/10 dark:shadow-none">
        <h3 className="text-base font-bold text-neutral-700 dark:text-neutral-400">
          등록된 경기 일정이 없습니다
        </h3>
        <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
          다른 월의 경기 일정을 확인해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sortedDates.map((dateStr) => {
        const matchesOnDate = groupedMatches[dateStr];

        return (
          <div key={dateStr} className="space-y-4">
            {/* Date Header */}
            <div className="text-center">
              <h2
                className="mt-0.5 text-lg font-bold text-neutral-800 dark:text-neutral-200"
                suppressHydrationWarning
              >
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
