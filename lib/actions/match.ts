"use server";

import { Match } from "@/types/match";
import { PandaScoreMatch } from "@/types/pandascore";
import { adaptPandaScoreMatch } from "@/lib/utils/adapter";
import { cacheLife } from "next/cache";

const SERIES_IDS = {
  LCK_2026: 10419,
  MSI_2026: 10676,
} as const;

/**
 * 특정 페이지의 PandaScore 매치 데이터를 조회하는 공통 헬퍼 함수입니다.
 */
const fetchPage = async (page: number, token: string, serieIdsParam: string): Promise<PandaScoreMatch[]> => {
  const res = await fetch(
    `https://api.pandascore.co/lol/matches?filter[serie_id]=${serieIdsParam}&token=${token}&per_page=100&page=${page}&sort=scheduled_at`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`PandaScore API page ${page} failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

/**
 * LCK 2026 및 MSI 2026 대회 일정을 PandaScore API에서 직접 조회합니다.
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
    const serieIdsParam = Object.values(SERIES_IDS).join(",");
    
    // 100개 제한으로 밀려난 7월 매치 데이터를 유실 없이 수집하기 위해
    // 1페이지와 2페이지 데이터를 병렬(Promise.all)로 병합 수집합니다.
    const [page1, page2] = await Promise.all([
      fetchPage(1, token, serieIdsParam),
      fetchPage(2, token, serieIdsParam),
    ]);

    const rawMatches = [...page1, ...page2];

    // PandaScore API 원본 데이터를 기존 UI 타입으로 어댑팅
    return rawMatches.map(adaptPandaScoreMatch);
  } catch (error) {
    console.error("❌ getMatches fetch 중 예외 발생:", error);
    return [];
  }
};
