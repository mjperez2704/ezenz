"use client"

import { useState, useEffect } from "react"
import { db, type EditableContent } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Save, FileText, Mail, Database, AlertCircle } from "lucide-react"

export default function ContentManagementPage() {
  const [contents, setContents] = useState<EditableContent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadContents()
  }, [])

  async function loadContents() {
    console.log("[v0] ContentManagementPage: Cargando contenidos...")
    const data = await db.getAllEditableContent()
    console.log("[v0] ContentManagementPage: Contenidos cargados:", {
      total: data.length,
      keys: data.map((d) => d.key),
      data: data,
    })
    setContents(data)
    setLoading(false)
  }

  async function handleSave(key: string, content: string) {
    setSaving(true)
    const success = await db.updateEditableContent(key, content)

    if (success) {
      toast({
        title: "Contenido guardado",
        description: "Los cambios se han guardado correctamente",
      })
      await loadContents()
    } else {
      toast({
        title: "Error",
        description: "No se pudo guardar el contenido",
        variant: "destructive",
      })
    }
    setSaving(false)
  }

  const legalContents = contents.filter((c) =>
    ["terms_of_service", "privacy_policy", "shipping_policy", "return_policy"].includes(c.key),
  )

  const emailTemplates = contents.filter((c) =>
    ["email_welcome", "email_order_confirmation", "email_shipping_notification"].includes(c.key),
  )

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-muted-foreground">Cargando contenido...</p>
        </div>
      </div>
    )
  }

  if (contents.length === 0) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Gestión de Contenido</h1>
          <p className="text-muted-foreground">Edita el contenido legal y los templates de emails de tu tienda</p>
        </div>

        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong className="block mb-2">No hay contenido disponible</strong>
            <p className="mb-4">
              Para empezar a gestionar tu contenido, necesitas ejecutar el script SQL de inicialización.
            </p>
            <div className="bg-white dark:bg-slate-900 p-4 rounded border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Pasos para configurar:
              </p>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>
                  Ve a la sección de <strong>Scripts</strong> en el panel lateral
                </li>
                <li>
                  Busca y ejecuta el script:{" "}
                  <code className="bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded">
                    017_insert_default_content.sql
                  </code>
                </li>
                <li>Recarga esta página después de ejecutar el script</li>
              </ol>
            </div>
            <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
              Recargar página
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestión de Contenido</h1>
        <p className="text-muted-foreground">Edita el contenido legal y los templates de emails de tu tienda</p>
      </div>

      <Tabs defaultValue="legal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="legal" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Páginas Legales
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Templates de Email
          </TabsTrigger>
        </TabsList>

        <TabsContent value="legal" className="space-y-6">
          {legalContents.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No hay páginas legales configuradas. Ejecuta el script SQL 017_insert_default_content.sql para crear el
                contenido inicial.
              </AlertDescription>
            </Alert>
          ) : (
            legalContents.map((content) => (
              <Card key={content.key}>
                <CardHeader>
                  <CardTitle>{content.title}</CardTitle>
                  <CardDescription>
                    {content.key === "terms_of_service" && "Términos y condiciones del servicio"}
                    {content.key === "privacy_policy" && "Aviso de privacidad y protección de datos"}
                    {content.key === "shipping_policy" && "Políticas y condiciones de envío"}
                    {content.key === "return_policy" && "Políticas de devolución y reembolso"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={content.key}>Contenido (HTML permitido)</Label>
                    <Textarea
                      id={content.key}
                      value={content.content}
                      onChange={(e) => {
                        const updated = contents.map((c) =>
                          c.key === content.key ? { ...c, content: e.target.value } : c,
                        )
                        setContents(updated)
                      }}
                      rows={15}
                      className="font-mono text-sm"
                      placeholder="Ingresa el contenido aquí..."
                    />
                  </div>
                  <Button onClick={() => handleSave(content.key, content.content)} disabled={saving} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Guardar {content.title}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="emails" className="space-y-6">
          <Card className="mb-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Variables disponibles:</strong>
                <br />
                <code className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">
                  {"{{customerName}}"}, {"{{orderId}}"}, {"{{orderTotal}}"}, {"{{orderItems}}"},{"{{siteUrl}}"}
                </code>
              </p>
            </CardContent>
          </Card>

          {emailTemplates.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No hay templates de email configurados. Ejecuta el script SQL 017_insert_default_content.sql para crear
                los templates iniciales.
              </AlertDescription>
            </Alert>
          ) : (
            emailTemplates.map((content) => (
              <Card key={content.key}>
                <CardHeader>
                  <CardTitle>{content.title}</CardTitle>
                  <CardDescription>
                    {content.key === "email_welcome" && "Email enviado al registrarse un nuevo usuario"}
                    {content.key === "email_order_confirmation" && "Email enviado al confirmar un pedido"}
                    {content.key === "email_shipping_notification" && "Email enviado al enviar un pedido"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={content.key}>Template HTML</Label>
                    <Textarea
                      id={content.key}
                      value={content.content}
                      onChange={(e) => {
                        const updated = contents.map((c) =>
                          c.key === content.key ? { ...c, content: e.target.value } : c,
                        )
                        setContents(updated)
                      }}
                      rows={20}
                      className="font-mono text-sm"
                      placeholder="<html>...</html>"
                    />
                  </div>
                  <Button onClick={() => handleSave(content.key, content.content)} disabled={saving} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Template
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
