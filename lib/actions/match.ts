"use server";

import { supabase, supabaseAdmin } from "@/lib/utils/supabase";
import { Match } from "@/types/match";
import { revalidatePath } from "next/cache";

/**
 * 1. 전체 경기 일정을 조회합니다. (일반 사용자 조회용 - Public Client 사용)
 */
export const getMatches = async (): Promise<Match[]> => {
  const { data, error } = await supabase
    .from("matches")
    .select(
      `
      *,
      league:leagues(*),
      team1:teams!team1_id(*),
      team2:teams!team2_id(*)
    `,
    )
    .order("scheduled_at", { ascending: true });

  if (error) {
    console.error("Error fetching matches:", error);
    throw new Error(error.message);
  }

  return data as Match[];
};

/**
 * 2. 특정 상태(scheduled, live, completed)의 경기 일정만 조회합니다. (일반 사용자 조회용 - Public Client 사용)
 */
export const getMatchesByStatus = async (status: Match["status"]): Promise<Match[]> => {
  const { data, error } = await supabase
    .from("matches")
    .select(
      `
      *,
      league:leagues(*),
      team1:teams!team1_id(*),
      team2:teams!team2_id(*)
    `,
    )
    .eq("status", status)
    .order("scheduled_at", { ascending: true });

  if (error) {
    console.error(`Error fetching matches with status ${status}:`, error);
    throw new Error(error.message);
  }

  return data as Match[];
};

/**
 * 3. 경기 스코어 및 상태를 업데이트합니다. (어드민 전용 - RLS 우회 Admin Client 사용)
 * Server Action이므로 서버 환경에서 비밀키(Service Role Key)를 안전하게 사용하여 실행됩니다.
 */
export const updateMatchScore = async (
  matchId: string,
  team1Score: number,
  team2Score: number,
  status: Match["status"],
  winnerId: string | null = null,
  adminPassword?: string,
): Promise<Match[]> => {
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (!correctPassword) {
    throw new Error("서버에 관리자 비밀번호 환경 변수가 설정되지 않았습니다.");
  }

  if (!adminPassword || adminPassword !== correctPassword) {
    throw new Error("올바르지 않은 관리자 비밀번호입니다.");
  }

  const { data, error } = await supabaseAdmin
    .from("matches")
    .update({
      team1_score: team1Score,
      team2_score: team2Score,
      status,
      winner_id: winnerId,
    })
    .eq("id", matchId)
    .select();

  if (error) {
    console.error("Error updating match score:", error);
    throw new Error(error.message);
  }

  // 메인 페이지 캐시 갱신
  revalidatePath("/");
  return data as Match[];
};
