// src/lib/supabase/auth.ts
import { supabase } from "./client";

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  role: "parent" | "staff" | "admin";
  fullName: string;
  posyandu?: string;
  nik?: string;
  address?: string;
  createdAt?: string;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw error;

  const { data: userRecord } = await supabase
    .from("users")
    .select("id, email, phone, role")
    .eq("id", data.user.id)
    .maybeSingle();

  const role =
    (userRecord?.role as "parent" | "staff" | "admin") ||
    (data.user.user_metadata?.role as "parent" | "staff" | "admin") ||
    "parent";

  return {
    user: data.user,
    session: data.session,
    role,
  };
}

export async function signUpParent(params: {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  posyanduName?: string;
  nik?: string;
}) {
  const finalEmail =
    params.email?.trim() ||
    `${params.phone.replace(/[^0-9]/g, "")}@posyandu.parent.local`;

  const { data, error } = await supabase.auth.signUp({
    email: finalEmail.toLowerCase(),
    password: params.password,
    options: {
      data: {
        role: "parent",
        full_name: params.fullName.trim(),
        phone: params.phone.trim(),
        posyandu: params.posyanduName,
        nik: params.nik?.trim(),
      },
    },
  });

  if (error) throw error;

  return data;
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    {
      redirectTo:
        typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
    }
  );
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userProfile } = await supabase
    .from("users")
    .select("id, email, phone, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  const role =
    (userProfile?.role as "parent" | "staff" | "admin") ||
    (user.user_metadata?.role as "parent" | "staff" | "admin") ||
    "parent";

  let dbFullName: string | undefined;
  let dbNik: string | undefined;
  let dbAddress: string | undefined;
  let dbCreatedAt: string | undefined;

  if (role === "parent") {
    const { data: parentProf } = await supabase
      .from("parent_profiles")
      .select("full_name, nik, address, created_at")
      .eq("user_id", user.id)
      .maybeSingle();
    dbFullName = parentProf?.full_name;
    dbNik = parentProf?.nik;
    dbAddress = parentProf?.address;
    dbCreatedAt = parentProf?.created_at || userProfile?.created_at;
  } else {
    const { data: staffProf } = await supabase
      .from("staff_profiles")
      .select("full_name, created_at")
      .eq("user_id", user.id)
      .maybeSingle();
    dbFullName = staffProf?.full_name;
    dbCreatedAt = staffProf?.created_at || userProfile?.created_at;
  }

  return {
    id: user.id,
    email: userProfile?.email || user.email || "",
    phone: userProfile?.phone || user.user_metadata?.phone,
    role,
    fullName:
      dbFullName ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Pengguna",
    posyandu: user.user_metadata?.posyandu || "Posyandu Melati 01 (RW 01)",
    nik: dbNik || user.user_metadata?.nik,
    address: dbAddress || "",
    createdAt: dbCreatedAt,
  };
}
