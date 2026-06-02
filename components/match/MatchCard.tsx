import { Match } from "@/types/match";
import { formatMatchTime } from "@/lib/utils/date";
import TeamLogo from "./TeamLogo";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status === "live";
  const isCompleted = match.status === "completed";
  const isTeam1Winner = isCompleted && match.winner_id === match.team1_id;
  const isTeam2Winner = isCompleted && match.winner_id === match.team2_id;

  return (
    <div className="group relative border border-neutral-200/80 dark:border-neutral-900 bg-white dark:bg-neutral-900/20 hover:bg-neutral-50/80 dark:hover:bg-neutral-900/40 rounded-xl p-4 shadow-sm dark:shadow-none transition-all duration-300 flex items-center justify-between gap-4 overflow-hidden">
      {isLive && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
      )}

      {/* Time & Status Block */}
      <div className="flex flex-col items-start gap-1 w-20 shrink-0">
        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          {formatMatchTime(match.scheduled_at)}
        </span>
        {isLive ? (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-red-50 dark:bg-red-950/60 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900/50 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            LIVE
          </span>
        ) : isCompleted ? (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-transparent">
            종료
          </span>
        ) : (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-neutral-50 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-800">
            대기
          </span>
        )}
      </div>

      {/* Matchup Teams & Score */}
      <div className="flex-1 flex items-center justify-center gap-2 sm:gap-6">
        
        {/* Team 1 */}
        <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
          <span
            className={`text-sm sm:text-base truncate ${
              isCompleted
                ? isTeam1Winner
                  ? "font-bold text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-400 dark:text-neutral-500"
                : "font-medium text-neutral-800 dark:text-neutral-200"
            }`}
          >
            {match.team1?.name}
          </span>
          <TeamLogo logoUrl={match.team1?.logo_url || null} name={match.team1?.name || "T1"} />
        </div>

        {/* Score display */}
        <div className="flex items-center justify-center px-4 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/80 min-w-[70px] shrink-0 font-mono text-base font-extrabold tracking-wider transition-colors duration-300">
          {isCompleted || isLive ? (
            <div className="flex items-center gap-1.5">
              <span className={isCompleted && !isTeam1Winner ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-800 dark:text-neutral-200"}>
                {match.team1_score}
              </span>
              <span className="text-neutral-300 dark:text-neutral-600 text-xs">:</span>
              <span className={isCompleted && !isTeam2Winner ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-800 dark:text-neutral-200"}>
                {match.team2_score}
              </span>
            </div>
          ) : (
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-semibold font-sans tracking-normal">
              {match.match_type}
            </span>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <TeamLogo logoUrl={match.team2?.logo_url || null} name={match.team2?.name || "T2"} />
          <span
            className={`text-sm sm:text-base truncate ${
              isCompleted
                ? isTeam2Winner
                  ? "font-bold text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-400 dark:text-neutral-500"
                : "font-medium text-neutral-800 dark:text-neutral-200"
            }`}
          >
            {match.team2?.name}
          </span>
        </div>

      </div>

      {/* Action / Stage details */}
      <div className="hidden sm:flex items-center justify-end w-24 shrink-0 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500">
        <span>{match.stage}</span>
      </div>

    </div>
  );
}
