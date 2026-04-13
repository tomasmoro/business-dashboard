"use server";

import { redirect } from "next/navigation";
import { createServerAuthClient } from "@/lib/supabase/server-auth";

export type AuthState = {
  error: string | null;
};

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email y contraseña son requeridos." };
  }

  const supabase = await createServerAuthClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function registerAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  void _prevState;
  void formData;
  return { error: "El registro de usuarios está deshabilitado." };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createServerAuthClient();
  await supabase.auth.signOut();
  redirect("/login");
}
