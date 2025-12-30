"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Save, Eye, EyeOff, AlertCircle, Key } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface StripeConfig {
  id: string
  active_environment: "test" | "production"
  test_publishable_key: string
  test_secret_key: string
  test_webhook_secret: string
  production_publishable_key: string
  production_secret_key: string
  production_webhook_secret: string
  currency: string
  force_test_purchase: boolean
}

export default function PaymentSettingsPage() {
  const [config, setConfig] = useState<StripeConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const [inputKeys, setInputKeys] = useState({
    test_publishable_key: "",
    test_secret_key: "",
    test_webhook_secret: "",
    production_publishable_key: "",
    production_secret_key: "",
    production_webhook_secret: "",
  })

  // Estados para mostrar/ocultar claves
  const [showTestSecret, setShowTestSecret] = useState(false)
  const [showTestWebhook, setShowTestWebhook] = useState(false)
  const [showProdSecret, setShowProdSecret] = useState(false)
  const [showProdWebhook, setShowProdWebhook] = useState(false)

  // Estados para verificación de claves
  const [verifying, setVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const loadConfig = async () => {
    try {
      const response = await fetch("/api/admin/stripe-config")
      if (response.ok) {
        const data = await response.json()
        setConfig({
          id: data.id || "",
          active_environment: data.active_environment || "test",
          test_publishable_key: data.test_publishable_key || "",
          test_secret_key: data.test_secret_key || "",
          test_webhook_secret: data.test_webhook_secret || "",
          production_publishable_key: data.production_publishable_key || "",
          production_secret_key: data.production_secret_key || "",
          production_webhook_secret: data.production_webhook_secret || "",
          currency: data.currency || "mxn",
          force_test_purchase: data.force_test_purchase || false,
        })
        // NO pre-llenar los inputs con claves enmascaradas
        // Dejar los inputs vacíos para que el usuario ingrese claves reales
      }
    } catch (error) {
      console.error("Error cargando configuración:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración de pagos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [])

  const handleSave = async () => {
    if (!config) return

    setSaving(true)
    try {
      const updateData: any = {
        id: config.id, // Incluir el ID para que el backend pueda actualizar el registro correcto
        active_environment: config.active_environment,
        currency: config.currency,
        force_test_purchase: config.force_test_purchase,
      }

      // Solo actualizar claves si el usuario ingresó nuevas
      if (inputKeys.test_publishable_key) updateData.test_publishable_key = inputKeys.test_publishable_key
      if (inputKeys.test_secret_key) updateData.test_secret_key = inputKeys.test_secret_key
      if (inputKeys.test_webhook_secret) updateData.test_webhook_secret = inputKeys.test_webhook_secret
      if (inputKeys.production_publishable_key)
        updateData.production_publishable_key = inputKeys.production_publishable_key
      if (inputKeys.production_secret_key) updateData.production_secret_key = inputKeys.production_secret_key
      if (inputKeys.production_webhook_secret)
        updateData.production_webhook_secret = inputKeys.production_webhook_secret

      const response = await fetch("/api/admin/stripe-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        toast({
          title: "Configuración guardada",
          description: "Los cambios se han guardado correctamente",
        })
        // Recargar configuración y limpiar inputs
        await loadConfig()
        setInputKeys({
          test_publishable_key: "",
          test_secret_key: "",
          test_webhook_secret: "",
          production_publishable_key: "",
          production_secret_key: "",
          production_webhook_secret: "",
        })
      } else {
        throw new Error("Error al guardar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const verifyStripeKeys = async () => {
    if (!config) return

    const environment = config.active_environment
    const publishable_key =
      environment === "test" ? inputKeys.test_publishable_key : inputKeys.production_publishable_key
    const secret_key = environment === "test" ? inputKeys.test_secret_key : inputKeys.production_secret_key

    if (!secret_key || !publishable_key) {
      toast({
        title: "Claves requeridas",
        description: "Debes ingresar las claves de Stripe antes de verificarlas",
        variant: "destructive",
      })
      return
    }

    // Validar que NO sean claves enmascaradas
    if (secret_key.includes("*") || publishable_key.includes("*")) {
      toast({
        title: "Claves enmascaradas detectadas",
        description:
          "Por favor ingresa las claves reales de Stripe, no las claves enmascaradas. Ve a tu dashboard de Stripe para obtener las claves completas.",
        variant: "destructive",
      })
      return
    }

    setVerifying(true)
    setVerificationResult(null)

    try {
      const response = await fetch("/api/admin/stripe-config/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publishable_key,
          secret_key,
          environment,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setVerificationResult({
          success: true,
          message: data.message || "Las claves son válidas y funcionan correctamente",
        })
        toast({
          title: "Verificación exitosa",
          description: "Las claves de Stripe son válidas",
        })
      } else {
        setVerificationResult({
          success: false,
          message: data.error || "Error al verificar las claves",
        })
        toast({
          title: "Error al verificar claves",
          description: data.error || "Las claves no son válidas",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error al verificar claves Stripe:", error)
      setVerificationResult({
        success: false,
        message: "Error de conexión al verificar las claves",
      })
      toast({
        title: "Error",
        description: "No se pudo conectar con Stripe",
        variant: "destructive",
      })
    } finally {
      setVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No se pudo cargar la configuración</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Configuración de Pagos</h1>
        <p className="text-muted-foreground mt-2">Configura Stripe para procesar pagos en tu tienda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stripe</CardTitle>
          <CardDescription>Configura tu integración con Stripe para procesar pagos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ambiente */}
          <div className="space-y-2">
            <Label>Ambiente</Label>
            <Select
              value={config.active_environment}
              onValueChange={(value: "test" | "production") => setConfig({ ...config, active_environment: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test">Pruebas (Test)</SelectItem>
                <SelectItem value="production">Producción</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Cambia entre modo de pruebas y producción</p>
          </div>

          {/* Modo de Prueba Forzada */}
          {config.active_environment === "test" && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="force_test_purchase"
                  checked={config.force_test_purchase}
                  onChange={(e) => setConfig({ ...config, force_test_purchase: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="force_test_purchase" className="font-semibold">
                  Forzar Compra de Prueba
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Cuando está activo, todas las compras se completan automáticamente sin procesar pagos reales en Stripe.
                Útil para desarrollo y testing.
              </p>
              {config.force_test_purchase && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <p className="text-sm text-amber-800">
                    <strong>Advertencia:</strong> Este modo es solo para desarrollo. Las compras no se procesan
                    realmente.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Claves de Test */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Claves de Prueba (Test)</h3>

            {config.test_secret_key && config.test_secret_key.includes("*") && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <Key className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Hay claves de prueba guardadas. Para actualizarlas, ingresa las nuevas claves completas a
                  continuación.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label>Clave Publicable (Test)</Label>
                <Input
                  placeholder="pk_test_..."
                  value={inputKeys.test_publishable_key}
                  onChange={(e) => setInputKeys({ ...inputKeys, test_publishable_key: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {config.test_publishable_key && config.test_publishable_key.includes("*")
                    ? "Clave guardada (enmascarada). Ingresa una nueva para actualizar."
                    : "Ingresa tu clave publicable de Stripe en modo test"}
                </p>
              </div>

              <div>
                <Label>Clave Secreta (Test)</Label>
                <div className="relative">
                  <Input
                    type={showTestSecret ? "text" : "password"}
                    placeholder="sk_test_..."
                    value={inputKeys.test_secret_key}
                    onChange={(e) => setInputKeys({ ...inputKeys, test_secret_key: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowTestSecret(!showTestSecret)}
                  >
                    {showTestSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {config.test_secret_key && config.test_secret_key.includes("*")
                    ? "Clave guardada (enmascarada). Ingresa una nueva para actualizar."
                    : "Ingresa tu clave secreta de Stripe en modo test"}
                </p>
              </div>

              <div>
                <Label>Webhook Secret (Test)</Label>
                <div className="relative">
                  <Input
                    type={showTestWebhook ? "text" : "password"}
                    placeholder="whsec_..."
                    value={inputKeys.test_webhook_secret}
                    onChange={(e) => setInputKeys({ ...inputKeys, test_webhook_secret: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowTestWebhook(!showTestWebhook)}
                  >
                    {showTestWebhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {config.test_webhook_secret && config.test_webhook_secret.includes("*")
                    ? "Webhook guardado (enmascarado). Ingresa uno nuevo para actualizar."
                    : "Ingresa tu webhook secret de Stripe en modo test"}
                </p>
              </div>
            </div>
          </div>

          {/* Claves de Producción */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Claves de Producción</h3>

            {config.production_secret_key && config.production_secret_key.includes("*") && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <Key className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Hay claves de producción guardadas. Para actualizarlas, ingresa las nuevas claves completas a
                  continuación.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label>Clave Publicable (Producción)</Label>
                <Input
                  placeholder="pk_live_..."
                  value={inputKeys.production_publishable_key}
                  onChange={(e) => setInputKeys({ ...inputKeys, production_publishable_key: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {config.production_publishable_key && config.production_publishable_key.includes("*")
                    ? "Clave guardada (enmascarada). Ingresa una nueva para actualizar."
                    : "Ingresa tu clave publicable de Stripe en modo producción"}
                </p>
              </div>

              <div>
                <Label>Clave Secreta (Producción)</Label>
                <div className="relative">
                  <Input
                    type={showProdSecret ? "text" : "password"}
                    placeholder="sk_live_..."
                    value={inputKeys.production_secret_key}
                    onChange={(e) => setInputKeys({ ...inputKeys, production_secret_key: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowProdSecret(!showProdSecret)}
                  >
                    {showProdSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {config.production_secret_key && config.production_secret_key.includes("*")
                    ? "Clave guardada (enmascarada). Ingresa una nueva para actualizar."
                    : "Ingresa tu clave secreta de Stripe en modo producción"}
                </p>
              </div>

              <div>
                <Label>Webhook Secret (Producción)</Label>
                <div className="relative">
                  <Input
                    type={showProdWebhook ? "text" : "password"}
                    placeholder="whsec_..."
                    value={inputKeys.production_webhook_secret}
                    onChange={(e) => setInputKeys({ ...inputKeys, production_webhook_secret: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowProdWebhook(!showProdWebhook)}
                  >
                    {showProdWebhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {config.production_webhook_secret && config.production_webhook_secret.includes("*")
                    ? "Webhook guardado (enmascarado). Ingresa uno nuevo para actualizar."
                    : "Ingresa tu webhook secret de Stripe en modo producción"}
                </p>
              </div>
            </div>
          </div>

          {/* Resultado de verificación */}
          {verificationResult && (
            <Alert
              className={
                verificationResult.success ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
              }
            >
              <AlertDescription
                className={verificationResult.success ? "text-green-400" : "text-red-400"}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {verificationResult.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Botón verificar */}
          <Button
            type="button"
            variant="outline"
            onClick={verifyStripeKeys}
            disabled={
              verifying ||
              (config.active_environment === "test" ? !inputKeys.test_secret_key : !inputKeys.production_secret_key)
            }
            className="w-full bg-transparent"
          >
            {verifying ? "Verificando..." : "🔍 Verificar Claves de Stripe"}
          </Button>
        </CardContent>
      </Card>

      {/* Botón guardar */}
      <div className="flex justify-end gap-4">
        <Button type="button" onClick={handleSave} disabled={saving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Guardando..." : "Guardar Configuración"}
        </Button>
      </div>
    </div>
  )
}
