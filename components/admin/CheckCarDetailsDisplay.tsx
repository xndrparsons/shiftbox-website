"use client"

import type React from "react"
import { FieldToggleSystem } from "./FieldToggleSystem"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

interface CheckCarDetailsData {
  // Vehicle Registration
  ccd_vehicleregistration_registrationNumber?: string
  ccd_vehicleregistration_make?: string
  ccd_vehicleregistration_model?: string
  ccd_vehicleregistration_colour?: string
  ccd_vehicleregistration_fuelType?: string
  ccd_vehicleregistration_engineCapacity?: number
  ccd_vehicleregistration_yearOfManufacture?: number
  ccd_vehicleregistration_vehicleAge?: string
  ccd_vehicleregistration_wheelplan?: string
  ccd_vehicleregistration_dateOfLastV5CIssued?: string
  ccd_vehicleregistration_typeApproval?: string
  ccd_vehicleregistration_co2Emissions?: number
  ccd_vehicleregistration_registrationPlace?: string
  ccd_vehicleregistration_tax_taxStatus?: string
  ccd_vehicleregistration_tax_taxDueDate?: string
  ccd_vehicleregistration_tax_days?: string
  ccd_vehicleregistration_mot_motStatus?: string
  ccd_vehicleregistration_mot_motDueDate?: string
  ccd_vehicleregistration_mot_days?: number

  // MOT
  ccd_mot_registrationNumber?: string
  ccd_mot_make?: string
  ccd_mot_model?: string
  ccd_mot_mot_motStatus?: string
  ccd_mot_mot_motDueDate?: string
  ccd_mot_mot_days?: number
  ccd_mot_motHistorySummary_totalTests?: number
  ccd_mot_motHistorySummary_passedTests?: number
  ccd_mot_motHistorySummary_failedTests?: number
  ccd_mot_motHistory?: any[]

  // Mileage
  ccd_mileage_registrationNumber?: string
  ccd_mileage_make?: string
  ccd_mileage_model?: string
  ccd_mileage_summary_lastRecordedMileage?: string
  ccd_mileage_summary_averageMileage?: number
  ccd_mileage_summary_averageMileageStatus?: string
  ccd_mileage_summary_mileageIssues?: string
  ccd_mileage_summary_mileageIssueDescription?: string
  ccd_mileage_mileage?: any[]

  // Vehicle Specs - simplified for display
  ccd_vehiclespecs_ModelData_Make?: string
  ccd_vehiclespecs_ModelData_Model?: string
  ccd_vehiclespecs_ModelData_ModelVariant?: string
  ccd_vehiclespecs_BodyDetails_NumberOfDoors?: number
  ccd_vehiclespecs_BodyDetails_NumberOfSeats?: number
  ccd_vehiclespecs_Dimensions_HeightMm?: number
  ccd_vehiclespecs_Dimensions_LengthMm?: number
  ccd_vehiclespecs_Dimensions_WidthMm?: number
  ccd_vehiclespecs_Weights_KerbWeightKg?: number
  ccd_vehiclespecs_Performance?: any
  ccd_vehiclespecs_Transmission_TransmissionType?: string
  ccd_vehiclespecs_Transmission_NumberOfGears?: number

  // Vehicle Valuation
  ccd_vehiclevaluation_Vrm?: string
  ccd_vehiclevaluation_Mileage?: string
  ccd_vehiclevaluation_ValuationList?: any
  ccd_vehiclevaluation_VehicleDescription?: string

  // UK Vehicle Data
  ccd_ukvehicledata?: any

  // Vehicle Image
  ccd_vehicleimage_VehicleImages?: any
}

interface CheckCarDetailsDisplayProps {
  data: CheckCarDetailsData
  vehicleId: string
}

