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

interface Tax {
  id: string
  name: string
  description: string | null
  rate: number
  is_active: boolean
  country: string
}

interface TaxDialogProps {
  tax: Tax | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (tax: Tax) => void
}

export function TaxDialog({ tax, open, onOpenChange, onSave }: TaxDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rate: 0,
    is_active: true,
    country: "MX",
  })

  useEffect(() => {
    if (tax) {
      setFormData({
        name: tax.name,
        description: tax.description || "",
        rate: tax.rate * 100, // Convertir a porcentaje para mostrar
        is_active: tax.is_active,
        country: tax.country,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        rate: 0,
        is_active: true,
        country: "MX",
      })
    }
  }, [tax])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.rate < 0 || formData.rate > 100) {
      toast.error("La tasa debe estar entre 0% y 100%")
      return
    }

    const endpoint = tax ? `/api/admin/taxes/${tax.id}` : "/api/admin/taxes"
    const method = tax ? "PUT" : "POST"

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        rate: formData.rate / 100, // Convertir de porcentaje a decimal
      }),
    })

    if (response.ok) {
      const savedTax = await response.json()
      onSave(savedTax)
      toast.success(tax ? "Impuesto actualizado" : "Impuesto creado")
    } else {
      toast.error("Error al guardar el impuesto")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-condor text-2xl">{tax ? "EDITAR IMPUESTO" : "NUEVO IMPUESTO"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Impuesto</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: IVA 16%"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del impuesto"
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rate">Tasa (%)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: Number.parseFloat(e.target.value) })}
                placeholder="Ej: 16.00"
                required
              />
              <p className="text-xs text-white/60">Ingresa el porcentaje (Ej: 16 para 16%)</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="MX"
                maxLength={2}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Impuesto Activo</Label>
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
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600">
              {tax ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
