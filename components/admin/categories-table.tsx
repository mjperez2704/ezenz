"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Search, Tag } from "lucide-react"
import { CategoryDialog } from "./category-dialog"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface CategoriesTableProps {
  categories: Category[]
}

export function CategoriesTable({ categories: initialCategories }: CategoriesTableProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) return

    const response = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      setCategories(categories.filter((c) => c.id !== id))
      toast.success("Categoría eliminada exitosamente")
    } else {
      toast.error("Error al eliminar la categoría")
    }
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedCategory(null)
    setIsDialogOpen(true)
  }

  const handleSave = async (category: Category) => {
    if (selectedCategory) {
      setCategories(categories.map((c) => (c.id === category.id ? category : c)))
    } else {
      setCategories([...categories, category])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Categorías</p>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold mt-2">{categories.length}</p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Categorías Activas</p>
            <Tag className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2 text-green-500">{categories.filter((c) => c.is_active).length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar categorías..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No se encontraron categorías
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories
                .sort((a, b) => a.display_order - b.display_order)
                .map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                    <TableCell className="max-w-md truncate">{category.description || "-"}</TableCell>
                    <TableCell>{category.display_order}</TableCell>
                    <TableCell>
                      <Badge variant={category.is_active ? "default" : "secondary"}>
                        {category.is_active ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(category)} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)} title="Eliminar">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      <CategoryDialog
        category={selectedCategory}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </div>
  )
}
