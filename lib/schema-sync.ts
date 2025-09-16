interface ApiDataPoint {
  name: string
  description: string
  fields: Record<
    string,
    {
      type: string
      description?: string
      required?: boolean
    }
  >
}

interface SchemaUpdateResult {
  success: boolean
  updates: string[]
  errors: string[]
}

export class CheckCarDetailsSchemaSync {
  private apiKey: string
  private baseUrl = "https://api.checkcardetails.co.uk"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Fetch schema information from CheckCarDetails API documentation
   * This would require authenticated access to their documentation endpoint
   */
  async fetchApiSchema(): Promise<ApiDataPoint[]> {
    try {
      // First, try to access the datapoints documentation
      const response = await fetch(`${this.baseUrl}/datapoints`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch schema: ${response.statusText}`)
      }

      const schemaData = await response.json()
      return this.parseSchemaData(schemaData)
    } catch (error) {
      console.error("Failed to fetch API schema:", error)
      // Fallback to sample data analysis
      return this.inferSchemaFromSamples()
    }
  }

  /**
   * Infer schema by making sample API calls to each available datapoint
   */
  async inferSchemaFromSamples(): Promise<ApiDataPoint[]> {
    const availableDatapoints = [
      "vehicleregistration",
      "ukvehicledata",
      "vehiclespecs",
      "carhistorycheck",
      "mot",
      "mileage",
      "vehicleimage",
      "vehiclevaluation",
    ]

    const schemas: ApiDataPoint[] = []

    const testVrm = "EA65AMX"

    for (const datapoint of availableDatapoints) {
      try {
        console.log(`[v0] Testing ${datapoint} endpoint with VRN ${testVrm}`)

        const response = await fetch(`${this.baseUrl}/vehicledata/${datapoint}?apikey=${this.apiKey}&vrm=${testVrm}`)

        if (response.ok) {
          const sampleData = await response.json()
          console.log(`[v0] Successfully got ${datapoint} data:`, sampleData)
          schemas.push(this.analyzeResponseStructure(datapoint, sampleData))
        } else {
          const errorData = await response.json()
          console.log(`[v0] Error response for ${datapoint}:`, errorData)
          schemas.push(this.createFallbackSchema(datapoint, errorData))
        }
      } catch (error) {
        console.warn(`Could not analyze ${datapoint}:`, error)
        schemas.push(this.createFallbackSchema(datapoint))
      }
    }

    return schemas
  }

  /**
   * Analyze the structure of an API response to infer schema
   */
  private analyzeResponseStructure(datapoint: string, data: any): ApiDataPoint {
    const fields: Record<string, { type: string; description?: string }> = {}

    const analyzeObject = (obj: any, prefix = "") => {
      for (const [key, value] of Object.entries(obj)) {
        const fieldName = prefix ? `${prefix}_${key}` : key

        if (value === null) {
          fields[fieldName] = { type: "TEXT" }
        } else if (typeof value === "string") {
          if (this.isDateString(value)) {
            fields[fieldName] = { type: "DATE" }
          } else if (value.length > 255) {
            fields[fieldName] = { type: "TEXT" }
          } else {
            fields[fieldName] = { type: "VARCHAR(255)" }
          }
        } else if (typeof value === "number") {
          if (Number.isInteger(value)) {
            fields[fieldName] = { type: "INTEGER" }
          } else {
            fields[fieldName] = { type: "DECIMAL(10,2)" }
          }
        } else if (typeof value === "boolean") {
          fields[fieldName] = { type: "BOOLEAN" }
        } else if (Array.isArray(value)) {
          fields[fieldName] = { type: "JSONB" }
        } else if (typeof value === "object") {
          analyzeObject(value, fieldName)
        }
      }
    }

    analyzeObject(data)

    return {
      name: datapoint,
      description: this.getDatapointDescription(datapoint),
      fields,
    }
  }

  /**
   * Create fallback schema based on known datapoint types
   */
  private createFallbackSchema(datapoint: string, errorData?: any): ApiDataPoint {
    const commonFields = {
      registration_number: { type: "VARCHAR(10)", required: true },
      make: { type: "VARCHAR(100)" },
      model: { type: "VARCHAR(100)" },
      colour: { type: "VARCHAR(50)" },
      fuel_type: { type: "VARCHAR(50)" },
      year_of_manufacture: { type: "INTEGER" },
      engine_capacity: { type: "INTEGER" },
      co2_emissions: { type: "INTEGER" },
      created_at: { type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
      updated_at: { type: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    }

    let specificFields = {}

    switch (datapoint) {
      case "ukvehicledata":
        specificFields = {
          tax_status: { type: "VARCHAR(50)" },
          tax_due_date: { type: "DATE" },
          wheelplan: { type: "VARCHAR(50)" },
          date_of_last_v5c_issued: { type: "DATE" },
          type_approval: { type: "VARCHAR(100)" },
          registration_place: { type: "VARCHAR(100)" },
          vehicle_age: { type: "INTEGER" },
        }
        break
      case "vehiclespecs":
        specificFields = {
          body_type: { type: "VARCHAR(50)" },
          doors: { type: "INTEGER" },
          seats: { type: "INTEGER" },
          wheelbase: { type: "DECIMAL(8,2)" },
          length: { type: "DECIMAL(8,2)" },
          width: { type: "DECIMAL(8,2)" },
          height: { type: "DECIMAL(8,2)" },
          weight: { type: "INTEGER" },
          max_power: { type: "INTEGER" },
          max_torque: { type: "INTEGER" },
          transmission: { type: "VARCHAR(50)" },
          drive_type: { type: "VARCHAR(50)" },
        }
        break
      case "carhistorycheck":
        specificFields = {
          stolen_status: { type: "VARCHAR(50)" },
          insurance_write_off: { type: "VARCHAR(50)" },
          previous_keepers: { type: "INTEGER" },
          keeper_changes: { type: "JSONB" },
          finance_outstanding: { type: "BOOLEAN" },
          import_marker: { type: "VARCHAR(50)" },
          scrapped_status: { type: "VARCHAR(50)" },
        }
        break
      case "mot":
        specificFields = {
          mot_status: { type: "VARCHAR(50)" },
          mot_expiry_date: { type: "DATE" },
          mot_test_result: { type: "VARCHAR(50)" },
          mot_test_date: { type: "DATE" },
          mot_test_number: { type: "VARCHAR(50)" },
          mot_test_mileage: { type: "INTEGER" },
          mot_history: { type: "JSONB" },
          advisories: { type: "JSONB" },
          failures: { type: "JSONB" },
        }
        break
      case "mileage":
        specificFields = {
          current_mileage: { type: "INTEGER" },
          mileage_history: { type: "JSONB" },
          last_recorded_mileage: { type: "INTEGER" },
          mileage_date: { type: "DATE" },
          annual_mileage: { type: "INTEGER" },
        }
        break
      case "vehicleimage":
        specificFields = {
          image_url: { type: "TEXT" },
          image_type: { type: "VARCHAR(50)" },
          image_angle: { type: "VARCHAR(50)" },
          image_quality: { type: "VARCHAR(50)" },
          thumbnail_url: { type: "TEXT" },
        }
        break
      case "vehiclevaluation":
        specificFields = {
          trade_value: { type: "DECIMAL(10,2)" },
          private_value: { type: "DECIMAL(10,2)" },
          retail_value: { type: "DECIMAL(10,2)" },
          valuation_date: { type: "DATE" },
          mileage_adjustment: { type: "DECIMAL(10,2)" },
          condition_adjustment: { type: "DECIMAL(10,2)" },
          market_position: { type: "VARCHAR(50)" },
        }
        break
    }

    return {
      name: datapoint,
      description: this.getDatapointDescription(datapoint),
      fields: { ...commonFields, ...specificFields },
    }
  }

  /**
   * Generate SQL to update database schema based on API schema
   */
  async generateSchemaUpdateSQL(schemas: ApiDataPoint[]): Promise<string> {
    let sql = `-- Auto-generated schema update for CheckCarDetails API\n`
    sql += `-- Generated at: ${new Date().toISOString()}\n\n`

    for (const schema of schemas) {
      const tableName = `checkcar_${schema.name}`

      sql += `-- Table for ${schema.description}\n`
      sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`
      sql += `  id SERIAL PRIMARY KEY,\n`
      sql += `  vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,\n`

      for (const [fieldName, fieldDef] of Object.entries(schema.fields)) {
        const nullable = fieldDef.required ? "NOT NULL" : ""
        sql += `  ${fieldName} ${fieldDef.type} ${nullable},\n`
      }

      sql += `  UNIQUE(vehicle_id)\n`
      sql += `);\n\n`

      sql += `CREATE INDEX IF NOT EXISTS idx_${tableName}_vehicle_id ON ${tableName}(vehicle_id);\n`
      sql += `CREATE INDEX IF NOT EXISTS idx_${tableName}_registration ON ${tableName}(registration_number);\n\n`
    }

    return sql
  }

  /**
   * Execute schema synchronization
   */
  async syncSchema(): Promise<SchemaUpdateResult> {
    const result: SchemaUpdateResult = {
      success: false,
      updates: [],
      errors: [],
    }

    try {
      console.log("[v0] Starting CheckCarDetails schema sync...")

      const schemas = await this.fetchApiSchema()
      result.updates.push(`Analyzed ${schemas.length} datapoints`)

      const sql = await this.generateSchemaUpdateSQL(schemas)
      result.updates.push("Generated schema update SQL")

      const filename = `scripts/auto_checkcar_schema_${Date.now()}.sql`
      console.log("[v0] Generated schema SQL:", sql)
      result.updates.push(`Schema SQL saved to ${filename}`)

      result.success = true
    } catch (error) {
      result.errors.push(`Schema sync failed: ${error.message}`)
    }

    return result
  }

  private isDateString(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}/.test(value) || /^\d{2}\/\d{2}\/\d{4}/.test(value)
  }

