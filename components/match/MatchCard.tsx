import { Match } from "@/types/match";
import TeamLogo from "./TeamLogo";
import LocalTime from "@/components/common/LocalTime";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status === "live";
  const isCompleted = match.status === "completed";
  const isTeam1Winner = isCompleted && match.winner_id === match.team1_id;
  const isTeam2Winner = isCompleted && match.winner_id === match.team2_id;

  return (
    <div className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:bg-neutral-50/80 dark:border-neutral-900 dark:bg-neutral-900/20 dark:shadow-none dark:hover:bg-neutral-900/40">
      {isLive && (
        <div className="absolute top-0 bottom-0 left-0 w-[3px] animate-pulse bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
      )}

      {/* Time & Status Block */}
      <div className="flex w-16 shrink-0 flex-col items-start gap-0.5 sm:w-20">
        <span className="text-[9px] leading-none font-extrabold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
          {match.league?.code}
        </span>
        <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
          <LocalTime dateString={match.scheduled_at} />
        </span>
        {isLive ? (
          <span className="inline-flex animate-pulse items-center gap-1 rounded-md border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-500 dark:border-red-900/50 dark:bg-red-950/60 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            LIVE
          </span>
        ) : isCompleted ? (
          <span className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-neutral-500 dark:border-transparent dark:bg-neutral-800 dark:text-neutral-400">
            종료
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-bold text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-500">
            대기
          </span>
        )}
      </div>

      {/* 1. Mobile & Tablet Matchup Layout (Vertical stack, visible on screens < lg) */}
      <div className="flex flex-1 flex-col gap-2 lg:hidden">
        {/* Team 1 Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <TeamLogo logoUrl={match.team1?.logo_url || null} name={match.team1?.name || "T1"} />
            <span
              className={`truncate text-sm ${
                isCompleted
                  ? isTeam1Winner
                    ? "font-bold text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-400 dark:text-neutral-500"
                  : "font-medium text-neutral-800 dark:text-neutral-200"
              }`}
            >
              {match.team1?.name}
            </span>
          </div>
          {isCompleted || isLive ? (
            <span
              className={`font-mono text-sm font-extrabold ${
                isCompleted
                  ? isTeam1Winner
                    ? "text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-400 dark:text-neutral-500"
                  : "text-neutral-800 dark:text-neutral-200"
              }`}
            >
              {match.team1_score}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-neutral-400 uppercase dark:text-neutral-500">
              {match.match_type}
            </span>
          )}
        </div>

        {/* Team 2 Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <TeamLogo logoUrl={match.team2?.logo_url || null} name={match.team2?.name || "T2"} />
            <span
              className={`truncate text-sm ${
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
          {isCompleted || isLive ? (
            <span
              className={`font-mono text-sm font-extrabold ${
                isCompleted
                  ? isTeam2Winner
                    ? "text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-400 dark:text-neutral-500"
                  : "text-neutral-800 dark:text-neutral-200"
              }`}
            >
              {match.team2_score}
            </span>
          ) : null}
        </div>
      </div>

      {/* 2. Desktop Matchup Layout (Horizontal row, visible on screens >= lg) */}
      <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
        {/* Team 1 */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          <span
            className={`truncate text-base ${
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
        <div className="flex min-w-[70px] shrink-0 items-center justify-center rounded-lg border border-neutral-200/60 bg-neutral-50 px-4 py-1.5 font-mono text-base font-extrabold tracking-wider transition-colors duration-300 dark:border-neutral-800/80 dark:bg-neutral-900/60">
          {isCompleted || isLive ? (
            <div className="flex items-center gap-1.5">
              <span
                className={
                  isCompleted && !isTeam1Winner
                    ? "text-neutral-400 dark:text-neutral-500"
                    : "text-neutral-800 dark:text-neutral-200"
                }
              >
                {match.team1_score}
              </span>
              <span className="text-xs text-neutral-300 dark:text-neutral-600">:</span>
              <span
                className={
                  isCompleted && !isTeam2Winner
                    ? "text-neutral-400 dark:text-neutral-500"
                    : "text-neutral-800 dark:text-neutral-200"
                }
              >
                {match.team2_score}
              </span>
            </div>
          ) : (
            <span className="font-sans text-xs font-semibold tracking-normal text-neutral-400 dark:text-neutral-500">
              {match.match_type}
            </span>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <TeamLogo logoUrl={match.team2?.logo_url || null} name={match.team2?.name || "T2"} />
          <span
            className={`truncate text-base ${
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

      {/* Stage details (Hidden on mobile, visible from sm) */}
      <div className="hidden w-20 shrink-0 items-center justify-end text-[10px] font-semibold text-neutral-400 sm:flex lg:w-24 lg:text-[11px] dark:text-neutral-500">
        <span>{match.stage}</span>
      </div>
    </div>
  );
}
