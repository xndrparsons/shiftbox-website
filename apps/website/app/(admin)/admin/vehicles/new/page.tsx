import { createVehicle } from "./actions";

export default function NewVehiclePage() {
  return (
    <form action={createVehicle} className="space-y-4 max-w-lg">
      <h2 className="text-xl font-heading">Add Vehicle</h2>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1 col-span-1">
          <span className="text-xs opacity-70">Make</span>
          <input name="make" className="w-full rounded bg-transparent border px-3 py-2" required />
        </label>
        <label className="space-y-1 col-span-1">
          <span className="text-xs opacity-70">Model</span>
          <input name="model" className="w-full rounded bg-transparent border px-3 py-2" required />
        </label>

        <label className="space-y-1 col-span-1">
          <span className="text-xs opacity-70">Registration</span>
          <input name="registration" className="w-full rounded bg-transparent border px-3 py-2" required />
        </label>
        <label className="space-y-1 col-span-1">
          <span className="text-xs opacity-70">Price (GBP)</span>
          <input name="price" type="number" step="1" className="w-full rounded bg-transparent border px-3 py-2" />
        </label>

        <label className="space-y-1 col-span-1">
          <span className="text-xs opacity-70">Fuel</span>
          <input name="fuel_type" className="w-full rounded bg-transparent border px-3 py-2" />
        </label>
        <label className="space-y-1 col-span-1">
          <span className="text-xs opacity-70">Transmission</span>
          <input name="transmission" className="w-full rounded bg-transparent border px-3 py-2" />
        </label>

        <label className="flex items-center gap-2 col-span-2 mt-2">
          <input type="checkbox" name="published" />
          <span>Published</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button className="px-4 py-2 rounded bg-white/10 hover:bg-white/15 border">Create</button>
      </div>
    </form>
  );
}
