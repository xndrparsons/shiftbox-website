// CheckCarDetails API Integration
// API Documentation: https://api.checkcardetails.co.uk

export interface CheckCarDetailsConfig {
  apiKey: string
  baseUrl?: string
}

export interface DataTableOption {
  name: string
  label: string
  description: string
  cost: number // Cost in GBP
}

export interface PricingData {
  tables: Record<string, number>
  lastUpdated: string
}

// Available data tables with costs (update these based on current pricing)
export const AVAILABLE_DATA_TABLES: DataTableOption[] = [
  {
    name: "vehicleregistration",
    label: "Vehicle Registration",
    description: "DVLA vehicle registration details",
    cost: 0.02, // Updated from screenshot
  },
  {
    name: "mot",
    label: "MOT Data",
    description: "Includes MOT status, summary and full MOT history",
    cost: 0.02, // Updated from screenshot
  },
  {
    name: "mileage",
    label: "Mileage History",
    description: "Full vehicle mileage history",
    cost: 0.02, // Updated from screenshot
  },
  // Tables user is trying to get access to
  {
    name: "vehiclespecs",
    label: "Vehicle Specifications",
    description: "Full vehicle specification data",
    cost: 0.04, // Updated from screenshot
  },
  {
    name: "vehiclevaluation",
    label: "Vehicle Valuation",
    description: "Vehicle valuation data",
    cost: 0.12, // Updated from screenshot
  },
  // Other available tables (for future use)
  {
    name: "ukvehicledata",
    label: "UK Vehicle Data",
    description: "Full vehicle data including all vehicle details",
    cost: 0.1, // Updated from screenshot
  },
  {
    name: "carhistorycheck",
    label: "Car History Check",
    description: "Full vehicle history check including all vehicle details",
    cost: 1.82, // Updated from screenshot
  },
  {
    name: "vehicleimage",
    label: "Vehicle Image",
    description: "Vehicle image data",
    cost: 0.05, // Updated from screenshot
  },
]

export interface CheckCarDetailsResponse {
  success: boolean
  data?: any
  error?: string
  cost: number
  tablesFetched: string[]
}

export class CheckCarDetailsAPI {
  private config: CheckCarDetailsConfig

  constructor(config: CheckCarDetailsConfig) {
    this.config = {
      baseUrl: "https://api.checkcardetails.co.uk",
      ...config,
    }
  }

