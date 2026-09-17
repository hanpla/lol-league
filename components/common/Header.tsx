import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="relative mb-12 flex items-center justify-between border-b border-neutral-200 pb-6 dark:border-neutral-800/60">
      {/* Left Column: Spacer */}
      <div className="flex flex-1 justify-start" />

      {/* Center Column: Header Title */}
      <div className="text-center">
        <h1 className="flex flex-col items-center gap-1">
          <span className="text-xs font-bold tracking-wider text-blue-600 sm:text-sm dark:text-blue-400">
            LCK 일정 · 롤 대회 일정
          </span>
          <span className="text-2xl font-extrabold tracking-wider text-neutral-900 uppercase sm:text-3xl dark:text-neutral-50">
            LOL League Hub
          </span>
        </h1>
        <p className="mt-1.5 text-xs font-medium text-neutral-500 sm:text-sm dark:text-neutral-400">
          2026 리그 오브 레전드 경기 일정 및 실시간 대진 결과
        </p>
      </div>

      {/* Right Column: Theme Toggler */}
      <div className="flex flex-1 justify-end">
        <ThemeToggle />
      </div>
    </header>
  );
}
