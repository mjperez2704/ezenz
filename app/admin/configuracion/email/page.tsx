"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { db, type SiteSettings } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings["email"] | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const allSettings = await db.getSettings()
    if (allSettings) {
      setSettings(allSettings.email)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!settings) return

    const success = await db.updateSettings("email", settings)

    if (success) {
      toast({
        title: "Configuración guardada",
        description: "La configuración de email se ha guardado correctamente",
      })
    } else {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    }
  }

  if (loading) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configuración de Email</h1>
        <p className="text-muted-foreground">Configura el servidor SMTP para envío de correos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Servidor SMTP</CardTitle>
          <CardDescription>Configura los datos de tu servidor de correo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">Host SMTP</Label>
                <Input
                  id="smtpHost"
                  value={settings?.smtpHost || ""}
                  onChange={(e) => setSettings({ ...settings!, smtpHost: e.target.value })}
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPort">Puerto</Label>
                <Input
                  id="smtpPort"
                  value={settings?.smtpPort || ""}
                  onChange={(e) => setSettings({ ...settings!, smtpPort: e.target.value })}
                  placeholder="587"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpUser">Usuario SMTP</Label>
              <Input
                id="smtpUser"
                type="email"
                value={settings?.smtpUser || ""}
                onChange={(e) => setSettings({ ...settings!, smtpUser: e.target.value })}
                placeholder="tu-email@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpPassword">Contraseña SMTP</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={settings?.smtpPassword || ""}
                onChange={(e) => setSettings({ ...settings!, smtpPassword: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromEmail">Email de Remitente</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={settings?.fromEmail || ""}
                  onChange={(e) => setSettings({ ...settings!, fromEmail: e.target.value })}
                  placeholder="noreply@stardust.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromName">Nombre de Remitente</Label>
                <Input
                  id="fromName"
                  value={settings?.fromName || ""}
                  onChange={(e) => setSettings({ ...settings!, fromName: e.target.value })}
                  placeholder="STARDUST"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
