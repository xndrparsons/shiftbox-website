import { type NextRequest, NextResponse } from "next/server"

interface VehicleLookupResponse {
  success: boolean
  data?: {
    registrationNumber: string
    taxStatus?: string
    taxDueDate?: string
    artEndDate?: string
    motStatus?: string
    motExpiryDate?: string
    make?: string
    monthOfFirstDvlaRegistration?: string
    monthOfFirstRegistration?: string
    yearOfManufacture?: number
    engineCapacity?: number
    co2Emissions?: number
    fuelType?: string
    markedForExport?: boolean
    colour?: string
    typeApproval?: string
    wheelplan?: string
    revenueWeight?: number
    realDrivingEmissions?: string
    dateOfLastV5CIssued?: string
    euroStatus?: string
    automatedVehicle?: boolean
  }
  error?: string
  source?: "dvla" | "mock"
}

const mockVehicleDatabase: Record<string, any> = {
  BM21ABC: {
    registrationNumber: "BM21ABC",
    make: "BMW",
    yearOfManufacture: 2021,
    fuelType: "DIESEL",
    colour: "SILVER",
    engineCapacity: 1995,
    co2Emissions: 142,
    taxStatus: "Taxed",
    motStatus: "Valid",
    motExpiryDate: "2025-03-15",
    taxDueDate: "2024-12-01",
    euroStatus: "Euro 6",
    typeApproval: "M1",
    automatedVehicle: false,
    markedForExport: false,
  },
  AU21XYZ: {
    registrationNumber: "AU21XYZ",
    make: "AUDI",
    yearOfManufacture: 2021,
    fuelType: "DIESEL",
    colour: "BLACK",
    engineCapacity: 1968,
    co2Emissions: 118,
    taxStatus: "Taxed",
    motStatus: "Valid",
    motExpiryDate: "2025-05-20",
    taxDueDate: "2024-11-15",
    euroStatus: "Euro 6",
    typeApproval: "M1",
    automatedVehicle: false,
    markedForExport: false,
  },
  MB21DEF: {
    registrationNumber: "MB21DEF",
    make: "MERCEDES-BENZ",
    yearOfManufacture: 2021,
    fuelType: "PETROL",
    colour: "WHITE",
    engineCapacity: 1496,
    co2Emissions: 138,
    taxStatus: "Taxed",
    motStatus: "Valid",
    motExpiryDate: "2025-07-10",
    taxDueDate: "2024-10-30",
    euroStatus: "Euro 6",
    typeApproval: "M1",
    automatedVehicle: false,
    markedForExport: false,
  },
}

async function lookupVehicleFromDVLA(registration: string) {
  const apiKey = process.env.DVLA_API_KEY

  if (!apiKey) {
    throw new Error("DVLA_API_KEY not configured")
  }

  const response = await fetch("https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      registrationNumber: registration,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`DVLA API request failed: ${response.status} ${errorData.message || response.statusText}`)
  }

  return await response.json()
}

console.log("[v0] Vehicle lookup API route loaded")

export async function POST(request: NextRequest) {
  console.log("[v0] Vehicle lookup API called")

  try {
    const { registration } = await request.json()
    console.log("[v0] Looking up registration:", registration)

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          error: "Registration number is required",
        },
        { status: 400 },
      )
    }

    // Clean and format registration
    const cleanReg = registration.replace(/\s+/g, "").toUpperCase()
    console.log("[v0] Cleaned registration:", cleanReg)

    const dvlaApiKey = process.env.DVLA_API_KEY
    console.log("[v0] DVLA API key configured:", !!dvlaApiKey)

    if (dvlaApiKey) {
      try {
        const dvlaData = await lookupVehicleFromDVLA(cleanReg)
        console.log("[v0] DVLA data received:", Object.keys(dvlaData))

        return NextResponse.json({
          success: true,
          source: "dvla",
          data: dvlaData, // Return the full DVLA response as-is
        })
      } catch (dvlaError) {
        console.error("DVLA API error:", dvlaError)
        // Fall through to mock data if DVLA fails
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const vehicleData = mockVehicleDatabase[cleanReg]

    if (vehicleData) {
      return NextResponse.json({
        success: true,
        source: "mock",
        data: vehicleData,
      })
    }

    const errorMessage = dvlaApiKey
      ? "Vehicle not found in DVLA database. Please check the registration number or enter details manually."
      : "DVLA API key not configured. Using mock data only. Please check the registration number or enter details manually."

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 404 },
    )
  } catch (error) {
    console.error("Vehicle lookup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to lookup vehicle details",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  console.log("[v0] Vehicle lookup API GET called")
  return NextResponse.json({
    message: "Vehicle lookup API is working",
    timestamp: new Date().toISOString(),
    dvlaConfigured: !!process.env.DVLA_API_KEY,
  })
}
