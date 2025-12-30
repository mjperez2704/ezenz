"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function EditarPerfilPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        setEmail(user.email || "")

        const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (profile) {
          setFullName(profile.full_name || "")
          setPhone(profile.phone || "")
        }
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("No user found")

      const { error } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido guardada exitosamente",
      })

      router.push("/cuenta")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el perfil",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[rgb(15,15,35)]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Loader2 className="h-12 w-12 text-[rgb(170,151,196)] animate-spin" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[rgb(15,15,35)]">
      <Navbar />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/cuenta"
            className="inline-flex items-center text-[rgb(170,151,196)] hover:text-[rgb(201,18,64)] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mi Cuenta
          </Link>

          <Card className="bg-white/5 border-[rgb(74,34,86)]">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Editar Perfil</CardTitle>
              <CardDescription className="text-white/60">Actualiza tu información personal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-white/5 border-white/20 text-white/50"
                  />
                  <p className="text-xs text-white/40">El correo no se puede cambiar</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white/90">
                    Nombre completo
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[rgb(170,151,196)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/90">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+52 442-145-7866"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[rgb(170,151,196)]"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-[rgb(170,151,196)] to-[rgb(201,18,64)] hover:opacity-90 text-white"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                  <Link href="/cuenta">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/5 bg-transparent"
                    >
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
