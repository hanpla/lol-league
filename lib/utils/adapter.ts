import { Match, Team, League } from "@/types/match";

interface PandaScoreOpponent {
  opponent: {
    id: number;
    name: string;
    acronym: string | null;
    image_url: string | null;
  } | null;
  type: string;
}

interface PandaScoreResult {
  score: number;
  team_id: number;
}

interface PandaScoreStream {
  embed_url: string | null;
  language: string;
  main: boolean;
  official: boolean;
  raw_url: string | null;
}

interface PandaScoreMatch {
  id: number;
  status: string;
  scheduled_at: string;
  winner_id: number | null;
  number_of_games: number;
  tournament: {
    name: string;
  } | null;
  league: {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
  } | null;
  serie: {
    begin_at: string | null;
    end_at: string | null;
    full_name: string;
  } | null;
  results: PandaScoreResult[] | null;
  opponents: PandaScoreOpponent[] | null;
  streams_list: PandaScoreStream[] | null;
  modified_at: string | null;
}

/**
 * PandaScore 매치 데이터를 기존 UI 컴포넌트 규격에 맞춰 변환하는 어댑터 함수입니다.
 */
export const adaptPandaScoreMatch = (raw: PandaScoreMatch): Match => {
  const team1Raw = raw.opponents?.[0]?.opponent;
  const team2Raw = raw.opponents?.[1]?.opponent;

  const team1: Team = {
    id: team1Raw?.id?.toString() || "tbd-1",
    name: team1Raw?.name || "TBD",
    code: team1Raw?.acronym || "TBD",
    logo_url: team1Raw?.image_url || null,
  };

  const team2: Team = {
    id: team2Raw?.id?.toString() || "tbd-2",
    name: team2Raw?.name || "TBD",
    code: team2Raw?.acronym || "TBD",
    logo_url: team2Raw?.image_url || null,
  };

  const league: League = {
    id: raw.league?.id?.toString() || "unknown-league",
    name: raw.league?.name || "Unknown League",
    code: raw.league?.slug?.toUpperCase()?.includes("LCK") ? "LCK" : raw.league?.name || "League",
    season: raw.serie?.full_name || "",
    logo_url: raw.league?.image_url || null,
    start_date: raw.serie?.begin_at || null,
    end_date: raw.serie?.end_at || null,
  };

  // PandaScore status: "not_started" | "running" | "finished" | "postponed" 등
  // 기존 프로젝트 status: "scheduled" | "live" | "completed"
  let status: Match["status"] = "scheduled";
  if (raw.status === "running") {
    status = "live";
  } else if (raw.status === "finished") {
    status = "completed";
  }

  // 각 팀 ID에 일치하는 스코어 조회
  const getScoreForTeam = (teamId: number | null): number => {
    if (teamId === null) return 0;
    const scoreObj = raw.results?.find((r) => r.team_id === teamId);
    return scoreObj ? scoreObj.score : 0;
  };

  const team1_score = team1Raw?.id ? getScoreForTeam(team1Raw.id) : 0;
  const team2_score = team2Raw?.id ? getScoreForTeam(team2Raw.id) : 0;

  // match_type 형식화 (예: best_of + 3 = bo3)
  const match_type = raw.number_of_games ? `bo${raw.number_of_games}` : "bo3";

  return {
    id: raw.id.toString(),
    league_id: league.id,
    team1_id: team1.id,
    team2_id: team2.id,
    scheduled_at: raw.scheduled_at,
    status,
    team1_score,
    team2_score,
    winner_id: raw.winner_id?.toString() || null,
    match_type,
    stage: raw.tournament?.name || "Group Stage",
    created_at: raw.modified_at || new Date().toISOString(),
    league,
    team1,
    team2,
  };
};
