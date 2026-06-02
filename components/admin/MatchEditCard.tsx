"use client";

import { Match } from "@/types/match";
import { updateMatchScore } from "@/lib/actions/match";
import { useState } from "react";
import LocalDate from "@/components/common/LocalDate";
import LocalTime from "@/components/common/LocalTime";

interface MatchEditCardProps {
  match: Match;
  adminPassword: string;
}

export default function MatchEditCard({ match, adminPassword }: MatchEditCardProps) {
  const [status, setStatus] = useState<Match["status"]>(match.status);
  const [team1Score, setTeam1Score] = useState<number>(match.team1_score);
  const [team2Score, setTeam2Score] = useState<number>(match.team2_score);
  const [winnerId, setWinnerId] = useState<string | null>(match.winner_id);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await updateMatchScore(
        match.id,
        team1Score,
        team2Score,
        status,
        status === "completed" ? winnerId : null,
        adminPassword,
      );
      setMessage({ type: "success", text: "저장 완료!" });
      // Reset message feedback after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "오류가 발생했습니다.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-300 md:flex-row md:items-center dark:border-neutral-900 dark:bg-neutral-900/20 dark:shadow-none">
      {/* Time & Match Metadata */}
      <div className="flex w-full shrink-0 items-center justify-between gap-2 border-b border-neutral-100 pb-2 md:w-36 md:flex-col md:items-start md:justify-center md:border-b-0 md:pb-0 dark:border-neutral-900">
        <div className="flex flex-col">
          <span className="mb-1 text-[9px] leading-none font-extrabold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
            {match.league?.code} ({match.stage})
          </span>
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            <LocalDate dateString={match.scheduled_at} />
          </span>
          <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
            <LocalTime dateString={match.scheduled_at} />
          </span>
        </div>

        {/* Status Dropdown */}
        <select
          value={status}
          onChange={(e) => {
            const nextStatus = e.target.value as Match["status"];
            setStatus(nextStatus);
            if (nextStatus === "scheduled") {
              setTeam1Score(0);
              setTeam2Score(0);
              setWinnerId(null);
            }
          }}
          className="cursor-pointer rounded-lg border border-neutral-200 bg-neutral-50 p-1.5 text-xs font-semibold text-neutral-800 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
        >
          <option value="scheduled">대기 (scheduled)</option>
          <option value="live">진행중 (live)</option>
          <option value="completed">종료 (completed)</option>
        </select>
      </div>

      {/* Team Name and Score Inputs */}
      <div className="flex flex-1 flex-col gap-3">
        {/* Team 1 Score Input */}
        <div className="flex items-center justify-between gap-4">
          <span className="dark:text-neutral-350 truncate text-sm font-medium text-neutral-700">
            {match.team1?.name}
          </span>
          <input
            type="number"
            disabled={status === "scheduled"}
            value={team1Score}
            onChange={(e) => setTeam1Score(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="dark:text-neutral-250 w-16 rounded-lg border border-neutral-200 bg-neutral-50 py-1 text-center font-mono text-sm font-bold text-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900"
          />
        </div>

        {/* Team 2 Score Input */}
        <div className="flex items-center justify-between gap-4">
          <span className="dark:text-neutral-350 truncate text-sm font-medium text-neutral-700">
            {match.team2?.name}
          </span>
          <input
            type="number"
            disabled={status === "scheduled"}
            value={team2Score}
            onChange={(e) => setTeam2Score(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="dark:text-neutral-250 w-16 rounded-lg border border-neutral-200 bg-neutral-50 py-1 text-center font-mono text-sm font-bold text-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900"
          />
        </div>

        {/* Winner Dropdown Selector (Only displays when status is completed) */}
        {status === "completed" && (
          <div className="flex items-center justify-between gap-4 border-t border-neutral-100 pt-2 dark:border-neutral-900/60">
            <span className="text-xs font-semibold text-neutral-500">승리팀 선택</span>
            <select
              value={winnerId || ""}
              onChange={(e) => setWinnerId(e.target.value || null)}
              className="cursor-pointer rounded-lg border border-neutral-200 bg-neutral-50 p-1 text-xs text-neutral-800 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <option value="">선택 안 함 (무승부)</option>
              <option value={match.team1_id}>{match.team1?.name}</option>
              <option value={match.team2_id}>{match.team2?.name}</option>
            </select>
          </div>
        )}
      </div>

      {/* Submit Button & Status Response Text */}
      <div className="flex w-full shrink-0 flex-col gap-2 md:w-32 md:items-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full cursor-pointer rounded-xl px-4 py-2 text-center text-xs font-bold transition-all duration-200 ${
            loading
              ? "bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500"
              : "bg-neutral-900 text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200"
          }`}
        >
          {loading ? "저장 중..." : "저장하기"}
        </button>

        {message && (
          <span
            className={`text-center text-xs font-bold md:text-right ${
              message.type === "success" ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}
