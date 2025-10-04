import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { updateVehicle } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminVehicleEdit({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await supabaseServer();
  if (!supabase) return notFound();

  const { data, error } = await supabase
    .from("vehicles")
    .select("id, make, model, registration, year, mileage, price, fuel_type, transmission, published, slug")
    .eq("id", id)
    .single();

  if (error || !data) return notFound();

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading">Edit: {data.make} {data.model}</h1>
        <div className="flex gap-2">
          {data.slug && (
            <Link href={`/vehicles/${data.slug}`} className="px-3 py-2 rounded border bg-white/5 hover:bg-white/10">
              View
            </Link>
          )}
          <Link href="/admin/vehicles" className="px-3 py-2 rounded border bg-white/5 hover:bg-white/10">Back</Link>
        </div>
      </div>

      <form action={updateVehicle} className="max-w-xl space-y-4 rounded border p-4">
        <input type="hidden" name="id" value={data.id} />

        <label className="block space-y-1">
          <span className="text-xs opacity-70">Make</span>
          <input name="make" defaultValue={data.make ?? ""} className="w-full rounded bg-transparent border px-3 py-2" />
        </label>

        <label className="block space-y-1">
          <span className="text-xs opacity-70">Model</span>
          <input name="model" defaultValue={data.model ?? ""} className="w-full rounded bg-transparent border px-3 py-2" />
        </label>

        <label className="block space-y-1">
          <span className="text-xs opacity-70">Registration</span>
          <input name="registration" defaultValue={data.registration ?? ""} className="w-full rounded bg-transparent border px-3 py-2" />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-xs opacity-70">Year</span>
            <input name="year" type="number" defaultValue={data.year ?? ""} className="w-full rounded bg-transparent border px-3 py-2" />
          </label>
          <label className="space-y-1">
            <span className="text-xs opacity-70">Mileage</span>
            <input name="mileage" type="number" defaultValue={data.mileage ?? ""} className="w-full rounded bg-transparent border px-3 py-2" />
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-xs opacity-70">Price (GBP)</span>
          <input name="price" type="number" defaultValue={data.price ?? ""} className="w-full rounded bg-transparent border px-3 py-2" />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-xs opacity-70">Fuel type</span>
            <input name="fuel_type" defaultValue={data.fuel_type ?? ""} className="w-full rounded bg-transparent border px-3 py-2" />
          </label>
          <label className="space-y-1">
            <span className="text-xs opacity-70">Transmission</span>
            <input name="transmission" defaultValue={data.transmission ?? ""} className="w-full rounded bg-transparent border px-3 py-2" />
          </label>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={!!data.published} />
          <span>Published</span>
        </label>

        <div className="pt-2">
          <button className="px-4 py-2 rounded bg-white/10 hover:bg-white/15 border">Save</button>
        </div>
      </form>
    </main>
  );
}