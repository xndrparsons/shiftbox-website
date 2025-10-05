"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const middlewareDisabled = process.env.NEXT_PUBLIC_DISABLE_MIDDLEWARE === "true"
    if (middlewareDisabled) {
      console.log("[v0] Middleware disabled - auto-redirecting to dashboard")
      router.push("/admin/dashboard")
    }
  }, [router])

  const handleBypass = () => {
    console.log("[v0] Using temporary admin bypass for debugging")
    document.cookie = "admin_debug_bypass=true; path=/; max-age=86400; SameSite=Lax"

    window.location.href = "/admin/dashboard"
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const supabase = createClient()

      console.log("[v0] Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log("[v0] Supabase client created:", !!supabase)
      console.log("[v0] Attempting login with email:", email)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("[v0] Login response error:", error)

      if (error) {
        console.log("[v0] Login failed with error:", error.message)
        setError(error.message)
      } else {
        console.log("[v0] Login successful, redirecting to admin")
        router.push("/admin")
      }
    } catch (err) {
      console.log("[v0] Caught exception during login:", err)
      console.log("[v0] Exception type:", typeof err)
      console.log("[v0] Exception details:", JSON.stringify(err, null, 2))
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Shiftbox Admin</CardTitle>
          <CardDescription>Sign in to manage your website</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleBypass}>
              🚧 Temporary Bypass (Debug Mode)
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">For development and debugging purposes only</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
