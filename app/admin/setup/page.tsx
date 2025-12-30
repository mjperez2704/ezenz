"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"

export default function AdminSetupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasAdmins, setHasAdmins] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkExistingAdmins()
  }, [])

  const checkExistingAdmins = async () => {
    try {
      console.log("[v0] Verificando si existen administradores...")
      const supabase = createClient()
      const { count, error } = await supabase.from("admin_users").select("*", { count: "exact", head: true })

      console.log("[v0] Resultado de verificación:", { count, error })

      if (error) {
        console.error("[v0] Error al verificar admins:", error)
      }

      if (count && count > 0) {
        console.log("[v0] Ya existen administradores")
        setHasAdmins(true)
      } else {
        console.log("[v0] No hay administradores, permitir setup")
      }
    } catch (error) {
      console.error("[v0] Error al verificar admins existentes:", error)
    } finally {
      setChecking(false)
    }
  }

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      console.log("[v0] Paso 1: Creando usuario en Supabase Auth...")

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/admin/login`,
        },
      })

      console.log("[v0] Resultado de signUp:", { authData, authError })

      if (authError) {
        console.error("[v0] Error al crear usuario en Auth:", authError)
        throw new Error(`Error al crear usuario: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error("No se pudo crear el usuario en Supabase Auth")
      }

      console.log("[v0] Paso 2: Usuario creado en Auth con ID:", authData.user.id)
      console.log("[v0] Paso 3: Insertando en tabla admin_users...")

      const { data: insertData, error: insertError } = await supabase
        .from("admin_users")
        .insert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
          role: "super_admin",
          is_active: true,
        })
        .select()

      console.log("[v0] Resultado de inserción:", { insertData, insertError })

      if (insertError) {
        console.error("[v0] Error al insertar en admin_users:", insertError)
        throw new Error(`Error al crear perfil de administrador: ${insertError.message}`)
      }

      console.log("[v0] ¡Administrador creado exitosamente!")
      setSuccess(true)

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push("/admin/login")
      }, 3000)
    } catch (error: unknown) {
      console.error("[v0] Error en handleSetup:", error)
      setError(error instanceof Error ? error.message : "Error desconocido al crear administrador")
    } finally {
      setIsLoading(false)
    }
  }

  if (checking) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center p-6"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Verificando configuración...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (hasAdmins) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center p-6"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 text-purple-600">
                <Sparkles className="h-8 w-8" />
                <span className="text-2xl font-bold">STARDUST</span>
              </div>
            </div>
            <CardTitle>Configuración Completa</CardTitle>
            <CardDescription>Ya existe un administrador configurado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              El sistema ya tiene administradores configurados. Por favor, inicia sesión.
            </p>
            <Button onClick={() => router.push("/admin/login")} className="w-full">
              Ir al Login
            </Button>
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
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 text-purple-600">
                <Sparkles className="h-8 w-8" />
                <span className="text-2xl font-bold">STARDUST</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Configuración Inicial</CardTitle>
            <CardDescription>Crea el primer administrador del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center space-y-4">
                <div className="text-green-600 bg-green-50 p-4 rounded-md">
                  <p className="font-semibold">Administrador creado exitosamente</p>
                  <p className="text-sm mt-2">Redirigiendo al login...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSetup}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Nombre Completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Juan Pérez"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
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
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
                  </div>
                  {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creando administrador..." : "Crear Administrador"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Esta página solo se puede usar una vez para crear el primer administrador
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
