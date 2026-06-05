export interface PandaScoreOpponent {
  opponent: {
    id: number;
    name: string;
    acronym: string | null;
    image_url: string | null;
  } | null;
  type: string;
}

export interface PandaScoreResult {
  score: number;
  team_id: number;
}

export interface PandaScoreStream {
  embed_url: string | null;
  language: string;
  main: boolean;
  official: boolean;
  raw_url: string | null;
}

export interface PandaScoreMatch {
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
