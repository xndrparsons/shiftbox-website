"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function supabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { cookieStore.set(name, value, options); },
        remove(name: string, options: any) { cookieStore.set(name, "", { ...options, maxAge: 0 }); },
      },
    }
  );
}

export async function createVehicle(formData: FormData): Promise<void> {
  const sb = supabaseServer();
  const make  = (formData.get("make")  || "").toString().trim();
  const model = (formData.get("model") || "").toString().trim();
  const registration = (formData.get("registration") || "").toString().trim().toUpperCase();
  const priceStr = (formData.get("price") || "").toString().trim();
  const price = priceStr ? Number(priceStr) : null;

  if (!make || !model || !registration) throw new Error("make, model, registration required");

  const { error } = await sb.from("vehicles").insert([{ make, model, registration, price, published: false }]).select("id").single();
  if (error) throw error;

  redirect("/admin/vehicles");
}
