"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SyncResult {
  success: boolean
  updates?: string[]
  errors?: string[]
}

export function SchemaSyncButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const { toast } = useToast()

  const handleSync = async () => {
    setIsLoading(true)

    try {
      console.log("[v0] Triggering schema sync...")

      const response = await fetch("/api/sync-checkcar-schema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result: SyncResult = await response.json()

      if (result.success) {
        console.log("[v0] Schema sync successful:", result.updates)
        setLastSync(new Date())
        toast({
          title: "Schema Sync Complete",
          description: `Successfully synchronized ${result.updates?.length || 0} schema updates`,
        })
      } else {
        console.log("[v0] Schema sync failed:", result.errors)
        toast({
          title: "Schema Sync Failed",
          description: result.errors?.join(", ") || "Unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Schema sync request failed:", error)
      toast({
        title: "Sync Request Failed",
        description: "Could not connect to schema sync service",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Button onClick={handleSync} disabled={isLoading} variant="outline" size="sm">
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
        {isLoading ? "Syncing Schema..." : "Sync API Schema"}
      </Button>

      {lastSync && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-green-500" />
          Last synced: {lastSync.toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}
