import { supabaseAdmin } from "@/lib/utils/supabase";
import { revalidatePath } from "next/cache";

/**
 * Vercel Cron Job이 매 분마다 호출할 API 엔드포인트입니다.
 * 예정된 시간(scheduled_at)이 경과한 대기(scheduled) 경기를 진행중(live) 상태로 자동 전환합니다.
 */
export const GET = async (request: Request): Promise<Response> => {
  const authHeader = request.headers.get("authorization");

  // 운영(production) 환경에서만 Vercel 크론 비밀 키(CRON_SECRET) 검증 수행 (로컬 테스트 편의성용)
  if (process.env.NODE_ENV === "production" && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 1. scheduled_at이 현재 시각보다 과거이면서 status가 'scheduled'인 모든 경기들을 'live'로 업데이트
    const { data, error } = await supabaseAdmin
      .from("matches")
      .update({ status: "live" })
      .eq("status", "scheduled")
      .lte("scheduled_at", new Date().toISOString())
      .select();

    if (error) {
      console.error("Cron Job Database Update Error:", error);
      return Response.json({ success: false, error: error.message }, { status: 500 });
    }

    const updatedCount = data ? data.length : 0;

    // 2. 경기가 실제 업데이트된 경우에만 메인 페이지의 캐시를 강제 비우고 재생성(Revalidate)합니다.
    if (updatedCount > 0) {
      revalidatePath("/");
    }

    return Response.json({
      success: true,
      message: `Matches status updated successfully. Total updated: ${updatedCount}`,
      updatedCount,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("Cron Job Internal Server Error:", err);
    return Response.json({ success: false, error: errorMessage }, { status: 500 });
  }
};
