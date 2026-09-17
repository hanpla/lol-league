import { FAQ_LIST } from "@/lib/utils/seo";

const SECTION_CARD_CLASS =
  "rounded-2xl border border-neutral-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-xs transition-colors dark:border-neutral-800/80 dark:bg-neutral-900/50";

const BADGE_CLASS =
  "inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300";

const FaqItemCard = ({ question, answer }: { question: string; answer: string }) => (
  <details className="group rounded-xl border border-neutral-200/60 bg-white/40 p-4 transition-all duration-200 dark:border-neutral-800/60 dark:bg-neutral-900/30">
    <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-neutral-800 select-none dark:text-neutral-200">
      <span className="text-sm sm:text-base">{question}</span>
      <span className="ml-2 text-neutral-400 transition-transform duration-200 group-open:rotate-180 dark:text-neutral-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </summary>
    <p className="mt-3 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400">
      {answer}
    </p>
  </details>
);

export default function SeoContentSection() {
  return (
    <section
      aria-label="LCK 및 롤 대회 일정 안내 정보"
      className="mt-16 space-y-6 text-neutral-700 dark:text-neutral-300"
    >
      {/* Overview Guide Card */}
      <div className={SECTION_CARD_CLASS}>
        <div className="mb-3 flex items-center gap-2">
          <span className={BADGE_CLASS}>대회 일정 안내</span>
          <h2 className="text-lg font-bold text-neutral-900 sm:text-xl dark:text-neutral-100">
            2026 LCK 일정 및 리그 오브 레전드 대회 안내
          </h2>
        </div>
        <div className="space-y-3 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400">
          <p>
            <strong>LOL League Hub</strong>는 리그 오브 레전드 e스포츠 팬들을 위해{" "}
            <strong>LCK(롤챔스)</strong>를 비롯한 <strong>MSI</strong>, <strong>EWC</strong> 등
            국내외 주요 롤 대회의 경기 일정, 대진표, 실시간 스코어 및 경기 결과를 가장 빠르고
            정확하게 제공합니다.
          </p>
          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
            <div className="rounded-xl bg-neutral-100/70 p-3.5 dark:bg-neutral-800/40">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-200">
                📅 LCK 경기 요일 및 시간
              </h3>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                수요일 ~ 일요일 진행 (1경기 17:00 / 2경기 19:30 KST)
              </p>
            </div>
            <div className="rounded-xl bg-neutral-100/70 p-3.5 dark:bg-neutral-800/40">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-200">
                🏆 지원 대회 리그
              </h3>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                LCK 정규리그 및 플레이오프, MSI, EWC 국제 대회
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className={SECTION_CARD_CLASS}>
        <div className="mb-4 flex items-center gap-2">
          <span className={BADGE_CLASS}>FAQ</span>
          <h2 className="text-lg font-bold text-neutral-900 sm:text-xl dark:text-neutral-100">
            자주 묻는 질문 (FAQ)
          </h2>
        </div>
        <div className="space-y-3">
          {FAQ_LIST.map((faq) => (
            <FaqItemCard key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>

      {/* Footer copyright & source note */}
      <footer className="pt-4 text-center text-xs text-neutral-400 dark:text-neutral-600">
        <p>© 2026 LOL League Hub. 경기 일정 및 데이터는 공식 e스포츠 API를 바탕으로 제공됩니다.</p>
      </footer>
    </section>
  );
}
