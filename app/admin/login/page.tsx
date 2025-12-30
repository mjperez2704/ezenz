"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Sparkles, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [checkingSetup, setCheckingSetup] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkIfNeedsSetup()
  }, [])

  const checkIfNeedsSetup = async () => {
    try {
      const response = await fetch("/api/admin/check-setup")
      const data = await response.json()

      if (data.needsSetup) {
        router.push("/admin/setup")
      }
    } catch (error) {
      // En caso de error, permitir continuar al login
    } finally {
      setCheckingSetup(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión")
      }

      router.push("/admin")
      router.refresh()
    } catch (error: unknown) {
      console.error("[v0] Error en handleLogin:", error)
      setError(error instanceof Error ? error.message : "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  if (checkingSetup) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center p-6"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Card className="w-full max-w-sm shadow-2xl">
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Verificando configuración...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="w-full max-w-sm">
        <Card className="shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 text-purple-600">
                <Sparkles className="h-8 w-8" />
                <span className="text-2xl font-bold font-condor">STARDUST</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Backoffice</CardTitle>
            <CardDescription>Ingresa tus credenciales de administrador</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@stardust.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-xs text-muted-foreground"
                    onClick={() => router.push("/admin/setup")}
                  >
                    ¿Primera vez? Crear primer administrador
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
