import type { MetadataRoute } from "next";

/**
 * 검색 엔진에 제공할 사이트 맵을 동적으로 생성하는 sitemap.ts 파일입니다.
 */
const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: "https://lol-league.vercel.app",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
];

export default sitemap;