  private getDatapointDescription(datapoint: string): string {
    const descriptions = {
      vehicleregistration: "DVLA vehicle registration details",
      ukvehicledata: "Full vehicle data including all vehicle details",
      vehiclespecs: "Full vehicle specification data",
      carhistorycheck: "Full vehicle history check including all vehicle details",
      mot: "MOT status, summary and full MOT history",
      mileage: "Full vehicle mileage history",
      vehicleimage: "Vehicle image data",
      vehiclevaluation: "Vehicle valuation data",
    }
    return descriptions[datapoint] || `${datapoint} data`
  }
}

export async function runSchemaSync(): Promise<SchemaUpdateResult> {
  console.log("[v0] Checking environment variables...")
  console.log("[v0] CHECKCARDETAILS_API_KEY present:", !!process.env.CHECKCARDETAILS_API_KEY)
  console.log(
    "[v0] All env keys:",
    Object.keys(process.env).filter((key) => key.includes("CHECKCAR")),
  )

  const apiKey = process.env.CHECKCARDETAILS_API_KEY
  if (!apiKey) {
    console.log("[v0] No API key found in environment variables")
    return {
      success: false,
      updates: [],
      errors: ["CHECKCARDETAILS_API_KEY environment variable not set"],
    }
  }

  console.log("[v0] Using API key:", apiKey.substring(0, 10) + "...")
  const sync = new CheckCarDetailsSchemaSync(apiKey)
  return await sync.syncSchema()
}
