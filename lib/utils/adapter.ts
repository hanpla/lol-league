import { Match, Team, League } from "@/types/match";
import { PandaScoreMatch } from "@/types/pandascore";

/**
 * 영문 팀명을 직관적인 한글 팀명으로 치환하는 헬퍼 함수입니다.
 */
const getKoreanTeamName = (englishName: string): string => {
  const nameMap: Record<string, string> = {
    "Hanwha Life Esports": "한화생명",
    "Nongshim RedForce": "농심 레드포스",
    "HANJIN BRION": "한진 브리온",
    "KIWOOM DRX": "키움 DRX",
  };

  const trimmed = englishName.trim();
  if (nameMap[trimmed]) {
    return nameMap[trimmed];
  }

  const lower = trimmed.toLowerCase();
  if (lower.includes("hanwha life")) return "한화생명";
  if (lower.includes("nongshim")) return "농심 레드포스";
  if (lower.includes("brion")) return "한진 브리온";
  if (lower.includes("drx")) return "키움 DRX";

  return englishName;
};

/**
 * PandaScore 매치 데이터를 기존 UI 컴포넌트 규격에 맞춰 변환하는 어댑터 함수입니다.
 */
export const adaptPandaScoreMatch = (raw: PandaScoreMatch): Match => {
  const team1Raw = raw.opponents?.[0]?.opponent;
  const team2Raw = raw.opponents?.[1]?.opponent;

  const team1: Team = {
    id: team1Raw?.id?.toString() || "tbd-1",
    name: team1Raw?.name ? getKoreanTeamName(team1Raw.name) : "TBD",
    code: team1Raw?.acronym || "TBD",
    logo_url: team1Raw?.image_url || null,
  };

  const team2: Team = {
    id: team2Raw?.id?.toString() || "tbd-2",
    name: team2Raw?.name ? getKoreanTeamName(team2Raw.name) : "TBD",
    code: team2Raw?.acronym || "TBD",
    logo_url: team2Raw?.image_url || null,
  };

  const rawLeagueName = raw.league?.name || "Unknown League";
  const slugUpper = raw.league?.slug?.toUpperCase() || "";
  const nameUpper = rawLeagueName.toUpperCase();
  const isMSI =
    slugUpper.includes("MSI") ||
    slugUpper.includes("MID-INVITATIONAL") ||
    slugUpper.includes("MID-SEASON") ||
    nameUpper.includes("MID-SEASON") ||
    nameUpper.includes("INVITATIONAL") ||
    nameUpper.includes("MSI");

  const isEWC =
    slugUpper.includes("ESPORTS-WORLD-CUP") ||
    slugUpper.includes("EWC") ||
    nameUpper.includes("ESPORTS WORLD CUP") ||
    nameUpper.includes("EWC");

  const league: League = {
    id: raw.league?.id?.toString() || "unknown-league",
    name: isMSI ? "MSI" : isEWC ? "EWC" : rawLeagueName,
    code: raw.league?.slug?.toUpperCase()?.includes("LCK")
      ? "LCK"
      : isMSI
      ? "MSI"
      : isEWC
      ? "EWC"
      : rawLeagueName,
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
