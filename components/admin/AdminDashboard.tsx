"use client";

import { Match } from "@/types/match";
import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/common/ThemeToggle";
import MatchEditCard from "./MatchEditCard";
import ArrowBackIcon from "@/components/common/icons/ArrowBackIcon";

export default function AdminDashboard({ initialMatches }: { initialMatches: Match[] }) {
  const [adminPassword, setAdminPassword] = useState("");

  // Sort matches chronologically
  const sortedMatches = [...initialMatches].sort(
    (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime(),
  );

  return (
    <main className="min-h-screen bg-neutral-50 font-sans text-neutral-900 transition-colors duration-300 selection:bg-neutral-200 dark:bg-neutral-950 dark:text-neutral-100 dark:selection:bg-neutral-800">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Navigation & Theme Toggle */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-neutral-500 transition-colors duration-200 hover:text-neutral-900 dark:hover:text-neutral-200"
          >
            <ArrowBackIcon className="h-4 w-4 shrink-0" />
            메인 화면으로
          </Link>
          <ThemeToggle />
        </div>

        {/* Header */}
        <header className="border-neutral-250/60 mb-10 border-b pb-6 text-center sm:text-left dark:border-neutral-900/60">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-neutral-900 uppercase dark:text-neutral-50">
            관리자 결과 제어 센터
          </h1>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            대기 중인 경기를 실시간 시작시키거나, 진행중인 경기의 스코어를 즉각 입력하여 종료
            처리합니다.
          </p>
        </header>

        {/* Password Card */}
        <section className="mb-10">
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-350 sm:flex-row sm:items-center dark:border-neutral-800 dark:bg-neutral-900/30 dark:shadow-none">
            <div className="max-w-md">
              <h2 className="text-neutral-850 text-sm font-bold dark:text-neutral-200">
                어드민 비밀번호 인증
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                경기 결과를 저장하려면 아래 암호 입력란에 환경변수(`ADMIN_PASSWORD`)로 지정한 올바른
                키를 입력해야 합니다. (로컬 기본값: `admin1234`)
              </p>
            </div>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="비밀번호 입력..."
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800 transition-all focus:ring-1 focus:ring-neutral-400 focus:outline-none sm:w-48 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:ring-neutral-700"
            />
          </div>
        </section>

        {/* Match Lists */}
        <section className="space-y-6">
          <h2 className="mb-4 px-1 text-lg font-bold text-neutral-800 dark:text-neutral-200">
            전체 경기 리스트 ({sortedMatches.length}경기)
          </h2>
          {sortedMatches.length > 0 ? (
            <div className="space-y-4">
              {sortedMatches.map((match) => (
                <MatchEditCard key={match.id} match={match} adminPassword={adminPassword} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white py-20 text-center shadow-sm dark:border-neutral-900/40 dark:bg-neutral-900/10 dark:shadow-none">
              <span className="mb-3 block text-3xl text-neutral-400 dark:text-neutral-600">📅</span>
              <h3 className="text-base font-bold text-neutral-700 dark:text-neutral-400">
                조회된 경기 일정이 없습니다.
              </h3>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
