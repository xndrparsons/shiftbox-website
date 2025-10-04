"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() { return (await cookies()).getAll(); },
        async set(name, value, opts) { (await cookies()).set(name, value, opts); },
        async remove(name, opts) { (await cookies()).set(name, "", { ...opts, maxAge: 0 }); },
      },
    }
  );
  await supabase.auth.signOut();
  redirect("/");
}
