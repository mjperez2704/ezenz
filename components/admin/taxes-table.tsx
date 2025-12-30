"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"
import { TaxDialog } from "./tax-dialog"
import { toast } from "sonner"

interface Tax {
  id: string
  name: string
  description: string | null
  rate: number
  is_active: boolean
  country: string
  created_at: string
  updated_at: string
}

interface TaxesTableProps {
  initialTaxes: Tax[]
}

export function TaxesTable({ initialTaxes }: TaxesTableProps) {
  const [taxes, setTaxes] = useState<Tax[]>(initialTaxes)
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleCreate = () => {
    setSelectedTax(null)
    setDialogOpen(true)
  }

  const handleEdit = (tax: Tax) => {
    setSelectedTax(tax)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este impuesto?")) return

    const response = await fetch(`/api/admin/taxes/${id}`, { method: "DELETE" })

    if (response.ok) {
      setTaxes(taxes.filter((t) => t.id !== id))
      toast.success("Impuesto eliminado")
    } else {
      const error = await response.json()
      toast.error(error.error || "Error al eliminar impuesto")
    }
  }

  const handleSave = (tax: Tax) => {
    if (selectedTax) {
      setTaxes(taxes.map((t) => (t.id === tax.id ? tax : t)))
    } else {
      setTaxes([...taxes, tax])
    }
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Total: {taxes.length} impuestos</p>
        <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Impuesto
        </Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Tasa</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taxes.map((tax) => (
              <TableRow key={tax.id}>
                <TableCell className="font-medium">{tax.name}</TableCell>
                <TableCell className="text-muted-foreground">{tax.description || "-"}</TableCell>
                <TableCell>{(tax.rate * 100).toFixed(2)}%</TableCell>
                <TableCell className="text-muted-foreground">{tax.country}</TableCell>
                <TableCell>
                  <Badge variant={tax.is_active ? "default" : "secondary"}>
                    {tax.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(tax)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(tax.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TaxDialog tax={selectedTax} open={dialogOpen} onOpenChange={setDialogOpen} onSave={handleSave} />
    </div>
  )
}
