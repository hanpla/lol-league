"use server";

import { supabase, supabaseAdmin } from "@/lib/utils/supabase";
import { Match, FormState } from "@/types/match";
import { revalidatePath, cacheLife } from "next/cache";

/**
 * 1. 전체 경기 일정을 조회합니다. (일반 사용자 조회용 - Public Client 사용)
 */
export const getMatches = async (): Promise<Match[]> => {
  "use cache";
  cacheLife("minutes");

  // 실시간으로 시간이 지난 대기 중인(scheduled) 경기를 진행중(live) 상태로 자동 전환 (Hobby 플랜 크론 보완)
  try {
    const { data: updatedData, error: updateError } = await supabaseAdmin
      .from("matches")
      .update({ status: "live" })
      .eq("status", "scheduled")
      .lte("scheduled_at", new Date().toISOString())
      .select();

    if (updateError) {
      console.error("Failed to auto-update match status to live on-the-fly:", updateError);
    } else if (updatedData && updatedData.length > 0) {
      revalidatePath("/");
    }
  } catch (err) {
    console.error("Error during auto-update match status on-the-fly:", err);
  }

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
  videoUrl: string | null = null,
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
      video_url: videoUrl,
    })
    .eq("id", matchId)
    .select();

  if (error) {
    console.error("Error updating match score:", error);
    throw new Error(error.message);
  }

  // 메인 및 어드민 페이지 캐시 갱신
  revalidatePath("/");
  revalidatePath("/admin");
  return data as Match[];
};

/**
 * 4. 어드민 페이지의 useActionState 폼 제출을 처리하는 서버 액션입니다.
 */
export const updateMatchScoreAction = async (
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const statusValue = formData.get("status") as Match["status"];
  const team1ScoreValue = parseInt(formData.get("team1Score") as string, 10) || 0;
  const team2ScoreValue = parseInt(formData.get("team2Score") as string, 10) || 0;
  const winnerIdValue = formData.get("winnerId") as string | null;
  const videoUrlValue = formData.get("videoUrl") as string | null;
  const passwordValue = formData.get("adminPassword") as string;
  const matchIdValue = formData.get("matchId") as string;

  try {
    await updateMatchScore(
      matchIdValue,
      team1ScoreValue,
      team2ScoreValue,
      statusValue,
      statusValue === "completed" ? winnerIdValue || null : null,
      passwordValue,
      videoUrlValue ? videoUrlValue.trim() : null,
    );
    return { success: true, message: "저장 완료!" };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "오류가 발생했습니다.";
    return { success: false, message: errMsg };
  }
};
