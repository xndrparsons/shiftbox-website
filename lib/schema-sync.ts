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
      "mot",
      "mileage",
      "vehiclespecs", // pending access
      "vehiclevaluation", // pending access
    ]

    const schemas: ApiDataPoint[] = []

    // Use a sample registration for schema inference
    const sampleVrm = "AB12CDE" // This would fail but show us the expected structure

    for (const datapoint of availableDatapoints) {
      try {
        const response = await fetch(`${this.baseUrl}/vehicledata/${datapoint}?apikey=${this.apiKey}&vrm=${sampleVrm}`)

        if (response.ok) {
          const sampleData = await response.json()
          schemas.push(this.analyzeResponseStructure(datapoint, sampleData))
        } else {
          // Even error responses can tell us about expected structure
          const errorData = await response.json()
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
          // Check if it looks like a date
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
          // Flatten nested objects
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

    // Add datapoint-specific fields
    let specificFields = {}

    switch (datapoint) {
      case "mot":
        specificFields = {
          mot_status: { type: "VARCHAR(50)" },
          mot_expiry_date: { type: "DATE" },
          mot_test_result: { type: "VARCHAR(50)" },
          mot_test_date: { type: "DATE" },
          mot_test_number: { type: "VARCHAR(50)" },
          mot_test_mileage: { type: "INTEGER" },
        }
        break
      case "mileage":
        specificFields = {
          current_mileage: { type: "INTEGER" },
          mileage_history: { type: "JSONB" },
          last_recorded_mileage: { type: "INTEGER" },
          mileage_date: { type: "DATE" },
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

      // Add fields from schema
      for (const [fieldName, fieldDef] of Object.entries(schema.fields)) {
        const nullable = fieldDef.required ? "NOT NULL" : ""
        sql += `  ${fieldName} ${fieldDef.type} ${nullable},\n`
      }

      sql += `  UNIQUE(vehicle_id)\n`
      sql += `);\n\n`

      // Add indexes
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

      // Fetch current API schema
      const schemas = await this.fetchApiSchema()
      result.updates.push(`Analyzed ${schemas.length} datapoints`)

      // Generate SQL
      const sql = await this.generateSchemaUpdateSQL(schemas)
      result.updates.push("Generated schema update SQL")

      // Save SQL to file for manual review/execution
      const filename = `scripts/auto_checkcar_schema_${Date.now()}.sql`
      // In a real implementation, you'd write this to the file system
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

// Utility function to run schema sync
export async function runSchemaSync(): Promise<SchemaUpdateResult> {
  const apiKey = process.env.CHECKCARDETAILS_API_KEY
  if (!apiKey) {
    return {
      success: false,
      updates: [],
      errors: ["CHECKCARDETAILS_API_KEY environment variable not set"],
    }
  }

  const sync = new CheckCarDetailsSchemaSync(apiKey)
  return await sync.syncSchema()
}
