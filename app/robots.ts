import type { MetadataRoute } from "next";

/**
 * 구글 및 포털 크롤러의 사이트 수집 규칙을 설정하는 robots.ts 파일입니다.
 */
const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
  },
  sitemap: "https://lol-league.vercel.app/sitemap.xml",
});

export default robots;
