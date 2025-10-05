import { type NextRequest, NextResponse } from "next/server"

interface PricingResponse {
  success: boolean
  pricing?: any
  error?: string
  timestamp: string
}

console.log("[v0] CheckCarDetails pricing API route loaded")

export async function GET(request: NextRequest): Promise<NextResponse<PricingResponse>> {
  console.log("[v0] CheckCarDetails pricing API called")

  console.log("[v0] Available CheckCarDetails env vars:", {
    CHECKCARDETAILS_API_KEY: process.env.CHECKCARDETAILS_API_KEY ? "SET" : "NOT SET",
    CHECKCARDETAILS_LIVE_API_KEY: process.env.CHECKCARDETAILS_LIVE_API_KEY ? "SET" : "NOT SET",
    CHECKCARDETAILS_TEST_API_KEY: process.env.CHECKCARDETAILS_TEST_API_KEY ? "SET" : "NOT SET",
  })

  try {
    const apiKey = process.env.CHECKCARDETAILS_LIVE_API_KEY || process.env.CHECKCARDETAILS_API_KEY
    if (!apiKey) {
      console.error("[v0] Neither CHECKCARDETAILS_LIVE_API_KEY nor CHECKCARDETAILS_API_KEY environment variable is set")
      return NextResponse.json(
        {
          success: false,
          error: "CheckCarDetails API key not found. Please set CHECKCARDETAILS_LIVE_API_KEY environment variable.",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    console.log("[v0] Using API key:", process.env.CHECKCARDETAILS_LIVE_API_KEY ? "LIVE" : "FALLBACK")

    const checkCarDetailsAPI = new (await import("@/lib/checkcardetails")).CheckCarDetailsAPI({ apiKey })

    // Fetch current pricing from CheckCarDetails API
    const pricingData = await checkCarDetailsAPI.fetchCurrentPricing()

    if (pricingData) {
      return NextResponse.json({
        success: true,
        pricing: pricingData,
        timestamp: new Date().toISOString(),
      })
    } else {
      // Return default pricing if API call fails
      const defaultTables = checkCarDetailsAPI.getAvailableTables()
      const defaultPricing = defaultTables.reduce(
        (acc, table) => {
          acc[table.name] = table.cost
          return acc
        },
        {} as Record<string, number>,
      )

      return NextResponse.json({
        success: true,
        pricing: {
          tables: defaultPricing,
          lastUpdated: new Date().toISOString(),
          note: "Using default pricing - API pricing unavailable",
        },
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("[v0] CheckCarDetails pricing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch pricing",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
