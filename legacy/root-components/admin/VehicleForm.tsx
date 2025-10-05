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
import { Search, Plus, X, Loader2, Database } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { DataTableSelector } from "./DataTableSelector"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCarDetailsDisplay } from "./CheckCarDetailsDisplay"
import { FieldToggleSystem, BulkFieldToggle } from "./FieldToggleSystem"

interface VehicleData {
  id?: string
  make?: string
  model?: string
  year?: number
  price?: number
  mileage?: number
  registration?: string
  fuel_type?: string
  transmission?: string
  body_type?: string
  color?: string
  doors?: number
  seats?: number
  engine_size?: string
  bhp?: number
  torque?: number
  acceleration_0_60?: number
  top_speed?: number
  mpg_combined?: number
  mpg_urban?: number
  mpg_extra_urban?: number
  co2_emissions?: number
  fuel_capacity?: number
  kerb_weight?: number
  boot_capacity?: number
  length_mm?: number
  width_mm?: number
  height_mm?: number
  wheelbase_mm?: number
  insurance_group?: string
  drivetrain?: string
  gearbox?: string
  images?: string[]
  description?: string
  features?: string[]
  status?: string
  // overall_condition_rating?: number
  // DVLA fields (lowercase to match database schema)
  dvla_registrationnumber?: string
  dvla_taxstatus?: string
  dvla_taxduedate?: string
  dvla_motstatus?: string
  dvla_motexpirydate?: string
  dvla_make?: string
  dvla_monthoffirstregistration?: string
  dvla_yearofmanufacture?: number
  dvla_enginecapacity?: number
  dvla_co2emissions?: number
  dvla_fueltype?: string
  dvla_markedforexport?: boolean
  dvla_colour?: string
  dvla_typeapproval?: string
  dvla_wheelplan?: string
  dvla_revenueweight?: number
  dvla_realdrivingemissions?: string
  dvla_dateoflastv5cissued?: string
  dvla_eurostatus?: string
  dvla_automatedvehicle?: boolean

  // Formatted display fields
  body_type_formatted?: string
  first_registered_formatted?: string
  gearbox_formatted?: string
  emission_class?: string

  // exterior_paintwork_condition?: string
  // interior_condition?: string
  // engine_condition?: string
  // presence_of_rust?: boolean
  // rust_locations?: string[]
  // bodywork_damage?: string
  // mechanical_issues?: string
  // service_history_status?: string
  // previous_owners?: number
  // overall_condition_rating?: number
  // condition_notes?: string

  // CheckCarDetails fields
  ccd_tables_fetched?: string[]
  ccd_last_fetched?: string
  ccd_fetch_cost?: number
  ccd_mot_status?: string
  ccd_mot_test_result?: string
  ccd_mot_test_number?: string
  ccd_vehicle_class?: string
  ccd_vin?: string
  ccd_engine_number?: string
  ccd_make_model?: string
  ccd_mot_expiry_date?: string
  ccd_mot_test_date?: string
  ccd_mot_test_mileage?: number
  ccd_current_mileage?: number
  ccd_mileage_history?: any
  ccd_average_annual_mileage?: number
  ccd_engine_power?: number
  ccd_max_speed?: number
  ccd_acceleration?: number
  ccd_fuel_consumption?: any // Assuming this can be an object
  ccd_dimensions?: any
  ccd_weight?: number
  ccd_trade_value?: number
  ccd_retail_value?: number
  ccd_private_value?: number
  ccd_valuation_date?: string
  ccd_date_of_last_update?: string
  ccd_date_first_registered?: string
  ccd_date_first_registered_uk?: string
  ccd_engine_capacity?: number
  image_url?: string // Added for image upload
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
  const [ccdRawData, setCcdRawData] = useState<any>(null)

  const [vehicleData, setVehicleData] = useState<VehicleData>(
    initialData || {
      features: [],
      status: "available",
      // overall_condition_rating: 5,
    },
  )
  const [newFeature, setNewFeature] = useState("")
  const [checkCarDetailsError, setCheckCarDetailsError] = useState<string | null>(null)