export function CheckCarDetailsDisplay({ data, vehicleId }: CheckCarDetailsDisplayProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Check if a section has any data
  const hasData = (fields: (keyof CheckCarDetailsData)[]) => {
    return fields.some((field) => data[field] !== undefined && data[field] !== null && data[field] !== "")
  }

  const renderFieldWithToggle = (
    field: keyof CheckCarDetailsData,
    label: string,
    value: any,
    formatter?: (val: any) => string,
  ) => {
    if (value === undefined || value === null || value === "") return null

    const displayValue = formatter
      ? formatter(value)
      : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : String(value)

    return (
      <FieldToggleSystem
        vehicleId={vehicleId}
        fieldName={field}
        fieldCategory="checkcardetails"
        currentValue={value}
        defaultDisplayName={label}
      >
        <div>
          <p className="text-sm font-medium">{displayValue}</p>
        </div>
      </FieldToggleSystem>
    )
  }

  // Vehicle Registration section
  const vehicleRegistrationFields: (keyof CheckCarDetailsData)[] = [
    "ccd_vehicleregistration_registrationNumber",
    "ccd_vehicleregistration_make",
    "ccd_vehicleregistration_model",
    "ccd_vehicleregistration_colour",
    "ccd_vehicleregistration_fuelType",
    "ccd_vehicleregistration_engineCapacity",
    "ccd_vehicleregistration_yearOfManufacture",
    "ccd_vehicleregistration_vehicleAge",
    "ccd_vehicleregistration_wheelplan",
    "ccd_vehicleregistration_dateOfLastV5CIssued",
    "ccd_vehicleregistration_typeApproval",
    "ccd_vehicleregistration_co2Emissions",
    "ccd_vehicleregistration_registrationPlace",
    "ccd_vehicleregistration_tax_taxStatus",
    "ccd_vehicleregistration_tax_taxDueDate",
    "ccd_vehicleregistration_tax_days",
    "ccd_vehicleregistration_mot_motStatus",
    "ccd_vehicleregistration_mot_motDueDate",
    "ccd_vehicleregistration_mot_days",
  ]

  const motFields: (keyof CheckCarDetailsData)[] = [
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

  const mileageFields: (keyof CheckCarDetailsData)[] = [
    "ccd_mileage_registrationNumber",
    "ccd_mileage_make",
    "ccd_mileage_model",
    "ccd_mileage_summary_lastRecordedMileage",
    "ccd_mileage_summary_averageMileage",
    "ccd_mileage_summary_averageMileageStatus",
    "ccd_mileage_summary_mileageIssues",
    "ccd_mileage_summary_mileageIssueDescription",
  ]

  const vehicleSpecsFields: (keyof CheckCarDetailsData)[] = [
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

  const valuationFields: (keyof CheckCarDetailsData)[] = [
    "ccd_vehiclevaluation_Vrm",
    "ccd_vehiclevaluation_Mileage",
    "ccd_vehiclevaluation_VehicleDescription",
  ]

  const renderSection = (
    title: string,
    sectionKey: string,
    fields: (keyof CheckCarDetailsData)[],
    customRenderer?: () => React.ReactNode,
  ) => {
    const sectionHasData =
      hasData(fields) ||
      (customRenderer &&
        (data.ccd_mot_motHistory ||
          data.ccd_mileage_mileage ||
          data.ccd_vehiclevaluation_ValuationList ||
          data.ccd_ukvehicledata ||
          data.ccd_vehicleimage_VehicleImages))
    const isOpen = openSections[sectionKey]

    return (
      <Card className={sectionHasData ? "" : "opacity-50"}>
        <Collapsible open={isOpen} onOpenChange={() => toggleSection(sectionKey)}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{title}</CardTitle>
                <div className="flex items-center gap-2">
                  {!sectionHasData && <span className="text-sm text-gray-500">No data obtained</span>}
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              {sectionHasData ? (
                customRenderer ? (
                  customRenderer()
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fields.map((field) =>
                      renderFieldWithToggle(
                        field,
                        field
                          .replace(/^ccd_[^_]+_/, "")
                          .replace(/_/g, " ")
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase()),
                        data[field],
                      ),
                    )}
                  </div>
                )
              ) : (
                <p className="text-gray-500 text-center py-4">No data obtained for this section</p>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {renderSection("Vehicle Registration", "vehicleRegistration", vehicleRegistrationFields)}

      {renderSection("MOT History", "mot", motFields, () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderFieldWithToggle(
              "ccd_mot_registrationNumber",
              "Registration Number",
              data.ccd_mot_registrationNumber,
            )}
            {renderFieldWithToggle("ccd_mot_make", "Make", data.ccd_mot_make)}
            {renderFieldWithToggle("ccd_mot_model", "Model", data.ccd_mot_model)}
            {renderFieldWithToggle("ccd_mot_mot_motStatus", "MOT Status", data.ccd_mot_mot_motStatus)}
            {renderFieldWithToggle("ccd_mot_mot_motDueDate", "MOT Due Date", data.ccd_mot_mot_motDueDate)}
            {renderFieldWithToggle("ccd_mot_mot_days", "Days Until MOT Due", data.ccd_mot_mot_days)}
            {renderFieldWithToggle(
              "ccd_mot_motHistorySummary_totalTests",
              "Total Tests",
              data.ccd_mot_motHistorySummary_totalTests,
            )}
            {renderFieldWithToggle(
              "ccd_mot_motHistorySummary_passedTests",
              "Passed Tests",
              data.ccd_mot_motHistorySummary_passedTests,
            )}
            {renderFieldWithToggle(
              "ccd_mot_motHistorySummary_failedTests",
              "Failed Tests",
              data.ccd_mot_motHistorySummary_failedTests,
            )}
          </div>
          {data.ccd_mot_motHistory && data.ccd_mot_motHistory.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">MOT Test History</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {data.ccd_mot_motHistory.slice(0, 5).map((test: any, index: number) => (
                  <div key={index} className="border rounded p-3 text-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`font-medium ${test.testResult === "PASSED" ? "text-green-600" : "text-red-600"}`}
                      >
                        {test.testResult}
                      </span>
                      <span className="text-gray-500">{test.completedDate?.split("T")[0]}</span>
                    </div>
                    <div className="text-gray-600">
                      Mileage: {test.odometerValue} {test.odometerUnit}
                    </div>
                    {test.defects && test.defects.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium">Issues:</span>
                        <ul className="text-xs text-gray-600 mt-1">
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

      {renderSection("Mileage History", "mileage", mileageFields, () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderFieldWithToggle(
              "ccd_mileage_registrationNumber",
              "Registration Number",
              data.ccd_mileage_registrationNumber,
            )}
            {renderFieldWithToggle("ccd_mileage_make", "Make", data.ccd_mileage_make)}
            {renderFieldWithToggle("ccd_mileage_model", "Model", data.ccd_mileage_model)}
            {renderFieldWithToggle(
              "ccd_mileage_summary_lastRecordedMileage",
              "Last Recorded Mileage",
              data.ccd_mileage_summary_lastRecordedMileage,
              (val) => `${val} miles`,
            )}
            {renderFieldWithToggle(
              "ccd_mileage_summary_averageMileage",
              "Average Annual Mileage",
              data.ccd_mileage_summary_averageMileage,
              (val) => `${val} miles/year`,
            )}
            {renderFieldWithToggle(
              "ccd_mileage_summary_averageMileageStatus",
              "Mileage Status",
              data.ccd_mileage_summary_averageMileageStatus,
            )}
            {renderFieldWithToggle(
              "ccd_mileage_summary_mileageIssues",
              "Mileage Issues",
              data.ccd_mileage_summary_mileageIssues,
            )}
            {renderFieldWithToggle(
              "ccd_mileage_summary_mileageIssueDescription",
              "Mileage Issue Description",
              data.ccd_mileage_summary_mileageIssueDescription,
            )}
          </div>
          {data.ccd_mileage_mileage && data.ccd_mileage_mileage.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Mileage Records</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {data.ccd_mileage_mileage.slice(0, 10).map((record: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm border-b pb-1">
                    <span>{record.dateOfInformation}</span>
                    <span>
                      {record.mileage} {record.unit}
                    </span>
                    <span className="text-gray-500">{record.source}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {renderSection("Vehicle Specifications", "vehicleSpecs", vehicleSpecsFields, () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderFieldWithToggle("ccd_vehiclespecs_ModelData_Make", "Make", data.ccd_vehiclespecs_ModelData_Make)}
          {renderFieldWithToggle("ccd_vehiclespecs_ModelData_Model", "Model", data.ccd_vehiclespecs_ModelData_Model)}
          {renderFieldWithToggle(
            "ccd_vehiclespecs_ModelData_ModelVariant",
            "Model Variant",
            data.ccd_vehiclespecs_ModelData_ModelVariant,
          )}
          {renderFieldWithToggle(
            "ccd_vehiclespecs_BodyDetails_NumberOfDoors",
            "Number of Doors",
            data.ccd_vehiclespecs_BodyDetails_NumberOfDoors,
          )}
          {renderFieldWithToggle(
            "ccd_vehiclespecs_BodyDetails_NumberOfSeats",
            "Number of Seats",
            data.ccd_vehiclespecs_BodyDetails_NumberOfSeats,
          )}
          {renderFieldWithToggle(
            "ccd_vehiclespecs_Dimensions_HeightMm",
            "Height",
            data.ccd_vehiclespecs_Dimensions_HeightMm,
            (val) => `${val}mm`,
          )}
          {renderFieldWithToggle(
            "ccd_vehiclespecs_Dimensions_LengthMm",
            "Length",
            data.ccd_vehiclespecs_Dimensions_LengthMm,
            (val) => `${val}mm`,
          )}
          {renderFieldWithToggle(
            "ccd_vehiclespecs_Dimensions_WidthMm",
            "Width",
            data.ccd_vehiclespecs_Dimensions_WidthMm,
            (val) => `${val}mm`,
          )}
          {renderFieldWithToggle(
            "ccd_vehiclespecs_Weights_KerbWeightKg",
            "Kerb Weight",
            data.ccd_vehiclespecs_Weights_KerbWeightKg,
            (val) => `${val}kg`,
          )}
          {renderFieldWithToggle(
            "ccd_vehiclespecs_Transmission_TransmissionType",
            "Transmission Type",
            data.ccd_vehiclespecs_Transmission_TransmissionType,
          )}
          {renderFieldWithToggle(
            "ccd_vehiclespecs_Transmission_NumberOfGears",
            "Number of Gears",
            data.ccd_vehiclespecs_Transmission_NumberOfGears,
          )}
        </div>
      ))}

      {renderSection("Vehicle Valuation", "valuation", valuationFields, () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderFieldWithToggle("ccd_vehiclevaluation_Vrm", "Registration", data.ccd_vehiclevaluation_Vrm)}
            {renderFieldWithToggle(
              "ccd_vehiclevaluation_Mileage",
              "Mileage at Valuation",
              data.ccd_vehiclevaluation_Mileage,
              (val) => `${val} miles`,
            )}
            {renderFieldWithToggle(
              "ccd_vehiclevaluation_VehicleDescription",
              "Vehicle Description",
              data.ccd_vehiclevaluation_VehicleDescription,
            )}
          </div>
          {data.ccd_vehiclevaluation_ValuationList && (
            <div>
              <h4 className="font-medium mb-2">Current Market Values</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(data.ccd_vehiclevaluation_ValuationList).map(([key, value]) => (
                  <div key={key} className="border rounded p-2 text-center">
                    <div className="text-xs text-gray-600 mb-1">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                    <div className="font-medium">£{Number(value).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {renderSection("UK Vehicle Data", "ukvehicledata", [], () => (
        <div>
          {data.ccd_ukvehicledata ? (
            <div className="text-sm">
              <p className="text-gray-600 mb-2">Additional UK vehicle data available</p>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(data.ccd_ukvehicledata, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No UK vehicle data obtained</p>
          )}
        </div>
      ))}

      {renderSection("Vehicle Images", "vehicleImages", [], () => (
        <div>
          {data.ccd_vehicleimage_VehicleImages?.ImageDetailsList?.length > 0 ? (
            <div className="space-y-2">
              {data.ccd_vehicleimage_VehicleImages.ImageDetailsList.map((image: any, index: number) => (
                <div key={index} className="border rounded p-3">
                  <img
                    src={image.ImageUrl || "/placeholder.svg"}
                    alt={`Vehicle ${image.ViewPoint}`}
                    className="w-full max-w-md mx-auto rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                  <p className="text-sm text-gray-600 text-center mt-2">{image.ViewPoint?.replace(/_/g, " ")}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No vehicle images obtained</p>
          )}
        </div>
      ))}
    </div>
  )
}
