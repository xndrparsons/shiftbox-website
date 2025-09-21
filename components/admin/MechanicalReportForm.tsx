"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle, AlertTriangle, XCircle, Minus } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface MechanicalReportData {
  vehicle_id: string
  inspector_name?: string
  odometer_reading?: number

  // Dynamic operation checks
  brake_efficiency_test?: string
  hand_brake_test?: string
  static_gear_selection?: string
  clutch_slip_test?: string
  steering_noise?: string
  suspension_ride_height?: string
  aircon_power?: string
  sat_nav_functionality?: string
  ice_functionality?: string
  central_locking?: string
  convertible_electrics?: string
  horn?: string

  // Engine bay checks
  battery_health?: string
  coolant_system?: string
  power_steering_fluid?: string
  brake_fluid_level?: string
  engine_oil_level?: string
  oil_coolant_contamination?: string

  // Engine running checks
  engine_starts?: string
  engine_running?: string
  engine_smoking?: string
  aux_belt_noise?: string
  exhaust_secure?: string

  // Interior checks
  engine_management_light?: string
  brake_wear_indicator?: string
  abs_warning_light?: string
  oil_warning_light?: string
  airbag_warning_light?: string
  glow_plug_light?: string

  // Tyre tread measurements
  tyre_nsf_measurement?: string
  tyre_nsr_measurement?: string
  tyre_osf_measurement?: string
  tyre_osr_measurement?: string

  // Essential checks
  headlights_illuminate?: string
  sidelights_illuminate?: string
  brakelights_illuminate?: string
  foglights_illuminate?: string
  indicators_illuminate?: string
  electric_windows?: string
  electric_mirrors?: string
  wiper_washers?: string

  overall_grade?: string
  additional_notes?: string
}

const statusOptions = [
  { value: "ok", label: "OK", icon: CheckCircle, color: "text-green-600" },
  { value: "attention", label: "Requires some attention", icon: AlertTriangle, color: "text-yellow-600" },
  { value: "requires_attention", label: "Requires attention", icon: XCircle, color: "text-red-600" },
  { value: "not_applicable", label: "Not applicable", icon: Minus, color: "text-gray-400" },
  { value: "not_tested", label: "Not tested", icon: Minus, color: "text-gray-600" },
]

