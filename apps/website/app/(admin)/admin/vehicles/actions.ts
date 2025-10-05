"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/navigation";

function supabase() {
  // OK inside Server Actions/Route Handlers
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookies().getAll(); },
        setAll(cookiesToSet) {
          const store = cookies();
          cookiesToSet.forEach(({ name, value, options }) => {
            store.set(name, value, options);
          });
        },
      },
    }
  );
}

export async function createVehicle(formData: FormData) {
  const sb = supabase();

  const make  = (formData.get("make")  || "").toString().trim();
  const model = (formData.get("model") || "").toString().trim();
  const registration = (formData.get("registration") || "").toString().trim().toUpperCase();

  const yearStr    = (formData.get("year") || "").toString().trim();
  const mileageStr = (formData.get("mileage") || "").toString().trim();
  const priceStr   = (formData.get("price") || "").toString().trim();
  const fuel_type  = (formData.get("fuel_type") || "").toString().trim();
  const transmission = (formData.get("transmission") || "").toString().trim();
  const published = (formData.get("published") || "") === "on";

  if (!make || !model || !registration) {
    throw new Error("make, model, registration are required");
  }

  const payload: Record<string, any> = { make, model, registration, published };
  if (yearStr)       payload.year = Number(yearStr);
  if (mileageStr)    payload.mileage = Number(mileageStr);
  if (priceStr)      payload.price = Number(priceStr);
  if (fuel_type)     payload.fuel_type = fuel_type;
  if (transmission)  payload.transmission = transmission;

  const { error } = await sb.from("vehicles")
    .insert([payload], { defaultToNull: false })
    .select("id")
    .single();

  if (error) throw error;

  revalidatePath("/admin/vehicles");
}

export async function setPublished(id: string, published: boolean) {
  const { error } = await supabase()
    .from("vehicles")
    .update({ published })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/vehicles");
}

export async function deleteVehicle(id: string) {
  const { error } = await supabase()
    .from("vehicles")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/vehicles");
}
