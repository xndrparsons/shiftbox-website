import { type NextRequest, NextResponse } from "next/server"

interface VehicleLookupResponse {
  success: boolean
  data?: {
    registration: string
    make: string
    model: string
    year: number
    fuel_type: string
    transmission?: string
    body_type?: string
    color: string
    engine_size?: number
    co2_emissions?: number
    tax_status?: string
    tax_due_date?: string
    mot_status?: string
    mot_expiry_date?: string
  }
  error?: string
  source?: "dvla" | "mock"
}

const mockVehicleDatabase: Record<string, any> = {
  BM21ABC: {
    make: "BMW",
    model: "3 SERIES",
    year: 2021,
    fuel_type: "DIESEL",
    color: "SILVER",
    engine_size: 1995,
    co2_emissions: 142,
    tax_status: "TAXED",
    mot_status: "VALID",
  },
  AU21XYZ: {
    make: "AUDI",
    model: "A4",
    year: 2021,
    fuel_type: "DIESEL",
    color: "BLACK",
    engine_size: 1968,
    co2_emissions: 118,
    tax_status: "TAXED",
    mot_status: "VALID",
  },
  MB21DEF: {
    make: "MERCEDES-BENZ",
    model: "C CLASS",
    year: 2021,
    fuel_type: "PETROL",
    color: "WHITE",
    engine_size: 1496,
    co2_emissions: 138,
    tax_status: "TAXED",
    mot_status: "VALID",
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

        return NextResponse.json({
          success: true,
          source: "dvla",
          data: {
            registration: cleanReg,
            make: dvlaData.make,
            model: dvlaData.model,
            year: dvlaData.yearOfManufacture,
            fuel_type: dvlaData.fuelType,
            color: dvlaData.colour,
            engine_size: dvlaData.engineCapacity,
            co2_emissions: dvlaData.co2Emissions,
            tax_status: dvlaData.taxStatus,
            tax_due_date: dvlaData.taxDueDate,
            mot_status: dvlaData.motStatus,
            mot_expiry_date: dvlaData.motExpiryDate,
          },
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
        data: {
          registration: cleanReg,
          ...vehicleData,
        },
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