  async fetchVehicleData(registrationNumber: string, tables: string[]): Promise<CheckCarDetailsResponse> {
    try {
      console.log("[v0] CheckCarDetails API call starting", { registrationNumber, tables })

      if (!this.config.apiKey) {
        throw new Error("CheckCarDetails API key not configured")
      }

      // Calculate total cost
      const totalCost = tables.reduce((sum, tableName) => {
        const table = AVAILABLE_DATA_TABLES.find((t) => t.name === tableName)
        return sum + (table?.cost || 0)
      }, 0)

      const allResults: any = {}
      const successfulTables: string[] = []

      // Make individual API calls for each table
      for (const table of tables) {
        try {
          const url = `${this.config.baseUrl}/vehicledata/${table}?apikey=${this.config.apiKey}&vrm=${registrationNumber}`

          console.log(`[v0] Fetching ${table} data from CheckCarDetails`)

          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "User-Agent": "ShiftBox-Vehicle-System/1.0",
            },
          })

          console.log(`[v0] CheckCarDetails ${table} response status:`, response.status)

          if (response.ok) {
            const data = await response.json()
            allResults[table] = data
            successfulTables.push(table)
            console.log(`[v0] Successfully fetched ${table} data`)
          } else {
            const errorText = await response.text()
            console.error(`[v0] CheckCarDetails ${table} API error:`, errorText)
            // Continue with other tables even if one fails
          }
        } catch (error) {
          console.error(`[v0] Error fetching ${table}:`, error)
          // Continue with other tables even if one fails
        }
      }

      return {
        success: successfulTables.length > 0,
        data: allResults,
        cost: totalCost,
        tablesFetched: successfulTables,
      }
    } catch (error) {
      console.error("[v0] CheckCarDetails API error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        cost: 0,
        tablesFetched: [],
      }
    }
  }

  async fetchCurrentPricing(): Promise<PricingData | null> {
    try {
      console.log("[v0] Fetching current pricing from CheckCarDetails API")

      const url = `${this.config.baseUrl}/pricing?apikey=${this.config.apiKey}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "ShiftBox-Vehicle-System/1.0",
        },
      })

      console.log("[v0] CheckCarDetails pricing response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Raw pricing data from API:", data)

        // Convert pricing from pence to pounds if needed
        const processedTables: Record<string, number> = {}
        if (data.tables) {
          Object.entries(data.tables).forEach(([tableName, price]) => {
            // If the API returns prices in pence (like 2 for £0.02), convert to pounds
            const priceNumber = typeof price === "number" ? price : Number.parseFloat(price as string)
            // Assume API returns prices in pence, so divide by 100 to get pounds
            processedTables[tableName] = priceNumber / 100
            console.log(`[v0] Converted ${tableName}: ${priceNumber} pence -> £${processedTables[tableName]}`)
          })
        }

        console.log("[v0] Processed pricing data:", processedTables)
        return {
          tables: processedTables,
          lastUpdated: new Date().toISOString(),
        }
      } else {
        const errorText = await response.text()
        console.error("[v0] CheckCarDetails pricing API error:", errorText)
        return null
      }
    } catch (error) {
      console.error("[v0] Error fetching pricing:", error)
      return null
    }
  }

  async getAvailableTablesWithCurrentPricing(): Promise<DataTableOption[]> {
    // Return hardcoded pricing instead of fetching from API
    return AVAILABLE_DATA_TABLES
  }

  // Get available tables with costs
  getAvailableTables(): DataTableOption[] {
    return AVAILABLE_DATA_TABLES
  }

  // Calculate cost for selected tables
  calculateCost(selectedTables: string[]): number {
    return selectedTables.reduce((sum, tableName) => {
      const table = AVAILABLE_DATA_TABLES.find((t) => t.name === tableName)
      return sum + (table?.cost || 0)
    }, 0)
  }
}

// Export singleton instance
let checkCarDetailsAPI: CheckCarDetailsAPI | null = null

export function getCheckCarDetailsAPI(): CheckCarDetailsAPI {
  if (!checkCarDetailsAPI) {
    const liveApiKey = process.env.CHECKCARDETAILS_LIVE_API_KEY
    const testApiKey = process.env.CHECKCARDETAILS_TEST_API_KEY
    const fallbackApiKey = process.env.CHECKCARDETAILS_API_KEY

    const apiKey = liveApiKey || testApiKey || fallbackApiKey

    if (!apiKey) {
      throw new Error(
        "No CheckCarDetails API key found. Please set CHECKCARDETAILS_LIVE_API_KEY, CHECKCARDETAILS_TEST_API_KEY, or CHECKCARDETAILS_API_KEY environment variable",
      )
    }

    // Log which key is being used for debugging
    if (liveApiKey) {
      console.log("[v0] Using CHECKCARDETAILS_LIVE_API_KEY")
    } else if (testApiKey) {
      console.log("[v0] Using CHECKCARDETAILS_TEST_API_KEY")
    } else {
      console.log("[v0] Using CHECKCARDETAILS_API_KEY as fallback")
    }

    checkCarDetailsAPI = new CheckCarDetailsAPI({ apiKey })
  }
  return checkCarDetailsAPI
}

// Helper function to map API response to database fields
export function mapCheckCarDetailsToDatabase(data: any, tablesFetched: string[], fetchCost = 0) {
  const mapped: Record<string, any> = {
    // Core tracking fields
    ccd_tables_fetched: tablesFetched,
    ccd_last_fetched: new Date(),
    ccd_fetch_cost: fetchCost,

    // Essential vehicle fields with fallbacks
    make: "Unknown",
    model: "Unknown",
    fuel_type: "Unknown",
    transmission: "Unknown",
    status: "available",
    year: 0,
    price: 0, // Will be set manually by admin
    registration: "", // Will be set from the registration parameter
    body_type: "Unknown",
    color: "Unknown",
    mileage: 0,
    doors: 4,
    seats: 5,
    engine_size: "Unknown",
  }

  // Map vehicleregistration data with enhanced field mapping
  if (data.vehicleregistration) {
    const vr = data.vehicleregistration
    console.log("[v0] Mapping vehicleregistration data:", vr)

    // Enhanced make/model extraction
    if (vr.make && vr.make !== "Unknown") {
      mapped.make = vr.make
    }

    if (vr.model && vr.model !== "Unknown") {
      mapped.model = vr.model
    }

    // Enhanced field mapping with better fallbacks
    if (vr.fuelType && vr.fuelType !== "Unknown") mapped.fuel_type = vr.fuelType
    if (vr.colour && vr.colour !== "Unknown") mapped.color = vr.colour
    if (vr.yearOfManufacture) {
      const year = Number.parseInt(vr.yearOfManufacture, 10)
      if (year > 1900 && year <= new Date().getFullYear() + 1) {
        mapped.year = year
      }
    }

    // Enhanced engine size mapping
    if (vr.engineCapacity) {
      mapped.engine_size = vr.engineCapacity.toString()
    }

    // Map all other vehicleregistration fields
    if (vr.dateOfLastV5CIssued) mapped.ccd_date_of_last_update = vr.dateOfLastV5CIssued
    if (vr.typeApproval) mapped.ccd_vehicle_class = vr.typeApproval
    if (vr.wheelplan) mapped.ccd_wheelplan = vr.wheelplan
  }

  // Enhanced MOT data mapping
  if (data.mot) {
    const mot = data.mot
    console.log("[v0] Mapping MOT data:", mot)

    if (mot.mot?.motStatus) mapped.ccd_mot_status = mot.mot.motStatus
    if (mot.mot?.motDueDate) mapped.ccd_mot_expiry_date = mot.mot.motDueDate

    // Get latest mileage from MOT history
    if (mot.motHistory && Array.isArray(mot.motHistory) && mot.motHistory.length > 0) {
      const latestMot = mot.motHistory[0] // First entry is most recent
      if (latestMot.odometerValue) {
        const mileageValue = Number.parseInt(latestMot.odometerValue, 10)
        if (mileageValue > 0) {
          mapped.mileage = mileageValue
          mapped.ccd_mot_test_mileage = mileageValue
        }
      }
      if (latestMot.motTestNumber) mapped.ccd_mot_test_number = latestMot.motTestNumber
      if (latestMot.completedDate) mapped.ccd_mot_test_date = latestMot.completedDate
      if (latestMot.testResult) mapped.ccd_mot_test_result = latestMot.testResult
    }
  }

  // Enhanced mileage data mapping
  if (data.mileage) {
    const mileageData = data.mileage
    console.log("[v0] Mapping mileage data:", mileageData)

    if (mileageData.summary?.lastRecordedMileage) {
      const mileageValue = Number.parseInt(mileageData.summary.lastRecordedMileage, 10)
      if (mileageValue > 0) {
        mapped.mileage = mileageValue
        mapped.ccd_current_mileage = mileageValue
      }
    }
    if (mileageData.summary?.averageMileage) mapped.ccd_average_annual_mileage = mileageData.summary.averageMileage
    if (mileageData.mileage) mapped.ccd_mileage_history = JSON.stringify(mileageData.mileage)
  }

  if (data.vehiclespecs) {
    const specs = data.vehiclespecs
    console.log("[v0] Mapping vehiclespecs data:", specs)

    // Map from correct nested structure
    if (specs.BodyDetails?.NumberOfDoors) mapped.doors = specs.BodyDetails.NumberOfDoors
    if (specs.BodyDetails?.NumberOfSeats) mapped.seats = specs.BodyDetails.NumberOfSeats
    if (specs.Performance?.Power?.Bhp) mapped.bhp = specs.Performance.Power.Bhp
    if (specs.Performance?.Torque?.Nm) mapped.torque = specs.Performance.Torque.Nm

    // Map transmission from correct location
    if (specs.Transmission?.TransmissionType) mapped.transmission = specs.Transmission.TransmissionType

    // Map body type from correct location
    if (specs.BodyDetails?.BodyStyle) mapped.body_type = specs.BodyDetails.BodyStyle

    // Map engine details
    if (specs.PowerSource?.IceDetails?.EngineCapacityCc) {
      mapped.engine_size = specs.PowerSource.IceDetails.EngineCapacityCc.toString()
    }

    // Map fuel type from specs if not already set
    if (specs.ModelData?.FuelType && mapped.fuel_type === "Unknown") {
      mapped.fuel_type = specs.ModelData.FuelType
    }

    // Store dimensions as JSON
    if (specs.Dimensions) mapped.ccd_dimensions = JSON.stringify(specs.Dimensions)

    // Map other performance data
    if (specs.Performance?.Statistics?.MaxSpeedMph) mapped.ccd_max_speed = specs.Performance.Statistics.MaxSpeedMph
    if (specs.Performance?.Statistics?.ZeroToSixtyMph)
      mapped.ccd_acceleration = specs.Performance.Statistics.ZeroToSixtyMph
    if (specs.Performance?.FuelEconomy?.CombinedMpg)
      mapped.ccd_fuel_consumption = specs.Performance.FuelEconomy.CombinedMpg
    if (specs.Weights?.KerbWeightKg) mapped.ccd_weight = specs.Weights.KerbWeightKg
  }

  // Enhanced vehiclevaluation data mapping
  if (data.vehiclevaluation) {
    const valuation = data.vehiclevaluation
    console.log("[v0] Mapping vehiclevaluation data:", valuation)

    if (valuation.ValuationList?.TradeRetail)
      mapped.ccd_trade_value = Number.parseInt(valuation.ValuationList.TradeRetail, 10)
    if (valuation.ValuationList?.DealerForecourt)
      mapped.ccd_retail_value = Number.parseInt(valuation.ValuationList.DealerForecourt, 10)
    if (valuation.ValuationList?.PrivateClean)
      mapped.ccd_private_value = Number.parseInt(valuation.ValuationList.PrivateClean, 10)
    if (valuation.ValuationTime) mapped.ccd_valuation_date = valuation.ValuationTime
  }

  console.log("[v0] Final mapped data:", mapped)
  return mapped
}