  const supabase = createClient()

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
        console.log("[v0] DVLA data received:", Object.keys(dvlaData))

        setVehicleData((prev) => ({
          ...prev,
          // Store DVLA data with exact field names from API
          dvla_registrationnumber: dvlaData.registrationNumber,
          dvla_taxstatus: dvlaData.taxStatus,
          dvla_taxduedate: dvlaData.taxDueDate,
          dvla_motstatus: dvlaData.motStatus,
          dvla_motexpirydate: dvlaData.motExpiryDate,
          dvla_make: dvlaData.make,
          dvla_monthoffirstregistration: dvlaData.monthOfFirstRegistration,
          dvla_yearofmanufacture: dvlaData.yearOfManufacture,
          dvla_enginecapacity: dvlaData.engineCapacity,
          dvla_co2emissions: dvlaData.co2Emissions,
          dvla_fueltype: dvlaData.fuelType,
          dvla_markedforexport: dvlaData.markedForExport,
          dvla_colour: dvlaData.colour,
          dvla_typeapproval: dvlaData.typeApproval,
          dvla_wheelplan: dvlaData.wheelplan,
          dvla_revenueweight: dvlaData.revenueWeight,
          dvla_realdrivingemissions: dvlaData.realDrivingEmissions,
          dvla_dateoflastv5cissued: dvlaData.dateOfLastV5CIssued,
          dvla_eurostatus: dvlaData.euroStatus,
          dvla_automatedvehicle: dvlaData.automatedVehicle,

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
    if (!vehicleData.registration) {
      setCheckCarDetailsError("Please enter a registration number first")
      return
    }

    if (selectedTables.length === 0) {
      setCheckCarDetailsError("Please select at least one data table")
      return
    }

    setIsFetchingCCD(true)
    setCcdError(null)

    try {
      const response = await fetch("/api/checkcardetails-lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registration: vehicleData.registration.toUpperCase(),
          tables: selectedTables,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch CheckCarDetails data")
      }

      if (result.success && result.data) {
        const ccdData = result.data
        console.log("[v0] CheckCarDetails data received:", Object.keys(ccdData))

        // Map the complex JSON structure to our flat column structure
        setVehicleData((prev) => ({
          ...prev,
          // Store the fetched tables and metadata
          ccd_tables_fetched: ccdData.ccd_tables_fetched,
          ccd_last_fetched: ccdData.ccd_last_fetched,
          ccd_fetch_cost: ccdData.ccd_fetch_cost,

          // Map specific data to existing columns
          ccd_vin: ccdData.vehiclespecs?.VehicleIdentification?.Vin,
          ccd_engine_number: ccdData.vehiclespecs?.VehicleIdentification?.EngineNumber,
          ccd_make_model:
            `${ccdData.vehicleregistration?.make || ""} ${ccdData.vehicleregistration?.model || ""}`.trim(),
          ccd_engine_capacity:
            ccdData.vehicleregistration?.engineCapacity || ccdData.vehiclespecs?.EngineDetails?.EngineCapacity,
          ccd_current_mileage: ccdData.mileage?.summary?.lastRecordedMileage
            ? Number.parseInt(ccdData.mileage.summary.lastRecordedMileage.replace(/,/g, ""))
            : undefined,
          ccd_mileage_history: ccdData.mileage?.mileage,
          ccd_average_annual_mileage: ccdData.mileage?.summary?.averageMileage,
          ccd_dimensions: ccdData.vehiclespecs?.Dimensions,
          ccd_weight: ccdData.vehiclespecs?.Weights?.KerbWeightKg,
          ccd_trade_value: ccdData.vehiclevaluation?.ValuationList?.TradeRetail
            ? Number.parseFloat(ccdData.vehiclevaluation.ValuationList.TradeRetail)
            : undefined,
          ccd_retail_value: ccdData.vehiclevaluation?.ValuationList?.DealerForecourt
            ? Number.parseFloat(ccdData.vehiclevaluation.ValuationList.DealerForecourt)
            : undefined,
          ccd_private_value: ccdData.vehiclevaluation?.ValuationList?.PrivateClean
            ? Number.parseFloat(ccdData.vehiclevaluation.ValuationList.PrivateClean)
            : undefined,
          ccd_date_first_registered: ccdData.vehiclespecs?.VehicleIdentification?.DateFirstRegistered
            ? new Date(ccdData.vehiclespecs.VehicleIdentification.DateFirstRegistered).toISOString().split("T")[0]
            : undefined,
          ccd_date_first_registered_uk: ccdData.vehiclespecs?.VehicleIdentification?.DateFirstRegisteredInUk
            ? new Date(ccdData.vehiclespecs.VehicleIdentification.DateFirstRegisteredInUk).toISOString().split("T")[0]
            : undefined,

          // MOT related data
          ccd_mot_status: ccdData.vehicleregistration?.mot?.motStatus || ccdData.mot?.mot?.motStatus,
          ccd_mot_expiry_date: ccdData.vehicleregistration?.mot?.motDueDate
            ? new Date(ccdData.vehicleregistration.mot.motDueDate).toISOString().split("T")[0]
            : undefined,

          // Also populate main vehicle fields if not already set
          make: prev.make || ccdData.vehicleregistration?.make || ccdData.vehiclespecs?.ModelData?.Make,
          model: prev.model || ccdData.vehicleregistration?.model || ccdData.vehiclespecs?.ModelData?.Model,
          year: prev.year || ccdData.vehicleregistration?.yearOfManufacture,
          fuel_type: prev.fuel_type || ccdData.vehicleregistration?.fuelType?.toLowerCase(),
          color: prev.color || ccdData.vehicleregistration?.colour,
          co2_emissions: prev.co2_emissions || ccdData.vehicleregistration?.co2Emissions,
          mileage:
            prev.mileage ||
            (ccdData.mileage?.summary?.lastRecordedMileage
              ? Number.parseInt(ccdData.mileage.summary.lastRecordedMileage.replace(/,/g, ""))
              : undefined),
          doors: prev.doors || ccdData.vehiclespecs?.BodyDetails?.NumberOfDoors,
          seats: prev.seats || ccdData.vehiclespecs?.BodyDetails?.NumberOfSeats,
          length_mm: prev.length_mm || ccdData.vehiclespecs?.Dimensions?.LengthMm,
          width_mm: prev.width_mm || ccdData.vehiclespecs?.Dimensions?.WidthMm,
          height_mm: prev.height_mm || ccdData.vehiclespecs?.Dimensions?.HeightMm,
          kerb_weight: prev.kerb_weight || ccdData.vehiclespecs?.Weights?.KerbWeightKg,
        }))
        setCcdDataFetched(true) // Mark data as fetched
        setCcdRawData(ccdData) // Store raw data for debugging
      } else {
        throw new Error("No data returned from CheckCarDetails API")
      }
    } catch (error) {
      console.error("CheckCarDetails lookup error:", error)
      setCcdError(error instanceof Error ? error.message : "Failed to fetch CheckCarDetails data")
    } finally {
      setIsFetchingCCD(false)
    }
  }

  const handleDataTableSelectionChange = (tables: string[], cost: number) => {
    setSelectedTables(tables)
    setEstimatedCost(cost)
    // Clear CCD error and fetched status when selection changes
    setCcdError(null)
    setCcdDataFetched(false)
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

  // Removed addRustLocation and removeRustLocation as they are no longer needed

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
                  setSelectedTables([]) // Clear selected tables on new registration
                  setEstimatedCost(0) // Reset estimated cost
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

      {(vehicleData.dvla_registrationnumber ||
        vehicleData.dvla_taxstatus ||
        vehicleData.dvla_taxduedate ||
        vehicleData.dvla_motstatus ||
        vehicleData.dvla_motexpirydate ||
        vehicleData.dvla_make ||
        vehicleData.dvla_yearofmanufacture ||
        vehicleData.dvla_enginecapacity ||
        vehicleData.dvla_co2emissions ||
        vehicleData.dvla_fueltype ||
        vehicleData.dvla_markedforexport ||
        vehicleData.dvla_colour ||
        vehicleData.dvla_typeapproval ||
        vehicleData.dvla_revenueweight ||
        vehicleData.dvla_dateoflastv5cissued ||
        vehicleData.dvla_wheelplan ||
        vehicleData.dvla_monthoffirstregistration ||
        vehicleData.dvla_eurostatus ||
        vehicleData.dvla_automatedvehicle ||
        vehicleData.dvla_realdrivingemissions) && (
        <>
          <BulkFieldToggle
            vehicleId={vehicleId || ""}
            category="dvla"
            fields={[
              {
                fieldName: "dvla_registrationnumber",
                displayName: "Registration Number",
                hasValue: !!vehicleData.dvla_registrationnumber,
              },
              { fieldName: "dvla_taxstatus", displayName: "Tax Status", hasValue: !!vehicleData.dvla_taxstatus },
              { fieldName: "dvla_taxduedate", displayName: "Tax Due Date", hasValue: !!vehicleData.dvla_taxduedate },
              { fieldName: "dvla_motstatus", displayName: "MOT Status", hasValue: !!vehicleData.dvla_motstatus },
              {
                fieldName: "dvla_motexpirydate",
                displayName: "MOT Expiry Date",
                hasValue: !!vehicleData.dvla_motexpirydate,
              },
              { fieldName: "dvla_make", displayName: "Make", hasValue: !!vehicleData.dvla_make },
              {
                fieldName: "dvla_yearofmanufacture",
                displayName: "Year of Manufacture",
                hasValue: !!vehicleData.dvla_yearofmanufacture,
              },
              {
                fieldName: "dvla_enginecapacity",
                displayName: "Engine Capacity",
                hasValue: !!vehicleData.dvla_enginecapacity,
              },
              {
                fieldName: "dvla_co2emissions",
                displayName: "CO2 Emissions",
                hasValue: !!vehicleData.dvla_co2emissions,
              },
              { fieldName: "dvla_fueltype", displayName: "Fuel Type", hasValue: !!vehicleData.dvla_fueltype },
              {
                fieldName: "dvla_markedforexport",
                displayName: "Marked for Export",
                hasValue: vehicleData.dvla_markedforexport !== undefined,
              },
              { fieldName: "dvla_colour", displayName: "Colour", hasValue: !!vehicleData.dvla_colour },
              {
                fieldName: "dvla_typeapproval",
                displayName: "Type Approval",
                hasValue: !!vehicleData.dvla_typeapproval,
              },
              {
                fieldName: "dvla_revenueweight",
                displayName: "Revenue Weight",
                hasValue: !!vehicleData.dvla_revenueweight,
              },
              {
                fieldName: "dvla_dateoflastv5cissued",
                displayName: "Date of Last V5C Issued",
                hasValue: !!vehicleData.dvla_dateoflastv5cissued,
              },
              { fieldName: "dvla_wheelplan", displayName: "Wheelplan", hasValue: !!vehicleData.dvla_wheelplan },
              {
                fieldName: "dvla_monthoffirstregistration",
                displayName: "Month of First Registration",
                hasValue: !!vehicleData.dvla_monthoffirstregistration,
              },
              { fieldName: "dvla_eurostatus", displayName: "Euro Status", hasValue: !!vehicleData.dvla_eurostatus },
              {
                fieldName: "dvla_automatedvehicle",
                displayName: "Automated Vehicle",
                hasValue: vehicleData.dvla_automatedvehicle !== undefined,
              },
              {
                fieldName: "dvla_realdrivingemissions",
                displayName: "Real Driving Emissions",
                hasValue: !!vehicleData.dvla_realdrivingemissions,
              },
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle>DVLA Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_registrationnumber"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_registrationnumber}
                defaultDisplayName="Registration Number"
              >
                <div>
                  <Label>Registration Number</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_registrationnumber || "N/A"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_taxstatus"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_taxstatus}
                defaultDisplayName="Tax Status"
              >
                <div>
                  <Label>Tax Status</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_taxstatus || "N/A"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_taxduedate"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_taxduedate}
                defaultDisplayName="Tax Due Date"
              >
                <div>
                  <Label>Tax Due Date</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_taxduedate || "N/A"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_motstatus"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_motstatus}
                defaultDisplayName="MOT Status"
              >
                <div>
                  <Label>MOT Status</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_motstatus || "N/A"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_motexpirydate"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_motexpirydate}
                defaultDisplayName="MOT Expiry Date"
              >
                <div>
                  <Label>MOT Expiry Date</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_motexpirydate || "N/A"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_make"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_make}
                defaultDisplayName="Make"
              >
                <div>
                  <Label>Make</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_make || "N/A"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_yearofmanufacture"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_yearofmanufacture}
                defaultDisplayName="Year of Manufacture"
              >
                <div>
                  <Label>Year of Manufacture</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_yearofmanufacture || "N/A"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_enginecapacity"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_enginecapacity}
                defaultDisplayName="Engine Capacity"
              >
                <div>
                  <Label>Engine Capacity</Label>
                  <p className="text-sm font-medium">
                    {vehicleData.dvla_enginecapacity ? `${vehicleData.dvla_enginecapacity}cc` : "N/A"}
                  </p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_co2emissions"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_co2emissions}
                defaultDisplayName="CO2 Emissions"
              >
                <div>
                  <Label>CO2 Emissions</Label>
                  <p className="text-sm font-medium">
                    {vehicleData.dvla_co2emissions ? `${vehicleData.dvla_co2emissions}g/km` : "N/A"}
                  </p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_fueltype"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_fueltype}
                defaultDisplayName="Fuel Type"
              >
                <div>
                  <Label>Fuel Type</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_fueltype || "N/A"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_markedforexport"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_markedforexport}
                defaultDisplayName="Marked for Export"
              >
                <div>
                  <Label>Marked for Export</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_markedforexport ? "Yes" : "No"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_colour"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_colour}
                defaultDisplayName="Colour"
              >
                <div>
                  <Label>Colour</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_colour || "N/A"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_typeapproval"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_typeapproval}
                defaultDisplayName="Type Approval"
              >
                <div>
                  <Label>Type Approval</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_typeapproval || "N/A"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_revenueweight"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_revenueweight}
                defaultDisplayName="Revenue Weight"
              >
                <div>
                  <Label>Revenue Weight</Label>
                  <p className="text-sm font-medium">
                    {vehicleData.dvla_revenueweight ? `${vehicleData.dvla_revenueweight}kg` : "N/A"}
                  </p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_dateoflastv5cissued"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_dateoflastv5cissued}
                defaultDisplayName="Date of Last V5C Issued"
              >
                <div>
                  <Label>Date of Last V5C Issued</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_dateoflastv5cissued || "N/A"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_wheelplan"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_wheelplan}
                defaultDisplayName="Wheelplan"
              >
                <div>
                  <Label>Wheelplan</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_wheelplan || "N/A"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_monthoffirstregistration"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_monthoffirstregistration}
                defaultDisplayName="Month of First Registration"
              >
                <div>
                  <Label>Month of First Registration</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_monthoffirstregistration || "N/A"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_eurostatus"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_eurostatus}
                defaultDisplayName="Euro Status"
              >
                <div>
                  <Label>Euro Status</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_eurostatus || "N/A"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_automatedvehicle"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_automatedvehicle}
                defaultDisplayName="Automated Vehicle"
              >
                <div>
                  <Label>Automated Vehicle</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_automatedvehicle ? "Yes" : "No"}</p>
                </div>
              </FieldToggleSystem>

              <FieldToggleSystem
                vehicleId={vehicleId || ""}
                fieldName="dvla_realdrivingemissions"
                fieldCategory="dvla"
                currentValue={vehicleData.dvla_realdrivingemissions}
                defaultDisplayName="Real Driving Emissions"
              >
                <div>
                  <Label>Real Driving Emissions</Label>
                  <p className="text-sm font-medium">{vehicleData.dvla_realdrivingemissions || "N/A"}</p>
                </div>
              </FieldToggleSystem>
            </CardContent>
          </Card>
        </>
      )}

      {(vehicleData.ccd_vin ||
        vehicleData.ccd_engine_number ||
        vehicleData.ccd_make_model ||
        vehicleData.ccd_mot_status ||
        vehicleData.ccd_mot_expiry_date ||
        vehicleData.ccd_current_mileage ||
        vehicleData.ccd_mileage_history ||
        vehicleData.ccd_average_annual_mileage ||
        vehicleData.ccd_dimensions ||
        vehicleData.ccd_weight ||
        vehicleData.ccd_trade_value ||
        vehicleData.ccd_retail_value ||
        vehicleData.ccd_private_value ||
        vehicleData.ccd_date_first_registered ||
        vehicleData.ccd_date_first_registered_uk) && (
        <>
          <BulkFieldToggle
            vehicleId={vehicleId || ""}
            category="checkcardetails"
            fields={[
              { fieldName: "ccd_vin", displayName: "VIN", hasValue: !!vehicleData.ccd_vin },
              {
                fieldName: "ccd_engine_number",
                displayName: "Engine Number",
                hasValue: !!vehicleData.ccd_engine_number,
              },
              { fieldName: "ccd_make_model", displayName: "Make & Model", hasValue: !!vehicleData.ccd_make_model },
              { fieldName: "ccd_mot_status", displayName: "MOT Status", hasValue: !!vehicleData.ccd_mot_status },
              {
                fieldName: "ccd_mot_expiry_date",
                displayName: "MOT Expiry Date",
                hasValue: !!vehicleData.ccd_mot_expiry_date,
              },
              {
                fieldName: "ccd_current_mileage",
                displayName: "Current Mileage",
                hasValue: !!vehicleData.ccd_current_mileage,
              },
              {
                fieldName: "ccd_average_annual_mileage",
                displayName: "Average Annual Mileage",
                hasValue: !!vehicleData.ccd_average_annual_mileage,
              },
              { fieldName: "ccd_weight", displayName: "Kerb Weight", hasValue: !!vehicleData.ccd_weight },
              { fieldName: "ccd_trade_value", displayName: "Trade Value", hasValue: !!vehicleData.ccd_trade_value },
              { fieldName: "ccd_retail_value", displayName: "Retail Value", hasValue: !!vehicleData.ccd_retail_value },
              {
                fieldName: "ccd_private_value",
                displayName: "Private Value",
                hasValue: !!vehicleData.ccd_private_value,
              },
              {
                fieldName: "ccd_date_first_registered",
                displayName: "Date First Registered",
                hasValue: !!vehicleData.ccd_date_first_registered,
              },
              {
                fieldName: "ccd_date_first_registered_uk",
                displayName: "Date First Registered (UK)",
                hasValue: !!vehicleData.ccd_date_first_registered_uk,
              },
            ]}
          />
          <CheckCarDetailsDisplay data={vehicleData} vehicleId={vehicleId || ""} />
        </>
      )}

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
            {vehicleData.dvla_make && (
              <p className="text-xs text-muted-foreground mt-1">DVLA: {vehicleData.dvla_make}</p>
            )}
            {vehicleData.ccd_make_model && (
              <p className="text-xs text-muted-foreground mt-1">CCD: {vehicleData.ccd_make_model}</p>
            )}
          </div>
          <div>
            <Label htmlFor="mileage">Mileage</Label>
            <div className="flex items-center gap-2">
              <Input
                id="mileage"
                type="number"
                value={vehicleData.mileage || ""}
                onChange={(e) => setVehicleData((prev) => ({ ...prev, mileage: Number.parseInt(e.target.value) }))}
                required
              />
              <span className="text-sm text-muted-foreground">miles</span>
            </div>
            {vehicleData.ccd_current_mileage !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">
                CCD Current: {vehicleData.ccd_current_mileage.toLocaleString()}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="first_registered_formatted">First Registered</Label>
            <Input
              id="first_registered_formatted"
              value={vehicleData.first_registered_formatted || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, first_registered_formatted: e.target.value }))}
              placeholder="e.g. 2012 (62 reg)"
            />
            {vehicleData.dvla_yearofmanufacture && (
              <p className="text-xs text-muted-foreground mt-1">DVLA Year: {vehicleData.dvla_yearofmanufacture}</p>
            )}
            {vehicleData.ccd_date_first_registered && (
              <p className="text-xs text-muted-foreground mt-1">
                CCD Registered: {vehicleData.ccd_date_first_registered}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="fuel_type">Fuel Type</Label>
            <Select
              value={vehicleData.fuel_type}
              onValueChange={(value) => setVehicleData((prev) => ({ ...prev, fuel_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {vehicleData.dvla_fueltype && (
              <p className="text-xs text-muted-foreground mt-1">DVLA: {vehicleData.dvla_fueltype}</p>
            )}
          </div>
          <div>
            <Label htmlFor="body_type_formatted">Body Type</Label>
            <Input
              id="body_type_formatted"
              value={vehicleData.body_type_formatted || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, body_type_formatted: e.target.value }))}
              placeholder="e.g. SUV, Hatchback, Saloon"
            />
          </div>
          <div>
            <Label htmlFor="engine_size">Engine Capacity</Label>
            <div className="flex items-center gap-2">
              <Input
                id="engine_size"
                type="number"
                step="0.1"
                value={vehicleData.engine_size || ""}
                onChange={(e) =>
                  setVehicleData((prev) => ({ ...prev, engine_size: Number.parseFloat(e.target.value) }))
                }
              />
              <span className="text-sm text-muted-foreground">L</span>
            </div>
            {vehicleData.dvla_enginecapacity && (
              <p className="text-xs text-muted-foreground mt-1">DVLA: {vehicleData.dvla_enginecapacity}cc</p>
            )}
            {vehicleData.ccd_engine_capacity !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">CCD: {vehicleData.ccd_engine_capacity}cc</p>
            )}
          </div>
          <div>
            <Label htmlFor="gearbox_formatted">Gearbox</Label>
            <Select
              value={vehicleData.gearbox_formatted}
              onValueChange={(value) => setVehicleData((prev) => ({ ...prev, gearbox_formatted: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gearbox" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                <SelectItem value="CVT">CVT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="doors">Doors</Label>
            <Input
              id="doors"
              type="number"
              value={vehicleData.doors || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, doors: Number.parseInt(e.target.value) }))}
            />
            {vehicleData.ccd_dimensions?.NumberOfDoors !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">CCD: {vehicleData.ccd_dimensions.NumberOfDoors}</p>
            )}
          </div>
          <div>
            <Label htmlFor="seats">Seats</Label>
            <Input
              id="seats"
              type="number"
              value={vehicleData.seats || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, seats: Number.parseInt(e.target.value) }))}
            />
            {vehicleData.ccd_dimensions?.NumberOfSeats !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">CCD: {vehicleData.ccd_dimensions.NumberOfSeats}</p>
            )}
          </div>
          <div>
            <Label htmlFor="emission_class">Emission Class</Label>
            <Input
              id="emission_class"
              value={vehicleData.emission_class || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, emission_class: e.target.value }))}
              placeholder="e.g. Euro 5, Euro 6"
            />
            {vehicleData.dvla_eurostatus && (
              <p className="text-xs text-muted-foreground mt-1">DVLA: {vehicleData.dvla_eurostatus}</p>
            )}
            {vehicleData.ccd_engine_capacity !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">CCD CO2: {vehicleData.ccd_engine_capacity}g/km</p>
            )}
          </div>
          <div>
            <Label htmlFor="color">Body Colour</Label>
            <Input
              id="color"
              value={vehicleData.color || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, color: e.target.value }))}
            />
            {vehicleData.dvla_colour && (
              <p className="text-xs text-muted-foreground mt-1">DVLA: {vehicleData.dvla_colour}</p>
            )}
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
          {vehicleData.dvla_motexpirydate && (
            <div>
              <Label>MOT Expiry Date</Label>
              <p className="text-sm font-medium bg-muted p-2 rounded">{vehicleData.dvla_motexpirydate}</p>
            </div>
          )}
          {vehicleData.ccd_mot_expiry_date && (
            <div>
              <Label>CCD MOT Expiry Date</Label>
              <p className="text-sm font-medium bg-muted p-2 rounded">{vehicleData.ccd_mot_expiry_date}</p>
            </div>
          )}
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
            {vehicleData.ccd_acceleration !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">CCD: {vehicleData.ccd_acceleration}</p>
            )}
          </div>
          <div>
            <Label htmlFor="seats">Seats</Label>
            <Input
              id="seats"
              type="number"
              value={vehicleData.seats || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, seats: Number.parseInt(e.target.value) }))}
            />
            {vehicleData.ccd_dimensions?.NumberOfSeats !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">CCD: {vehicleData.ccd_dimensions.NumberOfSeats}</p>
            )}
          </div>
          <div>
            <Label htmlFor="doors">Doors</Label>
            <Input
              id="doors"
              type="number"
              value={vehicleData.doors || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, doors: Number.parseInt(e.target.value) }))}
            />
            {vehicleData.ccd_dimensions?.NumberOfDoors !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">CCD: {vehicleData.ccd_dimensions.NumberOfDoors}</p>
            )}
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
            {vehicleData.ccd_fuel_consumption?.overallCombinedMPG !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">
                CCD: {vehicleData.ccd_fuel_consumption.overallCombinedMPG}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="length_mm">Length (mm)</Label>
            <Input
              id="length_mm"
              type="number"
              value={vehicleData.length_mm || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, length_mm: Number.parseInt(e.target.value) }))}
            />
            {vehicleData.ccd_dimensions?.LengthMm !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">CCD: {vehicleData.ccd_dimensions.LengthMm}</p>
            )}
          </div>
          <div>
            <Label htmlFor="width_mm">Width (mm)</Label>
            <Input
              id="width_mm"
              type="number"
              value={vehicleData.width_mm || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, width_mm: Number.parseInt(e.target.value) }))}
            />
            {vehicleData.ccd_dimensions?.WidthMm !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">CCD: {vehicleData.ccd_dimensions.WidthMm}</p>
            )}
          </div>
          <div>
            <Label htmlFor="height_mm">Height (mm)</Label>
            <Input
              id="height_mm"
              type="number"
              value={vehicleData.height_mm || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, height_mm: Number.parseInt(e.target.value) }))}
            />
            {vehicleData.ccd_dimensions?.HeightMm !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">CCD: {vehicleData.ccd_dimensions.HeightMm}</p>
            )}
          </div>
          <div>
            <Label htmlFor="kerb_weight">Kerb Weight (kg)</Label>
            <Input
              id="kerb_weight"
              type="number"
              value={vehicleData.kerb_weight || ""}
              onChange={(e) => setVehicleData((prev) => ({ ...prev, kerb_weight: Number.parseInt(e.target.value) }))}
            />
            {vehicleData.ccd_weight !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">CCD: {vehicleData.ccd_weight}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/*
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
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newRustLocation.trim()) {
                        setVehicleData((prev) => ({
                          ...prev,
                          rust_locations: [...(prev.rust_locations || []), newRustLocation.trim()],
                        }))
                        setNewRustLocation("")
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vehicleData.rust_locations?.map((location, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {location}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() =>
                          setVehicleData((prev) => ({
                            ...prev,
                            rust_locations: prev.rust_locations?.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          */}

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

      {/* Debug Display Box for CheckCarDetails JSON Response */}
      {ccdRawData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              CheckCarDetails Raw Response (Debug)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-96">
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {JSON.stringify(ccdRawData, null, 2)}
              </pre>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 bg-transparent"
              onClick={() => setCcdRawData(null)}
            >
              Hide Debug Data
            </Button>
          </CardContent>
        </Card>
      )}

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
