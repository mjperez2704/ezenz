"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { db, type SiteSettings } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Save, Bell } from "lucide-react"

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings["notifications"] | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const allSettings = await db.getSettings()
    if (allSettings) {
      setSettings(allSettings.notifications)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!settings) return

    const success = await db.updateSettings("notifications", settings)

    if (success) {
      toast({
        title: "Configuración guardada",
        description: "La configuración de notificaciones se ha guardado",
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
        <h1 className="text-3xl font-bold">Notificaciones</h1>
        <p className="text-muted-foreground">Configura cómo y cuándo notificar a los clientes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Preferencias de Notificaciones
            </div>
          </CardTitle>
          <CardDescription>Activa o desactiva diferentes tipos de notificaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushEnabled">Notificaciones Push</Label>
                <p className="text-sm text-muted-foreground">Enviar notificaciones push a los dispositivos</p>
              </div>
              <Switch
                id="pushEnabled"
                checked={settings?.pushEnabled || false}
                onCheckedChange={(checked) => setSettings({ ...settings!, pushEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailOrderConfirmation">Confirmación de Pedido por Email</Label>
                <p className="text-sm text-muted-foreground">Enviar email al confirmar un pedido</p>
              </div>
              <Switch
                id="emailOrderConfirmation"
                checked={settings?.emailOrderConfirmation || false}
                onCheckedChange={(checked) => setSettings({ ...settings!, emailOrderConfirmation: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailShipping">Notificación de Envío por Email</Label>
                <p className="text-sm text-muted-foreground">Enviar email cuando el pedido sea enviado</p>
              </div>
              <Switch
                id="emailShipping"
                checked={settings?.emailShipping || false}
                onCheckedChange={(checked) => setSettings({ ...settings!, emailShipping: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsEnabled">Notificaciones por SMS</Label>
                <p className="text-sm text-muted-foreground">Enviar SMS para actualizaciones importantes</p>
              </div>
              <Switch
                id="smsEnabled"
                checked={settings?.smsEnabled || false}
                onCheckedChange={(checked) => setSettings({ ...settings!, smsEnabled: checked })}
              />
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
