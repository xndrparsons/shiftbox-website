"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { createVehicle } from "@/app/(admin)/admin/vehicles/new/actions";
import { Loader2, Search } from "lucide-react";

const NecessarySchema = z.object({
  registration: z.string().min(1, "Required"),
  make: z.string().min(1, "Required"),
  model: z.string().min(1, "Required"),
  year: z.coerce.number().int().positive().optional().nullable(),
  mileage: z.coerce.number().int().nonnegative().optional().nullable(),
  price: z.coerce.number().nonnegative().optional().nullable(),
  engine_capacity: z.coerce.number().int().positive().optional().nullable(),
  fuel_type: z.string().optional().nullable(),
  co2_emissions: z.coerce.number().int().nonnegative().optional().nullable(),
  body_type: z.string().optional().nullable(),
  transmission: z.string().optional().nullable(),
  colour: z.string().optional().nullable(),
  published: z.boolean().optional().default(false),
});

type Necessary = z.infer<typeof NecessarySchema>;

export default function VehicleDrawer() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { register, setValue, getValues, formState } = useForm<Necessary>({
    resolver: zodResolver(NecessarySchema),
    defaultValues: {
      registration: "",
      make: "",
      model: "",
      year: undefined,
      mileage: undefined,
      price: undefined,
      engine_capacity: undefined,
      fuel_type: "",
      co2_emissions: undefined,
      body_type: "",
      transmission: "",
      colour: "",
      published: false,
    },
  });

  async function doLookup() {
    const vrn = getValues("registration")?.trim();
    if (!vrn) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dvla-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vrn }),
      });
      const json = await res.json();
      if (json?.data) {
        const d = json.data;
        if (d.make) setValue("make", d.make);
        if (d.model) setValue("model", d.model);
        if (d.fuel_type) setValue("fuel_type", d.fuel_type);
        if (d.engine_capacity != null) setValue("engine_capacity", d.engine_capacity);
        if (d.co2_emissions != null) setValue("co2_emissions", d.co2_emissions);
        if (d.body_type) setValue("body_type", d.body_type);
        if (d.transmission) setValue("transmission", d.transmission);
        if (d.colour) setValue("colour", d.colour);
        if (d.year != null) setValue("year", d.year);
      } else {
        console.warn("Lookup response:", json);
      }
    } catch (e) {
      console.error("lookup failed:", e);
    } finally {
      setLoading(false);
    }
  }

  // NOTE: native form submit posts to server action; no onSubmit handler here.
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="px-3 py-2 rounded bg-white/10 hover:bg-white/15 border">Add Vehicle</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[560px] max-w-[100vw] backdrop-blur border shadow-[0_0_0_1px_hsl(var(--border)),0_0_24px_rgba(0,238,255,0.15)]">
        <SheetHeader>
          <SheetTitle>Add Vehicle</SheetTitle>
        </SheetHeader>

        <form action={createVehicle} className="mt-6 space-y-5">
          {/* Registration + Lookup */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs opacity-70 mb-1">Registration (VRN)</label>
              <input {...register("registration")} name="registration" className="w-full rounded bg-transparent border px-3 py-2" required />
            </div>
            <Button type="button" onClick={doLookup} disabled={loading} className="self-end">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span className="ml-2">Look Up</span>
            </Button>
          </div>

          {/* Necessary fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs opacity-70 mb-1">Make</label>
              <input {...register("make")} name="make" className="w-full rounded bg-transparent border px-3 py-2" required />
            </div>
            <div>
              <label className="block text-xs opacity-70 mb-1">Model</label>
              <input {...register("model")} name="model" className="w-full rounded bg-transparent border px-3 py-2" required />
            </div>

            <div>
              <label className="block text-xs opacity-70 mb-1">Year</label>
              <input {...register("year")} name="year" type="number" className="w-full rounded bg-transparent border px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs opacity-70 mb-1">Mileage</label>
              <input {...register("mileage")} name="mileage" type="number" className="w-full rounded bg-transparent border px-3 py-2" />
            </div>

            <div>
              <label className="block text-xs opacity-70 mb-1">Price (GBP)</label>
              <input {...register("price")} name="price" type="number" step="1" className="w-full rounded bg-transparent border px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs opacity-70 mb-1">Engine Capacity (cc)</label>
              <input {...register("engine_capacity")} name="engine_capacity" type="number" className="w-full rounded bg-transparent border px-3 py-2" />
            </div>

            <div>
              <label className="block text-xs opacity-70 mb-1">Fuel Type</label>
              <input {...register("fuel_type")} name="fuel_type" className="w-full rounded bg-transparent border px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs opacity-70 mb-1">CO₂ (g/km)</label>
              <input {...register("co2_emissions")} name="co2_emissions" type="number" className="w-full rounded bg-transparent border px-3 py-2" />
            </div>

            <div>
              <label className="block text-xs opacity-70 mb-1">Body Type</label>
              <input {...register("body_type")} name="body_type" className="w-full rounded bg-transparent border px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs opacity-70 mb-1">Transmission</label>
              <input {...register("transmission")} name="transmission" className="w-full rounded bg-transparent border px-3 py-2" />
            </div>

            <div className="col-span-2">
              <label className="block text-xs opacity-70 mb-1">Colour</label>
              <input {...register("colour")} name="colour" className="w-full rounded bg-transparent border px-3 py-2" />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("published")} name="published" />
            <span>Published</span>
          </label>

          <div className="flex gap-3">
            <Button className="px-4 py-2 border">Create</Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
