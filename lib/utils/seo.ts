import { Match } from "@/types/match";
import { FaqItem } from "@/types/seo";

export const FAQ_LIST: FaqItem[] = [
  {
    question: "2026 LCK 경기 일정과 시간은 어떻게 되나요?",
    answer:
      "LCK(롤챔스) 정규 시즌 경기는 주로 수요일부터 일요일까지 진행되며, 1경기는 17:00, 2경기는 19:30에 시작됩니다. LOL League Hub에서 월별 상세 대진표와 실시간 경기 일정을 확인하실 수 있습니다.",
  },
  {
    question: "LCK 외에 어떤 롤 대회 일정을 확인할 수 있나요?",
    answer:
      "LCK뿐만 아니라 전 세계 최상위 팀들이 맞붙는 MSI(Mid-Season Invitational), EWC(Esports World Cup) 등 주요 국내외 리그 오브 레전드 공식 대회의 일정을 모두 제공합니다.",
  },
  {
    question: "롤 대회 경기 결과와 일정은 실시간으로 업데이트되나요?",
    answer:
      "네, 공식 e스포츠 매치 데이터 API와 연동되어 경기 시작 시간, 라이브 진행 상태, 세트 스코어 및 승패 결과가 실시간으로 자동 갱신됩니다.",
  },
  {
    question: "LCK 및 롤 경기 생중계는 어디서 시청할 수 있나요?",
    answer:
      "LCK 공식 경기는 SOOP(아프리카TV), 네이버 치지직, 유튜브 e스포츠 공식 채널을 통해 온라인 라이브 생중계를 시청하실 수 있습니다.",
  },
];

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "LOL League Hub",
  alternateName: ["롤 리그 허브", "LCK 일정 Hub", "롤 대회 일정"],
  url: "https://lol-league.vercel.app",
  description:
    "LCK(롤챔스), MSI, EWC 등 2026 리그 오브 레전드 주요 대회 일정과 실시간 경기 결과, 대진표를 한눈에 확인하세요.",
  inLanguage: "ko-KR",
});

export const generateFaqSchema = (faqs: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const generateSportsEventSchema = (matches: Match[]) => {
  // 너무 많은 양의 스키마는 방대해질 수 있으므로 최신 및 향후 20개 매치를 대상으로 구조화 데이터 생성
  const targetMatches = matches.slice(0, 20);

  return targetMatches.map((match) => {
    let eventStatus = "https://schema.org/EventScheduled";
    if (match.status === "completed") {
      eventStatus = "https://schema.org/EventCompleted";
    } else if (match.status === "live") {
      eventStatus = "https://schema.org/EventMovedOnline";
    }

    const team1Name = match.team1?.name || "TBD";
    const team2Name = match.team2?.name || "TBD";
    const leagueName = match.league?.name || "League of Legends";

    return {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: `${leagueName} - ${team1Name} vs ${team2Name}`,
      startDate: match.scheduled_at,
      eventStatus,
      sport: "League of Legends",
      competitor: [
        {
          "@type": "SportsTeam",
          name: team1Name,
          image: match.team1?.logo_url || undefined,
        },
        {
          "@type": "SportsTeam",
          name: team2Name,
          image: match.team2?.logo_url || undefined,
        },
      ],
      location: {
        "@type": "Place",
        name: "LOL PARK (롤파크) / Online",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Seoul",
          addressCountry: "KR",
        },
      },
      offers: {
        "@type": "Offer",
        url: "https://lol-league.vercel.app",
        availability: "https://schema.org/InStock",
        price: "0",
        priceCurrency: "KRW",
      },
    };
  });
};
