"use client"

import type React from "react"
import { db, type Banner } from "@/lib/database"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    link_url: "",
    button_text: "Ver más",
    position: "home-hero" as Banner["position"],
    order: 1,
    active: true,
    start_date: "",
    end_date: "",
  })

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    try {
      const data = await db.getAllBanners()
      setBanners(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los banners",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingBanner) {
        await db.updateBanner(editingBanner.id, formData)
        toast({ title: "Banner actualizado exitosamente" })
      } else {
        await db.createBanner(formData)
        toast({ title: "Banner creado exitosamente" })
      }

      setDialogOpen(false)
      resetForm()
      loadBanners()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el banner",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      description: banner.description,
      image_url: banner.image_url,
      link_url: banner.link_url,
      button_text: banner.button_text,
      position: banner.position,
      order: banner.order,
      active: banner.active,
      start_date: banner.start_date || "",
      end_date: banner.end_date || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este banner?")) return

    try {
      await db.deleteBanner(id)
      toast({ title: "Banner eliminado exitosamente" })
      loadBanners()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el banner",
        variant: "destructive",
      })
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await db.updateBanner(id, { active })
      toast({ title: `Banner ${active ? "activado" : "desactivado"}` })
      loadBanners()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      link_url: "",
      button_text: "Ver más",
      position: "home-hero",
      order: 1,
      active: true,
      start_date: "",
      end_date: "",
    })
    setEditingBanner(null)
  }

  const getPositionLabel = (position: Banner["position"]) => {
    const labels = {
      "home-hero": "Hero Principal",
      "home-secondary": "Secundario Home",
      "products-top": "Top Productos",
      checkout: "Checkout",
    }
    return labels[position]
  }

  const bannersByPosition = banners.reduce(
    (acc, banner) => {
      if (!acc[banner.position]) acc[banner.position] = []
      acc[banner.position].push(banner)
      return acc
    },
    {} as Record<Banner["position"], Banner[]>,
  )

  if (loading) {
    return <div className="p-8">Cargando...</div>
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banners y Anuncios</h1>
          <p className="text-muted-foreground">Gestiona los banners promocionales del sitio</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingBanner ? "Editar Banner" : "Nuevo Banner"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="image_url">URL de Imagen</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link_url">URL de Enlace</Label>
                  <Input
                    id="link_url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="/productos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="button_text">Texto del Botón</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Posición</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        position: value as Banner["position"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home-hero">Hero Principal</SelectItem>
                      <SelectItem value="home-secondary">Secundario Home</SelectItem>
                      <SelectItem value="products-top">Top Productos</SelectItem>
                      <SelectItem value="checkout">Checkout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Orden</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Fecha de Inicio</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">Fecha de Fin</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">Banner Activo</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingBanner ? "Actualizar" : "Crear"} Banner</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {Object.entries(bannersByPosition).map(([position, positionBanners]) => (
          <Card key={position}>
            <CardHeader>
              <CardTitle>{getPositionLabel(position as Banner["position"])}</CardTitle>
              <CardDescription>{positionBanners.length} banner(s) configurado(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {positionBanners.map((banner) => (
                  <div key={banner.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {banner.image_url ? (
                        <img
                          src={banner.image_url || "/placeholder.svg"}
                          alt={banner.title}
                          className="w-32 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-32 h-20 bg-muted rounded flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{banner.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{banner.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">Orden {banner.order}</Badge>
                        {banner.start_date && (
                          <Badge variant="secondary">Desde {new Date(banner.start_date).toLocaleDateString()}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={banner.active} onCheckedChange={(checked) => toggleActive(banner.id, checked)} />
                      <Button variant="outline" size="sm" onClick={() => handleEdit(banner)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(banner.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
