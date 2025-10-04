import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function VehiclePage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const supabase = await supabaseServer();
  if (!supabase) return notFound();

  const { data, error } = await supabase
    .from("vehicles")
    .select(
      "id, make, model, year, mileage, price, price_gbp, registration, fuel_type, transmission, created_at"
    )
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) return notFound();

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-heading">{data.make} {data.model}</h1>
      <p className="opacity-70">{data.registration}</p>
      {/* TODO: gallery/specs */}
    </main>
  );
}