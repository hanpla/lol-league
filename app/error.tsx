"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error Boundary caught an error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md rounded-2xl border border-red-200/60 bg-white p-8 shadow-md transition-colors duration-300 dark:border-red-950/40 dark:bg-neutral-900/40 dark:shadow-none">
        {/* Warning Icon */}
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h2 className="mb-2 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          데이터를 불러오지 못했습니다
        </h2>
        <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
          경기 정보를 불러오는 과정에서 오류가 발생했습니다. 네트워크 연결 상태를 확인하고 아래 버튼을 눌러 다시 시도해 주세요.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-neutral-50 shadow-sm transition-all duration-200 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            다시 시도하기
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-600 shadow-sm transition-all duration-200 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/60"
          >
            새로고침
          </button>
        </div>
      </div>
    </main>
  );
}
