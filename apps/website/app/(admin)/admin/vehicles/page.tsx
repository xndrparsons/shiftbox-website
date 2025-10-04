import VehicleDrawerForm from "@/components/admin/VehicleDrawerForm";
import Link from "next/link";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { supabaseServer } from "@/lib/supabase/server";
import { setPublished, deleteVehicle } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminVehicles({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; only?: "all" | "pub" | "unpub" }>;
}) {
  const sp = await searchParams;
  const q = (sp?.q ?? "").trim();
  const only = sp?.only ?? "all";

  const supabase = await supabaseServer();
  if (!supabase) return <div className="p-6">Supabase not configured</div>;

  let query = supabase
    .from("vehicles")
    .select("id, make, model, registration, year, mileage, price, published, created_at, slug")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("make", `%${q}%`).ilike("model", `%${q}%`);
  }
  if (only === "pub") query = query.eq("published", true);
  if (only === "unpub") query = query.eq("published", false);

  const { data, error } = await query;
  if (error) return <pre className="p-6 text-red-500">{JSON.stringify(error, null, 2)}</pre>;

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading">Vehicles</h1>
        <VehicleDrawer />
      </div>

      <form className="flex flex-wrap items-center gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search make/model…"
          className="rounded bg-transparent border px-3 py-2"
        />
        <select name="only" defaultValue={only} className="rounded bg-transparent border px-3 py-2">
          <option value="all">All</option>
          <option value="pub">Published</option>
          <option value="unpub">Unpublished</option>
        </select>
        <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/15 border">Apply</button>
      </form>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="p-3">Vehicle</th>
              <th className="p-3">Reg</th>
              <th className="p-3">Year</th>
              <th className="p-3">Mileage</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3 w-px">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((v) => (
              <tr key={v.id} className="border-t border-border/60">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{v.make} {v.model}</span>
                    {v.slug ? (
                      <Link href={`/vehicles/${v.slug}`} className="text-xs underline opacity-75 hover:opacity-100">view</Link>
                    ) : null}
                  </div>
                </td>
                <td className="p-3">{v.registration ?? "—"}</td>
                <td className="p-3">{v.year ?? "—"}</td>
                <td className="p-3">{typeof v.mileage === "number" ? v.mileage.toLocaleString() : "—"}</td>
                <td className="p-3">
                  {typeof v.price === "number" ? `£${Math.round(v.price).toLocaleString("en-GB")}` : "—"}
                </td>
                <td className="p-3">
                  {v.published ? <span className="text-green-400">Published</span> : <span className="text-yellow-400">Unpublished</span>}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/vehicles/${v.id}`} className="px-2 py-1 rounded border bg-white/5 hover:bg-white/10">
                      Edit
                    </Link>

                    <ConfirmButton
                      action={async () => {
                        "use server";
                        await setPublished(v.id, !v.published);
                      }}
                      confirmText={v.published ? "Unpublish this vehicle?" : "Publish this vehicle?"}
                      className={`px-2 py-1 rounded border bg-white/5 hover:bg-white/10 ${
                        v.published ? "text-yellow-300" : "text-green-300"
                      }`}
                    >
                      {v.published ? "Unpublish" : "Publish"}
                    </ConfirmButton>

                    <ConfirmButton
                      action={async () => {
                        "use server";
                        await deleteVehicle(v.id);
                      }}
                      confirmText="Delete this vehicle?"
                      className="px-2 py-1 rounded border bg-white/5 hover:bg-white/10 text-red-300"
                    >
                      Delete
                    </ConfirmButton>
                  </div>
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={7} className="p-6 text-center opacity-70">No vehicles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}