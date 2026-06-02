import Link from "next/link";

interface MonthTabsProps {
  currentMonth: number;
  selectedMonth: number;
}

export default function MonthTabs({ currentMonth, selectedMonth }: MonthTabsProps) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <section className="mb-12">
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-200/30 dark:bg-neutral-900/40 p-1.5 flex flex-wrap gap-1 justify-center sm:grid sm:grid-cols-6 md:grid-cols-12 transition-colors duration-300">
        {months.map((m) => {
          const isActive = m <= currentMonth;
          const isSelected = m === selectedMonth;

          if (isActive) {
            return (
              <Link
                key={m}
                href={`/?month=${m}`}
                className={`text-center py-2 px-3 sm:px-0 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isSelected
                    ? "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-950 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:text-neutral-50 dark:hover:bg-neutral-800/60"
                }`}
              >
                {m}월
              </Link>
            );
          } else {
            return (
              <div
                key={m}
                className="text-center py-2 px-3 sm:px-0 text-sm font-normal text-neutral-400 dark:text-neutral-600 cursor-default select-none rounded-lg"
                title="아직 일정이 예정되지 않은 월입니다."
              >
                {m}월
              </div>
            );
          }
        })}
      </div>
    </section>
  );
}
