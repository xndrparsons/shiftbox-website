"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function serverClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookies().getAll(); },
        setAll(c) { c.forEach(({ name, value, options }) => cookies().set(name, value, options)); },
      },
    }
  );
}

export async function updateVehicle(formData: FormData) {
  const id = String(formData.get("id"));
  const values: any = {
    make: String(formData.get("make") || ""),
    model: String(formData.get("model") || ""),
    registration: String(formData.get("registration") || "").toUpperCase(),
    year: formData.get("year") ? Number(formData.get("year")) : null,
    mileage: formData.get("mileage") ? Number(formData.get("mileage")) : null,
    price: formData.get("price") ? Number(formData.get("price")) : null,
    fuel_type: String(formData.get("fuel_type") || "") || null,
    transmission: String(formData.get("transmission") || "") || null,
    published: formData.get("published") === "on",
  };

  const supabase = serverClient();
  const { error } = await supabase.from("vehicles").update(values).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/vehicles");
  redirect(`/admin/vehicles/${id}`);
}