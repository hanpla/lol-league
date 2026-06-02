import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 1. 일반 조회용 클라이언트 (클라이언트 컴포넌트, 서버 컴포넌트 모두 사용 가능)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. 서버 전용 어드민 클라이언트 (데이터 등록/수정/삭제용)
export const supabaseAdmin = (() => {
  if (typeof window !== "undefined") {
    throw new Error("Supabase admin client can only be used on the server side!");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });
})();
