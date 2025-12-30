"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface Category {
  id?: string
  name: string
  slug: string
  description: string | null
  display_order: number
  is_active: boolean
}

interface CategoryDialogProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (category: Category) => void
}

export function CategoryDialog({ category, open, onOpenChange, onSave }: CategoryDialogProps) {
  const [formData, setFormData] = useState<Category>({
    name: "",
    slug: "",
    description: null,
    display_order: 0,
    is_active: true,
  })

  useEffect(() => {
    if (category) {
      setFormData(category)
    } else {
      setFormData({
        name: "",
        slug: "",
        description: null,
        display_order: 0,
        is_active: true,
      })
    }
  }, [category])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const endpoint = category ? `/api/admin/categories/${category.id}` : "/api/admin/categories"
    const method = category ? "PUT" : "POST"

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      const savedCategory = await response.json()
      onSave(savedCategory)
      toast.success(category ? "Categoría actualizada" : "Categoría creada")
    } else {
      toast.error("Error al guardar la categoría")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{category ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value
                  setFormData({ ...formData, name, slug: generateSlug(name) })
                }}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">Se genera automáticamente del nombre</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="display_order">Orden de visualización</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Categoría activa</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{category ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
