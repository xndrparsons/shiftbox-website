import { type NextRequest, NextResponse } from "next/server"
import { runSchemaSync } from "@/lib/schema-sync"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting CheckCarDetails schema synchronization...")

    const result = await runSchemaSync()

    if (result.success) {
      console.log("[v0] Schema sync completed successfully")
      return NextResponse.json({
        success: true,
        message: "Schema synchronization completed",
        updates: result.updates,
      })
    } else {
      console.log("[v0] Schema sync failed:", result.errors)
      return NextResponse.json(
        {
          success: false,
          message: "Schema synchronization failed",
          errors: result.errors,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Schema sync error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during schema sync",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "CheckCarDetails Schema Sync API",
    usage: "POST to this endpoint to trigger schema synchronization",
  })
}
