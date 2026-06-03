import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="relative mb-12 flex items-center justify-between border-b border-neutral-200 pb-6 dark:border-neutral-800/60">
      {/* Left Column: Spacer */}
      <div className="flex flex-1 justify-start" />

      {/* Center Column: Header Title */}
      <div className="text-center">
        <h1 className="mb-1.5 text-3xl font-extrabold tracking-wider text-neutral-900 uppercase dark:text-neutral-50">
          LOL League Hub
        </h1>
        <p className="text-xs font-medium text-neutral-500 sm:text-sm dark:text-neutral-400">
          리그 오브 레전드 대회 일정 및 실시간 경기 결과
        </p>
      </div>

      {/* Right Column: Theme Toggler */}
      <div className="flex flex-1 justify-end">
        <ThemeToggle />
      </div>
    </header>
  );
}
