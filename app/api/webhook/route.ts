import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    // 1. 보안을 위한 웹훅 비밀 토큰 검증
    const authHeader = req.headers.get("X-Webhook-Secret");
    const localSecret = process.env.PANDASCORE_WEBHOOK_SECRET;

    if (!localSecret || authHeader !== localSecret) {
      console.warn("⚠️ Unauthorized webhook request received.");
      return NextResponse.json(
        { error: "Unauthorized: Invalid Secret Token" },
        { status: 401 }
      );
    }

    // 2. PandaScore에서 보낸 데이터 본문 파싱 (디버깅/기록용)
    const payload = await req.json();
    console.log(`🔔 PandaScore Webhook Received: Event [${payload.event || "unknown"}]`);

    // 3. 메인 페이지('/') 캐시 즉시 무효화 (Next.js use cache 파괴)
    revalidatePath("/");
    console.log("⚡ Cache invalidated for page: '/'");

    return NextResponse.json({
      revalidated: true,
      message: "Cache invalidated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
