"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Database, KeyRound as Pound, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AVAILABLE_DATA_TABLES } from "@/lib/checkcardetails"

interface DataTableSelectorProps {
  onSelectionChange: (selectedTables: string[], totalCost: number) => void
  disabled?: boolean
  initialSelection?: string[]
}

export function DataTableSelector({
  onSelectionChange,
  disabled = false,
  initialSelection = [],
}: DataTableSelectorProps) {
  const [selectedTables, setSelectedTables] = useState<string[]>(initialSelection)
  const [totalCost, setTotalCost] = useState(0)
  const [currentPricing, setCurrentPricing] = useState<Record<string, number>>({})
  const [pricingLoaded, setPricingLoaded] = useState(false)

  const accessibleTables = [
    "vehicleregistration",
    "mot",
    "mileage",
    "vehiclespecs",
    "vehiclevaluation",
    "ukvehicledata",
    "carhistorycheck",
    "vehicleimage",
  ]
  const pendingAccessTables: string[] = []

  useEffect(() => {
    const fetchCurrentPricing = async () => {
      try {
        const response = await fetch("/api/checkcardetails-pricing")
        const result = await response.json()

        if (result.success && result.pricing?.tables) {
          setCurrentPricing(result.pricing.tables)
          console.log("[v0] Updated pricing loaded:", result.pricing.tables)
          Object.entries(result.pricing.tables).forEach(([table, price]) => {
            console.log(`[v0] Table ${table}: £${(price as number).toFixed(2)}`)
          })
        }
      } catch (error) {
        console.error("[v0] Error fetching current pricing:", error)
      } finally {
        setPricingLoaded(true)
      }
    }

    fetchCurrentPricing()
  }, [])

  useEffect(() => {
    const cost = selectedTables.reduce((sum, tableName) => {
      const tablePrice = currentPricing[tableName] || AVAILABLE_DATA_TABLES.find((t) => t.name === tableName)?.cost || 0
      return sum + tablePrice
    }, 0)
    setTotalCost(cost)
    onSelectionChange(selectedTables, cost)
  }, [selectedTables, currentPricing, onSelectionChange])

  const handleTableToggle = (tableName: string, checked: boolean) => {
    if (disabled) return
    if (!accessibleTables.includes(tableName)) return

    setSelectedTables((prev) => (checked ? [...prev, tableName] : prev.filter((t) => t !== tableName)))
  }

  const selectAll = () => {
    if (disabled) return
    setSelectedTables(accessibleTables)
  }

  const selectNone = () => {
    if (disabled) return
    setSelectedTables([])
  }

  const selectBasic = () => {
    if (disabled) return
    setSelectedTables(["vehicleregistration"])
  }

  const selectComplete = () => {
    if (disabled) return
    setSelectedTables(["vehicleregistration", "mot", "mileage"])
  }

  const getTableCost = (tableName: string) => {
    return currentPricing[tableName] || AVAILABLE_DATA_TABLES.find((t) => t.name === tableName)?.cost || 0
  }

  const getAllAccessibleCost = () => {
    return accessibleTables.reduce((sum, tableName) => sum + getTableCost(tableName), 0)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              CheckCarDetails Data Tables
              {pricingLoaded && Object.keys(currentPricing).length > 0 && (
                <Badge variant="outline" className="text-xs">
                  Live Pricing
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Select which data tables to fetch from CheckCarDetails API. Pricing is updated in real-time.
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-lg font-semibold">
              <Pound className="h-4 w-4" />
              {totalCost.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedTables.length} table{selectedTables.length !== 1 ? "s" : ""} selected
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={selectBasic} disabled={disabled}>
            Basic (£{getTableCost("vehicleregistration").toFixed(2)})
          </Button>
          <Button variant="outline" size="sm" onClick={selectComplete} disabled={disabled}>
            Complete (£
            {(getTableCost("vehicleregistration") + getTableCost("mot") + getTableCost("mileage")).toFixed(2)})
          </Button>
          <Button variant="outline" size="sm" onClick={selectAll} disabled={disabled}>
            All Available (£{getAllAccessibleCost().toFixed(2)})
          </Button>
          <Button variant="outline" size="sm" onClick={selectNone} disabled={disabled}>
            None
          </Button>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Currently accessible: {accessibleTables.length} tables
          </div>
          <div className="flex items-center gap-2 text-amber-600">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            Pending access: {pendingAccessTables.length} tables
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_DATA_TABLES.map((table) => {
            const isAccessible = accessibleTables.includes(table.name)
            const isPending = pendingAccessTables.includes(table.name)
            const currentCost = getTableCost(table.name)

            return (
              <div
                key={table.name}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                  selectedTables.includes(table.name)
                    ? "bg-primary/5 border-primary/20"
                    : "bg-background border-gray-200 dark:border-gray-700 hover:bg-muted/50"
                } ${disabled || !isAccessible ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() =>
                  isAccessible && !disabled && handleTableToggle(table.name, !selectedTables.includes(table.name))
                }
              >
                <Checkbox
                  id={table.name}
                  checked={selectedTables.includes(table.name)}
                  onCheckedChange={(checked) => handleTableToggle(table.name, !!checked)}
                  disabled={disabled || !isAccessible}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={table.name}
                      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        isAccessible ? "cursor-pointer" : "cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {table.label}
                        {!isAccessible && <Lock className="h-3 w-3" />}
                      </div>
                    </label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        £{currentCost.toFixed(2)}
                      </Badge>
                      {isPending && (
                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                          Pending
                        </Badge>
                      )}
                      {!isAccessible && !isPending && (
                        <Badge variant="outline" className="text-xs text-gray-500 border-gray-200">
                          Not Available
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{table.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {selectedTables.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> API calls will be charged immediately when data is fetched, regardless of
              whether you complete the vehicle listing. Total cost: £{totalCost.toFixed(2)}
            </AlertDescription>
          </Alert>
        )}

        {pendingAccessTables.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> You currently have access to {accessibleTables.join(", ")} tables. Access to{" "}
              {pendingAccessTables.join(", ")} is being requested and will be available once approved.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
