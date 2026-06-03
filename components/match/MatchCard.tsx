"use client";

import { useState } from "react";
import { Match } from "@/types/match";
import TeamLogo from "./TeamLogo";
import LocalTime from "@/components/common/LocalTime";

interface MatchCardProps {
  match: Match;
}

// --- Style helper functions ---

const getTeamNameClass = (
  isCompleted: boolean,
  isWinner: boolean,
  size: "sm" | "base" = "sm",
): string => {
  const textSize = size === "base" ? "text-base" : "text-sm";
  if (isCompleted) {
    return isWinner
      ? `${textSize} font-bold text-neutral-900 dark:text-neutral-100`
      : `${textSize} text-neutral-400 dark:text-neutral-500`;
  }
  return `${textSize} font-medium text-neutral-800 dark:text-neutral-200`;
};

const getScoreClass = (isCompleted: boolean, isWinner: boolean): string => {
  if (isCompleted) {
    return isWinner
      ? "text-neutral-900 dark:text-neutral-100"
      : "text-neutral-400 dark:text-neutral-500";
  }
  return "text-neutral-800 dark:text-neutral-200";
};

// --- Sub-components ---

const StatusBadge = ({ status }: { status: Match["status"] }) => {
  if (status === "live") {
    return (
      <span className="inline-flex animate-pulse items-center gap-1 rounded-md border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-500 dark:border-red-900/50 dark:bg-red-950/60 dark:text-red-400">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        LIVE
      </span>
    );
  }

  if (status === "completed") {
    return (
      <span className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-neutral-500 dark:border-transparent dark:bg-neutral-800 dark:text-neutral-400">
        종료
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-bold text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-500">
      예정
    </span>
  );
};

const VodPanel = ({ videoUrl }: { videoUrl: string | null }) => (
  <div className="border-t border-neutral-100 bg-neutral-50/50 py-3 text-center dark:border-neutral-800/60 dark:bg-neutral-900/10">
    {videoUrl ? (
      <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
        vod:{" "}
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-neutral-900 hover:underline dark:text-neutral-50"
        >
          [링크]
        </a>
      </div>
    ) : (
      <div className="text-xs font-medium text-neutral-400 dark:text-neutral-600">
        vod: 등록된 영상이 없습니다
      </div>
    )}
  </div>
);

interface MobileTeamRowProps {
  team: Match["team1"];
  fallbackName: string;
  score: number;
  isCompleted: boolean;
  isLive: boolean;
  isWinner: boolean;
  matchType: string;
  showMatchType: boolean;
}

const MobileTeamRow = ({
  team,
  fallbackName,
  score,
  isCompleted,
  isLive,
  isWinner,
  matchType,
  showMatchType,
}: MobileTeamRowProps) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex min-w-0 items-center gap-2.5">
      <TeamLogo logoUrl={team?.logo_url || null} name={team?.name || fallbackName} />
      <span className={`truncate ${getTeamNameClass(isCompleted, isWinner)}`}>{team?.name}</span>
    </div>
    {isCompleted || isLive ? (
      <span className={`font-mono text-sm font-extrabold ${getScoreClass(isCompleted, isWinner)}`}>
        {score}
      </span>
    ) : showMatchType ? (
      <span className="text-[10px] font-semibold text-neutral-400 uppercase dark:text-neutral-500">
        {matchType}
      </span>
    ) : null}
  </div>
);

interface DesktopMatchupProps {
  match: Match;
  isCompleted: boolean;
  isLive: boolean;
  isTeam1Winner: boolean;
  isTeam2Winner: boolean;
}

const DesktopMatchup = ({
  match,
  isCompleted,
  isLive,
  isTeam1Winner,
  isTeam2Winner,
}: DesktopMatchupProps) => (
  <div className="hidden flex-1 items-center justify-center gap-6 lg:flex">
    {/* Team 1 */}
    <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
      <span className={`truncate ${getTeamNameClass(isCompleted, isTeam1Winner, "base")}`}>
        {match.team1?.name}
      </span>
      <TeamLogo logoUrl={match.team1?.logo_url || null} name={match.team1?.name || "T1"} />
    </div>

    {/* Score display */}
    <div className="flex min-w-[70px] shrink-0 items-center justify-center rounded-lg border border-neutral-200/60 bg-neutral-50 px-4 py-1.5 font-mono text-base font-extrabold tracking-wider transition-colors duration-300 dark:border-neutral-800/80 dark:bg-neutral-900/60">
      {isCompleted || isLive ? (
        <div className="flex items-center gap-1.5">
          <span className={getScoreClass(isCompleted, isTeam1Winner)}>{match.team1_score}</span>
          <span className="text-xs text-neutral-300 dark:text-neutral-600">:</span>
          <span className={getScoreClass(isCompleted, isTeam2Winner)}>{match.team2_score}</span>
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
      <span className={`truncate ${getTeamNameClass(isCompleted, isTeam2Winner, "base")}`}>
        {match.team2?.name}
      </span>
    </div>
  </div>
);

// --- Main component ---

export default function MatchCard({ match }: MatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLive = match.status === "live";
  const isCompleted = match.status === "completed";
  const isTeam1Winner = isCompleted && match.winner_id === match.team1_id;
  const isTeam2Winner = isCompleted && match.winner_id === match.team2_id;

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:bg-neutral-50/80 dark:border-neutral-900 dark:bg-neutral-900/20 dark:shadow-none dark:hover:bg-neutral-900/40"
    >
      {isLive && (
        <div className="absolute top-0 bottom-0 left-0 w-[3px] animate-pulse bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
      )}

      {/* Main card row */}
      <div className="flex items-center justify-between gap-4 p-4">
        {/* Time & Status Block */}
        <div className="flex w-16 shrink-0 flex-col items-start gap-0.5 sm:w-20">
          <span className="text-[9px] leading-none font-extrabold tracking-wider text-neutral-400 uppercase dark:text-neutral-500">
            {match.league?.code}
          </span>
          <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
            <LocalTime dateString={match.scheduled_at} />
          </span>
          <StatusBadge status={match.status} />
        </div>

        {/* Mobile & Tablet Matchup Layout (Vertical stack, visible on screens < lg) */}
        <div className="flex flex-1 flex-col gap-2 lg:hidden">
          <MobileTeamRow
            team={match.team1}
            fallbackName="T1"
            score={match.team1_score}
            isCompleted={isCompleted}
            isLive={isLive}
            isWinner={isTeam1Winner}
            matchType={match.match_type}
            showMatchType={true}
          />
          <MobileTeamRow
            team={match.team2}
            fallbackName="T2"
            score={match.team2_score}
            isCompleted={isCompleted}
            isLive={isLive}
            isWinner={isTeam2Winner}
            matchType={match.match_type}
            showMatchType={false}
          />
        </div>

        {/* Desktop Matchup Layout (Horizontal row, visible on screens >= lg) */}
        <DesktopMatchup
          match={match}
          isCompleted={isCompleted}
          isLive={isLive}
          isTeam1Winner={isTeam1Winner}
          isTeam2Winner={isTeam2Winner}
        />

        {/* Stage details (Hidden on mobile, visible from sm) */}
        <div className="hidden w-20 shrink-0 items-center justify-end text-[10px] font-semibold text-neutral-400 sm:flex lg:w-24 lg:text-[11px] dark:text-neutral-500">
          <span>{match.stage}</span>
        </div>
      </div>

      {/* Expanded VOD panel */}
      {isExpanded && (
        <div onClick={(e) => e.stopPropagation()}>
          <VodPanel videoUrl={match.video_url} />
        </div>
      )}
    </div>
  );
}
