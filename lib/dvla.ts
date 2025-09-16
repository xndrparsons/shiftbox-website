interface DVLAVehicleData {
  registrationNumber: string
  taxStatus: string
  taxDueDate?: string
  artEndDate?: string
  motStatus: string
  motExpiryDate?: string
  make: string
  yearOfManufacture: number
  engineCapacity?: number
  co2Emissions?: number
  fuelType: string
  markedForExport?: boolean
  colour: string
  typeApproval?: string
  wheelplan?: string
  revenueWeight?: number
  realDrivingEmissions?: string
  dateOfLastV5CIssued?: string
  euroStatus?: string
}

export async function fetchDVLAData(registrationNumber: string): Promise<DVLAVehicleData | null> {
  try {
    const correlationId = `shiftbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    console.log("[v0] DVLA API Request:", {
      registrationNumber: registrationNumber.replace(/\s+/g, "").toUpperCase(),
      correlationId,
      hasApiKey: !!process.env.DVLA_API_KEY,
    })

    const response = await fetch("https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": process.env.DVLA_API_KEY!,
        "X-Correlation-Id": correlationId,
      },
      body: JSON.stringify({
        registrationNumber: registrationNumber.replace(/\s+/g, "").toUpperCase(),
      }),
    })

    console.log("[v0] DVLA API Response:", {
      status: response.status,
      statusText: response.statusText,
      correlationId,
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.log("[v0] Vehicle not found in DVLA database")
        return null // Vehicle not found
      }
      const errorText = await response.text()
      console.error("[v0] DVLA API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        correlationId,
      })
      throw new Error(`DVLA API error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] DVLA API Success:", { registrationNumber: data.registrationNumber, correlationId })
    return data
  } catch (error) {
    console.error("[v0] Error fetching DVLA data:", error)
    return null
  }
}

export function mapDVLAToVehicle(dvlaData: DVLAVehicleData) {
  return {
    registration: dvlaData.registrationNumber,
    make: dvlaData.make,
    year: dvlaData.yearOfManufacture,
    fuel_type: dvlaData.fuelType,
    color: dvlaData.colour,
    engine_size: dvlaData.engineCapacity ? `${dvlaData.engineCapacity}cc` : null,
    co2_emissions: dvlaData.co2Emissions || null,
    tax_status: dvlaData.taxStatus,
    tax_due_date: dvlaData.taxDueDate,
    mot_status: dvlaData.motStatus,
    mot_expiry_date: dvlaData.motExpiryDate,
  }
}
