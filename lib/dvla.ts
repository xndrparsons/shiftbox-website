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
    const response = await fetch("https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.DVLA_API_KEY!,
      },
      body: JSON.stringify({
        registrationNumber: registrationNumber.replace(/\s+/g, "").toUpperCase(),
      }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null // Vehicle not found
      }
      throw new Error(`DVLA API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching DVLA data:", error)
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
    // Additional fields that can be populated from DVLA
    tax_status: dvlaData.taxStatus,
    tax_due_date: dvlaData.taxDueDate,
    mot_status: dvlaData.motStatus,
    mot_expiry_date: dvlaData.motExpiryDate,
  }
}
