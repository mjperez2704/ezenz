"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Product } from "@/lib/database"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductImageUpload } from "./product-image-upload"

interface ProductDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (product: Product) => void
}

export function ProductDialog({ product, open, onOpenChange, onSave }: ProductDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    category: "",
    description: "",
    long_description: "",
    price: 0,
    stock: 0,
    image: "",
    benefits: [],
    tax_id: undefined,
    display_order: 0,
  })
  const [categories, setCategories] = useState<Array<{ name: string; slug: string }>>([])
  const [taxes, setTaxes] = useState<Array<{ id: string; name: string; rate: number }>>([])

  useEffect(() => {
    async function fetchData() {
      const catResponse = await fetch("/api/admin/categories")
      if (catResponse.ok) {
        const data = await catResponse.json()
        setCategories(data)
      }

      const taxResponse = await fetch("/api/admin/taxes")
      if (taxResponse.ok) {
        const taxData = await taxResponse.json()
        setTaxes(taxData.filter((t: any) => t.is_active))
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        name: "",
        category: "",
        description: "",
        long_description: "",
        price: 0,
        stock: 0,
        image: "",
        benefits: [],
        tax_id: undefined,
        display_order: 0,
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] ProductDialog handleSubmit - Iniciando guardado")
    console.log("[v0] Product exists?", !!product)
    console.log("[v0] Form data:", JSON.stringify(formData, null, 2))

    const endpoint = product ? `/api/admin/products/${product.id}` : "/api/admin/products"
    const method = product ? "PUT" : "POST"

    console.log("[v0] Endpoint:", endpoint)
    console.log("[v0] Method:", method)

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response ok:", response.ok)

    if (response.ok) {
      const savedProduct = await response.json()
      console.log("[v0] Product saved successfully:", savedProduct)
      onSave(savedProduct)
      onOpenChange(false) // Cerrar el modal después de guardar exitosamente
      toast.success(product ? "Producto actualizado" : "Producto creado")
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.error("[v0] Error saving product:", errorData)
      toast.error("Error al guardar el producto")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tax_id">Impuesto Aplicable</Label>
              <Select
                value={formData.tax_id || ""}
                onValueChange={(value) => setFormData({ ...formData, tax_id: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un impuesto" />
                </SelectTrigger>
                <SelectContent>
                  {taxes.map((tax) => (
                    <SelectItem key={tax.id} value={tax.id}>
                      {tax.name} ({(tax.rate * 100).toFixed(2)}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Este impuesto se aplicará al precio del producto en el checkout
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción Corta</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="long_description">Descripción Completa</Label>
              <Textarea
                id="long_description"
                value={formData.long_description || ""}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                rows={4}
                placeholder="Descripción detallada que aparecerá en el modal 'Ver Más'"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio (MXN)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="display_order">Orden de Visualización</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order || 0}
                onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Números más bajos aparecen primero. Los productos se ordenan por este campo en el sitio público.
              </p>
            </div>

            <ProductImageUpload
              value={formData.image || ""}
              onChange={(url) => setFormData({ ...formData, image: url })}
              productId={product?.id}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{product ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
