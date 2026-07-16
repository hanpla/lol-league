interface MonthTabsProps {
  selectedMonth: number;
  selectedLeague: string;
  onMonthSelect: (month: number) => void;
  activeMonths: number[];
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function MonthTabs({
  selectedMonth,
  onMonthSelect,
  activeMonths,
}: MonthTabsProps) {
  const currentMonth = new Date().getMonth() + 1;

  return (
    <section className="mb-6">
      <div className="flex flex-wrap justify-center gap-1 rounded-xl border border-neutral-200 bg-neutral-200/30 p-1.5 transition-colors duration-300 sm:grid sm:grid-cols-6 md:grid-cols-12 dark:border-neutral-800 dark:bg-neutral-900/40">
        {MONTHS.map((m) => {
          const isActive = m <= currentMonth || activeMonths.includes(m);
          const isSelected = m === selectedMonth;

          if (isActive) {
            return (
              <button
                key={m}
                type="button"
                onClick={() => onMonthSelect(m)}
                className={`cursor-pointer rounded-lg px-3 py-2 text-center text-sm font-semibold transition-all duration-200 sm:px-0 ${
                  isSelected
                    ? "bg-neutral-900 text-neutral-50 shadow-sm dark:bg-neutral-100 dark:text-neutral-950"
                    : "text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-50"
                }`}
              >
                {m}월
              </button>
            );
          } else {
            return (
              <div
                key={m}
                className="cursor-default rounded-lg px-3 py-2 text-center text-sm font-normal text-neutral-400 select-none sm:px-0 dark:text-neutral-600"
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
