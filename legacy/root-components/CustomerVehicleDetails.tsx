"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Database, Shield, History, Gauge, Car, TrendingUp, Camera } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface VehicleFieldVisibility {
  field_name: string
  field_category: string
  is_visible: boolean
  display_name: string
}

interface CustomerVehicleDetailsProps {
  vehicleId: number
  vehicleData: any
}

export function CustomerVehicleDetails({ vehicleId, vehicleData }: CustomerVehicleDetailsProps) {
  const [visibleFields, setVisibleFields] = useState<VehicleFieldVisibility[]>([])
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const loadVisibleFields = async () => {
      try {
        const { data, error } = await supabase
          .from("vehicle_field_visibility")
          .select("*")
          .eq("vehicle_id", vehicleId)
          .eq("is_visible", true)

        if (data && !error) {
          setVisibleFields(data)
        }
      } catch (error) {
        console.error("Error loading visible fields:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (vehicleId) {
      loadVisibleFields()
    }
  }, [vehicleId, supabase])

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const isFieldVisible = (fieldName: string) => {
    return visibleFields.some((field) => field.field_name === fieldName)
  }

  const getDisplayName = (fieldName: string) => {
    const field = visibleFields.find((f) => f.field_name === fieldName)
    return field?.display_name || fieldName.replace(/^(dvla_|ccd_)/, "").replace(/_/g, " ")
  }

  const formatValue = (value: any, fieldName: string) => {
    if (value === undefined || value === null || value === "") return null

    if (typeof value === "boolean") return value ? "Yes" : "No"
    if (fieldName.includes("date") || fieldName.includes("Date")) {
      return new Date(value).toLocaleDateString("en-GB")
    }
    if (fieldName.includes("capacity") || fieldName.includes("Capacity")) {
      return `${value}cc`
    }
    if (fieldName.includes("weight") || fieldName.includes("Weight")) {
      return `${value}kg`
    }
    if (fieldName.includes("dimensions") || fieldName.includes("Mm")) {
      return `${value}mm`
    }
    if (fieldName.includes("mileage") || fieldName.includes("Mileage")) {
      return `${value.toLocaleString()} miles`
    }

    return String(value)
  }

  const renderField = (fieldName: string, value: any) => {
    if (!isFieldVisible(fieldName) || !value) return null

    const displayName = getDisplayName(fieldName)
    const formattedValue = formatValue(value, fieldName)

    if (!formattedValue) return null

    return (
      <div key={fieldName} className="space-y-1">
        <span className="text-sm font-medium text-muted-foreground">{displayName}:</span>
        <p className="text-sm font-medium">{formattedValue}</p>
      </div>
    )
  }

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    sectionKey: string,
    fields: string[],
    customRenderer?: () => React.ReactNode,
  ) => {
    const visibleSectionFields = fields.filter((field) => isFieldVisible(field) && vehicleData[field])

    if (visibleSectionFields.length === 0 && !customRenderer) return null

    const isOpen = openSections[sectionKey]

    return (
      <Card key={sectionKey}>
        <Collapsible open={isOpen} onOpenChange={() => toggleSection(sectionKey)}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {icon}
                  {title}
                </CardTitle>
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {customRenderer ? (
                customRenderer()
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleSectionFields.map((field) => renderField(field, vehicleData[field]))}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const hasAnyVisibleData = visibleFields.length > 0

  if (!hasAnyVisibleData) {
    return null
  }

  // DVLA fields
  const dvlaFields = [
    "dvla_registrationNumber",
    "dvla_taxStatus",
    "dvla_taxDueDate",
    "dvla_motStatus",
    "dvla_motExpiryDate",
    "dvla_make",
    "dvla_yearOfManufacture",
    "dvla_engineCapacity",
    "dvla_co2Emissions",
    "dvla_fuelType",
    "dvla_colour",
    "dvla_typeApproval",
    "dvla_wheelplan",
    "dvla_revenueWeight",
    "dvla_euroStatus",
    "dvla_automatedVehicle",
  ]

  // CheckCarDetails fields by category
  const vehicleRegistrationFields = [
    "ccd_vehicleregistration_registrationNumber",
    "ccd_vehicleregistration_make",
    "ccd_vehicleregistration_model",
    "ccd_vehicleregistration_colour",
    "ccd_vehicleregistration_fuelType",
    "ccd_vehicleregistration_engineCapacity",
    "ccd_vehicleregistration_yearOfManufacture",
    "ccd_vehicleregistration_vehicleAge",
    "ccd_vehicleregistration_wheelplan",
    "ccd_vehicleregistration_typeApproval",
    "ccd_vehicleregistration_co2Emissions",
    "ccd_vehicleregistration_registrationPlace",
    "ccd_vehicleregistration_tax_taxStatus",
    "ccd_vehicleregistration_tax_taxDueDate",
    "ccd_vehicleregistration_mot_motStatus",
    "ccd_vehicleregistration_mot_motDueDate",
  ]

  const motFields = [
    "ccd_mot_registrationNumber",
    "ccd_mot_make",
    "ccd_mot_model",
    "ccd_mot_mot_motStatus",
    "ccd_mot_mot_motDueDate",
    "ccd_mot_mot_days",
    "ccd_mot_motHistorySummary_totalTests",
    "ccd_mot_motHistorySummary_passedTests",
    "ccd_mot_motHistorySummary_failedTests",
  ]

  const mileageFields = [
    "ccd_mileage_registrationNumber",
    "ccd_mileage_make",
    "ccd_mileage_model",
    "ccd_mileage_summary_lastRecordedMileage",
    "ccd_mileage_summary_averageMileage",
    "ccd_mileage_summary_averageMileageStatus",
    "ccd_mileage_summary_mileageIssues",
  ]

  const vehicleSpecsFields = [
    "ccd_vehiclespecs_ModelData_Make",
    "ccd_vehiclespecs_ModelData_Model",
    "ccd_vehiclespecs_ModelData_ModelVariant",
    "ccd_vehiclespecs_BodyDetails_NumberOfDoors",
    "ccd_vehiclespecs_BodyDetails_NumberOfSeats",
    "ccd_vehiclespecs_Dimensions_HeightMm",
    "ccd_vehiclespecs_Dimensions_LengthMm",
    "ccd_vehiclespecs_Dimensions_WidthMm",
    "ccd_vehiclespecs_Weights_KerbWeightKg",
    "ccd_vehiclespecs_Transmission_TransmissionType",
    "ccd_vehiclespecs_Transmission_NumberOfGears",
  ]

  const valuationFields = [
    "ccd_vehiclevaluation_Vrm",
    "ccd_vehiclevaluation_Mileage",
    "ccd_vehiclevaluation_VehicleDescription",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Comprehensive Vehicle Information</h2>
      </div>

      <div className="space-y-4">
        {/* DVLA Information */}
        {renderSection("DVLA Information", <Shield className="h-5 w-5" />, "dvla", dvlaFields)}

        {/* Vehicle Registration */}
        {renderSection(
          "Vehicle Registration Details",
          <Car className="h-5 w-5" />,
          "vehicleRegistration",
          vehicleRegistrationFields,
        )}

        {/* MOT History */}
        {renderSection("MOT History & Testing", <History className="h-5 w-5" />, "mot", motFields, () => (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {motFields.map((field) => renderField(field, vehicleData[field]))}
            </div>

            {/* MOT History Records */}
            {isFieldVisible("ccd_mot_motHistory") &&
              vehicleData.ccd_mot_motHistory &&
              vehicleData.ccd_mot_motHistory.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Recent MOT Test History</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {vehicleData.ccd_mot_motHistory.slice(0, 3).map((test: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3 text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={test.testResult === "PASSED" ? "default" : "destructive"}>
                            {test.testResult}
                          </Badge>
                          <span className="text-muted-foreground">{test.completedDate?.split("T")[0]}</span>
                        </div>
                        <div className="text-muted-foreground">
                          Mileage: {test.odometerValue} {test.odometerUnit}
                        </div>
                        {test.defects && test.defects.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs font-medium">Issues noted:</span>
                            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                              {test.defects.slice(0, 2).map((defect: any, defectIndex: number) => (
                                <li key={defectIndex} className="truncate">
                                  • {defect.text}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ))}

        {/* Mileage History */}
        {renderSection("Mileage History & Records", <Gauge className="h-5 w-5" />, "mileage", mileageFields, () => (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mileageFields.map((field) => renderField(field, vehicleData[field]))}
            </div>

            {/* Mileage Records */}
            {isFieldVisible("ccd_mileage_mileage") &&
              vehicleData.ccd_mileage_mileage &&
              vehicleData.ccd_mileage_mileage.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Mileage Records</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {vehicleData.ccd_mileage_mileage.slice(0, 8).map((record: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="text-muted-foreground">{record.dateOfInformation}</span>
                        <span className="font-medium">
                          {record.mileage} {record.unit}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {record.source}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ))}

        {/* Vehicle Specifications */}
        {renderSection("Technical Specifications", <Car className="h-5 w-5" />, "vehicleSpecs", vehicleSpecsFields)}

        {/* Vehicle Valuation */}
        {renderSection("Market Valuation", <TrendingUp className="h-5 w-5" />, "valuation", valuationFields, () => (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {valuationFields.map((field) => renderField(field, vehicleData[field]))}
            </div>

            {/* Valuation List */}
            {isFieldVisible("ccd_vehiclevaluation_ValuationList") && vehicleData.ccd_vehiclevaluation_ValuationList && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Current Market Values</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(vehicleData.ccd_vehiclevaluation_ValuationList).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-3 text-center">
                      <div className="text-xs text-muted-foreground mb-1">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                      <div className="font-semibold text-lg">£{Number(value).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Vehicle Images */}
        {isFieldVisible("ccd_vehicleimage_VehicleImages") &&
          vehicleData.ccd_vehicleimage_VehicleImages?.ImageDetailsList?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Additional Vehicle Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicleData.ccd_vehicleimage_VehicleImages.ImageDetailsList.map((image: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <img
                        src={image.ImageUrl || "/placeholder.svg"}
                        alt={`Vehicle ${image.ViewPoint}`}
                        className="w-full rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                      <p className="text-sm text-muted-foreground text-center">{image.ViewPoint?.replace(/_/g, " ")}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  )
}
