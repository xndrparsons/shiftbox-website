"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

type Props = {
  makes?: string[]
  fuels?: string[]
  transmissions?: string[]
  minPrice?: number
  maxPrice?: number
}

function useDebouncedCallback<T extends (...args: any[]) => void>(fn: T, delay = 400) {
  const ref = React.useRef<number | undefined>(undefined)
  return React.useCallback((...args: any[]) => {
    if (ref.current) window.clearTimeout(ref.current)
    ref.current = window.setTimeout(() => fn(...args), delay)
  }, [fn, delay]) as T
}

export default function VehicleFilters({
  makes = [],
  fuels = ["Petrol","Diesel","Hybrid","Electric"],
  transmissions = ["Manual","Automatic","Semi-Auto"],
  minPrice = 0,
  maxPrice = 50000,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const make = searchParams.get("make") ?? ""
  const model = searchParams.get("model") ?? ""
  const fuel = searchParams.get("fuel") ?? ""
  const trans = searchParams.get("trans") ?? ""
  const minP = Number(searchParams.get("minPrice") ?? minPrice)
  const maxP = Number(searchParams.get("maxPrice") ?? maxPrice)

  const [price, setPrice] = React.useState<[number, number]>([minP, maxP])

  React.useEffect(() => setPrice([minP, maxP]), [minP, maxP])

  const update = React.useCallback((next: Record<string, string | number | null>) => {
    const sp = new URLSearchParams(searchParams.toString())
    Object.entries(next).forEach(([k, v]) => {
      if (v === null || v === "" || (typeof v === "number" && Number.isNaN(v))) sp.delete(k)
      else sp.set(k, String(v))
    })
    sp.set("page", "1") // reset pagination when filters change
    router.push(`${pathname}?${sp.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  const onModelChange = useDebouncedCallback((val: string) => update({ model: val || null }), 400)

  return (
    <div className="rounded-xl border bg-card p-4 lg:p-5">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Make */}
        <div className="space-y-1.5">
          <Label>Make</Label>
          <Select value={make} onValueChange={(v) => update({ make: v || null })}>
            <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              {makes.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        {/* Model (free text) */}
        <div className="space-y-1.5">
          <Label>Model</Label>
          <Input
            defaultValue={model}
            placeholder="e.g. Fiesta"
            onChange={(e) => onModelChange(e.target.value)}
          />
        </div>

        {/* Fuel */}
        <div className="space-y-1.5">
          <Label>Fuel</Label>
          <Select value={fuel} onValueChange={(v) => update({ fuel: v || null })}>
            <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              {fuels.map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        {/* Transmission */}
        <div className="space-y-1.5">
          <Label>Transmission</Label>
          <Select value={trans} onValueChange={(v) => update({ trans: v || null })}>
            <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              {transmissions.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        {/* Price range */}
        <div className={cn("space-y-2 md:col-span-2 lg:col-span-4")}>
          <div className="flex items-center justify-between">
            <Label>Price</Label>
            <div className="text-sm text-muted-foreground">£{price[0].toLocaleString()} – £{price[1].toLocaleString()}</div>
          </div>
          <Slider
            value={price}
            min={minPrice}
            max={maxPrice}
            step={250}
            onValueChange={(v) => setPrice([v[0], v[1]] as [number,number])}
            onValueCommit={(v) => update({ minPrice: v[0], maxPrice: v[1] })}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <Button variant="outline" onClick={() => router.push(pathname)}>Reset</Button>
      </div>
    </div>
  )
}
