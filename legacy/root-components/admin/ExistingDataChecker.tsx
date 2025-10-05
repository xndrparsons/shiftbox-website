"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Loader2, CheckCircle, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface ExistingDataResult {
  exists: boolean
  vehicle?: {
    registration: string
    make?: string
    model?: string
    year?: number
    ccd_last_fetched?: string
    ccd_fetch_cost?: number
    ccd_tables_fetched?: string[]
  }
}

export function ExistingDataChecker() {
  const [registration, setRegistration] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<ExistingDataResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleCheck = async () => {
    if (!registration.trim()) return

    setIsChecking(true)
    setError(null)
    setResult(null)

    try {
      const { data, error: queryError } = await supabase
        .from("vehicles")
        .select("registration, make, model, year, ccd_last_fetched, ccd_fetch_cost, ccd_tables_fetched")
        .eq("registration", registration.trim().toUpperCase())
        .maybeSingle()

      if (queryError) {
        throw queryError
      }

      if (data) {
        setResult({
          exists: true,
          vehicle: data,
        })
      } else {
        setResult({
          exists: false,
        })
      }
    } catch (err) {
      console.error("Error checking existing data:", err)
      setError(`Failed to check for existing data: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsChecking(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Check for Existing Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="check-registration">Registration Number</Label>
            <Input
              id="check-registration"
              value={registration}
              onChange={(e) => {
                setRegistration(e.target.value.toUpperCase())
                setResult(null)
                setError(null)
              }}
              placeholder="e.g. AB21 CDE"
              className="uppercase"
              onKeyPress={(e) => e.key === "Enter" && handleCheck()}
            />
          </div>
          <div className="flex items-end">
            <Button type="button" onClick={handleCheck} disabled={!registration.trim() || isChecking}>
              {isChecking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              Check
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert variant={result.exists ? "default" : "destructive"}>
            {result.exists ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4" />}
            <AlertDescription>
              {result.exists ? (
                <div className="space-y-2">
                  <p className="font-medium text-green-700">✅ Vehicle data exists for {registration}</p>
                  {result.vehicle && (
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Vehicle:</strong> {result.vehicle.make} {result.vehicle.model}{" "}
                        {result.vehicle.year && `(${result.vehicle.year})`}
                      </p>
                      <p>
                        <strong>Last CheckCarDetails fetch:</strong> {formatDate(result.vehicle.ccd_last_fetched)}
                      </p>
                      {result.vehicle.ccd_fetch_cost && (
                        <p>
                          <strong>Previous fetch cost:</strong> £{result.vehicle.ccd_fetch_cost.toFixed(2)}
                        </p>
                      )}
                      {result.vehicle.ccd_tables_fetched && result.vehicle.ccd_tables_fetched.length > 0 && (
                        <p>
                          <strong>Data tables fetched:</strong> {result.vehicle.ccd_tables_fetched.join(", ")}
                        </p>
                      )}
                      <p className="text-amber-600 font-medium">
                        ⚠️ Making another CheckCarDetails call will incur additional costs
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="font-medium">❌ No existing data found for {registration}</p>
                  <p className="text-sm text-muted-foreground">
                    This registration is safe to fetch - no previous CheckCarDetails calls made
                  </p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-muted-foreground">
          Use this tool to check if CheckCarDetails data has already been fetched for a vehicle registration, helping
          you avoid duplicate API calls and unnecessary costs.
        </p>
      </CardContent>
    </Card>
  )
}
