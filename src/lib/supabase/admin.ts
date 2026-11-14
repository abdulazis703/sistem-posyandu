// src/lib/supabase/admin.ts
// ⚠️ HANYA di-import dari kode server (route handler / server action).
// Jangan pernah di-import dari komponen "use client".
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum terbaca. Cek .env.local lalu restart npm run dev."
    );
  }

  // persistSession false: ini client server, tidak menyimpan sesi apa pun
  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}