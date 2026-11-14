import { supabase } from "./client";

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  role: "parent" | "staff" | "admin";
  fullName?: string;
  posyanduId?: string;
}

/**
 * Login dengan Email dan Password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    throw error;
  }

  // Ambil metadata & role dari tabel users
  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("id, email, phone, role")
    .eq("id", data.user.id)
    .single();

  if (userError) {
    console.warn("User record lookup fallback to metadata:", userError.message);
  }

  const role = userRecord?.role || (data.user.user_metadata?.role as "parent" | "staff" | "admin") || "parent";

  return {
    user: data.user,
    session: data.session,
    role,
  };
}

/**
 * Registrasi Orang Tua Baru
 */
export async function signUpParent(params: {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  posyanduName?: string;
}) {
  const finalEmail = params.email?.trim() || `${params.phone.replace(/[^0-9]/g, "")}@posyandu.parent.local`;

  const { data, error } = await supabase.auth.signUp({
    email: finalEmail.toLowerCase(),
    password: params.password,
    options: {
      data: {
        role: "parent",
        full_name: params.fullName,
        phone: params.phone,
        posyandu: params.posyanduName,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Reset Kata Sandi via Email
 */
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Logout
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

/**
 * Ambil data sesi user saat ini
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userProfile } = await supabase
    .from("users")
    .select("id, email, phone, role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email || "",
    phone: userProfile?.phone || user.user_metadata?.phone,
    role: userProfile?.role || user.user_metadata?.role || "parent",
    fullName: user.user_metadata?.full_name,
  };
}

