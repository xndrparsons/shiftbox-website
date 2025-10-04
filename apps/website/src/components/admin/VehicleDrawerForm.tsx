"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { createVehicle } from "@/app/(admin)/admin/vehicles/actions";

const Schema = z.object({
  make: z.string().min(2, "Required"),
  model: z.string().min(1, "Required"),
  registration: z.string().min(3, "Required"),
  price: z.string().optional(),
});
type FormVals = z.infer<typeof Schema>;

export default function VehicleDrawerForm() {
  const [open, setOpen] = React.useState(false);
  const submitBtnRef = React.useRef<HTMLButtonElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormVals>({
    resolver: zodResolver(Schema),
  });

  const onValid = () => {
    // Let the server action run via the submit button’s formAction
    submitBtnRef.current?.click();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="px-3 py-2 rounded bg-white/10 hover:bg-white/15 border">Add Vehicle</Button>
      </SheetTrigger>
      <SheetContent side="right" className="backdrop-blur-md border-l border-white/10">
        <SheetHeader>
          <SheetTitle>Add Vehicle</SheetTitle>
        </SheetHeader>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onValid)}>
          <div className="space-y-1">
            <label className="text-xs opacity-70">Make</label>
            <input {...register("make")} className="w-full rounded bg-transparent border px-3 py-2" />
            {errors.make && <p className="text-xs text-red-400">{errors.make.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs opacity-70">Model</label>
            <input {...register("model")} className="w-full rounded bg-transparent border px-3 py-2" />
            {errors.model && <p className="text-xs text-red-400">{errors.model.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs opacity-70">Registration</label>
            <input {...register("registration")} className="w-full rounded bg-transparent border px-3 py-2" />
            {errors.registration && <p className="text-xs text-red-400">{errors.registration.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs opacity-70">Price (GBP)</label>
            <input {...register("price")} type="number" step="1" className="w-full rounded bg-transparent border px-3 py-2" />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting} className="border">
              {isSubmitting ? "Saving…" : "Create"}
            </Button>
            {/* This hidden button actually triggers the Server Action */}
            <button ref={submitBtnRef} type="submit" formAction={createVehicle} className="hidden" />
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
