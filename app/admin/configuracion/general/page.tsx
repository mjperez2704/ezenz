"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { db, type SiteSettings } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings["general"] | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const allSettings = await db.getSettings()
    if (allSettings) {
      setSettings(allSettings.general)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!settings) return

    const success = await db.updateSettings("general", settings)

    if (success) {
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han guardado correctamente",
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
        <h1 className="text-3xl font-bold">Configuración General</h1>
        <p className="text-muted-foreground">Configura la información básica de tu tienda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Sitio</CardTitle>
          <CardDescription>Actualiza los datos generales de tu ecommerce</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nombre del Sitio</Label>
              <Input
                id="siteName"
                value={settings?.siteName || ""}
                onChange={(e) => setSettings({ ...settings!, siteName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Descripción</Label>
              <Textarea
                id="siteDescription"
                value={settings?.siteDescription || ""}
                onChange={(e) => setSettings({ ...settings!, siteDescription: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de Contacto</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings?.contactEmail || ""}
                onChange={(e) => setSettings({ ...settings!, contactEmail: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Teléfono de Contacto</Label>
              <Input
                id="contactPhone"
                value={settings?.contactPhone || ""}
                onChange={(e) => setSettings({ ...settings!, contactPhone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">URL del Logo</Label>
              <Input
                id="logo"
                value={settings?.logo || ""}
                onChange={(e) => setSettings({ ...settings!, logo: e.target.value })}
              />
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mobileRedirect">Sitio Web Móvil</Label>
                  <p className="text-sm text-muted-foreground">
                    Cuando está activado, los usuarios en dispositivos móviles serán redirigidos automáticamente a la
                    versión móvil del sitio (/mobile). Cuando está desactivado, verán la versión de escritorio
                    optimizada para móvil.
                  </p>
                </div>
                <Switch
                  id="mobileRedirect"
                  checked={settings?.mobileRedirectEnabled ?? false}
                  onCheckedChange={(checked) => setSettings({ ...settings!, mobileRedirectEnabled: checked })}
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
