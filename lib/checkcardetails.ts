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

class CheckCarDetailsAPI {
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
    const apiKey = process.env.CHECKCARDETAILS_API_KEY
    if (!apiKey) {
      throw new Error("CHECKCARDETAILS_API_KEY environment variable not set")
    }
    checkCarDetailsAPI = new CheckCarDetailsAPI({ apiKey })
  }
  return checkCarDetailsAPI
}

// Helper function to map API response to database fields
export function mapCheckCarDetailsToDatabase(data: any, tablesFetched: string[]) {
  const mapped: Record<string, any> = {
    ccd_tables_fetched: tablesFetched,
    ccd_last_fetched: new Date(),
  }

  // Map vehicleregistration data
  if (data.vehicleregistration) {
    const vr = data.vehicleregistration
    mapped.ccd_date_of_last_update = vr.DateOfLastUpdate
    mapped.ccd_vehicle_class = vr.VehicleClass
    mapped.ccd_vin = vr.Vin
    mapped.ccd_engine_number = vr.EngineNumber
    mapped.ccd_make_model = vr.MakeModel
    mapped.ccd_model = vr.Model
    mapped.ccd_date_first_registered = vr.DateFirstRegistered
    mapped.ccd_date_first_registered_uk = vr.DateFirstRegisteredUk
    mapped.ccd_transmission = vr.Transmission
    mapped.ccd_fuel_type = vr.FuelType
    mapped.ccd_engine_capacity = vr.EngineCapacity
    mapped.ccd_co2_emissions = vr.Co2Emissions
  }

  // Map MOT data
  if (data.mot) {
    const mot = data.mot
    mapped.ccd_mot_status = mot.MotStatus
    mapped.ccd_mot_expiry_date = mot.MotExpiryDate
    mapped.ccd_mot_test_result = mot.MotTestResult
    mapped.ccd_mot_test_date = mot.MotTestDate
    mapped.ccd_mot_test_number = mot.MotTestNumber
    mapped.ccd_mot_test_mileage = mot.MotTestMileage
  }

  // Map mileage data
  if (data.mileage) {
    const mileage = data.mileage
    mapped.ccd_current_mileage = mileage.CurrentMileage
    mapped.ccd_mileage_history = JSON.stringify(mileage.MileageHistory)
    mapped.ccd_average_annual_mileage = mileage.AverageAnnualMileage
  }

  // Map vehiclespecs data (when available)
  if (data.vehiclespecs) {
    const specs = data.vehiclespecs
    mapped.ccd_engine_power = specs.EnginePower
    mapped.ccd_max_speed = specs.MaxSpeed
    mapped.ccd_acceleration = specs.Acceleration
    mapped.ccd_fuel_consumption = specs.FuelConsumption
    mapped.ccd_dimensions = JSON.stringify(specs.Dimensions)
    mapped.ccd_weight = specs.Weight
  }

  // Map vehiclevaluation data (when available)
  if (data.vehiclevaluation) {
    const valuation = data.vehiclevaluation
    mapped.ccd_trade_value = valuation.TradeValue
    mapped.ccd_retail_value = valuation.RetailValue
    mapped.ccd_private_value = valuation.PrivateValue
    mapped.ccd_valuation_date = valuation.ValuationDate
  }

  return mapped
}
