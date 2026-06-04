"use server";

import { Match } from "@/types/match";
import { adaptPandaScoreMatch } from "@/lib/utils/adapter";
import { cacheLife } from "next/cache";

/**
 * LCK 2026 대회 일정을 PandaScore API에서 직접 조회합니다.
 * Next.js의 use cache와 cacheLife를 활용하여 5분 캐시를 적용합니다.
 */
export const getMatches = async (): Promise<Match[]> => {
  "use cache";
  cacheLife({
    stale: 300, // 5분
    expire: 600, // 최대 10분
  });

  const token = process.env.PANDASCORE_API_TOKEN;
  if (!token) {
    console.error(
      "❌ PANDASCORE_API_TOKEN이 .env.local에 설정되지 않았거나 개발 서버 재기동(npm run dev)이 필요합니다.",
    );
    return [];
  }

  try {
    // LCK 2026 시리즈(ID: 10419) 매치 데이터를 오름차순 정렬하여 획득
    const res = await fetch(
      `https://api.pandascore.co/lol/matches?filter[serie_id]=10419&token=${token}&per_page=100&sort=scheduled_at`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!res.ok) {
      console.error(`❌ PandaScore API 호출 실패 (Status: ${res.status} ${res.statusText})`);
      try {
        const errorDetails = await res.json();
        console.error("PandaScore Error Details:", errorDetails);
      } catch {}
      return [];
    }

    const rawMatches = await res.json();
    if (!Array.isArray(rawMatches)) {
      console.error("❌ PandaScore API가 배열 형식을 반환하지 않았습니다:", rawMatches);
      return [];
    }

    // PandaScore API 원본 데이터를 기존 UI 타입으로 어댑팅
    return rawMatches.map(adaptPandaScoreMatch);
  } catch (error) {
    console.error("❌ getMatches fetch 중 예외 발생:", error);
    return [];
  }
};
