"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/database"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Package, Plus, Minus, RotateCcw } from 'lucide-react'

interface StockDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (productId: string, newStock: number) => void
}

export function StockDialog({ product, open, onOpenChange, onUpdate }: StockDialogProps) {
  const [operation, setOperation] = useState<"set" | "add" | "subtract">("set")
  const [quantity, setQuantity] = useState(0)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (product) {
      setQuantity(0)
      setNotes("")
      setOperation("set")
    }
  }, [product])

  const calculateNewStock = () => {
    if (!product) return 0
    
    switch (operation) {
      case "set":
        return quantity
      case "add":
        return product.stock + quantity
      case "subtract":
        return Math.max(0, product.stock - quantity)
      default:
        return product.stock
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!product) return

    const newStock = calculateNewStock()

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        stock: newStock,
        // Opcional: guardar notas de movimiento de inventario
        last_stock_update: new Date().toISOString(),
        stock_notes: notes || undefined
      }),
    })

    if (response.ok) {
      onUpdate(product.id, newStock)
      toast.success(`Stock actualizado a ${newStock} unidades`)
      onOpenChange(false)
    } else {
      toast.error("Error al actualizar el stock")
    }
  }

  const newStock = calculateNewStock()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Gestionar Stock: {product?.name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Stock actual</p>
              <p className="text-2xl font-bold">{product?.stock || 0} unidades</p>
            </div>

            <div className="grid gap-3">
              <Label>Tipo de operación</Label>
              <RadioGroup value={operation} onValueChange={(v) => setOperation(v as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="set" id="set" />
                  <Label htmlFor="set" className="flex items-center gap-2 cursor-pointer">
                    <RotateCcw className="h-4 w-4" />
                    Establecer cantidad exacta
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="add" id="add" />
                  <Label htmlFor="add" className="flex items-center gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Agregar unidades (entrada)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="subtract" id="subtract" />
                  <Label htmlFor="subtract" className="flex items-center gap-2 cursor-pointer">
                    <Minus className="h-4 w-4" />
                    Restar unidades (salida)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">
                {operation === "set" ? "Cantidad" : "Unidades"}
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Ej: Recepción de proveedor, ajuste de inventario, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="rounded-lg bg-primary/10 p-4">
              <p className="text-sm font-medium">Nuevo stock</p>
              <p className="text-2xl font-bold text-primary">{newStock} unidades</p>
              <p className="text-xs text-muted-foreground mt-1">
                {operation === "add" && `+${quantity} unidades`}
                {operation === "subtract" && `-${quantity} unidades`}
                {operation === "set" && "Cantidad exacta"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Actualizar Stock</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
