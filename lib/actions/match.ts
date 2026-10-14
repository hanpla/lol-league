"use server";

import { Match } from "@/types/match";
import { PandaScoreMatch, PandaScorePageResult } from "@/types/pandascore";
import { adaptPandaScoreMatch } from "@/lib/utils/adapter";
import { cacheLife } from "next/cache";

const SERIES_IDS = {
  LCK_2026: 10419,
  MSI_2026: 10676,
  EWC_2026: 10765,
  WORLDS_2026: 11014,
} as const;

/**
 * 특정 페이지의 PandaScore 매치 데이터를 조회하는 공통 헬퍼 함수입니다.
 */
const fetchPage = async (
  page: number,
  token: string,
  serieIdsParam: string,
): Promise<PandaScoreMatch[]> => {
  const res = await fetch(
    `https://api.pandascore.co/lol/matches?filter[serie_id]=${serieIdsParam}&per_page=100&page=${page}&sort=scheduled_at`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`PandaScore API page ${page} failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

/**
 * 1페이지 데이터와 전체 페이지 수 메타데이터를 함께 조회하는 헬퍼 함수입니다.
 */
const fetchFirstPage = async (
  token: string,
  serieIdsParam: string,
): Promise<PandaScorePageResult> => {
  const res = await fetch(
    `https://api.pandascore.co/lol/matches?filter[serie_id]=${serieIdsParam}&per_page=100&page=1&sort=scheduled_at`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`PandaScore API page 1 failed: ${res.status} ${res.statusText}`);
  }

  const MAX_PAGES_LIMIT = 10;
  const totalCount = Number(res.headers.get("x-total")) || 0;
  const perPage = Number(res.headers.get("x-per-page")) || 100;
  const calculatedPages = totalCount > 0 ? Math.ceil(totalCount / perPage) : 1;
  const totalPages = Math.min(calculatedPages, MAX_PAGES_LIMIT);

  const data = await res.json();
  return {
    matches: Array.isArray(data) ? data : [],
    totalPages,
  };
};

/**
 * LCK 2026, MSI 2026, EWC 2026 및 Worlds 2026(롤드컵) 대회 일정을 PandaScore API에서 직접 조회합니다.
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

    // 1페이지 및 총 페이지 수를 조회한 뒤, 추가 페이지가 있다면 병렬(Promise.all)로 일괄 수집합니다.
    const { matches: page1Matches, totalPages } = await fetchFirstPage(token, serieIdsParam);

    let remainingMatches: PandaScoreMatch[] = [];
    if (totalPages > 1) {
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      const pagesResults = await Promise.all(
        remainingPages.map((page) => fetchPage(page, token, serieIdsParam)),
      );
      remainingMatches = pagesResults.flat();
    }

    const rawMatches = [...page1Matches, ...remainingMatches];

    // PandaScore API 원본 데이터를 기존 UI 타입으로 어댑팅
    return rawMatches.map(adaptPandaScoreMatch);
  } catch (error) {
    console.error("❌ getMatches fetch 중 예외 발생:", error);
    return [];
  }
};
