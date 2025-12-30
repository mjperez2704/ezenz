"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Smartphone, Bell, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/database"

export default function MobileAppConfigPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [pushConfig, setPushConfig] = useState({
    firebase_server_key: "",
    firebase_sender_id: "",
    vapid_public_key: "",
    enable_order_notifications: true,
    enable_promo_notifications: true,
    enable_stock_alerts: true,
  })

  const [smsConfig, setSmsConfig] = useState({
    provider: "twilio",
    twilio_account_sid: "",
    twilio_auth_token: "",
    twilio_phone_number: "",
    enable_order_sms: true,
    enable_shipping_sms: true,
    enable_delivery_sms: true,
  })

  const [appConfig, setAppConfig] = useState({
    app_name: "STARDUST",
    app_version: "1.0.0",
    force_update_version: "1.0.0",
    maintenance_mode: false,
    maintenance_message: "",
    enable_biometric_auth: true,
    enable_dark_mode: true,
    api_timeout: 30,
  })

  const handleSavePushConfig = async () => {
    setLoading(true)
    try {
      await db.updateSettings("push_notifications", pushConfig)
      toast({ title: "Configuración de notificaciones push guardada" })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSmsConfig = async () => {
    setLoading(true)
    try {
      await db.updateSettings("sms_notifications", smsConfig)
      toast({ title: "Configuración de SMS guardada" })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAppConfig = async () => {
    setLoading(true)
    try {
      await db.updateSettings("mobile_app", appConfig)
      toast({ title: "Configuración de app móvil guardada" })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración App Móvil</h1>
        <p className="text-muted-foreground">Configura notificaciones push, SMS y ajustes de la aplicación móvil</p>
      </div>

      <Tabs defaultValue="push" className="space-y-4">
        <TabsList>
          <TabsTrigger value="push">
            <Bell className="mr-2 h-4 w-4" />
            Notificaciones Push
          </TabsTrigger>
          <TabsTrigger value="sms">
            <MessageSquare className="mr-2 h-4 w-4" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="app">
            <Smartphone className="mr-2 h-4 w-4" />
            App General
          </TabsTrigger>
        </TabsList>

        <TabsContent value="push">
          <Card>
            <CardHeader>
              <CardTitle>Configuración Firebase Cloud Messaging</CardTitle>
              <CardDescription>Configura las credenciales para enviar notificaciones push</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firebase_server_key">Firebase Server Key</Label>
                <Input
                  id="firebase_server_key"
                  type="password"
                  value={pushConfig.firebase_server_key}
                  onChange={(e) =>
                    setPushConfig({
                      ...pushConfig,
                      firebase_server_key: e.target.value,
                    })
                  }
                  placeholder="AAAA..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firebase_sender_id">Firebase Sender ID</Label>
                <Input
                  id="firebase_sender_id"
                  value={pushConfig.firebase_sender_id}
                  onChange={(e) =>
                    setPushConfig({
                      ...pushConfig,
                      firebase_sender_id: e.target.value,
                    })
                  }
                  placeholder="123456789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vapid_public_key">VAPID Public Key (Web Push)</Label>
                <Input
                  id="vapid_public_key"
                  value={pushConfig.vapid_public_key}
                  onChange={(e) =>
                    setPushConfig({
                      ...pushConfig,
                      vapid_public_key: e.target.value,
                    })
                  }
                  placeholder="BG..."
                />
              </div>

              <div className="pt-4 space-y-4">
                <h3 className="font-semibold">Tipos de Notificaciones</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones de Pedidos</Label>
                    <p className="text-sm text-muted-foreground">Confirmación, actualización de estado y entrega</p>
                  </div>
                  <Switch
                    checked={pushConfig.enable_order_notifications}
                    onCheckedChange={(checked) =>
                      setPushConfig({
                        ...pushConfig,
                        enable_order_notifications: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones Promocionales</Label>
                    <p className="text-sm text-muted-foreground">Ofertas, descuentos y novedades</p>
                  </div>
                  <Switch
                    checked={pushConfig.enable_promo_notifications}
                    onCheckedChange={(checked) =>
                      setPushConfig({
                        ...pushConfig,
                        enable_promo_notifications: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de Stock</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar cuando productos vuelvan a estar disponibles
                    </p>
                  </div>
                  <Switch
                    checked={pushConfig.enable_stock_alerts}
                    onCheckedChange={(checked) =>
                      setPushConfig({
                        ...pushConfig,
                        enable_stock_alerts: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSavePushConfig} disabled={loading}>
                Guardar Configuración Push
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>Configuración SMS - Twilio</CardTitle>
              <CardDescription>Configura Twilio para enviar notificaciones por SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twilio_account_sid">Twilio Account SID</Label>
                <Input
                  id="twilio_account_sid"
                  value={smsConfig.twilio_account_sid}
                  onChange={(e) =>
                    setSmsConfig({
                      ...smsConfig,
                      twilio_account_sid: e.target.value,
                    })
                  }
                  placeholder="AC..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilio_auth_token">Twilio Auth Token</Label>
                <Input
                  id="twilio_auth_token"
                  type="password"
                  value={smsConfig.twilio_auth_token}
                  onChange={(e) =>
                    setSmsConfig({
                      ...smsConfig,
                      twilio_auth_token: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilio_phone_number">Número de Teléfono Twilio</Label>
                <Input
                  id="twilio_phone_number"
                  value={smsConfig.twilio_phone_number}
                  onChange={(e) =>
                    setSmsConfig({
                      ...smsConfig,
                      twilio_phone_number: e.target.value,
                    })
                  }
                  placeholder="+1234567890"
                />
              </div>

              <div className="pt-4 space-y-4">
                <h3 className="font-semibold">Notificaciones SMS</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS de Confirmación de Pedido</Label>
                    <p className="text-sm text-muted-foreground">Enviar SMS cuando se realice un pedido</p>
                  </div>
                  <Switch
                    checked={smsConfig.enable_order_sms}
                    onCheckedChange={(checked) => setSmsConfig({ ...smsConfig, enable_order_sms: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS de Envío</Label>
                    <p className="text-sm text-muted-foreground">Notificar cuando el pedido esté en camino</p>
                  </div>
                  <Switch
                    checked={smsConfig.enable_shipping_sms}
                    onCheckedChange={(checked) => setSmsConfig({ ...smsConfig, enable_shipping_sms: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS de Entrega</Label>
                    <p className="text-sm text-muted-foreground">Confirmar cuando el pedido haya sido entregado</p>
                  </div>
                  <Switch
                    checked={smsConfig.enable_delivery_sms}
                    onCheckedChange={(checked) => setSmsConfig({ ...smsConfig, enable_delivery_sms: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSmsConfig} disabled={loading}>
                Guardar Configuración SMS
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="app">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la App</CardTitle>
                <CardDescription>Configuración general de la aplicación móvil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="app_name">Nombre de la App</Label>
                    <Input
                      id="app_name"
                      value={appConfig.app_name}
                      onChange={(e) => setAppConfig({ ...appConfig, app_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app_version">Versión Actual</Label>
                    <Input
                      id="app_version"
                      value={appConfig.app_version}
                      onChange={(e) => setAppConfig({ ...appConfig, app_version: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="force_update_version">Versión Mínima Requerida</Label>
                    <Input
                      id="force_update_version"
                      value={appConfig.force_update_version}
                      onChange={(e) =>
                        setAppConfig({
                          ...appConfig,
                          force_update_version: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api_timeout">Timeout API (segundos)</Label>
                    <Input
                      id="api_timeout"
                      type="number"
                      value={appConfig.api_timeout}
                      onChange={(e) =>
                        setAppConfig({
                          ...appConfig,
                          api_timeout: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modo Mantenimiento</CardTitle>
                <CardDescription>Desactiva temporalmente la app para mantenimiento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Activar Modo Mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">Los usuarios verán una pantalla de mantenimiento</p>
                  </div>
                  <Switch
                    checked={appConfig.maintenance_mode}
                    onCheckedChange={(checked) => setAppConfig({ ...appConfig, maintenance_mode: checked })}
                  />
                </div>
                {appConfig.maintenance_mode && (
                  <div className="space-y-2">
                    <Label htmlFor="maintenance_message">Mensaje de Mantenimiento</Label>
                    <Textarea
                      id="maintenance_message"
                      value={appConfig.maintenance_message}
                      onChange={(e) =>
                        setAppConfig({
                          ...appConfig,
                          maintenance_message: e.target.value,
                        })
                      }
                      placeholder="Estamos mejorando la app. Volvemos pronto."
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Características de la App</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticación Biométrica</Label>
                    <p className="text-sm text-muted-foreground">Face ID / Touch ID / Huella digital</p>
                  </div>
                  <Switch
                    checked={appConfig.enable_biometric_auth}
                    onCheckedChange={(checked) =>
                      setAppConfig({
                        ...appConfig,
                        enable_biometric_auth: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Oscuro</Label>
                    <p className="text-sm text-muted-foreground">Permitir cambio de tema claro/oscuro</p>
                  </div>
                  <Switch
                    checked={appConfig.enable_dark_mode}
                    onCheckedChange={(checked) => setAppConfig({ ...appConfig, enable_dark_mode: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSaveAppConfig} disabled={loading}>
              Guardar Configuración de la App
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
