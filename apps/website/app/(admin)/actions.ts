"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        set(name, value, options) { cookieStore.set(name, value, options); },
        remove(name, options) { cookieStore.set(name, "", { ...options, maxAge: 0 }); },
      },
    }
  );
  await supabase.auth.signOut();
  redirect("/auth/login");
}
