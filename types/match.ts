export interface League {
  id: string;
  name: string;
  code: string;
  season: string;
  logo_url: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  logo_url: string | null;
}

export interface Match {
  id: string;
  league_id: string;
  team1_id: string;
  team2_id: string;
  scheduled_at: string;
  status: "scheduled" | "live" | "completed";
  team1_score: number;
  team2_score: number;
  winner_id: string | null;
  match_type: string;
  stage: string;
  video_url: string | null;
  created_at: string;

  // Relations
  league?: League;
  team1?: Team;
  team2?: Team;
}
