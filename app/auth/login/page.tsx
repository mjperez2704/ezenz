"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Sparkles, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push("/cuenta")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(15,15,35)] via-[rgb(35,15,55)] to-[rgb(15,15,35)] flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[rgb(170,151,196)]/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[rgb(201,18,64)]/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/" className="relative w-48 h-12 group">
            <Image
              src="/images/design-mode/logo.png"
              alt="STARDUST"
              fill
              className="object-contain group-hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border-[rgb(170,151,196)]/30 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-[rgb(170,151,196)] to-[rgb(201,18,64)] rounded-full">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">Bienvenido de vuelta</CardTitle>
            <CardDescription className="text-white/70">
              Ingresa a tu cuenta para continuar tu viaje cósmico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[rgb(170,151,196)] focus:ring-[rgb(170,151,196)]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white/90">
                    Contraseña
                  </Label>
                  <Link
                    href="/auth/recuperar"
                    className="text-xs text-[rgb(170,151,196)] hover:text-[rgb(201,18,64)] transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[rgb(170,151,196)] focus:ring-[rgb(170,151,196)]"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:from-[rgb(190,171,216)] hover:to-[rgb(221,38,84)] text-white font-semibold py-6 rounded-lg shadow-lg shadow-[rgb(170,151,196)]/30 transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-white/70">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/auth/registro"
                  className="text-[rgb(170,151,196)] hover:text-[rgb(201,18,64)] font-semibold transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-white/50">
                Al continuar, aceptas nuestros{" "}
                <Link
                  href="/terminos-servicio"
                  className="text-[rgb(170,151,196)] hover:text-white underline transition-colors"
                >
                  Términos de Servicio
                </Link>{" "}
                y{" "}
                <Link
                  href="/aviso-privacidad"
                  className="text-[rgb(170,151,196)] hover:text-white underline transition-colors"
                >
                  Política de Privacidad
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-white/50 hover:text-white/80 transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
