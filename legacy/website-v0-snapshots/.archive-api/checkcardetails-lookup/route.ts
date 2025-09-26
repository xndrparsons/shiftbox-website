import { type NextRequest, NextResponse } from "next/server"
import { getCheckCarDetailsAPI, mapCheckCarDetailsToDatabase } from "@/lib/checkcardetails"

interface CheckCarDetailsLookupRequest {
  registration: string
  tables: string[]
}

interface CheckCarDetailsLookupResponse {
  success: boolean
  data?: any
  mappedData?: Record<string, any>
  cost: number
  tablesFetched: string[]
  error?: string
}

console.log("[v0] CheckCarDetails lookup API route loaded")

export async function POST(request: NextRequest): Promise<NextResponse<CheckCarDetailsLookupResponse>> {
  console.log("[v0] CheckCarDetails lookup API called")

  try {
    const { registration, tables }: CheckCarDetailsLookupRequest = await request.json()
    console.log("[v0] Looking up registration:", registration, "with tables:", tables)

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          error: "Registration number is required",
          cost: 0,
          tablesFetched: [],
        },
        { status: 400 },
      )
    }

    if (!tables || tables.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one data table must be selected",
          cost: 0,
          tablesFetched: [],
        },
        { status: 400 },
      )
    }

    // Clean and format registration
    const cleanReg = registration.replace(/\s+/g, "").toUpperCase()
    console.log("[v0] Cleaned registration:", cleanReg)

    try {
      // Get the CheckCarDetails API instance
      const checkCarDetailsAPI = getCheckCarDetailsAPI()

      // Fetch data from CheckCarDetails API
      const result = await checkCarDetailsAPI.fetchVehicleData(cleanReg, tables)

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: result.error || "Failed to fetch vehicle data",
            cost: result.cost,
            tablesFetched: result.tablesFetched,
          },
          { status: 400 },
        )
      }

      // Map the API response to database fields
      const mappedData = mapCheckCarDetailsToDatabase(result.data, result.tablesFetched, result.cost)

      console.log("[v0] CheckCarDetails data fetched successfully, cost:", result.cost)

      return NextResponse.json({
        success: true,
        data: result.data,
        mappedData,
        cost: result.cost,
        tablesFetched: result.tablesFetched,
      })
    } catch (apiError) {
      console.error("[v0] CheckCarDetails API error:", apiError)

      // Check if it's an API key error
      if (apiError instanceof Error && apiError.message.includes("CHECKCARDETAILS_LIVE_API_KEY")) {
        return NextResponse.json(
          {
            success: false,
            error:
              "CheckCarDetails API key not configured. Please add CHECKCARDETAILS_LIVE_API_KEY to environment variables.",
            cost: 0,
            tablesFetched: [],
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: apiError instanceof Error ? apiError.message : "Failed to fetch vehicle data",
          cost: 0,
          tablesFetched: [],
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] CheckCarDetails lookup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process request",
        cost: 0,
        tablesFetched: [],
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  console.log("[v0] CheckCarDetails lookup API GET called")

  try {
    const checkCarDetailsAPI = getCheckCarDetailsAPI()
    const availableTables = checkCarDetailsAPI.getAvailableTables()

    return NextResponse.json({
      message: "CheckCarDetails lookup API is working",
      timestamp: new Date().toISOString(),
      apiConfigured: !!process.env.CHECKCARDETAILS_LIVE_API_KEY,
      availableTables: availableTables.map((table) => ({
        name: table.name,
        label: table.label,
        cost: table.cost,
      })),
    })
  } catch (error) {
    return NextResponse.json({
      message: "CheckCarDetails lookup API is working",
      timestamp: new Date().toISOString(),
      apiConfigured: false,
      error: "API key not configured",
      availableTables: [],
    })
  }
}
