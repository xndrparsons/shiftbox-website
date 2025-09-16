"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TestTube, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TestResult {
  success: boolean
  message: string
  details?: string[]
  errors?: string[]
}

export function ApiTestButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "syncing" | "complete" | "error">("idle")
  const { toast } = useToast()

  const runApiTest = async (): Promise<boolean> => {
    console.log("[v0] Starting CheckCarDetails API test...")

    try {
      // Create a test API call to verify the API is working
      const response = await fetch("/api/checkcardetails-lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registration: "EA65AMX", // Test VRN
          tables: ["vehicleregistration"], // Just test basic registration
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        console.log("[v0] API test successful:", result)
        return true
      } else {
        console.log("[v0] API test failed:", result)
        return false
      }
    } catch (error) {
      console.error("[v0] API test error:", error)
      return false
    }
  }

  const runSchemaSync = async (): Promise<boolean> => {
    console.log("[v0] Starting schema sync...")

    try {
      const response = await fetch("/api/sync-checkcar-schema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (result.success) {
        console.log("[v0] Schema sync successful:", result.updates)
        return true
      } else {
        console.log("[v0] Schema sync failed:", result.errors)
        return false
      }
    } catch (error) {
      console.error("[v0] Schema sync error:", error)
      return false
    }
  }

  const handleTestAndSync = async () => {
    setIsLoading(true)
    setTestStatus("testing")

    try {
      // Step 1: Test the API
      console.log("[v0] Step 1: Testing CheckCarDetails API...")
      const apiTestSuccess = await runApiTest()

      if (!apiTestSuccess) {
        setTestStatus("error")
        toast({
          title: "API Test Failed",
          description: "CheckCarDetails API is not responding correctly. Check your API key configuration.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "API Test Passed",
        description: "CheckCarDetails API is working correctly.",
      })

      // Step 2: Run schema sync
      setTestStatus("syncing")
      console.log("[v0] Step 2: Running schema synchronization...")
      const schemaSyncSuccess = await runSchemaSync()

      if (!schemaSyncSuccess) {
        setTestStatus("error")
        toast({
          title: "Schema Sync Failed",
          description: "Could not synchronize database schema. Check the logs for details.",
          variant: "destructive",
        })
        return
      }

      // Success!
      setTestStatus("complete")
      toast({
        title: "Test & Sync Complete",
        description: "API test passed and database schema is synchronized. Ready for vehicle data fetching!",
      })
    } catch (error) {
      console.error("[v0] Test and sync process failed:", error)
      setTestStatus("error")
      toast({
        title: "Process Failed",
        description: "An unexpected error occurred during testing and synchronization.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonContent = () => {
    switch (testStatus) {
      case "testing":
        return (
          <>
            <TestTube className="h-4 w-4 mr-2 animate-pulse" />
            Testing API...
          </>
        )
      case "syncing":
        return (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Syncing Schema...
          </>
        )
      case "complete":
        return (
          <>
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            Ready to Fetch Data
          </>
        )
      case "error":
        return (
          <>
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            Test Failed - Retry
          </>
        )
      default:
        return (
          <>
            <TestTube className="h-4 w-4 mr-2" />
            Test API & Sync Schema
          </>
        )
    }
  }

  const getButtonVariant = () => {
    switch (testStatus) {
      case "complete":
        return "default" as const
      case "error":
        return "destructive" as const
      default:
        return "outline" as const
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Button onClick={handleTestAndSync} disabled={isLoading} variant={getButtonVariant()} size="sm">
        {getButtonContent()}
      </Button>

      {testStatus === "complete" && (
        <div className="text-sm text-green-600 font-medium">✓ System ready for vehicle data fetching</div>
      )}

      {testStatus === "error" && (
        <div className="text-sm text-red-600 font-medium">✗ Fix issues before fetching vehicle data</div>
      )}
    </div>
  )
}
