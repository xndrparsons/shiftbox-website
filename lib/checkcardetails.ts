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
    cost: 0.15,
  },
  {
    name: "mot",
    label: "MOT Data",
    description: "Includes MOT status, summary and full MOT history",
    cost: 0.2,
  },
  {
    name: "mileage",
    label: "Mileage History",
    description: "Full vehicle mileage history",
    cost: 0.18,
  },
  // Tables user is trying to get access to
  {
    name: "vehiclespecs",
    label: "Vehicle Specifications",
    description: "Full vehicle specification data",
    cost: 0.25,
  },
  {
    name: "vehiclevaluation",
    label: "Vehicle Valuation",
    description: "Vehicle valuation data",
    cost: 0.3,
  },
  // Other available tables (for future use)
  {
    name: "ukvehicledata",
    label: "UK Vehicle Data",
    description: "Full vehicle data including all vehicle details",
    cost: 0.35,
  },
  {
    name: "carhistorycheck",
    label: "Car History Check",
    description: "Full vehicle history check including all vehicle details",
    cost: 0.4,
  },
  {
    name: "vehicleimage",
    label: "Vehicle Image",
    description: "Vehicle image data",
    cost: 0.1,
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
    try {
      const pricingData = await this.fetchCurrentPricing()

      if (pricingData && pricingData.tables) {
        // Update table costs with current pricing
        return AVAILABLE_DATA_TABLES.map((table) => ({
          ...table,
          cost: pricingData.tables[table.name] || table.cost,
        }))
      }
    } catch (error) {
      console.error("[v0] Error fetching current pricing, using default:", error)
    }

    // Fallback to default pricing
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
    const apiKey = process.env.CHECKCARDETAILS_LIVE_API_KEY
    if (!apiKey) {
      throw new Error("CHECKCARDETAILS_LIVE_API_KEY environment variable not set")
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
  }

  // Map vehicleregistration data
  if (data.vehicleregistration) {
    const vr = data.vehicleregistration

    // Update core fields if available
    if (vr.Make) {
      mapped.make = vr.Make
    } else if (vr.MakeModel) {
      // Try to extract make from MakeModel string (e.g., "FORD FOCUS" -> "FORD")
      const makeModelParts = vr.MakeModel.split(" ")
      mapped.make = makeModelParts[0] || "Unknown"
    }

    if (vr.Model) {
      mapped.model = vr.Model
    } else if (vr.MakeModel) {
      // Try to extract model from MakeModel string (e.g., "FORD FOCUS" -> "FOCUS")
      const makeModelParts = vr.MakeModel.split(" ")
      mapped.model = makeModelParts.slice(1).join(" ") || "Unknown"
    }

    if (vr.FuelType) {
      mapped.fuel_type = vr.FuelType
    }
    if (vr.Transmission) {
      mapped.transmission = vr.Transmission
    }

    // Map all other vehicleregistration fields with null checks
    if (vr.DateOfLastUpdate) mapped.ccd_date_of_last_update = vr.DateOfLastUpdate
    if (vr.VehicleClass) mapped.ccd_vehicle_class = vr.VehicleClass
    if (vr.Vin) mapped.ccd_vin = vr.Vin
    if (vr.EngineNumber) mapped.ccd_engine_number = vr.EngineNumber
    if (vr.MakeModel) mapped.ccd_make_model = vr.MakeModel
    if (vr.Model) mapped.ccd_model = vr.Model
    if (vr.DateFirstRegistered) mapped.ccd_date_first_registered = vr.DateFirstRegistered
    if (vr.DateFirstRegisteredUk) mapped.ccd_date_first_registered_uk = vr.DateFirstRegisteredUk
    if (vr.EngineCapacity) mapped.ccd_engine_capacity = vr.EngineCapacity
    if (vr.Co2Emissions) mapped.ccd_co2_emissions = vr.Co2Emissions
  }

  // Map MOT data with null checks
  if (data.mot) {
    const mot = data.mot
    if (mot.MotStatus) mapped.ccd_mot_status = mot.MotStatus
    if (mot.MotExpiryDate) mapped.ccd_mot_expiry_date = mot.MotExpiryDate
    if (mot.MotTestResult) mapped.ccd_mot_test_result = mot.MotTestResult
    if (mot.MotTestDate) mapped.ccd_mot_test_date = mot.MotTestDate
    if (mot.MotTestNumber) mapped.ccd_mot_test_number = mot.MotTestNumber
    if (mot.MotTestMileage) mapped.ccd_mot_test_mileage = mot.MotTestMileage
  }

  // Map mileage data with null checks
  if (data.mileage) {
    const mileage = data.mileage
    if (mileage.CurrentMileage) mapped.ccd_current_mileage = mileage.CurrentMileage
    if (mileage.MileageHistory) mapped.ccd_mileage_history = JSON.stringify(mileage.MileageHistory)
    if (mileage.AverageAnnualMileage) mapped.ccd_average_annual_mileage = mileage.AverageAnnualMileage
  }

  // Map vehiclespecs data with null checks (when available)
  if (data.vehiclespecs) {
    const specs = data.vehiclespecs
    if (specs.EnginePower) mapped.ccd_engine_power = specs.EnginePower
    if (specs.MaxSpeed) mapped.ccd_max_speed = specs.MaxSpeed
    if (specs.Acceleration) mapped.ccd_acceleration = specs.Acceleration
    if (specs.FuelConsumption) mapped.ccd_fuel_consumption = specs.FuelConsumption
    if (specs.Dimensions) mapped.ccd_dimensions = JSON.stringify(specs.Dimensions)
    if (specs.Weight) mapped.ccd_weight = specs.Weight
  }

  // Map vehiclevaluation data with null checks (when available)
  if (data.vehiclevaluation) {
    const valuation = data.vehiclevaluation
    if (valuation.TradeValue) mapped.ccd_trade_value = valuation.TradeValue
    if (valuation.RetailValue) mapped.ccd_retail_value = valuation.RetailValue
    if (valuation.PrivateValue) mapped.ccd_private_value = valuation.PrivateValue
    if (valuation.ValuationDate) mapped.ccd_valuation_date = valuation.ValuationDate
  }

  return mapped
}
