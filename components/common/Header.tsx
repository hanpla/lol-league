import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="relative flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800/60 pb-6 mb-12">
      <div className="flex-1" /> {/* Left spacer to help center the title */}
      
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-wider text-neutral-900 dark:text-neutral-50 mb-1.5 uppercase">
          LOL League Hub
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
          리그 오브 레전드 대회 일정 및 실시간 경기 결과
        </p>
      </div>
      
      <div className="flex-1 flex justify-end">
        <ThemeToggle />
      </div>
    </header>
  );
}
