import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 font-sans text-neutral-900 transition-colors duration-300 selection:bg-neutral-200 dark:bg-neutral-950 dark:text-neutral-100 dark:selection:bg-neutral-800">
      <div className="px-4 text-center">
        {/* Error Code */}
        <h1 className="dark:text-neutral-850 animate-pulse text-8xl font-extrabold tracking-widest text-neutral-300 select-none">
          404
        </h1>

        {/* Message */}
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          요청하신 페이지가 존재하지 않거나 변경되었을 수 있습니다.
        </p>

        {/* Link back */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-bold text-neutral-50 shadow-sm transition-all duration-200 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            메인 화면으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
