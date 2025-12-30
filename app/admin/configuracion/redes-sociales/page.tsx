"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Save, Facebook, Instagram, Twitter, Pencil } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SocialLink {
  id: string
  platform: string
  label: string
  url: string
  is_active: boolean
  display_order: number
}

export default function SocialSettingsPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadSocialLinks()
  }, [])

  async function loadSocialLinks() {
    try {
      const response = await fetch("/api/admin/social-links")
      if (response.ok) {
        const data = await response.json()
        setSocialLinks(data)
      }
    } catch (error) {
      console.error("Error loading social links:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate(link: SocialLink) {
    try {
      const response = await fetch(`/api/admin/social-links/${link.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(link),
      })

      if (response.ok) {
        toast.success("Red social actualizada correctamente")
        setEditingId(null)
        loadSocialLinks()
      } else {
        toast.error("Error al actualizar la red social")
      }
    } catch (error) {
      toast.error("Error al actualizar la red social")
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-5 w-5" />
      case "instagram":
        return <Instagram className="h-5 w-5" />
      case "twitter":
        return <Twitter className="h-5 w-5" />
      default:
        return null
    }
  }

  if (loading) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Redes Sociales</h1>
        <p className="text-muted-foreground">
          Configura los enlaces de redes sociales que aparecerán en la sección de contacto
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enlaces de Redes Sociales</CardTitle>
          <CardDescription>Edita las URLs y textos que aparecerán en el sitio público</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plataforma</TableHead>
                <TableHead>Texto</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Orden</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {socialLinks.map((link) => {
                const isEditing = editingId === link.id
                return (
                  <TableRow key={link.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(link.platform)}
                        <span className="capitalize">{link.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={link.label}
                          onChange={(e) =>
                            setSocialLinks(
                              socialLinks.map((l) => (l.id === link.id ? { ...l, label: e.target.value } : l)),
                            )
                          }
                        />
                      ) : (
                        link.label
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={link.url}
                          onChange={(e) =>
                            setSocialLinks(
                              socialLinks.map((l) => (l.id === link.id ? { ...l, url: e.target.value } : l)),
                            )
                          }
                          placeholder="https://..."
                        />
                      ) : (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline truncate max-w-xs block"
                        >
                          {link.url}
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={link.display_order}
                          onChange={(e) =>
                            setSocialLinks(
                              socialLinks.map((l) =>
                                l.id === link.id ? { ...l, display_order: Number.parseInt(e.target.value) } : l,
                              ),
                            )
                          }
                          className="w-20"
                        />
                      ) : (
                        link.display_order
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={link.is_active}
                        onCheckedChange={(checked) => {
                          const updatedLink = { ...link, is_active: checked }
                          setSocialLinks(socialLinks.map((l) => (l.id === link.id ? updatedLink : l)))
                          handleUpdate(updatedLink)
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => handleUpdate(link)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(null)
                              loadSocialLinks()
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(link.id)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
