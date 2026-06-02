"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import SunIcon from "@/components/common/icons/SunIcon";
import MoonIcon from "@/components/common/icons/MoonIcon";

const emptySubscribe = () => () => {};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isMounted) {
    return (
      <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800/40" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-neutral-300 bg-neutral-200/50 p-1.5 text-neutral-800 transition-all duration-200 hover:bg-neutral-300/50 dark:border-neutral-800/80 dark:bg-neutral-900/40 dark:text-neutral-200 dark:hover:bg-neutral-800/60"
      aria-label="테마 전환"
    >
      {isDark ? (
        <SunIcon className="h-4 w-4 shrink-0" />
      ) : (
        <MoonIcon className="h-4 w-4 shrink-0" />
      )}
    </button>
  );
}
