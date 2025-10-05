"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase"
import { Eye, EyeOff, Save, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FieldVisibility {
  id?: number
  vehicle_id: string
  field_name: string
  field_category: "dvla" | "checkcardetails"
  is_visible: boolean
  display_name: string
}

interface FieldToggleSystemProps {
  vehicleId: string
  fieldName: string
  fieldCategory: "dvla" | "checkcardetails"
  currentValue: any
  defaultDisplayName: string
  children: React.ReactNode
}

export function FieldToggleSystem({
  vehicleId,
  fieldName,
  fieldCategory,
  currentValue,
  defaultDisplayName,
  children,
}: FieldToggleSystemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [displayName, setDisplayName] = useState(defaultDisplayName)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const supabase = createClient()

  const hasValidVehicleId = vehicleId && vehicleId.trim() !== ""

  useEffect(() => {
    const loadVisibility = async () => {
      if (!hasValidVehicleId) {
        // For new vehicles without ID, default to not visible
        setIsVisible(false)
        setDisplayName(defaultDisplayName)
        return
      }

      try {
        const { data, error } = await supabase
          .from("vehicle_field_visibility")
          .select("*")
          .eq("vehicle_id", vehicleId)
          .eq("field_name", fieldName)
          .single()

        if (data && !error) {
          setIsVisible(data.is_visible)
          setDisplayName(data.display_name || defaultDisplayName)
        } else {
          const { error: insertError } = await supabase.from("vehicle_field_visibility").insert({
            vehicle_id: vehicleId,
            field_name: fieldName,
            field_category: fieldCategory,
            is_visible: false,
            display_name: defaultDisplayName,
          })

          if (insertError) {
            console.error("Error creating field visibility entry:", insertError)
          }
        }
      } catch (error) {
        console.error("Error loading field visibility:", error)
      }
    }

    loadVisibility()
  }, [vehicleId, fieldName, fieldCategory, defaultDisplayName, supabase, hasValidVehicleId])

  const handleVisibilityChange = async (checked: boolean) => {
    if (!hasValidVehicleId) {
      setIsVisible(checked)
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.from("vehicle_field_visibility").upsert(
        {
          vehicle_id: vehicleId,
          field_name: fieldName,
          field_category: fieldCategory,
          is_visible: checked,
          display_name: displayName,
        },
        {
          onConflict: "vehicle_id,field_name",
        },
      )

      if (error) throw error

      setIsVisible(checked)
    } catch (error) {
      console.error("Error updating field visibility:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisplayNameChange = async () => {
    if (!hasValidVehicleId) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.from("vehicle_field_visibility").upsert(
        {
          vehicle_id: vehicleId,
          field_name: fieldName,
          field_category: fieldCategory,
          is_visible: isVisible,
          display_name: displayName,
        },
        {
          onConflict: "vehicle_id,field_name",
        },
      )

      if (error) throw error

      setIsEditing(false)
    } catch (error) {
      console.error("Error updating display name:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (currentValue === undefined || currentValue === null || currentValue === "") {
    return null
  }

  return (
    <TooltipProvider>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 hover:bg-gray-100"
                onClick={() => handleVisibilityChange(!isVisible)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                ) : isVisible ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isVisible ? "Hide from customers" : "Show to customers"}</p>
            </TooltipContent>
          </Tooltip>
          <span className="text-sm font-medium text-gray-700">{defaultDisplayName}</span>
        </div>

        {children}

        {isVisible && (
          <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-200">
            <div className="flex items-center gap-2">
              <Label className="text-xs font-medium text-blue-800">Customer display name:</Label>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-6 text-xs"
                    size={displayName.length + 5}
                  />
                  <Button size="sm" variant="ghost" onClick={handleDisplayNameChange} disabled={isLoading}>
                    <Save className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <span
                  className="text-xs text-blue-700 cursor-pointer hover:underline"
                  onClick={() => setIsEditing(true)}
                >
                  "{displayName}"
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

interface BulkFieldToggleProps {
  vehicleId: string
  category: "dvla" | "checkcardetails"
  fields: Array<{
    fieldName: string
    displayName: string
    hasValue: boolean
  }>
}

export function BulkFieldToggle({ vehicleId, category, fields }: BulkFieldToggleProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const hasValidVehicleId = vehicleId && vehicleId.trim() !== ""

  const handleBulkToggle = async (visible: boolean) => {
    if (!hasValidVehicleId) {
      console.log("Cannot bulk toggle visibility without a valid vehicle ID")
      return
    }

    setIsLoading(true)
    try {
      const fieldsWithValues = fields.filter((field) => field.hasValue)

      const upsertData = fieldsWithValues.map((field) => ({
        vehicle_id: vehicleId,
        field_name: field.fieldName,
        field_category: category,
        is_visible: visible,
        display_name: field.displayName,
      }))

      const { error } = await supabase.from("vehicle_field_visibility").upsert(upsertData)

      if (error) throw error

      window.location.reload()
    } catch (error) {
      console.error("Error bulk updating field visibility:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fieldsWithValues = fields.filter((field) => field.hasValue)

  if (fieldsWithValues.length === 0) return null

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">
          {category === "dvla" ? "DVLA" : "CheckCarDetails"} Field Visibility Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkToggle(true)}
            disabled={isLoading || !hasValidVehicleId}
            className="text-xs"
          >
            {isLoading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Eye className="h-3 w-3 mr-1" />}
            Show All ({fieldsWithValues.length})
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkToggle(false)}
            disabled={isLoading || !hasValidVehicleId}
            className="text-xs"
          >
            {isLoading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <EyeOff className="h-3 w-3 mr-1" />}
            Hide All
          </Button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {hasValidVehicleId
            ? `Control which ${category === "dvla" ? "DVLA" : "CheckCarDetails"} fields are visible to customers on the vehicle detail page.`
            : "Visibility controls will be available after saving the vehicle."}
        </p>
      </CardContent>
    </Card>
  )
}
