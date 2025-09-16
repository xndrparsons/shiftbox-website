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
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, X, Loader2, Database } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { DataTableSelector } from "./DataTableSelector"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

  dvla_registration_number?: string
  dvla_tax_status?: string
  dvla_tax_due_date?: string
  dvla_art_end_date?: string
  dvla_mot_status?: string
  dvla_mot_expiry_date?: string
  dvla_make?: string
  dvla_month_of_first_dvla_registration?: string
  dvla_month_of_first_registration?: string
  dvla_year_of_manufacture?: number
  dvla_engine_capacity?: number
  dvla_co2_emissions?: number
  dvla_fuel_type?: string
  dvla_marked_for_export?: boolean
  dvla_colour?: string
  dvla_type_approval?: string
  dvla_wheelplan?: string
  dvla_revenue_weight?: number
  dvla_real_driving_emissions?: number
  dvla_date_of_last_v5c_issued?: string
  dvla_euro_status?: string
  dvla_automated_vehicle?: boolean

  exterior_paintwork_condition?: string
  interior_condition?: string
  engine_condition?: string
  presence_of_rust?: boolean
  rust_locations?: string[]
  bodywork_damage?: string
  mechanical_issues?: string
  service_history_status?: string
  previous_owners?: number
  accident_history?: boolean
  accident_details?: string
  overall_condition_rating?: number
  condition_notes?: string
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

  const [isFetchingCCD, setIsFetchingCCD] = useState(false)
  const [ccdError, setCcdError] = useState<string | null>(null)
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [ccdDataFetched, setCcdDataFetched] = useState(false)

  const [vehicleData, setVehicleData] = useState<VehicleData>(
    initialData || {
      features: [],
      rust_locations: [],
      status: "available",
      presence_of_rust: false,
      accident_history: false,
      overall_condition_rating: 5,
    },
  )
  const [newFeature, setNewFeature] = useState("")
  const [newRustLocation, setNewRustLocation] = useState("")

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
        const dvlaData = result.data
        setVehicleData((prev) => ({
          ...prev,
          dvla_registration_number: dvlaData.registrationNumber,
          dvla_tax_status: dvlaData.taxStatus,
          dvla_tax_due_date: dvlaData.taxDueDate,
          dvla_art_end_date: dvlaData.artEndDate,
          dvla_mot_status: dvlaData.motStatus,
          dvla_mot_expiry_date: dvlaData.motExpiryDate,
          dvla_make: dvlaData.make,
          dvla_month_of_first_dvla_registration: dvlaData.monthOfFirstDvlaRegistration,
          dvla_month_of_first_registration: dvlaData.monthOfFirstRegistration,
          dvla_year_of_manufacture: dvlaData.yearOfManufacture,
          dvla_engine_capacity: dvlaData.engineCapacity,
          dvla_co2_emissions: dvlaData.co2Emissions,
          dvla_fuel_type: dvlaData.fuelType,
          dvla_marked_for_export: dvlaData.markedForExport,
          dvla_colour: dvlaData.colour,
          dvla_type_approval: dvlaData.typeApproval,
          dvla_wheelplan: dvlaData.wheelplan,
          dvla_revenue_weight: dvlaData.revenueWeight,
          dvla_real_driving_emissions: dvlaData.realDrivingEmissions,
          dvla_date_of_last_v5c_issued: dvlaData.dateOfLastV5CIssued,
          dvla_euro_status: dvlaData.euroStatus,
          dvla_automated_vehicle: dvlaData.automatedVehicle,

          // Also populate main vehicle fields if not already set
          make: prev.make || dvlaData.make,
          year: prev.year || dvlaData.yearOfManufacture,
          fuel_type: prev.fuel_type || dvlaData.fuelType?.toLowerCase(),
          color: prev.color || dvlaData.colour,
          co2_emissions: prev.co2_emissions || dvlaData.co2Emissions,
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

  const handleCheckCarDetailsLookup = async () => {
    if (!vehicleData.registration || selectedTables.length === 0) return

    setIsFetchingCCD(true)
    setCcdError(null)

    try {
      const response = await fetch("/api/checkcardetails-lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registration: vehicleData.registration,
          tables: selectedTables,
        }),
      })

      const result = await response.json()

      if (result.success && result.data) {
        // Store the fetched data immediately in the database
        const { error: saveError } = await supabase.from("vehicles").upsert(
          {
            registration: vehicleData.registration,
            ...result.mappedData,
            ccd_fetch_cost: result.cost,
          },
          {
            onConflict: "registration",
          },
        )

        if (saveError) {
          console.error("Error saving CheckCarDetails data:", saveError)
          setCcdError("Failed to save fetched data")
          return
        }

        // Update the form with the fetched data
        setVehicleData((prev) => ({
          ...prev,
          ...result.mappedData,
        }))

        setCcdDataFetched(true)
        setSelectedTables([]) // Clear selection after successful fetch
      } else {
        setCcdError(result.error || "Failed to fetch vehicle data")
      }
    } catch (error) {
      console.error("Error fetching CheckCarDetails data:", error)
      setCcdError("Failed to connect to CheckCarDetails service")
    } finally {
      setIsFetchingCCD(false)
    }
  }

  const handleDataTableSelectionChange = (tables: string[], cost: number) => {
    setSelectedTables(tables)
    setEstimatedCost(cost)
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

  const addRustLocation = () => {
    if (newRustLocation.trim() && !vehicleData.rust_locations?.includes(newRustLocation.trim())) {
      setVehicleData((prev) => ({
        ...prev,
        rust_locations: [...(prev.rust_locations || []), newRustLocation.trim()],
      }))
      setNewRustLocation("")
    }
  }

  const removeRustLocation = (location: string) => {
    setVehicleData((prev) => ({
      ...prev,
      rust_locations: prev.rust_locations?.filter((l) => l !== location) || [],
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
                  setCcdError(null) // Clear CCD error too
                  setCcdDataFetched(false) // Reset CCD fetch status
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
                DVLA Lookup
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Enter a UK registration number to automatically populate vehicle specifications from DVLA records.
          </p>
        </CardContent>
      </Card>

      {vehicleData.registration && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Enhanced Vehicle Data (CheckCarDetails)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DataTableSelector
              onSelectionChange={handleDataTableSelectionChange}
              disabled={isFetchingCCD || ccdDataFetched}
              initialSelection={selectedTables}
            />

            {selectedTables.length > 0 && !ccdDataFetched && (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Ready to fetch enhanced data</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedTables.length} table{selectedTables.length !== 1 ? "s" : ""} selected • Estimated cost: £
                    {estimatedCost.toFixed(2)}
                  </p>
                </div>
                <Button type="button" onClick={handleCheckCarDetailsLookup} disabled={isFetchingCCD}>
                  {isFetchingCCD ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Database className="h-4 w-4 mr-2" />
                  )}
                  Fetch Data
                </Button>
              </div>
            )}

            {ccdDataFetched && (
              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  Enhanced vehicle data has been fetched and saved. Cost: £{estimatedCost.toFixed(2)}
                </AlertDescription>
              </Alert>
            )}

            {ccdError && (
              <Alert variant="destructive">
                <AlertDescription>{ccdError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {vehicleData.dvla_registration_number && (
        <Card>
          <CardHeader>
            <CardTitle>DVLA Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Tax Status</Label>
              <p className="text-sm font-medium">{vehicleData.dvla_tax_status || "N/A"}</p>
            </div>
            <div>
              <Label>MOT Status</Label>
              <p className="text-sm font-medium">{vehicleData.dvla_mot_status || "N/A"}</p>
            </div>
            <div>
              <Label>MOT Expiry</Label>
              <p className="text-sm font-medium">{vehicleData.dvla_mot_expiry_date || "N/A"}</p>
            </div>
            <div>
              <Label>Engine Capacity</Label>
              <p className="text-sm font-medium">
                {vehicleData.dvla_engine_capacity ? `${vehicleData.dvla_engine_capacity}cc` : "N/A"}
              </p>
            </div>
            <div>
              <Label>Euro Status</Label>
              <p className="text-sm font-medium">{vehicleData.dvla_euro_status || "N/A"}</p>
            </div>
            <div>
              <Label>DVLA Colour</Label>
              <p className="text-sm font-medium">{vehicleData.dvla_colour || "N/A"}</p>
            </div>
            <div>
              <Label>Type Approval</Label>
              <p className="text-sm font-medium">{vehicleData.dvla_type_approval || "N/A"}</p>
            </div>
            <div>
              <Label>Revenue Weight</Label>
              <p className="text-sm font-medium">
                {vehicleData.dvla_revenue_weight ? `${vehicleData.dvla_revenue_weight}kg` : "N/A"}
              </p>
            </div>
            <div>
              <Label>Automated Vehicle</Label>
              <p className="text-sm font-medium">{vehicleData.dvla_automated_vehicle ? "Yes" : "No"}</p>
            </div>
          </CardContent>
        </Card>
      )}

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

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Condition Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="exterior_paintwork_condition">Exterior Paintwork Condition</Label>
              <Select
                value={vehicleData.exterior_paintwork_condition}
                onValueChange={(value) => setVehicleData((prev) => ({ ...prev, exterior_paintwork_condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="very good">Very Good</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="interior_condition">Interior Condition</Label>
              <Select
                value={vehicleData.interior_condition}
                onValueChange={(value) => setVehicleData((prev) => ({ ...prev, interior_condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="very good">Very Good</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="engine_condition">Engine Condition</Label>
              <Select
                value={vehicleData.engine_condition}
                onValueChange={(value) => setVehicleData((prev) => ({ ...prev, engine_condition: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="very good">Very Good</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="service_history_status">Service History</Label>
              <Select
                value={vehicleData.service_history_status}
                onValueChange={(value) => setVehicleData((prev) => ({ ...prev, service_history_status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full service history">Full Service History</SelectItem>
                  <SelectItem value="partial service history">Partial Service History</SelectItem>
                  <SelectItem value="no service history">No Service History</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="previous_owners">Previous Owners</Label>
              <Input
                id="previous_owners"
                type="number"
                min="0"
                value={vehicleData.previous_owners || ""}
                onChange={(e) =>
                  setVehicleData((prev) => ({ ...prev, previous_owners: Number.parseInt(e.target.value) }))
                }
              />
            </div>

            <div>
              <Label htmlFor="overall_condition_rating">Overall Condition Rating (1-5)</Label>
              <Select
                value={vehicleData.overall_condition_rating?.toString()}
                onValueChange={(value) =>
                  setVehicleData((prev) => ({ ...prev, overall_condition_rating: Number.parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                  <SelectItem value="4">4 - Very Good</SelectItem>
                  <SelectItem value="3">3 - Good</SelectItem>
                  <SelectItem value="2">2 - Fair</SelectItem>
                  <SelectItem value="1">1 - Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rust Assessment */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="presence_of_rust"
                checked={vehicleData.presence_of_rust}
                onCheckedChange={(checked) =>
                  setVehicleData((prev) => ({
                    ...prev,
                    presence_of_rust: checked as boolean,
                    rust_locations: checked ? prev.rust_locations : [],
                  }))
                }
              />
              <Label htmlFor="presence_of_rust">Presence of Rust</Label>
            </div>

            {vehicleData.presence_of_rust && (
              <div>
                <Label>Rust Locations</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newRustLocation}
                    onChange={(e) => setNewRustLocation(e.target.value)}
                    placeholder="e.g. Rear wheel arch, Door sill"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRustLocation())}
                  />
                  <Button type="button" onClick={addRustLocation}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vehicleData.rust_locations?.map((location, index) => (
                    <Badge key={index} variant="destructive" className="flex items-center gap-1">
                      {location}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeRustLocation(location)} />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Accident History */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="accident_history"
                checked={vehicleData.accident_history}
                onCheckedChange={(checked) =>
                  setVehicleData((prev) => ({
                    ...prev,
                    accident_history: checked as boolean,
                    accident_details: checked ? prev.accident_details : "",
                  }))
                }
              />
              <Label htmlFor="accident_history">Previous Accident History</Label>
            </div>

            {vehicleData.accident_history && (
              <div>
                <Label htmlFor="accident_details">Accident Details</Label>
                <Textarea
                  id="accident_details"
                  value={vehicleData.accident_details || ""}
                  onChange={(e) => setVehicleData((prev) => ({ ...prev, accident_details: e.target.value }))}
                  placeholder="Describe any previous accidents or damage..."
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Additional Condition Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bodywork_damage">Bodywork Damage</Label>
              <Textarea
                id="bodywork_damage"
                value={vehicleData.bodywork_damage || ""}
                onChange={(e) => setVehicleData((prev) => ({ ...prev, bodywork_damage: e.target.value }))}
                placeholder="Describe any scratches, dents, or bodywork issues..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="mechanical_issues">Mechanical Issues</Label>
              <Textarea
                id="mechanical_issues"
                value={vehicleData.mechanical_issues || ""}
                onChange={(e) => setVehicleData((prev) => ({ ...prev, mechanical_issues: e.target.value }))}
                placeholder="Describe any known mechanical problems..."
                rows={3}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="condition_notes">Additional Condition Notes</Label>
            <Textarea
              id="condition_notes"
              value={vehicleData.condition_notes || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, condition_notes: e.target.value }))}
              placeholder="Any additional notes about the vehicle's condition..."
              rows={3}
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
