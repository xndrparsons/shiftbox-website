"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createVehicle(formData: FormData): Promise<void> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Required by @supabase/ssr (Next.js server)
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        },
        // Also provide modern helpers (some versions prefer these)
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options?: any) => cookieStore.set(name, value, options),
        remove: (name: string, options?: any) => cookieStore.set(name, "", { ...options, maxAge: 0 }),
      },
    }
  );

  const make  = (formData.get("make")  || "").toString().trim();
  const model = (formData.get("model") || "").toString().trim();
  const registration = (formData.get("registration") || "").toString().trim().toUpperCase();

  const yearStr    = (formData.get("year") || "").toString().trim();
  const mileageStr = (formData.get("mileage") || "").toString().trim();
  const priceStr   = (formData.get("price") || "").toString().trim();
  const fuel_type  = ((formData.get("fuel_type") || "") as string).trim();
  const transmission = ((formData.get("transmission") || "") as string).trim();
  const published = formData.get("published") === "on";

  if (!make || !model || !registration) {
    console.error("Validation failed: make, model, registration are required");
    return;
  }

  // Do NOT send generated/system cols like slug
  const payload: Record<string, any> = { make, model, registration, published };
  if (yearStr)    payload.year = Number(yearStr);
  if (mileageStr) payload.mileage = Number(mileageStr);
  if (priceStr)   payload.price = Number(priceStr);
  if (fuel_type)  payload.fuel_type = fuel_type;
  if (transmission) payload.transmission = transmission;

  const { error } = await supabase
    .from("vehicles")
    .insert([payload], { defaultToNull: false })
    .select("id")
    .single();

  if (error) {
    console.error("createVehicle insert error:", JSON.stringify(error, null, 2), "payload:", payload);
    return;
  }

  redirect("/admin/vehicles");
}
