"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, X, Loader2 } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

interface VehicleData {
  registration?: string
  make?: string
  model?: string
  year?: number
  price?: number
  mileage?: number
  fuel_type?: string
  transmission?: string
  body_type?: string
  color?: string
  engine_size?: number
  description?: string
  features?: string[]
  image_url?: string
  status?: string
  bhp?: number
  torque?: number
  acceleration_0_60?: number
  top_speed?: number
  length_mm?: number
  width_mm?: number
  height_mm?: number
  wheelbase_mm?: number
  boot_capacity?: number
  seats?: number
  doors?: number
  kerb_weight?: number
  co2_emissions?: number
  mpg_combined?: number
  mpg_urban?: number
  mpg_extra_urban?: number
  insurance_group?: string
  drivetrain?: string
  gearbox?: string
  fuel_capacity?: number
}

export default function VehicleForm({
  initialData,
  isEditing = false,
  vehicleId,
}: { initialData?: VehicleData; isEditing?: boolean; vehicleId?: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [vehicleData, setVehicleData] = useState<VehicleData>(
    initialData || {
      features: [],
      status: "available",
    },
  )
  const [newFeature, setNewFeature] = useState("")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleRegistrationLookup = async () => {
    if (!vehicleData.registration) return

    setIsLookingUp(true)
    setLookupError(null)

    try {
      const response = await fetch("/api/vehicle-lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registration: vehicleData.registration,
        }),
      })

      const result = await response.json()

      if (result.success && result.data) {
        // Merge the lookup data with existing form data
        setVehicleData((prev) => ({
          ...prev,
          ...result.data,
          // Keep any manually entered data that wasn't returned by the API
          price: prev.price || result.data.price,
          mileage: prev.mileage || result.data.mileage,
          description: prev.description || result.data.description,
          image_url: prev.image_url || result.data.image_url,
        }))
      } else {
        setLookupError(result.error || "Failed to lookup vehicle details")
      }
    } catch (error) {
      console.error("Error looking up vehicle:", error)
      setLookupError("Failed to connect to vehicle lookup service")
    } finally {
      setIsLookingUp(false)
    }
  }

  const addFeature = () => {
    if (newFeature.trim() && !vehicleData.features?.includes(newFeature.trim())) {
      setVehicleData((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setVehicleData((prev) => ({
      ...prev,
      features: prev.features?.filter((f) => f !== feature) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEditing && vehicleId) {
        const { error } = await supabase.from("vehicles").update(vehicleData).eq("id", vehicleId)

        if (error) throw error
      } else {
        const { error } = await supabase.from("vehicles").insert([vehicleData])

        if (error) throw error
      }

      router.push("/admin/vehicles")
    } catch (error) {
      console.error("Error saving vehicle:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Registration Lookup */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Registration Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="registration">Registration Number</Label>
              <Input
                id="registration"
                value={vehicleData.registration || ""}
                onChange={(e) => {
                  setVehicleData((prev) => ({ ...prev, registration: e.target.value.toUpperCase() }))
                  setLookupError(null) // Clear error when user types
                }}
                placeholder="e.g. AB21 CDE"
                className="uppercase"
              />
              {lookupError && <p className="text-sm text-red-600 mt-1">{lookupError}</p>}
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleRegistrationLookup}
                disabled={!vehicleData.registration || isLookingUp}
              >
                {isLookingUp ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                Lookup
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Enter a UK registration number to automatically populate vehicle specifications. Try: BM21ABC, AU21XYZ, or
            MB21DEF for demo data.
          </p>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="make">Make</Label>
            <Input
              id="make"
              value={vehicleData.make || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, make: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={vehicleData.model || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, model: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={vehicleData.year || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, year: Number.parseInt(e.target.value) }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price (£)</Label>
            <Input
              id="price"
              type="number"
              value={vehicleData.price || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, price: Number.parseInt(e.target.value) }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="mileage">Mileage</Label>
            <Input
              id="mileage"
              type="number"
              value={vehicleData.mileage || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, mileage: Number.parseInt(e.target.value) }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={vehicleData.status}
              onValueChange={(value) => setVehicleData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Specifications</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="bhp">BHP</Label>
            <Input
              id="bhp"
              type="number"
              value={vehicleData.bhp || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, bhp: Number.parseInt(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="torque">Torque (Nm)</Label>
            <Input
              id="torque"
              type="number"
              value={vehicleData.torque || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, torque: Number.parseInt(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="acceleration_0_60">0-60 mph (seconds)</Label>
            <Input
              id="acceleration_0_60"
              type="number"
              step="0.1"
              value={vehicleData.acceleration_0_60 || ""}
              onChange={(e) =>
                setVehicleData((prev) => ({ ...prev, acceleration_0_60: Number.parseFloat(e.target.value) }))
              }
            />
          </div>
          <div>
            <Label htmlFor="seats">Seats</Label>
            <Input
              id="seats"
              type="number"
              value={vehicleData.seats || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, seats: Number.parseInt(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="doors">Doors</Label>
            <Input
              id="doors"
              type="number"
              value={vehicleData.doors || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, doors: Number.parseInt(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="mpg_combined">MPG Combined</Label>
            <Input
              id="mpg_combined"
              type="number"
              step="0.1"
              value={vehicleData.mpg_combined || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, mpg_combined: Number.parseFloat(e.target.value) }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-3">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
            />
            <Button type="button" onClick={addFeature}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {vehicleData.features?.map((feature, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {feature}
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(feature)} />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Description and Image */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={vehicleData.description || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              value={vehicleData.image_url || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {isEditing ? "Update Vehicle" : "Save Vehicle"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
