interface LeagueTabsProps {
  selectedMonth: number;
  selectedLeague: string;
  onLeagueSelect: (league: string) => void;
}

const LEAGUE = [
  { name: "전체", code: "all" },
  { name: "LCK", code: "LCK" },
];

export default function LeagueTabs({ selectedLeague, onLeagueSelect }: LeagueTabsProps) {
  return (
    <section className="mb-8 flex flex-wrap justify-center gap-2">
      {LEAGUE.map((league) => {
        const isSelected = selectedLeague === league.code;

        return (
          <button
            key={league.code}
            type="button"
            onClick={() => onLeagueSelect(league.code)}
            className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
              isSelected
                ? "border-neutral-900 bg-neutral-900 text-neutral-50 shadow-sm dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950"
                : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-900/80 dark:bg-neutral-900/20 dark:text-neutral-400 dark:hover:bg-neutral-900/40 dark:hover:text-neutral-50"
            }`}
          >
            {league.name}
          </button>
        );
      })}
    </section>
  );
}