const StatusSelect = ({
  value,
  onValueChange,
  label,
}: { value?: string; onValueChange: (value: string) => void; label: string }) => {
  const selectedOption = statusOptions.find((opt) => opt.value === value)

  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-8">
          <SelectValue>
            {selectedOption && (
              <div className="flex items-center gap-2">
                <selectedOption.icon className={`h-3 w-3 ${selectedOption.color}`} />
                <span className="text-xs">{selectedOption.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <option.icon className={`h-3 w-3 ${option.color}`} />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function MechanicalReportForm({
  vehicleId,
  initialData,
  isEditing = false,
  reportId,
}: {
  vehicleId: string
  initialData?: MechanicalReportData
  isEditing?: boolean
  reportId?: string
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<MechanicalReportData>(
    initialData || {
      vehicle_id: vehicleId,
      overall_grade: "good",
    },
  )

  const supabase = createClient()

  const updateField = (field: keyof MechanicalReportData, value: string | number) => {
    setReportData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEditing && reportId) {
        const { error } = await supabase.from("vehicle_mechanical_reports").update(reportData).eq("id", reportId)

        if (error) throw error
      } else {
        const { error } = await supabase.from("vehicle_mechanical_reports").insert([reportData])

        if (error) throw error
      }

      router.push(`/admin/vehicles/${vehicleId}/reports`)
    } catch (error) {
      console.error("Error saving mechanical report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <CardTitle>Mechanical Health Report</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="inspector_name">Inspector Name</Label>
            <Input
              id="inspector_name"
              value={reportData.inspector_name || ""}
              onChange={(e) => updateField("inspector_name", e.target.value)}
              placeholder="Inspector name"
            />
          </div>
          <div>
            <Label htmlFor="odometer_reading">Odometer Reading</Label>
            <Input
              id="odometer_reading"
              type="number"
              value={reportData.odometer_reading || ""}
              onChange={(e) => updateField("odometer_reading", Number.parseInt(e.target.value))}
              placeholder="Miles"
            />
          </div>
          <div>
            <Label htmlFor="overall_grade">Overall Grade</Label>
            <Select value={reportData.overall_grade} onValueChange={(value) => updateField("overall_grade", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Operation */}
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Operation</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatusSelect
            value={reportData.brake_efficiency_test}
            onValueChange={(value) => updateField("brake_efficiency_test", value)}
            label="Brake efficiency test"
          />
          <StatusSelect
            value={reportData.hand_brake_test}
            onValueChange={(value) => updateField("hand_brake_test", value)}
            label="Hand brake test"
          />
          <StatusSelect
            value={reportData.static_gear_selection}
            onValueChange={(value) => updateField("static_gear_selection", value)}
            label="Static gear selection"
          />
          <StatusSelect
            value={reportData.clutch_slip_test}
            onValueChange={(value) => updateField("clutch_slip_test", value)}
            label="Clutch slip test"
          />
          <StatusSelect
            value={reportData.steering_noise}
            onValueChange={(value) => updateField("steering_noise", value)}
            label="Steering noise"
          />
          <StatusSelect
            value={reportData.suspension_ride_height}
            onValueChange={(value) => updateField("suspension_ride_height", value)}
            label="Suspension ride height"
          />
          <StatusSelect
            value={reportData.aircon_power}
            onValueChange={(value) => updateField("aircon_power", value)}
            label="A/C power"
          />
          <StatusSelect
            value={reportData.sat_nav_functionality}
            onValueChange={(value) => updateField("sat_nav_functionality", value)}
            label="Sat nav functionality"
          />
          <StatusSelect
            value={reportData.ice_functionality}
            onValueChange={(value) => updateField("ice_functionality", value)}
            label="ICE functionality"
          />
          <StatusSelect
            value={reportData.central_locking}
            onValueChange={(value) => updateField("central_locking", value)}
            label="Central locking"
          />
          <StatusSelect
            value={reportData.convertible_electrics}
            onValueChange={(value) => updateField("convertible_electrics", value)}
            label="Convertible electrics"
          />
          <StatusSelect value={reportData.horn} onValueChange={(value) => updateField("horn", value)} label="Horn" />
        </CardContent>
      </Card>

      {/* Engine Bay */}
      <Card>
        <CardHeader>
          <CardTitle>Engine Bay</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatusSelect
            value={reportData.battery_health}
            onValueChange={(value) => updateField("battery_health", value)}
            label="Battery health"
          />
          <StatusSelect
            value={reportData.coolant_system}
            onValueChange={(value) => updateField("coolant_system", value)}
            label="Coolant system"
          />
          <StatusSelect
            value={reportData.power_steering_fluid}
            onValueChange={(value) => updateField("power_steering_fluid", value)}
            label="Power steering fluid"
          />
          <StatusSelect
            value={reportData.brake_fluid_level}
            onValueChange={(value) => updateField("brake_fluid_level", value)}
            label="Brake fluid level"
          />
          <StatusSelect
            value={reportData.engine_oil_level}
            onValueChange={(value) => updateField("engine_oil_level", value)}
            label="Engine oil level"
          />
          <StatusSelect
            value={reportData.oil_coolant_contamination}
            onValueChange={(value) => updateField("oil_coolant_contamination", value)}
            label="Oil/coolant contamination"
          />
        </CardContent>
      </Card>

      {/* Engine Running */}
      <Card>
        <CardHeader>
          <CardTitle>Engine Running</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatusSelect
            value={reportData.engine_starts}
            onValueChange={(value) => updateField("engine_starts", value)}
            label="Engine starts"
          />
          <StatusSelect
            value={reportData.engine_running}
            onValueChange={(value) => updateField("engine_running", value)}
            label="Engine running"
          />
          <StatusSelect
            value={reportData.engine_smoking}
            onValueChange={(value) => updateField("engine_smoking", value)}
            label="Engine smoking"
          />
          <StatusSelect
            value={reportData.aux_belt_noise}
            onValueChange={(value) => updateField("aux_belt_noise", value)}
            label="Aux belt noise"
          />
          <StatusSelect
            value={reportData.exhaust_secure}
            onValueChange={(value) => updateField("exhaust_secure", value)}
            label="Exhaust secure"
          />
        </CardContent>
      </Card>

      {/* Interior Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Interior Checks</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatusSelect
            value={reportData.engine_management_light}
            onValueChange={(value) => updateField("engine_management_light", value)}
            label="Engine management light"
          />
          <StatusSelect
            value={reportData.brake_wear_indicator}
            onValueChange={(value) => updateField("brake_wear_indicator", value)}
            label="Brake wear indicator"
          />
          <StatusSelect
            value={reportData.abs_warning_light}
            onValueChange={(value) => updateField("abs_warning_light", value)}
            label="ABS warning light"
          />
          <StatusSelect
            value={reportData.oil_warning_light}
            onValueChange={(value) => updateField("oil_warning_light", value)}
            label="Oil warning light"
          />
          <StatusSelect
            value={reportData.airbag_warning_light}
            onValueChange={(value) => updateField("airbag_warning_light", value)}
            label="Airbag warning light"
          />
          <StatusSelect
            value={reportData.glow_plug_light}
            onValueChange={(value) => updateField("glow_plug_light", value)}
            label="Glow plug light"
          />
        </CardContent>
      </Card>

      {/* Tyre Tread */}
      <Card>
        <CardHeader>
          <CardTitle>Tyre Tread Measurements</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="tyre_nsf">NSF (mm)</Label>
            <Input
              id="tyre_nsf"
              value={reportData.tyre_nsf_measurement || ""}
              onChange={(e) => updateField("tyre_nsf_measurement", e.target.value)}
              placeholder="e.g. 4.5"
            />
          </div>
          <div>
            <Label htmlFor="tyre_nsr">NSR (mm)</Label>
            <Input
              id="tyre_nsr"
              value={reportData.tyre_nsr_measurement || ""}
              onChange={(e) => updateField("tyre_nsr_measurement", e.target.value)}
              placeholder="e.g. 4.2"
            />
          </div>
          <div>
            <Label htmlFor="tyre_osf">OSF (mm)</Label>
            <Input
              id="tyre_osf"
              value={reportData.tyre_osf_measurement || ""}
              onChange={(e) => updateField("tyre_osf_measurement", e.target.value)}
              placeholder="e.g. 4.8"
            />
          </div>
          <div>
            <Label htmlFor="tyre_osr">OSR (mm)</Label>
            <Input
              id="tyre_osr"
              value={reportData.tyre_osr_measurement || ""}
              onChange={(e) => updateField("tyre_osr_measurement", e.target.value)}
              placeholder="e.g. 4.1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Essential Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Essential Checks</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatusSelect
            value={reportData.headlights_illuminate}
            onValueChange={(value) => updateField("headlights_illuminate", value)}
            label="Headlights illuminate"
          />
          <StatusSelect
            value={reportData.sidelights_illuminate}
            onValueChange={(value) => updateField("sidelights_illuminate", value)}
            label="Sidelights illuminate"
          />
          <StatusSelect
            value={reportData.brakelights_illuminate}
            onValueChange={(value) => updateField("brakelights_illuminate", value)}
            label="Brakelights illuminate"
          />
          <StatusSelect
            value={reportData.foglights_illuminate}
            onValueChange={(value) => updateField("foglights_illuminate", value)}
            label="Foglights illuminate"
          />
          <StatusSelect
            value={reportData.indicators_illuminate}
            onValueChange={(value) => updateField("indicators_illuminate", value)}
            label="Indicators illuminate"
          />
          <StatusSelect
            value={reportData.electric_windows}
            onValueChange={(value) => updateField("electric_windows", value)}
            label="Electric windows"
          />
          <StatusSelect
            value={reportData.electric_mirrors}
            onValueChange={(value) => updateField("electric_mirrors", value)}
            label="Electric mirrors"
          />
          <StatusSelect
            value={reportData.wiper_washers}
            onValueChange={(value) => updateField("wiper_washers", value)}
            label="Wiper/washers"
          />
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={reportData.additional_notes || ""}
            onChange={(e) => updateField("additional_notes", e.target.value)}
            placeholder="Any additional observations or notes about the vehicle's mechanical condition..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {isEditing ? "Update Report" : "Save Report"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
