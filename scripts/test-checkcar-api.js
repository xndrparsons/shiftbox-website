async function testCheckCarDetailsAPI() {
  console.log("🚀 Testing CheckCarDetails API access...")

  const testApiKey = process.env.CHECKCARDETAILS_TEST_API_KEY
  if (!testApiKey) {
    console.error("❌ CHECKCARDETAILS_TEST_API_KEY not found in environment variables")
    return
  }

  console.log("✅ Test API key found")
  console.log("🔍 Testing with VRN: EA65AMX")

  // Test different data tables available
  const testTables = [
    "vehicleregistration",
    "mot",
    "mileage",
    "vehiclespecs",
    "vehiclevaluation",
    "ukvehicledata",
    "carhistorycheck",
    "vehicleimage"
  ]

  console.log("📋 Testing available data tables...")

  for (const table of testTables) {
    try {
      console.log(`\n🔍 Testing table: ${table}`)

      const url = `https://api.checkcardetails.co.uk/vehicledata/${table}?apikey=${testApiKey}&vrm=EA65AMX`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "ShiftBox-Vehicle-System/1.0",
        },
      })

      console.log(`  Status: ${response.status} ${response.statusText}`)

      if (response.ok) {
        const data = await response.json()
        console.log(`  ✅ ${table} - Success!`)
        console.log(`  📊 Response keys:`, Object.keys(data))

        // Log sample structure (first 200 chars)
        const sample = JSON.stringify(data, null, 2).substring(0, 200)
        console.log(`  🔍 Sample structure: ${sample}...`)
      } else {
        const errorText = await response.text()
        console.log(`  ❌ ${table} - Failed: ${errorText}`)
      }
    } catch (error) {
      console.log(`  💥 ${table} - Error: ${error.message}`)
    }
  }

  console.log("\n🎯 Test completed! Check results above to see which tables are accessible.")
}

// Run the test
testCheckCarDetailsAPI()
